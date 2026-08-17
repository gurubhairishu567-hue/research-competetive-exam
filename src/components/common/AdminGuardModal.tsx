import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ShieldCheck, Lock, Key, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminGuardModal: React.FC = () => {
  const { 
    showAdminLockModal, 
    setShowAdminLockModal, 
    adminLockFeatureName, 
    setIsAdminMode, 
    setCurrentPage 
  } = useApp();

  const [adminPasscode, setAdminPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!showAdminLockModal) return null;

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === 'admin123' || adminPasscode === 'nexus2026' || adminPasscode.toLowerCase() === 'admin') {
      setIsAdminMode(true);
      setSuccessMsg('Admin Privileges Activated! You now have full creation and database access.');
      setTimeout(() => {
        setShowAdminLockModal(false);
        setSuccessMsg('');
        setAdminPasscode('');
      }, 1200);
    } else {
      setErrorMsg('Incorrect Admin Passcode. Default test passcode is: admin123');
    }
  };

  const handleQuickActivate = () => {
    setIsAdminMode(true);
    setSuccessMsg('Switched to Admin Role (gurubhairishu567@gmail.com)');
    setTimeout(() => {
      setShowAdminLockModal(false);
      setSuccessMsg('');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-white relative">
        
        {/* Close Button */}
        <button
          onClick={() => setShowAdminLockModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-300 dark:border-amber-700/50">
              <ShieldAlert className="w-3 h-3" />
              <span>Admin Access Required (एडमिन एक्सेस सुरक्षित)</span>
            </div>
            <h2 className="text-xl font-black mt-1">Admin Action Locked</h2>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2 leading-relaxed">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Action: <span className="text-indigo-600 dark:text-indigo-400 font-bold">"{adminLockFeatureName || 'Content Addition / Creation'}"</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            Yeh button aur backend addition sirf <strong className="text-slate-900 dark:text-white">Admin</strong> ke liye restricted hai taaki database integrity safe rahe.
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Passcode Unlock Form */}
        <form onSubmit={handleUnlockAdmin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Enter Admin Passcode:</span>
              <span className="text-[11px] font-normal text-slate-400">Default: admin123</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={adminPasscode}
                onChange={e => {
                  setAdminPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter passcode..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-500 font-semibold">{errorMsg}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Access</span>
            </button>

            <button
              type="button"
              onClick={handleQuickActivate}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Admin Mode</span>
            </button>
          </div>
        </form>

        {/* Footer Link to Admin Dashboard */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Need to configure Supabase backend?</span>
          <button
            onClick={() => {
              setShowAdminLockModal(false);
              setCurrentPage('admin');
            }}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Open Admin & SQL Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
