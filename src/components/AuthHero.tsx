import React from 'react';
import {
  Lock,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface AuthHeroProps {
  onSignIn: () => void;
  isLoading: boolean;
}

export const AuthHero: React.FC<AuthHeroProps> = ({ onSignIn, isLoading }) => {
  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <div className="text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-800 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>Firebase Authenticated &amp; Zero-Trust Data Isolation</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          A Secure, Collaborative{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
            To-Do Workspace
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          Organize your daily priorities, track deadlines, and stay productive.
          Backed by Google Cloud Firestore with strict per-user database
          isolation rules.
        </p>

        {/* Google Sign-In Action */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onSignIn}
            disabled={isLoading}
            className="group flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-750"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          No passwords required. Fast, seamless authentication with your Google account.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            Strict Data Isolation
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every task is securely restricted to your unique user ID inside
            Firestore. No other user can read, modify, or query your tasks.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            Instant Real-time Sync
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Live updates across tabs and browsers. Changes reflect in real time
            without needing to refresh your page.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Tag className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            Tiers &amp; Categories
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Tag tasks by category (Work, Personal, Shopping, Health) with
            flexible priority levels and due-date tracking.
          </p>
        </div>
      </div>

      {/* Interactive Mock Preview */}
      <div className="mt-12 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-400"></div>
            <div className="h-3 w-3 rounded-full bg-amber-400"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
            <span className="ml-2 text-xs font-medium text-slate-500">Live Database Preview</span>
          </div>
          <span className="text-xs text-indigo-600 font-medium">3 sample tasks ready</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-xs dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium line-through text-slate-400 dark:text-slate-500">
                  Set up Firebase Firestore rules &amp; ABAC policy
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dark:bg-emerald-950/50 dark:text-emerald-300">
                    Completed
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Work
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
              Urgent
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-xs dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-md border-2 border-slate-300 dark:border-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Review sprint objectives with team
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Today
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Work
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              High
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
