// ─── Alert – inline banner for form-level errors ──────────────────────────────

/**
 * Props:
 *   type     – 'error' | 'success'
 *   message  – string to display (renders nothing when falsy)
 *   onClose  – callback to dismiss
 */
export default function Alert({ type, message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon">{type === 'error' ? '⚠️' : '✅'}</span>
      <span>{message}</span>
      <button className="alert-close" onClick={onClose} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
