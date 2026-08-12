import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Filter,
  Search,
  CheckCircle2,
  Bookmark,
  Sparkles,
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Download,
  HelpCircle,
  Zap,
  RefreshCw,
  Flame,
  ChevronRight,
  AlertCircle,
  Layers,
  Check,
  RotateCcw,
  Landmark,
  Coins,
  History,
  Globe,
  Trees,
  Atom,
  Calculator,
  Brain,
  Languages,
  Newspaper,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { sendAIChatRequest } from '../services/aiService';

interface SubjectPaperMeta {
  id: string;
  subject: string;
  icon: React.ElementType;
  color: string;
  badgeBg: string;
  totalQuestions: string;
  yearsCovered: string;
  exams: string[];
  subTopics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-level';
  highYieldTopics: string;
  pdfSize: string;
}

export const PYQPage: React.FC = () => {
  const { questions, addBookmark, setCurrentPage } = useApp();

  const [activeTab, setActiveTab] = useState<'analysis' | 'subject-papers' | 'repository' | 'test'>('subject-papers');

  // Filters
  const [selectedExam, setSelectedExam] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast / Download Notification State
  const [downloadingSubject, setDownloadingSubject] = useState<string | null>(null);

  // AI Trend State
  const [aiTrendReport, setAiTrendReport] = useState<string | null>(null);
  const [isGeneratingTrend, setIsGeneratingTrend] = useState<boolean>(false);

  // Timed PYQ Test State
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [currentTestPaper, setCurrentTestPaper] = useState<string>('UPSC CSE 2024 Prelims GS 1');
  const [testUserAnswers, setTestUserAnswers] = useState<Record<number, number>>({});
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(600); // 10 mins
  const [testSubmitted, setTestSubmitted] = useState<boolean>(false);

  // Lists
  const yearsList = ['All', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2015'];
  const examsList = ['All', 'UPSC CSE', 'SSC CGL', 'IBPS PO', 'RRB NTPC', 'State PCS'];
  const subjectsList = [
    'All',
    'Polity & Constitution',
    'Indian Economy',
    'History & Culture',
    'Geography & Climate',
    'Environment & Ecology',
    'Science & Technology',
    'Quantitative Aptitude',
    'Reasoning Ability',
    'English Comprehension',
    'General Awareness'
  ];

  // Subject Paper Archives Database
  const subjectPaperArchives: SubjectPaperMeta[] = [
    {
      id: 'sp-polity',
      subject: 'Polity & Constitution',
      icon: Landmark,
      color: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      totalQuestions: '1,480+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['UPSC CSE', 'SSC CGL', 'State PCS', 'RRB NTPC'],
      subTopics: ['Preamble & Fundamental Rights', 'Parliament & State Legislature', 'Judiciary & PIL', 'Constitutional Bodies (Art 280, 324)', 'Panchayati Raj & Local Bodies'],
      difficulty: 'Exam-level',
      highYieldTopics: 'Fundamental Rights, Emergency Provisions, Article 280',
      pdfSize: '14.2 MB'
    },
    {
      id: 'sp-economy',
      subject: 'Indian Economy',
      icon: Coins,
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      totalQuestions: '1,250+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['UPSC CSE', 'IBPS PO', 'SSC CGL', 'State PCS'],
      subTopics: ['Inflation & Inflation-Indexed Bonds', 'RBI Monetary Policy & Repo Rates', 'Fiscal Deficit & Union Budget', 'Banking, NPAs & Insolvency Code', 'External Trade & Balance of Payments'],
      difficulty: 'Hard',
      highYieldTopics: 'Inflation-Indexed Bonds, Repo Rate, Capital Accounts',
      pdfSize: '12.8 MB'
    },
    {
      id: 'sp-history',
      subject: 'History & Culture',
      icon: History,
      color: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      totalQuestions: '1,620+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['UPSC CSE', 'SSC CGL', 'State PCS', 'RRB NTPC'],
      subTopics: ['Indus Valley & Vedic Period', 'Gupta Empire & Agrahara Grants', 'Bhakti & Sufi Saints', '1857 Revolt & Freedom Struggle', 'Temple Architecture & UNESCO Heritage'],
      difficulty: 'Medium',
      highYieldTopics: 'Ancient Land Grants, Maurya Dynasty, Modern Freedom Movement',
      pdfSize: '18.5 MB'
    },
    {
      id: 'sp-geography',
      subject: 'Geography & Climate',
      icon: Globe,
      color: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      totalQuestions: '1,110+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['UPSC CSE', 'SSC CGL', 'State PCS', 'NDA/CDS'],
      subTopics: ['Western Ghats & Himalayan Geology', 'Indian Monsoon & Ocean Currents', 'River Drainage Basins (Ganga, Godavari)', 'Soils, Vegetation & Mineral Resources', 'World Physical Geography'],
      difficulty: 'Medium',
      highYieldTopics: 'Western Ghats Peaks, El Nino/La Nina, Ocean Trenches',
      pdfSize: '11.4 MB'
    },
    {
      id: 'sp-environment',
      subject: 'Environment & Ecology',
      icon: Trees,
      color: 'text-teal-600 dark:text-teal-400',
      badgeBg: 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      totalQuestions: '1,340+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['UPSC CSE', 'State PCS', 'SSC CGL'],
      subTopics: ['Ramsar Wetlands & Chilika Lake', 'COP Climate Conferences (UNFCCC)', 'Biodiversity Hotspots & IUCN Status', 'Wildlife Protection Act 1972', 'Pollution & Renewable Energy Targets'],
      difficulty: 'Exam-level',
      highYieldTopics: 'Ramsar Sites, IUCN Red List, Carbon Trading',
      pdfSize: '15.1 MB'
    },
    {
      id: 'sp-science',
      subject: 'Science & Technology',
      icon: Atom,
      color: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      totalQuestions: '980+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['UPSC CSE', 'SSC CGL', 'RRB NTPC', 'IBPS PO'],
      subTopics: ['CRISPR-Cas9 & Gene Editing', 'ISRO Spacecraft & Gaganyaan Mission', 'Quantum Computing & AI Models', 'Defence Tech & Hypersonic Missiles', 'Nanotechnology & Superconductors'],
      difficulty: 'Hard',
      highYieldTopics: 'Gene Editing, Quantum Computing, ISRO Orbits',
      pdfSize: '10.9 MB'
    },
    {
      id: 'sp-quant',
      subject: 'Quantitative Aptitude',
      icon: Calculator,
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      totalQuestions: '2,150+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC CSAT'],
      subTopics: ['Compound Interest & Simple Interest', 'Speed, Time, Distance & Boats', 'Profit, Loss & Percentage Ratios', 'Data Interpretation & Graphs', 'Algebra, Geometry & Mensuration'],
      difficulty: 'Medium',
      highYieldTopics: 'Compound Interest 3-yr formula, Work & Time, Pie Charts',
      pdfSize: '16.7 MB'
    },
    {
      id: 'sp-reasoning',
      subject: 'Reasoning Ability',
      icon: Brain,
      color: 'text-cyan-600 dark:text-cyan-400',
      badgeBg: 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      totalQuestions: '1,980+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC CSAT'],
      subTopics: ['Coding-Decoding & Analogies', 'Syllogism & Statements-Assumptions', 'Seating Arrangement & Circular Puzzles', 'Blood Relations & Direction Sense', 'Data Sufficiency'],
      difficulty: 'Easy',
      highYieldTopics: 'Coding shifts, Syllogisms, Circular seating',
      pdfSize: '13.2 MB'
    },
    {
      id: 'sp-english',
      subject: 'English Comprehension',
      icon: Languages,
      color: 'text-violet-600 dark:text-violet-400',
      badgeBg: 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
      totalQuestions: '1,750+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['SSC CGL', 'IBPS PO', 'UPSC CSAT', 'NDA/CDS'],
      subTopics: ['Reading Passages & Main Idea', 'Antonyms, Synonyms & One Word Substitution', 'Error Spotting & Sentence Improvement', 'Para Jumbles & Sentence Ordering', 'Cloze Test Passages'],
      difficulty: 'Easy',
      highYieldTopics: 'Mandatory antonyms, Rule-based Subject-Verb Agreement',
      pdfSize: '11.8 MB'
    },
    {
      id: 'sp-ga',
      subject: 'General Awareness',
      icon: Newspaper,
      color: 'text-orange-600 dark:text-orange-400',
      badgeBg: 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      totalQuestions: '2,400+ Solved PYQs',
      yearsCovered: '2015–2025 (11 Years)',
      exams: ['SSC CGL', 'RRB NTPC', 'IBPS PO', 'State PCS'],
      subTopics: ['International Alliances (NATO, G20, BRICS)', 'Government Schemes & Portals', 'National Parks & Wildlife Sanctuaries', 'Sports Champions & Awards', 'Important Days & Summits'],
      difficulty: 'Easy',
      highYieldTopics: 'NATO 32nd member, PM Schemes, G20 Summits',
      pdfSize: '19.1 MB'
    }
  ];

  // Filtered Subject Archives
  const filteredSubjectArchives = subjectPaperArchives.filter(sa => {
    if (selectedSubject !== 'All' && sa.subject !== selectedSubject) return false;
    if (selectedExam !== 'All' && !sa.exams.includes(selectedExam)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = (sa.subject + ' ' + sa.subTopics.join(' ') + ' ' + sa.highYieldTopics).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Question Bank Filtered Data
  const pyqQuestions = questions.filter(q => {
    if (selectedExam !== 'All' && !q.exam.includes(selectedExam)) return false;
    if (selectedYear !== 'All' && q.year !== parseInt(selectedYear)) return false;
    if (selectedSubject !== 'All' && q.subject !== selectedSubject) return false;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchText = (q.question + ' ' + q.subject + ' ' + q.topic + ' ' + (q.explanation || '')).toLowerCase();
      if (!matchText.includes(query)) return false;
    }
    return true;
  });

  // Mock Weightage Analysis Data across Years for UPSC CSE
  const weightageDataUPSC = [
    { year: '2020', Polity: 16, History: 18, Economy: 15, Environment: 14, Science: 12, CurrentAffairs: 25 },
    { year: '2021', Polity: 18, History: 20, Economy: 14, Environment: 15, Science: 11, CurrentAffairs: 22 },
    { year: '2022', Polity: 12, History: 16, Economy: 19, Environment: 17, Science: 13, CurrentAffairs: 23 },
    { year: '2023', Polity: 15, History: 14, Economy: 18, Environment: 18, Science: 12, CurrentAffairs: 23 },
    { year: '2024', Polity: 15, History: 15, Economy: 16, Environment: 19, Science: 14, CurrentAffairs: 21 },
    { year: '2025', Polity: 16, History: 14, Economy: 17, Environment: 20, Science: 13, CurrentAffairs: 20 },
  ];

  // Cutoff trend history data
  const cutoffTrendData = [
    { year: '2020', Cutoff: 92.51 },
    { year: '2021', Cutoff: 87.54 },
    { year: '2022', Cutoff: 88.22 },
    { year: '2023', Cutoff: 75.41 },
    { year: '2024', Cutoff: 75.50 },
    { year: '2025 (Expected)', Cutoff: 78.00 }
  ];

  // High-Yield Repeating Topics
  const highYieldTopics = [
    { topic: 'Fundamental Rights & Judiciary', exam: 'UPSC CSE', weightage: '12-15% of GS 1', count: '48 Questions in 10 yrs' },
    { topic: 'Inflation, RBI & Monetary Policy', exam: 'UPSC & IBPS', weightage: '10-14% of GS/Quant', count: '52 Questions in 10 yrs' },
    { topic: 'Ramsar Wetlands & Climate COP', exam: 'UPSC CSE', weightage: '15-18% of GS 1', count: '42 Questions in 10 yrs' },
    { topic: 'Speed, Distance, Boats & Streams', exam: 'SSC CGL', weightage: '8-10% of Tier I', count: '64 Questions in 10 yrs' },
    { topic: 'Gupta & Ancient Land Grants', exam: 'UPSC & State PCS', weightage: '6-8% of GS 1', count: '29 Questions in 10 yrs' },
  ];

  const handleGenerateAIPYQReport = async () => {
    setIsGeneratingTrend(true);
    setAiTrendReport(null);
    try {
      const prompt = `Analyze previous year papers for ${selectedExam === 'All' ? 'UPSC CSE' : selectedExam} over the past 10 years (2015-2025) across all major subjects (Polity, Economy, History, Geography, Environment, Science & Tech, CSAT). Provide:
1. Top 5 most frequently repeated core themes per subject.
2. Sudden weightage shifts observed in 2024-2025.
3. Recommended priority focus areas for upcoming 2026 examination.
Keep it crisp, exam-oriented, with high-yield bullet points.`;

      const response = await sendAIChatRequest(prompt, selectedExam === 'All' ? 'UPSC CSE' : selectedExam, 'explain');
      setAiTrendReport(response);
    } catch (err) {
      console.error('Failed to generate AI trend report', err);
      setAiTrendReport('Unable to generate live AI PYQ analysis. Please try again.');
    } finally {
      setIsGeneratingTrend(false);
    }
  };

  const handleDownloadPDF = (subjectName: string) => {
    setDownloadingSubject(subjectName);
    setTimeout(() => {
      setDownloadingSubject(null);
    }, 3000);
  };

  const handleSolveSubjectPYQs = (subj: string) => {
    setSelectedSubject(subj);
    setActiveTab('repository');
  };

  const handleStartTest = (paperName: string) => {
    setCurrentTestPaper(paperName);
    setTestUserAnswers({});
    setTestSubmitted(false);
    setIsTestActive(true);
    setTestTimeRemaining(600);
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (testSubmitted) return;
    setTestUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateTestScore = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;

    pyqQuestions.slice(0, 5).forEach((q, idx) => {
      if (testUserAnswers[idx] !== undefined) {
        if (testUserAnswers[idx] === q.correctAnswer) {
          score += 2;
          correct += 1;
        } else {
          score -= 0.66;
          incorrect += 1;
        }
      }
    });

    return { score: Math.max(0, score).toFixed(2), correct, incorrect, attempted: Object.keys(testUserAnswers).length };
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Toast Notification for Download */}
      {downloadingSubject && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-indigo-500/50 flex items-center gap-3 animate-bounce">
          <Download className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <p className="font-bold text-xs">Downloading Solved PYQ Package...</p>
            <p className="text-[11px] text-slate-300">{downloadingSubject} (2015–2025 PDF with Explanations)</p>
          </div>
        </div>
      )}

      {/* Page Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0F172A] text-white space-y-3 shadow-xl border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-800/50">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Complete Previous Year Papers Repository (2015–2025)</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          Master Official PYQs & All Subject Papers
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Exhaustive archive of verified official past papers categorized by subject (Polity, Economy, History, Geography, Environment, Science, Quant, Reasoning, English) with official keys & AI analysis.
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('subject-papers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'subject-papers'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-300" />
            <span>Subject-Wise Paper Archives</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'analysis'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Subject Weightage & AI Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('repository')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'repository'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Official Solved Question Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'test'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Timed PYQ Paper Test</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: ALL SUBJECT-WISE PAPER ARCHIVES ================= */}
      {activeTab === 'subject-papers' && (
        <div className="space-y-6">
          
          {/* Quick Filter Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400">Exam Target:</span>
                <select
                  value={selectedExam}
                  onChange={e => setSelectedExam(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700"
                >
                  {examsList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700"
                >
                  {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search subject topics, topics, e.g. Fundamental Rights..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSubjectArchives.map(sa => {
              const IconComp = sa.icon;
              return (
                <div key={sa.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition">
                  
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${sa.color}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">{sa.subject}</h3>
                          <span className="text-[11px] text-slate-500">{sa.yearsCovered}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sa.badgeBg}`}>
                        {sa.totalQuestions}
                      </span>
                    </div>

                    {/* Sub-topics tags */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Core Tested Themes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sa.subTopics.map((st, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Exams badge list */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                      <span className="text-slate-400 font-semibold text-[11px]">Applicable Exams:</span>
                      {sa.exams.map((ex, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleSolveSubjectPYQs(sa.subject)}
                      className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Solve Subject PYQs</span>
                    </button>

                    <button
                      onClick={() => handleDownloadPDF(sa.subject)}
                      className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>PDF Solved Key ({sa.pdfSize})</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================= TAB 2: SUBJECT WEIGHTAGE & AI TREND ANALYSIS ================= */}
      {activeTab === 'analysis' && (
        <div className="space-y-8">
          
          {/* Exam Switcher & AI Investigator CTA */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Exam Focus:</span>
              <select
                value={selectedExam}
                onChange={e => setSelectedExam(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none"
              >
                {examsList.filter(e => e !== 'All').map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>

            <button
              onClick={handleGenerateAIPYQReport}
              disabled={isGeneratingTrend}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {isGeneratingTrend ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>{isGeneratingTrend ? 'Analyzing Past 10 Years...' : `Generate AI PYQ Analysis for ${selectedExam}`}</span>
            </button>
          </div>

          {/* AI Trend Report Output Box */}
          {aiTrendReport && (
            <div className="p-6 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-base">AI PYQ Trend Intelligence Brief ({selectedExam})</h3>
              </div>
              <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-slate-200 whitespace-pre-line">
                {aiTrendReport}
              </div>
            </div>
          )}

          {/* Subject Weightage Bar Chart & Cutoff Line Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Subject Distribution Chart */}
            <div className="lg:col-span-8 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>Subject-Wise Question Weightage (2020–2025)</span>
                  </h3>
                  <p className="text-xs text-slate-500">Distribution of marks per subject in Prelims General Studies</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded">
                  Official Data
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightageDataUPSC}>
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Polity" fill="#6366f1" />
                    <Bar dataKey="Economy" fill="#10b981" />
                    <Bar dataKey="Environment" fill="#f59e0b" />
                    <Bar dataKey="History" fill="#3b82f6" />
                    <Bar dataKey="Science" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Historical Cutoff Trend */}
            <div className="lg:col-span-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Official Cutoff Trends</span>
                </h3>
                <p className="text-xs text-slate-500">GS 1 Category Cutoff Marks out of 200</p>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cutoffTrendData}>
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="Cutoff" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-white block mb-0.5">Insight:</strong>
                Cutoff has stabilized around 75–88 marks due to increased difficulty in multi-statement options.
              </div>
            </div>

          </div>

          {/* High Yield Repeating Topics Heatmap */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <span>High-Yield Repeating Topic Themes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highYieldTopics.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.exam}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {item.count}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.topic}</h4>
                  <p className="text-xs text-slate-500">Weightage: {item.weightage}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 3: OFFICIAL SOLVED QUESTION BANK ================= */}
      {activeTab === 'repository' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400">Exam:</span>
                <select
                  value={selectedExam}
                  onChange={e => setSelectedExam(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700"
                >
                  {examsList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400">Year:</span>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700"
                >
                  {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-700"
                >
                  {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search PYQs..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* PYQ Questions List */}
          <div className="space-y-4">
            {pyqQuestions.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No official PYQs found for the selected filter combination.</p>
                <p className="text-xs">Try selecting "All" for Year or Subject filters.</p>
              </div>
            ) : (
              pyqQuestions.map((q, idx) => (
                <div key={q.id} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{q.exam}</span>
                      <span className="text-slate-400">• {q.subject}</span>
                      {q.year && <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">{q.year}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addBookmark({ id: q.id, title: `Q: ${q.question.slice(0, 40)}...`, type: 'question', category: q.subject })}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        title="Bookmark Question"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                    Q{idx + 1}. {q.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${
                          i === q.correctAnswer
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 font-bold text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt} {i === q.correctAnswer && '✓ (Official Key)'}
                      </div>
                    ))}
                  </div>

                  {/* Explanation Box */}
                  <div className="p-4 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 text-xs text-slate-700 dark:text-slate-200 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                    <strong className="text-indigo-900 dark:text-indigo-300 block">Official Explanation:</strong>
                    <p className="whitespace-pre-line">{q.explanation}</p>
                  </div>

                  {/* Ask AI Mentor CTA */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setCurrentPage('ai-assistant', { prompt: `Explain PYQ question: "${q.question}" with background history and key facts for ${q.exam}.` })}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI Tutor to break this down further →</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ================= TAB 4: TIMED PYQ PAPER TEST ================= */}
      {activeTab === 'test' && (
        <div className="space-y-6">
          
          {!isTestActive ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'UPSC CSE 2024 Prelims GS 1 (Full Paper)', exam: 'UPSC CSE', year: '2024', duration: '10 Mins', questions: 5, difficulty: 'Exam-level' },
                { name: 'UPSC CSE 2023 Prelims GS 1 (Full Paper)', exam: 'UPSC CSE', year: '2023', duration: '10 Mins', questions: 5, difficulty: 'Hard' },
                { name: 'SSC CGL Tier 1 Official 2024 (Quantitative Aptitude)', exam: 'SSC CGL', year: '2024', duration: '10 Mins', questions: 5, difficulty: 'Moderate' },
                { name: 'IBPS PO Prelims Official 2025 (English & Reasoning)', exam: 'IBPS PO', year: '2025', duration: '10 Mins', questions: 5, difficulty: 'Moderate' },
              ].map((paper, i) => (
                <div key={i} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{paper.exam} • {paper.year}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">{paper.difficulty}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{paper.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Timed environment with negative marking scoring.</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Duration: <strong className="text-indigo-600 dark:text-indigo-400">{paper.duration}</strong></span>
                    <span>Questions: <strong className="text-slate-900 dark:text-white">{paper.questions}</strong></span>
                  </div>

                  <button
                    onClick={() => handleStartTest(paper.name)}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Start Timed PYQ Test</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Active Test Header Bar */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <h2 className="font-bold text-sm text-slate-900 dark:text-white">{currentTestPaper}</h2>
                  <p className="text-xs text-slate-500">Official PYQ Practice Session</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span>10:00</span>
                  </div>

                  {!testSubmitted ? (
                    <button
                      onClick={() => setTestSubmitted(true)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                    >
                      Submit Paper
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTestActive(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold transition"
                    >
                      Exit Test
                    </button>
                  )}
                </div>
              </div>

              {/* Test Results Summary Box if Submitted */}
              {testSubmitted && (
                <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-white space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-emerald-400 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span>PYQ Test Score Analysis</span>
                    </h3>
                    <span className="text-xs text-emerald-300 font-bold bg-emerald-900/80 px-3 py-1 rounded-lg">
                      Score: {calculateTestScore().score} / 10 Marks
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div className="p-3 bg-emerald-900/40 rounded-lg border border-emerald-800/50">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">Correct</span>
                      <strong className="text-lg font-bold text-emerald-400">{calculateTestScore().correct}</strong>
                    </div>
                    <div className="p-3 bg-rose-900/40 rounded-lg border border-rose-800/50">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">Incorrect</span>
                      <strong className="text-lg font-bold text-rose-400">{calculateTestScore().incorrect}</strong>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">Attempted</span>
                      <strong className="text-lg font-bold text-white">{calculateTestScore().attempted} / 5</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions in Test */}
              <div className="space-y-6">
                {pyqQuestions.slice(0, 5).map((q, qIdx) => (
                  <div key={q.id} className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                      Q{qIdx + 1}. {q.question}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = testUserAnswers[qIdx] === oIdx;
                        const isCorrect = q.correctAnswer === oIdx;

                        let style = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                        if (isSelected && !testSubmitted) {
                          style = 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 font-bold text-indigo-700 dark:text-indigo-300';
                        } else if (testSubmitted) {
                          if (isCorrect) {
                            style = 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 font-bold text-emerald-800 dark:text-emerald-200';
                          } else if (isSelected && !isCorrect) {
                            style = 'bg-rose-50 dark:bg-rose-950 border-rose-500 font-bold text-rose-800 dark:text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                            className={`p-3 rounded-lg border text-left transition ${style}`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    {testSubmitted && (
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">Official Explanation:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
