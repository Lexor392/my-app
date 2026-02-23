export default function Sidebar({
  menuItems,
  activePage,
  onNavigate,
  appVersion,
  liveUsersCount,
  isOpen = false,
  onClose = () => {}
}) {
  const handleNavigate = (pageKey) => {
    onNavigate(pageKey);
    onClose();
  };

  return (
    <>
      <button
        type="button"
        className={`sidebar-backdrop ${isOpen ? 'show' : ''}`}
        onClick={onClose}
        aria-label="Закрити меню"
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-main">
          <div className="brand">
            <div className="brand-icon">TF</div>
            <div>
              <strong>TaskFlow</strong>
              <div className="small text-body-secondary">Productivity OS</div>
            </div>
          </div>

          <nav className="menu-list">
            {menuItems.map((item) => (
              <button
                type="button"
                key={item.key}
                className={`menu-item ${activePage === item.key ? 'active' : ''}`}
                onClick={() => handleNavigate(item.key)}
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer-meta">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="small text-body-secondary">Онлайн</div>
            <div className="fw-semibold">{liveUsersCount}</div>
          </div>
          <div className="small text-body-secondary">Версія</div>
          <div className="fw-semibold">{appVersion}</div>
        </div>
      </aside>
    </>
  );
}
