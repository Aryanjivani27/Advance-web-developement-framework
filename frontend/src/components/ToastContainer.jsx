// ─── ToastContainer – renders the stack of active toast notifications ─────────

/**
 * Props:
 *   toasts    – array of toast objects from useToast()
 *   onDismiss – (id: number) => void
 */
export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type} ${t.exiting ? 'toast-exit' : ''}`}
          role="alert"
        >
          <span className="toast-icon">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="toast-message">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
