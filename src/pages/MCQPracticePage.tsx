import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { CheckSquare, Filter, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Bookmark, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export const MCQPracticePage: React.FC = () => {
  const { questions, selectedExam, addBookmark } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredQuestions = questions.filter(q => {
    if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const currentQ: Question | undefined = filteredQuestions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleBookmarkQuestion = () => {
    if (!currentQ) return;
    addBookmark({
      id: currentQ.id,
      type: 'question',
      title: `${currentQ.subject}: ${currentQ.question.slice(0, 40)}...`,
      category: currentQ.subject,
      contentSnippet: currentQ.question
    });
    alert('Question saved to Bookmarks!');
  };

  const subjects = ['All', 'Polity & Governance', 'Indian Economy', 'Geography', 'History & Culture', 'Science & Tech'];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <CheckSquare className="w-4 h-4" />
          <span>Interactive MCQ Practice Engine</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Practice Subject-Wise Questions</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
          High-yield Prelims MCQs designed to test conceptual clarity with detailed options analysis.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-400 shrink-0">Subject:</span>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => {
                setSelectedSubject(subj);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                selectedSubject === subj
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-bold">
          Question {currentIndex + 1} of {filteredQuestions.length}
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold uppercase">
                {currentQ.subject}
              </span>
              <span className="text-slate-400 font-semibold">• {currentQ.topic}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                Difficulty: {currentQ.difficulty}
              </span>

              <button
                onClick={handleBookmarkQuestion}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 transition"
                title="Bookmark Question"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            Q{currentIndex + 1}. {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isCorrect = idx === currentQ.correctAnswer;
              const isUserChoice = idx === selectedOption;

              let style = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60';

              if (isSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-200';
                } else if (isUserChoice) {
                  style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 font-bold text-rose-900 dark:text-rose-200';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isSubmitted && isUserChoice && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Explanation Box when submitted */}
          {isSubmitted && (
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 space-y-2 animate-in fade-in duration-200 text-xs">
              <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Detailed Concept Explanation</span>
              </h3>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
