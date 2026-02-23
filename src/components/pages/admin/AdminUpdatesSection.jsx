export default function AdminUpdatesSection({ appVersion, releaseNotes }) {
  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h6 className="mb-3">Системна інформація</h6>
            <div className="admin-version-card mb-3">
              <div className="small text-body-secondary">Поточна версія</div>
              <div className="admin-version-value">{appVersion}</div>
            </div>
            <div className="small text-body-secondary">
              Розділ доступний службовим ролям: owner, operator, task moderator, shop moderator.
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h6 className="mb-3">Історія змін</h6>

            {releaseNotes.length === 0 ? (
              <p className="text-body-secondary mb-0">Журнал змін поки порожній.</p>
            ) : (
              <div className="admin-release-list">
                {releaseNotes.map((release) => (
                  <article className="admin-release-item" key={release.id}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                      <div>
                        <div className="fw-semibold">{release.title}</div>
                        <div className="small text-body-secondary">
                          {release.date}{release.time ? `, ${release.time}` : ''}
                        </div>
                      </div>
                      <span className="badge text-bg-primary">{release.version}</span>
                    </div>
                    <ul className="admin-release-changes mb-0">
                      {release.changes.map((change, index) => (
                        <li key={`${release.id}-${index}`}>{change}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
