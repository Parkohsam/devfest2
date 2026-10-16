import React, { useState } from 'react';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { Task, TaskPriority, TaskCategory } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isUpdating: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isUpdating,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityStyles: Record<
    TaskPriority,
    { label: string; bg: string; text: string; border: string }
  > = {
    urgent: {
      label: 'Urgent',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
    },
    high: {
      label: 'High',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
    },
    medium: {
      label: 'Medium',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800',
    },
    low: {
      label: 'Low',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
    },
  };

  const categoryStyles: Record<TaskCategory, string> = {
    work: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200/60',
    personal: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/60',
    shopping: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200/60',
    health: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60',
    finance: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60',
    general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60',
  };

  // Due date formatting & status
  let dueDateLabel = '';
  let isOverdue = false;
  let isDueToday = false;

  if (task.dueDate) {
    const today = new Date().toISOString().split('T')[0];
    if (task.dueDate === today) {
      dueDateLabel = 'Today';
      isDueToday = true;
    } else if (task.dueDate < today) {
      dueDateLabel = 'Overdue';
      isOverdue = true;
    } else {
      dueDateLabel = task.dueDate;
    }
  }

  const pConfig = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <div
      className={`group relative rounded-2xl border transition-all ${
        task.completed
          ? 'border-slate-200/60 bg-slate-50/50 dark:border-slate-800/60 dark:bg-slate-900/40 opacity-75'
          : 'border-slate-200/80 bg-white shadow-xs hover:shadow-md dark:border-slate-800 dark:bg-slate-850'
      }`}
    >
      <div className="flex items-start gap-3.5 p-4">
        {/* Completion Checkbox */}
        <button
          onClick={() => onToggleComplete(task)}
          disabled={isUpdating}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all active:scale-90 ${
            task.completed
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
              : 'border-slate-300 bg-white hover:border-indigo-500 dark:border-slate-600 dark:bg-slate-800'
          }`}
          title={task.completed ? 'Mark as active' : 'Mark as completed'}
        >
          {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>

        {/* Task Title & Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-semibold break-words transition-all ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </span>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 ml-auto sm:ml-0">
              {/* Priority */}
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${pConfig.bg} ${pConfig.text} ${pConfig.border}`}
              >
                {pConfig.label}
              </span>

              {/* Category */}
              <span
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize ${
                  categoryStyles[task.category] || categoryStyles.general
                }`}
              >
                <Tag className="h-3 w-3" />
                <span>{task.category}</span>
              </span>

              {/* Due Date */}
              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                    !task.completed && isOverdue
                      ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300'
                      : !task.completed && isDueToday
                      ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{dueDateLabel}</span>
                  {!task.completed && isOverdue && (
                    <AlertCircle className="h-3 w-3 text-rose-600 animate-pulse" />
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Description Excerpt or Toggle */}
          {task.description && (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              {showNotes ? (
                <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60 whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-750">
                  {task.description}
                </div>
              ) : (
                <p className="line-clamp-1 italic text-slate-500 dark:text-slate-400">
                  {task.description}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className="mt-1 flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>{showNotes ? 'Hide notes' : 'View notes'}</span>
                {showNotes ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons (Edit / Delete) */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            disabled={isUpdating}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            title="Edit task"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isUpdating}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Banner */}
      {showDeleteConfirm && (
        <div className="flex items-center justify-between border-t border-rose-100 bg-rose-50/80 px-4 py-2.5 dark:border-rose-950 dark:bg-rose-950/40 rounded-b-2xl">
          <span className="text-xs font-medium text-rose-800 dark:text-rose-200">
            Permanently delete this task?
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white/80 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(task.id);
                setShowDeleteConfirm(false);
              }}
              className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-rose-500"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
