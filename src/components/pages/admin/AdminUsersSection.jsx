import { useEffect, useMemo, useRef, useState } from 'react';
import { FLAG_TAG_OPTIONS, dateInDays } from '../../../data/constants';

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="btn-group" role="group" aria-label="Users pagination">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          disabled={page <= 1}
          onClick={() => onChange(Math.max(1, page - 1))}
        >
          Назад
        </button>
        <button type="button" className="btn btn-primary btn-sm" disabled>
          {page} / {totalPages}
        </button>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          disabled={page >= totalPages}
          onClick={() => onChange(Math.min(totalPages, page + 1))}
        >
          Далі
        </button>
      </div>
    </div>
  );
}

export default function AdminUsersSection({
  users,
  currentUserId,
  roleOptions,
  permissions,
  userQuery,
  onUserQueryChange,
  userStatusFilter,
  onUserStatusFilterChange,
  userFlagStateFilter,
  onUserFlagStateFilterChange,
  userTagFilter,
  onUserTagFilterChange,
  onResetUserFilters,
  userPagination,
  selectedUser,
  selectedUserId,
  onSelectUser,
  userForm,
  onUserFormChange,
  canMutateSelectedAccount,
  selectedUserStats,
  formatDateTime,
  onSaveUser,
  onDeleteSelectedUser,
  onBanAction,
  flagReason,
  onFlagReasonChange,
  flagTags,
  onToggleFlagTag,
  onFlagSelectedUser,
  onResolveFlag,
  taskDrafts,
  onTaskDraftChange,
  onSaveTask,
  onDeleteTask,
  newTask,
  onNewTaskChange,
  onCreateTask,
  rawUserJson,
  onRawUserJsonChange,
  onSaveRawUser,
  onDownloadUserLogs,
  onOpenFullscreenImage
}) {
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('touchstart', closeOnOutside);

    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('touchstart', closeOnOutside);
    };
  }, []);

  const activeFiltersCount = useMemo(
    () => Number(userStatusFilter !== 'all') + Number(userFlagStateFilter !== 'all') + Number(userTagFilter !== 'all'),
    [userFlagStateFilter, userStatusFilter, userTagFilter]
  );

  const getFlagTagLabel = (tagId) => FLAG_TAG_OPTIONS.find((tag) => tag.id === tagId)?.label || tagId;
  const safeFormatDateTime = (value) => {
    const parsed = Date.parse(value || '');
    if (!Number.isFinite(parsed)) {
      return 'н/д';
    }
    return formatDateTime(new Date(parsed).toISOString());
  };

  return (
    <div className="row g-4">
      <div className="col-xl-4">
        <div className="card shadow-sm h-100">
          <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Акаунти</h6>
              <span className="badge text-bg-light">{userPagination.filteredCount} / {users.length}</span>
            </div>

            <div className="admin-user-search-row mb-3">
              <input
                className="form-control"
                placeholder="Пошук: ім'я, email, телефон, #тег"
                value={userQuery}
                onChange={(event) => onUserQueryChange(event.target.value)}
              />
              <div className="admin-filter-menu-anchor" ref={filterMenuRef}>
                <button
                  type="button"
                  className={`btn btn-outline-secondary admin-filter-toggle ${isFiltersOpen ? 'active' : ''}`}
                  onClick={() => setFiltersOpen((prev) => !prev)}
                  title="Фільтри"
                >
                  <i className="bi bi-funnel" />
                  {activeFiltersCount > 0 && <span className="admin-filter-indicator">{activeFiltersCount}</span>}
                </button>

                {isFiltersOpen && (
                  <div className="admin-filter-dropdown shadow-sm">
                    <div className="small text-body-secondary mb-2">Фільтри користувачів</div>
                    <div className="admin-filters-grid">
                      <select className="form-select form-select-sm" value={userStatusFilter} onChange={(event) => onUserStatusFilterChange(event.target.value)}>
                        <option value="all">Усі статуси</option>
                        <option value="active">Активні</option>
                        <option value="banned">Заблоковані</option>
                      </select>
                      <select className="form-select form-select-sm" value={userFlagStateFilter} onChange={(event) => onUserFlagStateFilterChange(event.target.value)}>
                        <option value="all">Усі позначки</option>
                        <option value="flagged">З флажками</option>
                        <option value="clean">Без флажків</option>
                      </select>
                      <select className="form-select form-select-sm" value={userTagFilter} onChange={(event) => onUserTagFilterChange(event.target.value)}>
                        <option value="all">Усі теги</option>
                        {FLAG_TAG_OPTIONS.map((tag) => (
                          <option key={tag.id} value={tag.id}>{tag.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="d-flex justify-content-end mt-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          onResetUserFilters();
                          setFiltersOpen(false);
                        }}
                      >
                        Скинути
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-list-scroll d-flex flex-column gap-2">
              {userPagination.items.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={`admin-user-item ${selectedUserId === user.id ? 'active' : ''}`}
                  onClick={() => onSelectUser(user.id)}
                >
                  <div className="admin-user-head">
                    <div className="admin-user-avatar-wrap">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="admin-user-avatar" /> : <i className="bi bi-person-circle" />}
                      {user.isOnline && <span className="admin-user-online-dot" title="Онлайн" />}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{user.name}</strong>
                        <div className="d-flex align-items-center gap-1">
                          {user.isAdmin && <span className="badge text-bg-primary">owner</span>}
                          {Array.isArray(user.flags) && user.flags.length > 0 && <span className="badge text-bg-warning">{user.flags.length}</span>}
                          {user.isBanned && <span className="badge text-bg-danger">ban</span>}
                        </div>
                      </div>
                      <div className="small text-body-secondary">{user.email}</div>
                      <div className={`small ${user.isOnline ? 'text-success' : 'text-body-secondary'}`}>
                        {user.isOnline
                          ? 'Онлайн'
                          : `Останній вхід: ${safeFormatDateTime(user.lastLoginAt || user.lastSeenAt || user.joinedAt)}`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {userPagination.items.length === 0 && <div className="text-body-secondary small">Нічого не знайдено.</div>}
            </div>

            <Pagination page={userPagination.page} totalPages={userPagination.totalPages} onChange={userPagination.onPageChange} />
          </div>
        </div>
      </div>

      <div className="col-xl-8">
        {!selectedUser || !userForm ? (
          <div className="card shadow-sm"><div className="card-body">Оберіть користувача ліворуч.</div></div>
        ) : (
          <div className="d-flex flex-column gap-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                  <h6 className="mb-0">Перевірка акаунта</h6>
                  <div className="d-flex gap-2">
                    {permissions.canBanDeleteUsers && (
                      <button
                        type="button"
                        className={`btn btn-sm ${selectedUser.isBanned ? 'btn-success' : 'btn-warning'}`}
                        disabled={!canMutateSelectedAccount}
                        onClick={onBanAction}
                      >
                        {selectedUser.isBanned ? 'Розблокувати' : 'Заблокувати'}
                      </button>
                    )}
                    {permissions.canBanDeleteUsers && (
                      <button type="button" className="btn btn-sm btn-outline-danger" disabled={!canMutateSelectedAccount || selectedUser.id === currentUserId} onClick={onDeleteSelectedUser}>
                        Видалити
                      </button>
                    )}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Ім'я</label>
                    <input className="form-control" value={userForm.name} readOnly={!permissions.canManageUsers} onChange={(event) => onUserFormChange('name', event.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Баланс</label>
                    <input type="number" className="form-control" value={userForm.points} readOnly={!permissions.canManageUsers} onChange={(event) => onUserFormChange('points', event.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={userForm.email} readOnly={!permissions.canManageUsers || selectedUser.isAdmin} onChange={(event) => onUserFormChange('email', event.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Телефон</label>
                    <input className="form-control" value={userForm.phone} readOnly={!permissions.canManageUsers || selectedUser.isAdmin} onChange={(event) => onUserFormChange('phone', event.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Ролі акаунта</label>
                    {selectedUser.isAdmin ? (
                      <div className="form-control bg-body-secondary-subtle">Власник системи (owner)</div>
                    ) : (
                      <div className="d-flex flex-column gap-2 border rounded p-2">
                        {roleOptions.map((role) => (
                          <label className="form-check mb-0" key={role.id}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={userForm.roles.includes(role.id)}
                              disabled={!permissions.canManageRoles}
                              onChange={(event) => {
                                const checked = event.target.checked;
                                onUserFormChange('roles', checked ? [...userForm.roles, role.id] : userForm.roles.filter((item) => item !== role.id));
                              }}
                            />
                            <span className="form-check-label">{role.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Фото профілю</label>
                    <div className={`admin-profile-photo-box ${userForm.avatar ? 'clickable' : ''}`} onClick={() => userForm.avatar && onOpenFullscreenImage(userForm.avatar)}>
                      {userForm.avatar ? <img src={userForm.avatar} alt={userForm.name} className="admin-profile-photo" /> : <div className="admin-profile-photo-fallback"><i className="bi bi-person-circle" /></div>}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label">Аватар (URL)</label>
                    <input className="form-control" value={userForm.avatar} readOnly={!permissions.canManageUsers} onChange={(event) => onUserFormChange('avatar', event.target.value)} />
                    <div className="form-text">Натисніть на фото для повноекранного перегляду.</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-between gap-2 mt-3">
                  <small className="text-body-secondary">Реєстрація: {formatDateTime(selectedUser.joinedAt)}</small>
                  <small className={selectedUser.isOnline ? 'text-success' : 'text-body-secondary'}>
                    {selectedUser.isOnline ? 'Статус: онлайн' : 'Статус: офлайн'}
                  </small>
                  <small className="text-body-secondary">
                    Останній вхід: {safeFormatDateTime(selectedUser.lastLoginAt || selectedUser.lastSeenAt || selectedUser.joinedAt)}
                  </small>
                  <small className="text-body-secondary">
                    Останній вихід: {safeFormatDateTime(selectedUser.lastLogoutAt)}
                  </small>
                  <small>
                    <a
                      href={`#user-logs-${selectedUser.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        if (typeof onDownloadUserLogs === 'function') {
                          onDownloadUserLogs(selectedUser.id);
                        }
                      }}
                    >
                      Логи статусу (онлайн/офлайн)
                    </a>
                  </small>
                  {permissions.canManageUsers && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={onSaveUser} disabled={!canMutateSelectedAccount}>
                      Зберегти профіль
                    </button>
                  )}
                </div>
              </div>
            </div>

            {selectedUserStats && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Статистика користувача</h6>
                  <div className="row g-3">
                    <div className="col-md-3 col-6"><div className="admin-stat-card"><div className="small text-body-secondary">Завдань</div><div className="admin-stat-value">{selectedUserStats.totalTasks}</div></div></div>
                    <div className="col-md-3 col-6"><div className="admin-stat-card"><div className="small text-body-secondary">Виконано</div><div className="admin-stat-value">{selectedUserStats.doneTasks}</div></div></div>
                    <div className="col-md-3 col-6"><div className="admin-stat-card"><div className="small text-body-secondary">Покупок</div><div className="admin-stat-value">{selectedUserStats.purchasesCount}</div></div></div>
                    <div className="col-md-3 col-6"><div className="admin-stat-card"><div className="small text-body-secondary">Флажків</div><div className="admin-stat-value">{selectedUserStats.flagsCount}</div></div></div>
                  </div>
                </div>
              </div>
            )}

            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="mb-3">Флажки акаунта</h6>
                {(selectedUser.flags || []).length === 0 ? (
                  <div className="text-body-secondary small mb-3">Флажків поки немає.</div>
                ) : (
                  <div className="d-flex flex-column gap-2 mb-3">
                    {selectedUser.flags.map((flag) => (
                      <div className="admin-task-card" key={flag.id}>
                        <div className="small fw-semibold"><i className="bi bi-flag-fill text-warning me-1" />{flag.reason}</div>
                        {Array.isArray(flag.tags) && flag.tags.length > 0 && (
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {flag.tags.map((tag) => <span key={`${flag.id}-${tag}`} className="badge text-bg-light border">#{getFlagTagLabel(tag)}</span>)}
                          </div>
                        )}
                        <div className="small text-body-secondary">{formatDateTime(flag.createdAt)}</div>
                        {permissions.canResolveFlags && (
                          <button type="button" className="btn btn-sm btn-outline-success mt-2" onClick={() => onResolveFlag(selectedUser.id, flag.id)}>
                            Зняти флажок
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {permissions.canFlagAccounts && (
                  <div className="admin-task-card">
                    <label className="form-label">Причина позначки</label>
                    <textarea className="form-control mb-2" rows={3} value={flagReason} onChange={(event) => onFlagReasonChange(event.target.value)} />
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {FLAG_TAG_OPTIONS.map((tag) => (
                        <button key={tag.id} type="button" className={`btn btn-sm ${flagTags.includes(tag.id) ? 'btn-warning' : 'btn-outline-secondary'}`} onClick={() => onToggleFlagTag(tag.id)}>
                          {tag.label}
                        </button>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="button" className="btn btn-sm btn-warning" disabled={!canMutateSelectedAccount} onClick={onFlagSelectedUser}>
                        Поставити флажок
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {permissions.canReviewTasks && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Модерація завдань</h6>
                  <div className="admin-list-scroll d-flex flex-column gap-3 mb-3">
                    {selectedUser.tasks.map((task) => {
                      const draft = taskDrafts[task.id] || { ...task, points: String(task.points) };
                      return (
                        <div className="admin-task-card" key={task.id}>
                          <div className="row g-2">
                            <div className="col-md-5"><input className="form-control form-control-sm" value={draft.title || ''} disabled={!permissions.canModerateTasks || !canMutateSelectedAccount} onChange={(event) => onTaskDraftChange(task.id, 'title', event.target.value)} /></div>
                            <div className="col-md-2"><input type="number" className="form-control form-control-sm" value={draft.points || 0} disabled={!permissions.canModerateTasks || !canMutateSelectedAccount} onChange={(event) => onTaskDraftChange(task.id, 'points', event.target.value)} /></div>
                            <div className="col-md-2">
                              <select className="form-select form-select-sm" value={draft.priority || 'medium'} disabled={!permissions.canModerateTasks || !canMutateSelectedAccount} onChange={(event) => onTaskDraftChange(task.id, 'priority', event.target.value)}>
                                <option value="low">Низький</option><option value="medium">Середній</option><option value="high">Високий</option>
                              </select>
                            </div>
                            <div className="col-md-3">
                              <select className="form-select form-select-sm" value={draft.status || 'todo'} disabled={!permissions.canModerateTasks || !canMutateSelectedAccount} onChange={(event) => onTaskDraftChange(task.id, 'status', event.target.value)}>
                                <option value="todo">До виконання</option><option value="progress">У процесі</option><option value="done">Виконано</option>
                              </select>
                            </div>
                            <div className="col-md-8"><input className="form-control form-control-sm" placeholder="Опис" value={draft.description || ''} disabled={!permissions.canModerateTasks || !canMutateSelectedAccount} onChange={(event) => onTaskDraftChange(task.id, 'description', event.target.value)} /></div>
                            <div className="col-md-4"><input type="date" className="form-control form-control-sm" value={draft.dueDate || dateInDays(0)} disabled={!permissions.canModerateTasks || !canMutateSelectedAccount} onChange={(event) => onTaskDraftChange(task.id, 'dueDate', event.target.value)} /></div>
                          </div>
                          {permissions.canModerateTasks && (
                            <div className="d-flex justify-content-end gap-2 mt-2">
                              <button type="button" className="btn btn-sm btn-outline-danger" disabled={!canMutateSelectedAccount} onClick={() => onDeleteTask(selectedUser.id, task.id)}>Видалити</button>
                              <button type="button" className="btn btn-sm btn-primary" disabled={!canMutateSelectedAccount} onClick={() => onSaveTask(task.id)}>Зберегти</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {permissions.canModerateTasks && (
                    <div className="admin-task-card">
                      <h6 className="small mb-2">Додати завдання</h6>
                      <div className="row g-2">
                        <div className="col-md-5"><input className="form-control form-control-sm" placeholder="Назва" value={newTask.title} disabled={!canMutateSelectedAccount} onChange={(event) => onNewTaskChange('title', event.target.value)} /></div>
                        <div className="col-md-2"><input type="number" className="form-control form-control-sm" value={newTask.points} disabled={!canMutateSelectedAccount} onChange={(event) => onNewTaskChange('points', event.target.value)} /></div>
                        <div className="col-md-2">
                          <select className="form-select form-select-sm" value={newTask.priority} disabled={!canMutateSelectedAccount} onChange={(event) => onNewTaskChange('priority', event.target.value)}>
                            <option value="low">Низький</option><option value="medium">Середній</option><option value="high">Високий</option>
                          </select>
                        </div>
                        <div className="col-md-3"><input type="date" className="form-control form-control-sm" value={newTask.dueDate} disabled={!canMutateSelectedAccount} onChange={(event) => onNewTaskChange('dueDate', event.target.value)} /></div>
                        <div className="col-12"><input className="form-control form-control-sm" placeholder="Опис" value={newTask.description} disabled={!canMutateSelectedAccount} onChange={(event) => onNewTaskChange('description', event.target.value)} /></div>
                      </div>
                      <div className="d-flex justify-content-end mt-2">
                        <button type="button" className="btn btn-sm btn-success" disabled={!canMutateSelectedAccount} onClick={onCreateTask}>Додати завдання</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {permissions.canUseRawJson && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="mb-3">Сира структура користувача (JSON)</h6>
                  <textarea className="form-control admin-json-editor" value={rawUserJson} onChange={(event) => onRawUserJsonChange(event.target.value)} />
                  <div className="d-flex justify-content-end mt-2">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={onSaveRawUser}>Застосувати JSON</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
