import { useMemo, useState } from 'react';
import { BOARD_COLOR_OPTIONS, BOARD_ICON_OPTIONS, TASK_TAG_COLOR_OPTIONS } from '../../data/constants';

const BOARDS_PER_PAGE = 6;

const EMPTY_BOARD_DRAFT = {
  name: '',
  icon: BOARD_ICON_OPTIONS[0],
  colorId: BOARD_COLOR_OPTIONS[0].id
};

const EMPTY_EDIT_TASK = {
  id: null,
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  tags: []
};

const tagStyle = (color) => ({
  background: `${color}22`,
  border: `1px solid ${color}55`,
  color
});

const getBoardName = (boardId, boards, archivedBoards) => {
  return boards.find((board) => board.id === boardId)?.name
    || archivedBoards.find((board) => board.id === boardId)?.name
    || 'Без дошки';
};

export default function TrackerPage({
  boards,
  archivedBoards = [],
  archivedTasks = [],
  activeBoardId,
  onSetActiveBoard,
  onCreateBoard,
  onUpdateBoard,
  onArchiveBoard,
  onRestoreArchivedBoard,
  onDeleteArchivedBoard,
  taskForm,
  onTaskFormChange,
  onCreateTask,
  onTaskUpdate,
  tasks,
  allTasks = [],
  onTaskStatusChange,
  onTaskArchive,
  onRestoreArchivedTask,
  onDeleteArchivedTask,
  priorityMeta,
  statusMeta
}) {
  const [dragTaskId, setDragTaskId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);

  const [viewMode, setViewMode] = useState('boards');
  const [archiveTab, setArchiveTab] = useState('tasks');
  const [boardPage, setBoardPage] = useState(1);

  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  const [boardModalMode, setBoardModalMode] = useState('create');
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [boardDraft, setBoardDraft] = useState(EMPTY_BOARD_DRAFT);

  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [editTaskDraft, setEditTaskDraft] = useState(EMPTY_EDIT_TASK);

  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagColor, setNewTagColor] = useState(TASK_TAG_COLOR_OPTIONS[0]);
  const [editTagLabel, setEditTagLabel] = useState('');
  const [editTagColor, setEditTagColor] = useState(TASK_TAG_COLOR_OPTIONS[0]);

  const selectedBoard = useMemo(
    () => boards.find((board) => board.id === activeBoardId) || null,
    [boards, activeBoardId]
  );

  const selectedBoardColor = useMemo(
    () => BOARD_COLOR_OPTIONS.find((color) => color.id === selectedBoard?.colorId) || BOARD_COLOR_OPTIONS[0],
    [selectedBoard?.colorId]
  );

  const boardTaskStats = useMemo(() => {
    const statsByBoard = Object.fromEntries(boards.map((board) => [board.id, { total: 0, done: 0, progress: 0 }]));

    allTasks.forEach((task) => {
      if (!task?.boardId || !statsByBoard[task.boardId]) {
        return;
      }

      statsByBoard[task.boardId].total += 1;
      if (task.status === 'done') {
        statsByBoard[task.boardId].done += 1;
      }
      if (task.status === 'progress') {
        statsByBoard[task.boardId].progress += 1;
      }
    });

    return statsByBoard;
  }, [allTasks, boards]);

  const boardPagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(boards.length / BOARDS_PER_PAGE));
    const safePage = Math.min(boardPage, totalPages);
    const start = (safePage - 1) * BOARDS_PER_PAGE;

    return {
      page: safePage,
      totalPages,
      items: boards.slice(start, start + BOARDS_PER_PAGE)
    };
  }, [boardPage, boards]);

  const stats = useMemo(
    () => ({ total: tasks.length, done: tasks.filter((task) => task.status === 'done').length }),
    [tasks]
  );

  const openCreateBoardModal = () => {
    setBoardModalMode('create');
    setEditingBoardId(null);
    setBoardDraft(EMPTY_BOARD_DRAFT);
    setBoardModalOpen(true);
  };

  const openEditBoardModal = (board) => {
    setBoardModalMode('edit');
    setEditingBoardId(board.id);
    setBoardDraft({ name: board.name, icon: board.icon, colorId: board.colorId });
    setBoardModalOpen(true);
  };

  const closeBoardModal = () => {
    setBoardModalOpen(false);
    setEditingBoardId(null);
    setBoardDraft(EMPTY_BOARD_DRAFT);
  };

  const submitBoard = async (event) => {
    event.preventDefault();
    const saved = boardModalMode === 'edit'
      ? await onUpdateBoard(editingBoardId, boardDraft)
      : await onCreateBoard(boardDraft);

    if (saved) {
      closeBoardModal();
      setViewMode('tasks');
    }
  };

  const handleArchiveBoard = async (board) => {
    if (!window.confirm(`Перенести дошку "${board.name}" в архів?`)) {
      return;
    }

    const saved = await onArchiveBoard(board.id);
    if (saved) {
      setViewMode('boards');
    }
  };

  const openCreateTaskModal = () => {
    setNewTagLabel('');
    setNewTagColor(TASK_TAG_COLOR_OPTIONS[0]);
    setCreateTaskModalOpen(true);
  };

  const submitCreateTask = async (event) => {
    event.preventDefault();
    if (!taskForm.title.trim()) {
      return;
    }

    await onCreateTask(event);
    setCreateTaskModalOpen(false);
  };

  const openEditTaskModal = (task) => {
    setEditTaskDraft({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: Array.isArray(task.tags) ? task.tags : []
    });
    setEditTagLabel('');
    setEditTagColor(TASK_TAG_COLOR_OPTIONS[0]);
    setEditTaskModalOpen(true);
  };

  const submitEditTask = async (event) => {
    event.preventDefault();
    const saved = await onTaskUpdate(editTaskDraft.id, {
      title: editTaskDraft.title,
      description: editTaskDraft.description,
      priority: editTaskDraft.priority,
      dueDate: editTaskDraft.dueDate,
      tags: editTaskDraft.tags
    });

    if (saved) {
      setEditTaskModalOpen(false);
      setEditTaskDraft(EMPTY_EDIT_TASK);
    }
  };

  const addTaskTag = (isEditMode) => {
    const label = (isEditMode ? editTagLabel : newTagLabel).trim();
    if (!label) {
      return;
    }

    const color = isEditMode ? editTagColor : newTagColor;
    const nextTag = { id: `tag-${Date.now()}`, label, color };

    if (isEditMode) {
      setEditTaskDraft((prev) => ({ ...prev, tags: [...(prev.tags || []), nextTag].slice(0, 8) }));
      setEditTagLabel('');
    } else {
      onTaskFormChange('tags', [...(taskForm.tags || []), nextTag].slice(0, 8));
      setNewTagLabel('');
    }
  };

  const removeTaskTag = (tagId, isEditMode) => {
    if (isEditMode) {
      setEditTaskDraft((prev) => ({ ...prev, tags: (prev.tags || []).filter((tag) => tag.id !== tagId) }));
      return;
    }

    onTaskFormChange('tags', (taskForm.tags || []).filter((tag) => tag.id !== tagId));
  };

  const handleDrop = async (targetStatus) => {
    if (!dragTaskId) {
      return;
    }

    await onTaskStatusChange(dragTaskId, targetStatus);
    setDragTaskId(null);
    setDragOverStatus(null);
  };

  if (viewMode === 'archive') {
    return (
      <div className="d-flex flex-column gap-3">
        <div className="card shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-1">Архів</h5>
              <div className="small text-body-secondary">Відновлюйте або видаляйте дошки та задачі назавжди.</div>
            </div>
            <button type="button" className="btn btn-outline-primary" onClick={() => setViewMode('boards')}>
              <i className="bi bi-arrow-left me-2" />До дощок
            </button>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="btn-group mb-3" role="group" aria-label="archive tabs">
              <button type="button" className={`btn btn-sm ${archiveTab === 'tasks' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setArchiveTab('tasks')}>Задачі ({archivedTasks.length})</button>
              <button type="button" className={`btn btn-sm ${archiveTab === 'boards' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setArchiveTab('boards')}>Дошки ({archivedBoards.length})</button>
            </div>

            {archiveTab === 'tasks' && (
              <div className="d-flex flex-column gap-2">
                {archivedTasks.map((task) => (
                  <div className="admin-task-card" key={`arch-task-${task.id}`}>
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div>
                        <div className="fw-semibold">{task.title}</div>
                        <div className="small text-body-secondary">Дошка: {getBoardName(task.boardId, boards, archivedBoards)}</div>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onRestoreArchivedTask(task.id)}>
                          <i className="bi bi-arrow-counterclockwise me-1" />Відновити
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDeleteArchivedTask(task.id)}>
                          <i className="bi bi-trash me-1" />Видалити
                        </button>
                      </div>
                    </div>

                    {Array.isArray(task.tags) && task.tags.length > 0 && (
                      <div className="d-flex gap-2 flex-wrap mb-2">
                        {task.tags.map((tag) => (
                          <span key={tag.id} className="badge" style={tagStyle(tag.color)}>{tag.label}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {archivedTasks.length === 0 && <div className="text-body-secondary">Архів задач порожній.</div>}
              </div>
            )}

            {archiveTab === 'boards' && (
              <div className="d-flex flex-column gap-2">
                {archivedBoards.map((board) => (
                  <div className="admin-category-item" key={`arch-board-${board.id}`}>
                    <div>
                      <strong>{board.name}</strong>
                      <div className="small text-body-secondary">{board.icon}</div>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onRestoreArchivedBoard(board.id)}>
                        <i className="bi bi-arrow-counterclockwise me-1" />Відновити
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDeleteArchivedBoard(board.id)}>
                        <i className="bi bi-trash me-1" />Видалити
                      </button>
                    </div>
                  </div>
                ))}
                {archivedBoards.length === 0 && <div className="text-body-secondary">Архів дощок порожній.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'boards') {
    return (
      <>
        <div className="tracker-boards-wrap">
          <div className="tracker-boards-head card shadow-sm">
            <div className="card-body p-4 p-lg-5">
              <div className="tracker-hero-grid">
                <div>
                  <h4 className="mb-2">Простір ваших дощок</h4>
                  <p className="text-body-secondary mb-4">Створюйте окремі дошки для різних напрямків роботи.</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="button" className="btn btn-primary btn-lg" onClick={openCreateBoardModal}><i className="bi bi-plus-circle me-2" />Додати дошку</button>
                    <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => setViewMode('archive')}><i className="bi bi-archive me-2" />Архів</button>
                  </div>
                </div>

                <div className="tracker-hero-stats">
                  <div className="tracker-hero-stat"><div className="small text-body-secondary">Дощок</div><div className="tracker-hero-value">{boards.length}</div></div>
                  <div className="tracker-hero-stat"><div className="small text-body-secondary">Задач</div><div className="tracker-hero-value">{allTasks.length}</div></div>
                  <div className="tracker-hero-stat"><div className="small text-body-secondary">Архів дощок</div><div className="tracker-hero-value">{archivedBoards.length}</div></div>
                  <div className="tracker-hero-stat"><div className="small text-body-secondary">Архів задач</div><div className="tracker-hero-value">{archivedTasks.length}</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-1">
            {boardPagination.items.map((board) => {
              const color = BOARD_COLOR_OPTIONS.find((item) => item.id === board.colorId) || BOARD_COLOR_OPTIONS[0];
              const boardStats = boardTaskStats[board.id] || { total: 0, done: 0, progress: 0 };

              return (
                <div className="col-sm-6 col-xl-4" key={board.id}>
                  <article className="tracker-board-card" style={{ '--board-accent': color.accent, '--board-soft': color.soft }} role="button" tabIndex={0} onClick={() => onSetActiveBoard(board.id).then(() => setViewMode('tasks'))}>
                    <div className="tracker-board-card-top">
                      <div className="tracker-board-icon" style={{ color: color.accent }}><i className={`bi ${board.icon}`} /></div>
                      <div className="tracker-board-actions" onClick={(event) => event.stopPropagation()}>
                        <button type="button" className="btn btn-sm btn-light" onClick={() => openEditBoardModal(board)}><i className="bi bi-pencil" /></button>
                        <button type="button" className="btn btn-sm btn-light text-danger" onClick={() => handleArchiveBoard(board)}><i className="bi bi-archive" /></button>
                      </div>
                    </div>
                    <h6 className="mb-1 text-start">{board.name}</h6>
                    <div className="tracker-board-kpis">
                      <span><i className="bi bi-list-check me-1" />{boardStats.total}</span>
                      <span><i className="bi bi-hourglass-split me-1" />{boardStats.progress}</span>
                      <span><i className="bi bi-check2-circle me-1" />{boardStats.done}</span>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {boardPagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <div className="btn-group" role="group" aria-label="boards pagination">
                <button type="button" className="btn btn-outline-primary" disabled={boardPagination.page <= 1} onClick={() => setBoardPage((prev) => Math.max(1, prev - 1))}>Назад</button>
                <button type="button" className="btn btn-primary" disabled>{boardPagination.page} / {boardPagination.totalPages}</button>
                <button type="button" className="btn btn-outline-primary" disabled={boardPagination.page >= boardPagination.totalPages} onClick={() => setBoardPage((prev) => Math.min(boardPagination.totalPages, prev + 1))}>Далі</button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {!selectedBoard ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <div className="text-body-secondary mb-3">Створи нову дошку</div>
            <button type="button" className="btn btn-primary" onClick={() => setViewMode('boards')}>
              <i className="bi bi-plus-circle me-2" />До дощок
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4" style={{ '--board-accent': selectedBoardColor.accent, '--board-soft': selectedBoardColor.soft }}>
          <div className="card shadow-sm tracker-toolbar-card tracker-board-toolbar">
            <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <h5 className="mb-1">{selectedBoard.name}</h5>
                <div className="small text-body-secondary">Усього задач: {stats.total}, виконано: {stats.done}</div>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button type="button" className="btn btn-outline-primary" onClick={() => setViewMode('boards')}><i className="bi bi-grid me-2" />До дощок</button>
                <button type="button" className="btn btn-outline-primary" onClick={() => setViewMode('archive')}><i className="bi bi-archive me-2" />Архів</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => openEditBoardModal(selectedBoard)}><i className="bi bi-pencil me-2" />Редагувати</button>
                <button type="button" className="btn btn-outline-danger" onClick={() => handleArchiveBoard(selectedBoard)}><i className="bi bi-archive me-2" />В архів</button>
                <button type="button" className="btn btn-primary" onClick={openCreateTaskModal}><i className="bi bi-plus-circle me-2" />Додати задачу</button>
              </div>
            </div>
          </div>

          <div className="kanban-grid">
            {Object.keys(statusMeta).map((status) => {
              const columnTasks = tasks.filter((task) => task.status === status);
              return (
                <section
                  className={`kanban-column ${dragOverStatus === status ? 'drag-over' : ''}`}
                  key={status}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverStatus(status);
                  }}
                  onDragLeave={() => setDragOverStatus(null)}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleDrop(status);
                  }}
                >
                  <div className="kanban-header"><h6 className="mb-0">{statusMeta[status].label}</h6></div>
                  <div className="kanban-cards">
                    {columnTasks.length === 0 ? (
                      <div className="empty-column">Перетягніть сюди задачу</div>
                    ) : (
                      columnTasks.map((task) => (
                        <article className="task-card draggable-task" key={task.id} draggable onDragStart={() => setDragTaskId(task.id)} onDragEnd={() => { setDragTaskId(null); setDragOverStatus(null); }}>
                          <div className="d-flex justify-content-between gap-2 mb-2">
                            <h6 className="mb-1">{task.title}</h6>
                            <div className="d-flex gap-1">
                              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openEditTaskModal(task)}><i className="bi bi-pencil" /></button>
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onTaskArchive(task.id)}><i className="bi bi-archive" /></button>
                            </div>
                          </div>
                          {task.description && <p className="task-desc">{task.description}</p>}

                          {Array.isArray(task.tags) && task.tags.length > 0 && (
                            <div className="d-flex gap-2 flex-wrap mb-2">
                              {task.tags.map((tag) => <span className="badge" key={tag.id} style={tagStyle(tag.color)}>{tag.label}</span>)}
                            </div>
                          )}

                          <div className="d-flex gap-2 flex-wrap mb-2">
                            <span className={`badge ${priorityMeta[task.priority].className}`}>{priorityMeta[task.priority].label}</span>
                            <span className="badge text-bg-light">до {task.dueDate}</span>
                          </div>

                          <select className="form-select form-select-sm" value={task.status} onChange={(event) => onTaskStatusChange(task.id, event.target.value)}>
                            <option value="todo">До виконання</option>
                            <option value="progress">У процесі</option>
                            <option value="done">Виконано</option>
                          </select>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {isBoardModalOpen && (
        <div className="modal-overlay" onClick={closeBoardModal}>
          <div className="task-modal card shadow-lg" onClick={(event) => event.stopPropagation()}>
            <div className="card-body">
              <h5 className="mb-3">{boardModalMode === 'edit' ? 'Редагувати дошку' : 'Нова дошка'}</h5>
              <form className="row g-3" onSubmit={submitBoard}>
                <div className="col-12"><label className="form-label">Назва</label><input className="form-control" value={boardDraft.name} onChange={(event) => setBoardDraft((prev) => ({ ...prev, name: event.target.value }))} /></div>
                <div className="col-12"><label className="form-label">Іконка</label><div className="tracker-icon-grid">{BOARD_ICON_OPTIONS.map((icon) => <button key={icon} type="button" className={`tracker-icon-option ${boardDraft.icon === icon ? 'active' : ''}`} onClick={() => setBoardDraft((prev) => ({ ...prev, icon }))}><i className={`bi ${icon}`} /></button>)}</div></div>
                <div className="col-12"><label className="form-label">Колір</label><div className="tracker-color-grid">{BOARD_COLOR_OPTIONS.map((color) => <button key={color.id} type="button" className={`tracker-color-option ${boardDraft.colorId === color.id ? 'active' : ''}`} style={{ background: color.soft, borderColor: color.accent }} onClick={() => setBoardDraft((prev) => ({ ...prev, colorId: color.id }))}><span style={{ background: color.accent }} /></button>)}</div></div>
                <div className="col-12 d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={closeBoardModal}>Скасувати</button><button type="submit" className="btn btn-primary">Зберегти</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isCreateTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateTaskModalOpen(false)}>
          <div className="task-modal card shadow-lg" onClick={(event) => event.stopPropagation()}>
            <div className="card-body">
              <h5 className="mb-3">Нова задача</h5>
              <form className="row g-3" onSubmit={submitCreateTask}>
                <div className="col-12"><label className="form-label">Назва</label><input className="form-control" value={taskForm.title} onChange={(event) => onTaskFormChange('title', event.target.value)} /></div>
                <div className="col-md-6"><label className="form-label">Пріоритет</label><select className="form-select" value={taskForm.priority} onChange={(event) => onTaskFormChange('priority', event.target.value)}><option value="low">Низький</option><option value="medium">Середній</option><option value="high">Високий</option></select></div>
                <div className="col-md-6"><label className="form-label">Дедлайн</label><input type="date" className="form-control" value={taskForm.dueDate} onChange={(event) => onTaskFormChange('dueDate', event.target.value)} /></div>
                <div className="col-12"><label className="form-label">Опис</label><textarea className="form-control" rows={3} value={taskForm.description} onChange={(event) => onTaskFormChange('description', event.target.value)} /></div>
                <div className="col-12">
                  <label className="form-label">Теги</label>
                  <div className="d-flex gap-2 mb-2"><input className="form-control" value={newTagLabel} onChange={(event) => setNewTagLabel(event.target.value)} placeholder="Назва" /><select className="form-select" value={newTagColor} onChange={(event) => setNewTagColor(event.target.value)}>{TASK_TAG_COLOR_OPTIONS.map((color) => <option key={color} value={color}>{color}</option>)}</select><button type="button" className="btn btn-outline-primary" onClick={() => addTaskTag(false)}>Додати</button></div>
                  <div className="d-flex gap-2 flex-wrap">{(taskForm.tags || []).map((tag) => <span key={tag.id} className="badge" style={tagStyle(tag.color)}>{tag.label}<button type="button" className="btn btn-sm p-0 ms-2" style={{ color: 'inherit' }} onClick={() => removeTaskTag(tag.id, false)}><i className="bi bi-x" /></button></span>)}</div>
                </div>
                <div className="col-12 d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={() => setCreateTaskModalOpen(false)}>Скасувати</button><button type="submit" className="btn btn-primary">Зберегти</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isEditTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setEditTaskModalOpen(false)}>
          <div className="task-modal card shadow-lg" onClick={(event) => event.stopPropagation()}>
            <div className="card-body">
              <h5 className="mb-3">Редагувати задачу</h5>
              <form className="row g-3" onSubmit={submitEditTask}>
                <div className="col-12"><label className="form-label">Назва</label><input className="form-control" value={editTaskDraft.title} onChange={(event) => setEditTaskDraft((prev) => ({ ...prev, title: event.target.value }))} /></div>
                <div className="col-md-6"><label className="form-label">Пріоритет</label><select className="form-select" value={editTaskDraft.priority} onChange={(event) => setEditTaskDraft((prev) => ({ ...prev, priority: event.target.value }))}><option value="low">Низький</option><option value="medium">Середній</option><option value="high">Високий</option></select></div>
                <div className="col-md-6"><label className="form-label">Дедлайн</label><input type="date" className="form-control" value={editTaskDraft.dueDate} onChange={(event) => setEditTaskDraft((prev) => ({ ...prev, dueDate: event.target.value }))} /></div>
                <div className="col-12"><label className="form-label">Опис</label><textarea className="form-control" rows={3} value={editTaskDraft.description} onChange={(event) => setEditTaskDraft((prev) => ({ ...prev, description: event.target.value }))} /></div>
                <div className="col-12">
                  <label className="form-label">Теги</label>
                  <div className="d-flex gap-2 mb-2"><input className="form-control" value={editTagLabel} onChange={(event) => setEditTagLabel(event.target.value)} placeholder="Назва" /><select className="form-select" value={editTagColor} onChange={(event) => setEditTagColor(event.target.value)}>{TASK_TAG_COLOR_OPTIONS.map((color) => <option key={color} value={color}>{color}</option>)}</select><button type="button" className="btn btn-outline-primary" onClick={() => addTaskTag(true)}>Додати</button></div>
                  <div className="d-flex gap-2 flex-wrap">{(editTaskDraft.tags || []).map((tag) => <span key={tag.id} className="badge" style={tagStyle(tag.color)}>{tag.label}<button type="button" className="btn btn-sm p-0 ms-2" style={{ color: 'inherit' }} onClick={() => removeTaskTag(tag.id, true)}><i className="bi bi-x" /></button></span>)}</div>
                </div>
                <div className="col-12 d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={() => setEditTaskModalOpen(false)}>Скасувати</button><button type="submit" className="btn btn-primary">Зберегти</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
