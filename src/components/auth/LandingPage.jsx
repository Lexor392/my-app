export default function LandingPage({
  authMode,
  authError,
  authBusy,
  authForm,
  onAuthModeChange,
  onAuthFormChange,
  onLogin,
  onRegister,
  onGoogleSignIn
}) {
  return (
    <div className="landing-page">
      <div className="container py-5">
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-7">
            <div className="hero-card h-100">
              <span className="hero-badge">TaskFlow Productivity Platform</span>
              <h1>Розумний трекер задач з мотивацією балами та вбудованим магазином</h1>
              <p>
                Плануйте задачі як у Notion, Any.do і Trello, працюйте в інтерфейсі у стилі Asana,
                заробляйте бали та витрачайте їх у власному магазині.
              </p>
              <div className="hero-features">
                <div>
                  <i className="bi bi-kanban" />
                  Дошки та статуси задач
                </div>
                <div>
                  <i className="bi bi-coin" />
                  Бали за виконання задач
                </div>
                <div>
                  <i className="bi bi-shop" />
                  Вбудований магазин із кошиком
                </div>
                <div>
                  <i className="bi bi-moon-stars" />
                  Системна, світла й темна теми
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="auth-card">
              <div className="d-flex auth-tabs mb-4">
                <button
                  type="button"
                  className={`btn btn-sm ${authMode === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => onAuthModeChange('login')}
                  disabled={authBusy}
                >
                  Вхід
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${authMode === 'register' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => onAuthModeChange('register')}
                  disabled={authBusy}
                >
                  Реєстрація
                </button>
              </div>

              {authError && <div className="alert alert-danger py-2">{authError}</div>}

              {authMode === 'login' ? (
                <form className="d-flex flex-column gap-3" onSubmit={onLogin}>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={authForm.identifier}
                      onChange={(event) => onAuthFormChange('identifier', event.target.value)}
                      disabled={authBusy}
                    />
                  </div>
                  <div>
                    <label className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Введіть пароль"
                      value={authForm.password}
                      onChange={(event) => onAuthFormChange('password', event.target.value)}
                      disabled={authBusy}
                    />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={authBusy}>
                    {authBusy ? 'Виконується вхід...' : 'Увійти'}
                  </button>
                  <div className="auth-divider">або</div>
                  <button
                    className="btn btn-outline-theme"
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={authBusy}
                  >
                    <i className="bi bi-google me-2" />
                    Увійти через Google
                  </button>
                </form>
              ) : (
                <form className="d-flex flex-column gap-3" onSubmit={onRegister}>
                  <div>
                    <label className="form-label">Ім'я</label>
                    <input
                      className="form-control"
                      placeholder="Ваше ім'я"
                      value={authForm.name}
                      onChange={(event) => onAuthFormChange('name', event.target.value)}
                      disabled={authBusy}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={authForm.email}
                      onChange={(event) => onAuthFormChange('email', event.target.value)}
                      disabled={authBusy}
                    />
                  </div>
                  <div>
                    <label className="form-label">Номер телефону</label>
                    <input
                      className="form-control"
                      placeholder="+380991112233"
                      value={authForm.phone}
                      onChange={(event) => onAuthFormChange('phone', event.target.value)}
                      disabled={authBusy}
                    />
                  </div>
                  <div>
                    <label className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Не менше 6 символів"
                      value={authForm.password}
                      onChange={(event) => onAuthFormChange('password', event.target.value)}
                      disabled={authBusy}
                    />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={authBusy}>
                    {authBusy ? 'Створення акаунта...' : 'Створити акаунт'}
                  </button>
                  <div className="auth-divider">або</div>
                  <button
                    className="btn btn-outline-theme"
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={authBusy}
                  >
                    <i className="bi bi-google me-2" />
                    Реєстрація через Google
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
