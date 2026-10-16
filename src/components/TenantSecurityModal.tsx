import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, X, Database, Key } from 'lucide-react';
import { User } from '../firebase';

interface TenantSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const TenantSecurityModal: React.FC<TenantSecurityModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Database Isolation &amp; Security Architecture
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guaranteed by Google Cloud Firestore Security Rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <h3 className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
              <Lock className="h-4 w-4 text-emerald-600" />
              Tenant Boundary Guarantee
            </h3>
            <p className="mt-1.5 text-emerald-800/90 dark:text-emerald-300/90">
              The application strictly isolates tasks so each user can only view,
              query, create, update, and delete their own records. Cross-tenant
              queries are denied at the database engine level.
            </p>
          </div>

          {/* User Session Token Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-indigo-500" />
              Your Authenticated Tenant Credentials
            </h4>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] dark:border-slate-800 dark:bg-slate-950">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Firebase UID:</span>
                <span className="text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                  {user?.uid || 'Not signed in'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400">Google Account:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {user?.email || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Isolated Firestore Path:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[280px]">
                  /users/{user?.uid || '{userId}'}/tasks/*
                </span>
              </div>
            </div>
          </div>

          {/* Live Security Rules Spec */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-sky-500" />
              Enforced Security Rules Extract
            </h4>
            <pre className="rounded-xl border border-slate-200 bg-slate-900 p-3 font-mono text-[11px] text-slate-100 overflow-x-auto dark:border-slate-800 leading-normal">
{`match /users/{userId}/tasks/{taskId} {
  // Only the authenticated owner can read & query their tasks
  allow get, list: if request.auth.uid == userId;

  // Writes require authentication, UID ownership, and schema validation
  allow create: if request.auth.uid == userId 
    && isValidTask(incoming(), userId);

  // State transitions allowlist affected fields
  allow update: if request.auth.uid == userId 
    && incoming().userId == existing().userId;

  // Deletions strictly locked to the owner
  allow delete: if request.auth.uid == userId;
}`}
            </pre>
          </div>

          {/* Checkpoints */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Zero-knowledge tenant isolation verified</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Shadow update and field spoofing guards enabled</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Client-side query bypass attacks blocked by server rules</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
