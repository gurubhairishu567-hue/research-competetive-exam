import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Scale,
  Microscope,
  Newspaper,
  CheckSquare,
  Zap,
  Target,
  FileText,
  BookOpenText,
  Layers,
  Calendar,
  CheckCircle2,
  Library,
  Bookmark,
  Bot,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { currentPage, setCurrentPage } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'Explore Exams', icon: Compass },
    { id: 'compare', label: 'Exam Comparison', icon: Scale },
    { id: 'research', label: 'Research Mode', icon: Microscope, highlight: true },
    { id: 'current-affairs', label: 'Current Affairs', icon: Newspaper },
    { id: 'mcq-practice', label: 'MCQ Practice', icon: CheckSquare },
    { id: 'quiz-generator', label: 'AI Quiz Generator', icon: Zap },
    { id: 'mock-tests', label: 'Mock Tests', icon: Target },
    { id: 'pyq', label: 'PYQ Papers & Analysis', icon: FileText, highlight: true },
    { id: 'notes', label: 'Digital Notes', icon: BookOpenText },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'study-planner', label: 'AI Study Planner', icon: Calendar },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: CheckCircle2 },
    { id: 'resources', label: 'Resource Library', icon: Library },
    { id: 'bookmarks', label: 'My Bookmarks', icon: Bookmark },
    { id: 'ai-assistant', label: 'AI Study Mentor', icon: Bot, highlight: true },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck }
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800 select-none">
      
      {/* Mobile Sidebar Close Button */}
      <div className="lg:hidden p-4 flex items-center justify-between border-b border-slate-800">
        <span className="font-bold text-white text-sm">ExamNexus Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Core Preparation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : item.highlight
                  ? 'text-indigo-400 hover:bg-slate-800 hover:text-indigo-300'
                  : 'text-slate-400 hover:bg-slate-800/90 hover:text-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              <span className="truncate">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-800/50">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
        <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
          <span>Target Exam</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">ACTIVE</span>
        </div>
        <p className="text-slate-300 text-[11px] truncate font-medium">UPSC Civil Services</p>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-15 h-[calc(100vh-3.75rem)] overflow-y-auto">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
