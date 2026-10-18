import { useEffect } from 'react';

// ─── ConfirmDialog – modal confirmation before destructive actions ─────────────

/**
 * Props:
 *   isOpen       – boolean, controls visibility
 *   title        – dialog heading text
 *   message      – body paragraph (optional)
 *   onConfirm    – callback when user clicks the confirm button
 *   onCancel     – callback when user cancels (button / overlay / Escape)
 *   confirmLabel – label for the confirm button (default: 'Delete')
 *   danger       – boolean, renders a red confirm button when true (default: true)
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  danger = true,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Stop clicks inside the card from closing the overlay */}
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-icon">{danger ? '🗑️' : '❓'}</div>
        <h3 className="dialog-title" id="dialog-title">{title}</h3>
        {message && <p className="dialog-message">{message}</p>}
        <div className="dialog-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            id="dialog-cancel-btn"
          >
            Cancel
          </button>
          <button
            className={`btn ${danger ? 'btn-danger-solid' : 'btn-primary'}`}
            onClick={onConfirm}
            id="dialog-confirm-btn"
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
