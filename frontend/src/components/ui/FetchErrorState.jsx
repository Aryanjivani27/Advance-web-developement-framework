// ─── FetchErrorState – full-area error with a Retry button ────────────────────

/**
 * Props:
 *   message  – error message string
 *   onRetry  – callback triggered by the Retry button
 */
export default function FetchErrorState({ message, onRetry }) {
  return (
    <div className="fetch-error-state">
      <div className="fetch-error-icon">⚠️</div>
      <h3>Failed to load tasks</h3>
      <p>
        {message ||
          'Could not connect to the server. Check your connection and try again.'}
      </p>
      <button className="btn btn-primary" onClick={onRetry} id="retry-fetch-btn">
        🔄 Retry
      </button>
    </div>
  );
}
