import { useEffect, useMemo, useState } from 'react';

const SETTINGS_SECTIONS = [
  { id: 'account', label: 'Акаунт', icon: 'bi-person-badge' },
  { id: 'privacy', label: 'Конфіденційність', icon: 'bi-shield-lock' },
  { id: 'appearance', label: 'Оформлення', icon: 'bi-palette2' },
  { id: 'notifications', label: 'Сповіщення', icon: 'bi-bell' },
  { id: 'workspace', label: 'Робочий простір', icon: 'bi-grid-1x2' }
];

export default function SettingsPage({
  currentUser,
  profileDraft = { name: '', email: '', phone: '', avatar: '' },
  themeMode,
  effectiveTheme,
  onThemeChange,
  onToggleSetting,
  onProfileChange,
  onSaveProfile,
  onTogglePaymentLink,
  onLogout,
  onDeleteAccount,
  initialSection = 'appearance'
}) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [fullscreenImage, setFullscreenImage] = useState('');

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const completionRate = useMemo(() => {
    const total = currentUser.tasks.length;
    if (!total) {
      return 0;
    }
    const done = currentUser.tasks.filter((task) => task.status === 'done').length;
    return Math.round((done / total) * 100);
  }, [currentUser.tasks]);

  return (
    <div className="row g-4">
      <div className="col-lg-3">
        <div className="card shadow-sm h-100">
          <div className="card-body settings-nav">
            {SETTINGS_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <i className={`bi ${section.icon}`} />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="col-lg-9">
        {activeSection === 'account' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Налаштування акаунта</h5>
              <form className="row g-3" onSubmit={onSaveProfile}>
                <div className="col-md-4">
                  <label className="form-label">Фото профілю</label>
                  <div
                    className={`profile-photo-box small ${profileDraft.avatar ? 'clickable' : ''}`}
                    onClick={() => profileDraft.avatar && setFullscreenImage(profileDraft.avatar)}
                  >
                    {profileDraft.avatar ? (
                      <img src={profileDraft.avatar} alt={profileDraft.name || 'profile'} className="profile-photo-image" />
                    ) : (
                      <div className="profile-photo-fallback">
                        <i className="bi bi-person-circle" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Ім'я</label>
                      <input
                        className="form-control"
                        value={profileDraft.name}
                        onChange={(event) => onProfileChange('name', event.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Телефон</label>
                      <input
                        className="form-control"
                        value={profileDraft.phone}
                        onChange={(event) => onProfileChange('phone', event.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input className="form-control" value={profileDraft.email} disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Посилання на фото</label>
                      <input
                        className="form-control"
                        value={profileDraft.avatar}
                        onChange={(event) => onProfileChange('avatar', event.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="settings-actions">
                    <button className="btn btn-primary" type="submit">Зберегти дані</button>
                    <button className="btn btn-outline-primary" type="button" onClick={onTogglePaymentLink}>
                      {currentUser.paymentLinked ? 'Відв\'язати картку' : 'Прив\'язати картку'}
                    </button>
                    <button className="btn btn-outline-danger" type="button" onClick={onLogout}>
                      <i className="bi bi-box-arrow-right me-1" />
                      Вийти
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeSection === 'privacy' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Конфіденційність і безпека</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={currentUser.settings.publicStats}
                      onChange={() => onToggleSetting('publicStats')}
                    />
                    <span className="form-check-label">Показувати публічну статистику</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={currentUser.settings.showOnlineStatus}
                      onChange={() => onToggleSetting('showOnlineStatus')}
                    />
                    <span className="form-check-label">Показувати онлайн-статус</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={currentUser.settings.loginAlerts}
                      onChange={() => onToggleSetting('loginAlerts')}
                    />
                    <span className="form-check-label">Сповіщати про вхід в акаунт</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={currentUser.settings.twoFactorAuth}
                      onChange={() => onToggleSetting('twoFactorAuth')}
                    />
                    <span className="form-check-label">Увімкнути 2FA (демо)</span>
                  </label>
                </div>
                <div className="col-12">
                  <div className="settings-danger-zone">
                    <div>
                      <h6 className="mb-1">Видалення акаунта</h6>
                      <div className="small text-body-secondary">
                        Повністю видаляє ваш профіль з TaskFlow. Дію неможливо скасувати.
                      </div>
                    </div>
                    <button type="button" className="btn btn-outline-danger" onClick={onDeleteAccount}>
                      <i className="bi bi-trash3 me-1" />
                      Видалити акаунт
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Оформлення</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Тема інтерфейсу</label>
                  <select className="form-select" value={themeMode} onChange={(event) => onThemeChange(event.target.value)}>
                    <option value="system">Системна</option>
                    <option value="light">Світла</option>
                    <option value="dark">Темна</option>
                  </select>
                  <p className="text-body-secondary small mt-2 mb-0">
                    Зараз застосовано: <strong>{effectiveTheme === 'dark' ? 'Темна' : 'Світла'}</strong>
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch mt-4 pt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={currentUser.settings.compactMode}
                      onChange={() => onToggleSetting('compactMode')}
                    />
                    <span className="form-check-label">Компактний інтерфейс</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Сповіщення</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={currentUser.settings.reminders} onChange={() => onToggleSetting('reminders')} />
                    <span className="form-check-label">Нагадування про дедлайни</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={currentUser.settings.weeklyDigest} onChange={() => onToggleSetting('weeklyDigest')} />
                    <span className="form-check-label">Щотижневий звіт</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={currentUser.settings.pushAlerts} onChange={() => onToggleSetting('pushAlerts')} />
                    <span className="form-check-label">Push-сповіщення</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={currentUser.settings.marketingEmails} onChange={() => onToggleSetting('marketingEmails')} />
                    <span className="form-check-label">Маркетингові листи</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'workspace' && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Робочий простір</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={currentUser.settings.smartSort} onChange={() => onToggleSetting('smartSort')} />
                    <span className="form-check-label">Розумне сортування задач</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={currentUser.settings.autoArchiveDoneTasks} onChange={() => onToggleSetting('autoArchiveDoneTasks')} />
                    <span className="form-check-label">Автоархів виконаних задач</span>
                  </label>
                </div>
                <div className="col-md-6">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={currentUser.settings.focusMode} onChange={() => onToggleSetting('focusMode')} />
                    <span className="form-check-label">Фокус-режим</span>
                  </label>
                </div>
                <div className="col-md-6 d-flex align-items-center">
                  <div className="small text-body-secondary">
                    Поточна ефективність: <strong>{completionRate}%</strong> виконаних задач.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {fullscreenImage && (
        <div className="fullscreen-image-overlay" onClick={() => setFullscreenImage('')}>
          <img src={fullscreenImage} alt="fullscreen avatar" className="fullscreen-image" />
          <button
            type="button"
            className="btn btn-light fullscreen-close-btn"
            onClick={() => setFullscreenImage('')}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
