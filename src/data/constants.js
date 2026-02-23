export const MENU_ITEMS = [
  { key: 'tracker', label: 'Трекер', icon: 'bi-kanban' },
  { key: 'shop', label: 'Магазин', icon: 'bi-shop' },
  { key: 'stats', label: 'Статистика', icon: 'bi-graph-up-arrow' },
  { key: 'settings', label: 'Налаштування', icon: 'bi-sliders' },
  { key: 'about', label: 'Про нас', icon: 'bi-info-circle' },
  { key: 'purchase', label: 'Покупка', icon: 'bi-gem' },
  { key: 'profile', label: 'Профіль', icon: 'bi-person-circle' }
];

export const DEFAULT_SHOP_CATEGORIES = [
  'Клавіатури',
  'Мыши',
  'Навушники',
  'Аксесуари',
  'Стрим',
  'Аудио'
];

export const DEFAULT_SHOP_PRODUCTS = [
  // Demo products removed. Fill catalog from admin panel.
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    title: 'Free',
    price: '0 грн',
    features: ['До 20 активних задач', 'Базова статистика', '1 дошка проєкту']
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '399 грн/міс',
    features: ['Безліміт задач', 'Розширена аналітика', 'Нагадування та інтеграції']
  },
  {
    id: 'team',
    title: 'Team',
    price: '890 грн/міс',
    features: ['Спільні простори', 'Ролі та доступи', 'Командні звіти']
  }
];

export const POINT_PACKS = [
  { id: 'small', title: 'Старт', points: 250, price: '149 грн' },
  { id: 'medium', title: 'Оптимум', points: 700, price: '349 грн' },
  { id: 'large', title: 'Максимум', points: 1500, price: '649 грн' }
];

export const PRIORITY_META = {
  low: { label: 'Низький', className: 'bg-info-subtle text-info-emphasis', reward: 20 },
  medium: { label: 'Середній', className: 'bg-warning-subtle text-warning-emphasis', reward: 35 },
  high: { label: 'Високий', className: 'bg-danger-subtle text-danger-emphasis', reward: 50 }
};

export const STATUS_META = {
  todo: { label: 'До виконання' },
  progress: { label: 'У процесі' },
  done: { label: 'Виконано' }
};

export const STORAGE_KEYS = {
  theme: 'taskflow_theme_mode'
};

export const APP_VERSION = 'v1.9.0';

export const FLAG_TAG_OPTIONS = [
  { id: 'avatar', label: 'Аватар' },
  { id: 'username', label: "Р†Рј'я користувача" },
  { id: 'tasks', label: 'Завдання' },
  { id: 'spam', label: 'Спам' },
  { id: 'fraud', label: 'Шахрайство' },
  { id: 'abuse', label: 'Зловживання' },
  { id: 'payments', label: 'Платежі' },
  { id: 'shop', label: 'Магазин' },
  { id: 'security', label: 'Безпека' },
  { id: 'other', label: 'Інше' }
];

export const BOARD_ICON_OPTIONS = [
  'bi-kanban',
  'bi-briefcase',
  'bi-journal-check',
  'bi-lightning-charge',
  'bi-controller',
  'bi-code-slash',
  'bi-book',
  'bi-heart-pulse',
  'bi-camera-video',
  'bi-rocket-takeoff',
  'bi-house',
  'bi-calendar3',
  'bi-cash-coin',
  'bi-palette2',
  'bi-megaphone',
  'bi-music-note-beamed',
  'bi-graph-up-arrow',
  'bi-gear-wide-connected'
];

export const BOARD_COLOR_OPTIONS = [
  { id: 'sky', label: 'Небесний', accent: '#0ea5e9', soft: '#e0f2fe' },
  { id: 'ocean', label: 'Океан', accent: '#0284c7', soft: '#dbeafe' },
  { id: 'indigo', label: 'Індиго', accent: '#4f46e5', soft: '#e0e7ff' },
  { id: 'violet', label: 'Фіолетовий', accent: '#7c3aed', soft: '#ede9fe' },
  { id: 'rose', label: 'Рожевий', accent: '#e11d48', soft: '#ffe4e6' },
  { id: 'orange', label: 'Помаранчевий', accent: '#ea580c', soft: '#ffedd5' },
  { id: 'amber', label: 'Бурштин', accent: '#d97706', soft: '#fef3c7' },
  { id: 'lime', label: 'Лайм', accent: '#65a30d', soft: '#ecfccb' },
  { id: 'emerald', label: 'Смарагд', accent: '#10b981', soft: '#d1fae5' },
  { id: 'teal', label: 'Бірюза', accent: '#0f766e', soft: '#ccfbf1' },
  { id: 'cyan', label: 'Ціан', accent: '#0891b2', soft: '#cffafe' },
  { id: 'slate', label: 'Сланець', accent: '#334155', soft: '#e2e8f0' },
  { id: 'stone', label: 'Камінь', accent: '#57534e', soft: '#e7e5e4' },
  { id: 'red', label: 'Червоний', accent: '#dc2626', soft: '#fee2e2' },
  { id: 'fuchsia', label: 'Фуксія', accent: '#c026d3', soft: '#fae8ff' },
  { id: 'blue', label: 'Синій', accent: '#2563eb', soft: '#dbeafe' },
  { id: 'green', label: 'Зелений', accent: '#16a34a', soft: '#dcfce7' },
  { id: 'gray', label: 'Сірий', accent: '#4b5563', soft: '#e5e7eb' }
];

export const TASK_TAG_COLOR_OPTIONS = [
  '#14b8a6',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#8b5cf6'
];

export const RELEASE_NOTES = [
  {
    id: '2026-02-23-v1.9.0',
    version: 'v1.9.0',
    date: '2026-02-23',
    time: '23:59',
    title: 'Архів задач/дошок, редактор товарів і оновлений магазин',
    changes: [
      'Видалення дощок і задач у трекері переведено в архівацію з окремим екраном архіву та відновленням.',
      'Додано pop-up редактор задач із тегами та кольорами тегів.',
      'Оновлено вітрину магазину: компактніші картки, кнопка перегляду та сторінка товару з галереєю і fullscreen.',
      'Повністю перероблено адмін-редактор магазину: покроковий квіз для товару, окремий pop-up категорій, чернетки товарів.',
      'У покроковому редакторі додано завантаження власних фото товару через файли замість обов’язкових URL.',
      'Покращено контрастність тексту в темній темі (включно з кнопкою входу через Google).'
    ]
  },
  {
    id: '2026-02-22-v1.8.3',
    version: 'v1.8.3',
    date: '2026-02-22',
    time: '23:59',
    title: 'Покращення фільтрації користувачів в адмінці',
    changes: [
      'Фільтри списку користувачів перенесено у випадаюче меню за кнопкою з іконкою.',
      'Додано індикатор кількості активних фільтрів на кнопці меню фільтрації.',
      'Додано швидке скидання фільтрів у випадаючому меню.',
      'Пошук користувачів розширено: тепер підтримує пошук за тегами флажків і причинами позначок (включно з форматом #тег).'
    ]
  },
  {
    id: '2026-02-22-v1.8.2',
    version: 'v1.8.2',
    date: '2026-02-22',
    time: '23:59',
    title: 'Стабілізація виходу з акаунта і позиції сповіщень',
    changes: [
      'Виправлено logout: помилки оновлення presence більше не блокують завершення сесії.',
      'Перенесено плаваючі сповіщення у лівий нижній кут на десктопі та мобільних екранах.'
    ]
  },
  {
    id: '2026-02-22-v1.8.1',
    version: 'v1.8.1',
    date: '2026-02-22',
    time: '23:59',
    title: 'Бургер-меню і очищення демо-даних',
    changes: [
      'Мобільну навігацію переведено у формат бургер-меню з offcanvas-сайдбаром та затемненням фону.',
      'Оновлено верхню панель: додано кнопку відкриття меню для екранів до 1100px.',
      'Видалено стартові демо-товари з коду магазину та додано автоматичне очищення старого демо-каталогу.',
      'Нові акаунти більше не отримують тестові дошки і тестові задачі при реєстрації.',
      'Додано очищення legacy-стартових задач/дошки у профілях зі старим демо-набором.',
      'Додано порожній стан у трекері з підказкою «Створи нову дошку».'
    ]
  },
  {
    id: '2026-02-22-v1.8.0',
    version: 'v1.8.0',
    date: '2026-02-22',
    time: '23:59',
    title: 'Оновлення дощок і повний mobile-first адаптив',
    changes: [
      'Додано повноцінне редагування дощок: зміна назви, іконки та кольору з єдиного модального вікна.',
      'Додано видалення дощок з переносом задач у резервну дошку та захистом від видалення останньої дошки.',
      'Оновлено стартову сторінку трекера: hero-блок, KPI по дошках і задачах, зручні дії редагування/видалення на картці.',
      'Виправлено розмітку карток дощок для стабільної роботи на мобільних (без вкладених кнопок у кнопку).',
      'Додано відсутні стилі для нових блоків трекера: hero-grid, дії на картках, KPI-чіпи, focus-стани.',
      'Реалізовано розширений адаптив для всього інтерфейсу на 1200/1100/992/768/576/420 px: меню, topbar, модальні вікна, канбан, картки, кошик та адмін-блоки.',
      'Оновлено версію застосунку до v1.8.0.'
    ]
  },
  {
    id: '2026-02-22-v1.7.1',
    version: 'v1.7.1',
    date: '2026-02-22',
    time: '23:59',
    title: 'Доопрацювання стилів і структури адмінки',
    changes: [
      'Розділено AdminPage на окремі секції та модальні компоненти для зручнішої підтримки.',
      'Додано відсутні стилі для дощок трекера, аналітики адмінки, сторінки «Про нас» та секцій покупки.',
      'Виправлено стилі верхнього меню акаунта: нижчий z-index topbar, повне заповнення аватара, вищий шар випадаючого блоку.',
      'Додано sticky-поведінку лівого меню та адаптивні стилі для нових блоків.'
    ]
  },
  {
    id: '2026-02-22-v1.7.0',
    version: 'v1.7.0',
    date: '2026-02-22',
    time: '23:55',
    title: 'Дошки, аналітика, пагінація та українізація',
    changes: [
      'Додано режим дощок у трекері: створення дошки, вибір іконки та кольору, окремі задачі по дошках.',
      'Додано пагінацію для дощок, магазину, списку акаунтів та товарів адмін-панелі.',
      'Ліве меню стало sticky, додано live-лічильник користувачів онлайн та блок версії.',
      'Розширено адмін-панель: фільтри акаунтів, теги флажків, окремий розділ загальної статистики з гістограмами.',
      'Знижено z-index topbar, виправлено відображення аватара в кнопці профілю.',
      'Сайт оновлено українською мовою, ціни переведено в гривні, блок «Про нас» розширено.',
      'Оновлено release notes та версіонування до v1.7.0.'
    ]
  },
  {
    id: '2026-02-22-v1.6.0',
    version: 'v1.6.0',
    date: '2026-02-22',
    time: '22:40',
    title: 'Безопасность и модерация аккаунтов',
    changes: [
      'Перенесен выход из левого меню в профильное меню верхней панели и в настройки аккаунта.',
      'Добавлена кнопка удаления аккаунта в разделе конфиденциальности.',
      'Реализовано бан-окно в админке: причина, описание, срок блокировки.',
      'Добавлен показ причины блокировки при попытке входа в забаненный аккаунт.',
      'Добавлена очередь email-уведомлений о бане через коллекцию mail (Firebase Trigger Email).',
      'В админ-панели добавлен отдельный раздел с версией и историей изменений.'
    ]
  },
  {
    id: '2026-02-22-v1.5.0',
    version: 'v1.5.0',
    date: '2026-02-22',
    time: '19:10',
    title: 'Новый UX профиля, настроек и трекера',
    changes: [
      'Профиль переведен в формат аналитики: KPI, прогресс задач, активность и покупки.',
      'Настройки разбиты на разделы: аккаунт, конфиденциальность, оформление, уведомления, рабочее пространство.',
      'Добавлен переход из меню аккаунта сразу в подраздел настроек аккаунта.',
      'В трекере добавлен drag-and-drop задач между колонками.',
      'Форма создания задачи перенесена в pop-up c кнопками «Сохранить» и «Отменить».',
      'Фото профиля в ключевых местах ограничено контейнером 300x300 и открывается в полноэкранном режиме.'
    ]
  },
  {
    id: '2026-02-21-v1.4.0',
    version: 'v1.4.0',
    date: '2026-02-21',
    time: '16:25',
    title: 'Роли и расширение админки',
    changes: [
      'Добавлены роли operator, task_moderator, shop_moderator с реальными ограничениями по действиям.',
      'Реализованы флажки аккаунтов: модератор указывает причину, owner видит очередь флажков.',
      'В список пользователей добавлены аватары и подробный блок проверки профиля.',
      'В админке добавлен блок статистики по выбранному пользователю.',
      'РСЃРїСЂР°РІР»РµРЅС‹ РїСЂР°РІР° РЅР° РјРѕРґРµСЂР°С†РёСЋ РјР°РіР°Р·РёРЅР° РґР»СЏ СЂРѕР»РµР№ shop_moderator Рё operator.'
    ]
  },
  {
    id: '2026-02-20-v1.3.0',
    version: 'v1.3.0',
    date: '2026-02-20',
    time: '13:40',
    title: 'Магазин и каталог',
    changes: [
      'РРєРѕРЅРєРё С‚РѕРІР°СЂРѕРІ Р·Р°РјРµРЅРµРЅС‹ РЅР° РєР°СЂС‚РѕС‡РєРё СЃ СЂРµР°Р»СЊРЅС‹РјРё РёР·РѕР±СЂР°Р¶РµРЅРёСЏРјРё.',
      'Добавлены тестовые товары, фильтрация и поиск по каталогу.',
      'Добавлены бейджи «Новинка» и поддержка скидок с отображением старой и новой цены.',
      'Расширено управление магазином: категории и товары можно создавать, изменять и удалять.'
    ]
  },
  {
    id: '2026-02-19-v1.2.0',
    version: 'v1.2.0',
    date: '2026-02-19',
    time: '18:50',
    title: 'Авторизация и Firebase',
    changes: [
      'Подключена Firebase Auth и Firestore для реальной авторизации и хранения данных.',
      'Добавлены регистрация, вход по email/паролю и вход через Google.',
      'Добавлена нормализация и защита пользовательских данных при записи в базу.',
      'Реализованы правила Firestore для owner и ролевой модели.'
    ]
  },
  {
    id: '2026-02-18-v1.1.0',
    version: 'v1.1.0',
    date: '2026-02-18',
    time: '14:15',
    title: 'Стабилизация интерфейса',
    changes: [
      'РСЃРїСЂР°РІР»РµРЅС‹ РїСЂРѕР±Р»РµРјС‹ СЃ СЂСѓСЃСЃРєРёРјРё СЃС‚СЂРѕРєР°РјРё Рё Р±РёС‚РѕР№ РєРѕРґРёСЂРѕРІРєРѕР№.',
      'Обновлены шрифты с поддержкой кириллицы.',
      'Проведена раскладка логики по компонентам для уменьшения нагрузки на App.js.',
      'Улучшены стили и читаемость интерфейса на мобильных и десктопных экранах.'
    ]
  }
];

export const STAFF_ROLE_OPTIONS = [
  {
    id: 'task_moderator',
    label: 'Модератор задач',
    description: 'Може модерувати задачі та задачі користувачів.'
  },
  {
    id: 'shop_moderator',
    label: 'Модератор магазину',
    description: 'Може модерувати каталог магазину та категорії.'
  },
  {
    id: 'operator',
    label: 'Оператор',
    description: 'Може вести акаунти, баланс і звернення користувачів.'
  }
];

export const STAFF_ROLE_IDS = STAFF_ROLE_OPTIONS.map((role) => role.id);

export const OWNER_EMAIL = (process.env.REACT_APP_OWNER_EMAIL || 'owner@taskflow.app').toLowerCase();

export const ADMIN_ACCOUNT = {
  name: 'Owner Admin',
  email: OWNER_EMAIL,
  phone: '+79991112233'
};

const BROKEN_CHAR = '\uFFFD';
const hasBrokenChars = (value) => typeof value === 'string' && value.includes(BROKEN_CHAR);
const hasBrokenQuestionMarks = (value) => typeof value === 'string' && /\?{3,}/.test(value);

const cleanText = (value, fallback = '') => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed || hasBrokenChars(trimmed) || hasBrokenQuestionMarks(trimmed)) {
    return fallback;
  }
  return trimmed;
};

const normalizeEmail = (value, fallback = '') => cleanText(value, fallback).toLowerCase();
const normalizeRoles = (roles) => {
  if (!Array.isArray(roles)) {
    return [];
  }

  return Array.from(
    new Set(
      roles
        .map((role) => cleanText(role, ''))
        .filter((role) => STAFF_ROLE_IDS.includes(role))
    )
  );
};

const FLAG_TAG_IDS = new Set(FLAG_TAG_OPTIONS.map((tag) => tag.id));
const BOARD_ICON_SET = new Set(BOARD_ICON_OPTIONS);
const BOARD_COLOR_SET = new Set(BOARD_COLOR_OPTIONS.map((color) => color.id));

const normalizeFlagTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return Array.from(
    new Set(
      tags
        .map((tag) => cleanText(tag, ''))
        .filter((tag) => FLAG_TAG_IDS.has(tag))
    )
  );
};

const normalizeFlags = (flags) => {
  if (!Array.isArray(flags)) {
    return [];
  }

  return flags
    .map((flag, index) => ({
      id: cleanText(flag?.id, `flag-${Date.now()}-${index}`),
      reason: cleanText(flag?.reason, ''),
      createdAt: flag?.createdAt || new Date().toISOString(),
      createdByUid: cleanText(flag?.createdByUid, ''),
      createdByName: cleanText(flag?.createdByName, 'Модератор'),
      createdByEmail: normalizeEmail(flag?.createdByEmail, ''),
      createdByRole: cleanText(flag?.createdByRole, ''),
      tags: normalizeFlagTags(flag?.tags)
    }))
    .filter((flag) => Boolean(flag.reason));
};

export const dateInDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const sanitizeBoard = (board, index = 0) => ({
  id: cleanText(board?.id, `board-${Date.now()}-${index}`),
  name: cleanText(board?.name, `Дошка ${index + 1}`),
  icon: BOARD_ICON_SET.has(board?.icon) ? board.icon : 'bi-kanban',
  colorId: BOARD_COLOR_SET.has(board?.colorId) ? board.colorId : 'blue',
  createdAt: board?.createdAt || new Date().toISOString()
});

export const createUserProfile = ({
  id,
  name,
  email,
  phone = '',
  avatar = '',
  roles = [],
  isAdmin = false,
  joinedAt = new Date().toISOString()
}) => {
  return {
  id,
  name: cleanText(name, 'Користувач'),
  email: normalizeEmail(email),
  phone: cleanText(phone, ''),
  avatar: cleanText(avatar, ''),
  points: isAdmin ? 2500 : 420,
  subscription: isAdmin ? 'team' : 'free',
  paymentLinked: false,
  boards: [],
  activeBoardId: '',
  tasks: [],
  archivedBoards: [],
  archivedTasks: [],
  cart: [],
  purchases: [],
  pointLedger: [
    {
      id: `seed-${Date.now()}`,
      type: 'income',
      source: 'welcome',
      amount: isAdmin ? 2500 : 420,
      label: isAdmin ? 'Бонус власника' : 'Стартовий бонус',
      createdAt: new Date().toISOString()
    }
  ],
  settings: {
    reminders: true,
    weeklyDigest: true,
    pushAlerts: false,
    marketingEmails: false,
    loginAlerts: true,
    showOnlineStatus: true,
    publicStats: true,
    twoFactorAuth: false,
    compactMode: false,
    autoArchiveDoneTasks: false,
    smartSort: true,
    focusMode: false
  },
  flags: [],
  joinedAt,
  roles: normalizeRoles(roles),
  isAdmin,
  isBanned: false,
  banReason: '',
  banDescription: '',
  banExpiresAt: null,
  bannedAt: null
  };
};

const normalizeTaskTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag, index) => {
      const label = cleanText(tag?.label ?? tag?.name ?? '', '');
      if (!label) {
        return null;
      }

      const colorRaw = cleanText(tag?.color, TASK_TAG_COLOR_OPTIONS[0]).toLowerCase();
      const color = /^#[0-9a-f]{6}$/i.test(colorRaw) ? colorRaw : TASK_TAG_COLOR_OPTIONS[0];

      return {
        id: cleanText(tag?.id, `tag-${Date.now()}-${index}`),
        label,
        color
      };
    })
    .filter(Boolean)
    .slice(0, 8);
};

export const sanitizeTask = (task, index = 0) => {
  const status = ['todo', 'progress', 'done'].includes(task?.status) ? task.status : 'todo';
  return {
    id: Number.isFinite(Number(task?.id)) ? Number(task.id) : Date.now() + index,
    title: cleanText(task?.title, `Завдання ${index + 1}`),
    description: cleanText(task?.description, ''),
    priority: ['low', 'medium', 'high'].includes(task?.priority) ? task.priority : 'medium',
    dueDate: cleanText(task?.dueDate, dateInDays(0)),
    status,
    points: Number.isFinite(Number(task?.points)) ? Number(task.points) : 0,
    boardId: cleanText(task?.boardId, ''),
    tags: normalizeTaskTags(task?.tags),
    rewardClaimed: Boolean(task?.rewardClaimed),
    createdAt: task?.createdAt || new Date().toISOString(),
    completedAt: status === 'done' ? task?.completedAt || new Date().toISOString() : null,
    archivedAt: task?.archivedAt || null,
    archivedReason: cleanText(task?.archivedReason, '')
  };
};

export const sanitizeUser = (user) => {
  if (!user || typeof user !== 'object') {
    return createUserProfile({
      id: `user-${Date.now()}`,
      name: 'Користувач',
      email: `user-${Date.now()}@taskflow.app`
    });
  }

  const boards = Array.isArray(user.boards)
    ? user.boards.map((board, index) => sanitizeBoard(board, index))
    : [];
  const safeBoards = boards;
  const firstBoardId = safeBoards[0]?.id || '';
  const activeBoardId = cleanText(user.activeBoardId, firstBoardId);
  const normalizedActiveBoardId = firstBoardId && safeBoards.some((board) => board.id === activeBoardId)
    ? activeBoardId
    : firstBoardId;
  const normalizedTasks = Array.isArray(user.tasks)
    ? user.tasks.map((task, index) => {
        const safeTask = sanitizeTask(task, index);
        return {
          ...safeTask,
          boardId: safeBoards.some((board) => board.id === safeTask.boardId) ? safeTask.boardId : ''
        };
      }).filter((task) => Boolean(task.boardId))
    : [];
  const archivedBoards = Array.isArray(user.archivedBoards)
    ? user.archivedBoards.map((board, index) => ({
        ...sanitizeBoard(board, index),
        archivedAt: board?.archivedAt || new Date().toISOString()
      }))
    : [];
  const archivedTasks = Array.isArray(user.archivedTasks)
    ? user.archivedTasks.map((task, index) => sanitizeTask(task, index))
      .map((task) => ({
        ...task,
        boardId: cleanText(task.boardId, ''),
        archivedAt: task.archivedAt || new Date().toISOString(),
        archivedReason: cleanText(task.archivedReason, '')
      }))
    : [];

  const legacyStarterTitles = new Set([
    'Скласти тижневий план',
    'Зробити тренування 30 хвилин',
    'Прочитати 20 сторінок книги'
  ]);
  const hasLegacyStarterBoard = safeBoards.length === 1
    && safeBoards[0].name === 'Моя дошка'
    && safeBoards[0].icon === 'bi-kanban'
    && safeBoards[0].colorId === 'blue';
  const hasOnlyLegacyStarterTasks = normalizedTasks.length > 0
    && normalizedTasks.every((task) => legacyStarterTitles.has(task.title));
  const shouldCleanupLegacyWorkspace = hasLegacyStarterBoard && (normalizedTasks.length === 0 || hasOnlyLegacyStarterTasks);
  const finalBoards = shouldCleanupLegacyWorkspace ? [] : safeBoards;
  const finalTasks = shouldCleanupLegacyWorkspace ? [] : normalizedTasks;
  const finalActiveBoardId = shouldCleanupLegacyWorkspace
    ? ''
    : (finalBoards.some((board) => board.id === normalizedActiveBoardId) ? normalizedActiveBoardId : finalBoards[0]?.id || '');

  return {
    id: cleanText(user.id, `user-${Date.now()}`),
    name: cleanText(user.name, 'Користувач'),
    email: normalizeEmail(user.email, ''),
    phone: cleanText(user.phone, ''),
    avatar: cleanText(user.avatar, ''),
    points: Number.isFinite(Number(user.points)) ? Number(user.points) : 0,
    subscription: ['free', 'pro', 'team'].includes(user.subscription) ? user.subscription : 'free',
    paymentLinked: Boolean(user.paymentLinked),
    boards: finalBoards,
    activeBoardId: finalActiveBoardId,
    tasks: finalTasks,
    archivedBoards,
    archivedTasks,
    cart: Array.isArray(user.cart)
      ? user.cart
          .map((item) => ({
            productId: Number(item?.productId),
            quantity: Number(item?.quantity)
          }))
          .filter((item) => Number.isFinite(item.productId) && Number.isFinite(item.quantity) && item.quantity > 0)
      : [],
    purchases: Array.isArray(user.purchases)
      ? user.purchases.map((purchase, index) => ({
          id: purchase?.id || `purchase-${Date.now()}-${index}`,
          name: cleanText(purchase?.name, `Покупка ${index + 1}`),
          quantity: Number.isFinite(Number(purchase?.quantity)) ? Number(purchase.quantity) : 1,
          total: Number.isFinite(Number(purchase?.total)) ? Number(purchase.total) : 0,
          createdAt: purchase?.createdAt || new Date().toISOString()
        }))
      : [],
    pointLedger: Array.isArray(user.pointLedger)
      ? user.pointLedger.map((entry, index) => ({
          id: entry?.id || `entry-${Date.now()}-${index}`,
          type: entry?.type === 'expense' ? 'expense' : 'income',
          source: cleanText(entry?.source, 'system'),
          amount: Number.isFinite(Number(entry?.amount)) ? Number(entry.amount) : 0,
          label: cleanText(entry?.label, 'Операція'),
          createdAt: entry?.createdAt || new Date().toISOString()
        }))
      : [],
    settings: {
      reminders: Boolean(user.settings?.reminders),
      weeklyDigest: Boolean(user.settings?.weeklyDigest),
      pushAlerts: Boolean(user.settings?.pushAlerts),
      marketingEmails: Boolean(user.settings?.marketingEmails),
      loginAlerts: user.settings?.loginAlerts !== false,
      showOnlineStatus: user.settings?.showOnlineStatus !== false,
      publicStats: user.settings?.publicStats !== false,
      twoFactorAuth: Boolean(user.settings?.twoFactorAuth),
      compactMode: Boolean(user.settings?.compactMode),
      autoArchiveDoneTasks: Boolean(user.settings?.autoArchiveDoneTasks),
      smartSort: user.settings?.smartSort !== false,
      focusMode: Boolean(user.settings?.focusMode)
    },
    flags: normalizeFlags(user.flags),
    joinedAt: user.joinedAt || new Date().toISOString(),
    roles: normalizeRoles(user.roles),
    isAdmin: Boolean(user.isAdmin),
    isBanned: Boolean(user.isBanned),
    banReason: cleanText(user.banReason, ''),
    banDescription: cleanText(user.banDescription, ''),
    banExpiresAt: user.banExpiresAt || null,
    bannedAt: user.bannedAt || null
  };
};

export const sanitizeShopCategory = (category) => cleanText(category, '');

const sanitizeShopSpecs = (specs) => {
  if (!Array.isArray(specs)) {
    return [];
  }

  return specs
    .map((spec, index) => ({
      id: cleanText(spec?.id, `spec-${Date.now()}-${index}`),
      key: cleanText(spec?.key, ''),
      value: cleanText(spec?.value, '')
    }))
    .filter((spec) => spec.key && spec.value)
    .slice(0, 20);
};

const sanitizeProductImages = (product) => {
  const rawImages = Array.isArray(product?.images) ? product.images : [product?.image];
  return rawImages
    .map((item) => cleanText(item, ''))
    .filter(Boolean)
    .slice(0, 8);
};

const resolveNewUntil = (product) => {
  const parsed = Date.parse(product?.isNewUntil || '');
  if (Number.isFinite(parsed)) {
    return new Date(parsed).toISOString();
  }

  if (product?.isNew) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 5);
    return fallback.toISOString();
  }

  return null;
};

export const sanitizeShopProduct = (product) => {
  const images = sanitizeProductImages(product);
  const archivedFrom = cleanText(product?.archivedFrom, '');

  return {
    id: Number.isFinite(Number(product?.id)) ? Number(product.id) : Date.now() + Math.floor(Math.random() * 1000),
    name: cleanText(product?.name, 'Без назви'),
    price: Number.isFinite(Number(product?.price)) ? Number(product.price) : 0,
    category: cleanText(product?.category, 'Без категорії'),
    image: images[0] || '',
    images,
    description: cleanText(product?.description, ''),
    specs: sanitizeShopSpecs(product?.specs),
    isNew: Boolean(product?.isNew),
    isNewUntil: resolveNewUntil(product),
    discountPercent: Number.isFinite(Number(product?.discountPercent))
      ? Math.min(90, Math.max(0, Number(product.discountPercent)))
      : 0,
    archivedAt: product?.archivedAt || null,
    archivedFrom: archivedFrom === 'draft' ? 'draft' : (archivedFrom === 'catalog' ? 'catalog' : ''),
    createdAt: product?.createdAt || new Date().toISOString(),
    updatedAt: product?.updatedAt || new Date().toISOString()
  };
};

export const isProductNew = (product) => {
  const parsed = Date.parse(product?.isNewUntil || '');
  if (Number.isFinite(parsed)) {
    return parsed > Date.now();
  }

  return Boolean(product?.isNew);
};

export const getProductFinalPrice = (product) => {
  const basePrice = Number.isFinite(Number(product?.price)) ? Number(product.price) : 0;
  const discountPercent = Number.isFinite(Number(product?.discountPercent))
    ? Math.min(90, Math.max(0, Number(product.discountPercent)))
    : 0;

  return Math.max(0, Math.round(basePrice * (1 - discountPercent / 100)));
};

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

