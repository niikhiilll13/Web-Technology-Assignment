// Mongoose schema and model for a to-do task.
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  // Task text. Required.
  title: { type: String, required: true },
  // Completion flag. Defaults to false for new tasks.
  completed: { type: Boolean, default: false },
  // Creation timestamp. Defaults to the current time.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
