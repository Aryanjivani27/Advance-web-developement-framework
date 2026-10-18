import { useState } from 'react';
import { taskApi } from '../api';
import Alert from './ui/Alert';

// ─── InlineEditForm – edit form rendered inside a TaskCard ────────────────────

/**
 * Props:
 *   task     – the task object being edited
 *   onSaved  – (updatedTask) => void
 *   onCancel – () => void
 */
export default function InlineEditForm({ task, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await taskApi.update(task._id, {
        ...form,
        dueDate: form.dueDate || null,
      });
      onSaved(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="inline-edit"
      onSubmit={handleSave}
      id={`edit-form-${task._id}`}
    >
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          name="title"
          type="text"
          className="form-control"
          value={form.title}
          onChange={handleChange}
          maxLength={100}
          required
          id={`edit-title-${task._id}`}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={form.description}
          onChange={handleChange}
          maxLength={500}
          rows={2}
          id={`edit-desc-${task._id}`}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
            id={`edit-status-${task._id}`}
          >
            <option value="pending">⏳ Pending</option>
            <option value="in-progress">🔄 In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            className="form-control"
            value={form.priority}
            onChange={handleChange}
            id={`edit-priority-${task._id}`}
          >
            <option value="low">🔽 Low</option>
            <option value="medium">➡️ Medium</option>
            <option value="high">🔺 High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Due Date</label>
        <input
          name="dueDate"
          type="date"
          className="form-control"
          value={form.dueDate}
          onChange={handleChange}
          id={`edit-due-${task._id}`}
        />
      </div>

      <div className="btn-group">
        <button
          type="submit"
          className="btn btn-success btn-sm"
          disabled={loading}
          id={`save-btn-${task._id}`}
        >
          {loading ? <><span className="spinner" />Saving…</> : '💾 Save'}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onCancel}
          id={`cancel-btn-${task._id}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
