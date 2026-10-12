import { useState } from "react";

// One task row: checkbox, title (or edit input), Edit and Delete actions.
// onToggle, onSave and onDelete return Promises; onSave resolves true on success.
function TaskItem({ task, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [editError, setEditError] = useState("");
  const [busy, setBusy] = useState(false); // disables buttons while a request is pending

  const startEdit = () => {
    setDraft(task.title);
    setEditError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditError("");
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!draft.trim()) {
      setEditError("Title cannot be empty.");
      return;
    }
    setBusy(true);
    const ok = await onSave(task._id, draft.trim());
    setBusy(false);
    if (ok) setEditing(false);
  };

  // Wraps toggle/delete so the row is locked while the request runs.
  const run = async (action) => {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <li className="task-item">
        <form className="edit-form" onSubmit={saveEdit} noValidate>
          <label htmlFor={`edit-${task._id}`} className="visually-hidden">Edit task title</label>
          <input
            id={`edit-${task._id}`}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Escape" && cancelEdit()}
            aria-invalid={editError ? "true" : "false"}
          />
          <button type="submit" disabled={busy}>Save</button>
          <button type="button" className="secondary" onClick={cancelEdit} disabled={busy}>Cancel</button>
          {editError && <p className="field-error" role="alert">{editError}</p>}
        </form>
      </li>
    );
  }

  return (
    <li className={`task-item${task.completed ? " completed" : ""}`}>
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.completed}
          disabled={busy}
          onChange={() => run(() => onToggle(task))}
        />
        <span className="task-title">{task.title}</span>
      </label>
      <div className="task-actions">
        <button type="button" className="secondary" onClick={startEdit} disabled={busy}
          aria-label={`Edit task: ${task.title}`}>Edit</button>
        <button type="button" className="danger" onClick={() => run(() => onDelete(task._id))} disabled={busy}
          aria-label={`Delete task: ${task.title}`}>Delete</button>
      </div>
    </li>
  );
}

export default TaskItem;
