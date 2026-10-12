// Database connection logic, kept separate from the route handlers.
const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the connection string in process.env.MONGO_URI.
 * Works with both MongoDB Atlas (mongodb+srv://...) and local MongoDB
 * (mongodb://127.0.0.1:27017/todo-app).
 * The returned promise rejects on failure so the caller can stop startup.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === "your_mongodb_connection_string") {
    throw new Error("MONGO_URI is not set. Copy .env.example to .env and add your connection string.");
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    // Log only the host, never the credentials in the URI.
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    // err.message can occasionally echo the URI, so print a generic message.
    throw new Error(`Could not connect to MongoDB (${err.name}). Check MONGO_URI, your network, and Atlas IP access list.`);
  }
}

module.exports = connectDB;
