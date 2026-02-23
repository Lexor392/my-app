import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LandingPage from './components/auth/LandingPage';
import CartPanel from './components/layout/CartPanel';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import AboutPage from './components/pages/AboutPage';
import AdminPage from './components/pages/AdminPage';
import ProfilePage from './components/pages/ProfilePage';
import PurchasePage from './components/pages/PurchasePage';
import SettingsPage from './components/pages/SettingsPage';
import ShopPage from './components/pages/ShopPage';
import StatsPage from './components/pages/StatsPage';
import TrackerPage from './components/pages/TrackerPage';
import {
  APP_VERSION,
  MENU_ITEMS,
  POINT_PACKS,
  PRIORITY_META,
  RELEASE_NOTES,
  STAFF_ROLE_OPTIONS,
  STATUS_META,
  STORAGE_KEYS,
  SUBSCRIPTION_PLANS,
  formatDateTime
} from './data/constants';
import useAdminActions from './hooks/useAdminActions';
import useAuthStore from './hooks/useAuthStore';
import useShopStore from './hooks/useShopStore';
import useTheme from './hooks/useTheme';
import useUserActions from './hooks/useUserActions';
import { hasFirebaseConfig } from './lib/firebase';
import './App.css';

function App() {
  const initialThemeMode = localStorage.getItem(STORAGE_KEYS.theme) || 'system';
  const { themeMode, setThemeMode, effectiveTheme } = useTheme(initialThemeMode);

  const [activePage, setActivePage] = useState('tracker');
  const [settingsInitialSection, setSettingsInitialSection] = useState('appearance');
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const alertTimerRef = useRef(null);

  const showAlert = useCallback((type, text, timeoutMs = 3200) => {
    setAlert({ type, text });

    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }

    alertTimerRef.current = setTimeout(() => {
      setAlert(null);
      alertTimerRef.current = null;
    }, timeoutMs);
  }, []);

  const {
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
    setAuthMode,
    onAuthFormChange,
    onLogin,
    onRegister,
    onGoogleSignIn,
    onLogout,
    onDeleteAccount,
    persistUser,
    persistCurrentUser
  } = useAuthStore(showAlert);

  const { isShopReady, shopCategories, shopProducts, shopDraftProducts, persistShop } = useShopStore({
    sessionUser,
    currentUser,
    showAlert
  });

  const {
    taskForm,
    profileDraft,
    boards,
    archivedBoards,
    archivedTasks,
    activeBoardId,
    boardTasks,
    cartItems,
    cartTotal,
    taskStats,
    ledgerStats,
    onTaskFormChange,
    onSetActiveBoard,
    onCreateBoard,
    onUpdateBoard,
    onArchiveBoard,
    onRestoreArchivedBoard,
    onDeleteArchivedBoard,
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
  } = useUserActions({
    currentUser,
    shopProducts,
    persistCurrentUser,
    showAlert
  });

  const permissions = useMemo(() => {
    const roles = Array.isArray(currentUser?.roles) ? currentUser.roles : [];
    const hasRole = (role) => roles.includes(role);
    const isOwner = Boolean(currentUser?.isAdmin);

    const canReviewTasks = isOwner || hasRole('task_moderator') || hasRole('operator');
    const canModerateTasks = isOwner || hasRole('operator');
    const canManageShop = isOwner || hasRole('shop_moderator') || hasRole('operator');
    const canManageUsers = isOwner || hasRole('operator');
    const canViewUsers = canManageUsers || canReviewTasks;
    const canFlagAccounts = canReviewTasks;
    const canViewFlagQueue = isOwner;
    const canResolveFlags = isOwner || hasRole('operator');

    return {
      isOwner,
      canAccessAdminPanel: isOwner || canReviewTasks || canManageShop,
      canManageRoles: isOwner,
      canUseRawJson: isOwner,
      canViewUsers,
      canManageUsers,
      canBanDeleteUsers: canManageUsers,
      canReviewTasks,
      canModerateTasks,
      canFlagAccounts,
      canViewFlagQueue,
      canResolveFlags,
      canManageShop
    };
  }, [currentUser?.isAdmin, currentUser?.roles]);

  const adminActions = useAdminActions({
    currentUser,
    allUsers,
    permissions,
    persistUser,
    showAlert,
    shopCategories,
    shopProducts,
    shopDraftProducts,
    persistShop
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, themeMode);
  }, [themeMode]);

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
    };
  }, []);

  const menuItems = useMemo(() => {
    if (!permissions.canAccessAdminPanel) {
      return MENU_ITEMS;
    }

    if (MENU_ITEMS.some((item) => item.key === 'admin')) {
      return MENU_ITEMS;
    }

    return [...MENU_ITEMS, { key: 'admin', label: 'Адмінка', icon: 'bi-shield-lock' }];
  }, [permissions.canAccessAdminPanel]);

  useEffect(() => {
    if (!sessionUser) {
      setActivePage('tracker');
      setCartOpen(false);
      setSidebarOpen(false);
      return;
    }

    if (activePage === 'admin' && !permissions.canAccessAdminPanel) {
      setActivePage('tracker');
      return;
    }

    if (!menuItems.some((item) => item.key === activePage)) {
      setActivePage(menuItems[0]?.key || 'tracker');
    }
  }, [activePage, menuItems, permissions.canAccessAdminPanel, sessionUser]);

  const pageTitle = useMemo(() => {
    const found = menuItems.find((item) => item.key === activePage);
    return found?.label || 'TaskFlow';
  }, [activePage, menuItems]);

  const handleCheckout = async () => {
    const success = await onCheckout();
    if (success) {
      setCartOpen(false);
    }
  };

  const handleNavigate = useCallback((nextPage) => {
    if (nextPage === 'settings') {
      setSettingsInitialSection('appearance');
    }
    setActivePage(nextPage);
    setSidebarOpen(false);
  }, []);

  const handleOpenSettingsAccount = useCallback(() => {
    setSettingsInitialSection('account');
    setActivePage('settings');
    setSidebarOpen(false);
  }, []);

  const handleOpenProfile = useCallback(() => {
    setActivePage('profile');
    setSidebarOpen(false);
  }, []);

  const renderActivePage = () => {
    if (!currentUser) {
      return null;
    }

    switch (activePage) {
      case 'tracker':
        return (
          <TrackerPage
            boards={boards}
            archivedBoards={archivedBoards}
            archivedTasks={archivedTasks}
            activeBoardId={activeBoardId}
            onSetActiveBoard={onSetActiveBoard}
            onCreateBoard={onCreateBoard}
            onUpdateBoard={onUpdateBoard}
            onArchiveBoard={onArchiveBoard}
            onRestoreArchivedBoard={onRestoreArchivedBoard}
            onDeleteArchivedBoard={onDeleteArchivedBoard}
            taskForm={taskForm}
            onTaskFormChange={onTaskFormChange}
            onCreateTask={onCreateTask}
            onTaskUpdate={onUpdateTask}
            tasks={boardTasks}
            allTasks={currentUser.tasks}
            onTaskStatusChange={onTaskStatusChange}
            onTaskArchive={onArchiveTask}
            onRestoreArchivedTask={onRestoreArchivedTask}
            onDeleteArchivedTask={onDeleteArchivedTask}
            priorityMeta={PRIORITY_META}
            statusMeta={STATUS_META}
          />
        );
      case 'shop':
        return (
          <ShopPage
            products={shopProducts}
            categories={shopCategories}
            onAddToCart={onAddToCart}
          />
        );
      case 'stats':
        return (
          <StatsPage
            taskStats={taskStats}
            ledgerStats={ledgerStats}
            pointLedger={currentUser.pointLedger}
            formatDateTime={formatDateTime}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            currentUser={currentUser}
            profileDraft={profileDraft}
            themeMode={themeMode}
            effectiveTheme={effectiveTheme}
            onThemeChange={setThemeMode}
            onToggleSetting={onToggleSetting}
            onProfileChange={onProfileChange}
            onSaveProfile={onSaveProfile}
            onTogglePaymentLink={onTogglePaymentLink}
            onLogout={onLogout}
            onDeleteAccount={onDeleteAccount}
            initialSection={settingsInitialSection}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'purchase':
        return (
          <PurchasePage
            plans={SUBSCRIPTION_PLANS}
            packs={POINT_PACKS}
            currentSubscription={currentUser.subscription}
            onActivatePlan={onActivatePlan}
            onBuyPoints={onBuyPoints}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            plans={SUBSCRIPTION_PLANS}
            formatDateTime={formatDateTime}
          />
        );
      case 'admin':
        if (!permissions.canAccessAdminPanel) {
          return <AboutPage />;
        }

        return (
          <AdminPage
            users={allUsers}
            currentUserId={currentUser.id}
            roleOptions={STAFF_ROLE_OPTIONS}
            permissions={permissions}
            shopProducts={shopProducts}
            shopCategories={shopCategories}
            shopDraftProducts={shopDraftProducts}
            onSaveUser={adminActions.onSaveUser}
            onToggleBan={adminActions.onToggleBan}
            onDeleteUser={adminActions.onDeleteUser}
            onSaveRawUser={adminActions.onSaveRawUser}
            onSaveTask={adminActions.onSaveTask}
            onDeleteTask={adminActions.onDeleteTask}
            onFlagUser={adminActions.onFlagUser}
            onResolveFlag={adminActions.onResolveFlag}
            onAddCategory={adminActions.onAddCategory}
            onRenameCategory={adminActions.onRenameCategory}
            onDeleteCategory={adminActions.onDeleteCategory}
            onSaveProduct={adminActions.onSaveProduct}
            onDeleteProduct={adminActions.onDeleteProduct}
            onSaveDraftProduct={adminActions.onSaveDraftProduct}
            onDeleteDraftProduct={adminActions.onDeleteDraftProduct}
            appVersion={APP_VERSION}
            releaseNotes={RELEASE_NOTES}
            formatDateTime={formatDateTime}
          />
        );
      default:
        return <AboutPage />;
    }
  };

  if (!hasFirebaseConfig) {
    return (
      <div className="landing-page d-flex align-items-center">
        <div className="container py-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">TaskFlow: настройка Firebase</h3>
              <p className="mb-2">
                Для реальної авторизації та збереження даних заповніть змінні оточення у `.env` на основі `.env.example`.
              </p>
              <ul className="mb-0">
                <li>`REACT_APP_FIREBASE_API_KEY`</li>
                <li>`REACT_APP_FIREBASE_AUTH_DOMAIN`</li>
                <li>`REACT_APP_FIREBASE_PROJECT_ID`</li>
                <li>`REACT_APP_FIREBASE_STORAGE_BUCKET`</li>
                <li>`REACT_APP_FIREBASE_MESSAGING_SENDER_ID`</li>
                <li>`REACT_APP_FIREBASE_APP_ID`</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthReady) {
    return (
      <div className="landing-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" />
          <div>Перевіряємо сесію...</div>
        </div>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <LandingPage
        authMode={authMode}
        authError={authError}
        authBusy={authBusy}
        authForm={authForm}
        onAuthModeChange={setAuthMode}
        onAuthFormChange={onAuthFormChange}
        onLogin={onLogin}
        onRegister={onRegister}
        onGoogleSignIn={onGoogleSignIn}
      />
    );
  }

  if (!currentUser || !isProfileReady || !isShopReady) {
    return (
      <div className="landing-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" />
          <div>Завантажуємо дані з бази...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        menuItems={menuItems}
        activePage={activePage}
        onNavigate={handleNavigate}
        appVersion={APP_VERSION}
        liveUsersCount={liveUsersCount}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="workspace">
        <Topbar
          pageTitle={pageTitle}
          user={currentUser}
          themeMode={themeMode}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onThemeChange={setThemeMode}
          onOpenPurchase={() => handleNavigate('purchase')}
          onOpenCart={() => setCartOpen(true)}
          onOpenProfile={handleOpenProfile}
          onOpenSettingsAccount={handleOpenSettingsAccount}
          onLogout={onLogout}
        />

        <main className="content-wrap">{renderActivePage()}</main>
      </div>

      <CartPanel
        open={isCartOpen}
        items={cartItems}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={onChangeCartQuantity}
        onCheckout={handleCheckout}
      />

      {alert && (
        <div className={`alert alert-${alert.type} floating-alert py-2 px-3 mb-0`} role="alert">
          {alert.text}
        </div>
      )}
    </div>
  );
}

export default App;
