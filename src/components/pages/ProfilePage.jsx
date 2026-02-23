import { useMemo, useState } from 'react';

const calculateCurrentStreak = (tasks) => {
  const doneTasks = tasks
    .filter((task) => task.status === 'done' && task.completedAt)
    .map((task) => new Date(task.completedAt).toISOString().slice(0, 10));

  const uniqueDoneDays = Array.from(new Set(doneTasks)).sort();
  if (uniqueDoneDays.length === 0) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!uniqueDoneDays.includes(key)) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export default function ProfilePage({ currentUser, plans, formatDateTime }) {
  const [fullscreenImage, setFullscreenImage] = useState('');

  const metrics = useMemo(() => {
    const totalTasks = currentUser.tasks.length;
    const doneTasks = currentUser.tasks.filter((task) => task.status === 'done').length;
    const progressTasks = currentUser.tasks.filter((task) => task.status === 'progress').length;
    const todoTasks = currentUser.tasks.filter((task) => task.status === 'todo').length;
    const completionRate = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const streak = calculateCurrentStreak(currentUser.tasks);
    const spent = currentUser.pointLedger
      .filter((entry) => entry.type === 'expense')
      .reduce((acc, entry) => acc + entry.amount, 0);

    return {
      totalTasks,
      doneTasks,
      progressTasks,
      todoTasks,
      completionRate,
      streak,
      spent
    };
  }, [currentUser.pointLedger, currentUser.tasks]);

  return (
    <>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Профіль користувача</h6>
              <div className="profile-photo-box profile-photo-box-lg clickable" onClick={() => currentUser.avatar && setFullscreenImage(currentUser.avatar)}>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="profile-photo-image" />
                ) : (
                  <div className="profile-photo-fallback">
                    <i className="bi bi-person-circle" />
                  </div>
                )}
              </div>
              <div className="mt-3">
                <div className="fw-semibold">{currentUser.name}</div>
                <div className="small text-body-secondary">{currentUser.email}</div>
                <div className="small text-body-secondary">{currentUser.phone || 'Телефон не вказано'}</div>
                <div className="small text-body-secondary">
                  Тариф: <strong>{plans.find((plan) => plan.id === currentUser.subscription)?.title || 'Free'}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="mb-3">Ресурси</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Баланс</span>
                <strong>{currentUser.points} балів</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Покупок</span>
                <strong>{currentUser.purchases.length}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Витрачено</span>
                <strong className="text-danger">{metrics.spent}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm h-100 profile-kpi">
                <div className="card-body">
                  <small className="text-body-secondary">Загальний прогрес</small>
                  <h3 className="mt-2 mb-1">{metrics.completionRate}%</h3>
                  <div className="progress" role="progressbar" aria-valuenow={metrics.completionRate} aria-valuemin={0} aria-valuemax={100}>
                    <div className="progress-bar" style={{ width: `${metrics.completionRate}%` }} />
                  </div>
                  <div className="small text-body-secondary mt-2">
                    Виконано {metrics.doneTasks} із {metrics.totalTasks} задач
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm h-100 profile-kpi">
                <div className="card-body">
                  <small className="text-body-secondary">Поточна серія</small>
                  <h3 className="mt-2 mb-1">{metrics.streak} дн.</h3>
                  <div className="small text-body-secondary">
                    Днів поспіль із виконаними задачами
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Структура задач</h6>
                  <div className="profile-status-bars">
                    <div className="profile-status-item">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>До виконання</span>
                        <span>{metrics.todoTasks}</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-secondary" style={{ width: `${metrics.totalTasks ? (metrics.todoTasks / metrics.totalTasks) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div className="profile-status-item">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>У процесі</span>
                        <span>{metrics.progressTasks}</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-warning" style={{ width: `${metrics.totalTasks ? (metrics.progressTasks / metrics.totalTasks) * 100 : 0}%` }} />
                      </div>
                    </div>
                    <div className="profile-status-item">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Виконано</span>
                        <span>{metrics.doneTasks}</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-success" style={{ width: `${metrics.totalTasks ? (metrics.doneTasks / metrics.totalTasks) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Останні покупки</h6>
                  {currentUser.purchases.length === 0 ? (
                    <p className="text-body-secondary mb-0">Покупок поки немає.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {currentUser.purchases.slice(0, 6).map((purchase) => (
                        <li className="list-group-item d-flex justify-content-between align-items-start px-0" key={purchase.id}>
                          <div>
                            <div className="fw-semibold">{purchase.name}</div>
                            <small className="text-body-secondary">{formatDateTime(purchase.createdAt)}</small>
                          </div>
                          <span className="badge text-bg-danger">-{purchase.total}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </>
  );
}
