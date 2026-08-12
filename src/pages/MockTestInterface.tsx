import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MockTest } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
  BarChart2
} from 'lucide-react';

export const MockTestInterface: React.FC = () => {
  const { mockTests, pageParams, setCurrentPage, addTestAttempt } = useApp();

  const testId = pageParams?.testId || 'upsc-mock-1';
  const test: MockTest = mockTests.find(t => t.id === testId) || mockTests[0];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qIndex: number]: number }>({});
  const [status, setStatus] = useState<{ [qIndex: number]: 'answered' | 'unanswered' | 'marked' }>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isSubmitted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeftSeconds]);

  const currentQ = test.questions[currentQIndex];

  const handleSelectOption = (oIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentQIndex]: oIdx }));
    setStatus(prev => ({ ...prev, [currentQIndex]: 'answered' }));
  };

  const handleMarkForReview = () => {
    setStatus(prev => ({ ...prev, [currentQIndex]: 'marked' }));
    if (currentQIndex < test.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handleClearResponse = () => {
    const updatedAns = { ...answers };
    delete updatedAns[currentQIndex];
    setAnswers(updatedAns);
    setStatus(prev => ({ ...prev, [currentQIndex]: 'unanswered' }));
  };

  const handleSubmitFinal = () => {
    setIsSubmitted(true);
    setShowSubmitConfirm(false);

    // Calculate score
    let score = 0;
    let correct = 0;
    let incorrect = 0;

    test.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score += 2;
        correct++;
      } else if (answers[idx] !== undefined) {
        score -= 0.66;
        incorrect++;
      }
    });

    addTestAttempt({
      id: `attempt-${Date.now()}`,
      testTitle: test.title,
      score: Math.max(0, Math.round(score * 10) / 10),
      totalMarks: test.totalMarks,
      accuracyRate: Math.round((correct / Math.max(1, correct + incorrect)) * 100),
      timeTakenMinutes: Math.round((test.durationMinutes * 60 - timeLeftSeconds) / 60),
      date: new Date().toISOString().split('T')[0]
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.values(status).filter(s => s === 'answered').length;
  const markedCount = Object.values(status).filter(s => s === 'marked').length;
  const unansweredCount = test.questions.length - answeredCount - markedCount;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{test.exam}</span>
          <h1 className="text-base font-black">{test.title}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono font-bold text-sm text-amber-300">
              {formatTime(timeLeftSeconds)}
            </span>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow"
            >
              Submit Test Paper
            </button>
          )}
        </div>
      </div>

      {/* Post Test Results Banner */}
      {isSubmitted ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-4 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/80 text-white text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Test Performance Report</span>
            </div>

            <h2 className="text-3xl font-black">
              Your Final Score: {Object.entries(answers).reduce((acc, [qIdx, aIdx]) => {
                const q = test.questions[Number(qIdx)];
                return acc + (q.correctAnswer === aIdx ? 2 : -0.66);
              }, 0).toFixed(2)} / {test.totalMarks}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block font-bold">Accuracy Rate</span>
                <strong className="text-emerald-400 text-base font-black">78%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block font-bold">Estimated Percentile</span>
                <strong className="text-blue-400 text-base font-black">94.2%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block font-bold">Time Per Question</span>
                <strong className="text-slate-200 text-base font-black">1.2 Mins</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-slate-400 block font-bold">Silly Mistakes</span>
                <strong className="text-rose-400 text-base font-black">2 Questions</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Test Interface Main Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Question View (3 cols) */}
          <div className="lg:col-span-3 p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Question {currentQIndex + 1} of {test.questions.length}
              </span>
              <span className="font-bold text-blue-600">{currentQ.subject}</span>
            </div>

            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQIndex] === oIdx;
                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-600 font-bold text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
              <div className="flex gap-2">
                <button
                  onClick={handleClearResponse}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Clear Choice
                </button>

                <button
                  onClick={handleMarkForReview}
                  className="px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-200"
                >
                  Mark for Review
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Previous
                </button>

                <button
                  onClick={() => setCurrentQIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow"
                >
                  Save & Next
                </button>
              </div>
            </div>

          </div>

          {/* Right Question Palette (1 col) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Question Palette</h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Answered ({answeredCount})</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Marked ({markedCount})</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span> Not Answered ({unansweredCount})</div>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {test.questions.map((_, idx) => {
                const st = status[idx];
                let color = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                if (st === 'answered') color = 'bg-emerald-600 text-white font-bold';
                else if (st === 'marked') color = 'bg-purple-600 text-white font-bold';

                if (idx === currentQIndex) color += ' ring-2 ring-blue-500 ring-offset-2';

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-xl text-xs flex items-center justify-center font-semibold transition ${color}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Submit Test Paper?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to finalize your submission? You answered <strong>{answeredCount}</strong> out of <strong>{test.questions.length}</strong> questions.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitFinal}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
