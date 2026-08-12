import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sun, Moon, Bell, BookOpen, User, Menu, X, Check, Sparkles, Shield, Mail, ExternalLink, Database } from 'lucide-react';
import { SupabaseStatusModal } from '../common/SupabaseStatusModal';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    user,
    theme,
    toggleTheme,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    exams,
    selectedExam,
    setSelectedExamById,
    supabaseStatus
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('search', { query: searchQuery.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                ExamNexus <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">AI</span>
              </span>
            </div>
          </div>

          {/* Exam Selector Dropdown */}
          <div className="relative hidden md:block ml-4">
            <button
              onClick={() => setShowExamDropdown(!showExamDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Target: <strong className="text-indigo-600 dark:text-indigo-400">{selectedExam.shortName}</strong></span>
            </button>

            {showExamDropdown && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Target Exam
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {exams.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        setSelectedExamById(ex.id);
                        setShowExamDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                        selectedExam.id === ex.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span>{ex.name}</span>
                      {selectedExam.id === ex.id && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Universal Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search exams, topics, current affairs, schemes..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-xs md:text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* AI Research Shortcut */}
          <button
            onClick={() => setCurrentPage('research')}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Research Mode</span>
          </button>

          {/* Supabase Status Badge */}
          <button
            onClick={() => setShowSupabaseModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition shadow-xs"
            title="Supabase Cloud Database Connected"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Supabase</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50 text-slate-500 dark:text-slate-400'
                          : 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="User Profile"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:inline">
                {user.name.split(' ')[0]}
              </span>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.name}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </p>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <a
                    href={`mailto:${user.email}`}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition"
                  >
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>Send Mail to {user.email}</span>
                  </a>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowSupabaseModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 transition font-medium"
                  >
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Supabase DB (<code className="text-[10px] font-mono">tdxlapvovjlpaycrnnhk</code>)</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('dashboard');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Aspirant Dashboard Overview</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('study-planner');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Personal Roadmap & Preferences</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      <SupabaseStatusModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </header>
  );
};
