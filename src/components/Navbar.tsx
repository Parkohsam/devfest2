import React from 'react';
import {
  CheckSquare,
  ShieldCheck,
  LogOut,
  LogIn,
  Radio,
  User as UserIcon,
} from 'lucide-react';
import { User } from '../firebase';

interface NavbarProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenSecurityModal: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSignIn,
  onSignOut,
  onOpenSecurityModal,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/20">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal & Collaborative Tasks
            </p>
          </div>
        </div>

        {/* Center / Security Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenSecurityModal}
            className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
            title="Inspect Firestore Security & Tenant Isolation"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Strict Tenant Isolation</span>
          </button>

          <div
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
            title="Firestore Real-time Listener Active"
          >
            <Radio
              className={`h-3 w-3 ${
                isOnline ? 'animate-pulse text-emerald-500' : 'text-amber-500'
              }`}
            />
            <span>{isOnline ? 'Real-time' : 'Connecting'}</span>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs dark:bg-indigo-900 dark:text-indigo-200">
                    {user.displayName?.charAt(0) || <UserIcon className="h-4 w-4" />}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-slate-900 dark:text-white leading-tight">
                    {user.displayName || 'Google Account'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition active:scale-95 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
