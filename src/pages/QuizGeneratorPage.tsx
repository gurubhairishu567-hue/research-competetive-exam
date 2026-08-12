import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { generateAIQuiz } from '../services/aiService';
import { Zap, RefreshCw, CheckCircle2, XCircle, Clock, Trophy, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

export const QuizGeneratorPage: React.FC = () => {
  const { selectedExam, exams } = useApp();

  const [topic, setTopic] = useState('Indian Polity & Constitution');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [targetExam, setTargetExam] = useState(selectedExam.name);

  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizQuestions && !isQuizSubmitted) {
      timer = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [quizQuestions, isQuizSubmitted]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQuizQuestions(null);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setSecondsElapsed(0);

    const generated = await generateAIQuiz(topic, targetExam, difficulty, count);
    setQuizQuestions(generated);
    setIsLoading(false);
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    setIsQuizSubmitted(true);
  };

  const calculateScore = () => {
    if (!quizQuestions) return 0;
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });
    return correct;
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/80 text-white text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <span>AI-Powered Test Generator</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Generate On-Demand Practice Quizzes</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
          Create customized, syllabus-aligned test papers on any topic, difficulty level, or exam standard in seconds.
        </p>
      </div>

      {/* Generator Configuration Form */}
      {!quizQuestions && !isLoading && (
        <form onSubmit={handleGenerateQuiz} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
            Configure Your Test
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-200">Test Topic / Subject:</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Fundamental Rights, Inflation, GDP, River Basins..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Target Exam */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-200">Exam Level Alignment:</label>
              <select
                value={targetExam}
                onChange={e => setTargetExam(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white outline-none"
              >
                {exams.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-200">Difficulty Level:</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white outline-none"
              >
                <option value="Easy">Easy (Conceptual Fundamentals)</option>
                <option value="Medium">Medium (Standard Prelims Level)</option>
                <option value="Hard">Hard (Analytical & Statement Heavy)</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 dark:text-slate-200">Number of Questions:</label>
              <select
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white outline-none"
              >
                <option value={3}>3 Quick Practice Questions</option>
                <option value={5}>5 Standard Test Questions</option>
                <option value={10}>10 Full Topic Quiz Questions</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Generate Custom Quiz Now</span>
          </button>
        </form>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Generating Syllabus Questions</h3>
          <p className="text-xs text-slate-500">Formulating fresh MCQs aligned to {targetExam} guidelines...</p>
        </div>
      )}

      {/* Active Quiz View */}
      {quizQuestions && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Quiz Top Status Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{targetExam}</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">{topic} Quiz</h2>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{Math.floor(secondsElapsed / 60)}m {secondsElapsed % 60}s</span>
              </div>

              {!isQuizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => setQuizQuestions(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Configure New Quiz</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Score Banner if Submitted */}
          {isQuizSubmitted && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white space-y-2 shadow-xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Test Completed</span>
              </div>
              <h3 className="text-2xl font-black">
                Your Score: {calculateScore()} / {quizQuestions.length} ({Math.round((calculateScore() / quizQuestions.length) * 100)}% Accuracy)
              </h3>
              <p className="text-xs text-emerald-200">
                Time taken: {Math.floor(secondsElapsed / 60)} minutes {secondsElapsed % 60} seconds.
              </p>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            {quizQuestions.map((q, qIdx) => {
              const userChoice = userAnswers[qIdx];
              return (
                <div key={qIdx} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Q{qIdx + 1}. {q.question}
                  </h3>

                  <div className="space-y-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = userChoice === oIdx;
                      const isCorrect = oIdx === q.correctAnswer;

                      let style = 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700';

                      if (isQuizSubmitted) {
                        if (isCorrect) style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-200';
                        else if (isSelected) style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 font-bold text-rose-900 dark:text-rose-200';
                      } else if (isSelected) {
                        style = 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 font-bold text-blue-900 dark:text-blue-200';
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(qIdx, oIdx)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${style}`}
                        >
                          <span>{opt}</span>
                          {isQuizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isQuizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {isQuizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 text-xs text-slate-700 dark:text-slate-200">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
