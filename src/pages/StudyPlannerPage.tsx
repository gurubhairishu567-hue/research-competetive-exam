import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyPlan } from '../types';
import { generateAIStudyPlan } from '../services/aiService';
import { Calendar, Sparkles, RefreshCw, CheckCircle2, Clock, Target, ArrowRight } from 'lucide-react';

export const StudyPlannerPage: React.FC = () => {
  const { selectedExam, exams, studyPlan, setStudyPlan } = useApp();

  const [examName, setExamName] = useState(selectedExam.name);
  const [targetDate, setTargetDate] = useState('2026-05-24');
  const [dailyHours, setDailyHours] = useState(5);
  const [prepLevel, setPrepLevel] = useState('Intermediate');

  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const generated = await generateAIStudyPlan(examName, targetDate, dailyHours, prepLevel, 'Cutoff + 20 Marks');
    setStudyPlan(generated);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>AI Adaptive Roadmap Generator</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Personalized AI Study Schedule</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Generate an optimized week-by-week study roadmap tailored to your target exam date, daily available hours, and weak subject priorities.
        </p>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleGeneratePlan} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
          Roadmap Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">Target Exam:</label>
            <select
              value={examName}
              onChange={e => setExamName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
            >
              {exams.map(ex => <option key={ex.id} value={ex.name}>{ex.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">Target Exam Date:</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">Daily Study Hours:</label>
            <select
              value={dailyHours}
              onChange={e => setDailyHours(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
            >
              <option value={3}>3 Hours / Day</option>
              <option value={5}>5 Hours / Day</option>
              <option value={8}>8 Hours / Day (Full-Time)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-200">Preparation Level:</label>
            <select
              value={prepLevel}
              onChange={e => setPrepLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold outline-none"
            >
              <option value="Beginner">Beginner (Starting Syllabus)</option>
              <option value="Intermediate">Intermediate (Halfway Done)</option>
              <option value="Advanced">Advanced (Revision & Mocks)</option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
          <span>{isLoading ? 'Building Custom Study Plan...' : 'Generate AI Study Schedule'}</span>
        </button>
      </form>

      {/* Generated Plan View */}
      {studyPlan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Target: {studyPlan.examName}</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Generated Multi-Week Preparation Schedule</h2>
            </div>

            <div className="flex gap-4 text-xs font-bold text-slate-500">
              <span>Target Date: <strong className="text-slate-900 dark:text-white">{studyPlan.targetDate}</strong></span>
              <span>Daily Target: <strong className="text-blue-600">{studyPlan.dailyHours} Hours</strong></span>
            </div>
          </div>

          {/* Weeks List */}
          <div className="space-y-6">
            {studyPlan.weeks.map(w => (
              <div key={w.weekNumber} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
                
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                      W{w.weekNumber}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{w.title}</h3>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">
                    Focus: {w.focus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {w.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{task.title} ({task.duration})</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
