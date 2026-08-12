import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  Check,
  Star,
  Upload,
  Bookmark,
  X,
  ZoomIn,
  ZoomOut,
  Tag,
  Copy,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  edition: string;
  publisher: string;
  category: string;
  exam: string[];
  mrp: string;
  discountPrice: string;
  discountPercent: string;
  buyLinks: {
    amazon: string;
    flipkart: string;
    publisher?: string;
  };
  pdfFileName: string;
  pdfSize: string;
  rating: number;
  reviewsCount: string;
  keyHighlights: string[];
  sampleChapters: { title: string; summary: string }[];
  isUserUploaded?: boolean;
}

export const ResourceLibraryPage: React.FC = () => {
  const { setCurrentPage, addBookmark } = useApp();

  const [activeTab, setActiveTab] = useState<'recommended-books' | 'reports-ncert' | 'my-pdfs'>('recommended-books');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedExam, setSelectedExam] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PDF Viewer Modal State
  const [activePdfBook, setActivePdfBook] = useState<BookItem | null>(null);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  // User Uploaded PDFs State
  const [userPdfList, setUserPdfList] = useState<BookItem[]>([
    {
      id: 'usr-pdf-1',
      title: 'My Custom Polity Hand-written Class Notes 2026',
      author: 'Self Created',
      edition: 'Personal Notes',
      publisher: 'ExamNexus Vault',
      category: 'Polity',
      exam: ['UPSC CSE', 'State PCS'],
      mrp: 'Free',
      discountPrice: 'Free',
      discountPercent: '100% Free',
      buyLinks: {
        amazon: 'https://www.amazon.in',
        flipkart: 'https://www.flipkart.com'
      },
      pdfFileName: 'Polity_Class_Notes_Handwritten_2026.pdf',
      pdfSize: '8.4 MB',
      rating: 5.0,
      reviewsCount: 'Personal',
      keyHighlights: ['Fundamental Rights Article 12-35 breakdown', 'Constitutional Bodies Mindmaps'],
      sampleChapters: [
        { title: 'Chapter 1: Preamble & Key Terms', summary: 'Sovereign, Socialist, Secular, Democratic, Republic principles explained with landmark Supreme Court judgments.' }
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
  const [newBuyLink, setNewBuyLink] = useState<string>('');
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [newPdfSize, setNewPdfSize] = useState<string>('12.0 MB');

  // Master Recommended Books Database
  const recommendedBooks: BookItem[] = [
    {
      id: 'bk-polity-laxmikanth',
      title: 'Indian Polity for Civil Services & State Examinations',
      author: 'M. Laxmikanth',
      edition: '7th Revised Edition (2025–2026)',
      publisher: 'McGraw Hill Education',
      category: 'Polity',
      exam: ['UPSC CSE', 'State PCS', 'SSC CGL', 'IBPS PO'],
      mrp: '₹995',
      discountPrice: '₹685',
      discountPercent: '31% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Indian-Polity-Services-State-Examinations/dp/9355325859',
        flipkart: 'https://www.flipkart.com/indian-polity-7th-edition-m-laxmikanth/p/itm123456789',
        publisher: 'https://www.mheducation.co.in/indian-polity-7th-edition'
      },
      pdfFileName: 'Indian_Polity_7th_Edition_Laxmikanth_HighYield_PDF.pdf',
      pdfSize: '28.4 MB',
      rating: 4.9,
      reviewsCount: '24,500+',
      keyHighlights: [
        'Updated with latest 106th Constitutional Amendment Act',
        'Includes 80+ Chapters covering Preamble to Statutory Commissions',
        'Includes Chapter-wise Prelims and Mains Model MCQs'
      ],
      sampleChapters: [
        {
          title: 'Chapter 1: Historical Background & Making of the Constitution',
          summary: 'Detailed chronology of Regulating Act 1773, Pitt’s India Act 1784, Charter Acts (1813, 1833, 1853), Government of India Acts 1858, 1919 & 1935, Constituent Assembly committees, and drafting landmarks.'
        },
        {
          title: 'Chapter 7: Fundamental Rights (Articles 12 to 35)',
          summary: 'In-depth analysis of Right to Equality (Art 14-18), Freedom (Art 19-22), Right against Exploitation (Art 23-24), Religious Freedom (Art 25-28), Cultural Rights (Art 29-30), and Writs under Article 32 (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari).'
        },
        {
          title: 'Chapter 12: Parliamentary System & Cabinet Committee',
          summary: 'Comparison between Presidential and Parliamentary forms, Collective Responsibility, No-Confidence Motion, Cut Motions, and Cabinet Committees.'
        }
      ]
    },
    {
      id: 'bk-economy-ramesh',
      title: 'Indian Economy for UPSC & State Services',
      author: 'Ramesh Singh',
      edition: '16th Latest Edition',
      publisher: 'McGraw Hill',
      category: 'Economy',
      exam: ['UPSC CSE', 'State PCS', 'RBI Grade B', 'IBPS PO'],
      mrp: '₹850',
      discountPrice: '₹590',
      discountPercent: '30% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Indian-Economy-Civil-Services-Examinations/dp/9355322108',
        flipkart: 'https://www.flipkart.com/indian-economy-ramesh-singh/p/itm987654321',
        publisher: 'https://www.mheducation.co.in'
      },
      pdfFileName: 'Indian_Economy_Ramesh_Singh_16th_Ed_Summary.pdf',
      pdfSize: '22.1 MB',
      rating: 4.8,
      reviewsCount: '18,200+',
      keyHighlights: [
        'Covers Union Budget 2026-27 & Economic Survey High-Yield Key Points',
        'In-depth explanations of Inflation, RBI Monetary Policy, Banking & NPA Code',
        'Glossary of 500+ Macroeconomic terms for Prelims'
      ],
      sampleChapters: [
        {
          title: 'Chapter 3: Growth, Development & Happiness Index',
          summary: 'GDP vs GNP vs NNP calculations, Real vs Nominal GDP, Human Development Index (HDI), Multidimensional Poverty Index (MPI), and Gross National Happiness.'
        },
        {
          title: 'Chapter 7: Banking Sector & Non-Performing Assets (NPAs)',
          summary: 'RBI Monetary Policy instruments (Repo, Reverse Repo, CRR, SLR, MSF), Insolvency and Bankruptcy Code (IBC 2016), SARFAESI Act, and Bad Bank (NARCL).'
        }
      ]
    },
    {
      id: 'bk-history-spectrum',
      title: 'A Brief History of Modern India (Spectrum)',
      author: 'Rajiv Ahir (IPS)',
      edition: '2025 Revised Edition',
      publisher: 'Spectrum Books',
      category: 'History',
      exam: ['UPSC CSE', 'SSC CGL', 'State PCS', 'RRB NTPC'],
      mrp: '₹495',
      discountPrice: '₹370',
      discountPercent: '25% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Brief-History-Modern-India-Edition/dp/8179307992',
        flipkart: 'https://www.flipkart.com/brief-history-modern-india-spectrum/p/itm112233445'
      },
      pdfFileName: 'Spectrum_Modern_Indian_History_Complete_PDF.pdf',
      pdfSize: '19.8 MB',
      rating: 4.9,
      reviewsCount: '32,100+',
      keyHighlights: [
        'Chronological breakdown from Decline of Mughals to Independence 1947',
        'Summary tables at the end of every chapter for fast revision',
        'Covers Governor Generals, Tribal/Peasant Uprisings & Press Acts'
      ],
      sampleChapters: [
        {
          title: 'Chapter 5: The Revolt of 1857 & Its Aftermath',
          summary: 'Causes (Political, Socio-religious, Military, Economic), Key leaders (Rani Laxmibai, Nana Saheb, Kunwar Singh), Reasons for failure, and GOI Act 1858 reforms.'
        },
        {
          title: 'Chapter 14: Non-Cooperation Movement & Khilafat',
          summary: 'Rowlatt Act, Jallianwala Bagh Tragedy, Nagpur Session 1920, Chauri Chaura incident, and Swarajist Party formation.'
        }
      ]
    },
    {
      id: 'bk-history-art-culture',
      title: 'Indian Art and Culture for Civil Services',
      author: 'Nitin Singhania',
      edition: '4th Edition with Colour Illustrations',
      publisher: 'McGraw Hill',
      category: 'History',
      exam: ['UPSC CSE', 'State PCS'],
      mrp: '₹895',
      discountPrice: '₹620',
      discountPercent: '30% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Indian-Art-Culture-Nitin-Singhania/dp/9355321500',
        flipkart: 'https://www.flipkart.com/indian-art-culture-nitin-singhania/p/itm556677889'
      },
      pdfFileName: 'Nitin_Singhania_Art_and_Culture_Notes.pdf',
      pdfSize: '31.2 MB',
      rating: 4.8,
      reviewsCount: '15,400+',
      keyHighlights: [
        'Visual diagrams for Temple Architecture (Nagara, Dravida, Vesara)',
        'Comprehensive breakdown of UNESCO World Heritage Sites in India',
        'Classical Dances, Music, Folk Arts & Martial Arts of India'
      ],
      sampleChapters: [
        {
          title: 'Chapter 1: Indian Architecture, Sculpture & Pottery',
          summary: 'Indus Valley Civilisation Seals & Bronzes, Mauryan Pillars, Stupas (Sanchi & Bharhut), Rock-cut caves (Ajanta & Ellora), and Temple styles.'
        }
      ]
    },
    {
      id: 'bk-geography-gcleong',
      title: 'Certificate Physical and Human Geography',
      author: 'G.C. Leong',
      edition: 'Oxford University Press Classic',
      publisher: 'Oxford University Press',
      category: 'Geography',
      exam: ['UPSC CSE', 'State PCS', 'SSC CGL'],
      mrp: '₹425',
      discountPrice: '₹315',
      discountPercent: '26% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Certificate-Physical-Human-Geography-Cheng/dp/0195628160',
        flipkart: 'https://www.flipkart.com/certificate-physical-human-geography/p/itm998877665'
      },
      pdfFileName: 'GC_Leong_Physical_Geography_Full_Book_PDF.pdf',
      pdfSize: '16.5 MB',
      rating: 4.9,
      reviewsCount: '21,000+',
      keyHighlights: [
        'Fundamental text for Geomorphology, Climatology & Oceanography',
        'Clear diagrams explaining Plate Tectonics, Weathering, River Landforms',
        'Detailed breakdown of World Climate Zones (Equatorial to Tundra)'
      ],
      sampleChapters: [
        {
          title: 'Chapter 1: The Earth and the Universe',
          summary: 'Solar System, Latitude & Longitude, International Date Line, Rotation vs Revolution, and Seasons.'
        },
        {
          title: 'Chapter 14: Climate & Weather Systems',
          summary: 'Atmospheric Pressure Belts, Planetary Winds, Monsoons, Cyclones (Tropical vs Temperate), and El Nino.'
        }
      ]
    },
    {
      id: 'bk-environment-shankar',
      title: 'Environment & Ecology for Civil Services',
      author: 'Shankar IAS Academy',
      edition: '10th Updated Edition',
      publisher: 'Shankar IAS Publications',
      category: 'Environment',
      exam: ['UPSC CSE', 'State PCS'],
      mrp: '₹550',
      discountPrice: '₹410',
      discountPercent: '25% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Environment-Shankar-IAS/dp/8193821008',
        flipkart: 'https://www.flipkart.com/environment-shankar-ias/p/itm223344556'
      },
      pdfFileName: 'Shankar_IAS_Environment_HighYield_Notes.pdf',
      pdfSize: '24.0 MB',
      rating: 4.8,
      reviewsCount: '19,800+',
      keyHighlights: [
        'Complete list of Ramsar Wetland Sites & National Parks in India',
        'IUCN Red List Categories & Endangered Species in India',
        'Wildlife Protection Act 1972 & Environmental Protection Act 1986'
      ],
      sampleChapters: [
        {
          title: 'Chapter 1: Ecology & Ecosystem Functions',
          summary: 'Ecosystem structure, Trophic levels, Energy flow (10% Rule), Ecological Pyramids, and Bioaccumulation vs Biomagnification.'
        }
      ]
    },
    {
      id: 'bk-quant-aggarwal',
      title: 'Quantitative Aptitude for Competitive Examinations',
      author: 'Dr. R.S. Aggarwal',
      edition: 'Revised Standard Edition',
      publisher: 'S. Chand Publishing',
      category: 'Aptitude & Reasoning',
      exam: ['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC CSAT', 'State PCS'],
      mrp: '₹899',
      discountPrice: '₹599',
      discountPercent: '33% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Quantitative-Aptitude-Competitive-Examinations-Aggarwal/dp/9352534026',
        flipkart: 'https://www.flipkart.com/quantitative-aptitude-competitive-examinations-rs-aggarwal/p/itm445566778'
      },
      pdfFileName: 'RS_Aggarwal_Quantitative_Aptitude_Solved_PDF.pdf',
      pdfSize: '35.4 MB',
      rating: 4.9,
      reviewsCount: '45,000+',
      keyHighlights: [
        '5,000+ Solved MCQs with shortcut tricks & formula tables',
        'Covers Arithmetic, Algebra, Geometry, Mensuration & Data Interpretation',
        'Essential for SSC CGL Tier 1 & 2, Bank PO & CSAT'
      ],
      sampleChapters: [
        {
          title: 'Chapter 11: Compound Interest & Simple Interest Shortcuts',
          summary: 'Difference formula for 2 yrs and 3 yrs, Population growth problems, Effective rate of interest, and instalment payments.'
        }
      ]
    },
    {
      id: 'bk-reasoning-aggarwal',
      title: 'A Modern Approach to Verbal & Non-Verbal Reasoning',
      author: 'Dr. R.S. Aggarwal',
      edition: '2025 Revised Edition',
      publisher: 'S. Chand Publishing',
      category: 'Aptitude & Reasoning',
      exam: ['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC CSAT'],
      mrp: '₹950',
      discountPrice: '₹660',
      discountPercent: '30% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Modern-Approach-Verbal-Non-Verbal-Reasoning/dp/9352533828',
        flipkart: 'https://www.flipkart.com/verbal-non-verbal-reasoning-rs-aggarwal/p/itm667788990'
      },
      pdfFileName: 'RS_Aggarwal_Verbal_NonVerbal_Reasoning_PDF.pdf',
      pdfSize: '29.8 MB',
      rating: 4.8,
      reviewsCount: '38,000+',
      keyHighlights: [
        'Covers Coding-Decoding, Syllogism, Seating Arrangements & Puzzles',
        'Non-verbal visual patterns, Mirror images, Paper folding & Venn Diagrams'
      ],
      sampleChapters: [
        {
          title: 'Chapter 4: Syllogisms & Logical Deductions',
          summary: 'Rules of Venn Diagram method, All A are B, Some B are C, No C is D, Possibility cases, and Either-Or cases.'
        }
      ]
    },
    {
      id: 'bk-english-norman',
      title: 'Word Power Made Easy',
      author: 'Norman Lewis',
      edition: 'Pocket Classic Mass Edition',
      publisher: 'Goyal Publishers',
      category: 'General English',
      exam: ['SSC CGL', 'IBPS PO', 'UPSC CSAT', 'CAT', 'NDA/CDS'],
      mrp: '₹250',
      discountPrice: '₹140',
      discountPercent: '44% OFF',
      buyLinks: {
        amazon: 'https://www.amazon.in/Word-Power-Made-Norman-Lewis/dp/8183071007',
        flipkart: 'https://www.flipkart.com/word-power-made-easy-norman-lewis/p/itm778899001'
      },
      pdfFileName: 'Word_Power_Made_Easy_Norman_Lewis_Full_PDF.pdf',
      pdfSize: '8.2 MB',
      rating: 4.9,
      reviewsCount: '85,000+',
      keyHighlights: [
        'Root word technique (Greek & Latin roots) to build vocabulary',
        'Self-testing quizzes at the end of every 3-page session',
        'Master 3,000+ high-frequency English vocabulary words'
      ],
      sampleChapters: [
        {
          title: 'Session 1: How to Talk About Personality Types',
          summary: 'Roots: Ego (I), Alter (Other), Intro (Inward), Extro (Outward), Vert (Turn), Mis (Hate), Anthropos (Mankind), Gyne (Woman), Gamos (Marriage).'
        }
      ]
    }
  ];

  // Government & NCERT Official Reports List
  const officialReportsList: BookItem[] = [
    {
      id: 'rep-budget-2026',
      title: 'Union Budget 2026-27 Official Key Highlights & Analysis',
      author: 'Ministry of Finance, Govt of India',
      edition: '2026 Official Publication',
      publisher: 'Press Information Bureau (PIB)',
      category: 'Economy',
      exam: ['UPSC CSE', 'State PCS', 'IBPS PO', 'SSC CGL'],
      mrp: 'Free',
      discountPrice: 'Free',
      discountPercent: '100% Free',
      buyLinks: {
        amazon: 'https://www.indiabudget.gov.in',
        flipkart: 'https://www.indiabudget.gov.in'
      },
      pdfFileName: 'Union_Budget_2026_27_PIB_Summary.pdf',
      pdfSize: '14.2 MB',
      rating: 5.0,
      reviewsCount: 'Govt Doc',
      keyHighlights: [
        'Tax Slab Changes under New Tax Regime',
        'Capital Expenditure target allocation (₹11.11 Lakh Crore)',
        'PM Gati Shakti & Green Hydrogen Mission budget'
      ],
      sampleChapters: [
        {
          title: 'Section I: Macroeconomic Framework & Capex',
          summary: 'Detailed Breakdown of Revenue Receipts, Capital Receipts, Fiscal Deficit target of 4.5% of GDP, and Net Tax Revenues.'
        }
      ]
    },
    {
      id: 'rep-econ-survey',
      title: 'Economic Survey 2025-26 Volume I & II Complete Summary',
      author: 'Chief Economic Advisor (CEA), Govt of India',
      edition: '2025-26 Edition',
      publisher: 'Department of Economic Affairs',
      category: 'Economy',
      exam: ['UPSC CSE', 'State PCS'],
      mrp: 'Free',
      discountPrice: 'Free',
      discountPercent: '100% Free',
      buyLinks: {
        amazon: 'https://www.econsurvey.gov.in',
        flipkart: 'https://www.econsurvey.gov.in'
      },
      pdfFileName: 'Economic_Survey_2025_26_Complete_Brief.pdf',
      pdfSize: '21.5 MB',
      rating: 4.9,
      reviewsCount: 'Govt Doc',
      keyHighlights: [
        'GDP Growth projection (6.5% - 7.0%)',
        'Agriculture sector performance & Inflation management',
        'Foreign Exchange Reserves & External Sector resilience'
      ],
      sampleChapters: [
        {
          title: 'Chapter 1: State of the Economy - An Overview',
          summary: 'Review of domestic demand drivers, private investment recovery, digital public infrastructure impact, and global economic spillovers.'
        }
      ]
    },
    {
      id: 'rep-ncert-set',
      title: 'NCERT Class 6 to 12 Essential Textbooks Compendium Set',
      author: 'NCERT New Delhi',
      edition: 'National Curriculum Framework 2025-26',
      publisher: 'NCERT Official',
      category: 'History',
      exam: ['UPSC CSE', 'State PCS', 'SSC CGL', 'NDA/CDS'],
      mrp: 'Free',
      discountPrice: 'Free',
      discountPercent: '100% Free',
      buyLinks: {
        amazon: 'https://ncert.nic.in/textbook.php',
        flipkart: 'https://ncert.nic.in/textbook.php'
      },
      pdfFileName: 'NCERT_History_Geog_Polity_Class_6_12_Compendium.pdf',
      pdfSize: '48.0 MB',
      rating: 5.0,
      reviewsCount: 'NCERT Standard',
      keyHighlights: [
        'Our Pasts I, II, III (History Class 6-8)',
        'Our Habitat & India Physical Environment (Geography Class 6-11)',
        'Indian Constitution at Work (Polity Class 11)'
      ],
      sampleChapters: [
        {
          title: 'Class 11 Polity: Indian Constitution at Work',
          summary: 'Why do we need a Constitution, Rights in the Indian Constitution, Election and Representation, Executive, Legislature, Judiciary, and Federalism.'
        }
      ]
    }
  ];

  // Combine list based on tab
  const activeBookPool = activeTab === 'recommended-books'
    ? recommendedBooks
    : activeTab === 'reports-ncert'
    ? officialReportsList
    : userPdfList;

  // Filter Pool
  const filteredBooks = activeBookPool.filter(b => {
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    if (selectedExam !== 'All' && !b.exam.includes(selectedExam)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = (b.title + ' ' + b.author + ' ' + b.category + ' ' + b.keyHighlights.join(' ')).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const handleOpenBuyLink = (url: string, storeName: string) => {
    setToastMessage(`Redirecting to ${storeName} store page...`);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadPDF = (book: BookItem) => {
    setToastMessage(`Downloading ${book.pdfFileName} (${book.pdfSize})...`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenPdfViewer = (book: BookItem) => {
    setActivePdfBook(book);
    setSelectedChapterIdx(0);
    setPdfZoom(100);
  };

  const handleAddUserPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BookItem = {
      id: `usr-pdf-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Uploaded Note',
      edition: 'User Custom Edition',
      publisher: 'My Local Vault',
      category: newCategory,
      exam: [newExam],
      mrp: 'Free',
      discountPrice: 'Free',
      discountPercent: '100% Free',
      buyLinks: {
        amazon: newBuyLink.trim() || 'https://www.amazon.in',
        flipkart: newBuyLink.trim() || 'https://www.flipkart.com'
      },
      pdfFileName: newPdfFile ? newPdfFile.name : `${newTitle.replace(/\s+/g, '_')}.pdf`,
      pdfSize: newPdfSize,
      rating: 5.0,
      reviewsCount: 'Personal',
      keyHighlights: ['User uploaded study material', 'Instant PDF reader enabled'],
      sampleChapters: [
        {
          title: 'Chapter 1: Custom Notes Summary',
          summary: 'User uploaded study document contents. You can read, bookmark, and download this file anytime.'
        }
      ],
      isUserUploaded: true
    };

    setUserPdfList(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setActiveTab('my-pdfs');
    setToastMessage(`Successfully added "${newTitle}" to your PDF Vault!`);

    // Reset form
    setNewTitle('');
    setNewAuthor('');
    setNewBuyLink('');
    setNewPdfFile(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteUserPdf = (id: string) => {
    setUserPdfList(prev => prev.filter(p => p.id !== id));
    setToastMessage('Removed book PDF from your library.');
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      <div className="p-6 md:p-8 rounded-2xl bg-[#0F172A] text-white space-y-3 shadow-xl border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-800/50">
          <Library className="w-4 h-4 text-indigo-400" />
          <span>Standard Textbooks, Official Store Buy Links & PDF E-Books</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              Standard Books & PDF Digital Library
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
              Find verified standard reference books (Laxmikanth, Ramesh Singh, Spectrum, RS Aggarwal, NCERT) with official buy links (Amazon/Flipkart), downloadable PDFs & in-app reader.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Book or PDF</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('recommended-books')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'recommended-books'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-amber-300" />
            <span>Standard Recommended Books ({recommendedBooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports-ncert')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'reports-ncert'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Govt Reports & NCERT PDFs ({officialReportsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-pdfs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'my-pdfs'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>My Uploaded PDFs ({userPdfList.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-400">Subject:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none"
            >
              {['All', 'Polity', 'Economy', 'History', 'Geography', 'Environment', 'Aptitude & Reasoning', 'General English'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-400">Target Exam:</span>
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

        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search books by title, author, topic..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No books found matching your current filter.</p>
            <p className="text-xs">Try selecting "All" or resetting your search filter.</p>
          </div>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition">
              
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
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    By {book.author} • <span className="text-slate-500 font-normal">{book.edition}</span>
                  </p>
                </div>

                {/* Pricing & Discount Badge */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hardcopy MRP</span>
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

              {/* Action Footer: Buy Links & PDF Controls */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                
                {/* Store Buy Links Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenBuyLink(book.buyLinks.amazon, 'Amazon India')}
                    className="py-2 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800 transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Buy on Amazon</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </button>

                  <button
                    onClick={() => handleOpenBuyLink(book.buyLinks.flipkart, 'Flipkart')}
                    className="py-2 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-900 dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-800 transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Buy on Flipkart</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </button>
                </div>

                {/* PDF In-App Reader & Download Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPdfViewer(book)}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View / Read PDF</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(book)}
                    title={`Download ${book.pdfFileName}`}
                    className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{book.pdfSize}</span>
                  </button>

                  {book.isUserUploaded && (
                    <button
                      onClick={() => handleDeleteUserPdf(book.id)}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Delete User PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* ================= MODAL 1: INTERACTIVE IN-APP PDF READER ================= */}
      {activePdfBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Reader Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{activePdfBook.title}</h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {activePdfBook.pdfFileName} • {activePdfBook.pdfSize}
                  </p>
                </div>
              </div>

              {/* Reader Controls */}
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

                <button
                  onClick={() => handleDownloadPDF(activePdfBook)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                <button
                  onClick={() => setActivePdfBook(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Main Reader Workspace */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Sidebar Chapter Index */}
              <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 space-y-3 overflow-y-auto shrink-0 hidden md:block text-xs">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block">Table of Contents</span>
                <div className="space-y-1">
                  {activePdfBook.sampleChapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedChapterIdx(idx)}
                      className={`w-full text-left p-2.5 rounded-lg font-medium transition ${
                        selectedChapterIdx === idx
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {ch.title}
                    </button>
                  ))}
                </div>

                {/* Buy Physical Paperback Promo Box */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-white block">Need the Paperback Edition?</span>
                  <p className="text-[10px] text-slate-500">Order physical copy with official discount.</p>
                  <button
                    onClick={() => handleOpenBuyLink(activePdfBook.buyLinks.amazon, 'Amazon')}
                    className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Buy {activePdfBook.discountPrice} on Amazon</span>
                  </button>
                </div>
              </div>

              {/* Reader Document Content Stage */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-100 dark:bg-slate-900 flex justify-center">
                <div
                  style={{ zoom: `${pdfZoom}%` }}
                  className="w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-lg space-y-6 text-slate-800 dark:text-slate-100 font-serif leading-relaxed"
                >
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-end font-sans">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{activePdfBook.category} • Official Reader</span>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans mt-1">{activePdfBook.title}</h2>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Page 1 of 340</span>
                  </div>

                  {activePdfBook.sampleChapters[selectedChapterIdx] ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold font-sans text-indigo-900 dark:text-indigo-300 border-l-4 border-indigo-600 pl-3">
                        {activePdfBook.sampleChapters[selectedChapterIdx].title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-sans">
                        {activePdfBook.sampleChapters[selectedChapterIdx].summary}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm font-sans text-slate-500">Full textbook PDF document preview loaded.</p>
                  )}

                  {/* Highlight Box */}
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 font-sans text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <strong className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Exam High-Yield Revision Note:</span>
                    </strong>
                    <p>
                      This chapter forms 15–20% of previous 10-year official question weightage. Focus on key definitions and statutory timelines.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD CUSTOM BOOK OR PDF FORM ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Custom Book or PDF Link</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserPdfSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Book / Document Title *</label>
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
                  <label className="font-bold text-slate-700 dark:text-slate-300">Author / Publisher</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    placeholder="e.g. Self / Vision IAS"
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
                    {['Polity', 'Economy', 'History', 'Geography', 'Environment', 'Aptitude & Reasoning', 'General English'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Online Store Buy Link (Amazon / Flipkart / Publisher URL)</label>
                <input
                  type="url"
                  value={newBuyLink}
                  onChange={e => setNewBuyLink(e.target.value)}
                  placeholder="e.g. https://www.amazon.in/dp/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Upload PDF Attachment File</label>
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
                  Save Book to Library
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
