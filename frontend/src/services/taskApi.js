// Centralised API calls. Every function talks to the Express backend with fetch().

// Base URL already ends in /api, e.g. http://localhost:5000/api
// Trailing slashes are stripped so paths below never produce "//" or a doubled "/api".
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

// Sends a request and returns parsed JSON, or throws an Error with a readable message.
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // fetch only rejects on network failure (server down, CORS blocked, etc.)
    throw new Error("Cannot reach the server. Make sure the backend is running.");
  }

  // Error responses from the backend look like { "error": "message" }.
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body; fall through to the generic message below.
  }

  if (!response.ok) {
    throw new Error((data && data.error) || `Request failed (status ${response.status}).`);
  }
  return data;
}

// GET /api/tasks
export const getTasks = () => request("/tasks");

// POST /api/tasks
export const createTask = (title) =>
  request("/tasks", { method: "POST", body: JSON.stringify({ title }) });

// PUT /api/tasks/:id (partial update: { title } and/or { completed })
export const updateTask = (id, updates) =>
  request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(updates) });

// DELETE /api/tasks/:id
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
