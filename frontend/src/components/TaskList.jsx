import TaskItem from "./TaskItem.jsx";

// Renders the list of tasks, or an empty-state message.
function TaskList({ tasks, onToggle, onSave, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks yet. Add your first task above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
