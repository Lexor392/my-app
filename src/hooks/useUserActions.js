import { useCallback, useEffect, useMemo, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { PRIORITY_META, dateInDays, getProductFinalPrice, sanitizeTask } from '../data/constants';
import { auth } from '../lib/firebase';

const createDefaultTaskForm = () => ({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: dateInDays(0),
  tags: []
});

const createDefaultProfileDraft = () => ({
  name: '',
  email: '',
  phone: '',
  avatar: ''
});

export default function useUserActions({
  currentUser,
  shopProducts,
  persistCurrentUser,
  showAlert
}) {
  const [taskForm, setTaskForm] = useState(createDefaultTaskForm);
  const [profileDraft, setProfileDraft] = useState(createDefaultProfileDraft);
  const [activeBoardId, setActiveBoardId] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setProfileDraft(createDefaultProfileDraft());
      setActiveBoardId('');
      return;
    }

    setProfileDraft({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      avatar: currentUser.avatar || ''
    });

    setActiveBoardId(currentUser.activeBoardId || currentUser.boards?.[0]?.id || '');
  }, [currentUser]);

  const boards = useMemo(() => (Array.isArray(currentUser?.boards) ? currentUser.boards : []), [currentUser?.boards]);
  const archivedBoards = useMemo(
    () => (Array.isArray(currentUser?.archivedBoards) ? currentUser.archivedBoards : []),
    [currentUser?.archivedBoards]
  );
  const archivedTasks = useMemo(
    () => (Array.isArray(currentUser?.archivedTasks) ? currentUser.archivedTasks : []),
    [currentUser?.archivedTasks]
  );

  const resolvedActiveBoardId = useMemo(() => {
    if (!boards.length) {
      return '';
    }

    return boards.some((board) => board.id === activeBoardId)
      ? activeBoardId
      : (currentUser?.activeBoardId && boards.some((board) => board.id === currentUser.activeBoardId)
        ? currentUser.activeBoardId
        : boards[0].id);
  }, [activeBoardId, boards, currentUser?.activeBoardId]);

  const boardTasks = useMemo(() => {
    if (!currentUser || !resolvedActiveBoardId) {
      return [];
    }

    return currentUser.tasks.filter((task) => task.boardId === resolvedActiveBoardId);
  }, [currentUser, resolvedActiveBoardId]);

  const cartItems = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    const productMap = new Map(shopProducts.map((product) => [product.id, product]));

    return currentUser.cart
      .map((item) => {
        const product = productMap.get(item.productId);

        if (!product) {
          return null;
        }

        return {
          product,
          quantity: item.quantity
        };
      })
      .filter(Boolean);
  }, [currentUser, shopProducts]);

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + getProductFinalPrice(item.product) * item.quantity, 0),
    [cartItems]
  );

  const taskStats = useMemo(() => {
    if (!currentUser) {
      return { total: 0, done: 0 };
    }

    const total = currentUser.tasks.length;
    const done = currentUser.tasks.filter((task) => task.status === 'done').length;

    return { total, done };
  }, [currentUser]);

  const ledgerStats = useMemo(() => {
    if (!currentUser) {
      return { income: 0, spent: 0 };
    }

    return currentUser.pointLedger.reduce(
      (acc, entry) => {
        if (entry.type === 'income') {
          acc.income += entry.amount;
        } else {
          acc.spent += entry.amount;
        }
        return acc;
      },
      { income: 0, spent: 0 }
    );
  }, [currentUser]);

  const onSetActiveBoard = useCallback(
    async (boardId) => {
      if (!currentUser || !boardId || boardId === resolvedActiveBoardId) {
        return false;
      }

      const nextUser = {
        ...currentUser,
        activeBoardId: boardId
      };

      const saved = await persistCurrentUser(nextUser);
      if (saved) {
        setActiveBoardId(boardId);
      }
      return saved;
    },
    [currentUser, persistCurrentUser, resolvedActiveBoardId]
  );

  const onCreateBoard = useCallback(
    async (boardDraft) => {
      if (!currentUser) {
        return false;
      }

      const name = String(boardDraft?.name || '').trim();
      const icon = String(boardDraft?.icon || 'bi-kanban').trim();
      const colorId = String(boardDraft?.colorId || 'blue').trim();

      if (!name) {
        showAlert('warning', 'Вкажіть назву дошки.');
        return false;
      }

      const newBoard = {
        id: `board-${Date.now()}`,
        name,
        icon,
        colorId,
        createdAt: new Date().toISOString()
      };

      const nextUser = {
        ...currentUser,
        boards: [...boards, newBoard],
        activeBoardId: newBoard.id
      };

      const saved = await persistCurrentUser(nextUser, 'Дошку створено.');
      if (saved) {
        setActiveBoardId(newBoard.id);
      }
      return saved;
    },
    [boards, currentUser, persistCurrentUser, showAlert]
  );

  const onUpdateBoard = useCallback(
    async (boardId, boardDraft) => {
      if (!currentUser || !boardId) {
        return false;
      }

      const name = String(boardDraft?.name || '').trim();
      const icon = String(boardDraft?.icon || 'bi-kanban').trim();
      const colorId = String(boardDraft?.colorId || 'blue').trim();

      if (!name) {
        showAlert('warning', 'Вкажіть назву дошки.');
        return false;
      }

      const boardExists = boards.some((board) => board.id === boardId);
      if (!boardExists) {
        showAlert('warning', 'Дошку не знайдено.');
        return false;
      }

      const nextBoards = boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              name,
              icon,
              colorId
            }
          : board
      );

      return persistCurrentUser(
        {
          ...currentUser,
          boards: nextBoards
        },
        'Дошку оновлено.'
      );
    },
    [boards, currentUser, persistCurrentUser, showAlert]
  );

  const onArchiveBoard = useCallback(
    async (boardId) => {
      if (!currentUser || !boardId) {
        return false;
      }

      const boardToArchive = boards.find((board) => board.id === boardId);
      if (!boardToArchive) {
        showAlert('warning', 'Дошку не знайдено.');
        return false;
      }

      const now = new Date().toISOString();
      const boardTasksToArchive = currentUser.tasks.filter((task) => task.boardId === boardId);
      const nextBoards = boards.filter((board) => board.id !== boardId);
      const nextTasks = currentUser.tasks.filter((task) => task.boardId !== boardId);
      const nextActiveBoardId = resolvedActiveBoardId === boardId
        ? (nextBoards[0]?.id || '')
        : resolvedActiveBoardId;

      const nextArchivedBoard = {
        ...boardToArchive,
        archivedAt: now
      };

      const nextArchivedTasks = boardTasksToArchive.map((task) =>
        sanitizeTask({
          ...task,
          archivedAt: now,
          archivedReason: 'board',
          boardId
        })
      );

      const saved = await persistCurrentUser(
        {
          ...currentUser,
          boards: nextBoards,
          tasks: nextTasks,
          archivedBoards: [nextArchivedBoard, ...archivedBoards.filter((board) => board.id !== boardId)],
          archivedTasks: [...nextArchivedTasks, ...archivedTasks],
          activeBoardId: nextActiveBoardId
        },
        boardTasksToArchive.length > 0
          ? `Дошку архівовано. До архіву перенесено ${boardTasksToArchive.length} задач.`
          : 'Дошку архівовано.'
      );

      if (saved) {
        setActiveBoardId(nextActiveBoardId);
      }

      return saved;
    },
    [archivedBoards, archivedTasks, boards, currentUser, persistCurrentUser, resolvedActiveBoardId, showAlert]
  );

  const onRestoreArchivedBoard = useCallback(
    async (boardId) => {
      if (!currentUser || !boardId) {
        return false;
      }

      const boardToRestore = archivedBoards.find((board) => board.id === boardId);
      if (!boardToRestore) {
        return false;
      }

      const now = new Date().toISOString();
      const hasBoardIdConflict = boards.some((board) => board.id === boardId);
      const restoredBoardId = hasBoardIdConflict ? `board-${Date.now()}` : boardId;
      const restoredBoard = {
        ...boardToRestore,
        id: restoredBoardId
      };
      delete restoredBoard.archivedAt;

      const restoredTasks = archivedTasks
        .filter((task) => task.boardId === boardId)
        .map((task, index) => sanitizeTask({
          ...task,
          id: Date.now() + index,
          boardId: restoredBoardId,
          archivedAt: null,
          archivedReason: '',
          completedAt: task.status === 'done' ? (task.completedAt || now) : null
        }));

      const nextArchivedTasks = archivedTasks.filter((task) => task.boardId !== boardId);

      const nextUser = {
        ...currentUser,
        boards: [restoredBoard, ...boards],
        tasks: [...restoredTasks, ...currentUser.tasks],
        archivedBoards: archivedBoards.filter((board) => board.id !== boardId),
        archivedTasks: nextArchivedTasks,
        activeBoardId: currentUser.activeBoardId || restoredBoardId
      };

      const saved = await persistCurrentUser(
        nextUser,
        restoredTasks.length > 0
          ? `Дошку та ${restoredTasks.length} задач відновлено з архіву.`
          : 'Дошку відновлено з архіву.'
      );

      if (saved && !currentUser.activeBoardId) {
        setActiveBoardId(restoredBoardId);
      }

      return saved;
    },
    [archivedBoards, archivedTasks, boards, currentUser, persistCurrentUser]
  );

  const onDeleteArchivedBoard = useCallback(
    async (boardId) => {
      if (!currentUser || !boardId) {
        return false;
      }

      const nextArchivedBoards = archivedBoards.filter((board) => board.id !== boardId);
      const nextArchivedTasks = archivedTasks.filter((task) => task.boardId !== boardId);

      if (nextArchivedBoards.length === archivedBoards.length) {
        return false;
      }

      return persistCurrentUser(
        {
          ...currentUser,
          archivedBoards: nextArchivedBoards,
          archivedTasks: nextArchivedTasks
        },
        'Дошку видалено з архіву назавжди.'
      );
    },
    [archivedBoards, archivedTasks, currentUser, persistCurrentUser]
  );

  const onTaskFormChange = useCallback((field, value) => {
    setTaskForm((previous) => ({
      ...previous,
      [field]: value
    }));
  }, []);

  const onCreateTask = useCallback(
    async (event) => {
      event.preventDefault();

      if (!currentUser) {
        return;
      }

      if (!resolvedActiveBoardId) {
        showAlert('warning', 'Оберіть дошку для створення задачі.');
        return;
      }

      const title = taskForm.title.trim();
      const description = taskForm.description.trim();

      if (!title) {
        showAlert('warning', 'Введіть назву задачі.');
        return;
      }

      const reward = PRIORITY_META[taskForm.priority]?.reward || PRIORITY_META.medium.reward;

      const newTask = sanitizeTask({
        id: Date.now(),
        title,
        description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate,
        tags: taskForm.tags,
        status: 'todo',
        points: reward,
        boardId: resolvedActiveBoardId,
        rewardClaimed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      });

      const nextUser = {
        ...currentUser,
        tasks: [newTask, ...currentUser.tasks]
      };

      const saved = await persistCurrentUser(nextUser, 'Задачу додано.');

      if (saved) {
        setTaskForm(createDefaultTaskForm());
      }
    },
    [currentUser, persistCurrentUser, resolvedActiveBoardId, showAlert, taskForm]
  );

  const onTaskStatusChange = useCallback(
    async (taskId, status) => {
      if (!currentUser) {
        return;
      }

      const now = new Date().toISOString();
      let gainedPoints = 0;
      let completedTaskTitle = '';

      const nextTasks = currentUser.tasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const updated = {
          ...task,
          status,
          completedAt: status === 'done' ? task.completedAt || now : null
        };

        if (status === 'done' && !task.rewardClaimed) {
          gainedPoints = task.points;
          completedTaskTitle = task.title;
          updated.rewardClaimed = true;
        }

        return sanitizeTask(updated);
      });

      const nextLedger = [...currentUser.pointLedger];
      let nextPoints = currentUser.points;

      if (gainedPoints > 0) {
        nextPoints += gainedPoints;
        nextLedger.unshift({
          id: `task-reward-${Date.now()}`,
          type: 'income',
          source: 'task',
          amount: gainedPoints,
          label: `Нагорода за задачу: ${completedTaskTitle}`,
          createdAt: now
        });
      }

      const nextUser = {
        ...currentUser,
        tasks: nextTasks,
        points: nextPoints,
        pointLedger: nextLedger
      };

      await persistCurrentUser(
        nextUser,
        gainedPoints > 0 ? `Нараховано +${gainedPoints} балів.` : 'Статус задачі оновлено.'
      );
    },
    [currentUser, persistCurrentUser]
  );

  const onUpdateTask = useCallback(
    async (taskId, updates) => {
      if (!currentUser) {
        return false;
      }

      let updatedFound = false;
      const nextTasks = currentUser.tasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        updatedFound = true;
        const nextPriority = updates?.priority || task.priority;
        const nextPoints = Number.isFinite(Number(updates?.points))
          ? Number(updates.points)
          : (PRIORITY_META[nextPriority]?.reward || task.points);

        return sanitizeTask({
          ...task,
          ...updates,
          points: nextPoints
        });
      });

      if (!updatedFound) {
        return false;
      }

      return persistCurrentUser(
        {
          ...currentUser,
          tasks: nextTasks
        },
        'Задачу оновлено.'
      );
    },
    [currentUser, persistCurrentUser]
  );

  const onArchiveTask = useCallback(
    async (taskId) => {
      if (!currentUser) {
        return false;
      }

      const task = currentUser.tasks.find((item) => item.id === taskId);
      if (!task) {
        return false;
      }

      const archivedTask = sanitizeTask({
        ...task,
        archivedAt: new Date().toISOString(),
        archivedReason: 'manual'
      });

      return persistCurrentUser(
        {
          ...currentUser,
          tasks: currentUser.tasks.filter((item) => item.id !== taskId),
          archivedTasks: [archivedTask, ...archivedTasks]
        },
        'Задачу перенесено в архів.'
      );
    },
    [archivedTasks, currentUser, persistCurrentUser]
  );

  const onRestoreArchivedTask = useCallback(
    async (taskId) => {
      if (!currentUser) {
        return false;
      }

      const task = archivedTasks.find((item) => item.id === taskId);
      if (!task) {
        return false;
      }

      let nextBoards = boards;
      let nextBoardId = task.boardId;

      if (!nextBoardId || !boards.some((board) => board.id === nextBoardId)) {
        const fallbackBoard = boards[0];
        if (fallbackBoard) {
          nextBoardId = fallbackBoard.id;
        } else {
          const restoredBoard = {
            id: `board-${Date.now()}`,
            name: 'Відновлені задачі',
            icon: 'bi-kanban',
            colorId: 'blue',
            createdAt: new Date().toISOString()
          };
          nextBoards = [restoredBoard];
          nextBoardId = restoredBoard.id;
        }
      }

      const restoredTask = sanitizeTask({
        ...task,
        boardId: nextBoardId,
        archivedAt: null,
        archivedReason: ''
      });

      const nextTasks = [restoredTask, ...currentUser.tasks];
      const nextArchivedTasks = archivedTasks.filter((item) => item.id !== taskId);
      const nextActiveBoardId = currentUser.activeBoardId || nextBoardId;

      const saved = await persistCurrentUser(
        {
          ...currentUser,
          boards: nextBoards,
          tasks: nextTasks,
          archivedTasks: nextArchivedTasks,
          activeBoardId: nextActiveBoardId
        },
        'Задачу відновлено з архіву.'
      );

      if (saved && !currentUser.activeBoardId) {
        setActiveBoardId(nextActiveBoardId);
      }

      return saved;
    },
    [archivedTasks, boards, currentUser, persistCurrentUser]
  );

  const onDeleteArchivedTask = useCallback(
    async (taskId) => {
      if (!currentUser) {
        return false;
      }

      const nextArchivedTasks = archivedTasks.filter((task) => task.id !== taskId);
      if (nextArchivedTasks.length === archivedTasks.length) {
        return false;
      }

      return persistCurrentUser(
        {
          ...currentUser,
          archivedTasks: nextArchivedTasks
        },
        'Задачу видалено з архіву назавжди.'
      );
    },
    [archivedTasks, currentUser, persistCurrentUser]
  );

  const onAddToCart = useCallback(
    async (productId) => {
      if (!currentUser) {
        return;
      }

      const product = shopProducts.find((entry) => entry.id === productId);
      if (!product) {
        showAlert('warning', 'Товар не знайдено.');
        return;
      }

      const existing = currentUser.cart.find((entry) => entry.productId === productId);

      const nextCart = existing
        ? currentUser.cart.map((entry) =>
            entry.productId === productId
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          )
        : [...currentUser.cart, { productId, quantity: 1 }];

      const nextUser = {
        ...currentUser,
        cart: nextCart
      };

      await persistCurrentUser(nextUser, 'Товар додано до кошика.');
    },
    [currentUser, persistCurrentUser, shopProducts, showAlert]
  );

  const onChangeCartQuantity = useCallback(
    async (productId, delta) => {
      if (!currentUser) {
        return;
      }

      const nextCart = currentUser.cart
        .map((entry) => {
          if (entry.productId !== productId) {
            return entry;
          }

          return {
            ...entry,
            quantity: entry.quantity + delta
          };
        })
        .filter((entry) => entry.quantity > 0);

      const nextUser = {
        ...currentUser,
        cart: nextCart
      };

      await persistCurrentUser(nextUser);
    },
    [currentUser, persistCurrentUser]
  );

  const onCheckout = useCallback(async () => {
    if (!currentUser) {
      return false;
    }

    if (cartItems.length === 0) {
      showAlert('warning', 'Кошик порожній.');
      return false;
    }

    if (currentUser.points < cartTotal) {
      showAlert('danger', 'Недостатньо балів для оформлення покупки.');
      return false;
    }

    const now = new Date().toISOString();

    const purchases = cartItems.map((item) => ({
      id: `purchase-${Date.now()}-${item.product.id}`,
      name: item.product.name,
      quantity: item.quantity,
      total: getProductFinalPrice(item.product) * item.quantity,
      createdAt: now
    }));

    const nextUser = {
      ...currentUser,
      points: currentUser.points - cartTotal,
      cart: [],
      purchases: [...purchases, ...currentUser.purchases],
      pointLedger: [
        {
          id: `checkout-${Date.now()}`,
          type: 'expense',
          source: 'shop',
          amount: cartTotal,
          label: `Покупка в магазині (${cartItems.length} поз.)`,
          createdAt: now
        },
        ...currentUser.pointLedger
      ]
    };

    return persistCurrentUser(nextUser, 'Покупку успішно оформлено.');
  }, [cartItems, cartTotal, currentUser, persistCurrentUser, showAlert]);

  const onActivatePlan = useCallback(
    async (planId) => {
      if (!currentUser || currentUser.subscription === planId) {
        return;
      }

      const nextUser = {
        ...currentUser,
        subscription: planId
      };

      await persistCurrentUser(nextUser, 'Тариф оновлено.');
    },
    [currentUser, persistCurrentUser]
  );

  const onBuyPoints = useCallback(
    async (pack) => {
      if (!currentUser) {
        return;
      }

      const now = new Date().toISOString();

      const nextUser = {
        ...currentUser,
        points: currentUser.points + pack.points,
        pointLedger: [
          {
            id: `pack-${Date.now()}`,
            type: 'income',
            source: 'purchase',
            amount: pack.points,
            label: `Покупка пакета балів: ${pack.title}`,
            createdAt: now
          },
          ...currentUser.pointLedger
        ]
      };

      await persistCurrentUser(nextUser, `Баланс поповнено на ${pack.points} балів.`);
    },
    [currentUser, persistCurrentUser]
  );

  const onProfileChange = useCallback((field, value) => {
    setProfileDraft((previous) => ({
      ...previous,
      [field]: value
    }));
  }, []);

  const onSaveProfile = useCallback(
    async (event) => {
      event.preventDefault();

      if (!currentUser || !auth?.currentUser) {
        return;
      }

      const nextName = profileDraft.name.trim();
      const nextPhone = profileDraft.phone.trim();
      const nextAvatar = profileDraft.avatar.trim();

      if (!nextName) {
        showAlert('warning', "Ім'я не може бути порожнім.");
        return;
      }

      try {
        if (auth.currentUser.displayName !== nextName) {
          await updateProfile(auth.currentUser, { displayName: nextName });
        }
      } catch (error) {
        showAlert('warning', 'Не вдалося синхронізувати ім\'я у Firebase Auth.');
      }

      const nextUser = {
        ...currentUser,
        name: nextName,
        phone: nextPhone,
        avatar: nextAvatar
      };

      await persistCurrentUser(nextUser, 'Профіль оновлено.');
    },
    [currentUser, persistCurrentUser, profileDraft, showAlert]
  );

  const onTogglePaymentLink = useCallback(async () => {
    if (!currentUser) {
      return;
    }

    const linked = !currentUser.paymentLinked;

    const nextUser = {
      ...currentUser,
      paymentLinked: linked
    };

    await persistCurrentUser(nextUser, linked ? 'Картку прив\'язано.' : 'Картку від\'вязано.');
  }, [currentUser, persistCurrentUser]);

  const onToggleSetting = useCallback(
    async (settingKey) => {
      if (!currentUser) {
        return;
      }

      const nextUser = {
        ...currentUser,
        settings: {
          ...currentUser.settings,
          [settingKey]: !currentUser.settings[settingKey]
        }
      };

      await persistCurrentUser(nextUser);
    },
    [currentUser, persistCurrentUser]
  );

  return {
    taskForm,
    profileDraft,
    boards,
    archivedBoards,
    archivedTasks,
    activeBoardId: resolvedActiveBoardId,
    boardTasks,
    cartItems,
    cartTotal,
    taskStats,
    ledgerStats,
    onSetActiveBoard,
    onCreateBoard,
    onUpdateBoard,
    onArchiveBoard,
    onRestoreArchivedBoard,
    onDeleteArchivedBoard,
    onTaskFormChange,
    onCreateTask,
    onUpdateTask,
    onTaskStatusChange,
    onArchiveTask,
    onRestoreArchivedTask,
    onDeleteArchivedTask,
    onAddToCart,
    onChangeCartQuantity,
    onCheckout,
    onActivatePlan,
    onBuyPoints,
    onProfileChange,
    onSaveProfile,
    onTogglePaymentLink,
    onToggleSetting
  };
}
