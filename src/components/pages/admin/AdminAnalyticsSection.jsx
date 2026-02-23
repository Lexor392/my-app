function histogramWidth(value, max) {
  if (!max || max <= 0) {
    return 0;
  }
  return Math.max(4, Math.round((value / max) * 100));
}

function formatEventTime(value) {
  const parsed = Date.parse(value || '');
  if (!Number.isFinite(parsed)) {
    return 'n/a';
  }

  return new Date(parsed).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function AdminAnalyticsSection({ analytics }) {
  return (
    <div className="d-flex flex-column gap-4">
      <div className="row g-3">
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Users</div>
            <div className="admin-stat-value">{analytics.totalUsers}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Banned</div>
            <div className="admin-stat-value">{analytics.bannedUsers}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Flagged</div>
            <div className="admin-stat-value">{analytics.flaggedUsersCount}</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Owners</div>
            <div className="admin-stat-value">{analytics.adminsCount}</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Online now</div>
            <div className="admin-stat-value">{analytics.onlineUsers}</div>
          </div>
        </div>
        <div className="col-md-4 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Logins (24h)</div>
            <div className="admin-stat-value">{analytics.logins24h}</div>
          </div>
        </div>
        <div className="col-md-4 col-6">
          <div className="admin-stat-card">
            <div className="small text-body-secondary">Logouts (24h)</div>
            <div className="admin-stat-value">{analytics.logouts24h}</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="mb-3">Registrations for last 7 days</h6>
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
                <div className="small text-body-secondary">All tasks</div>
                <div className="fw-semibold">{analytics.totalTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">Done</div>
                <div className="fw-semibold">{analytics.doneTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">In progress</div>
                <div className="fw-semibold">{analytics.progressTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">Todo</div>
                <div className="fw-semibold">{analytics.todoTasks}</div>
              </div>
              <div className="admin-mini-card">
                <div className="small text-body-secondary">Products / categories</div>
                <div className="fw-semibold">{analytics.productsCount} / {analytics.categoriesCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="mb-3">Roles distribution</h6>
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
              <h6 className="mb-3">Top users by balance</h6>
              {analytics.topUsers.length === 0 ? (
                <p className="text-body-secondary mb-0">No data.</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {analytics.topUsers.map((user, index) => (
                    <div className="admin-top-user" key={user.id}>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge text-bg-primary">#{index + 1}</span>
                        <strong>{user.name}</strong>
                      </div>
                      <div className="small text-body-secondary">{user.points} points</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Auth activity (realtime)</h6>
            <span className="badge text-bg-light">{analytics.authEventsTotal}</span>
          </div>
          {analytics.recentAuthEvents.length === 0 ? (
            <p className="text-body-secondary mb-0">No events yet.</p>
          ) : (
            <div className="d-flex flex-column gap-2">
              {analytics.recentAuthEvents.map((event) => (
                <div key={event.id} className="admin-auth-event">
                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge ${event.type === 'login' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                      {event.type === 'login' ? 'login' : 'logout'}
                    </span>
                    <strong>{event.name || 'User'}</strong>
                  </div>
                  <div className="small text-body-secondary">
                    {event.email || event.uid} • {formatEventTime(event.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
