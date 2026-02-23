function histogramWidth(value, max) {
  if (!max || max <= 0) {
    return 0;
  }
  return Math.max(4, Math.round((value / max) * 100));
}

export default function AdminAnalyticsSection({ analytics }) {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Користувачів</div>
            <div className="admin-stat-value">{analytics.totalUsers}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Заблокованих</div>
            <div className="admin-stat-value">{analytics.bannedUsers}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">З позначками</div>
            <div className="admin-stat-value">{analytics.flaggedUsersCount}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Власників</div>
            <div className="admin-stat-value">{analytics.adminsCount}</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="mb-3">Реєстрації за останні 7 днів</h6>
              <div className="admin-histogram">
                {(() => {
                  const max = Math.max(1, ...analytics.registrationsHistogram.map((entry) => entry.value));
                  return analytics.registrationsHistogram.map((entry) => (
                    <div className="admin-histogram-row" key={entry.label}>
                      <span className="admin-histogram-label">{entry.label}</span>
                      <div className="admin-histogram-track">
                        <div
                          className="admin-histogram-bar bar-registrations"
                          style={{ width: `${histogramWidth(entry.value, max)}%` }}
                        />
                      </div>
                      <span className="admin-histogram-value">{entry.value}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column gap-3">
              <div className="admin-mini-card">
                <div className="small text-body-secondary">Усього завдань</div>
                <div className="fw-semibold">{analytics.totalTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">Виконано</div>
                <div className="fw-semibold">{analytics.doneTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">У процесі</div>
                <div className="fw-semibold">{analytics.progressTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">До виконання</div>
                <div className="fw-semibold">{analytics.todoTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">Товарів / категорій</div>
                <div className="fw-semibold">{analytics.productsCount} / {analytics.categoriesCount}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">Онлайн зараз</div>
                <div className="fw-semibold">{analytics.onlineUsers}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="mb-3">Розподіл ролей</h6>
              <div className="d-flex flex-column gap-2">
                {analytics.roleDistribution.map((role) => (
                  <div className="admin-role-row" key={role.id}>
                    <span>{role.label}</span>
                    <span className="badge text-bg-light">{role.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="mb-3">Топ користувачів за балансом</h6>
              {analytics.topUsers.length === 0 ? (
                <p className="text-body-secondary mb-0">Дані відсутні.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {analytics.topUsers.map((user, index) => (
                    <div className="admin-top-user" key={user.id}>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge text-bg-primary">#{index + 1}</span>
                        <strong>{user.name}</strong>
                      </div>
                      <div className="small text-body-secondary">{user.points} балів</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
