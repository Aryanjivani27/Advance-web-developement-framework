import { useState } from 'react';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  STATUS_BADGE,
  PRIORITY_BADGE,
  STATUS_ICONS,
  PRIORITY_ICONS,
  formatDate,
} from '../utils/taskHelpers';
import InlineEditForm from './InlineEditForm';

// ─── TaskCard – displays a single task with edit & delete actions ──────────────

/**
 * Props:
 *   task            – task object (may have _optimistic: true while saving)
 *   onUpdated       – (updatedTask) => void
 *   onDeleteRequest – (task) => void  — opens the ConfirmDialog in App
 */
export default function TaskCard({ task, onUpdated, onDeleteRequest }) {
  const [editing, setEditing] = useState(false);
  const isOptimistic = Boolean(task._optimistic);

  const handleSaved = (updated) => {
    onUpdated(updated);
    setEditing(false);
  };

  return (
    <article
      className={`task-card ${editing ? 'editing' : ''} ${isOptimistic ? 'optimistic' : ''}`}
      id={`task-${task._id}`}
    >
      <div className="task-card-header">
        <span className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
          {task.title}
          {isOptimistic && (
            <span className="optimistic-badge">Saving…</span>
          )}
        </span>

        <div className="task-actions">
          {/* Hide action buttons while the card is still optimistic */}
          {!isOptimistic && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditing((e) => !e)}
                title={editing ? 'Cancel edit' : 'Edit task'}
                id={`edit-btn-${task._id}`}
              >
                {editing ? '✕' : '✏️'}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDeleteRequest(task)}
                title="Delete task"
                id={`delete-btn-${task._id}`}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`badge ${STATUS_BADGE[task.status]}`}>
          {STATUS_ICONS[task.status]} {STATUS_LABELS[task.status]}
        </span>
        <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>
          {PRIORITY_ICONS[task.priority]} {PRIORITY_LABELS[task.priority]}
        </span>
        {task.dueDate && (
          <span className="badge badge-due">📅 {formatDate(task.dueDate)}</span>
        )}
      </div>

      {editing && (
        <InlineEditForm
          task={task}
          onSaved={handleSaved}
          onCancel={() => setEditing(false)}
        />
      )}
    </article>
  );
}
