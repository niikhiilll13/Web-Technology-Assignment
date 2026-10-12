import { useState } from "react";

// Form for adding a new task. onAdd(title) must return a Promise that resolves
// to true when the task was created (so the input can be cleared).
function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return; // prevent duplicate submissions

    // Client-side check: reject empty or whitespace-only titles.
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const ok = await onAdd(title.trim());
      if (ok) setTitle("");
      else setError("Could not add the task. See the message above.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-task" className="visually-hidden">New task title</label>
      <input
        id="new-task"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "new-task-error" : undefined}
        disabled={submitting}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Task"}
      </button>
      {error && (
        <p id="new-task-error" className="field-error" role="alert">{error}</p>
      )}
    </form>
  );
}

export default TaskForm;
