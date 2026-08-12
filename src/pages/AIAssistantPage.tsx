import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AIChatMessage } from '../types';
import { sendAIChatRequest } from '../services/aiService';
import { MarkdownView } from '../components/common/MarkdownView';
import { Bot, Send, Sparkles, User, RefreshCw, Copy, Check, BookOpen, Zap, Layers, HelpCircle } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { selectedExam, exams, setSelectedExamById, addNote, addFlashcard } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'ai',
      text: `Hello! I am your **ExamNexus AI Mentor** for **${selectedExam.name}**.

I can help you:
- **Explain complex topics** (e.g. *Article 21*, *Monetary Policy*, *Plate Tectonics*)
- **Generate Prelims MCQs & Mains practice questions**
- **Summarize current affairs** into exam notes
- **Build revision flashcards & mnemonics**

How can I assist your preparation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string, mode: string = 'explain') => {
    const textToSend = customPrompt || inputPrompt.trim();
    if (!textToSend || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsLoading(true);

    const history = messages
      .filter(m => m.id !== 'm-welcome')
      .map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        content: m.text
      }));

    const responseText = await sendAIChatRequest(textToSend, selectedExam.name, mode, history);

    const aiMsg: AIChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = (msg: AIChatMessage) => {
    addNote({
      title: `AI Note: ${msg.text.slice(0, 35)}...`,
      folder: selectedExam.shortName,
      tags: ['AI Generated', selectedExam.category],
      content: msg.text,
      isBookmarked: true
    });
    alert('Saved AI response to your Digital Notes!');
  };

  const samplePrompts = [
    'Explain Article 21 and Right to Life in simple language.',
    'Give me 5 UPSC Prelims level questions on Indian Constitution.',
    'Summarize today\'s high-yield current affairs points.',
    'Explain Inflation, CPI, and WPI with real examples.',
    'Create 5 revision flashcards for the French Revolution.'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] pb-4 space-y-4">
      
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI Study Mentor</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase font-black tracking-widest">
                Gemini 3.6
              </span>
            </h1>
            <p className="text-xs text-slate-500">Targeting {selectedExam.name}</p>
          </div>
        </div>

        {/* Target Exam Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Exam Context:</span>
          <select
            value={selectedExam.id}
            onChange={e => setSelectedExamById(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold text-slate-800 dark:text-slate-200 outline-none"
          >
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                msg.sender === 'user' ? 'bg-slate-800 dark:bg-slate-700' : 'bg-blue-600 shadow-md shadow-blue-500/20'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl shadow-sm text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
              }`}
            >
              <MarkdownView content={msg.text} />

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-blue-600 flex items-center gap-1 font-semibold"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleSaveToNotes(msg)}
                      className="hover:text-blue-600 flex items-center gap-1 font-semibold"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Save to Notes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-blue-600 dark:text-blue-400 font-bold p-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>AI Mentor is analyzing syllabus & generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Starter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs shrink-0">
        <span className="font-bold text-slate-400 shrink-0">Quick Prompts:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 shrink-0 transition font-medium text-[11px]"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="relative shrink-0"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          placeholder={`Ask AI anything regarding ${selectedExam.shortName} syllabus, questions, or concepts...`}
          className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 shadow-lg transition"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
