export default function AboutPage() {
  return (
    <div className="d-flex flex-column gap-4">
      <section className="card shadow-sm about-hero">
        <div className="card-body p-4 p-lg-5">
          <span className="hero-badge">TaskFlow Platform</span>
          <h3 className="mb-3">TaskFlow: продуктивність, мотивація та контроль в одному просторі</h3>
          <p className="mb-0 text-body-secondary">
            TaskFlow поєднує трекер задач, систему мотивації балами, магазин та адмін-модуль ролей.
            Ви керуєте робочими та особистими цілями на дошках, відстежуєте прогрес і перетворюєте
            результати на реальні винагороди.
          </p>
        </div>
      </section>

      <section className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm h-100 about-card">
            <div className="card-body">
              <h6 className="mb-3"><i className="bi bi-kanban me-2" />Керування задачами</h6>
              <ul className="mb-0">
                <li>Дошки під різні сфери: робота, навчання, особисте.</li>
                <li>Drag-and-drop між статусами, дедлайни, пріоритети.</li>
                <li>Гнучкий перегляд прогресу по кожній дошці.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm h-100 about-card">
            <div className="card-body">
              <h6 className="mb-3"><i className="bi bi-coin me-2" />Економіка мотивації</h6>
              <ul className="mb-0">
                <li>Бали за виконані задачі з урахуванням пріоритету.</li>
                <li>Історія доходів і витрат у статистиці.</li>
                <li>Витрата балів у внутрішньому магазині.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm h-100 about-card">
            <div className="card-body">
              <h6 className="mb-3"><i className="bi bi-shield-lock me-2" />Адмін та безпека</h6>
              <ul className="mb-0">
                <li>Ролі owner/operator/moderator з окремими правами.</li>
                <li>Модерація акаунтів, флажки, причини блокувань.</li>
                <li>Firebase Auth + Firestore правила доступу.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm about-roadmap">
        <div className="card-body">
          <h6 className="mb-3">Що ще є в системі</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="about-feature-row"><i className="bi bi-palette2" /> Теми та персоналізація інтерфейсу</div>
            </div>
            <div className="col-md-6">
              <div className="about-feature-row"><i className="bi bi-shop" /> Каталог товарів, новинки, знижки</div>
            </div>
            <div className="col-md-6">
              <div className="about-feature-row"><i className="bi bi-people" /> Онлайн-лічильник користувачів</div>
            </div>
            <div className="col-md-6">
              <div className="about-feature-row"><i className="bi bi-graph-up-arrow" /> Аналітика користувача та адмін-аналітика</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
