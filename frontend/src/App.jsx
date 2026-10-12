import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import { getTasks, createTask, updateTask, deleteTask } from "./services/taskApi.js";

// App owns the task state and coordinates every API action.
function App() {
  const [tasks, setTasks] = useState([]);       // tasks from MongoDB
  const [loading, setLoading] = useState(true); // true while the first fetch runs
  const [loadError, setLoadError] = useState(""); // error from fetching the list
  const [actionError, setActionError] = useState(""); // error from add/edit/toggle/delete

  // Fetch all tasks from GET /api/tasks.
  const loadTasks = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setTasks(await getTasks());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run once when the page loads.
  useEffect(() => {
    loadTasks();
  }, []);

  // Add: POST, then put the server's task at the top of the list.
  const handleAdd = async (title) => {
    setActionError("");
    try {
      const created = await createTask(title);
      setTasks((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    }
  };

  // Replace one task in state with the version the server returned.
  const replaceTask = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  // Complete / uncomplete: PUT { completed }, update state after the server confirms.
  const handleToggle = async (task) => {
    setActionError("");
    try {
      replaceTask(await updateTask(task._id, { completed: !task.completed }));
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Edit title: PUT { title }. Returns true on success so the row can leave edit mode.
  const handleSave = async (id, title) => {
    setActionError("");
    try {
      replaceTask(await updateTask(id, { title }));
      return true;
    } catch (err) {
      setActionError(err.message);
      return false;
    }
  };

  // Delete: DELETE, then remove from state after success.
  const handleDelete = async (id) => {
    setActionError("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setActionError(err.message);
    }
  };

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <main className="panel">
      <header>
        <h1>My Tasks</h1>
        <p className="subtitle">Keep your day organized.</p>
      </header>

      <TaskForm onAdd={handleAdd} />

      {actionError && <p className="banner error" role="alert">{actionError}</p>}

      {loading ? (
        <p className="status" role="status">Loading tasks...</p>
      ) : loadError ? (
        <div className="banner error" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={loadTasks}>Retry</button>
        </div>
      ) : (
        <>
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onSave={handleSave}
            onDelete={handleDelete}
          />
          {tasks.length > 0 && (
            <p className="counter">
              {remaining} of {tasks.length} {tasks.length === 1 ? "task" : "tasks"} remaining
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default App;
