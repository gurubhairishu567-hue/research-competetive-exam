import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  FileText,
  Target,
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

export const ExamDetailPage: React.FC = () => {
  const { exams, pageParams, setCurrentPage, setSelectedExamById, completedSyllabusTopics, toggleSyllabusTopic } = useApp();

  const examId = pageParams?.examId || 'upsc-cse';
  const exam = exams.find(e => e.id === examId) || exams[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'pattern' | 'syllabus' | 'strategy' | 'resources'>('overview');

  const handleStartPrep = () => {
    setSelectedExamById(exam.id);
    setCurrentPage('dashboard');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('exams')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Exams</span>
        </button>

        <button
          onClick={handleStartPrep}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Target className="w-4 h-4 text-yellow-300" />
          <span>Set as My Target Exam</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider">
            {exam.category}
          </span>
          <span className="px-3 py-1 rounded bg-slate-800 text-amber-400 font-bold text-xs">
            Difficulty: {exam.difficulty}
          </span>
          <span className="text-xs text-slate-400">Frequency: {exam.frequency}</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black">{exam.name}</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {exam.description}
        </p>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Conducting Authority</span>
            <span className="font-bold text-slate-100">{exam.conductingBody}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Upcoming Exam Date</span>
            <span className="font-bold text-blue-400">{exam.upcomingDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Qualification</span>
            <span className="font-bold text-slate-100">{exam.qualification}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Competition Ratio</span>
            <span className="font-bold text-emerald-400">{exam.competitionLevel}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Eligibility' },
          { id: 'pattern', label: 'Exam Pattern & Marking' },
          { id: 'syllabus', label: 'Detailed Syllabus' },
          { id: 'strategy', label: 'Preparation Strategy' },
          { id: 'resources', label: 'Recommended Books' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl shrink-0 transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}

      {/* 1. OVERVIEW & ELIGIBILITY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Eligibility & Age Limit</span>
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">Educational Qualification:</strong>
                {exam.qualification}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">Age Limit:</strong>
                {exam.ageLimit}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">Permissible Attempts:</strong>
                {exam.attempts}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Selection Stages</span>
            </h3>

            <div className="space-y-3 text-xs">
              {exam.stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold block">{stage}</strong>
                    <span className="text-[11px] text-slate-500">Essential qualifying stage</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. EXAM PATTERN & MARKING */}
      {activeTab === 'pattern' && (
        <div className="space-y-6">
          {exam.examPattern.map((p, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{p.stage}</h3>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>Duration: <strong className="text-slate-800 dark:text-slate-200">{p.duration}</strong></span>
                  <span>Total Marks: <strong className="text-blue-600">{p.totalMarks}</strong></span>
                  <span>Negative Marking: <strong className="text-rose-600">{p.negativeMarking}</strong></span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Section / Paper Name</th>
                      <th className="p-3">Number of Questions</th>
                      <th className="p-3">Total Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {p.sections.map((sec, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-3 font-semibold">{sec.name}</td>
                        <td className="p-3 font-mono">{sec.questions}</td>
                        <td className="p-3 font-bold text-blue-600">{sec.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. DETAILED SYLLABUS */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Structured Syllabus Topics</h3>
            <span className="text-xs text-slate-400">Click checkboxes to track your preparation progress</span>
          </div>

          {exam.syllabus.map((subj, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                {subj.subject}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                {subj.topics.map(t => {
                  const isDone = completedSyllabusTopics.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleSyllabusTopic(t.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{t.title}</span>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. PREPARATION STRATEGY */}
      {activeTab === 'strategy' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Topper Recommended Strategy Guidelines</span>
          </h3>

          <ul className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {exam.prepStrategy.map((step, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. RECOMMENDED RESOURCES */}
      {activeTab === 'resources' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>Standard Recommended Textbooks & Sources</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exam.recommendedResources.map((res, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{res}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
