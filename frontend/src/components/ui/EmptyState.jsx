// ─── EmptyState – shown when the filtered task list is empty ──────────────────

/**
 * Props:
 *   filter – currently active filter key ('all' | 'pending' | 'in-progress' | 'completed' | 'high')
 */
export default function EmptyState({ filter }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📋</div>
      <h3>{filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}</h3>
      <p>
        {filter === 'all'
          ? 'Create your first task using the form on the left.'
          : 'Try a different filter.'}
      </p>
    </div>
  );
}
