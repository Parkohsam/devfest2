/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  testConnection,
  User,
} from './firebase';
import {
  syncUserProfile,
  subscribeToUserTasks,
  createTask,
  toggleTaskCompletion,
  updateTaskDetails,
  deleteTaskItem,
  batchDeleteTasks,
} from './services/taskService';
import {
  Task,
  FilterStatus,
  SortOption,
  TaskCategory,
  TaskPriority,
} from './types';
import { Navbar } from './components/Navbar';
import { AuthHero } from './components/AuthHero';
import { TaskStats } from './components/TaskStats';
import { TaskInput } from './components/TaskInput';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskItem } from './components/TaskItem';
import { TaskEditModal } from './components/TaskEditModal';
import { TenantSecurityModal } from './components/TenantSecurityModal';
import { UnauthorizedDomainModal } from './components/UnauthorizedDomainModal';
import {
  AlertCircle,
  Download,
  CheckCircle2,
  ListFilter,
  Sparkles,
  Inbox,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Modals & Active Edit
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);

  // Status & Feedback toasts
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  }, []);

  // 1. Initial Connection Validation
  useEffect(() => {
    testConnection().then((connected) => {
      setIsOnline(connected);
    });
  }, []);

  // 2. Auth State Observer & Firestore Task Subscription
  useEffect(() => {
    let unsubscribeTasks: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);

      if (currentUser) {
        setIsTasksLoading(true);
        // Sync profile record in Firestore
        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn('Profile sync notice:', err);
        }

        // Real-time listener for current user's isolated tasks
        unsubscribeTasks = subscribeToUserTasks(
          currentUser.uid,
          (fetchedTasks) => {
            setTasks(fetchedTasks);
            setIsTasksLoading(false);
          },
          (err) => {
            console.error('Subscription error:', err);
            showToast('Permission or connection error fetching tasks', 'error');
            setIsTasksLoading(false);
          }
        );
      } else {
        setTasks([]);
        setIsTasksLoading(false);
        if (unsubscribeTasks) {
          unsubscribeTasks();
          unsubscribeTasks = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeTasks) {
        unsubscribeTasks();
      }
    };
  }, [showToast]);

  // Auth Handlers
  const handleSignIn = async () => {
    try {
      setActionLoading(true);
      await signInWithPopup(auth, googleProvider);
      showToast('Successfully signed in with Google!', 'success');
    } catch (error) {
      console.error('Sign in failed:', error);
      const isUnauthorizedDomain =
        (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'auth/unauthorized-domain') ||
        (error instanceof Error && error.message.includes('auth/unauthorized-domain'));

      if (isUnauthorizedDomain) {
        setIsDomainModalOpen(true);
        showToast('Domain not authorized in Firebase Console yet. Follow the popup steps.', 'error');
      } else {
        showToast(
          error instanceof Error ? error.message : 'Google Sign-in failed',
          'error'
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setActionLoading(true);
      await signOut(auth);
      showToast('Signed out successfully', 'info');
    } catch (error) {
      console.error('Sign out failed:', error);
      showToast('Sign out encountered an error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Task Actions
  const handleAddTask = async (taskInput: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
  }) => {
    if (!user) {
      showToast('Please sign in with Google to add tasks', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await createTask(user.uid, taskInput);
      showToast('Task added to your cloud workspace', 'success');
    } catch (error) {
      console.error('Error creating task:', error);
      showToast('Failed to add task: ' + (error instanceof Error ? error.message : ''), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!user) return;
    const newStatus = !task.completed;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: newStatus } : t))
    );

    try {
      await toggleTaskCompletion(user.uid, task.id, newStatus);
    } catch (error) {
      console.error('Error toggling task:', error);
      // Revert optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !newStatus } : t))
      );
      showToast('Failed to update task status', 'error');
    }
  };

  const handleSaveEditedTask = async (
    taskId: string,
    updates: {
      title: string;
      description?: string;
      priority: TaskPriority;
      category: TaskCategory;
      dueDate?: string;
      completed: boolean;
    }
  ) => {
    if (!user) return;
    setActionLoading(true);
    try {
      await updateTaskDetails(user.uid, taskId, updates);
      showToast('Task updated successfully', 'success');
    } catch (error) {
      console.error('Error saving task edits:', error);
      showToast('Failed to update task', 'error');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    try {
      await deleteTaskItem(user.uid, taskId);
      showToast('Task deleted', 'info');
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast('Failed to delete task', 'error');
    }
  };

  const handleClearCompleted = async () => {
    if (!user) return;
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) return;

    setActionLoading(true);
    try {
      await batchDeleteTasks(user.uid, completedIds);
      showToast(`Cleared ${completedIds.length} completed tasks`, 'info');
    } catch (error) {
      console.error('Error clearing tasks:', error);
      showToast('Failed to clear completed tasks', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Export Tasks (JSON)
  const handleExportTasks = () => {
    if (tasks.length === 0) return;
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `taskflow_export_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported tasks to JSON file', 'success');
  };

  // Filter & Sort Calculation
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Status
        if (statusFilter === 'active' && t.completed) return false;
        if (statusFilter === 'completed' && !t.completed) return false;

        // Category
        if (categoryFilter !== 'all' && t.category !== categoryFilter)
          return false;

        // Priority
        if (priorityFilter !== 'all' && t.priority !== priorityFilter)
          return false;

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchDesc = (t.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        if (sortOption === 'priority') {
          const weights: Record<TaskPriority, number> = {
            urgent: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        if (sortOption === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortOption === 'oldest') {
          const aTime =
            'seconds' in (a.createdAt || {})
              ? (a.createdAt as { seconds: number }).seconds
              : 0;
          const bTime =
            'seconds' in (b.createdAt || {})
              ? (b.createdAt as { seconds: number }).seconds
              : 0;
          return aTime - bTime;
        }
        // newest (default)
        const aTime =
          'seconds' in (a.createdAt || {})
            ? (a.createdAt as { seconds: number }).seconds
            : 0;
        const bTime =
          'seconds' in (b.createdAt || {})
            ? (b.createdAt as { seconds: number }).seconds
            : 0;
        return bTime - aTime;
      });
  }, [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery, sortOption]);

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold shadow-xl border ${
              notification.type === 'error'
                ? 'border-rose-300 bg-rose-600 text-white dark:border-rose-700'
                : notification.type === 'info'
                ? 'border-slate-300 bg-slate-900 text-white dark:border-slate-700 dark:bg-slate-800'
                : 'border-emerald-300 bg-emerald-600 text-white dark:border-emerald-700'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        isOnline={isOnline}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {isAuthLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-xs font-semibold text-slate-500">
              Verifying Google Authentication &amp; Firestore session...
            </p>
          </div>
        ) : !user ? (
          <AuthHero onSignIn={handleSignIn} isLoading={actionLoading} />
        ) : (
          <div>
            {/* User Greeting & Header Actions */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Welcome back, {user.displayName?.split(' ')[0] || 'Friend'}</span>
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your tasks are privately isolated to Firestore collection{' '}
                  <code className="rounded bg-slate-200/80 px-1 py-0.5 font-mono text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    /users/{user.uid.slice(0, 8)}.../tasks
                  </code>
                </p>
              </div>

              {tasks.length > 0 && (
                <button
                  onClick={handleExportTasks}
                  className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-xs hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Export tasks to JSON backup"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON</span>
                </button>
              )}
            </div>

            {/* Statistics Bar */}
            <TaskStats tasks={tasks} />

            {/* Task Creation Input */}
            <TaskInput onAddTask={handleAddTask} isLoading={actionLoading} />

            {/* Filter Bar */}
            <TaskFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              sortOption={sortOption}
              onSortOptionChange={setSortOption}
              counts={counts}
              onClearCompleted={handleClearCompleted}
              hasCompleted={counts.completed > 0}
            />

            {/* Task List */}
            {isTasksLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin text-indigo-500 mb-2" />
                <p className="text-xs">Loading your personal tasks from Firestore...</p>
              </div>
            ) : filteredAndSortedTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-400">
                  {searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all' ? (
                    <ListFilter className="h-6 w-6" />
                  ) : (
                    <Inbox className="h-6 w-6" />
                  )}
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all'
                    ? 'No matching tasks found'
                    : 'Your to-do list is empty'}
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  {searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search keywords, priority, or category filters.'
                    : 'Add a new task above to begin organizing your goals in real time.'}
                </p>
                {(searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="mt-4 rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredAndSortedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={(t) => setEditingTask(t)}
                    onDelete={handleDeleteTask}
                    isUpdating={actionLoading}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          isOpen={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveEditedTask}
          isLoading={actionLoading}
        />
      )}

      {/* Tenant Security Inspector Modal */}
      <TenantSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        user={user}
      />

      {/* Unauthorized Domain Helper Modal */}
      <UnauthorizedDomainModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />
    </div>
  );
}
