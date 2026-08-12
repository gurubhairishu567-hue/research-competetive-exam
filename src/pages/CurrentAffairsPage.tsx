import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrentAffairItem } from '../types';
import { Newspaper, Filter, Search, Bookmark, Check, Share2, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export const CurrentAffairsPage: React.FC = () => {
  const { currentAffairs, pageParams, setCurrentPage, addBookmark, isBookmarked } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<CurrentAffairItem | null>(
    pageParams?.articleId ? currentAffairs.find(ca => ca.id === pageParams.articleId) || currentAffairs[0] : null
  );

  const categories = ['All', 'National', 'Economy', 'Polity', 'Science', 'Environment', 'International', 'Schemes'];

  const filteredArticles = currentAffairs.filter(ca => {
    if (selectedCategory !== 'All' && ca.category !== selectedCategory) return false;
    return true;
  });

  const handleBookmark = (art: CurrentAffairItem) => {
    addBookmark({
      id: art.id,
      type: 'article',
      title: art.title,
      category: art.category,
      contentSnippet: art.summary
    });
    alert('Article saved to Bookmarks!');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-4 h-4" />
          <span>Daily Exam-Oriented Current Affairs</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">High-Yield Current Affairs Portal</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Daily news updates categorized specifically for UPSC, SSC, Banking, and State PCS examinations with background context, key facts, and Prelims/Mains questions.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedArticle(null);
            }}
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

      {/* Article Detail View OR Article Grid */}
      {selectedArticle ? (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-6 animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to All Articles
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase">
                {selectedArticle.category}
              </span>
              <span>{selectedArticle.date}</span>
              <span>• {selectedArticle.readTime}</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {selectedArticle.title}
            </h2>
          </div>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <strong>Summary:</strong> {selectedArticle.summary}
          </p>

          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {selectedArticle.detailedContent}
          </div>

          {/* Key Facts Box */}
          <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Key High-Yield Facts for Revision
            </h3>
            <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-200 space-y-1">
              {selectedArticle.keyFacts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => handleBookmark(selectedArticle)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>Save for Revision</span>
            </button>

            <button
              onClick={() => setCurrentPage('quiz-generator', { topic: selectedArticle.title })}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate MCQs from Article</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(art => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{art.category}</span>
                  <span>{art.date}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Read Full Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
