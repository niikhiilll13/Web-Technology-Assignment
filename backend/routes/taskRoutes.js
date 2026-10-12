// REST API routes for tasks, mounted at /api/tasks in server.js.
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// Returns true only for a canonical 24-character hex MongoDB ObjectId string.
const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id) && mongoose.Types.ObjectId.isValid(id);

// Converts a value to a trimmed string (String() then trim()).
const cleanTitle = (value) => String(value).trim();

// Shared handler for unexpected server/database errors.
const serverError = (res, err) => {
  console.error(err.message);
  return res.status(500).json({ error: "Server error. Please try again." });
};

/**
 * GET /api/tasks
 * Fetch all tasks, newest first.
 */
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    serverError(res, err);
  }
});

/**
 * POST /api/tasks
 * Body: { "title": "Buy milk" }
 * Creates a task. Responds 201 with the new task, or 400 for an empty title.
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    // A missing title becomes "" (not the text "undefined") so it is rejected.
    const title = body.title === undefined || body.title === null ? "" : cleanTitle(body.title);
    if (!title) {
      return res.status(400).json({ error: "Title is required and cannot be empty." });
    }
    const task = await Task.create({ title }); // completed defaults to false
    res.status(201).json(task);
  } catch (err) {
    serverError(res, err);
  }
});

/**
 * PUT /api/tasks/:id
 * Body (any of): { "title": "New text", "completed": true }
 * Edits the title and/or the completed flag. 400 for bad input, 404 if not found.
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid task id." });
    }

    const body = req.body || {};
    const updates = {};

    if (body.title !== undefined) {
      const title = body.title === null ? "" : cleanTitle(body.title);
      if (!title) {
        return res.status(400).json({ error: "Title cannot be empty." });
      }
      updates.title = title;
    }

    if (body.completed !== undefined) {
      // Reject anything that is not a real boolean instead of silently coercing it.
      if (typeof body.completed !== "boolean") {
        return res.status(400).json({ error: "completed must be true or false." });
      }
      updates.completed = body.completed;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Provide a title or completed value to update." });
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json(task);
  } catch (err) {
    serverError(res, err);
  }
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task. 404 if it does not exist.
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid task id." });
    }
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json({ message: "Task deleted successfully.", id });
  } catch (err) {
    serverError(res, err);
  }
});

module.exports = router;
