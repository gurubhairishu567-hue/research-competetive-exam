import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  BookOpen,
  Sparkles,
  Compass,
  CheckCircle2,
  TrendingUp,
  Target,
  ArrowRight,
  Shield,
  Star,
  Zap,
  Award,
  Users,
  ChevronRight,
  HelpCircle,
  Microscope,
  Globe
} from 'lucide-react';
import { SAMPLE_FAQS } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { setCurrentPage, setSearchQuery, exams, currentAffairs, setSelectedExamById } = useApp();
  const [heroSearchInput, setHeroSearchInput] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      setSearchQuery(heroSearchInput.trim());
      setCurrentPage('search', { query: heroSearchInput.trim() });
    }
  };

  const handleQuickTopicClick = (topic: string) => {
    setSearchQuery(topic);
    setCurrentPage('search', { query: topic });
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-bold tracking-wide uppercase border border-indigo-800/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Competitive Exam Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Research Smarter. Prepare Better. <br className="hidden sm:inline" />
            <span className="text-indigo-400">
              Crack Your Examination.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Your comprehensive AI-powered research portal, digital library, current-affairs platform, practice engine, and personalized study assistant for Indian competitive examinations.
          </p>

          {/* Universal Hero Search Bar */}
          <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl mx-auto mt-4">
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearchInput}
                onChange={e => setHeroSearchInput(e.target.value)}
                placeholder="Search exams, topics, current affairs, schemes..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0 flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick search chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-400">Popular:</span>
              {['Fundamental Rights', 'India GDP 2026', 'UPSC Polity Questions', 'Semiconductor Mission', 'Monetary Policy'].map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickTopicClick(chip)}
                  className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-white" />
              <span>Start Preparing Now</span>
            </button>

            <button
              onClick={() => setCurrentPage('exams')}
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Explore All Exams</span>
            </button>

            <button
              onClick={() => setCurrentPage('ai-assistant')}
              className="px-6 py-3 rounded-lg bg-white text-slate-900 font-bold text-sm shadow hover:bg-slate-100 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Mentor</span>
            </button>

            <button
              onClick={() => setCurrentPage('world-news')}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-emerald-200" />
              <span>World News (AI)</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. POPULAR EXAMS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-blue-600" />
              <span>Popular Competitive Examinations</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Detailed patterns, syllabus breakdowns, PYQs, and preparation strategies.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('exams')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Exams</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {exams.slice(0, 4).map(ex => (
            <div
              key={ex.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase tracking-wider">
                    {ex.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Difficulty: <strong className="text-amber-600 dark:text-amber-400">{ex.difficulty}</strong>
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {ex.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {ex.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div><strong>Upcoming:</strong> {ex.upcomingDate}</div>
                  <div className="text-slate-400 text-[11px]"><strong>Qualification:</strong> {ex.qualification}</div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedExamById(ex.id);
                    setCurrentPage('exam-detail', { examId: ex.id });
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition text-center"
                >
                  Explore Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TODAY'S CURRENT AFFAIRS TEASER */}
      <section className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
              Daily Updates
            </span>
            <h2 className="text-xl md:text-2xl font-bold mt-2">Today's High-Yield Current Affairs</h2>
            <p className="text-xs md:text-sm text-slate-400">
              Exam-oriented summaries with key facts, why it matters, and possible Prelims/Mains questions.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('current-affairs')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
          >
            Read All Articles
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentAffairs.map(item => (
            <div
              key={item.id}
              onClick={() => setCurrentPage('current-affairs', { articleId: item.id })}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500 transition cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="text-blue-400 font-semibold">{item.category}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Read Analysis →</span>
                <span className="text-slate-500 text-[10px]">{item.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY CAPABILITIES GRID */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Comprehensive Exam Preparation Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need from initial syllabus research to final test performance analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Deep Research Mode',
              icon: Microscope,
              color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
              desc: 'Investigate complex topics like Semiconductor Mission or Article 300A with timelines, key facts, government schemes, and verified source citations.',
              action: () => setCurrentPage('research')
            },
            {
              title: 'AI MCQ & Quiz Engine',
              icon: Zap,
              color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60',
              desc: 'Generate unlimited custom quizzes by topic, exam level, and difficulty with detailed answer explanations.',
              action: () => setCurrentPage('quiz-generator')
            },
            {
              title: 'Mock Test Simulator',
              icon: Target,
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
              desc: 'Real exam-hall environment with timers, question palette, negative marking calculation, and subject performance reports.',
              action: () => setCurrentPage('mock-tests')
            },
            {
              title: 'AI Study Planner',
              icon: TrendingUp,
              color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
              desc: 'Multi-week roadmap generation customized for your daily available study hours and target score.',
              action: () => setCurrentPage('study-planner')
            },
            {
              title: 'Interactive Digital Notes',
              icon: BookOpen,
              color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60',
              desc: 'Organize notes into subject folders, bookmark key articles, and use AI to summarize or turn notes into flashcards.',
              action: () => setCurrentPage('notes')
            },
            {
              title: 'Exam Comparison Matrix',
              icon: Shield,
              color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60',
              desc: 'Side-by-side comparison of 2–4 exams analyzing syllabus overlap, pattern differences, and age eligibility.',
              action: () => setCurrentPage('compare')
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={item.action}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer space-y-3 group"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="space-y-6 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Answers to common queries regarding platform features, exam coverage, and AI tools.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {SAMPLE_FAQS.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-black">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 pl-5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
