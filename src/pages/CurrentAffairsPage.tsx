import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CurrentAffairItem } from '../types';
import { fetchLiveCurrentAffairs, generateAIExplanation } from '../services/aiService';
import { 
  Newspaper, Search, Bookmark, Check, Sparkles, 
  ArrowRight, RefreshCw, Download, ExternalLink, Calendar,
  Cpu, FileText, ChevronRight, ChevronLeft,
  LayoutGrid, List, CheckCircle2, BookmarkCheck,
  Landmark, TrendingUp, Leaf, FileSpreadsheet, Shield,
  Globe2, Award, BookOpen, Layers, Layers2, FolderOpen,
  Plus, Lock, ShieldCheck
} from 'lucide-react';

interface TopicMeta {
  id: string;
  name: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  gsPaper: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  badgeBg: string;
  description: string;
}

const TOPIC_REGISTRY: Record<string, TopicMeta> = {
  'Polity': {
    id: 'Polity',
    name: 'Polity, Constitution & Governance',
    shortLabel: '🏛️ Polity & Constitution',
    icon: Landmark,
    gsPaper: 'UPSC GS Paper 2',
    colorBg: 'bg-blue-50/70 dark:bg-blue-950/20',
    colorBorder: 'border-blue-200 dark:border-blue-800/50',
    colorText: 'text-blue-700 dark:text-blue-400',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
    description: 'Constitutional articles, Supreme Court verdicts, parliamentary bills, electoral reforms, and governance norms.'
  },
  'Economy': {
    id: 'Economy',
    name: 'Economy, Banking, Trade & Finance',
    shortLabel: '📈 Economy & Banking',
    icon: TrendingUp,
    gsPaper: 'UPSC GS Paper 3',
    colorBg: 'bg-emerald-50/70 dark:bg-emerald-950/20',
    colorBorder: 'border-emerald-200 dark:border-emerald-800/50',
    colorText: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
    description: 'Monetary policy (RBI), Free Trade Agreements, GST Council, fiscal indicators, inflation, and capital markets.'
  },
  'Science & Tech': {
    id: 'Science & Tech',
    name: 'Science, Technology, Space & AI',
    shortLabel: '🔬 Science, Space & Tech',
    icon: Cpu,
    gsPaper: 'UPSC GS Paper 3',
    colorBg: 'bg-purple-50/70 dark:bg-purple-950/20',
    colorBorder: 'border-purple-200 dark:border-purple-800/50',
    colorText: 'text-purple-700 dark:text-purple-400',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
    description: 'ISRO missions, Semiconductor missions, Quantum Computing, Artificial Intelligence, biotech, and indigenous defense tech.'
  },
  'Environment': {
    id: 'Environment',
    name: 'Environment, Ecology, Biodiversity & Climate',
    shortLabel: '🌿 Environment & Ecology',
    icon: Leaf,
    gsPaper: 'UPSC GS Paper 3',
    colorBg: 'bg-teal-50/70 dark:bg-teal-950/20',
    colorBorder: 'border-teal-200 dark:border-teal-800/50',
    colorText: 'text-teal-700 dark:text-teal-400',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300',
    description: 'Ramsar wetlands, IUCN endangered species conservation, climate agreements, renewable corridors, and wildlife corridors.'
  },
  'Government Schemes': {
    id: 'Government Schemes',
    name: 'Government Schemes, Welfare & Public Policy',
    shortLabel: '📋 Government Schemes',
    icon: FileSpreadsheet,
    gsPaper: 'UPSC GS Paper 2 & 3',
    colorBg: 'bg-amber-50/70 dark:bg-amber-950/20',
    colorBorder: 'border-amber-200 dark:border-amber-800/50',
    colorText: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
    description: 'Flagship central/state welfare initiatives, PM-JAY, PM Surya Ghar, financial inclusions, subsidies, and target groups.'
  },
  'Defence': {
    id: 'Defence',
    name: 'Defence, National Security & Strategic Assets',
    shortLabel: '🛡️ Defence & Security',
    icon: Shield,
    gsPaper: 'UPSC GS Paper 3',
    colorBg: 'bg-rose-50/70 dark:bg-rose-950/20',
    colorBorder: 'border-rose-200 dark:border-rose-800/50',
    colorText: 'text-rose-700 dark:text-rose-400',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300',
    description: 'Nuclear triad assets (SSBNs), joint military exercises, defense indigenization, border management, and tri-services theaterisation.'
  },
  'International': {
    id: 'International',
    name: 'International Relations, Bilateral Pacts & Diplomacy',
    shortLabel: '🌐 International Relations',
    icon: Globe2,
    gsPaper: 'UPSC GS Paper 2',
    colorBg: 'bg-indigo-50/70 dark:bg-indigo-950/20',
    colorBorder: 'border-indigo-200 dark:border-indigo-800/50',
    colorText: 'text-indigo-700 dark:text-indigo-400',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300',
    description: 'Quad, G20, UN resolutions, maritime chokepoints, international treaties, and bilateral diplomatic partnerships.'
  },
  'Awards': {
    id: 'Awards',
    name: 'Culture, Heritage, Sports, Awards & Personalities',
    shortLabel: '🏆 Culture, Heritage & Sports',
    icon: Award,
    gsPaper: 'UPSC GS Paper 1',
    colorBg: 'bg-orange-50/70 dark:bg-orange-950/20',
    colorBorder: 'border-orange-200 dark:border-orange-800/50',
    colorText: 'text-orange-700 dark:text-orange-400',
    badgeBg: 'bg-orange-100 dark:bg-orange-900/60 text-orange-800 dark:text-orange-300',
    description: 'UNESCO World Heritage sites, art and architecture, national honors, sports tournaments, and historical milestones.'
  },
  'Editorial': {
    id: 'Editorial',
    name: 'Editorials, Lead Op-Eds & Critical Debates',
    shortLabel: '📰 Lead Editorials & Op-Eds',
    icon: BookOpen,
    gsPaper: 'UPSC Mains GS 1-4 & Essay',
    colorBg: 'bg-slate-50/80 dark:bg-slate-800/40',
    colorBorder: 'border-slate-300 dark:border-slate-700',
    colorText: 'text-slate-700 dark:text-slate-300',
    badgeBg: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
    description: 'Analytical commentaries from The Hindu and Times of India with multidimensional pros, cons, and essay perspectives.'
  }
};

export const CurrentAffairsPage: React.FC = () => {
  const { 
    currentAffairs, 
    setCurrentAffairs, 
    pageParams, 
    setCurrentPage, 
    addBookmark, 
    isBookmarked, 
    addNote, 
    isAdmin, 
    triggerAdminLock 
  } = useApp();
  
  // Topic selection: 'All' or specific category name
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Topic-Wise Wire Active');
  const [isGeneratingAiAnalysis, setIsGeneratingAiAnalysis] = useState<boolean>(false);
  const [customAiEditorial, setCustomAiEditorial] = useState<string | null>(null);
  
  // View mode: 'topic-wise' (Topic-Grouped Headlines - default), 'headlines' (Linear stream), 'cards' (Editorial grid)
  const [viewMode, setViewMode] = useState<'topic-wise' | 'headlines' | 'cards'>('topic-wise');
  
  // Active headline ticker index
  const [activeTickerIdx, setActiveTickerIdx] = useState<number>(0);

  // Digital Notes & PDF state
  const [showNotesPdfModal, setShowNotesPdfModal] = useState<boolean>(false);
  const [isSavingToNotebook, setIsSavingToNotebook] = useState<boolean>(false);

  const [selectedArticle, setSelectedArticle] = useState<CurrentAffairItem | null>(
    pageParams?.articleId ? currentAffairs.find(ca => ca.id === pageParams.articleId) || null : null
  );

  // All articles
  const allArticles = currentAffairs;

  // Filtered by search query & source
  const filteredArticles = allArticles.filter(ca => {
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
      const matchCategory = ca.category.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchKeyword || matchCategory;
    }
    return true;
  });

  // Unique topic list present in current data + standard topics
  const availableTopics = Array.from(
    new Set([
      'Polity',
      'Economy',
      'Science & Tech',
      'Environment',
      'Government Schemes',
      'Defence',
      'International',
      'Awards',
      ...allArticles.map(a => a.category)
    ])
  ).filter(Boolean);

  // Grouped articles by topic
  const groupedArticlesByTopic: Record<string, CurrentAffairItem[]> = {};
  availableTopics.forEach(topic => {
    const items = filteredArticles.filter(a => {
      const cat = a.category as string;
      if (topic === 'Polity' && (cat === 'Polity' || cat === 'Governance')) return true;
      if (topic === 'Science & Tech' && (cat === 'Science & Tech' || cat === 'Space')) return true;
      if (topic === 'Awards' && (cat === 'Awards' || cat === 'Sports' || cat === 'Culture')) return true;
      return cat === topic;
    });
    if (items.length > 0) {
      groupedArticlesByTopic[topic] = items;
    }
  });

  // Articles displayed in linear modes
  const displayedArticles = selectedCategory === 'All'
    ? filteredArticles
    : (groupedArticlesByTopic[selectedCategory] || filteredArticles.filter(a => a.category === selectedCategory));

  // Ticker auto-advance
  useEffect(() => {
    if (allArticles.length === 0) return;
    const interval = setInterval(() => {
      setActiveTickerIdx(prev => (prev + 1) % allArticles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [allArticles.length]);

  const handleAutoUpdate = async () => {
    setIsFetchingLive(true);
    setSyncStatus('Fetching all live topic-wise headlines from The Hindu, TOI & PIB...');
    try {
      const liveArticles = await fetchLiveCurrentAffairs(selectedSource);
      if (liveArticles && liveArticles.length > 0) {
        setCurrentAffairs(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newUnique = liveArticles.filter(a => !existingIds.has(a.id));
          return [...newUnique, ...prev];
        });
        setSyncStatus(`Updated ${liveArticles.length} live headlines!`);
      } else {
        setSyncStatus('Topic headlines synchronized with latest morning editions.');
      }
    } catch {
      setSyncStatus('Topic headline wire synchronized.');
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleGenerateCustomAiAnalysis = async (topicToAnalyze?: string) => {
    const topic = topicToAnalyze || (selectedCategory !== 'All' 
      ? `Topic-Wise Deep Dive: ${selectedCategory} Headlines & Prelims/Mains Exam Takeaways`
      : "Today's Complete Topic-Wise Newspaper Headlines Analysis for UPSC & Competitive Exams");

    setIsGeneratingAiAnalysis(true);
    setCustomAiEditorial(null);
    try {
      const prompt = `Provide an expert, comprehensive AI topic-wise headline analysis for competitive exams on: "${topic}".
Include:
1. Core Topic Context & Newspaper Sources (The Hindu, Times of India, PIB)
2. GS Paper & Syllabus Tagging (UPSC GS 1/2/3/4, State PCS, SSC, Banking)
3. Key Facts & Data Points for Prelims (Articles, Acts, Outlays, Locations)
4. Analytical Arguments for Mains Answer Writing
5. 1 Practice Question with Explanation`;

      const result = await generateAIExplanation(topic, prompt);
      setCustomAiEditorial(result);
    } catch {
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
  };

  const handleSaveNotesToNotebook = () => {
    setIsSavingToNotebook(true);
    const todayStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Structure strictly topic-wise
    const topicSections = Object.entries(groupedArticlesByTopic).map(([topic, articles]) => {
      const meta = TOPIC_REGISTRY[topic];
      const articlesMd = articles.map((art, idx) => `
### ${topic} Headline #${idx + 1}: ${art.title}
- **Source:** ${art.source || 'Newspaper'} (${art.paperPage || 'National Edition'}) | Date: ${art.date}
- **Syllabus Tag:** ${meta?.gsPaper || art.category}
- **Summary:** ${art.summary}

#### Key Prelims Facts:
${art.keyFacts?.map(f => `- ${f}`).join('\n') || '- Exam-relevant data point'}

#### Exam Relevance:
${art.examRelevance?.map(e => `- **${e.exam}:** ${e.relevance}`).join('\n') || ''}
`).join('\n---\n');

      return `
## 🏷️ TOPIC: ${meta?.name || topic} (${meta?.gsPaper || 'General Studies'})
${articlesMd}
`;
    }).join('\n\n========================================\n\n');

    addNote({
      title: `Topic-Wise Newspaper Headlines & Digital Revision Notes (${todayStr})`,
      content: `# ExamNexus Topic-Wise Current Affairs & Editorial Digest\nDate: ${todayStr}\nSources: The Hindu, Times of India & PIB\n\n${topicSections}`,
      folder: 'Current Affairs',
      tags: ['Topic-Wise', 'Daily Headlines', 'The Hindu', 'Times of India', 'UPSC GS']
    });

    setTimeout(() => {
      setIsSavingToNotebook(false);
      alert('Success! Topic-wise newspaper headlines & revision notes saved to your Digital Notebook!');
    }, 400);
  };

  const getSourceBadge = (source?: string) => {
    if (source === 'The Hindu') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-300 dark:border-amber-700/60">
          <Newspaper className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          The Hindu
        </span>
      );
    }
    if (source === 'Times of India') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-300 dark:border-blue-700/60">
          <Newspaper className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          Times of India
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-700/60">
        <Newspaper className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        {source || 'PIB / Press'}
      </span>
    );
  };

  // Navigate to previous/next article when in detail mode
  const navigateArticle = (direction: 'prev' | 'next') => {
    if (!selectedArticle) return;
    const currentIdx = displayedArticles.findIndex(a => a.id === selectedArticle.id);
    if (currentIdx === -1) return;
    if (direction === 'prev' && currentIdx > 0) {
      setSelectedArticle(displayedArticles[currentIdx - 1]);
    } else if (direction === 'next' && currentIdx < displayedArticles.length - 1) {
      setSelectedArticle(displayedArticles[currentIdx + 1]);
    }
  };

  // Active topics count
  const activeTopicKeys = selectedCategory === 'All'
    ? Object.keys(groupedArticlesByTopic)
    : [selectedCategory].filter(t => groupedArticlesByTopic[t]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      
      {/* Hero Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Newspaper className="w-64 h-64 text-white" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
            <Layers2 className="w-4 h-4 text-amber-400" />
            <span>Topic-Wise Headlines Wire • Daily News Classified</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{syncStatus}</span>
          </div>
        </div>

        <div className="space-y-2 relative z-10 max-w-3xl">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Topic-Wise News Headlines & Editorial Wire
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Every daily headline from <strong>The Hindu</strong>, <strong>Times of India</strong>, and <strong>PIB</strong> systematically classified by topic (Polity, Economy, Science & Tech, Environment, Schemes, Defence, International) with GS syllabus tagging.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => {
              if (!isAdmin) {
                triggerAdminLock('Publish Current Affairs Article');
              } else {
                setCurrentPage('admin');
              }
            }}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs transition shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Publish Article</span>
            {!isAdmin ? <Lock className="w-3 h-3 text-amber-300 ml-0.5" /> : <ShieldCheck className="w-3 h-3 text-blue-200 ml-0.5" />}
          </button>

          <button
            onClick={handleAutoUpdate}
            disabled={isFetchingLive}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetchingLive ? 'animate-spin' : ''}`} />
            <span>{isFetchingLive ? 'Fetching Live...' : 'Auto-Sync Topic Headlines'}</span>
          </button>

          <button
            onClick={() => handleGenerateCustomAiAnalysis()}
            disabled={isGeneratingAiAnalysis}
            className="px-4 py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-black text-xs transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGeneratingAiAnalysis ? 'Analyzing...' : 'AI Topic Synthesis'}</span>
          </button>

          <button
            onClick={() => setShowNotesPdfModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Topic-Wise PDF & Notes</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <a
              href="https://www.thehindu.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1"
            >
              <span>The Hindu</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
            <a
              href="https://timesofindia.indiatimes.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1"
            >
              <span>TOI</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Breaking Headline Wire Ticker */}
      {allArticles.length > 0 && (
        <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 flex items-center gap-3 overflow-hidden shadow-sm">
          <div className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>TOPIC WIRE #{activeTickerIdx + 1}</span>
          </div>

          <div 
            onClick={() => setSelectedArticle(allArticles[activeTickerIdx])}
            className="flex-1 text-xs font-bold text-slate-800 dark:text-slate-200 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <span className="text-amber-700 dark:text-amber-400 mr-1.5 font-black">[{allArticles[activeTickerIdx]?.category}]</span>
            <span className="text-blue-600 dark:text-blue-400 mr-2">[{allArticles[activeTickerIdx]?.source || 'National Press'}]</span>
            {allArticles[activeTickerIdx]?.title}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTickerIdx(prev => (prev - 1 + allArticles.length) % allArticles.length)}
              className="p-1 rounded-md hover:bg-amber-500/20 text-slate-600 dark:text-slate-300"
              title="Previous headline"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-500 font-bold px-1">
              {activeTickerIdx + 1}/{allArticles.length}
            </span>
            <button
              onClick={() => setActiveTickerIdx(prev => (prev + 1) % allArticles.length)}
              className="p-1 rounded-md hover:bg-amber-500/20 text-slate-600 dark:text-slate-300"
              title="Next headline"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Custom Editorial Analysis Card */}
      {customAiEditorial && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 text-white space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>AI Topic-Wise Synthesis & Syllabus Analysis</span>
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

      {/* Toolbar: View Switcher (Topic-Wise vs Flat List vs Cards), Search, and Quick Source Badges */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-700 text-xs font-bold">
            <button
              onClick={() => { setViewMode('topic-wise'); setSelectedArticle(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                viewMode === 'topic-wise'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🌟 Topic-Wise Headlines ({Object.keys(groupedArticlesByTopic).length} Topics)</span>
            </button>
            <button
              onClick={() => { setViewMode('headlines'); setSelectedArticle(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                viewMode === 'headlines'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Every Headline Feed ({filteredArticles.length})</span>
            </button>
            <button
              onClick={() => { setViewMode('cards'); setSelectedArticle(null); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Editorial Cards</span>
            </button>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search topic, headline, article, or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Right: Quick Source Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold no-scrollbar">
          {[
            { id: 'All', label: 'All Sources' },
            { id: 'The Hindu', label: 'The Hindu' },
            { id: 'Times of India', label: 'Times of India' },
            { id: 'PIB', label: 'PIB' }
          ].map(src => (
            <button
              key={src.id}
              onClick={() => {
                setSelectedSource(src.id);
                setSelectedArticle(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                selectedSource === src.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOPIC QUICK-JUMP BAR WITH HEADLINE COUNTS */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Select Topic to Filter or View All Grouped:</span>
          </span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedArticle(null); }}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Reset to All Topics ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold pb-1 no-scrollbar">
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedArticle(null); }}
            className={`px-3.5 py-2 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>📌 All Topics</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategory === 'All' ? 'bg-blue-800 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {filteredArticles.length}
            </span>
          </button>

          {availableTopics.map(topic => {
            const count = (groupedArticlesByTopic[topic] || []).length;
            const meta = TOPIC_REGISTRY[topic];
            if (count === 0 && selectedCategory !== topic) return null;

            return (
              <button
                key={topic}
                onClick={() => {
                  setSelectedCategory(topic);
                  setSelectedArticle(null);
                }}
                className={`px-3.5 py-2 rounded-2xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === topic
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{meta?.shortLabel || topic}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  selectedCategory === topic ? 'bg-blue-800 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Selected Article Detail OR Topic-Wise / Headline List / Cards */}
      {selectedArticle ? (
        /* Full Article Detail Viewer */
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-6 shadow-md animate-in fade-in duration-200">
          
          {/* Top Bar with Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Topic Headlines List</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateArticle('prev')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Headline</span>
              </button>
              <button
                onClick={() => navigateArticle('next')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 flex items-center gap-1"
              >
                <span>Next Headline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Article Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {getSourceBadge(selectedArticle.source)}
              <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold text-xs">
                {selectedArticle.category}
              </span>
              {selectedArticle.paperPage && (
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                  {selectedArticle.paperPage}
                </span>
              )}
              <span className="text-xs text-slate-400 font-medium ml-auto flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
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
              Executive Brief & Core Takeaway
            </span>
            <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {selectedArticle.summary}
            </p>
          </div>

          {/* Detailed Editorial Content */}
          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line border-y border-slate-100 dark:border-slate-700 py-6">
            {selectedArticle.detailedContent}
          </div>

          {/* High Yield Facts & Exam Relevance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Facts */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>High-Yield Prelims Facts</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedArticle.keyFacts?.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exam Tagging */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
              <span className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Syllabus & Exam Mapping</span>
              </span>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {selectedArticle.examRelevance?.map((er, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700">
                    <strong className="text-blue-700 dark:text-blue-300">{er.exam}:</strong> {er.relevance}
                  </div>
                ))}
              </div>
            </div>
          </div>

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

            <button
              onClick={() => setCurrentPage('quiz-generator', { topic: `${selectedArticle.category}: ${selectedArticle.title}` })}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Topic Quiz</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'topic-wise' ? (
        /* 🌟 1. TOPIC-WISE GROUPED HEADLINES (DEFAULT & RECOMMENDED VIEW) */
        <div className="space-y-8">
          {activeTopicKeys.map(topicKey => {
            const articles = groupedArticlesByTopic[topicKey] || [];
            if (articles.length === 0) return null;
            const meta = TOPIC_REGISTRY[topicKey];
            const IconComponent = meta?.icon || Layers;

            return (
              <div 
                key={topicKey}
                id={`topic-section-${topicKey}`}
                className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden space-y-0"
              >
                {/* Topic Section Header Banner */}
                <div className={`p-4 md:p-5 ${meta?.colorBg || 'bg-slate-50 dark:bg-slate-800/80'} border-b ${meta?.colorBorder || 'border-slate-200 dark:border-slate-700'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${meta?.badgeBg || 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'} shrink-0 shadow-sm`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white">
                          {meta?.name || topicKey}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${meta?.badgeBg || 'bg-slate-200 text-slate-800'}`}>
                          {articles.length} {articles.length === 1 ? 'Headline' : 'Headlines'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <strong className="text-blue-600 dark:text-blue-400">{meta?.gsPaper || 'General Studies'}</strong> • {meta?.description || 'Daily news and exam analysis'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleGenerateCustomAiAnalysis(`${meta?.name || topicKey} - Daily Exam Headlines Deep-Dive`)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Topic Brief</span>
                    </button>
                  </div>
                </div>

                {/* Topic Headlines List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700/80">
                  {articles.map((art, idx) => (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticle(art)}
                      className="p-4 md:p-5 hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      {/* Headline Info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                            #{String(idx + 1).padStart(2, '0')}
                          </span>
                          {getSourceBadge(art.source)}
                          {art.paperPage && (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {art.paperPage}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 font-medium ml-auto">
                            {art.date}
                          </span>
                        </div>

                        {/* Prominent Headline Title */}
                        <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                          {art.title}
                        </h3>

                        {/* 1-Line Gist */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                          {art.summary}
                        </p>

                        {/* Quick Key Facts preview */}
                        {art.keyFacts && art.keyFacts.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 pt-0.5">
                            <span className="font-bold">⚡ Key Point:</span>
                            <span className="truncate">{art.keyFacts[0]}</span>
                          </div>
                        )}
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
                          className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-600 text-blue-600 dark:text-blue-300 group-hover:text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <span>Strategic Breakdown</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'headlines' ? (
        /* 📰 2. ALL HEADLINES STREAM (LINEAR VIEW) */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                📰 All Newspaper Headlines Feed ({displayedArticles.length})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                Every Headline
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click any headline to view analysis</span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700/80 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {displayedArticles.map((art, idx) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-4 md:p-5 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Headline Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold">
                      {art.category}
                    </span>
                    {getSourceBadge(art.source)}
                    {art.paperPage && (
                      <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                        • {art.paperPage}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium ml-auto">
                      {art.date}
                    </span>
                  </div>

                  {/* Prominent Headline Title */}
                  <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
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
                    className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-600 text-blue-600 dark:text-blue-300 group-hover:text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 🗂️ 3. EDITORIAL CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((art, idx) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-blue-600">#{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      {art.category}
                    </span>
                    {getSourceBadge(art.source)}
                  </div>
                  <span className="text-slate-400 text-[11px] font-medium">{art.date}</span>
                </div>

                {art.paperPage && (
                  <span className="inline-block text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                    {art.paperPage}
                  </span>
                )}

                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Read Full Analysis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Topic-Wise Digital Notes & PDF Preview Modal */}
      {showNotesPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 space-y-6 shadow-2xl relative">
            
            {/* Modal Control Bar */}
            <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg">
                  Topic-Wise Newspaper Headlines & Digital Notes Sheet
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveNotesToNotebook}
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
                  onClick={() => setShowNotesPdfModal(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Document Sheet */}
            <div className="space-y-6 text-slate-900 dark:text-slate-100 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              
              <div className="border-b-2 border-blue-600 pb-4 space-y-2 flex flex-wrap justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    ExamNexus Official Study Material • Topic-Wise Classification
                  </span>
                  <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Topic-Wise Newspaper Headlines & Exam Analysis
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Compiled from <strong>The Hindu (thehindu.com)</strong> & <strong>Times of India (indiatimes.com)</strong> & <strong>PIB</strong>
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <div>Date: <strong>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></div>
                  <div>Topics Covered: <strong>{Object.keys(groupedArticlesByTopic).length} Exam Domains</strong></div>
                </div>
              </div>

              {/* Topic Index */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  📑 Topic-Wise Headlines Wire Index ({filteredArticles.length} News Items Total)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {Object.entries(groupedArticlesByTopic).map(([topic, articles]) => {
                    const meta = TOPIC_REGISTRY[topic];
                    return (
                      <div key={topic} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white">{meta?.shortLabel || topic}:</span>
                        <span className="text-blue-600 dark:text-blue-400 ml-1.5 font-mono font-bold">({articles.length} headlines)</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">{meta?.gsPaper}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Topic-Wise Sections Breakdown */}
              <div className="space-y-8">
                {Object.entries(groupedArticlesByTopic).map(([topic, articles]) => {
                  const meta = TOPIC_REGISTRY[topic];
                  return (
                    <div key={topic} className="space-y-4">
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-black text-blue-900 dark:text-blue-200">
                            {meta?.name || topic}
                          </h2>
                          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                            {meta?.gsPaper || 'General Studies'} • {articles.length} Headlines
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 pl-2">
                        {articles.map((art, idx) => (
                          <div key={art.id} className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                              <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                                #{idx + 1} • {art.title}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                {art.source || 'Newspaper'} • {art.paperPage || 'Main'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                              {art.summary}
                            </p>

                            {art.keyFacts && art.keyFacts.length > 0 && (
                              <div className="text-xs space-y-1 pt-1">
                                <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-400 uppercase">
                                  ⚡ Key Facts for Prelims
                                </span>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-slate-700 dark:text-slate-300">
                                  {art.keyFacts.map((fact, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-1 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px]">
                                      <span className="text-emerald-600 font-bold">•</span>
                                      <span>{fact}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-0.5">
                <p className="font-bold">ExamNexus • AI-Powered Competitive Exam Preparation Platform</p>
                <p className="text-[10px]">Topic-Wise Classified Daily Newspaper Headlines</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
