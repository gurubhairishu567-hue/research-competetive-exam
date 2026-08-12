import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, BookOpen, FileText, HelpCircle, Newspaper, ArrowRight, Compass } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { searchQuery, setSearchQuery, setCurrentPage, exams, currentAffairs, questions, notes, setSelectedExamById } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const query = searchQuery.toLowerCase().trim();

  // Filter items
  const filteredExams = exams.filter(e =>
    !query || e.name.toLowerCase().includes(query) || e.subjects.some(s => s.toLowerCase().includes(query)) || e.category.toLowerCase().includes(query)
  );

  const filteredCurrentAffairs = currentAffairs.filter(ca =>
    !query || ca.title.toLowerCase().includes(query) || ca.summary.toLowerCase().includes(query) || ca.category.toLowerCase().includes(query) || ca.keywords.some(k => k.toLowerCase().includes(query))
  );

  const filteredQuestions = questions.filter(q =>
    !query || q.question.toLowerCase().includes(query) || q.subject.toLowerCase().includes(query) || q.topic.toLowerCase().includes(query)
  );

  const filteredNotes = notes.filter(n =>
    !query || n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query) || n.folder.toLowerCase().includes(query)
  );

  const categories = ['All', 'Exams', 'Current Affairs', 'Questions', 'Notes', 'Government Schemes', 'Reports'];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Search Header Input */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <span>Universal Educational Search</span>
        </h1>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search exams, current affairs, polity, GDP, questions, notes, schemes..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Overview count */}
      <div className="text-xs text-slate-500 font-medium px-1">
        Showing search results for <strong className="text-slate-900 dark:text-white">"{searchQuery || 'All Content'}"</strong>
      </div>

      {/* Result Cards Grid */}
      <div className="space-y-8">
        
        {/* Exams Results */}
        {(activeCategory === 'All' || activeCategory === 'Exams') && filteredExams.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Examinations ({filteredExams.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExams.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => {
                    setSelectedExamById(ex.id);
                    setCurrentPage('exam-detail', { examId: ex.id });
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {ex.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{ex.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{ex.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Current Affairs Results */}
        {(activeCategory === 'All' || activeCategory === 'Current Affairs' || activeCategory === 'Government Schemes') && filteredCurrentAffairs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Newspaper className="w-4 h-4 text-blue-600" />
              <span>Current Affairs & Schemes ({filteredCurrentAffairs.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCurrentAffairs.map(ca => (
                <div
                  key={ca.id}
                  onClick={() => setCurrentPage('current-affairs', { articleId: ca.id })}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition cursor-pointer space-y-2"
                >
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="font-bold text-blue-600">{ca.category}</span>
                    <span>{ca.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{ca.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{ca.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Practice Questions Results */}
        {(activeCategory === 'All' || activeCategory === 'Questions') && filteredQuestions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Questions & PYQs ({filteredQuestions.length})</span>
            </h2>

            <div className="space-y-3">
              {filteredQuestions.map(q => (
                <div
                  key={q.id}
                  onClick={() => setCurrentPage('mcq-practice', { questionId: q.id })}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition cursor-pointer space-y-2"
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-bold text-indigo-600">{q.subject} • {q.topic}</span>
                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-bold text-slate-600 dark:text-slate-300">{q.exam}</span>
                  </div>
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-2">{q.question}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Digital Notes Results */}
        {(activeCategory === 'All' || activeCategory === 'Notes') && filteredNotes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Digital Study Notes ({filteredNotes.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setCurrentPage('notes', { noteId: n.id })}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition cursor-pointer space-y-2"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {n.folder}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{n.content.replace(/#/g, '')}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
};
