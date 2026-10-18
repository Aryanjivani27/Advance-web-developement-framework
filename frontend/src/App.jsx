import { useState, useEffect, useCallback } from 'react';
import { taskApi } from './api';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useToast } from './hooks/useToast';

// ── Components ───────────────────────────────────────────────────────────────

import ToastContainer  from './components/ToastContainer';
import ConfirmDialog   from './components/ConfirmDialog';
import TaskForm        from './components/TaskForm';
import TaskCard        from './components/TaskCard';
import StatsBar        from './components/StatsBar';
import FilterBar       from './components/FilterBar';
import LoadingState    from './components/ui/LoadingState';
import EmptyState      from './components/ui/EmptyState';
import FetchErrorState from './components/ui/FetchErrorState';

// ─── App Root ─────────────────────────────────────────────────────────────────
// Responsible for:
//   • Auth gate (login / register via AuthPage)
//   • Global state (tasks, loading, filter, dialog)
//   • Data fetching & CRUD handlers
//   • Wiring components together via props
// ──────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Task state ────────────────────────────────────────────────────────────
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [filter, setFilter]         = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, task: null });

  const { toasts, addToast, dismiss } = useToast();

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await taskApi.getAll();
      setTasks(res.data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Optimistic create ─────────────────────────────────────────────────────
  const handleOptimisticCreate = (optimisticTask) =>
    setTasks((prev) => [optimisticTask, ...prev]);

  const handleCreated = (tempId, realTask) => {
    setTasks((prev) => prev.map((t) => (t._id === tempId ? realTask : t)));
    addToast('Task created successfully! 🎉', 'success');
  };

  const handleCreateFailed = (tempId, errorMsg) => {
    setTasks((prev) => prev.filter((t) => t._id !== tempId));
    addToast(`Failed to create task: ${errorMsg}`, 'error');
  };

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdated = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    addToast('Task updated successfully!', 'success');
  };

  // ── Delete (confirm → execute) ────────────────────────────────────────────
  const handleDeleteRequest = (task) =>
    setConfirmDialog({ isOpen: true, task });

  const handleDeleteConfirm = async () => {
    const task = confirmDialog.task;
    setConfirmDialog({ isOpen: false, task: null });
    try {
      await taskApi.remove(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      addToast(`"${task.title}" deleted.`, 'success');
    } catch (err) {
      addToast(`Failed to delete: ${err.message}`, 'error');
    }
  };

  const handleDeleteCancel = () =>
    setConfirmDialog({ isOpen: false, task: null });

  // ── Derived data ──────────────────────────────────────────────────────────
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all')    return true;
    if (filter === 'high')   return t.priority === 'high';
    return t.status === filter;
  });

  const realTaskCount  = tasks.filter((t) => !t._optimistic).length;
  const completedCount = tasks.filter((t) => !t._optimistic && t.status === 'completed').length;


  // ── Render (authenticated) ────────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── Global overlays ── */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Task"
        message={
          confirmDialog.task
            ? `Are you sure you want to delete "${confirmDialog.task.title}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmLabel="🗑️ Delete"
        danger
      />

      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">✓</div>
            <span className="logo-text">TaskFlow</span>
          </div>
          <div className="header-stats">
            <span className="stat-badge"><span>{realTaskCount}</span> Tasks</span>
            <span className="stat-badge"><span>{completedCount}</span> Done</span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchTasks}
              disabled={loading}
              title="Refresh task list"
              id="refresh-btn"
            >
              {loading ? <span className="spinner" /> : '🔄'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">
        <div className="page-title">
          <h1>My Tasks</h1>
          <p>Manage your work — all data persisted in MongoDB.</p>
        </div>

        {!loading && <StatsBar tasks={tasks} />}

        <div className="layout">

          {/* Left – Create form */}
          <aside>
            <TaskForm
              onOptimisticCreate={handleOptimisticCreate}
              onCreated={handleCreated}
              onCreateFailed={handleCreateFailed}
            />
          </aside>

          {/* Right – Task list */}
          <section>
            <FilterBar active={filter} onChange={setFilter} />

            {loading ? (
              <LoadingState />
            ) : fetchError && tasks.length === 0 ? (
              <FetchErrorState message={fetchError} onRetry={fetchTasks} />
            ) : (
              <div className="task-list" role="list" aria-label="Task list">
                {filteredTasks.length === 0 ? (
                  <EmptyState filter={filter} />
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdated={handleUpdated}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))
                )}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
