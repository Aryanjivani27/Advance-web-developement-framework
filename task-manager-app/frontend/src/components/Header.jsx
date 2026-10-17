export default function Header({ connected, taskCount }) {
  return (
    <header className="app-header">
      <div className="app-header__title">
        <div className="app-header__logo">✓</div>
        <div className="app-header__title-text">
          <span className="app-header__prompt">~/task-manager</span>
          <h1>Task Manager</h1>
        </div>
      </div>
      <div className="app-header__meta">
        <span className="task-count">{taskCount} task{taskCount === 1 ? "" : "s"}</span>
        <span className={`status-pill ${connected ? "status-pill--up" : "status-pill--down"}`}>
          <span className="status-pill__dot" />
          {connected ? "API connected" : "API offline"}
        </span>
      </div>
    </header>
  );
}
