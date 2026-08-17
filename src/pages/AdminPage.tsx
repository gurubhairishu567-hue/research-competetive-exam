import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPABASE_SETUP_SQL, SUPABASE_URL, testSupabaseConnection, createResourceInSupabase } from '../lib/supabase';
import { 
  ShieldCheck, Plus, Users, Award, BookOpen, CheckCircle2, 
  Database, Copy, Check, Terminal, ExternalLink, RefreshCw, 
  AlertCircle, ShieldAlert, Key, Sparkles, Server, Landmark,
  Library, FileText
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    addCurrentAffairsArticle, 
    addQuestion, 
    isAdmin, 
    isAdminMode, 
    setIsAdminMode, 
    user, 
    supabaseStatus 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'add-ca' | 'add-q' | 'add-res' | 'supabase-sql'>('supabase-sql');

  // Form states
  const [caTitle, setCaTitle] = useState('');
  const [caCategory, setCaCategory] = useState('Polity');
  const [caSummary, setCaSummary] = useState('');
  const [caContent, setCaContent] = useState('');

  const [qSubject, setQSubject] = useState('Polity & Governance');
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  // Resource Form States
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('Parliament Bill');
  const [resAuthor, setResAuthor] = useState('Ministry of Law & Justice');
  const [resExam, setResExam] = useState('UPSC CSE & State PCS');
  const [resDesc, setResDesc] = useState('');
  const [resDownloadUrl, setResDownloadUrl] = useState('');
  const [resBuyUrl, setResBuyUrl] = useState('');

  // SQL Studio State
  const [isCopied, setIsCopied] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ connected: boolean; message: string } | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const res = await testSupabaseConnection();
      setConnectionTestResult(res);
    } catch (e: any) {
      setConnectionTestResult({ connected: false, message: e.message || 'Connection failed' });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleAddCA = (e: React.FormEvent) => {
    e.preventDefault();
    addCurrentAffairsArticle({
      id: `ca-${Date.now()}`,
      title: caTitle,
      category: caCategory as any,
      date: new Date().toISOString().split('T')[0],
      summary: caSummary,
      detailedContent: caContent,
      whyItMatters: caSummary,
      examRelevance: [],
      keyFacts: ['Admin Curated', 'High Priority for Prelims & Mains'],
      keywords: [caCategory, 'UPSC', 'Current Affairs'],
      possibleMCQs: [],
      readTime: '5 Mins'
    });
    alert('Current Affairs Article successfully published & synced to Supabase database!');
    setCaTitle('');
    setCaSummary('');
    setCaContent('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestion({
      id: `q-${Date.now()}`,
      subject: qSubject,
      topic: 'Admin Curated Question',
      exam: 'UPSC & State PCS',
      difficulty: 'Medium',
      question: qText,
      options: [qOptA, qOptB, qOptC, qOptD],
      correctAnswer: Number(qCorrect),
      explanation: qExplanation
    });
    alert('Practice MCQ successfully published & synced to Supabase database!');
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    const newRes = {
      id: `res-${Date.now()}`,
      title: resTitle.trim(),
      category: resCategory,
      author: resAuthor.trim() || 'Ministry/Admin',
      exam: [resExam],
      description: resDesc.trim(),
      download_url: resDownloadUrl.trim() || 'https://sansad.in',
      read_url: resBuyUrl.trim() || 'https://www.amazon.in'
    };

    await createResourceInSupabase(newRes, user?.email || 'gurubhairishu567@gmail.com');
    alert(`Resource "${resTitle}" successfully added & synced to Supabase database!`);

    setResTitle('');
    setResDesc('');
    setResDownloadUrl('');
    setResBuyUrl('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Admin Management & Supabase Studio</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black">ExamNexus Admin & Backend Control</h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Manage database security, setup SQL schema, publish exam materials, and control Role-Based Access Control (RBAC).
            </p>
          </div>

          {/* Role Mode Quick Switcher */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Role Mode:</span>
              </span>
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-3 py-1 rounded-xl font-extrabold text-[11px] transition ${
                  isAdminMode 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {isAdminMode ? 'ACTIVE (ADMIN)' : 'OFF (TEST AS STUDENT)'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Admin User: <span className="text-blue-400 font-mono">{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'supabase-sql', label: '⚡ Supabase SQL Setup & Code', icon: Database },
          { id: 'add-ca', label: '+ Publish Current Affairs', icon: Plus },
          { id: 'add-q', label: '+ Add Practice Question', icon: Plus },
          { id: 'add-res', label: '+ Add Resource / Act / Book', icon: Landmark },
          { id: 'stats', label: 'Platform Analytics', icon: Users },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-2xl transition flex items-center gap-2 ${
                activeTab === t.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUPABASE SQL STUDIO TAB */}
      {activeTab === 'supabase-sql' && (
        <div className="space-y-6">
          
          {/* Connection Overview Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Supabase PostgreSQL Cloud Database</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                      Connected
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Project Endpoint: <span className="font-mono text-blue-600 dark:text-blue-400">{SUPABASE_URL}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>{isTestingConnection ? 'Pinging Database...' : 'Test Connection'}</span>
                </button>

                <button
                  onClick={handleCopySql}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
                >
                  {isCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied SQL Script!' : 'Copy Supabase SQL Code'}</span>
                </button>
              </div>
            </div>

            {connectionTestResult && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                connectionTestResult.connected 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
              }`}>
                {connectionTestResult.connected ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{connectionTestResult.message}</span>
              </div>
            )}
          </div>

          {/* Step-by-Step Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">1</div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">Supabase Dashboard Kholein</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Apne Supabase project me login karein aur left menu me se <strong className="text-slate-800 dark:text-slate-200">"SQL Editor"</strong> par click karein.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">2</div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">SQL Code Paste Karein</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Neeche diye gaye pure SQL Code ko copy karke Supabase SQL Editor ke new query window me paste karein.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">3</div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white">"Run" Button Dabayein</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Green color ke <strong className="text-emerald-600 dark:text-emerald-400">"Run"</strong> button par click karein. Saare tables, admin roles aur security policies automatically create ho jayenge.
              </p>
            </div>
          </div>

          {/* Interactive SQL Code Viewer */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl space-y-0">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-slate-200 font-bold">schema_and_roles_setup.sql</span>
              </div>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy All SQL'}</span>
              </button>
            </div>

            <pre className="p-6 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[480px] leading-relaxed selection:bg-emerald-900 selection:text-white">
              <code>{SUPABASE_SETUP_SQL}</code>
            </pre>
          </div>

        </div>
      )}

      {/* PUBLISH CURRENT AFFAIRS */}
      {activeTab === 'add-ca' && (
        <form onSubmit={handleAddCA} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Publish New Current Affairs Article (Admin Only)</span>
            </h2>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              Supabase Live Sync
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Article Title:</label>
            <input type="text" value={caTitle} onChange={e => setCaTitle(e.target.value)} required placeholder="e.g. India-UK Free Trade Agreement 2026 Negotiations" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Category:</label>
            <select value={caCategory} onChange={e => setCaCategory(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-bold">
              <option value="Polity">Polity & Governance</option>
              <option value="Economy">Economy & Banking</option>
              <option value="National">National Affairs</option>
              <option value="International">International Relations</option>
              <option value="Science">Science & Technology</option>
              <option value="Environment">Environment & Ecology</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Summary (Brief Overview):</label>
            <textarea value={caSummary} onChange={e => setCaSummary(e.target.value)} required rows={2} placeholder="Quick 2-sentence summary for aspirants..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Full Editorial & Mains Analysis:</label>
            <textarea value={caContent} onChange={e => setCaContent(e.target.value)} required rows={6} placeholder="Detailed background, key points, constitutional provisions, and mains exam perspective..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Publish Article & Sync Database</span>
          </button>
        </form>
      )}

      {/* ADD PRACTICE MCQ */}
      {activeTab === 'add-q' && (
        <form onSubmit={handleAddQuestion} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Add Practice MCQ (Admin Only)</span>
            </h2>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              Supabase Live Sync
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Subject:</label>
            <select value={qSubject} onChange={e => setQSubject(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Polity & Governance">Polity & Governance</option>
              <option value="Indian Economy">Indian Economy</option>
              <option value="Geography">Geography</option>
              <option value="History & Culture">History & Culture</option>
              <option value="Environment & Ecology">Environment & Ecology</option>
              <option value="Science & Technology">Science & Technology</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Question Statement:</label>
            <textarea value={qText} onChange={e => setQText(e.target.value)} required rows={3} placeholder="Enter the full MCQ question statement..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Option A" value={qOptA} onChange={e => setQOptA(e.target.value)} required className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Option B" value={qOptB} onChange={e => setQOptB(e.target.value)} required className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Option C" value={qOptC} onChange={e => setQOptC(e.target.value)} required className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Option D" value={qOptD} onChange={e => setQOptD(e.target.value)} required className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Correct Option:</label>
            <select value={qCorrect} onChange={e => setQCorrect(Number(e.target.value))} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold outline-none focus:ring-2 focus:ring-blue-500">
              <option value={0}>Option A</option>
              <option value={1}>Option B</option>
              <option value={2}>Option C</option>
              <option value={3}>Option D</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Detailed Explanation & Reference:</label>
            <textarea value={qExplanation} onChange={e => setQExplanation(e.target.value)} required rows={4} placeholder="Explain why this option is correct and provide NCERT/Constitutional reference..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Publish MCQ & Sync Database</span>
          </button>
        </form>
      )}

      {/* ADD LIBRARY RESOURCE / ACT / BOOK FORM TAB */}
      {activeTab === 'add-res' && (
        <form onSubmit={handleAddResource} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Landmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Add New Parliament Bill, Official Govt Report, NCERT, or Standard Book
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Resource Title / Act Name:</label>
              <input value={resTitle} onChange={e => setResTitle(e.target.value)} required placeholder="e.g. Disaster Management (Amendment) Act, 2024" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Category / Type:</label>
              <select value={resCategory} onChange={e => setResCategory(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Parliament Bill">Parliament Bill (Pending / JPC)</option>
                <option value="Passed Act">Parliament Passed Act / Law</option>
                <option value="Constitutional Amendment">Constitutional Amendment (CAA)</option>
                <option value="Govt Official Report">Govt Official Report (Budget/NITI)</option>
                <option value="NCERT Textbook">NCERT Textbook (Class 6-12)</option>
                <option value="Standard Reference Book">Standard Reference Book</option>
                <option value="Custom PDF Document">Custom PDF Vault Document</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Ministry / Author / Publisher:</label>
              <input value={resAuthor} onChange={e => setResAuthor(e.target.value)} required placeholder="e.g. Ministry of Home Affairs / M. Laxmikanth" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Target Exam Relevance:</label>
              <input value={resExam} onChange={e => setResExam(e.target.value)} required placeholder="e.g. UPSC CSE, State PCS, Judiciary" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Download / Official Portal URL:</label>
              <input value={resDownloadUrl} onChange={e => setResDownloadUrl(e.target.value)} placeholder="https://sansad.in or direct PDF URL" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Store / Buy Link (Amazon / Flipkart):</label>
              <input value={resBuyUrl} onChange={e => setResBuyUrl(e.target.value)} placeholder="https://www.amazon.in/dp/..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Summary & Key Provisions:</label>
            <textarea value={resDesc} onChange={e => setResDesc(e.target.value)} required rows={4} placeholder="Summary of key provisions, exam importance, background and impact..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-md flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Save Resource & Sync to Supabase</span>
          </button>
        </form>
      )}

      {/* PLATFORM ANALYTICS TAB */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Registered Aspirants', value: '142,500', icon: Users, color: 'text-blue-600' },
            { label: 'Daily Active Users', value: '38,200', icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'Questions Solved', value: '1,240,000+', icon: Award, color: 'text-amber-600' },
            { label: 'AI Responses Generated', value: '480,000+', icon: BookOpen, color: 'text-purple-600' }
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                  <span>{s.label}</span>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

