import React from 'react';
import { useApp } from '../context/AppContext';
import { MockTest } from '../types';
import { Target, Clock, Award, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MockTestPage: React.FC = () => {
  const { mockTests, setCurrentPage, testHistory } = useApp();

  const handleStartTest = (test: MockTest) => {
    setCurrentPage('mock-test-interface', { testId: test.id });
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Exam-Hall Simulation Environment</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">All-India Full Mock Examinations</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Simulate actual exam hall conditions with official timing, question palettes, negative marking, post-test analytics, and weak area breakdown.
        </p>
      </div>

      {/* Available Tests List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Available Mock Papers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTests.map(test => (
            <div
              key={test.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] uppercase">
                    {test.exam}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Target: <strong className="text-amber-600 dark:text-amber-400">{test.exam}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">{test.title}</h3>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-xs text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Questions</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-black">{test.totalQuestions}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Duration</span>
                    <strong className="text-blue-600 font-black">{test.durationMinutes} Mins</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Marks</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-black">{test.totalMarks}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Negative Marking: <strong className="text-rose-600">{test.negativeMarking}</strong> per wrong answer.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow flex items-center justify-center gap-2"
                >
                  <span>Begin Mock Test</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
