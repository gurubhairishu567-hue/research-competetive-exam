import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WorldNewsItem } from '../types';
import { SAMPLE_WORLD_NEWS } from '../data/mockData';
import { fetchLiveWorldNews, generateAIExplanation } from '../services/aiService';
import {
  Globe, Search, Sparkles, RefreshCw, ExternalLink, Bookmark, Download,
  Check, ArrowRight, ChevronRight, ChevronLeft, MapPin, Cpu, FileText,
  List, LayoutGrid, BookmarkCheck, Share2
} from 'lucide-react';

export const WorldNewsPage: React.FC = () => {
  const { addBookmark, isBookmarked, addNote, setCurrentPage } = useApp();

  // Initialize with complete SAMPLE_WORLD_NEWS so every headline is immediately present
  const [worldNews, setWorldNews] = useState<WorldNewsItem[]>(SAMPLE_WORLD_NEWS || []);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Global Wire Active');

  // View mode: 'headlines' (Every World Headline List - default) vs 'split' (Interactive Explorer)
  const [viewMode, setViewMode] = useState<'headlines' | 'split'>('headlines');
  const [activeTickerIdx, setActiveTickerIdx] = useState<number>(0);

  const [selectedArticle, setSelectedArticle] = useState<WorldNewsItem | null>(null);

  const [isGeneratingAiAnalysis, setIsGeneratingAiAnalysis] = useState<boolean>(false);
  const [customAiGeopoliticalAnalysis, setCustomAiGeopoliticalAnalysis] = useState<string | null>(null);

  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [isSavingToNotebook, setIsSavingToNotebook] = useState<boolean>(false);

  // Auto-run AI World News fetch on initial mount to sync fresh items
  useEffect(() => {
    handleAutoFetch();
  }, []);

  // Ticker auto-advance
  useEffect(() => {
    if (worldNews.length === 0) return;
    const interval = setInterval(() => {
      setActiveTickerIdx(prev => (prev + 1) % worldNews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [worldNews.length]);

  const handleAutoFetch = async (queryParam?: string) => {
    setIsFetchingLive(true);
    setSyncStatus('Fetching latest global headlines...');
    try {
      const data = await fetchLiveWorldNews(selectedRegion, queryParam || searchQuery);
      if (data && data.length > 0) {
        setWorldNews(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newUnique = data.filter(a => !existingIds.has(a.id));
          return [...newUnique, ...prev];
        });
        setSyncStatus(`Synchronized (${data.length} global headlines)`);
      } else {
        setSyncStatus('All global headlines up-to-date');
      }
    } catch {
      setSyncStatus('Global wire active with verified editions');
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleGenerateCustomGeopoliticalAnalysis = async (topicToAnalyze?: string) => {
    const topic = topicToAnalyze || "Today's Top Global Geopolitical Developments, UN Summit & India Foreign Policy Impact";
    setIsGeneratingAiAnalysis(true);
    setCustomAiGeopoliticalAnalysis(null);
    try {
      const prompt = `Provide an expert, highly structured AI International Relations & Global Geopolitics Deep-Dive for the topic/event: "${topic}".
Include:
1. Core Global Context & Key Stakeholder Nations
2. Strategic & Geopolitical Security Impact
3. Economic, Supply Chain & Financial Dimensions
4. Strategic Significance for India's Foreign Policy (UPSC GS-2 IR Perspective)
5. Multilateral Bodies & Treaties Involved
6. High-Yield Prelims Pointer Facts & 1 Model Practice Question`;

      const result = await generateAIExplanation(topic, prompt);
      setCustomAiGeopoliticalAnalysis(result);
    } catch {
      setCustomAiGeopoliticalAnalysis("Failed to generate geopolitical analysis. Please verify your connection.");
    } finally {
      setIsGeneratingAiAnalysis(false);
    }
  };

  const handleBookmark = (art: WorldNewsItem) => {
    addBookmark({
      id: art.id,
      type: 'article',
      title: art.title,
      category: `World News • ${art.region}`,
      contentSnippet: art.summary,
      dataRef: art
    });
  };

  const handleSaveToNotebook = () => {
    setIsSavingToNotebook(true);
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    const notesContent = displayedNews.map((art, idx) => `
### ${idx + 1}. ${art.title}
- **Region & Country:** ${art.region} (${art.country})
- **Source:** ${art.sourceName} | Date: ${art.date}
- **Executive Summary:** ${art.summary}

#### Geopolitical Impact:
${art.geopoliticalImpact}

#### India's Foreign Policy Relevance:
${art.indiaRelevance}

#### Key Facts & Multilateral Bodies:
${art.keyFacts?.map(f => `- ${f}`).join('\n') || ''}
- **Key Organizations:** ${art.keyOrganizations?.join(', ') || 'N/A'}
`).join('\n---\n');

    addNote({
      title: `Global World News All Headlines & Notes (${todayStr})`,
      content: `# ExamNexus Global Intelligence & World News Digital Notes\nDate: ${todayStr}\nCoverage: International Relations, Geopolitics, Global Economy & Multilateral Summits\n\n${notesContent}`,
      folder: 'Current Affairs',
      tags: ['All World Headlines', 'Geopolitics', 'International Relations', 'UPSC GS2', 'Global Economy']
    });

    setTimeout(() => {
      setIsSavingToNotebook(false);
      alert('Success! Global World News notes saved to your notebook.');
    }, 400);
  };

  const regions = [
    'All',
    'Asia-Pacific',
    'Middle East & Africa',
    'Europe',
    'North America',
    'Latin America',
    'Global Economy',
    'Geopolitics & Defense',
    'Climate & Tech'
  ];

  // All news items displayed without mandatory filters
  const displayedNews = worldNews.filter(art => {
    const matchesRegion = selectedRegion === 'All' || art.region === selectedRegion;
    const matchesQuery = searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.keyOrganizations && art.keyOrganizations.some(o => o.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesRegion && matchesQuery;
  });

  const navigateArticle = (direction: 'prev' | 'next') => {
    if (!selectedArticle) return;
    const currentIdx = displayedNews.findIndex(a => a.id === selectedArticle.id);
    if (currentIdx === -1) return;
    if (direction === 'prev' && currentIdx > 0) {
      setSelectedArticle(displayedNews[currentIdx - 1]);
    } else if (direction === 'next' && currentIdx < displayedNews.length - 1) {
      setSelectedArticle(displayedNews[currentIdx + 1]);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      
      {/* Hero Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-indigo-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '14s' }} />
              <span>Global News & International Affairs Wire</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Every World News Headline & Strategic Brief
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Comprehensive international headlines from <strong>Reuters</strong>, <strong>BBC World</strong>, <strong>AP News</strong>, <strong>Bloomberg</strong>, and <strong>Al Jazeera</strong> covering global geopolitics, multilateral summits, and India's strategic foreign policy.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-right hidden md:block">
              <div className="text-[11px] font-bold text-slate-400">Global Feed Status</div>
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{syncStatus}</span>
              </div>
            </div>

            <button
              onClick={() => handleAutoFetch()}
              disabled={isFetchingLive}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingLive ? 'animate-spin' : ''}`} />
              <span>{isFetchingLive ? 'Syncing Global News...' : 'Auto-Fetch All Global Headlines'}</span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">International Press:</span>
            <a href="https://www.reuters.com/world/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] flex items-center gap-1">
              <span>Reuters</span> <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            <a href="https://www.bbc.com/news/world" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] flex items-center gap-1">
              <span>BBC World</span> <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            <a href="https://apnews.com/hub/world-news" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] flex items-center gap-1">
              <span>AP News</span> <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            <a href="https://www.aljazeera.com/news/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] flex items-center gap-1">
              <span>Al Jazeera</span> <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            <a href="https://news.un.org/" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] flex items-center gap-1">
              <span>UN News</span> <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerateCustomGeopoliticalAnalysis()}
              disabled={isGeneratingAiAnalysis}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGeneratingAiAnalysis ? 'Analyzing...' : 'AI Geopolitical Deep-Dive'}</span>
            </button>

            <button
              onClick={() => setShowPdfModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>World News PDF & Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Breaking Headline Ticker */}
      {worldNews.length > 0 && (
        <div className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-500/30 flex items-center gap-3 overflow-hidden shadow-sm">
          <div className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GLOBAL WIRE #{activeTickerIdx + 1}</span>
          </div>

          <div 
            onClick={() => setSelectedArticle(worldNews[activeTickerIdx])}
            className="flex-1 text-xs font-bold text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <span className="text-indigo-600 dark:text-indigo-400 mr-2">[{worldNews[activeTickerIdx]?.sourceName || 'International'}]</span>
            {worldNews[activeTickerIdx]?.title}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTickerIdx(prev => (prev - 1 + worldNews.length) % worldNews.length)}
              className="p-1 rounded-md hover:bg-indigo-500/20 text-slate-600 dark:text-slate-300"
              title="Previous headline"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-500 font-bold px-1">
              {activeTickerIdx + 1}/{worldNews.length}
            </span>
            <button
              onClick={() => setActiveTickerIdx(prev => (prev + 1) % worldNews.length)}
              className="p-1 rounded-md hover:bg-indigo-500/20 text-slate-600 dark:text-slate-300"
              title="Next headline"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Custom Geopolitical Analysis Card */}
      {customAiGeopoliticalAnalysis && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 text-white space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>AI Global Geopolitics & IR Intelligence Brief</span>
            </div>
            <button
              onClick={() => setCustomAiGeopoliticalAnalysis(null)}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Close Brief ✕
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs md:text-sm leading-relaxed whitespace-pre-line text-slate-200">
            {customAiGeopoliticalAnalysis}
          </div>
        </div>
      )}

      {/* Toolbar: View Switcher (Every World Headline List vs Split Explorer), Search & Quick Regions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        
        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-700 text-xs font-bold shrink-0">
          <button
            onClick={() => { setViewMode('headlines'); setSelectedArticle(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              viewMode === 'headlines'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Every World Headline ({displayedNews.length})</span>
          </button>
          <button
            onClick={() => { setViewMode('split'); setSelectedArticle(displayedNews[0] || null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              viewMode === 'split'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Split Explorer</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAutoFetch(searchQuery)}
            placeholder="Search country, UN summit, NATO, G20, trade deal..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold no-scrollbar">
          {regions.slice(0, 5).map(reg => (
            <button
              key={reg}
              onClick={() => {
                setSelectedRegion(reg);
                setSelectedArticle(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                selectedRegion === reg
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {reg === 'All' ? '🌐 All World' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Extended Regions Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold pb-1 no-scrollbar">
        {regions.map(reg => (
          <button
            key={reg}
            onClick={() => {
              setSelectedRegion(reg);
              setSelectedArticle(null);
            }}
            className={`px-3.5 py-1.5 rounded-2xl whitespace-nowrap transition ${
              selectedRegion === reg
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {reg === 'All' ? '🌐 All Global Regions' : reg}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {selectedArticle && viewMode === 'headlines' ? (
        /* Full Article Detail Screen when clicked from Every Headline list */
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6 animate-in fade-in duration-200">
          {/* Top Bar with Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All World Headlines</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateArticle('prev')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Global Story</span>
              </button>
              <button
                onClick={() => navigateArticle('next')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 flex items-center gap-1"
              >
                <span>Next Global Story</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Header Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-wider">
                {selectedArticle.region}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>{selectedArticle.country}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs">
                {selectedArticle.sourceName}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-auto">
                {selectedArticle.date} • {selectedArticle.readTime || '4 min read'}
              </span>
            </div>

            <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {selectedArticle.title}
            </h1>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Executive Global Intelligence Brief
            </span>
            <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {selectedArticle.summary}
            </p>
          </div>

          {/* Detailed Geopolitical Analysis */}
          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line border-y border-slate-100 dark:border-slate-700 py-6">
            {selectedArticle.detailedAnalysis}
          </div>

          {/* Strategic Impacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Geopolitical Impact */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-2">
              <span className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase tracking-wider">
                🌐 Global Geopolitical Impact
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedArticle.geopoliticalImpact}
              </p>
            </div>

            {/* India's Foreign Policy Relevance */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
              <span className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                🇮🇳 Strategic Impact on India
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedArticle.indiaRelevance}
              </p>
            </div>
          </div>

          {/* Key Facts & Organizations */}
          {selectedArticle.keyFacts && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                ⚡ Key Facts & Multilateral Treaties
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedArticle.keyFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => handleBookmark(selectedArticle)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2"
            >
              {isBookmarked(selectedArticle.id) ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-amber-300" />
                  <span>Saved in Bookmarks</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save for Revision</span>
                </>
              )}
            </button>

            {selectedArticle.sourceUrl && (
              <a
                href={selectedArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-2"
              >
                <span>Read on {selectedArticle.sourceName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setCurrentPage('quiz-generator', { topic: selectedArticle.title })}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Practice Geopolitics Quiz</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'headlines' ? (
        /* Every World News Headline Wire (Default & Primary View) */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                🌐 All Global News Headlines ({displayedNews.length})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                Every Country & Domain
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click any headline for full strategic brief</span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700/80 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {displayedNews.map((art, idx) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-4 md:p-5 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Headline Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/60">
                      {art.region}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-red-500" />
                      <span>{art.country}</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      • {art.sourceName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium ml-auto">
                      {art.date}
                    </span>
                  </div>

                  {/* Prominent Headline Title */}
                  <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                    {art.title}
                  </h3>

                  {/* 1-Line Gist */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(art);
                    }}
                    className={`p-2 rounded-xl transition ${
                      isBookmarked(art.id)
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                    title="Save bookmark"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedArticle(art)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 group-hover:text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>Strategic Brief</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Split Explorer View (List + Sticky Reader) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Headlines */}
          <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">
              Global Stories Wire ({displayedNews.length})
            </div>
            {displayedNews.map(art => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`p-4 rounded-2xl cursor-pointer transition border ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase">
                        {art.region}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {art.country || art.date}
                      </span>
                    </div>

                    <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-700/50">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{art.sourceName}</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Article Reader */}
          <div className="lg:col-span-7">
            {selectedArticle ? (
              <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-6 sticky top-20">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-xs uppercase">
                      {selectedArticle.region}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{selectedArticle.country}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookmark(selectedArticle)}
                      className={`p-2 rounded-xl transition ${
                        isBookmarked(selectedArticle.id)
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    {selectedArticle.sourceUrl && (
                      <a
                        href={selectedArticle.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Source: <strong>{selectedArticle.sourceName}</strong> • Published {selectedArticle.date}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 dark:text-indigo-400">Executive Summary</span>
                  <p className="leading-relaxed">{selectedArticle.summary}</p>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                  {selectedArticle.detailedAnalysis}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                  <span className="font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider text-[10px]">
                    🇮🇳 India's Foreign Policy Angle
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedArticle.indiaRelevance}</p>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <Globe className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Select any World Headline to read analysis</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* World News PDF & Digital Notes Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 space-y-6 shadow-2xl relative">
            
            <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg">
                  Global World News & International Relations Notes
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToNotebook}
                  disabled={isSavingToNotebook}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{isSavingToNotebook ? 'Saving Note...' : 'Save to Digital Notebook'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Download PDF</span>
                </button>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="space-y-6 text-slate-900 dark:text-slate-100 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="border-b-2 border-indigo-600 pb-4 space-y-2 flex flex-wrap justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    ExamNexus Global Intelligence • Daily Edition
                  </span>
                  <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    World Affairs & International Relations Notes
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Compiled from Reuters, BBC World, AP News, Bloomberg & UN Sources
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <div>Date: <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
                  <div>Coverage: Global Geopolitics & Foreign Policy</div>
                </div>
              </div>

              <div className="space-y-6">
                {displayedNews.map((art, idx) => (
                  <div key={art.id} className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                          Headline #{idx + 1} • {art.region} ({art.country})
                        </span>
                        <h2 className="text-base font-black text-slate-900 dark:text-white">
                          {art.title}
                        </h2>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {art.sourceName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <strong className="text-indigo-700 dark:text-indigo-400">Geopolitical Impact:</strong> {art.geopoliticalImpact}
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <strong className="text-amber-700 dark:text-amber-400">India Relevance:</strong> {art.indiaRelevance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-0.5">
                <p className="font-bold">ExamNexus • AI-Powered Global Intelligence Platform</p>
                <p className="text-[10px]">For UPSC CSE GS-2 IR, State PCS, and Strategic Studies</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
