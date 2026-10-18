import { useState } from 'react';
import { taskApi } from '../api';
import { EMPTY_FORM } from '../utils/taskHelpers';
import Alert from './ui/Alert';

// ─── TaskForm – "New Task" create form with optimistic UI ─────────────────────

/**
 * Props:
 *   onOptimisticCreate – (optimisticTask) => void  — add temp task to list immediately
 *   onCreated          – (tempId, realTask) => void — replace temp with server data
 *   onCreateFailed     – (tempId, errMsg) => void  — roll back temp task
 */
export default function TaskForm({ onOptimisticCreate, onCreated, onCreateFailed }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }

    // Build a temporary optimistic task shown instantly in the list
    const tempId = `optimistic-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      ...form,
      dueDate: form.dueDate || null,
      createdAt: new Date().toISOString(),
      _optimistic: true, // flag so TaskCard can render the "Saving…" badge
    };

    setLoading(true);
    setError('');

    // 1️⃣ Show task immediately and reset form for snappy UX
    onOptimisticCreate(optimisticTask);
    setForm(EMPTY_FORM);

    try {
      const res = await taskApi.create({ ...form, dueDate: form.dueDate || null });
      // 2️⃣ Replace temp entry with confirmed server data
      onCreated(tempId, res.data);
    } catch (err) {
      // 3️⃣ Roll back the optimistic entry on failure
      onCreateFailed(tempId, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <span className="icon">✨</span> New Task
      </h2>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form className="form" onSubmit={handleSubmit} id="create-task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-control"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Add more details…"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              className="form-control"
              value={form.status}
              onChange={handleChange}
            >
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-control"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">🔽 Low</option>
              <option value="medium">➡️ Medium</option>
              <option value="high">🔺 High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="form-control"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
          id="create-task-btn"
        >
          {loading ? <><span className="spinner" />Creating…</> : '+ Create Task'}
        </button>
      </form>
    </div>
  );
}
