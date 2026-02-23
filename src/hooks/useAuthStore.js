import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore';
import { ADMIN_ACCOUNT, OWNER_EMAIL, createUserProfile, sanitizeUser } from '../data/constants';
import { auth, db, googleProvider, hasFirebaseConfig } from '../lib/firebase';

const USERS_COLLECTION = 'users';
const PRESENCE_COLLECTION = 'presence';
const USER_ACTIVITY_COLLECTION = 'userActivity';

const PRESENCE_HEARTBEAT_MS = 12000;
const PRESENCE_TTL_MS = 45000;

const EVENT_LOGIN = 'login';
const EVENT_LOGOUT = 'logout';

const toIsoNow = () => new Date().toISOString();
const toIsoFuture = (ms) => new Date(Date.now() + ms).toISOString();

const parseEventTimestamp = (value) => {
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    return null;
  }

  if (value && typeof value.toDate === 'function') {
    return value.toDate().getTime();
  }

  return null;
};

const isPresenceOnline = (entry, now = Date.now()) => {
  if (!entry?.isOnline) {
    return false;
  }

  const expiresAt = Date.parse(entry.expiresAt || '');
  if (Number.isFinite(expiresAt)) {
    return expiresAt > now;
  }

  const lastSeenAt = Date.parse(entry.lastSeenAt || '');
  return Number.isFinite(lastSeenAt) && now - lastSeenAt <= PRESENCE_TTL_MS;
};

const enrichUserWithPresence = (user, presenceEntry, now = Date.now()) => {
  if (!presenceEntry) {
    return {
      ...user,
      isOnline: false
    };
  }

  return {
    ...user,
    isOnline: isPresenceOnline(presenceEntry, now),
    lastSeenAt: presenceEntry.lastSeenAt || user.lastSeenAt || null,
    lastLoginAt: presenceEntry.lastLoginAt || user.lastLoginAt || null,
    lastLogoutAt: presenceEntry.lastLogoutAt || user.lastLogoutAt || null
  };
};

const createDefaultAuthForm = () => ({
  identifier: '',
  password: '',
  name: '',
  email: '',
  phone: ''
});

const mapAuthError = (error) => {
  switch (error?.code) {
    case 'auth/invalid-credential':
      return 'Невірний email або пароль.';
    case 'auth/user-not-found':
      return 'Користувача з таким email не знайдено.';
    case 'auth/wrong-password':
      return 'Невірний пароль.';
    case 'auth/email-already-in-use':
      return 'Цей email вже використовується.';
    case 'auth/invalid-email':
      return 'Некоректний формат email.';
    case 'auth/weak-password':
      return 'Пароль має містити щонайменше 6 символів.';
    case 'auth/operation-not-allowed':
      return 'У Firebase не ввімкнено цей спосіб входу.';
    case 'auth/unauthorized-domain':
      return 'Поточний домен не додано до Authorized domains у Firebase Auth.';
    case 'auth/popup-blocked':
      return 'Браузер заблокував вікно входу. Дозвольте pop-up і спробуйте ще раз.';
    case 'auth/popup-closed-by-user':
      return 'Вікно входу через Google закрито.';
    case 'auth/cancelled-popup-request':
      return 'Запит авторизації через Google скасовано.';
    case 'auth/account-exists-with-different-credential':
      return 'Для цього email уже є вхід іншим способом. Увійдіть ним і прив\'яжіть Google.';
    case 'auth/network-request-failed':
      return 'Перевірте підключення до інтернету.';
    case 'auth/user-disabled':
      return 'Цей акаунт вимкнено.';
    default:
      return 'Не вдалося виконати авторизацію. Спробуйте ще раз.';
  }
};

const formatBanUntil = (value) => {
  if (!value) {
    return 'Безстроково';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Безстроково';
  }

  return parsed.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isBanActive = (profile) => {
  if (!profile?.isBanned || profile?.isAdmin) {
    return false;
  }

  if (!profile?.banExpiresAt) {
    return true;
  }

  const banExpires = new Date(profile.banExpiresAt).getTime();
  if (Number.isNaN(banExpires)) {
    return true;
  }

  return banExpires > Date.now();
};

const buildBanMessage = (profile) => {
  const reason = profile?.banReason?.trim() || 'Акаунт заблоковано адміністратором.';
  const details = profile?.banDescription?.trim();
  const until = formatBanUntil(profile?.banExpiresAt);

  if (details) {
    return `${reason} Опис: ${details}. Термін: ${until}.`;
  }

  return `${reason} Термін: ${until}.`;
};

export default function useAuthStore(showAlert) {
  const [authMode, setAuthModeState] = useState('login');
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState(createDefaultAuthForm);

  const [isAuthReady, setAuthReady] = useState(!hasFirebaseConfig);
  const [isProfileReady, setProfileReady] = useState(!hasFirebaseConfig);

  const [sessionUser, setSessionUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [liveUsersCount, setLiveUsersCount] = useState(0);
  const [authEvents, setAuthEvents] = useState([]);
  const [authEventsStats, setAuthEventsStats] = useState({
    logins24h: 0,
    logouts24h: 0,
    totalEvents: 0
  });

  const presenceMapRef = useRef(new Map());
  const presenceIdentityRef = useRef({
    name: '',
    avatar: '',
    email: ''
  });

  const canAccessUsersDirectory = Boolean(
    currentUser?.isAdmin
      || currentUser?.roles?.includes('operator')
      || currentUser?.roles?.includes('task_moderator')
  );

  const setAuthMode = useCallback((mode) => {
    setAuthModeState(mode);
    setAuthError('');
  }, []);

  const onAuthFormChange = useCallback((field, value) => {
    setAuthForm((previous) => ({
      ...previous,
      [field]: value
    }));
  }, []);

  useEffect(() => {
    presenceIdentityRef.current = {
      name: currentUser?.name || sessionUser?.displayName || 'Користувач',
      avatar: currentUser?.avatar || sessionUser?.photoURL || '',
      email: (currentUser?.email || sessionUser?.email || '').trim().toLowerCase()
    };
  }, [
    currentUser?.avatar,
    currentUser?.email,
    currentUser?.name,
    sessionUser?.displayName,
    sessionUser?.email,
    sessionUser?.photoURL
  ]);

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setSessionUser(nextUser);
      setAuthReady(true);
      if (nextUser) {
        setAuthError('');
      }
      setProfileReady(false);

      if (!nextUser) {
        setCurrentUser(null);
        setAllUsers([]);
        setLiveUsersCount(0);
        setAuthEvents([]);
        setAuthEventsStats({
          logins24h: 0,
          logouts24h: 0,
          totalEvents: 0
        });
        presenceMapRef.current = new Map();
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasFirebaseConfig || !sessionUser || !db) {
      if (!sessionUser) {
        setProfileReady(true);
      }
      return;
    }

    let cancelled = false;
    let unsubscribeProfile = null;

    const syncProfile = async () => {
      const userRef = doc(db, USERS_COLLECTION, sessionUser.uid);
      const normalizedEmail = (sessionUser.email || '').trim().toLowerCase();
      const isOwner = normalizedEmail === OWNER_EMAIL && Boolean(sessionUser.emailVerified);

      try {
        const existingSnapshot = await getDoc(userRef);
        let bootstrapProfile = null;

        if (!existingSnapshot.exists()) {
          if (!normalizedEmail) {
            showAlert('danger', 'Не вдалося визначити email акаунта.');
            await signOut(auth);
            return;
          }

          const created = createUserProfile({
            id: sessionUser.uid,
            name: sessionUser.displayName || (isOwner ? ADMIN_ACCOUNT.name : 'Користувач'),
            email: normalizedEmail,
            phone: '',
            avatar: sessionUser.photoURL || '',
            isAdmin: isOwner
          });

          await setDoc(userRef, created, { merge: false });
          bootstrapProfile = created;
        } else {
          const existing = existingSnapshot.data() || {};
          const patch = {};

          if (!existing.id) {
            patch.id = sessionUser.uid;
          }
          if (!existing.email && normalizedEmail) {
            patch.email = normalizedEmail;
          }
          if (!existing.name && sessionUser.displayName) {
            patch.name = sessionUser.displayName;
          }
          if (!existing.avatar && sessionUser.photoURL) {
            patch.avatar = sessionUser.photoURL;
          }
          if (isOwner && !existing.isAdmin) {
            patch.isAdmin = true;
          }

          if (Object.keys(patch).length > 0) {
            await setDoc(userRef, patch, { merge: true });
          }

          bootstrapProfile = { ...existing, ...patch, id: sessionUser.uid };
        }

        if (cancelled || !bootstrapProfile) {
          return;
        }

        const normalizedBootstrap = sanitizeUser({
          ...bootstrapProfile,
          id: sessionUser.uid,
          email: bootstrapProfile.email || normalizedEmail,
          isAdmin: isOwner
        });

        if (normalizedBootstrap.isBanned && !normalizedBootstrap.isAdmin && isBanActive(normalizedBootstrap)) {
          const banMessage = buildBanMessage(normalizedBootstrap);
          setCurrentUser(null);
          setProfileReady(true);
          setAuthError(banMessage);
          showAlert('danger', banMessage);
          await signOut(auth);
          return;
        }

        setCurrentUser(normalizedBootstrap);
        setProfileReady(true);

        unsubscribeProfile = onSnapshot(
          userRef,
          async (snapshot) => {
            if (!snapshot.exists()) {
              setCurrentUser(null);
              setProfileReady(true);
              return;
            }

            const normalized = sanitizeUser({
              ...snapshot.data(),
              id: sessionUser.uid,
              email: snapshot.data()?.email || normalizedEmail,
              isAdmin: isOwner
            });

            if (normalized.isBanned && !normalized.isAdmin && isBanActive(normalized)) {
              const banMessage = buildBanMessage(normalized);
              setCurrentUser(null);
              setProfileReady(true);
              setAuthError(banMessage);
              showAlert('danger', banMessage);
              await signOut(auth);
              return;
            }

            setCurrentUser(normalized);
            setProfileReady(true);
          },
          async () => {
            setCurrentUser(null);
            setProfileReady(true);
            showAlert('danger', 'Немає доступу до профілю у Firestore. Перевірте правила безпеки.');
            await signOut(auth);
          }
        );
      } catch (error) {
        setCurrentUser(null);
        setProfileReady(true);
        showAlert('danger', 'Не вдалося завантажити профіль із бази даних.');
        await signOut(auth);
      }
    };

    syncProfile();

    return () => {
      cancelled = true;
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [sessionUser, showAlert]);

  useEffect(() => {
    if (!sessionUser || !canAccessUsersDirectory || !db) {
      setAllUsers([]);
      return;
    }

    const usersRef = collection(db, USERS_COLLECTION);

    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const now = Date.now();
        const users = snapshot.docs
          .map((snapshotDoc) =>
            sanitizeUser({
              ...snapshotDoc.data(),
              id: snapshotDoc.id
            })
          )
          .sort((left, right) => {
            if (left.isAdmin !== right.isAdmin) {
              return Number(right.isAdmin) - Number(left.isAdmin);
            }
            return new Date(right.joinedAt).getTime() - new Date(left.joinedAt).getTime();
          })
          .map((user) => enrichUserWithPresence(user, presenceMapRef.current.get(user.id), now));

        setAllUsers(users);
      },
      () => {
        setAllUsers([]);
        showAlert('warning', 'Не вдалося завантажити список користувачів для адмінки.');
      }
    );

    return unsubscribe;
  }, [sessionUser, canAccessUsersDirectory, showAlert]);

  useEffect(() => {
    if (!sessionUser?.uid || !db) {
      setLiveUsersCount(0);
      presenceMapRef.current = new Map();
      return;
    }

    const calculateFromMap = (sourceMap = presenceMapRef.current) => {
      const now = Date.now();
      let onlineCount = 0;
      sourceMap.forEach((entry) => {
        if (isPresenceOnline(entry, now)) {
          onlineCount += 1;
        }
      });
      setLiveUsersCount(onlineCount);

      if (canAccessUsersDirectory) {
        setAllUsers((previous) =>
          previous.map((user) => enrichUserWithPresence(user, sourceMap.get(user.id), now))
        );
      }
    };

    const presenceRef = collection(db, PRESENCE_COLLECTION);
    const unsubscribe = onSnapshot(
      presenceRef,
      (snapshot) => {
        const nextMap = new Map();
        snapshot.docs.forEach((snapshotDoc) => {
          const payload = snapshotDoc.data() || {};
          const uid = payload.uid || snapshotDoc.id;
          nextMap.set(uid, { ...payload, uid });
        });

        presenceMapRef.current = nextMap;
        calculateFromMap(nextMap);
      },
      () => {
        setLiveUsersCount(0);
      }
    );

    const recalcInterval = setInterval(() => {
      calculateFromMap();
    }, 4000);

    return () => {
      clearInterval(recalcInterval);
      unsubscribe();
    };
  }, [sessionUser?.uid, canAccessUsersDirectory]);

  useEffect(() => {
    if (!sessionUser?.uid || !db) {
      return;
    }

    const uid = sessionUser.uid;
    const sessionId = `${uid}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const presenceDocRef = doc(db, PRESENCE_COLLECTION, uid);
    const activityRef = collection(db, USER_ACTIVITY_COLLECTION);
    let stopped = false;
    let offlineSent = false;

    const writePresence = async ({ isOnline, eventType = '' } = {}) => {
      if (stopped && isOnline) {
        return;
      }

      const nowIso = toIsoNow();
      const identity = presenceIdentityRef.current;
      const payload = {
        uid,
        name: identity.name || 'Користувач',
        avatar: identity.avatar || '',
        email: identity.email || '',
        isOnline: Boolean(isOnline),
        lastSeenAt: nowIso,
        expiresAt: isOnline ? toIsoFuture(PRESENCE_TTL_MS) : nowIso,
        sessionId
      };

      if (eventType === EVENT_LOGIN) {
        payload.lastLoginAt = nowIso;
      }
      if (eventType === EVENT_LOGOUT) {
        payload.lastLogoutAt = nowIso;
      }

      try {
        await setDoc(presenceDocRef, payload, { merge: true });
      } catch {
        // ignore presence write errors
      }

      if (!eventType) {
        return;
      }

      try {
        await addDoc(activityRef, {
          uid,
          type: eventType,
          createdAt: nowIso,
          sessionId,
          name: payload.name,
          email: payload.email
        });
      } catch {
        // ignore activity write errors
      }
    };

    const publishOffline = () => {
      if (offlineSent) {
        return;
      }
      offlineSent = true;
      void writePresence({ isOnline: false, eventType: EVENT_LOGOUT });
    };

    const pingInterval = setInterval(() => {
      void writePresence({ isOnline: true });
    }, PRESENCE_HEARTBEAT_MS);

    void writePresence({ isOnline: true, eventType: EVENT_LOGIN });

    window.addEventListener('beforeunload', publishOffline);
    window.addEventListener('pagehide', publishOffline);

    return () => {
      stopped = true;
      clearInterval(pingInterval);
      window.removeEventListener('beforeunload', publishOffline);
      window.removeEventListener('pagehide', publishOffline);
      publishOffline();
    };
  }, [sessionUser?.uid]);

  useEffect(() => {
    if (!sessionUser?.uid || !canAccessUsersDirectory || !db) {
      setAuthEvents([]);
      setAuthEventsStats({
        logins24h: 0,
        logouts24h: 0,
        totalEvents: 0
      });
      return;
    }

    const feedQuery = query(
      collection(db, USER_ACTIVITY_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(200)
    );

    const unsubscribe = onSnapshot(
      feedQuery,
      (snapshot) => {
        const events = snapshot.docs.map((snapshotDoc) => {
          const payload = snapshotDoc.data() || {};
          const createdAt = typeof payload.createdAt === 'string'
            ? payload.createdAt
            : (payload.createdAt?.toDate?.().toISOString?.() || '');

          return {
            id: snapshotDoc.id,
            uid: payload.uid || '',
            type: payload.type || '',
            createdAt,
            name: payload.name || 'User',
            email: payload.email || ''
          };
        });

        const since = Date.now() - (24 * 60 * 60 * 1000);
        let logins24h = 0;
        let logouts24h = 0;

        events.forEach((event) => {
          const parsed = parseEventTimestamp(event.createdAt);
          if (!Number.isFinite(parsed) || parsed < since) {
            return;
          }

          if (event.type === EVENT_LOGIN) {
            logins24h += 1;
          } else if (event.type === EVENT_LOGOUT) {
            logouts24h += 1;
          }
        });

        setAuthEvents(events.slice(0, 30));
        setAuthEventsStats({
          logins24h,
          logouts24h,
          totalEvents: events.length
        });
      },
      () => {
        setAuthEvents([]);
        setAuthEventsStats({
          logins24h: 0,
          logouts24h: 0,
          totalEvents: 0
        });
      }
    );

    return unsubscribe;
  }, [sessionUser?.uid, canAccessUsersDirectory]);
  const persistUser = useCallback(
    async (userId, candidate, options = {}) => {
      if (!db) {
        return false;
      }

      const normalized = sanitizeUser({ ...candidate, id: userId });

      if (options.lockIdentity && currentUser) {
        normalized.email = currentUser.email;
        normalized.isAdmin = currentUser.isAdmin;
        normalized.roles = currentUser.roles;
        normalized.flags = currentUser.flags;
        normalized.isBanned = currentUser.isBanned;
        normalized.banReason = currentUser.banReason;
        normalized.banDescription = currentUser.banDescription;
        normalized.banExpiresAt = currentUser.banExpiresAt;
        normalized.bannedAt = currentUser.bannedAt;
      }

      try {
        await setDoc(doc(db, USERS_COLLECTION, userId), normalized, { merge: false });
        return true;
      } catch {
        showAlert('danger', options.errorMessage || 'Не вдалося зберегти зміни користувача.');
        return false;
      }
    },
    [currentUser, showAlert]
  );

  const persistCurrentUser = useCallback(
    async (candidate, successMessage) => {
      if (!currentUser) {
        return false;
      }

      const saved = await persistUser(currentUser.id, candidate, {
        lockIdentity: !currentUser.isAdmin,
        errorMessage: 'Не вдалося зберегти ваші зміни у базі даних.'
      });

      if (saved && successMessage) {
        showAlert('success', successMessage);
      }

      return saved;
    },
    [currentUser, persistUser, showAlert]
  );

  const onRegister = useCallback(
    async (event) => {
      event.preventDefault();

      if (!auth || !db) {
        return;
      }

      const name = authForm.name.trim();
      const email = authForm.email.trim().toLowerCase();
      const phone = authForm.phone.trim();
      const password = authForm.password;

      if (!name) {
        setAuthError('Введіть ім\'я для реєстрації.');
        return;
      }
      if (!email) {
        setAuthError('Введіть email для реєстрації.');
        return;
      }
      if (password.length < 6) {
        setAuthError('Пароль має містити щонайменше 6 символів.');
        return;
      }

      setAuthBusy(true);
      setAuthError('');

      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          try {
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            const snapshot = await getDoc(doc(db, USERS_COLLECTION, credentials.user.uid));
            if (snapshot.exists()) {
              const profile = sanitizeUser({ ...snapshot.data(), id: credentials.user.uid });
              if (isBanActive(profile)) {
                const banMessage = buildBanMessage(profile);
                setAuthError(banMessage);
                await signOut(auth);
                return;
              }
            }
            await signOut(auth);
          } catch {
            // Якщо пароль невірний, причина блокування невідома.
          }
        }

        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credentials.user, { displayName: name });

        const profile = createUserProfile({
          id: credentials.user.uid,
          name,
          email,
          phone,
          avatar: credentials.user.photoURL || '',
          isAdmin: email === OWNER_EMAIL && Boolean(credentials.user.emailVerified)
        });

        await setDoc(doc(db, USERS_COLLECTION, credentials.user.uid), profile, { merge: false });

        setAuthForm(createDefaultAuthForm());
        setAuthModeState('login');
        showAlert('success', 'Акаунт успішно створено.');
      } catch (error) {
        setAuthError(mapAuthError(error));
      } finally {
        setAuthBusy(false);
      }
    },
    [authForm, showAlert]
  );

  const onLogin = useCallback(
    async (event) => {
      event.preventDefault();

      if (!auth || !db) {
        return;
      }

      const email = authForm.identifier.trim().toLowerCase();
      const password = authForm.password;

      if (!email || !password) {
        setAuthError('Введіть email та пароль для входу.');
        return;
      }

      setAuthBusy(true);
      setAuthError('');

      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const snapshot = await getDoc(doc(db, USERS_COLLECTION, credentials.user.uid));
        if (snapshot.exists()) {
          const profile = sanitizeUser({ ...snapshot.data(), id: credentials.user.uid });
          if (isBanActive(profile)) {
            const banMessage = buildBanMessage(profile);
            setAuthError(banMessage);
            await signOut(auth);
            return;
          }
        }
        setAuthForm(createDefaultAuthForm());
      } catch (error) {
        setAuthError(mapAuthError(error));
      } finally {
        setAuthBusy(false);
      }
    },
    [authForm, db]
  );

  const onGoogleSignIn = useCallback(async () => {
    if (!auth) {
      return;
    }

    setAuthBusy(true);
    setAuthError('');

    try {
      await signInWithPopup(auth, googleProvider);
      setAuthForm(createDefaultAuthForm());
    } catch (error) {
      setAuthError(mapAuthError(error));
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const onLogout = useCallback(async () => {
    if (!auth) {
      return;
    }

    try {
      await signOut(auth);
      showAlert('success', 'Ви вийшли з акаунта.');
    } catch {
      showAlert('danger', 'Не вдалося завершити сесію.');
    }
  }, [showAlert]);

  const onDeleteAccount = useCallback(async () => {
    if (!auth || !db || !auth.currentUser || !currentUser) {
      return false;
    }

    if (currentUser.isAdmin) {
      showAlert('warning', 'Не можна видалити owner-акаунт із клієнта.');
      return false;
    }

    const confirmed = window.confirm('Видалити акаунт? Цю дію неможливо скасувати.');
    if (!confirmed) {
      return false;
    }

    try {
      await deleteDoc(doc(db, USERS_COLLECTION, currentUser.id));
      await deleteDoc(doc(db, PRESENCE_COLLECTION, currentUser.id));
    } catch {
      showAlert('danger', 'Не вдалося видалити профіль у базі даних.');
      return false;
    }

    try {
      await deleteUser(auth.currentUser);
      showAlert('success', 'Акаунт видалено.');
      return true;
    } catch (error) {
      if (error?.code === 'auth/requires-recent-login') {
        showAlert(
          'warning',
          'Профіль видалено, але для видалення облікового запису Firebase потрібен повторний вхід.'
        );
      } else {
        showAlert('warning', 'Профіль видалено, але не вдалося повністю видалити обліковий запис Firebase Auth.');
      }

      try {
        await signOut(auth);
      } catch {
        // ignore
      }
      return false;
    }
  }, [currentUser, showAlert]);

  return {
    authMode,
    authBusy,
    authError,
    authForm,
    isAuthReady,
    isProfileReady,
    sessionUser,
    currentUser,
    allUsers,
    liveUsersCount,
    authEvents,
    authEventsStats,
    setAuthMode,
    onAuthFormChange,
    onLogin,
    onRegister,
    onGoogleSignIn,
    onLogout,
    onDeleteAccount,
    persistUser,
    persistCurrentUser
  };
}
