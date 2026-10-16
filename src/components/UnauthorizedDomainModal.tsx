import React, { useState } from 'react';
import { ShieldAlert, ExternalLink, Copy, Check, X } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface UnauthorizedDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnauthorizedDomainModal: React.FC<UnauthorizedDomainModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentDomain = window.location.hostname;
  const projectId = firebaseConfig.projectId;
  const consoleAuthUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl dark:border-amber-900/60 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Authorize Domain for Google Sign-In
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Firebase Error: <code className="text-rose-500 font-mono">auth/unauthorized-domain</code>
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

        {/* Body */}
        <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Firebase Authentication requires every domain where Google Sign-In runs
            to be added to your project's <strong>Authorized domains</strong> allowlist.
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                Domain to authorize:
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Domain</span>
                  </>
                )}
              </button>
            </div>
            <code className="block break-all rounded-lg bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              {currentDomain}
            </code>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
              Steps to enable (Takes ~30 seconds):
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-400 pl-1">
              <li>
                Open the{' '}
                <a
                  href={consoleAuthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1 dark:text-indigo-400"
                >
                  <span>Firebase Authentication Settings</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                Navigate to the <strong>Settings</strong> tab and scroll to{' '}
                <strong>Authorized domains</strong>.
              </li>
              <li>
                Click <strong>Add domain</strong> and paste{' '}
                <code className="font-mono bg-slate-100 px-1 py-0.5 rounded dark:bg-slate-800">
                  {currentDomain}
                </code>
                .
              </li>
              <li>
                Click <strong>Save</strong> and try signing in with Google again!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <a
            href={consoleAuthUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition"
          >
            <span>Open Firebase Console</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            I've Added It
          </button>
        </div>
      </div>
    </div>
  );
};
