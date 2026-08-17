import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';
import { performAINoteAction, generateAITopicNote } from '../services/aiService';
import { MarkdownView } from '../components/common/MarkdownView';
import { 
  BookOpenText, Plus, Folder, Sparkles, Trash2, Edit3, Bookmark, Search, 
  RefreshCw, FolderPlus, Download, Copy, Check, FileText, Zap, ChevronRight, 
  Filter, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';

const RECOMMENDED_SYLLABUS_TOPICS: { topic: string; folder: string }[] = [
  // Polity
  { topic: 'Preamble & Constitutional Philosophy', folder: 'Polity & Governance' },
  { topic: 'Parliamentary Committees & Audit Systems', folder: 'Polity & Governance' },
  { topic: 'Federal Structure & Inter-State Council', folder: 'Polity & Governance' },
  { topic: 'Constitutional & Non-Constitutional Bodies (UPSC, CAG, ECI, NITI Aayog)', folder: 'Polity & Governance' },
  { topic: 'Article 370 & J&K Reorganisation Act Analysis', folder: 'Polity & Governance' },
  
  // Economy
  { topic: 'GST Council & Fiscal Federalism Structure', folder: 'Indian Economy' },
  { topic: 'NPA Crisis & Insolvency and Bankruptcy Code (IBC)', folder: 'Indian Economy' },
  { topic: 'External Sector & Balance of Payments (BoP) Dynamics', folder: 'Indian Economy' },
  { topic: 'Inflation Targeting & CPI vs WPI Price Metrics', folder: 'Indian Economy' },
  { topic: 'Priority Sector Lending (PSL) Norms & Nabard Guidelines', folder: 'Indian Economy' },

  // History
  { topic: 'Indus Valley Civilization Urbanism & Trade Networks', folder: 'History & Culture' },
  { topic: 'Bhakti-Sufi Movements & Vernacular Literature Traditions', folder: 'History & Culture' },
  { topic: 'Peasant & Tribal Uprisings in 19th Century British India', folder: 'History & Culture' },
  { topic: 'Socio-Religious Reform Movements of 19th Century', folder: 'History & Culture' },
  { topic: 'Subhash Chandra Bose & INA Freedom Movement', folder: 'History & Culture' },

  // Geography
  { topic: 'Indian Monsoon Mechanism & Jet Stream Oscillations', folder: 'Geography' },
  { topic: 'Plate Tectonics & Himalayan Mountain Orogeny', folder: 'Geography' },
  { topic: 'Himalayan vs Peninsular River Systems & Drainage Patterns', folder: 'Geography' },
  { topic: 'Soil Types & Agro-Climatic Regions in India', folder: 'Geography' },

  // Environment
  { topic: 'Biodiversity Hotspots & Ramsar Wetland Sites in India', folder: 'Environment & Ecology' },
  { topic: 'COP Climate Summits & Loss and Damage Fund Framework', folder: 'Environment & Ecology' },
  { topic: 'Environmental Protection Act 1986 & NGT Functions', folder: 'Environment & Ecology' },
  { topic: 'Carbon Credit Trading Scheme (CCTS) Mandates', folder: 'Environment & Ecology' },

  // Science & Tech
  { topic: 'ISRO Gaganyaan & Chandrayaan Deep Space Exploration', folder: 'Science & Technology' },
  { topic: 'CRISPR-Cas9 & Gene Editing Protocols in Healthcare', folder: 'Science & Technology' },
  { topic: 'India Semiconductor Mission & Microchip Fabrication', folder: 'Science & Technology' },
  { topic: 'NavIC & Indigenous Satellite Navigation Systems', folder: 'Science & Technology' },

  // Current Affairs & IR
  { topic: 'India Stack & Digital Public Infrastructure Global Model', folder: 'Current Affairs & IR' },
  { topic: 'Quad Alliance & Indo-Pacific Maritime Security Strategy', folder: 'Current Affairs & IR' },
  { topic: 'G20 New Delhi Leaders Declaration & Global South Priorities', folder: 'Current Affairs & IR' },
  { topic: 'Red Sea Maritime Security & Global Supply Chain Impact', folder: 'Current Affairs & IR' },

  // Ethics
  { topic: 'Foundational Values for Civil Services & Governance Integrity', folder: 'Ethics & Governance' },
  { topic: 'Ethical Dilemmas in Public Administration & Moral Reasoning', folder: 'Ethics & Governance' },
  { topic: 'Probity in Governance & Right to Information (RTI) Execution', folder: 'Ethics & Governance' }
];

export const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, addFlashcard, user } = useApp();

  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(notes[0] || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);

  // AI Generation State
  const [aiTopicInput, setAiTopicInput] = useState<string>('');
  const [aiFolderSelect, setAiFolderSelect] = useState<string>('Polity & Governance');
  const [isGeneratingNote, setIsGeneratingNote] = useState<boolean>(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  // Custom Folder State
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [newFolderNameInput, setNewFolderNameInput] = useState<string>('');
  const [showAddFolderModal, setShowAddFolderModal] = useState<boolean>(false);

  // Create Manual Note Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState('');
  const [formFolder, setFormFolder] = useState('Polity & Governance');
  const [formContent, setFormContent] = useState('');

  // AI Actions Processing State
  const [isAIProcessing, setIsAIProcessing] = useState<boolean>(false);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Compute list of unique subject folders
  const allFolders = useMemo(() => {
    const baseFolders = [
      'All',
      'Polity & Governance',
      'Indian Economy',
      'History & Culture',
      'Geography',
      'Environment & Ecology',
      'Science & Technology',
      'Current Affairs & IR',
      'Ethics & Governance',
      'Research Briefs'
    ];
    // Gather any extra folder from existing notes or custom list
    const existingInNotes = notes.map(n => n.folder);
    const combined = Array.from(new Set([...baseFolders, ...existingInNotes, ...customFolders]));
    return combined;
  }, [notes, customFolders]);

  // Folder Counts
  const folderNoteCounts = useMemo(() => {
    const counts: Record<string, number> = { All: notes.length };
    notes.forEach(n => {
      counts[n.folder] = (counts[n.folder] || 0) + 1;
    });
    return counts;
  }, [notes]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      if (selectedFolder !== 'All' && n.folder !== selectedFolder) return false;
      if (showOnlyBookmarked && !n.isBookmarked) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesContent = n.content.toLowerCase().includes(q);
        const matchesFolder = n.folder.toLowerCase().includes(q);
        const matchesTags = n.tags.some(t => t.toLowerCase().includes(q));
        return matchesTitle || matchesContent || matchesFolder || matchesTags;
      }
      return true;
    });
  }, [notes, selectedFolder, showOnlyBookmarked, searchQuery]);

  // Keep selectedNote valid if filtered list changes
  React.useEffect(() => {
    if (filteredNotes.length > 0) {
      if (!selectedNote || !filteredNotes.some(n => n.id === selectedNote.id)) {
        setSelectedNote(filteredNotes[0]);
      }
    } else {
      setSelectedNote(null);
    }
  }, [filteredNotes]);

  // Handle single AI Note Generation
  const handleGenerateSingleNote = async (topicToGenerate?: string, folderToUse?: string) => {
    const topic = topicToGenerate || aiTopicInput.trim();
    const folder = folderToUse || aiFolderSelect;

    if (!topic) {
      alert('Please enter or select a topic to generate digital notes.');
      return;
    }

    setIsGeneratingNote(true);
    try {
      const generated = await generateAITopicNote(topic, folder, user.targetExam || 'UPSC Civil Services');
      
      const todayStr = new Date().toISOString().split('T')[0];
      const newNoteData = {
        title: generated.title || topic,
        folder: generated.folder || folder,
        tags: generated.tags || [folder, 'AI Digital Note', 'Topicwise'],
        content: generated.content,
        isBookmarked: false
      };

      addNote(newNoteData);
      setSelectedFolder(folder);
      setSelectedNote({
        ...newNoteData,
        id: `note-ai-${Date.now()}`,
        createdAt: todayStr,
        updatedAt: todayStr
      });
      setAiTopicInput('');
    } catch (err: any) {
      alert(`Failed to generate digital note: ${err.message || err}`);
    } finally {
      setIsGeneratingNote(false);
    }
  };

  // Handle Batch Auto-Generation of Topicwise Notes for ALL Topics
  const handleBatchGenerateAllTopics = async () => {
    if (isBatchGenerating) return;

    if (!window.confirm('This will automatically generate structured AI Digital Notes for ALL core syllabus topics across all subject folders. Continue?')) {
      return;
    }

    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: RECOMMENDED_SYLLABUS_TOPICS.length });

    let addedCount = 0;

    for (let i = 0; i < RECOMMENDED_SYLLABUS_TOPICS.length; i++) {
      const item = RECOMMENDED_SYLLABUS_TOPICS[i];
      setBatchProgress({ current: i + 1, total: RECOMMENDED_SYLLABUS_TOPICS.length });

      // Check if note for this topic already exists
      const existing = notes.some(n => n.title.toLowerCase().includes(item.topic.toLowerCase()));
      if (!existing) {
        try {
          const generated = await generateAITopicNote(item.topic, item.folder, user.targetExam || 'UPSC Civil Services');
          addNote({
            title: generated.title || item.topic,
            folder: generated.folder || item.folder,
            tags: generated.tags || [item.folder, 'AI Digital Note', 'Topicwise'],
            content: generated.content,
            isBookmarked: false
          });
          addedCount++;
        } catch (e) {
          console.warn(`Failed batch generation for ${item.topic}:`, e);
        }
      }
    }

    setIsBatchGenerating(false);
    alert(`Successfully generated and added ${addedCount} AI Digital Notes into subject folders!`);
  };

  // Handle Adding New Digital Folder
  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderNameInput.trim()) return;

    const trimmed = newFolderNameInput.trim();
    if (!customFolders.includes(trimmed)) {
      setCustomFolders([...customFolders, trimmed]);
    }
    setSelectedFolder(trimmed);
    setNewFolderNameInput('');
    setShowAddFolderModal(false);
  };

  // Save Manual Note
  const handleSaveNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newNoteData = {
      title: formTitle.trim(),
      folder: formFolder,
      tags: [formFolder, 'Personal Note'],
      content: formContent,
      isBookmarked: false
    };

    addNote(newNoteData);
    setSelectedFolder(formFolder);
    setSelectedNote({
      ...newNoteData,
      id: `note-user-${Date.now()}`,
      createdAt: todayStr,
      updatedAt: todayStr
    });

    setShowCreateModal(false);
    setFormTitle('');
    setFormContent('');
  };

  // Toggle Bookmark
  const handleToggleBookmark = (noteId: string) => {
    const target = notes.find(n => n.id === noteId);
    if (!target) return;
    const newStatus = !target.isBookmarked;
    updateNote(noteId, { isBookmarked: newStatus });
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote({ ...selectedNote, isBookmarked: newStatus });
    }
  };

  // Copy Note Content
  const handleCopyContent = (note: NoteItem) => {
    navigator.clipboard.writeText(note.content);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Download Note as Markdown File
  const handleDownloadMarkdown = (note: NoteItem) => {
    const element = document.createElement("a");
    const file = new Blob([note.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // AI Note Actions (Summarize, Improve, Flashcards)
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
          alert(`Generated ${parsed.length} Flashcards and added to your Revision Deck!`);
        }
      } catch {
        alert('Flashcards generated in text format in notes.');
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
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-700/50">
            <BookOpenText className="w-4 h-4 text-blue-400" />
            <span>AI Digital Library & Folder System</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Topic-Wise AI Digital Notes</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Automatically generate comprehensive, topicwise digital study notes with Gemini AI and organize them into subject folders for rapid revision.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setShowAddFolderModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 backdrop-blur-sm"
          >
            <FolderPlus className="w-4 h-4 text-emerald-400" />
            <span>+ New Digital Folder</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write Manual Note</span>
          </button>
        </div>
      </div>

      {/* AI DIGITAL NOTES GENERATION STUDIO */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>⚡ AI Digital Note Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase">
                  Gemini Grounded
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate topicwise digital study notes for any syllabus topic and save directly to digital folders
              </p>
            </div>
          </div>

          <button
            onClick={handleBatchGenerateAllTopics}
            disabled={isBatchGenerating}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>{isBatchGenerating ? `Generating (${batchProgress.current}/${batchProgress.total})...` : '🚀 Auto-Generate All Topicwise Notes'}</span>
          </button>
        </div>

        {/* Input & Folder Selector Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Enter Syllabus Topic:</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">e.g. Fundamental Rights, GST Council, ISRO Missions</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={aiTopicInput}
                onChange={e => setAiTopicInput(e.target.value)}
                placeholder="Type any topic (e.g., Article 370, Monsoon System, Gene Editing)..."
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <Sparkles className="w-4 h-4 text-blue-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Target Digital Folder:
            </label>
            <select
              value={aiFolderSelect}
              onChange={e => setAiFolderSelect(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {allFolders.filter(f => f !== 'All').map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={() => handleGenerateSingleNote()}
              disabled={isGeneratingNote || !aiTopicInput.trim()}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {isGeneratingNote ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Note</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Topic Chips for 1-Click Note Generation */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Recommended Syllabus Topics (Click to Auto-Generate AI Note):</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
            {RECOMMENDED_SYLLABUS_TOPICS.map((item, idx) => {
              const isAdded = notes.some(n => n.title.toLowerCase().includes(item.topic.toLowerCase()));
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setAiTopicInput(item.topic);
                    setAiFolderSelect(item.folder);
                    handleGenerateSingleNote(item.topic, item.folder);
                  }}
                  disabled={isGeneratingNote}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 ${
                    isAdded
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:border-blue-400'
                  }`}
                >
                  {isAdded ? <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> : <Plus className="w-3 h-3 text-blue-500 shrink-0" />}
                  <span className="truncate max-w-[200px]">{item.topic}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">{item.folder.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DIGITAL FOLDERS BAR + SEARCH TOOLBAR */}
      <div className="space-y-4">
        
        {/* Digital Folders Chips Horizontal Bar */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-500" />
              <span>Digital Subject Folders ({allFolders.length - 1} Folders):</span>
            </span>

            <button
              onClick={() => setShowAddFolderModal(true)}
              className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Add Custom Folder</span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {allFolders.map(f => {
              const count = folderNoteCounts[f] || 0;
              const isSelected = selectedFolder === f;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={`px-3.5 py-2 rounded-xl font-bold shrink-0 transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                  <span>{f}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search digital notes by title, keyword, folder or tag..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                showOnlyBookmarked
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>Bookmarked Only</span>
            </button>

            <span className="text-slate-400 font-bold">
              Showing {filteredNotes.length} notes
            </span>
          </div>
        </div>

      </div>

      {/* MAIN TWO-COLUMN LAYOUT: NOTE LIST + READER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Notes Cards List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Folder: {selectedFolder} ({filteredNotes.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNote(n)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition space-y-2 relative group ${
                    selectedNote?.id === n.id
                      ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 font-semibold text-blue-900 dark:text-blue-100 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Folder className="w-3 h-3 text-amber-500" />
                      <span>{n.folder}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span>{n.createdAt}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(n.id);
                        }}
                        className="p-1 hover:text-amber-500 transition"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${n.isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {n.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {n.content.replace(/#/g, '').replace(/>/g, '').substring(0, 120)}...
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {n.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-xs">No digital notes found in "{selectedFolder}".</p>
                <p className="text-[11px]">Use the AI Studio above to generate notes for this folder!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Note Detail View */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              
              {/* Note Header & Folder Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1">
                      <Folder className="w-3 h-3 text-amber-500" />
                      <span>{selectedNote.folder}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Updated: {selectedNote.updatedAt}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedNote.title}
                  </h2>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBookmark(selectedNote.id)}
                    className={`p-2 rounded-xl transition ${
                      selectedNote.isBookmarked
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800'
                    }`}
                    title="Bookmark Note"
                  >
                    <Bookmark className={`w-4 h-4 ${selectedNote.isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopyContent(selectedNote)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                    title="Copy Note Text"
                  >
                    {copiedNoteId === selectedNote.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDownloadMarkdown(selectedNote)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                    title="Download .md File"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Delete this note permanently?')) {
                        deleteNote(selectedNote.id);
                        setSelectedNote(null);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 hover:bg-rose-100 transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Note Refinement Action Toolbar */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Gemini AI Refinement Tools:</span>
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleAIAction('summarize')}
                    disabled={isAIProcessing}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-100 text-slate-800 dark:text-slate-200 font-bold border border-blue-200/80 dark:border-blue-800 transition"
                  >
                    {isAIProcessing ? 'Processing...' : 'Summarize Note'}
                  </button>

                  <button
                    onClick={() => handleAIAction('improve')}
                    disabled={isAIProcessing}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-100 text-slate-800 dark:text-slate-200 font-bold border border-blue-200/80 dark:border-blue-800 transition"
                  >
                    {isAIProcessing ? 'Processing...' : 'Improve & Format'}
                  </button>

                  <button
                    onClick={() => handleAIAction('flashcards')}
                    disabled={isAIProcessing}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold transition shadow-sm"
                  >
                    {isAIProcessing ? 'Processing...' : 'Generate Flashcards'}
                  </button>
                </div>
              </div>

              {/* Note Markdown Content Body */}
              <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <MarkdownView content={selectedNote.content} />
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
              <BookOpenText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-200">No Note Selected</h3>
              <p className="text-xs max-w-sm mx-auto">
                Select a digital note from the left list or generate a new topicwise note using the AI Studio above.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* CREATE CUSTOM DIGITAL FOLDER MODAL */}
      {showAddFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleAddFolder} className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Create Digital Folder</h3>
                <p className="text-xs text-slate-500">Organize your study material into custom subject folders</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">Digital Folder Name:</label>
              <input
                type="text"
                value={newFolderNameInput}
                onChange={e => setNewFolderNameInput(e.target.value)}
                placeholder="e.g., State PCS Special, Anthropology Optional, Case Laws..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFolderModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WRITE MANUAL NOTE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleSaveNewNote} className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Create Digital Note</h3>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">Note Title:</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g., Fundamental Rights Core Case Laws"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">Target Digital Folder:</label>
              <select
                value={formFolder}
                onChange={e => setFormFolder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allFolders.filter(f => f !== 'All').map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-200">Note Content (Markdown supported):</label>
              <textarea
                value={formContent}
                onChange={e => setFormContent(e.target.value)}
                rows={7}
                placeholder="Type or paste your study notes in Markdown..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none resize-none font-mono text-xs focus:ring-2 focus:ring-blue-500"
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
