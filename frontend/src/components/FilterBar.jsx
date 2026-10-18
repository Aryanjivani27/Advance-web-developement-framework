// ─── FilterBar – tab-style filter buttons for the task list ───────────────────

const FILTERS = [
  { key: 'all',         label: '📋 All' },
  { key: 'pending',     label: '⏳ Pending' },
  { key: 'in-progress', label: '🔄 In Progress' },
  { key: 'completed',   label: '✅ Completed' },
  { key: 'high',        label: '🔺 High Priority' },
];

/**
 * Props:
 *   active   – currently selected filter key
 *   onChange – (key: string) => void
 */
export default function FilterBar({ active, onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          className={`filter-btn ${active === key ? 'active' : ''}`}
          onClick={() => onChange(key)}
          id={`filter-${key}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
