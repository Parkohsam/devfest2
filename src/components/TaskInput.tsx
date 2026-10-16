import React, { useState } from 'react';
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertTriangle,
  Tag,
  AlignLeft,
} from 'lucide-react';
import { TaskCategory, TaskPriority } from '../types';

interface TaskInputProps {
  onAddTask: (task: {
    title: string;
    description?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a task title');
      return;
    }
    setErrorMsg('');

    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate: dueDate || undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      // keep category or reset
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const priorityOptions: { value: TaskPriority; label: string; color: string }[] =
    [
      { value: 'low', label: 'Low', color: 'hover:bg-slate-100 text-slate-700 dark:text-slate-300' },
      { value: 'medium', label: 'Medium', color: 'hover:bg-sky-50 text-sky-700 dark:text-sky-300' },
      { value: 'high', label: 'High', color: 'hover:bg-amber-50 text-amber-700 dark:text-amber-300' },
      { value: 'urgent', label: 'Urgent', color: 'hover:bg-rose-50 text-rose-700 dark:text-rose-300' },
    ];

  const categoryOptions: { value: TaskCategory; label: string }[] = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'general', label: 'General' },
  ];

  return (
    <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-850">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="What needs to get done? (Press Enter to add)"
              maxLength={200}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Toggle extra options (description, priority, due date)"
          >
            <span>Options</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {errorMsg && (
          <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
            {errorMsg}
          </p>
        )}

        {/* Expanded Options */}
        {isExpanded && (
          <div className="mt-4 space-y-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
            {/* Description / Notes */}
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <AlignLeft className="h-3.5 w-3.5 text-slate-400" />
                <span>Notes &amp; Details (Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add additional details, links, or context..."
                rows={2}
                maxLength={2000}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Priority */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <AlertTriangle className="h-3.5 w-3.5 text-slate-400" />
                  <span>Priority</span>
                </label>
                <div className="grid grid-cols-4 gap-1 rounded-xl border border-slate-200 p-1 dark:border-slate-700">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`rounded-lg py-1 text-center text-xs font-medium transition ${
                        priority === opt.value
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
