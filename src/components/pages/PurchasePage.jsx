export default function PurchasePage({ plans, packs, currentSubscription, onActivatePlan, onBuyPoints }) {
  return (
    <div className="d-flex flex-column gap-4">
      <section className="card shadow-sm purchase-section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="mb-0">Покупка підписки</h5>
            <span className="badge text-bg-light">Плани доступу</span>
          </div>
          <div className="row g-3">
            {plans.map((plan) => (
              <div className="col-md-4" key={plan.id}>
                <div className="card h-100 shadow-sm purchase-card">
                  <div className="card-body d-flex flex-column">
                    <h6>{plan.title}</h6>
                    <div className="fw-bold fs-5 mb-3">{plan.price}</div>
                    <ul className="small text-body-secondary ps-3">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <button
                      className={`btn mt-auto ${currentSubscription === plan.id ? 'btn-success' : 'btn-outline-primary'}`}
                      type="button"
                      onClick={() => onActivatePlan(plan.id)}
                    >
                      {currentSubscription === plan.id ? 'Активний' : 'Обрати тариф'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card shadow-sm purchase-section">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="mb-0">Покупка балів</h5>
            <span className="badge text-bg-light">Швидке поповнення</span>
          </div>
          <div className="row g-3">
            {packs.map((pack) => (
              <div className="col-md-4" key={pack.id}>
                <div className="card h-100 shadow-sm purchase-card">
                  <div className="card-body d-flex flex-column">
                    <h6>{pack.title}</h6>
                    <div className="mb-2">
                      <i className="bi bi-coin me-1" />
                      <strong>{pack.points}</strong> балів
                    </div>
                    <p className="text-body-secondary">Ціна: {pack.price}</p>
                    <button className="btn btn-primary mt-auto" type="button" onClick={() => onBuyPoints(pack)}>
                      Купити пакет
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
