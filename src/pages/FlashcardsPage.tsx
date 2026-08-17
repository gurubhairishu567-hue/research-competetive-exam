import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, RotateCcw, CheckCircle2, AlertCircle, Sparkles, Plus, Lock, ShieldCheck, X } from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const { flashcards, addFlashcard, isAdmin, triggerAdminLock } = useApp();

  const [selectedDeck, setSelectedDeck] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Create Card Modal
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [cardCategory, setCardCategory] = useState('Polity');
  const [cardDifficulty, setCardDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const decks = ['All', 'Polity', 'Economy', 'Geography', 'History', 'Environment', 'Science'];

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

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      triggerAdminLock('Create Flashcard');
      return;
    }
    if (!frontText.trim() || !backText.trim()) return;

    addFlashcard({
      front: frontText.trim(),
      back: backText.trim(),
      category: cardCategory,
      difficulty: cardDifficulty
    });

    setFrontText('');
    setBackText('');
    setShowAddCardModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Active Memory Recall Engine</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black">Interactive Spaced Repetition Flashcards</h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Memorize articles, constitutional amendments, river tributaries, economic formulas, and key facts through active recall.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isAdmin) {
              triggerAdminLock('Add New Flashcard');
            } else {
              setShowAddCardModal(true);
            }
          }}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Flashcard</span>
          {!isAdmin ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />}
        </button>
      </div>

      {/* Deck Filter Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
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
          Card {filteredFlashcards.length > 0 ? currentIndex + 1 : 0} of {filteredFlashcards.length}
        </div>
      </div>

      {/* Flashcard Main Flip Container */}
      {currentFc ? (
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
      ) : (
        <div className="p-12 text-center text-slate-400">
          <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-bold">No flashcards found in this category.</p>
        </div>
      )}

      {/* Add Flashcard Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Create Spaced Repetition Card</span>
              </h2>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Front (Question / Prompt):</label>
                <textarea
                  rows={2}
                  required
                  value={frontText}
                  onChange={e => setFrontText(e.target.value)}
                  placeholder="e.g. Article 324 relates to which constitutional body?"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Back (Answer / Explanation):</label>
                <textarea
                  rows={3}
                  required
                  value={backText}
                  onChange={e => setBackText(e.target.value)}
                  placeholder="e.g. Election Commission of India (ECI) - Superintendence, direction, and control of elections."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category Deck:</label>
                  <select
                    value={cardCategory}
                    onChange={e => setCardCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {decks.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty:</label>
                  <select
                    value={cardDifficulty}
                    onChange={e => setCardDifficulty(e.target.value as any)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save to Supabase & Deck</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

