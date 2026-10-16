import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueTodayOrOverdue = tasks.filter(
    (t) => !t.completed && t.dueDate && t.dueDate <= todayStr
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-6">
      {/* Total */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-medium">Total Tasks</span>
          <ListTodo className="h-4 w-4 text-indigo-500" />
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {total}
        </p>
      </div>

      {/* Pending */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-medium">In Progress</span>
          <Clock className="h-4 w-4 text-amber-500" />
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
          {pending}
        </p>
      </div>

      {/* Completed */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-medium">Completed</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {completed}
          </p>
          <span className="text-xs text-slate-500 font-medium">
            ({percentage}%)
          </span>
        </div>
      </div>

      {/* Due Alert */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-850">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-medium">Due / Overdue</span>
          <AlertCircle
            className={`h-4 w-4 ${
              dueTodayOrOverdue > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'
            }`}
          />
        </div>
        <p
          className={`mt-2 text-2xl font-bold tracking-tight ${
            dueTodayOrOverdue > 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {dueTodayOrOverdue}
        </p>
      </div>

      {/* Progress Bar Span */}
      {total > 0 && (
        <div className="col-span-2 sm:col-span-4 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">
            <span>Overall Progress</span>
            <span>{percentage}% Done</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
