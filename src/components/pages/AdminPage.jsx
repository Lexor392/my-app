import { useEffect, useMemo, useState } from 'react';
import { FLAG_TAG_OPTIONS, dateInDays } from '../../data/constants';
import AdminAnalyticsSection from './admin/AdminAnalyticsSection';
import AdminBanModal from './admin/AdminBanModal';
import AdminShopSection from './admin/AdminShopSection';
import AdminUpdatesSection from './admin/AdminUpdatesSection';
import AdminUsersSection from './admin/AdminUsersSection';

const EMPTY_NEW_TASK = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: dateInDays(0),
  points: 35
};

const DEFAULT_PERMISSIONS = {
  isOwner: false,
  canAccessAdminPanel: false,
  canManageRoles: false,
  canUseRawJson: false,
  canViewUsers: false,
  canManageUsers: false,
  canBanDeleteUsers: false,
  canReviewTasks: false,
  canModerateTasks: false,
  canFlagAccounts: false,
  canViewFlagQueue: false,
  canResolveFlags: false,
  canManageShop: false
};

export default function AdminPage({
  users,
  currentUserId,
  roleOptions,
  permissions = DEFAULT_PERMISSIONS,
  shopProducts,
  shopCategories,
  shopDraftProducts = [],
  shopArchivedProducts = [],
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
  onDeleteArchivedProduct,
  authEvents = [],
  authEventsStats = { logins24h: 0, logouts24h: 0, totalEvents: 0 },
  appVersion = 'v1.0.0',
  releaseNotes = [],
  formatDateTime
}) {
  const [section, setSection] = useState('users');
  const [selectedUserId, setSelectedUserId] = useState(currentUserId);
  const [userQuery, setUserQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userFlagStateFilter, setUserFlagStateFilter] = useState('all');
  const [userTagFilter, setUserTagFilter] = useState('all');
  const [userPage, setUserPage] = useState(1);

  const [userForm, setUserForm] = useState(null);
  const [rawUserJson, setRawUserJson] = useState('');
  const [taskDrafts, setTaskDrafts] = useState({});
  const [newTask, setNewTask] = useState(EMPTY_NEW_TASK);
  const [flagReason, setFlagReason] = useState('');
  const [flagTags, setFlagTags] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState('');

  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [banDraft, setBanDraft] = useState({ reason: '', description: '', durationDays: '7' });

  const sectionOptions = useMemo(() => {
    const next = [];
    if (permissions.canViewUsers || permissions.canManageUsers || permissions.canReviewTasks || permissions.canFlagAccounts) {
      next.push({ id: 'users', label: 'Користувачі' });
    }
    if (permissions.canManageShop) {
      next.push({ id: 'shop', label: 'Магазин' });
    }
    if (permissions.canAccessAdminPanel) {
      next.push({ id: 'analytics', label: 'Аналітика' });
      next.push({ id: 'updates', label: 'Оновлення' });
    }
    return next;
  }, [permissions]);

  useEffect(() => {
    if (!sectionOptions.some((entry) => entry.id === section) && sectionOptions.length > 0) {
      setSection(sectionOptions[0].id);
    }
  }, [section, sectionOptions]);

  const filteredUsers = useMemo(() => {
    const query = userQuery.trim().toLowerCase();
    const queryWithoutHash = query.replace(/^#/, '');

    const getTagLabel = (tagId) =>
      (FLAG_TAG_OPTIONS.find((tag) => tag.id === tagId)?.label || tagId || '').toLowerCase();

    return users.filter((user) => {
      const flags = Array.isArray(user.flags) ? user.flags : [];
      const flagsSearchHaystack = flags
        .flatMap((flag) => {
          const tagIds = Array.isArray(flag.tags) ? flag.tags : [];
          const tagLabels = tagIds.map((tagId) => getTagLabel(tagId));
          return [flag.reason || '', ...tagIds, ...tagLabels];
        })
        .join(' ')
        .toLowerCase();
      const haystack = `${user.name} ${user.email} ${user.phone} ${flagsSearchHaystack}`.toLowerCase();

      if (query && !haystack.includes(query) && !haystack.includes(queryWithoutHash)) {
        return false;
      }
      if (userStatusFilter === 'active' && user.isBanned) {
        return false;
      }
      if (userStatusFilter === 'banned' && !user.isBanned) {
        return false;
      }
      if (userFlagStateFilter === 'flagged' && flags.length === 0) {
        return false;
      }
      if (userFlagStateFilter === 'clean' && flags.length > 0) {
        return false;
      }
      if (userTagFilter !== 'all') {
        const hasTag = flags.some((flag) => Array.isArray(flag.tags) && flag.tags.includes(userTagFilter));
        if (!hasTag) {
          return false;
        }
      }
      return true;
    });
  }, [users, userQuery, userStatusFilter, userFlagStateFilter, userTagFilter]);

  const userPagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / 10));
    const safePage = Math.min(userPage, totalPages);
    const start = (safePage - 1) * 10;
    return {
      page: safePage,
      totalPages,
      filteredCount: filteredUsers.length,
      items: filteredUsers.slice(start, start + 10)
    };
  }, [filteredUsers, userPage]);

  const selectedUser = useMemo(() => users.find((user) => user.id === selectedUserId) || null, [users, selectedUserId]);

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      setSelectedUserId(users[0].id);
      return;
    }
    if (selectedUserId && !users.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(users[0]?.id || null);
    }
  }, [users, selectedUserId]);

  useEffect(() => {
    setUserPage(1);
  }, [userQuery, userStatusFilter, userFlagStateFilter, userTagFilter]);

  useEffect(() => {
    if (!selectedUser) {
      setUserForm(null);
      setRawUserJson('');
      setTaskDrafts({});
      setFlagReason('');
      setFlagTags([]);
      return;
    }

    setUserForm({
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone,
      avatar: selectedUser.avatar || '',
      points: String(selectedUser.points),
      subscription: selectedUser.subscription,
      roles: Array.isArray(selectedUser.roles) ? selectedUser.roles : []
    });

    setRawUserJson(JSON.stringify(selectedUser, null, 2));
    setTaskDrafts(
      selectedUser.tasks.reduce((acc, task) => {
        acc[task.id] = { ...task, points: String(task.points) };
        return acc;
      }, {})
    );
  }, [selectedUser]);

  const canMutateSelectedAccount = selectedUser && (permissions.isOwner || !selectedUser.isAdmin);

  const selectedUserStats = useMemo(() => {
    if (!selectedUser) {
      return null;
    }
    const tasks = selectedUser.tasks || [];
    return {
      totalTasks: tasks.length,
      doneTasks: tasks.filter((task) => task.status === 'done').length,
      purchasesCount: (selectedUser.purchases || []).length,
      flagsCount: (selectedUser.flags || []).length
    };
  }, [selectedUser]);

  const analytics = useMemo(() => {
    const series = Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - idx));
      const key = date.toISOString().slice(0, 10);
      return { key, label: key.slice(5) };
    });
    const registrationsMap = Object.fromEntries(series.map((item) => [item.key, 0]));
    users.forEach((user) => {
      const key = String(user.joinedAt || '').slice(0, 10);
      if (key in registrationsMap) {
        registrationsMap[key] += 1;
      }
    });
    return {
      totalUsers: users.length,
      bannedUsers: users.filter((user) => user.isBanned).length,
      flaggedUsersCount: users.filter((user) => (user.flags || []).length > 0).length,
      adminsCount: users.filter((user) => user.isAdmin).length,
      totalTasks: users.flatMap((user) => user.tasks || []).length,
      doneTasks: users.flatMap((user) => user.tasks || []).filter((task) => task.status === 'done').length,
      progressTasks: users.flatMap((user) => user.tasks || []).filter((task) => task.status === 'progress').length,
      todoTasks: users.flatMap((user) => user.tasks || []).filter((task) => task.status === 'todo').length,
      productsCount: shopProducts.length,
      categoriesCount: shopCategories.length,
      onlineUsers: users.filter((user) => user.isOnline).length,
      logins24h: Number(authEventsStats.logins24h || 0),
      logouts24h: Number(authEventsStats.logouts24h || 0),
      authEventsTotal: Number(authEventsStats.totalEvents || 0),
      recentAuthEvents: authEvents.slice(0, 12),
      roleDistribution: [
        ...roleOptions.map((role) => ({
          id: role.id,
          label: role.label,
          count: users.filter((user) => Array.isArray(user.roles) && user.roles.includes(role.id)).length
        })),
        { id: 'owner', label: 'Власник', count: users.filter((user) => user.isAdmin).length }
      ],
      registrationsHistogram: series.map((item) => ({ label: item.label, value: registrationsMap[item.key] })),
      topUsers: [...users].sort((a, b) => Number(b.points || 0) - Number(a.points || 0)).slice(0, 5)
    };
  }, [authEvents, authEventsStats.logins24h, authEventsStats.logouts24h, authEventsStats.totalEvents, roleOptions, shopCategories.length, shopProducts.length, users]);

  const handleSaveTask = async (taskId) => {
    if (!selectedUser) {
      return;
    }
    const draft = taskDrafts[taskId];
    if (!draft) {
      return;
    }
    await onSaveTask(selectedUser.id, { ...draft, points: Number(draft.points) });
  };

  const handleCreateTask = async () => {
    if (!selectedUser) {
      return;
    }
    const created = await onSaveTask(selectedUser.id, { ...newTask, points: Number(newTask.points) });
    if (created) {
      setNewTask(EMPTY_NEW_TASK);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card shadow-sm">
        <div className="card-body d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div>
            <h5 className="mb-1">{permissions.isOwner ? 'Панель адміністратора' : 'Панель модерації'}</h5>
            <div className="text-body-secondary small">
              {permissions.isOwner ? 'Повний доступ власника системи.' : 'Доступ обмежений призначеною роллю.'}
            </div>
          </div>
          {sectionOptions.length > 1 && (
            <div className="btn-group" role="group" aria-label="Admin sections">
              {sectionOptions.map((entry) => (
                <button key={entry.id} type="button" className={`btn btn-sm ${section === entry.id ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSection(entry.id)}>
                  {entry.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {section === 'users' && (
        <AdminUsersSection
          users={users}
          currentUserId={currentUserId}
          roleOptions={roleOptions}
          permissions={permissions}
          userQuery={userQuery}
          onUserQueryChange={setUserQuery}
          userStatusFilter={userStatusFilter}
          onUserStatusFilterChange={setUserStatusFilter}
          userFlagStateFilter={userFlagStateFilter}
          onUserFlagStateFilterChange={setUserFlagStateFilter}
          userTagFilter={userTagFilter}
          onUserTagFilterChange={setUserTagFilter}
          onResetUserFilters={() => {
            setUserStatusFilter('all');
            setUserFlagStateFilter('all');
            setUserTagFilter('all');
          }}
          userPagination={{ ...userPagination, onPageChange: setUserPage }}
          selectedUser={selectedUser}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          userForm={userForm}
          onUserFormChange={(field, value) => setUserForm((prev) => ({ ...prev, [field]: value }))}
          canMutateSelectedAccount={canMutateSelectedAccount}
          selectedUserStats={selectedUserStats}
          formatDateTime={formatDateTime}
          onSaveUser={async () => {
            if (!selectedUser || !userForm) {
              return;
            }
            await onSaveUser(selectedUser.id, { ...userForm, points: Number(userForm.points) });
          }}
          onDeleteSelectedUser={async () => {
            if (!selectedUser) {
              return;
            }
            const confirmed = window.confirm(`Видалити акаунт ${selectedUser.name}? Цю дію неможливо скасувати.`);
            if (confirmed) {
              await onDeleteUser(selectedUser.id);
            }
          }}
          onBanAction={async () => {
            if (!selectedUser) {
              return;
            }
            if (selectedUser.isBanned) {
              await onToggleBan(selectedUser.id);
            } else {
              setBanDraft({ reason: '', description: '', durationDays: '7' });
              setBanModalOpen(true);
            }
          }}
          flagReason={flagReason}
          onFlagReasonChange={setFlagReason}
          flagTags={flagTags}
          onToggleFlagTag={(tagId) => setFlagTags((prev) => (prev.includes(tagId) ? prev.filter((item) => item !== tagId) : [...prev, tagId]))}
          onFlagSelectedUser={async () => {
            if (!selectedUser) {
              return;
            }
            const created = await onFlagUser(selectedUser.id, { reason: flagReason, tags: flagTags });
            if (created) {
              setFlagReason('');
              setFlagTags([]);
            }
          }}
          onResolveFlag={onResolveFlag}
          taskDrafts={taskDrafts}
          onTaskDraftChange={(taskId, field, value) =>
            setTaskDrafts((prev) => ({ ...prev, [taskId]: { ...prev[taskId], [field]: value } }))}
          onSaveTask={handleSaveTask}
          onDeleteTask={onDeleteTask}
          newTask={newTask}
          onNewTaskChange={(field, value) => setNewTask((prev) => ({ ...prev, [field]: value }))}
          onCreateTask={handleCreateTask}
          rawUserJson={rawUserJson}
          onRawUserJsonChange={setRawUserJson}
          onSaveRawUser={async () => {
            if (selectedUser) {
              await onSaveRawUser(selectedUser.id, rawUserJson);
            }
          }}
          onOpenFullscreenImage={setFullscreenImage}
        />
      )}

      {section === 'shop' && permissions.canManageShop && (
        <AdminShopSection
          shopCategories={shopCategories}
          shopProducts={shopProducts}
          shopDraftProducts={shopDraftProducts}
          shopArchivedProducts={shopArchivedProducts}
          onAddCategory={onAddCategory}
          onRenameCategory={onRenameCategory}
          onDeleteCategory={onDeleteCategory}
          onSaveProduct={onSaveProduct}
          onDeleteProduct={onDeleteProduct}
          onSaveDraftProduct={onSaveDraftProduct}
          onDeleteDraftProduct={onDeleteDraftProduct}
          onRestoreArchivedProduct={onRestoreArchivedProduct}
          onDeleteArchivedProduct={onDeleteArchivedProduct}
        />
      )}

      {section === 'analytics' && <AdminAnalyticsSection analytics={analytics} />}
      {section === 'updates' && <AdminUpdatesSection appVersion={appVersion} releaseNotes={releaseNotes} />}

      <AdminBanModal
        open={isBanModalOpen && Boolean(selectedUser)}
        draft={banDraft}
        onDraftChange={setBanDraft}
        onClose={() => setBanModalOpen(false)}
        onSubmit={async (event) => {
          event.preventDefault();
          if (!selectedUser) {
            return;
          }
          const saved = await onToggleBan(selectedUser.id, {
            reason: banDraft.reason,
            description: banDraft.description,
            durationDays: Number(banDraft.durationDays)
          });
          if (saved) {
            setBanModalOpen(false);
          }
        }}
      />

      {fullscreenImage && (
        <div className="fullscreen-image-overlay" onClick={() => setFullscreenImage('')}>
          <img src={fullscreenImage} alt="fullscreen avatar" className="fullscreen-image" />
          <button type="button" className="btn btn-light fullscreen-close-btn" onClick={() => setFullscreenImage('')}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
