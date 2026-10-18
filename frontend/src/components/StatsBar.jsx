// ─── StatsBar – 4-card summary row at the top of the task list ────────────────

/**
 * Props:
 *   tasks – full task array (optimistic tasks are excluded from counts)
 */
export default function StatsBar({ tasks }) {
  const realTasks = tasks.filter((t) => !t._optimistic);
  const total     = realTasks.length;
  const completed = realTasks.filter((t) => t.status === 'completed').length;
  const inProgress = realTasks.filter((t) => t.status === 'in-progress').length;
  const high      = realTasks.filter((t) => t.priority === 'high').length;

  const stats = [
    { icon: '📋', value: total,      label: 'Total Tasks' },
    { icon: '✅', value: completed,  label: 'Completed'   },
    { icon: '🔄', value: inProgress, label: 'In Progress' },
    { icon: '🔺', value: high,       label: 'High Priority' },
  ];

  return (
    <div className="stats-grid">
      {stats.map(({ icon, value, label }) => (
        <div className="stat-card" key={label}>
          <span className="stat-icon">{icon}</span>
          <div className="stat-info">
            <div className="value">{value}</div>
            <div className="label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
