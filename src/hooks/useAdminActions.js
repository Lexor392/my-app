import { useCallback } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { OWNER_EMAIL, sanitizeShopCategory, sanitizeShopProduct, sanitizeTask, sanitizeUser } from '../data/constants';
import { db } from '../lib/firebase';

export default function useAdminActions({
  currentUser,
  allUsers,
  permissions,
  persistUser,
  showAlert,
  shopCategories,
  shopProducts,
  shopDraftProducts,
  shopArchivedProducts,
  persistShop
}) {
  const withTargetUser = useCallback(
    async ({ userId, requiredPermission, mutator, successMessage }) => {
      if (!permissions?.[requiredPermission]) {
        showAlert('danger', 'У вас немає прав для цієї дії.');
        return false;
      }

      const target = allUsers.find((user) => user.id === userId);
      if (!target) {
        showAlert('warning', 'Користувача не знайдено.');
        return false;
      }

      if (!permissions.isOwner && target.isAdmin) {
        showAlert('danger', 'Зміни owner-акаунта заборонені.');
        return false;
      }

      const draft = JSON.parse(JSON.stringify(target));
      const mutated = mutator(draft) || draft;
      const normalized = sanitizeUser({ ...mutated, id: userId });

      if ((normalized.email || '').toLowerCase() === OWNER_EMAIL) {
        normalized.isAdmin = true;
        normalized.email = OWNER_EMAIL;
      }

      if (!permissions.canManageRoles) {
        normalized.roles = target.roles;
      }

      const saved = await persistUser(userId, normalized, {
        errorMessage: 'Не вдалося зберегти зміни користувача.'
      });

      if (saved && successMessage) {
        showAlert('success', successMessage);
      }

      return saved;
    },
    [allUsers, permissions, persistUser, showAlert]
  );

  const onSaveUser = useCallback(
    async (userId, changes) =>
      withTargetUser({
        userId,
        requiredPermission: 'canManageUsers',
        mutator: (draft) => ({
          ...draft,
          ...changes
        }),
        successMessage: 'Дані користувача оновлено.'
      }),
    [withTargetUser]
  );

  const onToggleBan = useCallback(
    async (userId, payload = {}) => {
      const target = allUsers.find((user) => user.id === userId);
      if (!target) {
        showAlert('warning', 'Користувача не знайдено.');
        return false;
      }

      const willBan = !target.isBanned;
      const reason = String(payload.reason || '').trim();
      const description = String(payload.description || '').trim();
      const durationDays = Number(payload.durationDays || 0);

      if (willBan && !reason) {
        showAlert('warning', 'Вкажіть причину блокування.');
        return false;
      }

      let pendingMail = null;

      const saved = await withTargetUser({
        userId,
        requiredPermission: 'canBanDeleteUsers',
        mutator: (draft) => {
          if (draft.isAdmin) {
            return draft;
          }

          if (draft.isBanned) {
            return {
              ...draft,
              isBanned: false,
              banReason: '',
              banDescription: '',
              banExpiresAt: null,
              bannedAt: null
            };
          }

          const now = new Date();
          const banExpiresAt = Number.isFinite(durationDays) && durationDays > 0
            ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString()
            : null;

          pendingMail = {
            email: draft.email,
            name: draft.name,
            reason,
            description,
            banExpiresAt
          };

          return {
            ...draft,
            isBanned: true,
            banReason: reason,
            banDescription: description,
            banExpiresAt,
            bannedAt: now.toISOString()
          };
        },
        successMessage: willBan ? 'Акаунт заблоковано.' : 'Акаунт розблоковано.'
      });

      if (!saved || !willBan || !pendingMail || !db) {
        return saved;
      }

      try {
        const until = pendingMail.banExpiresAt
          ? new Date(pendingMail.banExpiresAt).toLocaleString('uk-UA')
          : 'безстроково';

        const detailsLine = pendingMail.description
          ? `Опис: ${pendingMail.description}`
          : 'Опис: не вказано.';

        await addDoc(collection(db, 'mail'), {
          to: [pendingMail.email],
          message: {
            subject: 'TaskFlow: ваш акаунт заблоковано',
            text: `Вітаємо, ${pendingMail.name}. Ваш акаунт заблоковано. Причина: ${pendingMail.reason}. ${detailsLine} Термін блокування: ${until}.`,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.5;">
                <h3>Акаунт TaskFlow заблоковано</h3>
                <p>Вітаємо, <strong>${pendingMail.name}</strong>.</p>
                <p><strong>Причина:</strong> ${pendingMail.reason}</p>
                <p><strong>Опис:</strong> ${pendingMail.description || 'не вказано'}</p>
                <p><strong>Термін блокування:</strong> ${until}</p>
              </div>
            `
          },
          createdAt: new Date().toISOString()
        });
      } catch {
        showAlert(
          'warning',
          'Акаунт заблоковано, але email-сповіщення не надіслано (перевірте Firebase Trigger Email).'
        );
      }

      return saved;
    },
    [allUsers, showAlert, withTargetUser]
  );

  const onDeleteUser = useCallback(
    async (userId) =>
      withTargetUser({
        userId,
        requiredPermission: 'canBanDeleteUsers',
        mutator: (draft) => {
          if (draft.isAdmin) {
            return draft;
          }

          return {
            ...draft,
            name: `Видалений акаунт (${draft.id.slice(0, 6)})`,
            phone: '',
            avatar: '',
            points: 0,
            subscription: 'free',
            paymentLinked: false,
            tasks: [],
            cart: [],
            purchases: [],
            pointLedger: [],
            settings: {
              reminders: false,
              weeklyDigest: false,
              pushAlerts: false
            },
            roles: [],
            flags: [],
            isBanned: true,
            banReason: 'Акаунт видалено оператором/адміністратором',
            banDescription: 'Профіль очищено та деактивовано.',
            banExpiresAt: null,
            bannedAt: new Date().toISOString()
          };
        },
        successMessage: 'Акаунт видалено: дані очищені та доступ заблокований.'
      }),
    [withTargetUser]
  );

  const onSaveRawUser = useCallback(
    async (userId, rawUserJson) => {
      if (!permissions.canUseRawJson) {
        showAlert('danger', 'Сирий JSON доступний лише власнику.');
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(rawUserJson);
      } catch {
        showAlert('danger', 'JSON містить синтаксичну помилку.');
        return;
      }

      await withTargetUser({
        userId,
        requiredPermission: 'canUseRawJson',
        mutator: () => ({
          ...parsed,
          id: userId
        }),
        successMessage: 'JSON застосовано.'
      });
    },
    [permissions.canUseRawJson, showAlert, withTargetUser]
  );

  const onSaveTask = useCallback(
    async (userId, taskInput) => {
      let created = false;

      const saved = await withTargetUser({
        userId,
        requiredPermission: 'canModerateTasks',
        mutator: (draft) => {
          const normalizedTask = sanitizeTask(taskInput);
          const index = draft.tasks.findIndex((task) => Number(task.id) === Number(normalizedTask.id));

          if (index >= 0) {
            draft.tasks[index] = normalizedTask;
          } else {
            draft.tasks.unshift(normalizedTask);
            created = true;
          }

          return draft;
        },
        successMessage: created ? 'Задачу додано користувачу.' : 'Задачу користувача оновлено.'
      });

      return saved;
    },
    [withTargetUser]
  );

  const onDeleteTask = useCallback(
    async (userId, taskId) =>
      withTargetUser({
        userId,
        requiredPermission: 'canModerateTasks',
        mutator: (draft) => ({
          ...draft,
          tasks: draft.tasks.filter((task) => Number(task.id) !== Number(taskId))
        }),
        successMessage: 'Задачу видалено.'
      }),
    [withTargetUser]
  );

  const onFlagUser = useCallback(
    async (userId, payload) => {
      const reasonRaw = typeof payload === 'string' ? payload : payload?.reason;
      const cleanReason = String(reasonRaw || '').trim();
      const tags = Array.isArray(payload?.tags) ? payload.tags : [];

      if (!cleanReason) {
        showAlert('warning', 'Вкажіть причину позначки.');
        return false;
      }

      return withTargetUser({
        userId,
        requiredPermission: 'canFlagAccounts',
        mutator: (draft) => ({
          ...draft,
          flags: [
            ...(Array.isArray(draft.flags) ? draft.flags : []),
            {
              id: `flag-${Date.now()}`,
              reason: cleanReason,
              tags,
              createdAt: new Date().toISOString(),
              createdByUid: currentUser?.id || '',
              createdByName: currentUser?.name || 'Модератор',
              createdByEmail: currentUser?.email || '',
              createdByRole: permissions.isOwner ? 'owner' : 'staff'
            }
          ]
        }),
        successMessage: 'Позначку додано.'
      });
    },
    [currentUser?.email, currentUser?.id, currentUser?.name, permissions.isOwner, showAlert, withTargetUser]
  );

  const onResolveFlag = useCallback(
    async (userId, flagId) =>
      withTargetUser({
        userId,
        requiredPermission: 'canResolveFlags',
        mutator: (draft) => ({
          ...draft,
          flags: (Array.isArray(draft.flags) ? draft.flags : []).filter((flag) => flag.id !== flagId)
        }),
        successMessage: 'Позначку знято.'
      }),
    [withTargetUser]
  );

  const persistShopState = useCallback(
    async ({
      categories = shopCategories,
      products = shopProducts,
      draftProducts = shopDraftProducts,
      archivedProducts = shopArchivedProducts,
      successMessage
    }) =>
      persistShop({
        categories,
        products,
        draftProducts,
        archivedProducts,
        successMessage
      }),
    [persistShop, shopArchivedProducts, shopCategories, shopDraftProducts, shopProducts]
  );

  const onAddCategory = useCallback(
    async (inputCategory) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const category = sanitizeShopCategory(inputCategory);
      if (!category) {
        showAlert('warning', 'Введіть назву категорії.');
        return false;
      }
      if (shopCategories.includes(category)) {
        showAlert('warning', 'Така категорія вже існує.');
        return false;
      }

      return persistShopState({
        categories: [...shopCategories, category],
        successMessage: 'Категорію додано.'
      });
    },
    [permissions.canManageShop, persistShopState, shopCategories, showAlert]
  );

  const onRenameCategory = useCallback(
    async (fromCategory, toCategory) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const from = sanitizeShopCategory(fromCategory);
      const to = sanitizeShopCategory(toCategory);

      if (!from || !to) {
        showAlert('warning', 'Назва категорії не може бути порожньою.');
        return false;
      }
      if (!shopCategories.includes(from)) {
        return false;
      }
      if (from !== to && shopCategories.includes(to)) {
        showAlert('warning', 'Категорія з такою назвою вже існує.');
        return false;
      }

      const nextCategories = shopCategories.map((category) => (category === from ? to : category));
      const nextProducts = shopProducts.map((product) =>
        product.category === from ? { ...product, category: to } : product
      );
      const nextDraftProducts = shopDraftProducts.map((product) =>
        product.category === from ? { ...product, category: to } : product
      );
      const nextArchivedProducts = shopArchivedProducts.map((product) =>
        product.category === from ? { ...product, category: to } : product
      );

      return persistShopState({
        categories: nextCategories,
        products: nextProducts,
        draftProducts: nextDraftProducts,
        archivedProducts: nextArchivedProducts,
        successMessage: 'Категорію оновлено.'
      });
    },
    [
      permissions.canManageShop,
      persistShopState,
      shopArchivedProducts,
      shopCategories,
      shopDraftProducts,
      shopProducts,
      showAlert
    ]
  );

  const onDeleteCategory = useCallback(
    async (category) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      if (!shopCategories.includes(category)) {
        return false;
      }

      const nextCategories = shopCategories.filter((item) => item !== category);
      if (nextCategories.length === 0) {
        showAlert('warning', 'Не можна видалити останню категорію магазину.');
        return false;
      }

      const fallbackCategory = nextCategories[0];
      const nextProducts = shopProducts.map((product) =>
        product.category === category
          ? { ...product, category: fallbackCategory }
          : product
      );
      const nextDraftProducts = shopDraftProducts.map((product) =>
        product.category === category
          ? { ...product, category: fallbackCategory }
          : product
      );
      const nextArchivedProducts = shopArchivedProducts.map((product) =>
        product.category === category
          ? { ...product, category: fallbackCategory }
          : product
      );

      return persistShopState({
        categories: nextCategories,
        products: nextProducts,
        draftProducts: nextDraftProducts,
        archivedProducts: nextArchivedProducts,
        successMessage: 'Категорію видалено.'
      });
    },
    [
      permissions.canManageShop,
      persistShopState,
      shopArchivedProducts,
      shopCategories,
      shopDraftProducts,
      shopProducts,
      showAlert
    ]
  );

  const resolveNextProductId = useCallback(() => {
    const maxCatalogId = shopProducts.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0);
    const maxDraftId = shopDraftProducts.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0);
    const maxArchivedId = shopArchivedProducts.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0);
    return Math.max(maxCatalogId, maxDraftId, maxArchivedId) + 1;
  }, [shopArchivedProducts, shopDraftProducts, shopProducts]);

  const validateProduct = useCallback((product) => {
    if (!product.name) {
      showAlert('warning', 'Введіть назву товару.');
      return false;
    }
    if (!Number.isFinite(product.price) || product.price <= 0) {
      showAlert('warning', 'Ціна товару має бути більшою за 0.');
      return false;
    }
    if (!product.category) {
      showAlert('warning', 'Введіть категорію товару.');
      return false;
    }
    if (!Array.isArray(product.images) || product.images.length === 0) {
      showAlert('warning', 'Додайте хоча б одне фото товару.');
      return false;
    }
    return true;
  }, [showAlert]);

  const onSaveProduct = useCallback(
    async (inputProduct) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const normalized = sanitizeShopProduct({
        ...inputProduct,
        updatedAt: new Date().toISOString()
      });

      if (!validateProduct(normalized)) {
        return false;
      }

      const hasId = Number.isFinite(Number(inputProduct?.id));
      const nextId = hasId ? Number(inputProduct.id) : resolveNextProductId();
      const nextProduct = {
        ...normalized,
        id: nextId,
        createdAt: hasId
          ? (shopProducts.find((product) => Number(product.id) === nextId)?.createdAt
            || shopDraftProducts.find((product) => Number(product.id) === nextId)?.createdAt
            || normalized.createdAt)
          : normalized.createdAt
      };

      const catalogExists = shopProducts.some((product) => Number(product.id) === nextId);
      const nextProducts = catalogExists
        ? shopProducts.map((product) => (Number(product.id) === nextId ? nextProduct : product))
        : [nextProduct, ...shopProducts.filter((product) => Number(product.id) !== nextId)];
      const nextDraftProducts = shopDraftProducts.filter((product) => Number(product.id) !== nextId);
      const nextArchivedProducts = shopArchivedProducts.filter((product) => Number(product.id) !== nextId);
      const nextCategories = shopCategories.includes(nextProduct.category)
        ? shopCategories
        : [...shopCategories, nextProduct.category];

      return persistShopState({
        categories: nextCategories,
        products: nextProducts,
        draftProducts: nextDraftProducts,
        archivedProducts: nextArchivedProducts,
        successMessage: catalogExists ? 'Товар оновлено.' : 'Товар опубліковано.'
      });
    },
    [
      permissions.canManageShop,
      persistShopState,
      resolveNextProductId,
      shopCategories,
      shopArchivedProducts,
      shopDraftProducts,
      shopProducts,
      showAlert,
      validateProduct
    ]
  );

  const onSaveDraftProduct = useCallback(
    async (inputProduct) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const normalized = sanitizeShopProduct({
        ...inputProduct,
        updatedAt: new Date().toISOString()
      });

      if (!normalized.name) {
        showAlert('warning', 'Чернетка має містити хоча б назву товару.');
        return false;
      }

      const hasId = Number.isFinite(Number(inputProduct?.id));
      const nextId = hasId ? Number(inputProduct.id) : resolveNextProductId();
      const nextDraft = {
        ...normalized,
        id: nextId,
        createdAt: hasId
          ? (shopDraftProducts.find((product) => Number(product.id) === nextId)?.createdAt
            || shopProducts.find((product) => Number(product.id) === nextId)?.createdAt
            || normalized.createdAt)
          : normalized.createdAt
      };

      const draftExists = shopDraftProducts.some((product) => Number(product.id) === nextId);
      const nextDraftProducts = draftExists
        ? shopDraftProducts.map((product) => (Number(product.id) === nextId ? nextDraft : product))
        : [nextDraft, ...shopDraftProducts.filter((product) => Number(product.id) !== nextId)];
      const nextArchivedProducts = shopArchivedProducts.filter((product) => Number(product.id) !== nextId);

      const nextCategories = nextDraft.category && !shopCategories.includes(nextDraft.category)
        ? [...shopCategories, nextDraft.category]
        : shopCategories;

      return persistShopState({
        categories: nextCategories,
        draftProducts: nextDraftProducts,
        archivedProducts: nextArchivedProducts,
        successMessage: 'Чернетку товару збережено.'
      });
    },
    [
      permissions.canManageShop,
      persistShopState,
      resolveNextProductId,
      shopArchivedProducts,
      shopCategories,
      shopDraftProducts,
      shopProducts,
      showAlert
    ]
  );

  const onDeleteProduct = useCallback(
    async (productId) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const targetId = Number(productId);
      const productToArchive = shopProducts.find((product) => Number(product.id) === targetId);
      const nextProducts = shopProducts.filter((product) => Number(product.id) !== targetId);
      if (nextProducts.length === shopProducts.length) {
        return false;
      }

      const archivedProduct = {
        ...productToArchive,
        archivedAt: new Date().toISOString(),
        archivedFrom: 'catalog'
      };
      const nextArchivedProducts = [
        archivedProduct,
        ...shopArchivedProducts.filter((product) => Number(product.id) !== targetId)
      ];

      return persistShopState({
        products: nextProducts,
        archivedProducts: nextArchivedProducts,
        successMessage: 'Товар перенесено в архів.'
      });
    },
    [permissions.canManageShop, persistShopState, shopArchivedProducts, shopProducts, showAlert]
  );

  const onDeleteDraftProduct = useCallback(
    async (productId) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const targetId = Number(productId);
      const draftToArchive = shopDraftProducts.find((product) => Number(product.id) === targetId);
      const nextDraftProducts = shopDraftProducts.filter((product) => Number(product.id) !== targetId);
      if (nextDraftProducts.length === shopDraftProducts.length) {
        return false;
      }

      const archivedProduct = {
        ...draftToArchive,
        archivedAt: new Date().toISOString(),
        archivedFrom: 'draft'
      };
      const nextArchivedProducts = [
        archivedProduct,
        ...shopArchivedProducts.filter((product) => Number(product.id) !== targetId)
      ];

      return persistShopState({
        draftProducts: nextDraftProducts,
        archivedProducts: nextArchivedProducts,
        successMessage: 'Товар перенесено в архів.'
      });
    },
    [permissions.canManageShop, persistShopState, shopArchivedProducts, shopDraftProducts, showAlert]
  );

  const onRestoreArchivedProduct = useCallback(
    async (productId) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const targetId = Number(productId);
      const archivedProduct = shopArchivedProducts.find((product) => Number(product.id) === targetId);
      if (!archivedProduct) {
        return false;
      }

      const cleanProduct = sanitizeShopProduct({
        ...archivedProduct,
        archivedAt: null,
        archivedFrom: ''
      });
      const nextArchivedProducts = shopArchivedProducts.filter((product) => Number(product.id) !== targetId);
      const nextCategories = shopCategories.includes(cleanProduct.category)
        ? shopCategories
        : [...shopCategories, cleanProduct.category];
      const restoreToDrafts = archivedProduct.archivedFrom === 'draft';

      if (restoreToDrafts) {
        const nextDraftProducts = [
          cleanProduct,
          ...shopDraftProducts.filter((product) => Number(product.id) !== targetId)
        ];
        return persistShopState({
          categories: nextCategories,
          draftProducts: nextDraftProducts,
          archivedProducts: nextArchivedProducts,
          successMessage: 'Товар відновлено в чернетки.'
        });
      }

      const nextProducts = [
        cleanProduct,
        ...shopProducts.filter((product) => Number(product.id) !== targetId)
      ];
      return persistShopState({
        categories: nextCategories,
        products: nextProducts,
        archivedProducts: nextArchivedProducts,
        successMessage: 'Товар відновлено в каталог.'
      });
    },
    [
      permissions.canManageShop,
      persistShopState,
      shopArchivedProducts,
      shopCategories,
      shopDraftProducts,
      shopProducts,
      showAlert
    ]
  );

  const onDeleteArchivedProduct = useCallback(
    async (productId) => {
      if (!permissions.canManageShop) {
        showAlert('danger', 'У вас немає прав на модерацію магазину.');
        return false;
      }

      const targetId = Number(productId);
      const nextArchivedProducts = shopArchivedProducts.filter((product) => Number(product.id) !== targetId);
      if (nextArchivedProducts.length === shopArchivedProducts.length) {
        return false;
      }

      return persistShopState({
        archivedProducts: nextArchivedProducts,
        successMessage: 'Товар видалено з архіву назавжди.'
      });
    },
    [permissions.canManageShop, persistShopState, shopArchivedProducts, showAlert]
  );

  return {
    onSaveUser,
    onToggleBan,
    onDeleteUser,
    onSaveRawUser,
    onSaveTask,
    onDeleteTask,
    onFlagUser,
    onResolveFlag,
    onAddCategory,
    onRenameCategory,
    onDeleteCategory,
    onSaveProduct,
    onDeleteProduct,
    onSaveDraftProduct,
    onDeleteDraftProduct,
    onRestoreArchivedProduct,
    onDeleteArchivedProduct
  };
}
