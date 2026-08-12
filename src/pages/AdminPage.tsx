import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Plus, Users, Award, BookOpen, CheckCircle2 } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { addCurrentAffairsArticle, addQuestion } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'add-ca' | 'add-q'>('stats');

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
      keyFacts: ['Added by Administrator'],
      keywords: [caCategory],
      possibleMCQs: [],
      readTime: '5 Mins'
    });
    alert('Current Affairs Article Published!');
    setCaTitle('');
    setCaSummary('');
    setCaContent('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestion({
      id: `q-${Date.now()}`,
      subject: qSubject,
      topic: 'Admin Curated Topic',
      exam: 'UPSC & State PCS',
      difficulty: 'Medium',
      question: qText,
      options: [qOptA, qOptB, qOptC, qOptD],
      correctAnswer: Number(qCorrect),
      explanation: qExplanation
    });
    alert('Practice Question Published!');
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Management Portal</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">ExamNexus Admin Dashboard</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Monitor platform usage metrics, publish daily current affairs updates, and curate practice questions.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'stats', label: 'Platform Analytics' },
          { id: 'add-ca', label: 'Publish Current Affairs' },
          { id: 'add-q', label: 'Add Practice Question' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-xl transition ${
              activeTab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

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

      {activeTab === 'add-ca' && (
        <form onSubmit={handleAddCA} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Publish New Current Affairs Article</h2>

          <div className="space-y-1">
            <label className="font-bold">Article Title:</label>
            <input type="text" value={caTitle} onChange={e => setCaTitle(e.target.value)} required className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>

          <div className="space-y-1">
            <label className="font-bold">Category:</label>
            <select value={caCategory} onChange={e => setCaCategory(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <option value="Polity">Polity</option>
              <option value="Economy">Economy</option>
              <option value="National">National</option>
              <option value="Science">Science & Tech</option>
              <option value="Environment">Environment</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold">Summary:</label>
            <textarea value={caSummary} onChange={e => setCaSummary(e.target.value)} required rows={2} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>

          <div className="space-y-1">
            <label className="font-bold">Full Analysis Content:</label>
            <textarea value={caContent} onChange={e => setCaContent(e.target.value)} required rows={5} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>

          <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">Publish Article</button>
        </form>
      )}

      {activeTab === 'add-q' && (
        <form onSubmit={handleAddQuestion} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Practice MCQ</h2>

          <div className="space-y-1">
            <label className="font-bold">Subject:</label>
            <select value={qSubject} onChange={e => setQSubject(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <option value="Polity & Governance">Polity & Governance</option>
              <option value="Indian Economy">Indian Economy</option>
              <option value="Geography">Geography</option>
              <option value="History & Culture">History & Culture</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold">Question Text:</label>
            <textarea value={qText} onChange={e => setQText(e.target.value)} required rows={2} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Option A" value={qOptA} onChange={e => setQOptA(e.target.value)} required className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            <input type="text" placeholder="Option B" value={qOptB} onChange={e => setQOptB(e.target.value)} required className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            <input type="text" placeholder="Option C" value={qOptC} onChange={e => setQOptC(e.target.value)} required className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
            <input type="text" placeholder="Option D" value={qOptD} onChange={e => setQOptD(e.target.value)} required className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>

          <div className="space-y-1">
            <label className="font-bold">Correct Option Index:</label>
            <select value={qCorrect} onChange={e => setQCorrect(Number(e.target.value))} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <option value={0}>Option A</option>
              <option value={1}>Option B</option>
              <option value={2}>Option C</option>
              <option value={3}>Option D</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold">Detailed Explanation:</label>
            <textarea value={qExplanation} onChange={e => setQExplanation(e.target.value)} required rows={3} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
          </div>

          <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">Publish MCQ</button>
        </form>
      )}
    </div>
  );
};
