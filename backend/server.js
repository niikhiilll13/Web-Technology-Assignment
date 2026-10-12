// Entry point: configures Express, connects to MongoDB, then starts listening.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS is restricted to the frontend origin only (never "*").
app.use(cors({ origin: FRONTEND_URL }));

// Parse JSON request bodies.
app.use(express.json());

// Health check for confirming the server is up.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Task CRUD routes.
app.use("/api/tasks", taskRoutes);

// Unknown API routes.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Malformed JSON bodies and other middleware errors.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body." });
  }
  console.error(err.message);
  res.status(500).json({ error: "Server error. Please try again." });
});

// Do not accept requests until the database is connected.
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

module.exports = app;
