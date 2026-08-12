import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Filter, ArrowRight, Scale, BookOpen, Layers } from 'lucide-react';
import { ExamCategory } from '../types';

export const ExamsPage: React.FC = () => {
  const { exams, setCurrentPage, setSelectedExamById } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories: (ExamCategory | 'All')[] = ['All', 'UPSC', 'SSC', 'UP Police', 'Banking', 'Railway', 'Defence', 'State PCS', 'Teaching', 'CUET'];

  const filteredExams = exams.filter(e => {
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'All' && e.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Competitive Exam Portal</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Explore Indian Competitive Examinations</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive exam profiles, stage patterns, eligibility age limits, detailed syllabus breakdowns, and recommended study resources for UPSC, SSC, Banking, Railways, and State PCS.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setCurrentPage('compare')}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-2"
          >
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Launch Exam Comparison Matrix</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="Extreme">Extreme</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
          </select>
        </div>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map(ex => (
          <div
            key={ex.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase tracking-wider">
                  {ex.category}
                </span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                  {ex.difficulty}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                  {ex.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                  {ex.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Conducting Body:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ex.conductingBody}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Upcoming Date:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{ex.upcomingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Age Limit:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ex.ageLimit}</span>
                </div>
              </div>

              {/* Subjects tags */}
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Subjects</div>
                <div className="flex flex-wrap gap-1">
                  {ex.subjects.slice(0, 4).map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                  {ex.subjects.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-400 font-bold">
                      +{ex.subjects.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedExamById(ex.id);
                  setCurrentPage('exam-detail', { examId: ex.id });
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCurrentPage('syllabus')}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                title="View Syllabus Tracker"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
