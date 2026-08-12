import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';

export const BookmarksPage: React.FC = () => {
  const { bookmarks, removeBookmark, setCurrentPage } = useApp();
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = bookmarks.filter(b => {
    if (filterType !== 'All' && b.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Bookmark className="w-4 h-4" />
          <span>My Saved Study Repository</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">Bookmarked Items</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Central hub for all your saved current affairs articles, difficult practice questions, research briefs, and digital study notes.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-slate-400 shrink-0">Filter Type:</span>
        {['All', 'article', 'question', 'research'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize shrink-0 transition ${
              filterType === t
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          No bookmarks saved in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(b => (
            <div key={b.id} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase text-[10px]">
                    {b.type.replace('-', ' ')}
                  </span>
                  <span className="text-slate-400 font-semibold">{b.category}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{b.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{b.contentSnippet}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <button
                  onClick={() => removeBookmark(b.id)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (b.type === 'article') setCurrentPage('current-affairs', { articleId: b.id });
                    else if (b.type === 'question') setCurrentPage('mcq-practice', { questionId: b.id });
                    else setCurrentPage('research', { topic: b.title });
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <span>Open Item</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
