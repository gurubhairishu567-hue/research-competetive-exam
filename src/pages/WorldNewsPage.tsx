import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WorldNewsItem } from '../types';
import { fetchLiveWorldNews, generateAIExplanation } from '../services/aiService';
import {
  Globe, Search, Sparkles, RefreshCw, ExternalLink, Bookmark, Download,
  Check, ShieldCheck, HelpCircle, Layers, FileText, Cpu, Compass,
  MapPin, Flag, TrendingUp, AlertTriangle, Building2, BookOpen
} from 'lucide-react';

export const WorldNewsPage: React.FC = () => {
  const { addBookmark, isBookmarked, addNote } = useApp();

  const [worldNews, setWorldNews] = useState<WorldNewsItem[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('AI World Feed Active');

  const [selectedArticle, setSelectedArticle] = useState<WorldNewsItem | null>(null);
  const [expandedMcqIdx, setExpandedMcqIdx] = useState<number | null>(null);

  const [aiCustomTopic, setAiCustomTopic] = useState<string>('');
  const [isGeneratingAiAnalysis, setIsGeneratingAiAnalysis] = useState<boolean>(false);
  const [customAiGeopoliticalAnalysis, setCustomAiGeopoliticalAnalysis] = useState<string | null>(null);

  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [isSavingToNotebook, setIsSavingToNotebook] = useState<boolean>(false);

  // Auto-run AI World News fetch on initial mount
  useEffect(() => {
    handleAutoFetch();
  }, []);

  const handleAutoFetch = async (queryParam?: string) => {
    setIsFetchingLive(true);
    setSyncStatus('Syncing Live Global News with AI...');
    try {
      const data = await fetchLiveWorldNews(selectedRegion, queryParam || searchQuery);
      if (data && data.length > 0) {
        setWorldNews(data);
        if (!selectedArticle) {
          setSelectedArticle(data[0]);
        }
        setSyncStatus(`Updated (${data.length} World Stories)`);
      } else {
        setSyncStatus('Using Cached Global Intelligence');
      }
    } catch (err) {
      setSyncStatus('Failed to sync. Using fallback.');
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    // Automatically trigger fetch for new region if user selects specific region
    setIsFetchingLive(true);
    fetchLiveWorldNews(reg, searchQuery).then(data => {
      if (data && data.length > 0) {
        setWorldNews(data);
        setSelectedArticle(data[0]);
      }
    }).finally(() => setIsFetchingLive(false));
  };

  const handleGenerateCustomGeopoliticalAnalysis = async () => {
    const topic = aiCustomTopic || "Today's Top Global Geopolitical Developments, UN Summit & India Foreign Policy Impact";
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
    } catch (err: any) {
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

    const notesContent = worldNews.map((art, idx) => `
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
      title: `Global World News Digital Notes (${todayStr}) - AI Auto-Updated`,
      content: `# ExamNexus Global Intelligence & World News Digital Notes\nDate: ${todayStr}\nCoverage: International Relations, Geopolitics, Global Economy & Multilateral Summits\n\n${notesContent}`,
      folder: 'Current Affairs',
      tags: ['World News', 'Geopolitics', 'International Relations', 'UPSC GS2', 'Global Economy']
    });

    setTimeout(() => {
      setIsSavingToNotebook(false);
      alert('Success! Global World News digital notes saved to your notebook.');
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

  const filteredNews = worldNews.filter(art => {
    const matchesRegion = selectedRegion === 'All' || art.region === selectedRegion;
    const matchesQuery = searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.keyOrganizations && art.keyOrganizations.some(o => o.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesRegion && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Hero Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-indigo-800/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '12s' }} />
              <span>AI World News Portal • Live Auto-Update Engine</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
              Global News & World Affairs Intelligence
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Real-time AI-curated breaking global events from 190+ countries, covering international relations, multilateral summits, foreign policy, and economic trade corridors.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-right hidden md:block">
              <div className="text-[11px] font-bold text-slate-400">Live Engine Status</div>
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
              <span>{isFetchingLive ? 'Auto-Syncing World News...' : 'Auto-Fetch Live Global News'}</span>
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Major Agencies:</span>
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

      {/* Custom AI Geopolitical Breakdown Card */}
      {customAiGeopoliticalAnalysis && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/40 text-white space-y-4 shadow-xl animate-in fade-in duration-200">
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

      {/* Search & Region Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAutoFetch(searchQuery)}
            placeholder="Search country, UN summit, NATO, G20, trade deal..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white shadow-sm"
          />
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl text-xs font-bold no-scrollbar">
          {regions.map(reg => (
            <button
              key={reg}
              onClick={() => handleRegionChange(reg)}
              className={`px-3.5 py-2 rounded-2xl whitespace-nowrap transition ${
                selectedRegion === reg
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {reg === 'All' ? '🌐 All World' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid & Selected Article Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Live Global Headlines ({filteredNews.length})
            </span>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
              {selectedRegion === 'All' ? 'Global Feed' : selectedRegion}
            </span>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredNews.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <Globe className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No world news matching your filter.</p>
                <button
                  onClick={() => { setSelectedRegion('All'); setSearchQuery(''); handleAutoFetch(); }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Reset Search & Reload
                </button>
              </div>
            ) : (
              filteredNews.map(art => {
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
              })
            )}
          </div>
        </div>

        {/* Right Article Detailed Analysis Column */}
        <div className="lg:col-span-7">
          {selectedArticle ? (
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-6 sticky top-20">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-black text-xs uppercase tracking-wider">
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

                  <a
                    href={selectedArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1"
                  >
                    <span>Read on {selectedArticle.sourceName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Source: <strong className="text-slate-700 dark:text-slate-200">{selectedArticle.sourceName}</strong></span>
                  <span>•</span>
                  <span>Date: {selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>

              {/* Summary Brief */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Executive Summary</span>
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedArticle.summary}
                </p>
              </div>

              {/* Geopolitical & India Foreign Policy Impact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span>Geopolitical Security Impact</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedArticle.geopoliticalImpact}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
                    <Flag className="w-4 h-4 text-indigo-600" />
                    <span>India Foreign Policy (UPSC GS-2)</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedArticle.indiaRelevance}
                  </p>
                </div>
              </div>

              {/* Detailed Markdown Analysis */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Comprehensive Detailed Analysis</span>
                <div className="prose prose-slate dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  {selectedArticle.detailedAnalysis}
                </div>
              </div>

              {/* Key Organizations Involved */}
              {selectedArticle.keyOrganizations && selectedArticle.keyOrganizations.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Multilateral Bodies & Treaties</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedArticle.keyOrganizations.map((org, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold">
                        🏛️ {org}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* High Yield Facts Bullets */}
              {selectedArticle.keyFacts && selectedArticle.keyFacts.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    ⚡ High-Yield Exam Pointer Facts
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {selectedArticle.keyFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practice MCQ Section */}
              {selectedArticle.possibleMCQs && selectedArticle.possibleMCQs.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" />
                      <span>International Relations Practice Question</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Q. {selectedArticle.possibleMCQs[0].question}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {selectedArticle.possibleMCQs[0].options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setExpandedMcqIdx(oIdx)}
                          className={`p-2.5 rounded-xl border text-left transition font-medium text-xs ${
                            expandedMcqIdx === oIdx
                              ? oIdx === selectedArticle.possibleMCQs[0].correctIndex
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                                : 'bg-red-100 border-red-500 text-red-900 dark:bg-red-950 dark:text-red-200'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                        </button>
                      ))}
                    </div>

                    {expandedMcqIdx !== null && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1 mt-2">
                        <span className="font-bold">✓ Explanation:</span>
                        <p>{selectedArticle.possibleMCQs[0].explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400">
              Select an article from the list to view comprehensive world intelligence.
            </div>
          )}
        </div>
      </div>

      {/* PDF & Digital Notes Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 space-y-6 shadow-2xl relative">
            
            {/* Modal Bar */}
            <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg">
                  Global World News Digital Notes & PDF Generator
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToNotebook}
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
                  onClick={() => setShowPdfModal(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="print-document-sheet space-y-6 text-slate-900 dark:text-slate-100 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              
              <div className="border-b-2 border-indigo-600 pb-4 space-y-2 flex flex-wrap justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    ExamNexus Global Intelligence • Daily World Edition
                  </span>
                  <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    World News & Geopolitics Digital Notes
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Coverage: Reuters, BBC World, AP News, Bloomberg, Al Jazeera, UN News
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <div>Date: <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
                  <div>Target: UPSC GS-2 (IR), State PCS, SSC, Bank Global Awareness</div>
                </div>
              </div>

              {/* World News Items List */}
              <div className="space-y-6">
                {worldNews.map((art, idx) => (
                  <div key={art.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {idx + 1}. {art.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold shrink-0">
                        {art.region}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <strong>Geopolitical Security:</strong> {art.geopoliticalImpact}
                      </div>
                      <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <strong>India Relevance:</strong> {art.indiaRelevance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                ExamNexus • World News Intelligence Portal
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
