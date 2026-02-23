import { useMemo, useState } from 'react';

const LEDGER_PER_PAGE = 10;

export default function StatsPage({ taskStats, ledgerStats, pointLedger, formatDateTime }) {
  const [page, setPage] = useState(1);

  const pagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(pointLedger.length / LEDGER_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * LEDGER_PER_PAGE;

    return {
      page: safePage,
      totalPages,
      items: pointLedger.slice(start, start + LEDGER_PER_PAGE)
    };
  }, [pointLedger, page]);

  return (
    <div className="row g-4">
      <div className="col-md-6 col-xl-3">
        <div className="card stat-card h-100 shadow-sm">
          <div className="card-body">
            <small className="text-body-secondary">Усього задач</small>
            <h3 className="mt-2 mb-0">{taskStats.total}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="card stat-card h-100 shadow-sm">
          <div className="card-body">
            <small className="text-body-secondary">Виконано</small>
            <h3 className="mt-2 mb-0 text-success">{taskStats.done}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="card stat-card h-100 shadow-sm">
          <div className="card-body">
            <small className="text-body-secondary">Зароблено балів</small>
            <h3 className="mt-2 mb-0 text-primary">{ledgerStats.income}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-xl-3">
        <div className="card stat-card h-100 shadow-sm">
          <div className="card-body">
            <small className="text-body-secondary">Витрачено балів</small>
            <h3 className="mt-2 mb-0 text-danger">{ledgerStats.spent}</h3>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Історія операцій з балами</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Операція</th>
                    <th>Тип</th>
                    <th className="text-end">Сума</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.items.map((entry) => (
                    <tr key={entry.id}>
                      <td>{formatDateTime(entry.createdAt)}</td>
                      <td>{entry.label}</td>
                      <td>
                        <span className={`badge ${entry.type === 'income' ? 'text-bg-success' : 'text-bg-danger'}`}>
                          {entry.type === 'income' ? 'Дохід' : 'Витрата'}
                        </span>
                      </td>
                      <td className="text-end fw-semibold">
                        {entry.type === 'income' ? '+' : '-'}{entry.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-end mt-2">
                <div className="btn-group" role="group" aria-label="Ledger pagination">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  >
                    Назад
                  </button>
                  <button type="button" className="btn btn-sm btn-primary" disabled>
                    {pagination.page} / {pagination.totalPages}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  >
                    Далі
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
