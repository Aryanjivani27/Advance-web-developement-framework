// ─── Shared Task Constants & Helpers ──────────────────────────────────────────

export const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_BADGE = {
  pending: 'badge-pending',
  'in-progress': 'badge-in-progress',
  completed: 'badge-completed',
};

export const PRIORITY_BADGE = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
};

export const STATUS_ICONS = {
  pending: '⏳',
  'in-progress': '🔄',
  completed: '✅',
};

export const PRIORITY_ICONS = {
  low: '🔽',
  medium: '➡️',
  high: '🔺',
};

export const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
