import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Zap,
  MessageSquare,
  Flame,
  CheckSquare,
  FileSearch,
  Mail,
  UserCheck,
  Database,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, selectedExam, setCurrentPage, supabaseStatus, syncAllToSupabase } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-1');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const weeklyData = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 5.0 },
    { day: 'Wed', hours: 3.5 },
    { day: 'Thu', hours: 6.0 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 7.5 },
    { day: 'Sun', hours: 5.5 },
  ];

  const subjectPerformance = [
    { subject: 'Polity & Governance', accuracy: 88, color: 'bg-emerald-500', isWeak: false },
    { subject: 'History & Culture', accuracy: 74, color: 'bg-indigo-500', isWeak: false },
    { subject: 'Science & Tech', accuracy: 78, color: 'bg-indigo-500', isWeak: false },
    { subject: 'Geography', accuracy: 69, color: 'bg-amber-500', isWeak: true },
    { subject: 'Indian Economy', accuracy: 61, color: 'bg-rose-500', isWeak: true },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {getGreeting()}, {user.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Aspirant Account
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Target Exam: <strong className="text-slate-900 dark:text-white">{selectedExam.name}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact: <strong>{user.email}</strong></span>
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={syncAllToSupabase}
            disabled={supabaseStatus.syncing}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-1.5"
            title="Supabase Database Active: tdxlapvovjlpaycrnnhk"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{supabaseStatus.syncing ? 'Syncing...' : 'Supabase Synced'}</span>
          </button>
          <a
            href={`mailto:${user.email}`}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Support</span>
          </a>
          <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            Streak: {user.streakDays} Days
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Study Time</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.floor(user.studyTimeTodayMinutes / 60)}.{user.studyTimeTodayMinutes % 60} hrs
          </p>
          <div className="mt-2 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
            <div className="h-1 w-3/4 bg-indigo-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Questions Solved</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.questionsSolvedToday}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+12% from yesterday</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Avg. Accuracy</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.accuracyRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Target: 85%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">National Rank</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">#1,402</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">Top 2% of candidates</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Target Plan & Research Spotlight */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          
          {/* Target Study Plan Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                Target Study Plan
              </h2>
              <button
                onClick={() => setCurrentPage('study-planner')}
                className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline"
              >
                Customize Roadmap
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              {[
                {
                  id: 'plan-1',
                  time: 'AM',
                  title: 'Polity: Fundamental Rights',
                  desc: 'Focus on Articles 14–32. High probability topic for upcoming exam.',
                  duration: '90 mins',
                  tag: 'Research Mode Active'
                },
                {
                  id: 'plan-2',
                  time: 'PM',
                  title: 'Modern History: Revolt of 1857',
                  desc: 'Revision of leaders and causes. Solve 50 PYQs after study.',
                  duration: '120 mins',
                  tag: null
                },
                {
                  id: 'plan-3',
                  time: 'EV',
                  title: 'Economy: RBI Monetary Policy',
                  desc: "Review today's PIB notification on repo rates.",
                  duration: '60 mins',
                  tag: null
                }
              ].map(item => {
                const isSelected = selectedPlanId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPlanId(item.id)}
                    className={`flex items-start gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-xs shrink-0 transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {item.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-white'}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                      <div className="mt-2 flex gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded ${
                          isSelected
                            ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {item.duration}
                        </span>
                        {item.tag && (
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="target-study-plan-selection"
                      checked={isSelected}
                      onChange={() => setSelectedPlanId(item.id)}
                      className="mt-1.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research Spotlight Banner */}
          <div className="bg-[#0F172A] rounded-xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
            <div>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Research Spotlight</p>
              <h3 className="text-lg font-bold">Analysis of G20 Delhi Declaration</h3>
              <p className="text-slate-400 text-sm mt-1">Deep analysis for International Relations and GS Paper II.</p>
            </div>
            <button
              onClick={() => setCurrentPage('research', { topic: 'G20 Delhi Declaration' })}
              className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition whitespace-nowrap"
            >
              Enter Research Mode
            </button>
          </div>

        </div>

        {/* Right Column: AI Assistant & Live Updates */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          
          {/* AI Prep Assistant */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <h2 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">
                AI Prep Assistant
              </h2>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-1 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-100 dark:border-slate-700">
                Hello {user.name.split(' ')[0]}! I've analyzed your performance. You're doing great in <span className="font-bold text-indigo-600 dark:text-indigo-400">Polity</span> (88%), but let's focus on <span className="font-bold text-rose-600 dark:text-rose-400">Economy</span> today.
              </div>
              <div className="bg-indigo-600 p-3 rounded-lg text-white leading-relaxed ml-4">
                Explain the concept of "Basic Structure Doctrine" in 3 bullet points.
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-700 dark:text-slate-200 leading-relaxed border border-slate-100 dark:border-slate-700 space-y-1">
                <p>1. <span className="font-bold">Origin:</span> Kesavananda Bharati case (1973).</p>
                <p>2. <span className="font-bold">Limit:</span> Parliament cannot alter the basic structure.</p>
                <p>3. <span className="font-bold">Judicial Review:</span> Supreme Court holds final authority.</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('ai-assistant')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat with AI Tutor</span>
            </button>
          </div>

          {/* Live Updates Box */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-3 uppercase tracking-wide">
              Live Notifications
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-rose-500 rounded-full shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">UPSC CSE 2024 Prelims Results</p>
                  <p className="text-[10px] text-slate-500 truncate">Available now. Official PDF uploaded.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-amber-500 rounded-full shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">RBI Grade B Recruitment 2024</p>
                  <p className="text-[10px] text-slate-500 truncate">Notification expected in 48 hours.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-indigo-500 rounded-full shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Daily Editorial: The Hindu</p>
                  <p className="text-[10px] text-slate-500 truncate">AI summary ready in Current Affairs.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Weekly Progress & Subject Accuracy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Study Hours */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Weekly Study Hours</h3>
              <p className="text-xs text-slate-400">Total logged this week: 36.0 Hours</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full">
              +12% vs last week
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Accuracy Breakdown */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Subject Accuracy Breakdown
          </h3>

          <div className="space-y-3.5">
            {subjectPerformance.map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    {sub.subject}
                    {sub.isWeak && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold">
                        Weak Area
                      </span>
                    )}
                  </span>
                  <span className="font-bold">{sub.accuracy}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.accuracy}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

