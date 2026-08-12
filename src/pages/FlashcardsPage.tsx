import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, RotateCcw, CheckCircle2, AlertCircle, Sparkles, Plus } from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const { flashcards, addFlashcard } = useApp();

  const [selectedDeck, setSelectedDeck] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const decks = ['All', 'Polity', 'Economy', 'Geography'];

  const filteredFlashcards = flashcards.filter(f => {
    if (selectedDeck !== 'All' && f.category !== selectedDeck) return false;
    return true;
  });

  const currentFc = filteredFlashcards[currentIndex] || flashcards[0];

  const handleRating = (rating: 'easy' | 'medium' | 'hard') => {
    setIsFlipped(false);
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Active Memory Recall Engine</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Interactive Spaced Repetition Flashcards</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Memorize articles, constitutional amendments, river tributaries, economic formulas, and key facts through active recall.
        </p>
      </div>

      {/* Deck Filter Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">Deck Category:</span>
          {decks.map(d => (
            <button
              key={d}
              onClick={() => {
                setSelectedDeck(d);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                selectedDeck === d
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-bold">
          Card {currentIndex + 1} of {filteredFlashcards.length}
        </div>
      </div>

      {/* Flashcard Main Flip Container */}
      {currentFc && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[280px] p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xl cursor-pointer hover:border-blue-500 transition-all duration-300 flex flex-col justify-between select-none relative group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <span className="font-bold text-blue-600 uppercase">{currentFc.category} Deck</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                {isFlipped ? 'Answer Side' : 'Question Side (Click to Flip)'}
              </span>
            </div>

            <div className="py-6 text-center space-y-3">
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                {isFlipped ? currentFc.back : currentFc.front}
              </h2>
            </div>

            <div className="text-center text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition">
              {isFlipped ? 'Click to show front question' : 'Click card anywhere to reveal answer →'}
            </div>
          </div>

          {/* Spaced Repetition Grading Controls */}
          {isFlipped && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center gap-3 animate-in fade-in duration-200 text-xs">
              <button
                onClick={() => handleRating('hard')}
                className="px-5 py-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 text-rose-700 dark:text-rose-300 font-bold transition"
              >
                🔴 Hard (Repeat Soon)
              </button>

              <button
                onClick={() => handleRating('medium')}
                className="px-5 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-700 dark:text-amber-300 font-bold transition"
              >
                🟡 Medium (Good)
              </button>

              <button
                onClick={() => handleRating('easy')}
                className="px-5 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-300 font-bold transition"
              >
                🟢 Easy (Mastered)
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
