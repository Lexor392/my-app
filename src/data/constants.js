export const MENU_ITEMS = [
  { key: 'tracker', label: 'РўСЂРµРєРµСЂ', icon: 'bi-kanban' },
  { key: 'shop', label: 'РњР°РіР°Р·РёРЅ', icon: 'bi-shop' },
  { key: 'stats', label: 'РЎС‚Р°С‚РёСЃС‚РёРєР°', icon: 'bi-graph-up-arrow' },
  { key: 'settings', label: 'РќР°Р»Р°С€С‚СѓРІР°РЅРЅСЏ', icon: 'bi-sliders' },
  { key: 'about', label: 'РџСЂРѕ РЅР°СЃ', icon: 'bi-info-circle' },
  { key: 'purchase', label: 'РџРѕРєСѓРїРєР°', icon: 'bi-gem' },
  { key: 'profile', label: 'РџСЂРѕС„С–Р»СЊ', icon: 'bi-person-circle' }
];

export const DEFAULT_SHOP_CATEGORIES = [
  'РљР»Р°РІС–Р°С‚СѓСЂРё',
  'РњС‹С€Рё',
  'РќР°РІСѓС€РЅРёРєРё',
  'РђРєСЃРµСЃСѓР°СЂРё',
  'РЎС‚СЂРёРј',
  'РђСѓРґРёРѕ'
];

export const DEFAULT_SHOP_PRODUCTS = [
  // Demo products removed. Fill catalog from admin panel.
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    title: 'Free',
    price: '0 РіСЂРЅ',
    features: ['Р”Рѕ 20 Р°РєС‚РёРІРЅРёС… Р·Р°РґР°С‡', 'Р‘Р°Р·РѕРІР° СЃС‚Р°С‚РёСЃС‚РёРєР°', '1 РґРѕС€РєР° РїСЂРѕС”РєС‚Сѓ']
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '399 РіСЂРЅ/РјС–СЃ',
    features: ['Р‘РµР·Р»С–РјС–С‚ Р·Р°РґР°С‡', 'Р РѕР·С€РёСЂРµРЅР° Р°РЅР°Р»С–С‚РёРєР°', 'РќР°РіР°РґСѓРІР°РЅРЅСЏ С‚Р° С–РЅС‚РµРіСЂР°С†С–С—']
  },
  {
    id: 'team',
    title: 'Team',
    price: '890 РіСЂРЅ/РјС–СЃ',
    features: ['РЎРїС–Р»СЊРЅС– РїСЂРѕСЃС‚РѕСЂРё', 'Р РѕР»С– С‚Р° РґРѕСЃС‚СѓРїРё', 'РљРѕРјР°РЅРґРЅС– Р·РІС–С‚Рё']
  }
];

export const POINT_PACKS = [
  { id: 'small', title: 'РЎС‚Р°СЂС‚', points: 250, price: '149 РіСЂРЅ' },
  { id: 'medium', title: 'РћРїС‚РёРјСѓРј', points: 700, price: '349 РіСЂРЅ' },
  { id: 'large', title: 'РњР°РєСЃРёРјСѓРј', points: 1500, price: '649 РіСЂРЅ' }
];

export const PRIORITY_META = {
  low: { label: 'РќРёР·СЊРєРёР№', className: 'bg-info-subtle text-info-emphasis', reward: 20 },
  medium: { label: 'РЎРµСЂРµРґРЅС–Р№', className: 'bg-warning-subtle text-warning-emphasis', reward: 35 },
  high: { label: 'Р’РёСЃРѕРєРёР№', className: 'bg-danger-subtle text-danger-emphasis', reward: 50 }
};

export const STATUS_META = {
  todo: { label: 'Р”Рѕ РІРёРєРѕРЅР°РЅРЅСЏ' },
  progress: { label: 'РЈ РїСЂРѕС†РµСЃС–' },
  done: { label: 'Р’РёРєРѕРЅР°РЅРѕ' }
};

export const STORAGE_KEYS = {
  theme: 'taskflow_theme_mode'
};

export const APP_VERSION = 'v1.9.0';

export const FLAG_TAG_OPTIONS = [
  { id: 'avatar', label: 'РђРІР°С‚Р°СЂ' },
  { id: 'username', label: "Р†Рј'СЏ РєРѕСЂРёСЃС‚СѓРІР°С‡Р°" },
  { id: 'tasks', label: 'Р—Р°РІРґР°РЅРЅСЏ' },
  { id: 'spam', label: 'РЎРїР°Рј' },
  { id: 'fraud', label: 'РЁР°С…СЂР°Р№СЃС‚РІРѕ' },
  { id: 'abuse', label: 'Р—Р»РѕРІР¶РёРІР°РЅРЅСЏ' },
  { id: 'payments', label: 'РџР»Р°С‚РµР¶С–' },
  { id: 'shop', label: 'РњР°РіР°Р·РёРЅ' },
  { id: 'security', label: 'Р‘РµР·РїРµРєР°' },
  { id: 'other', label: 'Р†РЅС€Рµ' }
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
  { id: 'sky', label: 'РќРµР±РµСЃРЅРёР№', accent: '#0ea5e9', soft: '#e0f2fe' },
  { id: 'ocean', label: 'РћРєРµР°РЅ', accent: '#0284c7', soft: '#dbeafe' },
  { id: 'indigo', label: 'Р†РЅРґРёРіРѕ', accent: '#4f46e5', soft: '#e0e7ff' },
  { id: 'violet', label: 'Р¤С–РѕР»РµС‚РѕРІРёР№', accent: '#7c3aed', soft: '#ede9fe' },
  { id: 'rose', label: 'Р РѕР¶РµРІРёР№', accent: '#e11d48', soft: '#ffe4e6' },
  { id: 'orange', label: 'РџРѕРјР°СЂР°РЅС‡РµРІРёР№', accent: '#ea580c', soft: '#ffedd5' },
  { id: 'amber', label: 'Р‘СѓСЂС€С‚РёРЅ', accent: '#d97706', soft: '#fef3c7' },
  { id: 'lime', label: 'Р›Р°Р№Рј', accent: '#65a30d', soft: '#ecfccb' },
  { id: 'emerald', label: 'РЎРјР°СЂР°РіРґ', accent: '#10b981', soft: '#d1fae5' },
  { id: 'teal', label: 'Р‘С–СЂСЋР·Р°', accent: '#0f766e', soft: '#ccfbf1' },
  { id: 'cyan', label: 'Р¦С–Р°РЅ', accent: '#0891b2', soft: '#cffafe' },
  { id: 'slate', label: 'РЎР»Р°РЅРµС†СЊ', accent: '#334155', soft: '#e2e8f0' },
  { id: 'stone', label: 'РљР°РјС–РЅСЊ', accent: '#57534e', soft: '#e7e5e4' },
  { id: 'red', label: 'Р§РµСЂРІРѕРЅРёР№', accent: '#dc2626', soft: '#fee2e2' },
  { id: 'fuchsia', label: 'Р¤СѓРєСЃС–СЏ', accent: '#c026d3', soft: '#fae8ff' },
  { id: 'blue', label: 'РЎРёРЅС–Р№', accent: '#2563eb', soft: '#dbeafe' },
  { id: 'green', label: 'Р—РµР»РµРЅРёР№', accent: '#16a34a', soft: '#dcfce7' },
  { id: 'gray', label: 'РЎС–СЂРёР№', accent: '#4b5563', soft: '#e5e7eb' }
];

export const TASK_TAG_COLOR_OPTIONS = [
  '#2563eb',
  '#0ea5e9',
  '#14b8a6',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#64748b'
];

export const RELEASE_NOTES = [
  {
    id: '2026-02-23-v1.9.0',
    version: 'v1.9.0',
    date: '2026-02-23',
    time: '23:59',
    title: 'РђСЂС…С–РІ Р·Р°РґР°С‡/РґРѕС€РѕРє, СЂРµРґР°РєС‚РѕСЂ С‚РѕРІР°СЂС–РІ С– РѕРЅРѕРІР»РµРЅРёР№ РјР°РіР°Р·РёРЅ',
    changes: [
      'Р’РёРґР°Р»РµРЅРЅСЏ РґРѕС‰РѕРє С– Р·Р°РґР°С‡ Сѓ С‚СЂРµРєРµСЂС– РїРµСЂРµРІРµРґРµРЅРѕ РІ Р°СЂС…С–РІР°С†С–СЋ Р· РѕРєСЂРµРјРёРј РµРєСЂР°РЅРѕРј Р°СЂС…С–РІСѓ С‚Р° РІС–РґРЅРѕРІР»РµРЅРЅСЏРј.',
      'Р”РѕРґР°РЅРѕ pop-up СЂРµРґР°РєС‚РѕСЂ Р·Р°РґР°С‡ С–Р· С‚РµРіР°РјРё С‚Р° РєРѕР»СЊРѕСЂР°РјРё С‚РµРіС–РІ.',
      'РћРЅРѕРІР»РµРЅРѕ РІС–С‚СЂРёРЅСѓ РјР°РіР°Р·РёРЅСѓ: РєРѕРјРїР°РєС‚РЅС–С€С– РєР°СЂС‚РєРё, РєРЅРѕРїРєР° РїРµСЂРµРіР»СЏРґСѓ С‚Р° СЃС‚РѕСЂС–РЅРєР° С‚РѕРІР°СЂСѓ Р· РіР°Р»РµСЂРµС”СЋ С– fullscreen.',
      'РџРѕРІРЅС–СЃС‚СЋ РїРµСЂРµСЂРѕР±Р»РµРЅРѕ Р°РґРјС–РЅ-СЂРµРґР°РєС‚РѕСЂ РјР°РіР°Р·РёРЅСѓ: РїРѕРєСЂРѕРєРѕРІРёР№ РєРІС–Р· РґР»СЏ С‚РѕРІР°СЂСѓ, РѕРєСЂРµРјРёР№ pop-up РєР°С‚РµРіРѕСЂС–Р№, С‡РµСЂРЅРµС‚РєРё С‚РѕРІР°СЂС–РІ.',
      'РЈ РїРѕРєСЂРѕРєРѕРІРѕРјСѓ СЂРµРґР°РєС‚РѕСЂС– РґРѕРґР°РЅРѕ Р·Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ РІР»Р°СЃРЅРёС… С„РѕС‚Рѕ С‚РѕРІР°СЂСѓ С‡РµСЂРµР· С„Р°Р№Р»Рё Р·Р°РјС–СЃС‚СЊ РѕР±РѕРІвЂ™СЏР·РєРѕРІРёС… URL.',
      'РџРѕРєСЂР°С‰РµРЅРѕ РєРѕРЅС‚СЂР°СЃС‚РЅС–СЃС‚СЊ С‚РµРєСЃС‚Сѓ РІ С‚РµРјРЅС–Р№ С‚РµРјС– (РІРєР»СЋС‡РЅРѕ Р· РєРЅРѕРїРєРѕСЋ РІС…РѕРґСѓ С‡РµСЂРµР· Google).'
    ]
  },
  {
    id: '2026-02-22-v1.8.3',
    version: 'v1.8.3',
    date: '2026-02-22',
    time: '23:59',
    title: 'РџРѕРєСЂР°С‰РµРЅРЅСЏ С„С–Р»СЊС‚СЂР°С†С–С— РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ РІ Р°РґРјС–РЅС†С–',
    changes: [
      'Р¤С–Р»СЊС‚СЂРё СЃРїРёСЃРєСѓ РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ РїРµСЂРµРЅРµСЃРµРЅРѕ Сѓ РІРёРїР°РґР°СЋС‡Рµ РјРµРЅСЋ Р·Р° РєРЅРѕРїРєРѕСЋ Р· С–РєРѕРЅРєРѕСЋ.',
      'Р”РѕРґР°РЅРѕ С–РЅРґРёРєР°С‚РѕСЂ РєС–Р»СЊРєРѕСЃС‚С– Р°РєС‚РёРІРЅРёС… С„С–Р»СЊС‚СЂС–РІ РЅР° РєРЅРѕРїС†С– РјРµРЅСЋ С„С–Р»СЊС‚СЂР°С†С–С—.',
      'Р”РѕРґР°РЅРѕ С€РІРёРґРєРµ СЃРєРёРґР°РЅРЅСЏ С„С–Р»СЊС‚СЂС–РІ Сѓ РІРёРїР°РґР°СЋС‡РѕРјСѓ РјРµРЅСЋ.',
      'РџРѕС€СѓРє РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ СЂРѕР·С€РёСЂРµРЅРѕ: С‚РµРїРµСЂ РїС–РґС‚СЂРёРјСѓС” РїРѕС€СѓРє Р·Р° С‚РµРіР°РјРё С„Р»Р°Р¶РєС–РІ С– РїСЂРёС‡РёРЅР°РјРё РїРѕР·РЅР°С‡РѕРє (РІРєР»СЋС‡РЅРѕ Р· С„РѕСЂРјР°С‚РѕРј #С‚РµРі).'
    ]
  },
  {
    id: '2026-02-22-v1.8.2',
    version: 'v1.8.2',
    date: '2026-02-22',
    time: '23:59',
    title: 'РЎС‚Р°Р±С–Р»С–Р·Р°С†С–СЏ РІРёС…РѕРґСѓ Р· Р°РєР°СѓРЅС‚Р° С– РїРѕР·РёС†С–С— СЃРїРѕРІС–С‰РµРЅСЊ',
    changes: [
      'Р’РёРїСЂР°РІР»РµРЅРѕ logout: РїРѕРјРёР»РєРё РѕРЅРѕРІР»РµРЅРЅСЏ presence Р±С–Р»СЊС€Рµ РЅРµ Р±Р»РѕРєСѓСЋС‚СЊ Р·Р°РІРµСЂС€РµРЅРЅСЏ СЃРµСЃС–С—.',
      'РџРµСЂРµРЅРµСЃРµРЅРѕ РїР»Р°РІР°СЋС‡С– СЃРїРѕРІС–С‰РµРЅРЅСЏ Сѓ Р»С–РІРёР№ РЅРёР¶РЅС–Р№ РєСѓС‚ РЅР° РґРµСЃРєС‚РѕРїС– С‚Р° РјРѕР±С–Р»СЊРЅРёС… РµРєСЂР°РЅР°С….'
    ]
  },
  {
    id: '2026-02-22-v1.8.1',
    version: 'v1.8.1',
    date: '2026-02-22',
    time: '23:59',
    title: 'Р‘СѓСЂРіРµСЂ-РјРµРЅСЋ С– РѕС‡РёС‰РµРЅРЅСЏ РґРµРјРѕ-РґР°РЅРёС…',
    changes: [
      'РњРѕР±С–Р»СЊРЅСѓ РЅР°РІС–РіР°С†С–СЋ РїРµСЂРµРІРµРґРµРЅРѕ Сѓ С„РѕСЂРјР°С‚ Р±СѓСЂРіРµСЂ-РјРµРЅСЋ Р· offcanvas-СЃР°Р№РґР±Р°СЂРѕРј С‚Р° Р·Р°С‚РµРјРЅРµРЅРЅСЏРј С„РѕРЅСѓ.',
      'РћРЅРѕРІР»РµРЅРѕ РІРµСЂС…РЅСЋ РїР°РЅРµР»СЊ: РґРѕРґР°РЅРѕ РєРЅРѕРїРєСѓ РІС–РґРєСЂРёС‚С‚СЏ РјРµРЅСЋ РґР»СЏ РµРєСЂР°РЅС–РІ РґРѕ 1100px.',
      'Р’РёРґР°Р»РµРЅРѕ СЃС‚Р°СЂС‚РѕРІС– РґРµРјРѕ-С‚РѕРІР°СЂРё Р· РєРѕРґСѓ РјР°РіР°Р·РёРЅСѓ С‚Р° РґРѕРґР°РЅРѕ Р°РІС‚РѕРјР°С‚РёС‡РЅРµ РѕС‡РёС‰РµРЅРЅСЏ СЃС‚Р°СЂРѕРіРѕ РґРµРјРѕ-РєР°С‚Р°Р»РѕРіСѓ.',
      'РќРѕРІС– Р°РєР°СѓРЅС‚Рё Р±С–Р»СЊС€Рµ РЅРµ РѕС‚СЂРёРјСѓСЋС‚СЊ С‚РµСЃС‚РѕРІС– РґРѕС€РєРё С– С‚РµСЃС‚РѕРІС– Р·Р°РґР°С‡С– РїСЂРё СЂРµС”СЃС‚СЂР°С†С–С—.',
      'Р”РѕРґР°РЅРѕ РѕС‡РёС‰РµРЅРЅСЏ legacy-СЃС‚Р°СЂС‚РѕРІРёС… Р·Р°РґР°С‡/РґРѕС€РєРё Сѓ РїСЂРѕС„С–Р»СЏС… Р·С– СЃС‚Р°СЂРёРј РґРµРјРѕ-РЅР°Р±РѕСЂРѕРј.',
      'Р”РѕРґР°РЅРѕ РїРѕСЂРѕР¶РЅС–Р№ СЃС‚Р°РЅ Сѓ С‚СЂРµРєРµСЂС– Р· РїС–РґРєР°Р·РєРѕСЋ В«РЎС‚РІРѕСЂРё РЅРѕРІСѓ РґРѕС€РєСѓВ».'
    ]
  },
  {
    id: '2026-02-22-v1.8.0',
    version: 'v1.8.0',
    date: '2026-02-22',
    time: '23:59',
    title: 'РћРЅРѕРІР»РµРЅРЅСЏ РґРѕС‰РѕРє С– РїРѕРІРЅРёР№ mobile-first Р°РґР°РїС‚РёРІ',
    changes: [
      'Р”РѕРґР°РЅРѕ РїРѕРІРЅРѕС†С–РЅРЅРµ СЂРµРґР°РіСѓРІР°РЅРЅСЏ РґРѕС‰РѕРє: Р·РјС–РЅР° РЅР°Р·РІРё, С–РєРѕРЅРєРё С‚Р° РєРѕР»СЊРѕСЂСѓ Р· С”РґРёРЅРѕРіРѕ РјРѕРґР°Р»СЊРЅРѕРіРѕ РІС–РєРЅР°.',
      'Р”РѕРґР°РЅРѕ РІРёРґР°Р»РµРЅРЅСЏ РґРѕС‰РѕРє Р· РїРµСЂРµРЅРѕСЃРѕРј Р·Р°РґР°С‡ Сѓ СЂРµР·РµСЂРІРЅСѓ РґРѕС€РєСѓ С‚Р° Р·Р°С…РёСЃС‚РѕРј РІС–Рґ РІРёРґР°Р»РµРЅРЅСЏ РѕСЃС‚Р°РЅРЅСЊРѕС— РґРѕС€РєРё.',
      'РћРЅРѕРІР»РµРЅРѕ СЃС‚Р°СЂС‚РѕРІСѓ СЃС‚РѕСЂС–РЅРєСѓ С‚СЂРµРєРµСЂР°: hero-Р±Р»РѕРє, KPI РїРѕ РґРѕС€РєР°С… С– Р·Р°РґР°С‡Р°С…, Р·СЂСѓС‡РЅС– РґС–С— СЂРµРґР°РіСѓРІР°РЅРЅСЏ/РІРёРґР°Р»РµРЅРЅСЏ РЅР° РєР°СЂС‚С†С–.',
      'Р’РёРїСЂР°РІР»РµРЅРѕ СЂРѕР·РјС–С‚РєСѓ РєР°СЂС‚РѕРє РґРѕС‰РѕРє РґР»СЏ СЃС‚Р°Р±С–Р»СЊРЅРѕС— СЂРѕР±РѕС‚Рё РЅР° РјРѕР±С–Р»СЊРЅРёС… (Р±РµР· РІРєР»Р°РґРµРЅРёС… РєРЅРѕРїРѕРє Сѓ РєРЅРѕРїРєСѓ).',
      'Р”РѕРґР°РЅРѕ РІС–РґСЃСѓС‚РЅС– СЃС‚РёР»С– РґР»СЏ РЅРѕРІРёС… Р±Р»РѕРєС–РІ С‚СЂРµРєРµСЂР°: hero-grid, РґС–С— РЅР° РєР°СЂС‚РєР°С…, KPI-С‡С–РїРё, focus-СЃС‚Р°РЅРё.',
      'Р РµР°Р»С–Р·РѕРІР°РЅРѕ СЂРѕР·С€РёСЂРµРЅРёР№ Р°РґР°РїС‚РёРІ РґР»СЏ РІСЃСЊРѕРіРѕ С–РЅС‚РµСЂС„РµР№СЃСѓ РЅР° 1200/1100/992/768/576/420 px: РјРµРЅСЋ, topbar, РјРѕРґР°Р»СЊРЅС– РІС–РєРЅР°, РєР°РЅР±Р°РЅ, РєР°СЂС‚РєРё, РєРѕС€РёРє С‚Р° Р°РґРјС–РЅ-Р±Р»РѕРєРё.',
      'РћРЅРѕРІР»РµРЅРѕ РІРµСЂСЃС–СЋ Р·Р°СЃС‚РѕСЃСѓРЅРєСѓ РґРѕ v1.8.0.'
    ]
  },
  {
    id: '2026-02-22-v1.7.1',
    version: 'v1.7.1',
    date: '2026-02-22',
    time: '23:59',
    title: 'Р”РѕРѕРїСЂР°С†СЋРІР°РЅРЅСЏ СЃС‚РёР»С–РІ С– СЃС‚СЂСѓРєС‚СѓСЂРё Р°РґРјС–РЅРєРё',
    changes: [
      'Р РѕР·РґС–Р»РµРЅРѕ AdminPage РЅР° РѕРєСЂРµРјС– СЃРµРєС†С–С— С‚Р° РјРѕРґР°Р»СЊРЅС– РєРѕРјРїРѕРЅРµРЅС‚Рё РґР»СЏ Р·СЂСѓС‡РЅС–С€РѕС— РїС–РґС‚СЂРёРјРєРё.',
      'Р”РѕРґР°РЅРѕ РІС–РґСЃСѓС‚РЅС– СЃС‚РёР»С– РґР»СЏ РґРѕС‰РѕРє С‚СЂРµРєРµСЂР°, Р°РЅР°Р»С–С‚РёРєРё Р°РґРјС–РЅРєРё, СЃС‚РѕСЂС–РЅРєРё В«РџСЂРѕ РЅР°СЃВ» С‚Р° СЃРµРєС†С–Р№ РїРѕРєСѓРїРєРё.',
      'Р’РёРїСЂР°РІР»РµРЅРѕ СЃС‚РёР»С– РІРµСЂС…РЅСЊРѕРіРѕ РјРµРЅСЋ Р°РєР°СѓРЅС‚Р°: РЅРёР¶С‡РёР№ z-index topbar, РїРѕРІРЅРµ Р·Р°РїРѕРІРЅРµРЅРЅСЏ Р°РІР°С‚Р°СЂР°, РІРёС‰РёР№ С€Р°СЂ РІРёРїР°РґР°СЋС‡РѕРіРѕ Р±Р»РѕРєСѓ.',
      'Р”РѕРґР°РЅРѕ sticky-РїРѕРІРµРґС–РЅРєСѓ Р»С–РІРѕРіРѕ РјРµРЅСЋ С‚Р° Р°РґР°РїС‚РёРІРЅС– СЃС‚РёР»С– РґР»СЏ РЅРѕРІРёС… Р±Р»РѕРєС–РІ.'
    ]
  },
  {
    id: '2026-02-22-v1.7.0',
    version: 'v1.7.0',
    date: '2026-02-22',
    time: '23:55',
    title: 'Р”РѕС€РєРё, Р°РЅР°Р»С–С‚РёРєР°, РїР°РіС–РЅР°С†С–СЏ С‚Р° СѓРєСЂР°С—РЅС–Р·Р°С†С–СЏ',
    changes: [
      'Р”РѕРґР°РЅРѕ СЂРµР¶РёРј РґРѕС‰РѕРє Сѓ С‚СЂРµРєРµСЂС–: СЃС‚РІРѕСЂРµРЅРЅСЏ РґРѕС€РєРё, РІРёР±С–СЂ С–РєРѕРЅРєРё С‚Р° РєРѕР»СЊРѕСЂСѓ, РѕРєСЂРµРјС– Р·Р°РґР°С‡С– РїРѕ РґРѕС€РєР°С….',
      'Р”РѕРґР°РЅРѕ РїР°РіС–РЅР°С†С–СЋ РґР»СЏ РґРѕС‰РѕРє, РјР°РіР°Р·РёРЅСѓ, СЃРїРёСЃРєСѓ Р°РєР°СѓРЅС‚С–РІ С‚Р° С‚РѕРІР°СЂС–РІ Р°РґРјС–РЅ-РїР°РЅРµР»С–.',
      'Р›С–РІРµ РјРµРЅСЋ СЃС‚Р°Р»Рѕ sticky, РґРѕРґР°РЅРѕ live-Р»С–С‡РёР»СЊРЅРёРє РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ РѕРЅР»Р°Р№РЅ С‚Р° Р±Р»РѕРє РІРµСЂСЃС–С—.',
      'Р РѕР·С€РёСЂРµРЅРѕ Р°РґРјС–РЅ-РїР°РЅРµР»СЊ: С„С–Р»СЊС‚СЂРё Р°РєР°СѓРЅС‚С–РІ, С‚РµРіРё С„Р»Р°Р¶РєС–РІ, РѕРєСЂРµРјРёР№ СЂРѕР·РґС–Р» Р·Р°РіР°Р»СЊРЅРѕС— СЃС‚Р°С‚РёСЃС‚РёРєРё Р· РіС–СЃС‚РѕРіСЂР°РјР°РјРё.',
      'Р—РЅРёР¶РµРЅРѕ z-index topbar, РІРёРїСЂР°РІР»РµРЅРѕ РІС–РґРѕР±СЂР°Р¶РµРЅРЅСЏ Р°РІР°С‚Р°СЂР° РІ РєРЅРѕРїС†С– РїСЂРѕС„С–Р»СЋ.',
      'РЎР°Р№С‚ РѕРЅРѕРІР»РµРЅРѕ СѓРєСЂР°С—РЅСЃСЊРєРѕСЋ РјРѕРІРѕСЋ, С†С–РЅРё РїРµСЂРµРІРµРґРµРЅРѕ РІ РіСЂРёРІРЅС–, Р±Р»РѕРє В«РџСЂРѕ РЅР°СЃВ» СЂРѕР·С€РёСЂРµРЅРѕ.',
      'РћРЅРѕРІР»РµРЅРѕ release notes С‚Р° РІРµСЂСЃС–РѕРЅСѓРІР°РЅРЅСЏ РґРѕ v1.7.0.'
    ]
  },
  {
    id: '2026-02-22-v1.6.0',
    version: 'v1.6.0',
    date: '2026-02-22',
    time: '22:40',
    title: 'Р‘РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ Рё РјРѕРґРµСЂР°С†РёСЏ Р°РєРєР°СѓРЅС‚РѕРІ',
    changes: [
      'РџРµСЂРµРЅРµСЃРµРЅ РІС‹С…РѕРґ РёР· Р»РµРІРѕРіРѕ РјРµРЅСЋ РІ РїСЂРѕС„РёР»СЊРЅРѕРµ РјРµРЅСЋ РІРµСЂС…РЅРµР№ РїР°РЅРµР»Рё Рё РІ РЅР°СЃС‚СЂРѕР№РєРё Р°РєРєР°СѓРЅС‚Р°.',
      'Р”РѕР±Р°РІР»РµРЅР° РєРЅРѕРїРєР° СѓРґР°Р»РµРЅРёСЏ Р°РєРєР°СѓРЅС‚Р° РІ СЂР°Р·РґРµР»Рµ РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё.',
      'Р РµР°Р»РёР·РѕРІР°РЅРѕ Р±Р°РЅ-РѕРєРЅРѕ РІ Р°РґРјРёРЅРєРµ: РїСЂРёС‡РёРЅР°, РѕРїРёСЃР°РЅРёРµ, СЃСЂРѕРє Р±Р»РѕРєРёСЂРѕРІРєРё.',
      'Р”РѕР±Р°РІР»РµРЅ РїРѕРєР°Р· РїСЂРёС‡РёРЅС‹ Р±Р»РѕРєРёСЂРѕРІРєРё РїСЂРё РїРѕРїС‹С‚РєРµ РІС…РѕРґР° РІ Р·Р°Р±Р°РЅРµРЅРЅС‹Р№ Р°РєРєР°СѓРЅС‚.',
      'Р”РѕР±Р°РІР»РµРЅР° РѕС‡РµСЂРµРґСЊ email-СѓРІРµРґРѕРјР»РµРЅРёР№ Рѕ Р±Р°РЅРµ С‡РµСЂРµР· РєРѕР»Р»РµРєС†РёСЋ mail (Firebase Trigger Email).',
      'Р’ Р°РґРјРёРЅ-РїР°РЅРµР»Рё РґРѕР±Р°РІР»РµРЅ РѕС‚РґРµР»СЊРЅС‹Р№ СЂР°Р·РґРµР» СЃ РІРµСЂСЃРёРµР№ Рё РёСЃС‚РѕСЂРёРµР№ РёР·РјРµРЅРµРЅРёР№.'
    ]
  },
  {
    id: '2026-02-22-v1.5.0',
    version: 'v1.5.0',
    date: '2026-02-22',
    time: '19:10',
    title: 'РќРѕРІС‹Р№ UX РїСЂРѕС„РёР»СЏ, РЅР°СЃС‚СЂРѕРµРє Рё С‚СЂРµРєРµСЂР°',
    changes: [
      'РџСЂРѕС„РёР»СЊ РїРµСЂРµРІРµРґРµРЅ РІ С„РѕСЂРјР°С‚ Р°РЅР°Р»РёС‚РёРєРё: KPI, РїСЂРѕРіСЂРµСЃСЃ Р·Р°РґР°С‡, Р°РєС‚РёРІРЅРѕСЃС‚СЊ Рё РїРѕРєСѓРїРєРё.',
      'РќР°СЃС‚СЂРѕР№РєРё СЂР°Р·Р±РёС‚С‹ РЅР° СЂР°Р·РґРµР»С‹: Р°РєРєР°СѓРЅС‚, РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚СЊ, РѕС„РѕСЂРјР»РµРЅРёРµ, СѓРІРµРґРѕРјР»РµРЅРёСЏ, СЂР°Р±РѕС‡РµРµ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ.',
      'Р”РѕР±Р°РІР»РµРЅ РїРµСЂРµС…РѕРґ РёР· РјРµРЅСЋ Р°РєРєР°СѓРЅС‚Р° СЃСЂР°Р·Сѓ РІ РїРѕРґСЂР°Р·РґРµР» РЅР°СЃС‚СЂРѕРµРє Р°РєРєР°СѓРЅС‚Р°.',
      'Р’ С‚СЂРµРєРµСЂРµ РґРѕР±Р°РІР»РµРЅ drag-and-drop Р·Р°РґР°С‡ РјРµР¶РґСѓ РєРѕР»РѕРЅРєР°РјРё.',
      'Р¤РѕСЂРјР° СЃРѕР·РґР°РЅРёСЏ Р·Р°РґР°С‡Рё РїРµСЂРµРЅРµСЃРµРЅР° РІ pop-up c РєРЅРѕРїРєР°РјРё В«РЎРѕС…СЂР°РЅРёС‚СЊВ» Рё В«РћС‚РјРµРЅРёС‚СЊВ».',
      'Р¤РѕС‚Рѕ РїСЂРѕС„РёР»СЏ РІ РєР»СЋС‡РµРІС‹С… РјРµСЃС‚Р°С… РѕРіСЂР°РЅРёС‡РµРЅРѕ РєРѕРЅС‚РµР№РЅРµСЂРѕРј 300x300 Рё РѕС‚РєСЂС‹РІР°РµС‚СЃСЏ РІ РїРѕР»РЅРѕСЌРєСЂР°РЅРЅРѕРј СЂРµР¶РёРјРµ.'
    ]
  },
  {
    id: '2026-02-21-v1.4.0',
    version: 'v1.4.0',
    date: '2026-02-21',
    time: '16:25',
    title: 'Р РѕР»Рё Рё СЂР°СЃС€РёСЂРµРЅРёРµ Р°РґРјРёРЅРєРё',
    changes: [
      'Р”РѕР±Р°РІР»РµРЅС‹ СЂРѕР»Рё operator, task_moderator, shop_moderator СЃ СЂРµР°Р»СЊРЅС‹РјРё РѕРіСЂР°РЅРёС‡РµРЅРёСЏРјРё РїРѕ РґРµР№СЃС‚РІРёСЏРј.',
      'Р РµР°Р»РёР·РѕРІР°РЅС‹ С„Р»Р°Р¶РєРё Р°РєРєР°СѓРЅС‚РѕРІ: РјРѕРґРµСЂР°С‚РѕСЂ СѓРєР°Р·С‹РІР°РµС‚ РїСЂРёС‡РёРЅСѓ, owner РІРёРґРёС‚ РѕС‡РµСЂРµРґСЊ С„Р»Р°Р¶РєРѕРІ.',
      'Р’ СЃРїРёСЃРѕРє РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ РґРѕР±Р°РІР»РµРЅС‹ Р°РІР°С‚Р°СЂС‹ Рё РїРѕРґСЂРѕР±РЅС‹Р№ Р±Р»РѕРє РїСЂРѕРІРµСЂРєРё РїСЂРѕС„РёР»СЏ.',
      'Р’ Р°РґРјРёРЅРєРµ РґРѕР±Р°РІР»РµРЅ Р±Р»РѕРє СЃС‚Р°С‚РёСЃС‚РёРєРё РїРѕ РІС‹Р±СЂР°РЅРЅРѕРјСѓ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ.',
      'РСЃРїСЂР°РІР»РµРЅС‹ РїСЂР°РІР° РЅР° РјРѕРґРµСЂР°С†РёСЋ РјР°РіР°Р·РёРЅР° РґР»СЏ СЂРѕР»РµР№ shop_moderator Рё operator.'
    ]
  },
  {
    id: '2026-02-20-v1.3.0',
    version: 'v1.3.0',
    date: '2026-02-20',
    time: '13:40',
    title: 'РњР°РіР°Р·РёРЅ Рё РєР°С‚Р°Р»РѕРі',
    changes: [
      'РРєРѕРЅРєРё С‚РѕРІР°СЂРѕРІ Р·Р°РјРµРЅРµРЅС‹ РЅР° РєР°СЂС‚РѕС‡РєРё СЃ СЂРµР°Р»СЊРЅС‹РјРё РёР·РѕР±СЂР°Р¶РµРЅРёСЏРјРё.',
      'Р”РѕР±Р°РІР»РµРЅС‹ С‚РµСЃС‚РѕРІС‹Рµ С‚РѕРІР°СЂС‹, С„РёР»СЊС‚СЂР°С†РёСЏ Рё РїРѕРёСЃРє РїРѕ РєР°С‚Р°Р»РѕРіСѓ.',
      'Р”РѕР±Р°РІР»РµРЅС‹ Р±РµР№РґР¶Рё В«РќРѕРІРёРЅРєР°В» Рё РїРѕРґРґРµСЂР¶РєР° СЃРєРёРґРѕРє СЃ РѕС‚РѕР±СЂР°Р¶РµРЅРёРµРј СЃС‚Р°СЂРѕР№ Рё РЅРѕРІРѕР№ С†РµРЅС‹.',
      'Р Р°СЃС€РёСЂРµРЅРѕ СѓРїСЂР°РІР»РµРЅРёРµ РјР°РіР°Р·РёРЅРѕРј: РєР°С‚РµРіРѕСЂРёРё Рё С‚РѕРІР°СЂС‹ РјРѕР¶РЅРѕ СЃРѕР·РґР°РІР°С‚СЊ, РёР·РјРµРЅСЏС‚СЊ Рё СѓРґР°Р»СЏС‚СЊ.'
    ]
  },
  {
    id: '2026-02-19-v1.2.0',
    version: 'v1.2.0',
    date: '2026-02-19',
    time: '18:50',
    title: 'РђРІС‚РѕСЂРёР·Р°С†РёСЏ Рё Firebase',
    changes: [
      'РџРѕРґРєР»СЋС‡РµРЅР° Firebase Auth Рё Firestore РґР»СЏ СЂРµР°Р»СЊРЅРѕР№ Р°РІС‚РѕСЂРёР·Р°С†РёРё Рё С…СЂР°РЅРµРЅРёСЏ РґР°РЅРЅС‹С….',
      'Р”РѕР±Р°РІР»РµРЅС‹ СЂРµРіРёСЃС‚СЂР°С†РёСЏ, РІС…РѕРґ РїРѕ email/РїР°СЂРѕР»СЋ Рё РІС…РѕРґ С‡РµСЂРµР· Google.',
      'Р”РѕР±Р°РІР»РµРЅР° РЅРѕСЂРјР°Р»РёР·Р°С†РёСЏ Рё Р·Р°С‰РёС‚Р° РїРѕР»СЊР·РѕРІР°С‚РµР»СЊСЃРєРёС… РґР°РЅРЅС‹С… РїСЂРё Р·Р°РїРёСЃРё РІ Р±Р°Р·Сѓ.',
      'Р РµР°Р»РёР·РѕРІР°РЅС‹ РїСЂР°РІРёР»Р° Firestore РґР»СЏ owner Рё СЂРѕР»РµРІРѕР№ РјРѕРґРµР»Рё.'
    ]
  },
  {
    id: '2026-02-18-v1.1.0',
    version: 'v1.1.0',
    date: '2026-02-18',
    time: '14:15',
    title: 'РЎС‚Р°Р±РёР»РёР·Р°С†РёСЏ РёРЅС‚РµСЂС„РµР№СЃР°',
    changes: [
      'РСЃРїСЂР°РІР»РµРЅС‹ РїСЂРѕР±Р»РµРјС‹ СЃ СЂСѓСЃСЃРєРёРјРё СЃС‚СЂРѕРєР°РјРё Рё Р±РёС‚РѕР№ РєРѕРґРёСЂРѕРІРєРѕР№.',
      'РћР±РЅРѕРІР»РµРЅС‹ С€СЂРёС„С‚С‹ СЃ РїРѕРґРґРµСЂР¶РєРѕР№ РєРёСЂРёР»Р»РёС†С‹.',
      'РџСЂРѕРІРµРґРµРЅР° СЂР°СЃРєР»Р°РґРєР° Р»РѕРіРёРєРё РїРѕ РєРѕРјРїРѕРЅРµРЅС‚Р°Рј РґР»СЏ СѓРјРµРЅСЊС€РµРЅРёСЏ РЅР°РіСЂСѓР·РєРё РЅР° App.js.',
      'РЈР»СѓС‡С€РµРЅС‹ СЃС‚РёР»Рё Рё С‡РёС‚Р°РµРјРѕСЃС‚СЊ РёРЅС‚РµСЂС„РµР№СЃР° РЅР° РјРѕР±РёР»СЊРЅС‹С… Рё РґРµСЃРєС‚РѕРїРЅС‹С… СЌРєСЂР°РЅР°С….'
    ]
  }
];

export const STAFF_ROLE_OPTIONS = [
  {
    id: 'task_moderator',
    label: 'РњРѕРґРµСЂР°С‚РѕСЂ Р·Р°РґР°С‡',
    description: 'РњРѕР¶Рµ РјРѕРґРµСЂСѓРІР°С‚Рё Р·Р°РґР°С‡С– С‚Р° Р·Р°РґР°С‡С– РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ.'
  },
  {
    id: 'shop_moderator',
    label: 'РњРѕРґРµСЂР°С‚РѕСЂ РјР°РіР°Р·РёРЅСѓ',
    description: 'РњРѕР¶Рµ РјРѕРґРµСЂСѓРІР°С‚Рё РєР°С‚Р°Р»РѕРі РјР°РіР°Р·РёРЅСѓ С‚Р° РєР°С‚РµРіРѕСЂС–С—.'
  },
  {
    id: 'operator',
    label: 'РћРїРµСЂР°С‚РѕСЂ',
    description: 'РњРѕР¶Рµ РІРµСЃС‚Рё Р°РєР°СѓРЅС‚Рё, Р±Р°Р»Р°РЅСЃ С– Р·РІРµСЂРЅРµРЅРЅСЏ РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ.'
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
      createdByName: cleanText(flag?.createdByName, 'РњРѕРґРµСЂР°С‚РѕСЂ'),
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
  name: cleanText(board?.name, `Р”РѕС€РєР° ${index + 1}`),
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
  name: cleanText(name, 'РљРѕСЂРёСЃС‚СѓРІР°С‡'),
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
      label: isAdmin ? 'Р‘РѕРЅСѓСЃ РІР»Р°СЃРЅРёРєР°' : 'РЎС‚Р°СЂС‚РѕРІРёР№ Р±РѕРЅСѓСЃ',
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
    title: cleanText(task?.title, `Р—Р°РІРґР°РЅРЅСЏ ${index + 1}`),
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
      name: 'РљРѕСЂРёСЃС‚СѓРІР°С‡',
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
    'РЎРєР»Р°СЃС‚Рё С‚РёР¶РЅРµРІРёР№ РїР»Р°РЅ',
    'Р—СЂРѕР±РёС‚Рё С‚СЂРµРЅСѓРІР°РЅРЅСЏ 30 С…РІРёР»РёРЅ',
    'РџСЂРѕС‡РёС‚Р°С‚Рё 20 СЃС‚РѕСЂС–РЅРѕРє РєРЅРёРіРё'
  ]);
  const hasLegacyStarterBoard = safeBoards.length === 1
    && safeBoards[0].name === 'РњРѕСЏ РґРѕС€РєР°'
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
    name: cleanText(user.name, 'РљРѕСЂРёСЃС‚СѓРІР°С‡'),
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
          name: cleanText(purchase?.name, `РџРѕРєСѓРїРєР° ${index + 1}`),
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
          label: cleanText(entry?.label, 'РћРїРµСЂР°С†С–СЏ'),
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

