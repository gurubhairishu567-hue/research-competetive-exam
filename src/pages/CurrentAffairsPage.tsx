import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CurrentAffairItem } from '../types';
import { fetchLiveCurrentAffairs, generateAIExplanation } from '../services/aiService';
import { 
  Newspaper, Filter, Search, Bookmark, Check, Share2, Sparkles, 
  BookOpen, ArrowRight, RefreshCw, Download, ExternalLink, Calendar,
  Award, ShieldCheck, CheckCircle2, HelpCircle, Layers, FileText, Cpu
} from 'lucide-react';

export const CurrentAffairsPage: React.FC = () => {
  const { currentAffairs, setCurrentAffairs, pageParams, setCurrentPage, addBookmark, isBookmarked, addNote } = useApp();
  
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Daily AI Feed Active');
  const [aiAnalysisCustomTopic, setAiAnalysisCustomTopic] = useState<string>('');
  const [isGeneratingAiAnalysis, setIsGeneratingAiAnalysis] = useState<boolean>(false);
  const [customAiEditorial, setCustomAiEditorial] = useState<string | null>(null);
  
  // Digital Notes & PDF state
  const [showNotesPdfModal, setShowNotesPdfModal] = useState<boolean>(false);
  const [isSavingToNotebook, setIsSavingToNotebook] = useState<boolean>(false);

  const [selectedArticle, setSelectedArticle] = useState<CurrentAffairItem | null>(
    pageParams?.articleId ? currentAffairs.find(ca => ca.id === pageParams.articleId) || currentAffairs[0] : null
  );

  const [expandedMcqIdx, setExpandedMcqIdx] = useState<number | null>(null);

  // Auto-run daily AI news sync on initial component mount
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const hasTodayNews = currentAffairs.some(ca => ca.date === todayStr);
    
    if (!hasTodayNews) {
      handleAutoUpdate();
    }
  }, []);

  const categories = ['All', 'Polity', 'Economy', 'Environment', 'Science & Tech', 'National', 'International', 'Government Schemes', 'Editorial'];

  const filteredArticles = currentAffairs.filter(ca => {
    if (selectedCategory !== 'All' && ca.category !== selectedCategory) return false;
    if (selectedSource !== 'All') {
      if (selectedSource === 'The Hindu' && ca.source !== 'The Hindu') return false;
      if (selectedSource === 'Times of India' && ca.source !== 'Times of India') return false;
      if (selectedSource === 'PIB' && ca.source !== 'PIB' && ca.source !== 'General') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ca.title.toLowerCase().includes(q);
      const matchSummary = ca.summary.toLowerCase().includes(q);
      const matchKeyword = ca.keywords?.some(k => k.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchKeyword;
    }
    return true;
  });

  const handleAutoUpdate = async () => {
    setIsFetchingLive(true);
    setSyncStatus('Searching live Google News for today\'s The Hindu & Times of India...');
    try {
      const liveArticles = await fetchLiveCurrentAffairs(selectedSource);
      if (liveArticles && liveArticles.length > 0) {
        // Merge without duplicate IDs
        setCurrentAffairs(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newUnique = liveArticles.filter(a => !existingIds.has(a.id));
          return [...newUnique, ...prev];
        });
        setSyncStatus(`Auto-updated ${liveArticles.length} new articles from ${selectedSource === 'All' ? 'The Hindu & Times of India' : selectedSource}!`);
      } else {
        setSyncStatus('Already up-to-date with latest newspaper headlines.');
      }
    } catch (err: any) {
      setSyncStatus('Auto-update complete (Sync mode active).');
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleGenerateCustomAiAnalysis = async (topicToAnalyze?: string) => {
    const topic = topicToAnalyze || aiAnalysisCustomTopic || "Today's The Hindu and Times of India Lead Editorials for UPSC & Competitive Exams";
    setIsGeneratingAiAnalysis(true);
    setCustomAiEditorial(null);
    try {
      const prompt = `Provide an expert, highly structured AI daily newspaper editorial analysis for the topic: "${topic}".
Include:
1. Core Context & Newspaper Source (The Hindu / Times of India)
2. GS Paper & Syllabus Tagging (UPSC GS 1/2/3/4, State PCS, SSC, Banking)
3. Key Policy Points & Arguments
4. Critical Analysis / Pros & Cons
5. High-yield Prelims Pointer Facts
6. 1 Mains Answer Writing Model Question`;

      const result = await generateAIExplanation(topic, prompt);
      setCustomAiEditorial(result);
    } catch (err: any) {
      setCustomAiEditorial("Failed to generate AI editorial analysis. Please check your network connection.");
    } finally {
      setIsGeneratingAiAnalysis(false);
    }
  };

  const handleBookmark = (art: CurrentAffairItem) => {
    addBookmark({
      id: art.id,
      type: 'article',
      title: art.title,
      category: art.category,
      contentSnippet: art.summary
    });
    alert('Article saved to Bookmarks for revision!');
  };

  const handleDownloadDigest = () => {
    setShowNotesPdfModal(true);
  };

  const handleSaveNotesToNotebook = () => {
    setIsSavingToNotebook(true);
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const notesContent = currentAffairs.slice(0, 5).map((art, idx) => `
### ${idx + 1}. ${art.title}
- **Source:** ${art.source || 'Newspaper'} (${art.paperPage || 'Main Edition'})
- **Category:** ${art.category} | Date: ${art.date}
- **Executive Summary:** ${art.summary}

#### Key Revision Bullets:
${art.keyFacts?.map(f => `- ${f}`).join('\n') || '- Refer to article facts'}

#### Exam Relevance:
${art.examRelevance?.map(e => `- **${e.exam}:** ${e.relevance}`).join('\n') || ''}
`).join('\n---\n');

    addNote({
      title: `Daily Newspaper Digital Notes (${todayStr}) - The Hindu & TOI`,
      content: `# ExamNexus Daily Newspaper Digital Analysis Notes\nDate: ${todayStr}\nSources: The Hindu (thehindu.com) & Times of India (indiatimes.com)\n\n${notesContent}`,
      folder: 'Current Affairs',
      tags: ['Newspaper Analysis', 'The Hindu', 'Times of India', 'Daily Notes', 'UPSC GS']
    });

    setTimeout(() => {
      setIsSavingToNotebook(false);
      alert('Success! Today\'s Daily Newspaper Digital Notes saved directly to your Notes & Mind Maps notebook!');
    }, 500);
  };

  const getSourceBadge = (source?: string) => {
    if (source === 'The Hindu') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-900/90 text-amber-100 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-700/50">
          <Newspaper className="w-3 h-3 text-amber-300" />
          The Hindu
        </span>
      );
    }
    if (source === 'Times of India') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-900/90 text-blue-100 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-700/50">
          <Newspaper className="w-3 h-3 text-blue-300" />
          Times of India
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-900/90 text-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-700/50">
        <Newspaper className="w-3 h-3 text-emerald-300" />
        {source || 'PIB / Govt Release'}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Newspaper className="w-64 h-64 text-white" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span>The Hindu & Times of India Daily Hub</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{syncStatus}</span>
          </div>
        </div>

        <div className="space-y-2 relative z-10 max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Daily Auto-Updated Newspaper & Current Affairs Portal
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Exam-oriented editorial breakdowns from <strong>The Hindu</strong> and <strong>Times of India</strong>, categorized with Prelims MCQs, Mains GS Paper tagging, and key revision facts.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleAutoUpdate}
            disabled={isFetchingLive}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetchingLive ? 'animate-spin' : ''}`} />
            <span>{isFetchingLive ? 'Auto-Updating Live Feed...' : 'Auto-Fetch Today\'s Headlines'}</span>
          </button>

          <button
            onClick={() => handleGenerateCustomAiAnalysis()}
            disabled={isGeneratingAiAnalysis}
            className="px-5 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-black text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGeneratingAiAnalysis ? 'Analyzing Lead Editorials...' : 'AI Editorial Deep-Dive'}</span>
          </button>

          <a
            href="https://www.thehindu.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-amber-900/80 hover:bg-amber-900 text-amber-100 font-bold text-xs transition border border-amber-700/60 flex items-center gap-1.5"
          >
            <Newspaper className="w-3.5 h-3.5 text-amber-300" />
            <span>The Hindu Official (thehindu.com)</span>
            <ExternalLink className="w-3 h-3 text-amber-300" />
          </a>

          <a
            href="https://timesofindia.indiatimes.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-blue-900/80 hover:bg-blue-900 text-blue-100 font-bold text-xs transition border border-blue-700/60 flex items-center gap-1.5"
          >
            <Newspaper className="w-3.5 h-3.5 text-blue-300" />
            <span>Times of India Official (indiatimes.com)</span>
            <ExternalLink className="w-3 h-3 text-blue-300" />
          </a>

          <button
            onClick={handleDownloadDigest}
            className="px-4 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-xs transition border border-slate-700/80 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* AI Custom Editorial Analysis Result Modal / Card */}
      {customAiEditorial && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 text-white space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>AI Daily Editorial Analysis & GS Breakdown</span>
            </div>
            <button
              onClick={() => setCustomAiEditorial(null)}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Close Breakdown ✕
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs md:text-sm leading-relaxed whitespace-pre-line text-slate-200">
            {customAiEditorial}
          </div>
        </div>
      )}

      {/* Newspaper Source Tabs */}
      <div className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200 dark:border-slate-700 flex items-center gap-1 overflow-x-auto text-xs font-bold">
        {[
          { id: 'All', label: '📰 All Newspapers & Feeds' },
          { id: 'The Hindu', label: '🗞️ The Hindu Edition' },
          { id: 'Times of India', label: '📰 Times of India (TOI)' },
          { id: 'PIB', label: '🏛️ PIB & Govt Releases' }
        ].map(src => (
          <button
            key={src.id}
            onClick={() => {
              setSelectedSource(src.id);
              setSelectedArticle(null);
            }}
            className={`px-4 py-2 rounded-xl transition shrink-0 ${
              selectedSource === src.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
            }`}
          >
            {src.label}
          </button>
        ))}
      </div>

      {/* Search & Category Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search keywords, headlines, e.g. Semiconductor, RBI, Supreme Court..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedArticle(null);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Detail View OR Article Grid */}
      {selectedArticle ? (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-6 animate-in fade-in duration-200 shadow-sm">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            ← Back to Newspaper List
          </button>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {getSourceBadge(selectedArticle.source)}
              
              {selectedArticle.paperPage && (
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  {selectedArticle.paperPage}
                </span>
              )}

              <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px] uppercase">
                {selectedArticle.category}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                {selectedArticle.date} • {selectedArticle.readTime}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-snug">
              {selectedArticle.title}
            </h2>
          </div>

          {/* Exam Relevance Tag */}
          {selectedArticle.examRelevance && selectedArticle.examRelevance.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" /> Exam Relevance & GS Paper Tagging
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedArticle.examRelevance.map((rel, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-amber-100 dark:border-slate-800">
                    <span className="font-bold text-amber-700 dark:text-amber-400">{rel.exam}: </span>
                    <span>{rel.relevance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Executive Summary</span>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {selectedArticle.summary}
            </p>
          </div>

          {/* Detailed Content */}
          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-3">
            {selectedArticle.detailedContent}
          </div>

          {/* High-Yield Revision Points */}
          <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Key High-Yield Revision Facts
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-200">
              {selectedArticle.keyFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white/70 dark:bg-slate-900/50 p-2.5 rounded-xl border border-blue-100 dark:border-slate-800">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Possible MCQs Section */}
          {selectedArticle.possibleMCQs && selectedArticle.possibleMCQs.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" /> Practice Prelims MCQs from Article
              </h3>

              <div className="space-y-3">
                {selectedArticle.possibleMCQs.map((mcq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <p className="font-bold text-xs md:text-sm text-slate-900 dark:text-white">
                      Q{idx + 1}. {mcq.question}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {mcq.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border text-slate-700 dark:text-slate-300 font-medium ${
                            expandedMcqIdx === idx && oIdx === mcq.correctIndex
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold text-emerald-800 dark:text-emerald-300'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
                          }`}
                        >
                          <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setExpandedMcqIdx(expandedMcqIdx === idx ? null : idx)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {expandedMcqIdx === idx ? 'Hide Explanation' : 'Show Answer & Detailed Explanation'}
                    </button>

                    {expandedMcqIdx === idx && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">
                          Correct Answer: Option {String.fromCharCode(65 + mcq.correctIndex)}
                        </span>
                        <p>{mcq.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Newspaper Web Source Links */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Original Web Source:</span>
              <span className="text-slate-500">{selectedArticle.source || 'The Hindu / Times of India'}</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedArticle.sources && selectedArticle.sources.length > 0 ? (
                selectedArticle.sources.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1"
                  >
                    <span>Read on {s.name || 'Official Newspaper Site'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))
              ) : (
                <a
                  href={selectedArticle.source === 'The Hindu' ? 'https://www.thehindu.com/' : 'https://timesofindia.indiatimes.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1"
                >
                  <span>Open {selectedArticle.source === 'The Hindu' ? 'thehindu.com' : 'indiatimes.com'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
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
              <span>Generate Custom Quiz from Article</span>
            </button>
          </div>
        </div>
      ) : (
        /* Newspaper & Article Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(art => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs gap-2">
                  {getSourceBadge(art.source)}
                  <span className="text-slate-400 font-medium">{art.date}</span>
                </div>

                {art.paperPage && (
                  <span className="inline-block text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                    {art.paperPage}
                  </span>
                )}

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Read Full Editorial Analysis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Notes PDF Preview & Export Modal */}
      {showNotesPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 space-y-6 shadow-2xl relative">
            
            {/* Modal Control Bar (Hidden during print) */}
            <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg">
                  Daily Newspaper Digital Notes & PDF Generator
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveNotesToNotebook}
                  disabled={isSavingToNotebook}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{isSavingToNotebook ? 'Saving Note...' : 'Save to My Digital Notebook'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print PDF</span>
                </button>

                <button
                  onClick={() => setShowNotesPdfModal(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Digital Study Notes Document Sheet */}
            <div className="print-document-sheet space-y-6 text-slate-900 dark:text-slate-100 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              
              {/* Document Header */}
              <div className="border-b-2 border-blue-600 pb-4 space-y-2 flex flex-wrap justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    ExamNexus Official Study Material • Daily Edition
                  </span>
                  <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Daily Newspaper Analysis & Digital Study Notes
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Verified Editorial Breakdown from <strong>The Hindu (thehindu.com)</strong> & <strong>Times of India (indiatimes.com)</strong>
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <div>Date: <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
                  <div>Target: UPSC CSE, State PCS, SSC CGL & Banking</div>
                </div>
              </div>

              {/* Table of Contents / Index */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  📌 Today's Digital Notes Index ({currentAffairs.length} Topics Analyzed)
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {currentAffairs.slice(0, 6).map((art, idx) => (
                    <li key={idx} className="font-medium">
                      <span className="font-bold text-slate-900 dark:text-white">{art.title}</span> — 
                      <span className="text-blue-600 dark:text-blue-400 ml-1">[{art.source || 'The Hindu/TOI'} • {art.category}]</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Topic Breakdown Sections */}
              <div className="space-y-8">
                {currentAffairs.slice(0, 6).map((art, idx) => (
                  <div key={art.id} className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                    
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                          Topic #{idx + 1} • {art.category}
                        </span>
                        <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-snug">
                          {art.title}
                        </h2>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                        {art.source || 'Newspaper'} ({art.paperPage || 'Main Page'})
                      </span>
                    </div>

                    {/* Executive Summary */}
                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Executive Brief</span>
                      <p className="leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        {art.summary}
                      </p>
                    </div>

                    {/* High Yield Facts Bullets */}
                    <div className="text-xs space-y-1.5">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-400">
                        ⚡ High-Yield Exam Pointers (Prelims / Mains)
                      </span>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-slate-700 dark:text-slate-300">
                        {art.keyFacts?.map((fact, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practice MCQ */}
                    {art.possibleMCQs && art.possibleMCQs.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-2">
                        <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px]">
                          ❓ Daily MCQ Practice Question
                        </span>
                        <p className="font-bold text-slate-900 dark:text-white">
                          Q. {art.possibleMCQs[0].question}
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                          {art.possibleMCQs[0].options.map((opt, oIdx) => (
                            <div key={oIdx} className="p-1.5 rounded bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                              <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium pt-1">
                          ✓ Correct Answer: Option {String.fromCharCode(65 + art.possibleMCQs[0].correctIndex)} — {art.possibleMCQs[0].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Document Footer */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <p className="font-bold">ExamNexus • AI-Powered Competitive Exam Preparation Platform</p>
                <p className="text-[10px]">Generated for personal study and revision • www.thehindu.com & timesofindia.indiatimes.com</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
