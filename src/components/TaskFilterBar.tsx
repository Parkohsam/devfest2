import React from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  Filter,
  Trash2,
} from 'lucide-react';
import { FilterStatus, SortOption, TaskCategory, TaskPriority } from '../types';

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  categoryFilter: TaskCategory | 'all';
  onCategoryFilterChange: (cat: TaskCategory | 'all') => void;
  priorityFilter: TaskPriority | 'all';
  onPriorityFilterChange: (p: TaskPriority | 'all') => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
  onClearCompleted?: () => void;
  hasCompleted: boolean;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortOption,
  onSortOptionChange,
  counts,
  onClearCompleted,
  hasCompleted,
}) => {
  const categories: { value: TaskCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'general', label: 'General' },
  ];

  const priorities: { value: TaskPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <div className="mb-6 space-y-3">
      {/* Search & Sort Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or notes..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-9 text-xs text-slate-900 placeholder-slate-400 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-850 dark:text-white dark:placeholder-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Quick Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
              aria-label="Sort tasks"
              className="bg-transparent font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority Tier</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          {hasCompleted && onClearCompleted && (
            <button
              onClick={onClearCompleted}
              className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/70 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
              title="Delete all finished tasks"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Status tabs & Dropdown Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Status Pills */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          {(['all', 'active', 'completed'] as FilterStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>{st}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  statusFilter === st
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                }`}
              >
                {counts[st]}
              </span>
            </button>
          ))}
        </div>

        {/* Category & Priority Selectors */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
            <Filter className="h-3 w-3 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) =>
                onCategoryFilterChange(e.target.value as TaskCategory | 'all')
              }
              aria-label="Filter by category"
              className="bg-transparent font-medium focus:outline-hidden cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
            <select
              value={priorityFilter}
              onChange={(e) =>
                onPriorityFilterChange(e.target.value as TaskPriority | 'all')
              }
              aria-label="Filter by priority"
              className="bg-transparent font-medium focus:outline-hidden cursor-pointer"
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
