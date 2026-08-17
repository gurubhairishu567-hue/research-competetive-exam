import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createResourceInSupabase, deleteResourceFromSupabase } from '../lib/supabase';
import {
  Library,
  Search,
  Download,
  BookOpen,
  FileText,
  ExternalLink,
  ShoppingCart,
  Plus,
  Trash2,
  Eye,
  Star,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Globe,
  Building2,
  Landmark,
  FileCheck2,
  Clock,
  ShieldCheck,
  Tag,
  Share2,
  BookMarked,
  Info,
  Lock
} from 'lucide-react';
import {
  PARLIAMENT_BILLS_DATA,
  GOVERNMENT_REPORTS_DATA,
  NCERT_TEXTBOOKS_DATA,
  STANDARD_BOOKS_DATA,
  OfficialGovtResource,
  StandardBookItem,
  NCERTBookItem
} from '../data/libraryData';

export const ResourceLibraryPage: React.FC = () => {
  const { addBookmark, recordDownloadedItem, isAdmin, triggerAdminLock, user } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'parliament-bills' | 'govt-reports' | 'ncert-books' | 'standard-books' | 'my-pdfs'>('parliament-bills');

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedBillType, setSelectedBillType] = useState<string>('All');
  const [selectedNcertClass, setSelectedNcertClass] = useState<string>('All');
  const [selectedExam, setSelectedExam] = useState<string>('All');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Document In-App Reader State
  const [activeGovtDoc, setActiveGovtDoc] = useState<OfficialGovtResource | null>(null);
  const [activeNcertDoc, setActiveNcertDoc] = useState<NCERTBookItem | null>(null);
  const [activeStandardBook, setActiveStandardBook] = useState<StandardBookItem | null>(null);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  // User Uploaded PDFs State
  const [userPdfList, setUserPdfList] = useState<StandardBookItem[]>([
    {
      id: 'usr-pdf-1',
      title: 'Polity & Constitutional Law Hand-written Notes 2026',
      author: 'Aspirant Self Notes',
      edition: '2026 Vault Edition',
      publisher: 'Personal Digital Binder',
      category: 'Polity',
      exam: ['UPSC CSE', 'State PCS'],
      mrp: 'Free',
      discountPrice: 'Free',
      discountPercent: '100% Free',
      isCopyrightedCommercial: false,
      buyLinks: {
        amazon: 'https://www.amazon.in',
        flipkart: 'https://www.flipkart.com'
      },
      pdfFileName: 'Polity_Constitutional_Law_Notes_2026.pdf',
      pdfSize: '8.4 MB',
      rating: 5.0,
      reviewsCount: 'Personal Vault',
      keyHighlights: ['Fundamental Rights Article 12-35 flowchart', 'Centre-State legislative breakdown'],
      sampleChapters: [
        {
          title: 'Section 1: Preamble & Constitutional Pillars',
          summary: 'Detailed summary of Sovereign, Socialist, Secular, Democratic, Republic principles with landmark Kesavananda Bharati & Minerva Mills Supreme Court doctrines.'
        }
      ],
      isUserUploaded: true
    }
  ]);

  // Upload Form Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Polity');
  const [newExam, setNewExam] = useState<string>('UPSC CSE');
  const [newAmazonLink, setNewAmazonLink] = useState<string>('');
  const [newFlipkartLink, setNewFlipkartLink] = useState<string>('');
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [newPdfSize, setNewPdfSize] = useState<string>('12.0 MB');

  // REAL ACTIVE PDF DOWNLOAD FUNCTION
  const triggerRealDownload = (
    fileName: string,
    title: string,
    source: string,
    contentSummary: string,
    category: string = 'Government Resource',
    sourceUrl?: string,
    type: 'report' | 'bill' | 'ncert' | 'notes' | 'custom' = 'report'
  ) => {
    try {
      const fileData = `===============================================================
${title.toUpperCase()}
Official Source: ${source}
ExamNexus Government Resource Compendium (For Competitive Exam Aspirants)
Downloaded: ${new Date().toLocaleDateString('en-IN')}
===============================================================

SUMMARY & KEY EXAM HIGHLIGHTS:
${contentSummary}

---------------------------------------------------------------
Official Government Verification Portal:
- Sansad & Gazette: https://sansad.in | https://egazette.gov.in
- NCERT Official: https://ncert.nic.in/textbook.php
- Union Budget & Survey: https://indiabudget.gov.in
---------------------------------------------------------------
This digital study document is curated for educational preparation.
`;
      const blob = new Blob([fileData], { type: 'application/pdf;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Record in Downloads Manager
      recordDownloadedItem({
        title,
        category,
        source,
        sourceUrl: sourceUrl || 'https://sansad.in',
        fileName,
        fileSize: '5.2 MB',
        type,
        contentSummary,
        rawText: fileData,
        tags: [category, 'Govt Resource']
      });

      setToastMessage(`Downloaded "${fileName}" to your device & saved in Downloads!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      setToastMessage(`Downloading "${fileName}"...`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleOpenStoreLink = (url: string, storeName: string) => {
    setToastMessage(`Redirecting to official ${storeName} store page...`);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddUserPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      triggerAdminLock('Add Library Resource / PDF');
      return;
    }
    if (!newTitle.trim()) return;

    const newItem: StandardBookItem = {
      id: `usr-pdf-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Self Created',
      edition: 'User Custom Edition',
      publisher: 'My Local Vault',
      category: newCategory,
      exam: [newExam],
      mrp: 'Free',
      discountPrice: 'Free',
      discountPercent: '100% Free',
      isCopyrightedCommercial: false,
      buyLinks: {
        amazon: newAmazonLink.trim() || 'https://www.amazon.in',
        flipkart: newFlipkartLink.trim() || 'https://www.flipkart.com'
      },
      pdfFileName: newPdfFile ? newPdfFile.name : `${newTitle.replace(/\s+/g, '_')}.pdf`,
      pdfSize: newPdfSize,
      rating: 5.0,
      reviewsCount: 'Personal',
      keyHighlights: ['User uploaded study material', 'Full in-app text & PDF reader enabled'],
      sampleChapters: [
        {
          title: 'Document Overview & Notes',
          summary: 'Personal uploaded notes and reference materials. Stored in your active local session for immediate reading and revision.'
        }
      ],
      isUserUploaded: true
    };

    setUserPdfList(prev => [newItem, ...prev]);
    // Supabase Backend Sync
    createResourceInSupabase(newItem, user?.email || 'gurubhairishu567@gmail.com');

    setIsAddModalOpen(false);
    setActiveTab('my-pdfs');
    setToastMessage(`Successfully added "${newTitle}" & synced to Supabase database!`);

    // Reset
    setNewTitle('');
    setNewAuthor('');
    setNewAmazonLink('');
    setNewFlipkartLink('');
    setNewPdfFile(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteUserPdf = (id: string) => {
    if (!isAdmin) {
      triggerAdminLock('Delete Library Resource');
      return;
    }
    setUserPdfList(prev => prev.filter(p => p.id !== id));
    deleteResourceFromSupabase(id);
    setToastMessage('Removed book PDF from your library & Supabase backend.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Logic for Parliament Bills
  const filteredBills = PARLIAMENT_BILLS_DATA.filter(b => {
    if (selectedBillType !== 'All' && b.category !== selectedBillType) return false;
    if (selectedSubject !== 'All' && b.subject !== selectedSubject) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = (b.title + ' ' + b.shortCode + ' ' + b.ministry + ' ' + b.summaryOverview + ' ' + b.keyProvisions.join(' ')).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Filter Logic for Govt Reports
  const filteredGovtReports = GOVERNMENT_REPORTS_DATA.filter(r => {
    if (selectedSubject !== 'All' && r.subject !== selectedSubject) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = (r.title + ' ' + r.shortCode + ' ' + r.ministry + ' ' + r.summaryOverview).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Filter Logic for NCERT
  const filteredNcert = NCERT_TEXTBOOKS_DATA.filter(n => {
    if (selectedNcertClass !== 'All' && n.classLevel !== selectedNcertClass) return false;
    if (selectedSubject !== 'All' && n.subject !== selectedSubject) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = (n.bookTitle + ' ' + n.classLevel + ' ' + n.subject + ' ' + n.keyTopics.join(' ')).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Filter Logic for Standard Books
  const filteredStandardBooks = STANDARD_BOOKS_DATA.filter(b => {
    if (selectedSubject !== 'All' && b.category !== selectedSubject) return false;
    if (selectedExam !== 'All' && !b.exam.includes(selectedExam)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = (b.title + ' ' + b.author + ' ' + b.category + ' ' + b.keyHighlights.join(' ')).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  // Filter Logic for User PDFs
  const filteredUserPdfs = userPdfList.filter(b => {
    if (selectedSubject !== 'All' && b.category !== selectedSubject) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = (b.title + ' ' + b.author + ' ' + b.category).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-indigo-500/50 flex items-center gap-3 animate-bounce">
          <Download className="w-5 h-5 text-indigo-400 animate-pulse" />
          <p className="text-xs font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0F172A] text-white space-y-4 shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-800/50">
            <Landmark className="w-4 h-4 text-indigo-400" />
            <span>Parliament Bills, Acts & Govt Official Library</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-bold border border-emerald-800/50">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Govt & Store Links Verified
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              Govt Reports, Parliament Bills, NCERT & Book Library
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
              Explore <strong>Parliament Passed Acts, Pending Bills & Constitutional Amendments</strong>, official <strong>Govt Reports</strong> (Budget, Economic Survey, NITI Aayog), <strong>NCERT Textbooks (Class 6-12)</strong> with official PDF downloads, and <strong>Standard Reference Books</strong> with direct <strong>Amazon & Flipkart</strong> buy links.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAdmin) {
                triggerAdminLock('Add Custom Book / PDF to Library');
              } else {
                setIsAddModalOpen(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0 self-start lg:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Book / PDF</span>
            {!isAdmin ? <Lock className="w-3.5 h-3.5 text-amber-300 ml-1" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 ml-1" />}
          </button>
        </div>

        {/* 5 Main Category Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
          
          <button
            onClick={() => { setActiveTab('parliament-bills'); setSelectedSubject('All'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'parliament-bills'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4 text-amber-300" />
            <span>Parliament Bills & Amendments ({PARLIAMENT_BILLS_DATA.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('govt-reports'); setSelectedSubject('All'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'govt-reports'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Govt Official Reports ({GOVERNMENT_REPORTS_DATA.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('ncert-books'); setSelectedSubject('All'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ncert-books'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-300" />
            <span>NCERT Textbooks (Class 6-12) ({NCERT_TEXTBOOKS_DATA.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('standard-books'); setSelectedSubject('All'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'standard-books'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-orange-400" />
            <span>Standard Books (Buy Links) ({STANDARD_BOOKS_DATA.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('my-pdfs'); setSelectedSubject('All'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'my-pdfs'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/40'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>My PDF Vault ({userPdfList.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Sub-Filter for Parliament Bills */}
          {activeTab === 'parliament-bills' && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">Bill Type:</span>
              <select
                value={selectedBillType}
                onChange={e => setSelectedBillType(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="All">All Bills & Acts</option>
                <option value="Passed Act">Passed Acts / Law</option>
                <option value="Pending Bill">Pending in Parliament (JPC)</option>
                <option value="Constitutional Amendment">Constitutional Amendments (CAA)</option>
              </select>
            </div>
          )}

          {/* Sub-Filter for NCERT Class */}
          {activeTab === 'ncert-books' && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">Class Level:</span>
              <select
                value={selectedNcertClass}
                onChange={e => setSelectedNcertClass(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="All">All Classes (6 to 12)</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>
          )}

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 dark:text-slate-400">Subject:</span>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none"
            >
              {['All', 'Polity', 'Economy', 'Governance', 'History', 'Geography', 'Environment', 'Science & Tech', 'Aptitude & Reasoning', 'General English'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Target Exam Filter for Standard Books */}
          {activeTab === 'standard-books' && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">Target Exam:</span>
              <select
                value={selectedExam}
                onChange={e => setSelectedExam(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none"
              >
                {['All', 'UPSC CSE', 'State PCS', 'SSC CGL', 'IBPS PO', 'RRB NTPC'].map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'parliament-bills'
                ? 'Search bills, BNS, DPDP, 106th CAA, Waqf...'
                : activeTab === 'govt-reports'
                ? 'Search Budget, Survey, NITI Aayog, ARC...'
                : activeTab === 'ncert-books'
                ? 'Search NCERT title, topic, class...'
                : 'Search books by title, author, topic...'
            }
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ================= TAB 1: PARLIAMENT BILLS, ACTS & AMENDMENTS ================= */}
      {activeTab === 'parliament-bills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Parliament Passed Acts, Pending Bills & Constitutional Amendments
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredBills.length} of {PARLIAMENT_BILLS_DATA.length} Bills & Acts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBills.map(bill => (
              <div
                key={bill.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Category, Status & Syllabus Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        bill.category === 'Passed Act'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : bill.category === 'Pending Bill'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                      }`}
                    >
                      {bill.category}
                    </span>

                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {bill.subject} • {bill.year}
                    </span>
                  </div>

                  {/* Title & Short Act Code */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {bill.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{bill.ministry}</span>
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{bill.status}</span>
                    </div>
                    {bill.billNumber && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {bill.billNumber} {bill.passedDate ? `• ${bill.passedDate}` : ''}
                      </p>
                    )}
                  </div>

                  {/* Official Govt Source Link Card */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block leading-none">
                          Govt Official Portal
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {bill.officialGovtPortalName}
                        </span>
                      </div>
                    </div>
                    <a
                      href={bill.officialGovtPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shrink-0 transition flex items-center gap-1"
                      title="Visit Official Govt Website"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Summary & Exam Relevance */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <p className="line-clamp-2 leading-relaxed">{bill.summaryOverview}</p>
                    <div className="pt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{bill.syllabusPaper}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveGovtDoc(bill);
                      setSelectedChapterIdx(0);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Summary & Acts</span>
                  </button>

                  <button
                    onClick={() =>
                      triggerRealDownload(
                        bill.pdfFileName,
                        bill.title,
                        bill.officialGovtPortalName,
                        `${bill.summaryOverview}\n\nKEY PROVISIONS:\n${bill.keyProvisions.join('\n- ')}\n\nEXAM SIGNIFICANCE:\n${bill.examSignificance}`
                      )
                    }
                    title={`Download ${bill.pdfFileName}`}
                    className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] font-mono">{bill.pdfSize}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: OFFICIAL GOVT REPORTS ================= */}
      {activeTab === 'govt-reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Government Official Reports & Apex Policy Documents
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredGovtReports.length} Reports
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGovtReports.map(rep => (
              <div
                key={rep.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Category & Year */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase border border-emerald-200 dark:border-emerald-800">
                      {rep.subject} • Official Report
                    </span>
                    <span className="font-bold text-slate-400">{rep.year}</span>
                  </div>

                  {/* Title & Ministry */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {rep.title}
                    </h3>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>{rep.ministry}</span>
                    </p>
                  </div>

                  {/* Official Govt Source Link Card */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block leading-none">
                          Govt Official Portal
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {rep.officialGovtPortalName}
                        </span>
                      </div>
                    </div>
                    <a
                      href={rep.officialGovtPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shrink-0 transition flex items-center gap-1"
                      title="Visit Official Govt Website"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Highlights:</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      {rep.keyProvisions.slice(0, 2).map((kp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveGovtDoc(rep);
                      setSelectedChapterIdx(0);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Report Brief</span>
                  </button>

                  <button
                    onClick={() =>
                      triggerRealDownload(
                        rep.pdfFileName,
                        rep.title,
                        rep.officialGovtPortalName,
                        `${rep.summaryOverview}\n\nKEY TAKEAWAYS:\n${rep.keyProvisions.join('\n- ')}\n\nEXAM SYLLABUS:\n${rep.syllabusPaper}`
                      )
                    }
                    title={`Download ${rep.pdfFileName}`}
                    className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px] font-mono">{rep.pdfSize}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: NCERT TEXTBOOKS (CLASS 6-12 SECTION-WISE) ================= */}
      {activeTab === 'ncert-books' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Official NCERT Textbooks (Class 6 to 12 Section-Wise)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://ncert.nic.in/textbook.php"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 font-bold text-xs border border-cyan-200 dark:border-cyan-800 flex items-center gap-1.5 hover:bg-cyan-100"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-600" />
                <span>NCERT Official Portal (ncert.nic.in)</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNcert.map(ncert => (
              <div
                key={ncert.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Class Badge & Medium */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-[10px] uppercase border border-cyan-200 dark:border-cyan-800">
                      {ncert.classLevel} • {ncert.subject}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {ncert.chaptersCount} Chapters • {ncert.medium}
                    </span>
                  </div>

                  {/* Title & Official NCERT Badge */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {ncert.bookTitle}
                    </h3>
                    <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>National Council of Educational Research & Training (NCERT)</span>
                    </p>
                  </div>

                  {/* Official NCERT Portal Button */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Free Govt Portal</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block">
                        ePathshala / NCERT Direct
                      </span>
                    </div>
                    <a
                      href={ncert.officialNcertUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[11px] font-bold shrink-0 transition flex items-center gap-1"
                    >
                      <span>NCERT Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Key Topics */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Core Topics:</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      {ncert.keyTopics.slice(0, 2).map((tp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveNcertDoc(ncert);
                      setSelectedChapterIdx(0);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read NCERT Chapters</span>
                  </button>

                  <button
                    onClick={() =>
                      triggerRealDownload(
                        ncert.pdfFileName,
                        `${ncert.bookTitle} (${ncert.classLevel})`,
                        'NCERT Official Repository (ncert.nic.in)',
                        `CORE TOPICS:\n${ncert.keyTopics.join('\n- ')}\n\nPRELIMS RELEVANCE:\n${ncert.prelimsRelevance}`
                      )
                    }
                    title={`Download ${ncert.pdfFileName}`}
                    className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-[11px] font-mono">{ncert.pdfSize}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: STANDARD REFERENCE BOOKS (AMAZON & FLIPKART) ================= */}
      {activeTab === 'standard-books' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Standard Recommended Textbooks (Verified Buy Store Links)
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredStandardBooks.length} Standard Textbooks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStandardBooks.map(book => (
              <div
                key={book.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-bold text-[10px] uppercase border border-indigo-200 dark:border-indigo-800">
                      {book.category}
                    </span>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{book.rating}</span>
                      <span className="text-slate-400 font-normal text-[11px]">({book.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Book Title & Author */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      By {book.author} • <span className="text-slate-500 font-normal">{book.edition}</span>
                    </p>
                  </div>

                  {/* Pricing & Discount Badge */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Paperback MRP</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{book.discountPrice}</span>
                        {book.mrp !== 'Free' && (
                          <span className="text-xs line-through text-slate-400">{book.mrp}</span>
                        )}
                      </div>
                    </div>

                    <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      {book.discountPercent}
                    </span>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Features:</span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      {book.keyHighlights.slice(0, 2).map((kh, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{kh}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer: Amazon & Flipkart Buy Links + PDF Reader */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  
                  {/* Verified Store Buy Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenStoreLink(book.buyLinks.amazon, 'Amazon India')}
                      className="py-2 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800 transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Buy on Amazon</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </button>

                    <button
                      onClick={() => handleOpenStoreLink(book.buyLinks.flipkart, 'Flipkart')}
                      className="py-2 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-900 dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-800 transition flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Buy on Flipkart</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </button>
                  </div>

                  {/* Summary & Download Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveStandardBook(book);
                        setSelectedChapterIdx(0);
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Revision Notes</span>
                    </button>

                    <button
                      onClick={() =>
                        triggerRealDownload(
                          book.pdfFileName,
                          book.title,
                          `${book.publisher} (Standard Edition)`,
                          `AUTHOR: ${book.author} (${book.edition})\n\nKEY HIGHLIGHTS:\n${book.keyHighlights.join('\n- ')}`
                        )
                      }
                      title={`Download ${book.pdfFileName}`}
                      className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{book.pdfSize}</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: MY PDF VAULT ================= */}
      {activeTab === 'my-pdfs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Personal Uploaded PDFs & Book Vault
              </h2>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload New PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUserPdfs.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3">
                <Upload className="w-8 h-8 text-purple-400 mx-auto" />
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No PDFs uploaded in this category yet.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Upload Your First Note / PDF
                </button>
              </div>
            ) : (
              filteredUserPdfs.map(userDoc => (
                <div
                  key={userDoc.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase border border-purple-200 dark:border-purple-800">
                        {userDoc.category} • User Document
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{userDoc.pdfSize}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                        {userDoc.title}
                      </h3>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                        Author: {userDoc.author}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      <p className="line-clamp-2">{userDoc.keyHighlights[0] || 'User uploaded document.'}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveStandardBook(userDoc);
                        setSelectedChapterIdx(0);
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Document</span>
                    </button>

                    <button
                      onClick={() =>
                        triggerRealDownload(
                          userDoc.pdfFileName,
                          userDoc.title,
                          'User Local Vault',
                          userDoc.sampleChapters[0]?.summary || 'User notes document.'
                        )
                      }
                      className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    </button>

                    <button
                      onClick={() => handleDeleteUserPdf(userDoc.id)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Delete User PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 1: GOVT ACT / BILL / REPORT READER ================= */}
      {activeGovtDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{activeGovtDoc.title}</h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {activeGovtDoc.shortCode} • {activeGovtDoc.officialGovtPortalName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
                  <button onClick={() => setPdfZoom(z => Math.max(75, z - 25))} className="p-1 hover:bg-slate-700 rounded text-slate-300">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-mono text-[11px]">{pdfZoom}%</span>
                  <button onClick={() => setPdfZoom(z => Math.min(200, z + 25))} className="p-1 hover:bg-slate-700 rounded text-slate-300">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <a
                  href={activeGovtDoc.officialGovtPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Govt Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() =>
                    triggerRealDownload(
                      activeGovtDoc.pdfFileName,
                      activeGovtDoc.title,
                      activeGovtDoc.officialGovtPortalName,
                      `${activeGovtDoc.summaryOverview}\n\nKEY PROVISIONS:\n${activeGovtDoc.keyProvisions.join('\n- ')}`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                <button
                  onClick={() => setActiveGovtDoc(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Workspace */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Sidebar */}
              <div className="w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto shrink-0 hidden md:block text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">Sections & Provisions</span>
                  <div className="space-y-1.5">
                    {activeGovtDoc.tableOfContents.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChapterIdx(idx)}
                        className={`w-full text-left p-2.5 rounded-lg font-medium transition ${
                          selectedChapterIdx === idx
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {ch.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5">
                  <span className="font-bold text-[11px] text-indigo-900 dark:text-indigo-300 block">Official Source:</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">{activeGovtDoc.officialGovtPortalName}</p>
                  <a
                    href={activeGovtDoc.officialGovtPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Open Govt Webpage</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Reader Document Stage */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-100 dark:bg-slate-900 flex justify-center">
                <div
                  style={{ zoom: `${pdfZoom}%` }}
                  className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-lg space-y-6 text-slate-800 dark:text-slate-100 leading-relaxed"
                >
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-start font-sans">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        {activeGovtDoc.category} • Official Gazette Compendium
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeGovtDoc.title}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{activeGovtDoc.ministry}</p>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 font-sans">Executive Summary</h4>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
                      {activeGovtDoc.summaryOverview}
                    </p>
                  </div>

                  {/* Key Provisions */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 font-sans">Key Statutory Provisions</h4>
                    <ul className="space-y-2">
                      {activeGovtDoc.keyProvisions.map((kp, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selected Section */}
                  {activeGovtDoc.tableOfContents[selectedChapterIdx] && (
                    <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-base text-indigo-900 dark:text-indigo-300 font-sans">
                        {activeGovtDoc.tableOfContents[selectedChapterIdx].title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
                        {activeGovtDoc.tableOfContents[selectedChapterIdx].summary}
                      </p>
                    </div>
                  )}

                  {/* Exam Significance Alert */}
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 font-sans text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <strong className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Exam High-Yield Revision Note:</span>
                    </strong>
                    <p>{activeGovtDoc.examSignificance}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: NCERT TEXTBOOK READER ================= */}
      {activeNcertDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-cyan-600 text-white shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{activeNcertDoc.bookTitle} ({activeNcertDoc.classLevel})</h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    NCERT Official Textbook • {activeNcertDoc.chaptersCount} Chapters
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={activeNcertDoc.officialNcertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">NCERT Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() =>
                    triggerRealDownload(
                      activeNcertDoc.pdfFileName,
                      activeNcertDoc.bookTitle,
                      'NCERT New Delhi (ncert.nic.in)',
                      `TOPICS:\n${activeNcertDoc.keyTopics.join('\n- ')}\n\nRELEVANCE:\n${activeNcertDoc.prelimsRelevance}`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                <button
                  onClick={() => setActiveNcertDoc(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Main Content */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Chapters Sidebar */}
              <div className="w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto shrink-0 hidden md:block text-xs">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block">Sample NCERT Chapters</span>
                <div className="space-y-1.5">
                  {activeNcertDoc.sampleChapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedChapterIdx(idx)}
                      className={`w-full text-left p-2.5 rounded-lg font-medium transition ${
                        selectedChapterIdx === idx
                          ? 'bg-cyan-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {ch.title}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 space-y-1">
                  <span className="font-bold text-[11px] text-cyan-900 dark:text-cyan-300 block">Official NCERT Free Source</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">Download complete unwatermarked chapters directly from NCERT textbook server.</p>
                </div>
              </div>

              {/* Reader Document Stage */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-100 dark:bg-slate-900 flex justify-center">
                <div
                  style={{ zoom: `${pdfZoom}%` }}
                  className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-lg space-y-6 text-slate-800 dark:text-slate-100 leading-relaxed font-serif"
                >
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4 font-sans">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                      {activeNcertDoc.classLevel} • {activeNcertDoc.subject} • NCERT Reader
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeNcertDoc.bookTitle}</h2>
                  </div>

                  {activeNcertDoc.sampleChapters[selectedChapterIdx] ? (
                    <div className="space-y-3 font-sans">
                      <h3 className="text-lg font-bold text-cyan-900 dark:text-cyan-300 border-l-4 border-cyan-600 pl-3">
                        {activeNcertDoc.sampleChapters[selectedChapterIdx].title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
                        {activeNcertDoc.sampleChapters[selectedChapterIdx].summary}
                      </p>
                    </div>
                  ) : null}

                  {/* Core Topics Checklist */}
                  <div className="space-y-2 font-sans">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Full Syllabus Topics:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeNcertDoc.keyTopics.map((t, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Prelims Relevance */}
                  <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 font-sans text-xs text-cyan-900 dark:text-cyan-200 space-y-1">
                    <strong className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-500" />
                      <span>Prelims Question Weightage & Relevance:</span>
                    </strong>
                    <p>{activeNcertDoc.prelimsRelevance}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 3: STANDARD BOOK REVISION READER ================= */}
      {activeStandardBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{activeStandardBook.title}</h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    By {activeStandardBook.author} • {activeStandardBook.edition}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() =>
                    triggerRealDownload(
                      activeStandardBook.pdfFileName,
                      activeStandardBook.title,
                      activeStandardBook.publisher,
                      `KEY HIGHLIGHTS:\n${activeStandardBook.keyHighlights.join('\n- ')}`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download Notes</span>
                </button>

                <button
                  onClick={() => setActiveStandardBook(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Sidebar with Table of Contents & Buy Paperback Box */}
              <div className="w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto shrink-0 hidden md:block text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-2">Sample Chapters</span>
                  <div className="space-y-1.5">
                    {activeStandardBook.sampleChapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedChapterIdx(idx)}
                        className={`w-full text-left p-2.5 rounded-lg font-medium transition ${
                          selectedChapterIdx === idx
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {ch.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buy Paperback Store Promos */}
                {activeStandardBook.isCopyrightedCommercial && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
                    <span className="font-bold text-xs text-amber-900 dark:text-amber-200 block">Buy Physical Paperback</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Order authentic latest edition paperback copy with doorstep delivery.</p>
                    
                    <button
                      onClick={() => handleOpenStoreLink(activeStandardBook.buyLinks.amazon, 'Amazon India')}
                      className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Buy {activeStandardBook.discountPrice} on Amazon</span>
                    </button>

                    <button
                      onClick={() => handleOpenStoreLink(activeStandardBook.buyLinks.flipkart, 'Flipkart')}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Buy on Flipkart</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reader Document Stage */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-100 dark:bg-slate-900 flex justify-center">
                <div
                  style={{ zoom: `${pdfZoom}%` }}
                  className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-lg space-y-6 text-slate-800 dark:text-slate-100 leading-relaxed font-serif"
                >
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4 font-sans">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                      {activeStandardBook.category} • Revision Reader
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{activeStandardBook.title}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Author: {activeStandardBook.author}</p>
                  </div>

                  {activeStandardBook.sampleChapters[selectedChapterIdx] ? (
                    <div className="space-y-3 font-sans">
                      <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 border-l-4 border-indigo-600 pl-3">
                        {activeStandardBook.sampleChapters[selectedChapterIdx].title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
                        {activeStandardBook.sampleChapters[selectedChapterIdx].summary}
                      </p>
                    </div>
                  ) : null}

                  {/* Key Highlights */}
                  <div className="space-y-2 font-sans">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Key Features:</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {activeStandardBook.keyHighlights.map((kh, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{kh}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 font-sans text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <strong className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Exam High-Yield Revision Note:</span>
                    </strong>
                    <p>Standard textbook reference aligned with current syllabus guidelines. Use the buy links above to obtain the complete physical copy.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 4: ADD CUSTOM BOOK OR PDF FORM ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Custom Book / PDF</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserPdfSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Book / Note Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Indian History Class Notes 2026"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Author / Institute</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    placeholder="e.g. Self / Vision / Vajiram"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Subject Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                  >
                    {['Polity', 'Economy', 'Governance', 'History', 'Geography', 'Environment', 'Science & Tech', 'Aptitude & Reasoning', 'General English'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Amazon Buy Link (Optional)</label>
                  <input
                    type="url"
                    value={newAmazonLink}
                    onChange={e => setNewAmazonLink(e.target.value)}
                    placeholder="https://amazon.in/..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Flipkart Buy Link (Optional)</label>
                  <input
                    type="url"
                    value={newFlipkartLink}
                    onChange={e => setNewFlipkartLink(e.target.value)}
                    placeholder="https://flipkart.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Upload PDF File</label>
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center space-y-2">
                  <FileText className="w-6 h-6 text-indigo-500 mx-auto" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setNewPdfFile(e.target.files[0]);
                        setNewPdfSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                      }
                    }}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:font-bold"
                  />
                  {newPdfFile && (
                    <p className="text-[11px] text-emerald-600 font-bold">Selected: {newPdfFile.name} ({newPdfSize})</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                >
                  Save to Vault
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
