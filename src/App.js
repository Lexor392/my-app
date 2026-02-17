import { useMemo, useState } from 'react';
import './App.css';

function App() {
  const [incomeTarget, setIncomeTarget] = useState('3000');
  const [averageCheck, setAverageCheck] = useState('150');
  const [hoursPerWeek, setHoursPerWeek] = useState('20');

  const [demand, setDemand] = useState(7);
  const [expertise, setExpertise] = useState(8);
  const [competition, setCompetition] = useState(4);
  const [speed, setSpeed] = useState(7);

  const [isYearly, setIsYearly] = useState(true);
  const [tasks, setTasks] = useState([false, false, false, false, false, false, false]);

  const financialStats = useMemo(() => {
    const target = Number(incomeTarget) || 0;
    const check = Number(averageCheck) || 1;
    const hours = Number(hoursPerWeek) || 0;

    const clientsPerMonth = Math.max(1, Math.ceil(target / check));
    const revenuePerWeek = Math.round(target / 4.33);
    const hoursPerClient = Number((hours / Math.max(1, clientsPerMonth / 4)).toFixed(1));

    return {
      clientsPerMonth,
      revenuePerWeek,
      hoursPerClient
    };
  }, [incomeTarget, averageCheck, hoursPerWeek]);

  const ideaScore = useMemo(() => {
    const competitionInverted = 11 - competition;
    const raw =
      demand * 0.35 +
      expertise * 0.3 +
      competitionInverted * 0.2 +
      speed * 0.15;

    return Math.round(raw * 10);
  }, [competition, demand, expertise, speed]);

  const scoreLabel = ideaScore >= 75 ? 'Сильная идея' : ideaScore >= 60 ? 'Рабочая идея' : 'Нужно доработать';
  const scoreClass = ideaScore >= 75 ? 'text-success' : ideaScore >= 60 ? 'text-warning' : 'text-danger';

  const sprintTasks = [
    'Выбрать микро-нишу и сформулировать оффер в 1 предложение',
    'Сделать лендинг с CTA и формой лидов',
    'Подготовить 3 кейса или демо-примера',
    'Опубликовать 5 экспертных постов в соцсетях/чатах',
    'Запустить 20 персональных outreach-сообщений',
    'Провести 3 созвона и закрыть 1 тестовую сделку',
    'Собрать обратную связь и улучшить оффер'
  ];

  const doneTasks = tasks.filter(Boolean).length;
  const sprintProgress = Math.round((doneTasks / sprintTasks.length) * 100);

  const plans = [
    {
      name: 'Starter',
      subtitle: 'Для первых продаж',
      monthly: 0,
      yearly: 0,
      features: ['До 1 проекта', 'Базовый калькулятор', '7-дневный спринт']
    },
    {
      name: 'Pro',
      subtitle: 'Для стабильного дохода',
      monthly: 12,
      yearly: 9,
      featured: true,
      features: ['Неограниченные проекты', 'Премиум-шаблоны офферов', 'Авто-воронка лидов', 'Экспорт в PDF']
    },
    {
      name: 'Agency',
      subtitle: 'Для команд и студий',
      monthly: 39,
      yearly: 29,
      features: ['Командный доступ', 'Белая маркировка', 'Приоритетная поддержка']
    }
  ];

  const getPrice = (plan) => (isYearly ? plan.yearly : plan.monthly);

  const toggleTask = (index) => {
    setTasks((prev) => prev.map((task, i) => (i === index ? !task : task)));
  };

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg sticky-top glass-nav">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#hero">
            ProfitPilot
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#calculator">
                  Калькулятор
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#sprint">
                  Спринт
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#pricing">
                  Подписка
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="hero-section" id="hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 fade-in">
              <span className="badge rounded-pill badge-soft mb-3">Умный запуск микробизнеса</span>
              <h1 className="display-5 fw-bold mb-3">От идеи до первых клиентов за 7 дней</h1>
              <p className="lead mb-4">
                ProfitPilot помогает рассчитать цель дохода, оценить нишу и запустить план продаж без хаоса.
              </p>
              <a href="#calculator" className="btn btn-accent btn-lg me-2">
                Начать бесплатно
              </a>
              <a href="#pricing" className="btn btn-outline-light btn-lg">
                Посмотреть Pro
              </a>
            </div>
            <div className="col-lg-5 slide-up">
              <div className="hero-card">
                <h5 className="mb-3">Что дает сервис</h5>
                <ul className="mb-0">
                  <li>Прогноз выручки и нагрузки</li>
                  <li>Скоринг жизнеспособности идеи</li>
                  <li>Чек-лист запуска с прогрессом</li>
                  <li>Подписочная модель для владельца проекта</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-5">
        <section className="container section-block" id="calculator">
          <div className="row g-4">
            <div className="col-xl-7 fade-in">
              <div className="panel p-4 h-100">
                <h3 className="mb-3">Калькулятор дохода</h3>
                <p className="text-muted mb-4">Рассчитай понятный план по клиентам и времени.</p>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Цель в месяц ($)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={incomeTarget}
                      onChange={(event) => setIncomeTarget(event.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Средний чек ($)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={averageCheck}
                      onChange={(event) => setAverageCheck(event.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Часов в неделю</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={hoursPerWeek}
                      onChange={(event) => setHoursPerWeek(event.target.value)}
                    />
                  </div>
                </div>
                <div className="row g-3 mt-2">
                  <div className="col-md-4">
                    <div className="metric-card">
                      <span>Клиентов / месяц</span>
                      <strong>{financialStats.clientsPerMonth}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="metric-card">
                      <span>Выручка / неделя</span>
                      <strong>${financialStats.revenuePerWeek}</strong>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="metric-card">
                      <span>Часов / клиент</span>
                      <strong>{financialStats.hoursPerClient}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-5 slide-up">
              <div className="panel p-4 h-100">
                <h3 className="mb-3">Оценка идеи</h3>
                <p className="text-muted mb-4">Скоринг помогает выбрать идею с лучшим шансом на продажи.</p>

                <label className="form-label d-flex justify-content-between">
                  Спрос <span>{demand}/10</span>
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="10"
                  value={demand}
                  onChange={(event) => setDemand(Number(event.target.value))}
                />

                <label className="form-label d-flex justify-content-between">
                  Экспертиза <span>{expertise}/10</span>
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="10"
                  value={expertise}
                  onChange={(event) => setExpertise(Number(event.target.value))}
                />

                <label className="form-label d-flex justify-content-between">
                  Конкуренция <span>{competition}/10</span>
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="10"
                  value={competition}
                  onChange={(event) => setCompetition(Number(event.target.value))}
                />

                <label className="form-label d-flex justify-content-between">
                  Скорость запуска <span>{speed}/10</span>
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="10"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                />

                <div className="score-box mt-3">
                  <span>Итоговый рейтинг</span>
                  <h2 className="mb-1">{ideaScore}/100</h2>
                  <strong className={scoreClass}>{scoreLabel}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container section-block" id="sprint">
          <div className="panel p-4 fade-in">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div>
                <h3 className="mb-1">7-дневный спринт запуска</h3>
                <p className="text-muted mb-0">Выполни ключевые действия и получи первые платежи быстрее.</p>
              </div>
              <div className="progress-chip">Прогресс: {sprintProgress}%</div>
            </div>
            <div className="progress mb-4" role="progressbar" aria-label="Sprint progress" aria-valuenow={sprintProgress} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar" style={{ width: `${sprintProgress}%` }} />
            </div>
            <div className="row g-2">
              {sprintTasks.map((task, index) => (
                <div className="col-md-6" key={task}>
                  <label className="task-item w-100">
                    <input
                      type="checkbox"
                      checked={tasks[index]}
                      onChange={() => toggleTask(index)}
                    />
                    <span>{task}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container section-block" id="pricing">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <h3 className="mb-1">Подписка</h3>
              <p className="text-muted mb-0">Freemium: бесплатный вход + апселл в Pro/Agency.</p>
            </div>
            <div className="form-check form-switch fs-5">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="billingSwitch"
                checked={isYearly}
                onChange={() => setIsYearly((prev) => !prev)}
              />
              <label className="form-check-label" htmlFor="billingSwitch">
                Годовая оплата (до -25%)
              </label>
            </div>
          </div>
          <div className="row g-4">
            {plans.map((plan) => (
              <div className="col-lg-4" key={plan.name}>
                <div className={`price-card h-100 p-4 ${plan.featured ? 'featured' : ''}`}>
                  <p className="small text-uppercase mb-2">{plan.subtitle}</p>
                  <h4>{plan.name}</h4>
                  <div className="price-value mb-3">
                    ${getPrice(plan)}
                    <span> / месяц</span>
                  </div>
                  <ul className="list-unstyled mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="mb-2">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className={`btn w-100 ${plan.featured ? 'btn-accent' : 'btn-outline-light'}`}>
                    {plan.monthly === 0 ? 'Остаться на Free' : 'Выбрать план'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container section-block">
          <div className="panel p-4 fade-in">
            <h3 className="mb-3">Как мы монетизируем умно</h3>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="metric-card h-100">
                  <span>Основная модель</span>
                  <strong>Freemium + Pro</strong>
                  <small>Платные функции: экспорт, шаблоны, автоворонки, совместная работа.</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="metric-card h-100">
                  <span>Второй источник</span>
                  <strong>Партнерские офферы</strong>
                  <small>Рекомендации CRM, email-сервисов и no-code инструментов с комиссией.</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="metric-card h-100">
                  <span>Третий источник</span>
                  <strong>Шаблоны и курсы</strong>
                  <small>One-time продажи пакетов офферов, скриптов продаж и мини-обучений.</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-4 footer-note">
        <div className="container">
          ProfitPilot MVP. Следующий шаг: подключить Stripe + Supabase для реальной подписки.
        </div>
      </footer>
    </div>
  );
}

export default App;
