// ─── LoadingState – full-area spinner shown while tasks are fetching ───────────

export default function LoadingState() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" role="status" aria-label="Loading tasks" />
      <p>Fetching tasks from database…</p>
    </div>
  );
}
