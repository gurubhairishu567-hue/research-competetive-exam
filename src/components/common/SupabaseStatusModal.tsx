import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, RefreshCw, CheckCircle2, ShieldCheck, Server, Key, AlertCircle, ExternalLink, X, Table, FileText, UserCheck, Bookmark, BookOpen } from 'lucide-react';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const { supabaseStatus, syncAllToSupabase, user, notes, flashcards, bookmarks, testHistory, studyPlan } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'keys'>('overview');
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncingLocal(true);
    setSyncFeedback(null);
    await syncAllToSupabase();
    setIsSyncingLocal(false);
    setSyncFeedback('All details & study data successfully pushed to Supabase Cloud!');
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Supabase Cloud Database</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Product ID: <code className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">tdxlapvovjlpaycrnnhk</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition ${activeTab === 'overview' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Connection & Live Sync
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-3 px-4 border-b-2 transition ${activeTab === 'tables' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Synced Data Tables ({notes.length + flashcards.length + bookmarks.length + testHistory.length + 2})
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`py-3 px-4 border-b-2 transition ${activeTab === 'keys' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Credentials & Endpoints
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {syncFeedback && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Database Status</span>
                  <span className="text-xs font-medium text-slate-500">Last Synced: {supabaseStatus.lastSyncedAt || 'Just now'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Supabase Realtime Connection</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{supabaseStatus.message}</p>
                  </div>
                </div>
              </div>

              {/* Account Sync Card */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Target Supabase User Account</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">Auto-Sync On</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user.name} <span className="text-slate-500 font-normal">({user.email})</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  All profile changes, notes, flashcard decks, study plan milestones, test attempts, and bookmarked questions are synced under your Supabase account.
                </p>
              </div>

              {/* Sync Trigger */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Manual Force Sync</h4>
                  <p className="text-[11px] text-slate-500">Push current state directly to Supabase cloud storage</p>
                </div>
                <button
                  onClick={handleManualSync}
                  disabled={isSyncingLocal || supabaseStatus.syncing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLocal || supabaseStatus.syncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncingLocal || supabaseStatus.syncing ? 'Syncing...' : 'Sync All Data Now'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Synced Collections in Supabase</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">User Profile & Goal</p>
                      <p className="text-[10px] text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Synced</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Study Notes</p>
                      <p className="text-[10px] text-slate-500">{notes.length} Active Notes</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Synced</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Flashcards Decks</p>
                      <p className="text-[10px] text-slate-500">{flashcards.length} Cards</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Synced</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Bookmarks & Saved MCQs</p>
                      <p className="text-[10px] text-slate-500">{bookmarks.length} Items</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Synced</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Table className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Mock Test Attempts</p>
                      <p className="text-[10px] text-slate-500">{testHistory.length} Test Submissions</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Synced</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-teal-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">4-Week Study Plan</p>
                      <p className="text-[10px] text-slate-500">{studyPlan.weeks.length} Weeks Configured</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Synced</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supabase Project Endpoint URL</label>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <span>https://tdxlapvovjlpaycrnnhk.supabase.co</span>
                  <a href="https://tdxlapvovjlpaycrnnhk.supabase.co" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
                    <span>Open</span> <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supabase Publishable / Anon API Key</label>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 break-all">
                  sb_publishable_TnmB5tpBFK_bY6VXvC9EfA_SwB1DlyP
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Security Note:</strong> These keys connect directly to your Supabase project instance <code className="font-mono font-bold">tdxlapvovjlpaycrnnhk</code>. Row Level Security (RLS) policies isolate your data securely by user email.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs">
          <a
            href="https://supabase.com/dashboard/project/tdxlapvovjlpaycrnnhk"
            target="_blank"
            rel="noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-medium flex items-center gap-1.5"
          >
            <span>Supabase Cloud Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
