import { useEffect, useRef, useState } from 'react';

export default function Topbar({
  pageTitle,
  user,
  themeMode,
  onToggleSidebar = () => {},
  onThemeChange,
  onOpenPurchase,
  onOpenCart,
  onOpenProfile,
  onOpenSettingsAccount,
  onLogout
}) {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!accountMenuRef.current) {
        return;
      }

      if (!accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleToggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
  };

  const handleOpenProfile = () => {
    setAccountMenuOpen(false);
    onOpenProfile();
  };

  const handleOpenSettings = () => {
    setAccountMenuOpen(false);
    onOpenSettingsAccount();
  };

  const handleLogout = () => {
    setAccountMenuOpen(false);
    onLogout();
  };

  return (
    <header className="topbar">
      <div className="topbar-title-wrap">
        <button
          type="button"
          className="icon-btn sidebar-burger"
          onClick={onToggleSidebar}
          title="Меню"
          aria-label="Відкрити меню"
        >
          <i className="bi bi-list" />
        </button>
        <div className="topbar-title-text">
          <h4 className="mb-0">{pageTitle}</h4>
          <small className="text-body-secondary">Вітаємо, {user.name}</small>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="theme-switcher">
          <i className="bi bi-circle-half" />
          <select value={themeMode} onChange={(event) => onThemeChange(event.target.value)}>
            <option value="system">Системна</option>
            <option value="light">Світла</option>
            <option value="dark">Темна</option>
          </select>
        </div>

        <div className="points-chip">
          <i className="bi bi-coin" />
          <strong>{user.points}</strong>
          <button type="button" className="btn btn-sm btn-light" onClick={onOpenPurchase}>
            <i className="bi bi-plus-lg" />
          </button>
        </div>

        <button type="button" className="icon-btn" onClick={onOpenCart} title="Кошик">
          <i className="bi bi-cart3" />
          {user.cart.length > 0 && <span className="icon-counter">{user.cart.length}</span>}
        </button>

        <div className="account-menu-anchor" ref={accountMenuRef}>
          <button
            type="button"
            className="icon-btn account-trigger"
            onClick={handleToggleAccountMenu}
            title="Акаунт"
            aria-expanded={isAccountMenuOpen}
          >
            {user.avatar ? <img className="avatar-mini" src={user.avatar} alt="avatar" /> : <i className="bi bi-person-circle" />}
          </button>

          {isAccountMenuOpen && (
            <div className="account-hover-menu shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="account-hover-avatar">
                  {user.avatar ? <img src={user.avatar} alt={user.name} /> : <i className="bi bi-person-circle" />}
                </div>
                <div>
                  <div className="fw-semibold">{user.name}</div>
                  <div className="small text-body-secondary">{user.email}</div>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleOpenSettings}>
                  <i className="bi bi-sliders me-1" />
                  Редагувати
                </button>
                <button type="button" className="btn btn-sm btn-primary" onClick={handleOpenProfile}>
                  <i className="bi bi-person-badge me-1" />
                  Профіль
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1" />
                  Вийти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
