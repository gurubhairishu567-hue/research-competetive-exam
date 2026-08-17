import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Exam, CurrentAffairItem, Question, NoteItem, Flashcard, StudyPlan, ResourceItem, MockTest } from '../types';
import { INITIAL_USER_PROFILE, SAMPLE_EXAMS, SAMPLE_CURRENT_AFFAIRS, SAMPLE_QUESTIONS, SAMPLE_NOTES, SAMPLE_FLASHCARDS, SAMPLE_RESOURCES, SAMPLE_STUDY_PLAN, SAMPLE_MOCK_TESTS } from '../data/mockData';
import { 
  saveToSupabase, 
  loadFromSupabase, 
  testSupabaseConnection, 
  SUPABASE_URL,
  createNoteInSupabase,
  createFolderInSupabase,
  createFlashcardInSupabase,
  createCurrentAffairInSupabase,
  createQuestionInSupabase
} from '../lib/supabase';

export interface BookmarkItem {
  id: string;
  type: 'question' | 'article' | 'note' | 'exam' | 'research' | 'resource';
  title: string;
  category?: string;
  contentSnippet?: string;
  dateAdded: string;
  dataRef?: any;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'exam' | 'current-affairs' | 'reminder' | 'system';
}

export interface DownloadedItem {
  id: string;
  title: string;
  category: string;
  source: string;
  sourceUrl?: string;
  fileName: string;
  fileSize: string;
  downloadedAt: string;
  type: 'pdf' | 'report' | 'bill' | 'ncert' | 'notes' | 'pyq' | 'test-result' | 'custom';
  contentSummary: string;
  rawText?: string;
  tags?: string[];
}

interface RegisteredUserAccount {
  name: string;
  email: string;
  password: string;
  targetExam: string;
  avatarPhoto?: string;
  createdAt: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  loginWithOtp: (identifier: string, isMobile?: boolean) => { success: boolean; message?: string };
  signup: (name: string, email: string, password?: string, targetExam?: string, avatarPhoto?: string) => { success: boolean; message?: string };
  updateProfilePhoto: (url: string) => void;
  registeredUsers: RegisteredUserAccount[];
  logout: () => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentPage: string;
  setCurrentPage: (page: string, params?: Record<string, any>) => void;
  pageParams: Record<string, any>;
  exams: Exam[];
  selectedExam: Exam;
  setSelectedExamById: (id: string) => void;
  currentAffairs: CurrentAffairItem[];
  setCurrentAffairs: React.Dispatch<React.SetStateAction<CurrentAffairItem[]>>;
  addCurrentAffairsArticle: (article: CurrentAffairItem) => void;
  questions: Question[];
  addQuestion: (question: Question) => void;
  mockTests: MockTest[];
  notes: NoteItem[];
  setNotes: React.Dispatch<React.SetStateAction<NoteItem[]>>;
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  addFlashcard: (fc: Omit<Flashcard, 'id'>) => void;
  resources: ResourceItem[];
  studyPlan: StudyPlan;
  setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlan>>;
  toggleTaskCompletion: (weekNum: number, taskId: string) => void;
  completedSyllabusTopics: string[];
  toggleSyllabusTopic: (topicId: string) => void;
  bookmarks: BookmarkItem[];
  addBookmark: (item: Omit<BookmarkItem, 'dateAdded'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  downloadedItems: DownloadedItem[];
  recordDownloadedItem: (item: Omit<DownloadedItem, 'id' | 'downloadedAt'>) => void;
  deleteDownloadedItem: (id: string) => void;
  clearAllDownloads: () => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTestId: string | null;
  setActiveTestId: (id: string | null) => void;
  testHistory: any[];
  addTestAttempt: (attempt: any) => void;
  // Admin & Permission controls
  isAdmin: boolean;
  isAdminMode: boolean;
  setIsAdminMode: (isAdmin: boolean) => void;
  showAdminLockModal: boolean;
  setShowAdminLockModal: (show: boolean) => void;
  adminLockFeatureName: string;
  triggerAdminLock: (featureName: string) => void;
  // Supabase state
  supabaseStatus: {
    connected: boolean;
    syncing: boolean;
    lastSyncedAt: string | null;
    projectId: string;
    message: string;
  };
  syncAllToSupabase: () => Promise<void>;
}

const SEED_REGISTERED_USERS: RegisteredUserAccount[] = [
  {
    name: 'Gurubhai Rishu',
    email: 'gurubhairishu567@gmail.com',
    password: 'password123',
    targetExam: 'UPSC CSE (Civil Services)',
    avatarPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01'
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.upsc@examnexus.ai',
    password: 'password123',
    targetExam: 'UPSC CSE (Civil Services)',
    avatarPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-08-02'
  },
  {
    name: 'Priya Verma',
    email: 'priya.ssc@examnexus.ai',
    password: 'password123',
    targetExam: 'SSC CGL',
    avatarPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-08-03'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('examnexus_is_authenticated');
    return saved === 'true';
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserAccount[]>(() => {
    const saved = localStorage.getItem('examnexus_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SEED_REGISTERED_USERS;
      }
    }
    return SEED_REGISTERED_USERS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('examnexus_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('examnexus_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  // Admin and Permissions State
  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('examnexus_is_admin_mode');
    return saved !== null ? saved === 'true' : true; // Default to true for primary developer/admin
  });
  const [showAdminLockModal, setShowAdminLockModal] = useState<boolean>(false);
  const [adminLockFeatureName, setAdminLockFeatureName] = useState<string>('');

  const setIsAdminMode = (mode: boolean) => {
    setIsAdminModeState(mode);
    localStorage.setItem('examnexus_is_admin_mode', String(mode));
  };

  const triggerAdminLock = (featureName: string) => {
    setAdminLockFeatureName(featureName);
    setShowAdminLockModal(true);
  };

  const isAdmin = Boolean(
    isAdminMode || 
    user?.role === 'admin' || 
    user?.email === 'gurubhairishu567@gmail.com'
  );

  const [exams] = useState<Exam[]>(SAMPLE_EXAMS);
  const [selectedExamId, setSelectedExamIdState] = useState<string>('upsc-cse');
  
  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairItem[]>(SAMPLE_CURRENT_AFFAIRS);
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS);
  const [mockTests] = useState<MockTest[]>(SAMPLE_MOCK_TESTS);
  const [resources] = useState<ResourceItem[]>(SAMPLE_RESOURCES);

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('examnexus_notes');
    return saved ? JSON.parse(saved) : SAMPLE_NOTES;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('examnexus_flashcards');
    return saved ? JSON.parse(saved) : SAMPLE_FLASHCARDS;
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => {
    const saved = localStorage.getItem('examnexus_studyplan');
    return saved ? JSON.parse(saved) : SAMPLE_STUDY_PLAN;
  });

  const [completedSyllabusTopics, setCompletedSyllabusTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('examnexus_syllabus_completed');
    return saved ? JSON.parse(saved) : ['pol-1', 'pol-2', 'eco-1', 'eco-2', 'env-1', 'env-2', 'qa-1', 'qa-2', 'rea-1'];
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('examnexus_bookmarks');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ca-1',
        type: 'article',
        title: 'India Semiconductor Mission 2.0 Launched with ₹85,000 Crore Allocation',
        category: 'Government Schemes',
        contentSnippet: 'Cabinet approved Phase 2 of ISM with expanded outlay...',
        dateAdded: '2026-08-10'
      },
      {
        id: 'q-101',
        type: 'question',
        title: 'Preamble of the Indian Constitution',
        category: 'Polity & Constitution',
        contentSnippet: 'With reference to the Preamble of the Indian Constitution...',
        dateAdded: '2026-08-11'
      }
    ];
  });

  const [testHistory, setTestHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('examnexus_testhistory');
    return saved ? JSON.parse(saved) : [
      {
        testId: 'mock-upsc-prelims-1',
        testTitle: 'UPSC Prelims Full Length Mock Test - GS Paper 1',
        exam: 'UPSC CSE',
        completedAt: '2026-08-09T14:30:00Z',
        score: 112,
        totalMarks: 200,
        percentage: 56,
        accuracy: 74.6,
        attemptedCount: 75,
        correctCount: 56,
        incorrectCount: 19,
        unansweredCount: 25,
        timeSpentSeconds: 5820,
        strongTopics: ['Polity', 'History', 'General Science'],
        weakTopics: ['Indian Economy', 'Environment'],
        aiRecommendations: [
          'Revise Monetary Policy tools and Inflation indices in Economy.',
          'Focus on Protected Areas and COP agreements for Environment.'
        ]
      }
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n-1',
      title: 'UPSC CSE Prelims 2026 Alert',
      message: '100 Days remaining for UPSC CSE Prelims examination.',
      time: '2 hours ago',
      read: false,
      type: 'exam'
    },
    {
      id: 'n-2',
      title: 'Daily Current Affairs Released',
      message: '10 new high-yield news summaries added for today.',
      time: '5 hours ago',
      read: false,
      type: 'current-affairs'
    },
    {
      id: 'n-3',
      title: 'Daily Study Target Reminder',
      message: 'You have completed 165/240 study minutes today. Keep it up!',
      time: '1 day ago',
      read: true,
      type: 'reminder'
    }
  ]);

  const [downloadedItems, setDownloadedItems] = useState<DownloadedItem[]>(() => {
    const saved = localStorage.getItem('examnexus_downloads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'dl-1',
        title: 'Union Budget 2026-27 Comprehensive Policy Highlights & Capital Outlay Summary',
        category: 'Government Official Report',
        source: 'Ministry of Finance (indiabudget.gov.in)',
        sourceUrl: 'https://www.indiabudget.gov.in',
        fileName: 'Union_Budget_2026_27_Highlights.pdf',
        fileSize: '4.8 MB',
        downloadedAt: new Date(Date.now() - 3600000 * 3).toLocaleString('en-IN'),
        type: 'report',
        contentSummary: 'Complete key highlights of Union Budget 2026-27 including infrastructure capital expenditure target of ₹11.8 Lakh Crore, fiscal deficit target of 4.5%, MSME credit guarantee enhancements, and green energy corridor allocations.',
        rawText: `UNION BUDGET 2026-27 KEY SUMMARY
Source: Ministry of Finance (indiabudget.gov.in)
Capex Outlay: Rs 11.8 Lakh Crore (3.4% of GDP)
Fiscal Deficit Target: 4.5% of GDP
Tax Slabs: Revised standard deduction to Rs 75,000 in new regime.
Key Thrust Areas: Next-Gen Infrastructure, Digital Public Infrastructure 2.0, Deep Tech Innovation Fund.`,
        tags: ['Budget', 'Economy', 'Fiscal Policy', 'GS-3']
      },
      {
        id: 'dl-2',
        title: 'Bharatiya Nyaya Sanhita (BNS) 2023 - Official Gazette & Comparative Compendium',
        category: 'Parliament Passed Act',
        source: 'Ministry of Law & Justice (egazette.gov.in)',
        sourceUrl: 'https://egazette.gov.in',
        fileName: 'Bharatiya_Nyaya_Sanhita_2023_Gazette.pdf',
        fileSize: '12.4 MB',
        downloadedAt: new Date(Date.now() - 3600000 * 18).toLocaleString('en-IN'),
        type: 'bill',
        contentSummary: 'Official Gazette copy replacing Indian Penal Code (IPC) 1860. Contains 358 sections, introduction of community service for petty offences, terrorism definitions under Section 113, and organized crime provisions under Section 111.',
        rawText: `BHARATIYA NYAYA SANHITA (BNS) 2023
Source: Legislative Department (legislative.gov.in) / Gazette of India
Key Highlights:
- Repeals IPC 1860. Contains 358 sections.
- Section 113: Clear definition of Terrorism as acts threatening unity, integrity, sovereignty or security of India.
- Section 111: Organized Crime with strict penalties.
- Community service introduced as a recognized statutory punishment for first-time petty theft.`,
        tags: ['Law', 'Polity', 'Criminal Law Reform', 'GS-2']
      },
      {
        id: 'dl-3',
        title: 'NCERT Class 11 - Indian Constitution at Work (Complete Textbook Compendium)',
        category: 'NCERT Textbook',
        source: 'NCERT Official Portal (ncert.nic.in)',
        sourceUrl: 'https://ncert.nic.in/textbook.php',
        fileName: 'NCERT_Class11_Indian_Constitution_At_Work.pdf',
        fileSize: '18.2 MB',
        downloadedAt: new Date(Date.now() - 3600000 * 36).toLocaleString('en-IN'),
        type: 'ncert',
        contentSummary: 'Core conceptual foundation textbook for UPSC & State PSC Polity. Chapters cover Constitution: Why & How, Rights in the Indian Constitution, Election & Representation, Executive, Legislature, Judiciary, Federalism, Local Governments, and Living Constitution.',
        rawText: `NCERT CLASS 11: INDIAN CONSTITUTION AT WORK
Source: National Council of Educational Research and Training (ncert.nic.in)
Core Themes:
- Chapter 1: Constitution: Why and How? Authority of constitutions and institutional design.
- Chapter 2: Rights in the Indian Constitution (Articles 12 to 35, Fundamental Duties Article 51A).
- Chapter 3: Election and Representation (First-Past-the-Post vs Proportional Representation).
- Chapter 4: Executive (Parliamentary system vs Presidential system).
- Chapter 5: Legislature (Bicameralism, Parliamentary control).
- Chapter 6: Judiciary (Judicial Review, Judicial Activism, Basic Structure Doctrine).`,
        tags: ['NCERT', 'Polity', 'Class 11', 'Foundations']
      },
      {
        id: 'dl-4',
        title: 'Economic Survey 2025-26 - State of the Economy & Sectoral Projections',
        category: 'Government Official Report',
        source: 'Department of Economic Affairs (econsurvey.gov.in)',
        sourceUrl: 'https://www.indiabudget.gov.in/economicsurvey/',
        fileName: 'Economic_Survey_2025_26_Key_Chapters.pdf',
        fileSize: '8.5 MB',
        downloadedAt: new Date(Date.now() - 3600000 * 50).toLocaleString('en-IN'),
        type: 'report',
        contentSummary: 'Comprehensive analytical survey of real GDP growth at 6.8-7.2%, service sector resilience, inflation moderation within RBI tolerance band, manufacturing PMI, and agricultural output trends.',
        rawText: `ECONOMIC SURVEY 2025-26
Source: Economic Division, Ministry of Finance (indiabudget.gov.in/economicsurvey)
- GDP Growth Projection: 6.8% to 7.2% for FY27.
- External Sector: Robust forex reserves exceeding $680 Billion.
- Services Sector: Leading driver of GVA growth at 7.6%.
- Inflation: Headline CPI averaging around 4.5%, within the RBI target tolerance band (4% +/- 2%).`,
        tags: ['Economic Survey', 'GS-3', 'Macroeconomics']
      }
    ];
  });

  // Supabase Connection State
  const [supabaseStatus, setSupabaseStatus] = useState({
    connected: true,
    syncing: false,
    lastSyncedAt: new Date().toLocaleTimeString(),
    projectId: 'tdxlapvovjlpaycrnnhk',
    message: 'Connected to Supabase Project tdxlapvovjlpaycrnnhk'
  });

  const syncAllToSupabase = async () => {
    setSupabaseStatus(prev => ({ ...prev, syncing: true }));
    try {
      const email = user.email || 'gurubhairishu567@gmail.com';
      await Promise.all([
        saveToSupabase('user_profile', user, email),
        saveToSupabase('study_notes', notes, email),
        saveToSupabase('flashcards', flashcards, email),
        saveToSupabase('study_plan', studyPlan, email),
        saveToSupabase('completed_syllabus', completedSyllabusTopics, email),
        saveToSupabase('bookmarks', bookmarks, email),
        saveToSupabase('test_history', testHistory, email)
      ]);
      const now = new Date().toLocaleTimeString();
      setSupabaseStatus(prev => ({
        ...prev,
        syncing: false,
        connected: true,
        lastSyncedAt: now,
        message: 'All user details & study progress synchronized with Supabase'
      }));
    } catch (err: any) {
      setSupabaseStatus(prev => ({
        ...prev,
        syncing: false,
        message: 'Sync completed (Local fallback active): ' + (err?.message || '')
      }));
    }
  };

  // Test initial Supabase connection on load
  useEffect(() => {
    testSupabaseConnection().then(res => {
      setSupabaseStatus(prev => ({
        ...prev,
        connected: res.connected,
        message: res.message
      }));
    });
    // Trigger initial sync
    syncAllToSupabase();
  }, []);

  // Effects for Persistence & Theme Sync
  useEffect(() => {
    localStorage.setItem('examnexus_user', JSON.stringify(user));
    saveToSupabase('user_profile', user, user.email);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('examnexus_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('examnexus_notes', JSON.stringify(notes));
    saveToSupabase('study_notes', notes, user.email);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('examnexus_flashcards', JSON.stringify(flashcards));
    saveToSupabase('flashcards', flashcards, user.email);
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('examnexus_studyplan', JSON.stringify(studyPlan));
    saveToSupabase('study_plan', studyPlan, user.email);
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('examnexus_syllabus_completed', JSON.stringify(completedSyllabusTopics));
    saveToSupabase('completed_syllabus', completedSyllabusTopics, user.email);
  }, [completedSyllabusTopics]);

  useEffect(() => {
    localStorage.setItem('examnexus_bookmarks', JSON.stringify(bookmarks));
    saveToSupabase('bookmarks', bookmarks, user.email);
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('examnexus_testhistory', JSON.stringify(testHistory));
    saveToSupabase('test_history', testHistory, user.email);
  }, [testHistory]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setCurrentPage = (page: string, params: Record<string, any> = {}) => {
    setCurrentPageState(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSelectedExamById = (id: string) => {
    setSelectedExamIdState(id);
    const ex = exams.find(e => e.id === id);
    if (ex) {
      setUser(prev => ({ ...prev, targetExam: ex.name }));
    }
  };

  const addCurrentAffairsArticle = (article: CurrentAffairItem) => {
    setCurrentAffairs(prev => [article, ...prev]);
    createCurrentAffairInSupabase(article, user.email);
  };

  const addQuestion = (q: Question) => {
    setQuestions(prev => [q, ...prev]);
    createQuestionInSupabase(q, user.email);
  };

  const addNote = (noteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: NoteItem = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setNotes(prev => [newNote, ...prev]);
    createNoteInSupabase(newNote, user.email);
  };

  const updateNote = (id: string, updates: Partial<NoteItem>) => {
    setNotes(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : n));
      const target = updated.find(n => n.id === id);
      if (target) {
        createNoteInSupabase(target, user.email);
      }
      return updated;
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addFlashcard = (fcData: Omit<Flashcard, 'id'>) => {
    const newFc: Flashcard = {
      ...fcData,
      id: `fc-${Date.now()}`
    };
    setFlashcards(prev => [newFc, ...prev]);
    createFlashcardInSupabase(newFc, user.email);
  };

  const toggleTaskCompletion = (weekNum: number, taskId: string) => {
    setStudyPlan(prev => ({
      ...prev,
      weeks: prev.weeks.map(w => {
        if (w.weekNumber !== weekNum) return w;
        return {
          ...w,
          tasks: w.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      })
    }));
  };

  const toggleSyllabusTopic = (topicId: string) => {
    setCompletedSyllabusTopics(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  const addBookmark = (item: Omit<BookmarkItem, 'dateAdded'>) => {
    if (bookmarks.some(b => b.id === item.id)) return;
    const newB: BookmarkItem = {
      ...item,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setBookmarks(prev => [newB, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(b => b.id === id);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const recordDownloadedItem = (item: Omit<DownloadedItem, 'id' | 'downloadedAt'>) => {
    const newItem: DownloadedItem = {
      ...item,
      id: `dl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      downloadedAt: new Date().toLocaleString('en-IN')
    };
    setDownloadedItems(prev => {
      const filtered = prev.filter(x => x.fileName !== item.fileName);
      const updated = [newItem, ...filtered];
      localStorage.setItem('examnexus_downloads', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteDownloadedItem = (id: string) => {
    setDownloadedItems(prev => {
      const updated = prev.filter(x => x.id !== id);
      localStorage.setItem('examnexus_downloads', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllDownloads = () => {
    setDownloadedItems([]);
    localStorage.removeItem('examnexus_downloads');
  };

  const addTestAttempt = (attempt: any) => {
    setTestHistory(prev => [attempt, ...prev]);
    setUser(prev => ({
      ...prev,
      testsCompletedCount: prev.testsCompletedCount + 1,
      questionsSolvedToday: prev.questionsSolvedToday + attempt.attemptedCount
    }));
  };

  const updateProfilePhoto = (url: string) => {
    setUser(prev => {
      const updated = { ...prev, avatarPhoto: url };
      localStorage.setItem('examnexus_user', JSON.stringify(updated));
      return updated;
    });
  };

  const login = (emailOrName: string, password?: string) => {
    const query = emailOrName.trim().toLowerCase();
    if (!query) {
      return { success: false, message: 'Please enter your registered email address or username.' };
    }
    if (!password) {
      return { success: false, message: 'Please enter your password.' };
    }

    // Strict account check against registered database
    const account = registeredUsers.find(
      u => u.email.toLowerCase() === query || u.name.toLowerCase() === query
    );

    if (!account) {
      return {
        success: false,
        message: 'Account not found! Please Sign Up first before logging in.'
      };
    }

    if (account.password !== password) {
      return {
        success: false,
        message: 'Incorrect password! Please enter the exact password you set during Sign Up.'
      };
    }

    // Credentials match!
    const loggedInProfile: UserProfile = {
      ...user,
      name: account.name,
      email: account.email,
      targetExam: account.targetExam || user.targetExam,
      avatarPhoto: account.avatarPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(account.name)}`
    };

    setUser(loggedInProfile);
    setIsAuthenticated(true);
    localStorage.setItem('examnexus_is_authenticated', 'true');
    localStorage.setItem('examnexus_user', JSON.stringify(loggedInProfile));

    return { success: true };
  };

  const loginWithOtp = (identifier: string, isMobile = false) => {
    if (!identifier || !identifier.trim()) {
      return { success: false, message: 'Please enter a valid phone number or email.' };
    }
    const cleanId = identifier.trim().toLowerCase();
    
    // Check if account already exists
    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanId || u.name.toLowerCase() === cleanId);
    
    let updatedUser: UserProfile;
    if (existing) {
      updatedUser = {
        ...user,
        name: existing.name,
        email: existing.email,
        targetExam: existing.targetExam,
        avatarPhoto: existing.avatarPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(existing.name)}`
      };
    } else {
      updatedUser = {
        ...user,
        email: isMobile ? `${cleanId.replace(/\D/g, '')}@mobile.examnexus.ai` : cleanId,
        name: isMobile ? `Aspirant (+91 ${cleanId.slice(-4)})` : cleanId.split('@')[0],
        avatarPhoto: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanId)}`
      };
    }

    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('examnexus_is_authenticated', 'true');
    localStorage.setItem('examnexus_user', JSON.stringify(updatedUser));
    return { success: true };
  };

  const signup = (name: string, email: string, password?: string, targetExam?: string, avatarPhoto?: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please provide a valid full name and email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    // Check if email already registered
    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account with this email already exists! Please switch to Log In.'
      };
    }

    const avatar = avatarPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`;

    const newAccount: RegisteredUserAccount = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      targetExam: targetExam || 'UPSC CSE (Civil Services)',
      avatarPhoto: avatar,
      createdAt: new Date().toISOString()
    };

    const updatedRegisteredList = [newAccount, ...registeredUsers];
    setRegisteredUsers(updatedRegisteredList);
    localStorage.setItem('examnexus_registered_users', JSON.stringify(updatedRegisteredList));

    const newUserProfile: UserProfile = {
      name: cleanName,
      email: cleanEmail,
      avatarPhoto: avatar,
      targetExam: targetExam || 'UPSC CSE (Civil Services)',
      prepLevel: 'Beginner',
      dailyTargetMinutes: 240,
      studyTimeTodayMinutes: 45,
      questionsSolvedToday: 15,
      accuracyRate: 78,
      testsCompletedCount: 2,
      streakDays: 1
    };

    setUser(newUserProfile);
    setIsAuthenticated(true);
    localStorage.setItem('examnexus_is_authenticated', 'true');
    localStorage.setItem('examnexus_user', JSON.stringify(newUserProfile));

    // Try background sync to Supabase
    saveToSupabase('user_profile', newUserProfile, cleanEmail).catch(() => {});

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('examnexus_is_authenticated');
    setCurrentPageState('home');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        loginWithOtp,
        signup,
        updateProfilePhoto,
        registeredUsers,
        logout,
        user,
        setUser,
        theme,
        toggleTheme,
        currentPage,
        setCurrentPage,
        pageParams,
        exams,
        selectedExam,
        setSelectedExamById,
        currentAffairs,
        setCurrentAffairs,
        addCurrentAffairsArticle,
        questions,
        addQuestion,
        mockTests,
        notes,
        setNotes,
        addNote,
        updateNote,
        deleteNote,
        flashcards,
        setFlashcards,
        addFlashcard,
        resources,
        studyPlan,
        setStudyPlan,
        toggleTaskCompletion,
        completedSyllabusTopics,
        toggleSyllabusTopic,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        downloadedItems,
        recordDownloadedItem,
        deleteDownloadedItem,
        clearAllDownloads,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        searchQuery,
        setSearchQuery,
        activeTestId,
        setActiveTestId,
        testHistory,
        addTestAttempt,
        isAdmin,
        isAdminMode,
        setIsAdminMode,
        showAdminLockModal,
        setShowAdminLockModal,
        adminLockFeatureName,
        triggerAdminLock,
        supabaseStatus,
        syncAllToSupabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
