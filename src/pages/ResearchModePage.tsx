import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResearchTopicResult } from '../types';
import { fetchResearchTopicData } from '../services/aiService';
import {
  Microscope,
  Search,
  BookOpen,
  Bookmark,
  Sparkles,
  Calendar,
  Building,
  CheckCircle2,
  Globe,
  HelpCircle,
  FileText,
  ExternalLink,
  RefreshCw,
  Share2
} from 'lucide-react';

export const ResearchModePage: React.FC = () => {
  const { selectedExam, addNote, addBookmark, isBookmarked } = useApp();

  const [topicInput, setTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [researchData, setResearchData] = useState<ResearchTopicResult | null>(null);

  const handleResearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = topicInput.trim() || 'Indian Semiconductor Mission';
    setIsLoading(true);

    const result = await fetchResearchTopicData(query, selectedExam.name);
    setResearchData(result);
    setIsLoading(false);
  };

  const sampleTopics = [
    'Indian Semiconductor Mission',
    'Article 300A Right to Property',
    'Green Hydrogen Mission',
    'Monetary Policy Committee',
    'Uniform Civil Code Article 44',
    'Indo-Pacific Economic Framework'
  ];

  const handleSaveToNotes = () => {
    if (!researchData) return;
    addNote({
      title: `Research Brief: ${researchData.topic}`,
      folder: 'Research Briefs',
      tags: ['Research Mode', selectedExam.category],
      content: `# ${researchData.topic}\n\n## Overview\n${researchData.overview}\n\n## Economic Importance\n${researchData.economicImportance}\n\n## Quick Revision\n${researchData.quickRevisionPoints.join('\n- ')}`,
      isBookmarked: true
    });
    alert('Research Brief saved to your Digital Notes!');
  };

  const handleBookmarkTopic = () => {
    if (!researchData) return;
    addBookmark({
      id: `res-${researchData.topic.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'research',
      title: `Research Brief: ${researchData.topic}`,
      category: 'Deep Research',
      contentSnippet: researchData.overview
    });
    alert('Added to your Bookmarks!');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0F172A] text-white space-y-3 shadow-xl border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-800/50">
          <Microscope className="w-4 h-4" />
          <span>Deep Research Intelligence Mode</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Investigate Any Exam Topic Deeply</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Produce an exhaustive, verified research brief containing timelines, key facts, nodal organizations, government schemes, economic significance, Prelims MCQs, Mains questions, and source links.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleResearchSubmit} className="max-w-2xl pt-2">
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl p-2 shadow-xl border border-slate-200 dark:border-slate-800">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              placeholder="Enter topic e.g. Indian Semiconductor Mission, Article 21..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow transition shrink-0 flex items-center gap-1.5"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>{isLoading ? 'Researching...' : 'Investigate'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-slate-300">
            <span className="font-semibold text-slate-400">Try Topic:</span>
            {sampleTopics.map((top, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTopicInput(top);
                  fetchResearchTopicData(top, selectedExam.name).then(res => setResearchData(res));
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
              >
                {top}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Conducting Multi-Source Research</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Cross-referencing government ministry reports, PIB releases, constitutional articles, and recent exam question patterns...
          </p>
        </div>
      )}

      {/* Research Output View */}
      {researchData && !isLoading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Title & Action Header */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Verified Research Brief</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{researchData.topic}</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveToNotes}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Save to Notes</span>
              </button>

              <button
                onClick={handleBookmarkTopic}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" />
                <span>Bookmark</span>
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content Column (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Overview */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Topic Overview</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {researchData.overview}
                </p>
              </div>

              {/* Timeline */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>Chronological Development Timeline</span>
                </h3>

                <div className="space-y-3 border-l-2 border-blue-600 pl-4 text-xs">
                  {researchData.timeline.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        {item.year}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic & International Significance */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <span>Strategic & Global Importance</span>
                </h3>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <strong className="text-slate-900 dark:text-white block font-bold mb-1">Economic Significance:</strong>
                    <span className="text-slate-600 dark:text-slate-300">{researchData.economicImportance}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <strong className="text-slate-900 dark:text-white block font-bold mb-1">International Context:</strong>
                    <span className="text-slate-600 dark:text-slate-300">{researchData.internationalContext}</span>
                  </div>
                </div>
              </div>

              {/* Prelims MCQs */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  <span>Possible Prelims Practice MCQs</span>
                </h3>

                <div className="space-y-4">
                  {researchData.prelimsMCQs.map((mcq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{idx + 1}. {mcq.question}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mcq.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-lg border text-slate-700 dark:text-slate-200 font-medium ${
                              i === mcq.answer
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 font-bold text-emerald-900 dark:text-emerald-300'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {opt} {i === mcq.answer && '✓ (Correct)'}
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-500 text-[11px] pt-1">
                        <strong>Explanation:</strong> {mcq.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar Details (1 col) */}
            <div className="space-y-6">
              
              {/* Key Facts Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Key High-Yield Facts</h3>
                <div className="space-y-2 text-xs">
                  {researchData.keyFacts.map((kf, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex justify-between gap-2">
                      <span className="text-slate-400 font-bold">{kf.label}:</span>
                      <span className="font-bold text-slate-900 dark:text-white text-right">{kf.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Revision Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white space-y-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>Quick Revision Bullet Points</span>
                </h3>
                <ul className="space-y-2 text-xs leading-relaxed text-blue-100 list-disc list-inside">
                  {researchData.quickRevisionPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Mains & Interview Questions */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Mains Answer Writing Prompts</h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {researchData.mainsQuestions.map((mq, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 font-medium">
                      "{mq}"
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Sources */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Authoritative Source Citations</h3>
                <div className="space-y-2 text-xs">
                  {researchData.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between gap-2 text-blue-600 dark:text-blue-400 font-semibold transition"
                    >
                      <span>{src.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
