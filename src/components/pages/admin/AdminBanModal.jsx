const BAN_DURATION_OPTIONS = [
  { value: '0', label: 'Безстроково' },
  { value: '1', label: '1 день' },
  { value: '3', label: '3 дні' },
  { value: '7', label: '7 днів' },
  { value: '30', label: '30 днів' }
];

export default function AdminBanModal({ open, draft, onDraftChange, onClose, onSubmit }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal card shadow-lg" onClick={(event) => event.stopPropagation()}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Блокування акаунта</h5>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <form className="row g-3" onSubmit={onSubmit}>
            <div className="col-12">
              <label className="form-label">Причина блокування</label>
              <input
                className="form-control"
                value={draft.reason}
                onChange={(event) => onDraftChange((prev) => ({ ...prev, reason: event.target.value }))}
                placeholder="Наприклад: підозріла активність"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Опис</label>
              <textarea
                className="form-control"
                rows={3}
                value={draft.description}
                onChange={(event) => onDraftChange((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Додаткові деталі для користувача"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Термін блокування</label>
              <select
                className="form-select"
                value={draft.durationDays}
                onChange={(event) => onDraftChange((prev) => ({ ...prev, durationDays: event.target.value }))}
              >
                {BAN_DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Скасувати
              </button>
              <button type="submit" className="btn btn-danger">
                <i className="bi bi-slash-circle me-1" />
                Заблокувати
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
