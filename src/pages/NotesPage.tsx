import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';
import { performAINoteAction } from '../services/aiService';
import { MarkdownView } from '../components/common/MarkdownView';
import { BookOpenText, Plus, Folder, Sparkles, Trash2, Edit3, Bookmark, Search, RefreshCw } from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, addFlashcard } = useApp();

  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(notes[0] || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formFolder, setFormFolder] = useState('Polity');
  const [formContent, setFormContent] = useState('');

  const folders = ['All', 'Polity', 'Economy', 'History', 'Research Briefs'];

  const filteredNotes = notes.filter(n => {
    if (selectedFolder !== 'All' && n.folder !== selectedFolder) return false;
    return true;
  });

  const handleSaveNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    addNote({
      title: formTitle.trim(),
      folder: formFolder,
      tags: [formFolder, 'Personal'],
      content: formContent,
      isBookmarked: false
    });

    setShowCreateModal(false);
    setFormTitle('');
    setFormContent('');
  };

  const handleAIAction = async (action: 'summarize' | 'improve' | 'flashcards') => {
    if (!selectedNote || isAIProcessing) return;
    setIsAIProcessing(true);

    const result = await performAINoteAction(action, selectedNote.content);

    if (action === 'flashcards') {
      try {
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed)) {
          parsed.forEach((fc: any) => {
            addFlashcard({
              front: fc.front,
              back: fc.back,
              category: selectedNote.folder,
              difficulty: 'Medium'
            });
          });
          alert(`Generated ${parsed.length} Flashcards and added to your Deck!`);
        }
      } catch {
        alert('Flashcards generated in text format.');
      }
    } else {
      updateNote(selectedNote.id, { content: result });
      setSelectedNote({ ...selectedNote, content: result });
    }

    setIsAIProcessing(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <BookOpenText className="w-4 h-4" />
            <span>Structured Digital Library</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Digital Study Notes</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Create, organize into subject folders, and refine your study material using integrated Gemini AI note actions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Main Grid Layout: Folders + Note List (1 col) and Note Reader (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Notes List Sidebar */}
        <div className="space-y-4">
          
          {/* Folders Bar */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-xs">
            {folders.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFolder(f)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                  selectedFolder === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notes Cards List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map(n => (
              <div
                key={n.id}
                onClick={() => setSelectedNote(n)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition space-y-2 ${
                  selectedNote?.id === n.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 font-semibold text-blue-900 dark:text-blue-100 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{n.folder}</span>
                  <span>{n.createdAt}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{n.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{n.content.replace(/#/g, '')}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Right Note Detail View */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase">
                    {selectedNote.folder}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">{selectedNote.title}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      deleteNote(selectedNote.id);
                      setSelectedNote(null);
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Note Action Toolbar */}
              <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Note Tools:</span>
                </span>

                <button
                  onClick={() => handleAIAction('summarize')}
                  disabled={isAIProcessing}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-100 text-slate-800 dark:text-slate-200 font-semibold border border-blue-200/80 dark:border-blue-800 transition"
                >
                  {isAIProcessing ? 'Processing...' : 'Summarize Note'}
                </button>

                <button
                  onClick={() => handleAIAction('improve')}
                  disabled={isAIProcessing}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-100 text-slate-800 dark:text-slate-200 font-semibold border border-blue-200/80 dark:border-blue-800 transition"
                >
                  {isAIProcessing ? 'Processing...' : 'Improve & Format'}
                </button>

                <button
                  onClick={() => handleAIAction('flashcards')}
                  disabled={isAIProcessing}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
                >
                  {isAIProcessing ? 'Processing...' : 'Generate Flashcards'}
                </button>
              </div>

              {/* Note Markdown Content */}
              <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                <MarkdownView content={selectedNote.content} />
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
              Select a note from the list to read or edit.
            </div>
          )}
        </div>

      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form onSubmit={handleSaveNewNote} className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Create Digital Note</h3>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">Note Title:</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. Fundamental Rights Notes"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
                required
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">Subject Folder:</label>
              <select
                value={formFolder}
                onChange={e => setFormFolder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="Polity">Polity & Governance</option>
                <option value="Economy">Indian Economy</option>
                <option value="History">History & Culture</option>
                <option value="Geography">Geography</option>
                <option value="Research Briefs">Research Briefs</option>
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">Note Content (Markdown supported):</label>
              <textarea
                value={formContent}
                onChange={e => setFormContent(e.target.value)}
                rows={6}
                placeholder="Type or paste your study notes..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none resize-none font-mono text-xs"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
