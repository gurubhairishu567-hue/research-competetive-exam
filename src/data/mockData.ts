import { Exam, CurrentAffairItem, Question, MockTest, NoteItem, Flashcard, ResourceItem, StudyPlan, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Gurubhai Rishu",
  email: "gurubhairishu567@gmail.com",
  targetExam: "UPSC Civil Services",
  prepLevel: "Intermediate",
  dailyTargetMinutes: 240,
  studyTimeTodayMinutes: 165,
  questionsSolvedToday: 38,
  accuracyRate: 78.5,
  testsCompletedCount: 12,
  streakDays: 14,
};

export const SAMPLE_EXAMS: Exam[] = [
  {
    id: 'upsc-cse',
    name: 'UPSC Civil Services Examination (CSE)',
    shortName: 'UPSC CSE',
    category: 'UPSC',
    conductingBody: 'Union Public Service Commission',
    qualification: 'Bachelor\'s Degree in any discipline from a recognized University',
    ageLimit: '21 to 32 years (Relaxations for reserved categories)',
    attempts: '6 attempts (General), 9 attempts (OBC), Unlimited (SC/ST up to age limit)',
    frequency: 'Annual',
    difficulty: 'Extreme',
    description: 'The premier national competitive examination for entry into IAS, IPS, IFS, IRS, and other Group A/B Central Services.',
    upcomingDate: '2026-05-24',
    competitionLevel: '~1,000,000 applicants for ~1,000 vacancies (0.1% final selection rate)',
    stages: ['Prelims (Objective)', 'Mains (Written Descriptive)', 'Personality Test (Interview)'],
    subjects: ['Indian Polity & Governance', 'Indian & World History', 'Geography', 'Indian Economy', 'Environment & Ecology', 'Science & Technology', 'General Science', 'Current Affairs', 'Ethics & Integrity'],
    examPattern: [
      {
        stage: 'Prelims (Paper 1 - GS)',
        duration: '2 Hours',
        totalMarks: 200,
        negativeMarking: '1/3rd (0.66 marks deducted)',
        sections: [
          { name: 'General Studies Paper 1', questions: 100, marks: 200 }
        ]
      },
      {
        stage: 'Prelims (Paper 2 - CSAT)',
        duration: '2 Hours',
        totalMarks: 200,
        negativeMarking: '1/3rd (0.83 marks deducted)',
        sections: [
          { name: 'CSAT (Qualifying 33%)', questions: 80, marks: 200 }
        ]
      },
      {
        stage: 'Mains (9 Written Papers)',
        duration: '3 Hours per paper',
        totalMarks: 1750,
        negativeMarking: 'N/A (Descriptive)',
        sections: [
          { name: 'Paper A & B (Languages - Qualifying)', questions: 1, marks: 300 },
          { name: 'Paper I (Essay)', questions: 2, marks: 250 },
          { name: 'Paper II - V (GS I, II, III, IV)', questions: 80, marks: 1000 },
          { name: 'Paper VI & VII (Optional Subject Paper 1 & 2)', questions: 10, marks: 500 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'Indian Polity & Constitution',
        topics: [
          { id: 'pol-1', title: 'Constitutional Framework & Preamble', completed: true },
          { id: 'pol-2', title: 'Fundamental Rights & Duties', completed: true },
          { id: 'pol-3', title: 'Directive Principles of State Policy (DPSP)', completed: false },
          { id: 'pol-4', title: 'Parliament & State Legislatures', completed: true },
          { id: 'pol-5', title: 'Judiciary: Supreme Court & High Courts', completed: false },
          { id: 'pol-6', title: 'Federal System & Centre-State Relations', completed: false },
          { id: 'pol-7', title: 'Constitutional & Non-Constitutional Bodies', completed: false },
        ]
      },
      {
        subject: 'Indian Economy',
        topics: [
          { id: 'eco-1', title: 'National Income & GDP Accounting', completed: true },
          { id: 'eco-2', title: 'Inflation & Monetary Policy (RBI)', completed: true },
          { id: 'eco-3', title: 'Fiscal Policy, Union Budget & Taxation', completed: false },
          { id: 'eco-4', title: 'Banking System & Financial Markets', completed: false },
          { id: 'eco-5', title: 'Agriculture & Land Reforms', completed: false },
          { id: 'eco-6', title: 'Balance of Payments & Foreign Trade', completed: false },
        ]
      },
      {
        subject: 'Environment & Ecology',
        topics: [
          { id: 'env-1', title: 'Ecosystem Dynamics & Biodiversity', completed: true },
          { id: 'env-2', title: 'Climate Change, COP Conferences & Agreements', completed: true },
          { id: 'env-3', title: 'Pollution, Waste & Environmental Acts', completed: false },
          { id: 'env-4', title: 'Protected Areas: National Parks & Sanctuaries', completed: false },
        ]
      }
    ],
    prepStrategy: [
      'Master NCERTs (Class 6-12) for foundational conceptual clarity.',
      'Read Laxmikanth for Indian Polity and Ramesh Singh/Sanjiv Verma for Indian Economy.',
      'Solve previous 10 years PYQs repeatedly to understand examiner mindset.',
      'Daily current affairs reading (The Hindu/Indian Express) linked with static syllabus.',
      'Attempt 30+ full-length Prelims mocks and practice answer writing for Mains early on.'
    ],
    recommendedResources: [
      'Indian Polity by M. Laxmikanth',
      'NCERT History & Geography (Class 11-12)',
      'Indian Economy by Nitin Singhania / Ramesh Singh',
      'Environment by Shankar IAS',
      'Economic Survey & Union Budget 2026 Document',
      'PIB (Press Information Bureau) & NITI Aayog Reports'
    ]
  },
  {
    id: 'ssc-cgl',
    name: 'SSC Combined Graduate Level (CGL)',
    shortName: 'SSC CGL',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission',
    qualification: 'Bachelor\'s Degree in any discipline',
    ageLimit: '18 to 32 years (varies by post code)',
    attempts: 'Unlimited until upper age limit',
    frequency: 'Annual',
    difficulty: 'High',
    description: 'National recruitment for Group B and C posts in Ministries, Departments, and Organizations of the Government of India.',
    upcomingDate: '2026-07-15',
    competitionLevel: '~2,500,000 applicants for ~15,000 posts',
    stages: ['Tier I (Computer Based Test)', 'Tier II (Computer Based Test & Skill Test)'],
    subjects: ['Quantitative Aptitude', 'Reasoning & General Intelligence', 'English Language', 'General Awareness', 'Computer Knowledge'],
    examPattern: [
      {
        stage: 'Tier I (Screening)',
        duration: '60 Minutes',
        totalMarks: 200,
        negativeMarking: '0.50 marks per wrong answer',
        sections: [
          { name: 'General Intelligence & Reasoning', questions: 25, marks: 50 },
          { name: 'General Awareness', questions: 25, marks: 50 },
          { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
          { name: 'English Comprehension', questions: 25, marks: 50 }
        ]
      },
      {
        stage: 'Tier II (Final Merit)',
        duration: '2 Hours 15 Mins',
        totalMarks: 390,
        negativeMarking: '1 mark per wrong answer in Session 1',
        sections: [
          { name: 'Maths & Reasoning', questions: 60, marks: 180 },
          { name: 'English & General Awareness', questions: 70, marks: 210 },
          { name: 'Computer Knowledge Test', questions: 20, marks: 60 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'Quantitative Aptitude',
        topics: [
          { id: 'qa-1', title: 'Number Systems & Simplification', completed: true },
          { id: 'qa-2', title: 'Percentage, Profit & Loss, Discount', completed: true },
          { id: 'qa-3', title: 'Ratio & Proportion, Mixture & Allegation', completed: true },
          { id: 'qa-4', title: 'Time & Work, Pipes & Cisterns', completed: false },
          { id: 'qa-5', title: 'Algebra & Quadratic Equations', completed: false },
          { id: 'qa-6', title: 'Geometry & Mensuration 2D/3D', completed: false },
          { id: 'qa-7', title: 'Trigonometry & Heights & Distances', completed: false },
        ]
      },
      {
        subject: 'Reasoning',
        topics: [
          { id: 'rea-1', title: 'Coding-Decoding & Analogy', completed: true },
          { id: 'rea-2', title: 'Syllogism & Logical Statements', completed: true },
          { id: 'rea-3', title: 'Blood Relations & Direction Sense', completed: true },
          { id: 'rea-4', title: 'Non-Verbal Reasoning & Paper Folding', completed: false },
        ]
      }
    ],
    prepStrategy: [
      'Focus on speed and calculation accuracy for Quant.',
      'Learn tables up to 30, squares up to 50, cubes up to 30.',
      'Practice 100+ PYQ sets to master recurring question types.',
      'Daily 30 minutes English vocabulary and grammar rules practice.'
    ],
    recommendedResources: [
      'Quantitative Aptitude by R.S. Aggarwal / Pinnacle Mathematics',
      'A Mirror of Common Errors by A.K. Singh',
      'Word Power Made Easy by Norman Lewis',
      'Lucent General Knowledge'
    ]
  },
  {
    id: 'ibps-po',
    name: 'IBPS Probationary Officer (PO)',
    shortName: 'IBPS PO',
    category: 'Banking',
    conductingBody: 'Institute of Banking Personnel Selection',
    qualification: 'Graduation Degree in any stream',
    ageLimit: '20 to 30 years',
    attempts: 'Unlimited until age limit',
    frequency: 'Annual',
    difficulty: 'High',
    description: 'Selection for Officer scale I posts across participating Public Sector Banks in India.',
    upcomingDate: '2026-10-10',
    competitionLevel: '~800,000 candidates for ~4,500 PO seats',
    stages: ['Prelims', 'Mains (Objective + Descriptive)', 'Interview'],
    subjects: ['Reasoning Ability & Computer Aptitude', 'Quantitative Aptitude / Data Analysis', 'General / Economy / Banking Awareness', 'English Language'],
    examPattern: [
      {
        stage: 'Prelims',
        duration: '1 Hour (20 mins per section)',
        totalMarks: 100,
        negativeMarking: '0.25 marks per wrong answer',
        sections: [
          { name: 'English Language', questions: 30, marks: 30 },
          { name: 'Quantitative Aptitude', questions: 35, marks: 35 },
          { name: 'Reasoning Ability', questions: 35, marks: 35 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'Data Interpretation & Quant',
        topics: [
          { id: 'bqa-1', title: 'Pie Charts, Line Graphs & Tables DI', completed: true },
          { id: 'bqa-2', title: 'Caselet DI & Missing Data DI', completed: false },
          { id: 'bqa-3', title: 'Quadratic Inequalities & Number Series', completed: true }
        ]
      }
    ],
    prepStrategy: [
      'Master high-level Puzzles and Seating Arrangement sets for Mains.',
      'Daily practice of complex Data Interpretation sets.',
      'Focus on Banking & Financial Awareness current updates.'
    ],
    recommendedResources: [
      'Ace Reasoning & Ace Quant by Adda247',
      'Fast Track Objective Arithmetic by Rajesh Verma',
      'Banking Awareness by Arihant'
    ]
  },
  {
    id: 'rrb-ntpc',
    name: 'RRB NTPC (Non-Technical Popular Categories)',
    shortName: 'RRB NTPC',
    category: 'Railway',
    conductingBody: 'Railway Recruitment Boards',
    qualification: '12th Pass or Graduate depending on post',
    ageLimit: '18 to 33 years',
    attempts: 'Unlimited until upper age limit',
    frequency: 'Periodic',
    difficulty: 'Moderate',
    description: 'Recruitment for Station Master, Goods Guard, Commercial Apprentice, Junior Clerk, Typist posts in Indian Railways.',
    upcomingDate: '2026-09-20',
    competitionLevel: '~10,000,000 applicants for ~35,000 positions',
    stages: ['CBT 1', 'CBT 2', 'Typing / CBAT Skill Test', 'Document Verification'],
    subjects: ['Mathematics', 'General Intelligence & Reasoning', 'General Awareness & Science'],
    examPattern: [
      {
        stage: 'CBT 1',
        duration: '90 Minutes',
        totalMarks: 100,
        negativeMarking: '1/3rd mark per wrong answer',
        sections: [
          { name: 'General Awareness', questions: 40, marks: 40 },
          { name: 'Mathematics', questions: 30, marks: 30 },
          { name: 'General Intelligence & Reasoning', questions: 30, marks: 30 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'General Science & GK',
        topics: [
          { id: 'rrb-1', title: 'Physics Basics: Motion, Light, Electricity', completed: true },
          { id: 'rrb-2', title: 'Chemistry: Periodic Table & Chemical Reactions', completed: true },
          { id: 'rrb-3', title: 'Biology: Human Body Systems & Diseases', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'Revise NCERT Science Class 9 & 10 thoroughly.',
      'Solve previous RRB NTPC papers from 2016 to 2024.',
      'Focus on speed in CBT 1 where 100 questions must be done in 90 mins.'
    ],
    recommendedResources: [
      'Rukmini Railway General Science & Static GK',
      'Speedy General Science',
      'Kiran RRB NTPC Chapterwise Solved Papers'
    ]
  },
  {
    id: 'up-police-constable',
    name: 'UP Police Constable Recruitment',
    shortName: 'UP Police Constable',
    category: 'UP Police',
    conductingBody: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)',
    qualification: '10+2 (Intermediate) Pass from a recognized Board',
    ageLimit: '18 to 22 years (Male), 18 to 25 years (Female) [Age relaxation applicable]',
    attempts: 'Unlimited until age limit',
    frequency: 'Annual / As per vacancy notification',
    difficulty: 'Moderate',
    description: 'State-level recruitment exam for Civil Police Constables, PAC Constables, and Fireman in Uttar Pradesh Police.',
    upcomingDate: '2026-06-15',
    competitionLevel: '~4,800,000 applicants for ~60,244 vacancies',
    stages: ['Written Examination (OMR / CBT)', 'Document Verification & PST', 'Physical Efficiency Test (PET)', 'Medical Examination'],
    subjects: ['General Hindi (सामान्य हिंदी)', 'General Knowledge (सामान्य ज्ञान)', 'Numerical & Mental Ability', 'Mental Aptitude / IQ Test / Reasoning'],
    examPattern: [
      {
        stage: 'Written Examination',
        duration: '2 Hours (120 Minutes)',
        totalMarks: 300,
        negativeMarking: '0.50 marks per incorrect answer',
        sections: [
          { name: 'General Knowledge', questions: 38, marks: 76 },
          { name: 'General Hindi', questions: 37, marks: 74 },
          { name: 'Numerical & Mental Ability', questions: 38, marks: 76 },
          { name: 'Mental Aptitude / Reasoning', questions: 37, marks: 74 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'General Hindi (सामान्य हिंदी)',
        topics: [
          { id: 'uppc-h1', title: 'हिंदी और अन्य भारतीय भाषाएं & व्याकरण', completed: true },
          { id: 'uppc-h2', title: 'वर्णमाला, तत्सम-तद्भव, पर्यायवाची & विलोम शब्द', completed: true },
          { id: 'uppc-h3', title: 'संधि, समास, कारक, वचन & लिंग', completed: false },
          { id: 'uppc-h4', title: 'मुहावरे और लोकोक्तियां & रस, छंद, अलंकार', completed: false }
        ]
      },
      {
        subject: 'General Knowledge (सामान्य ज्ञान)',
        topics: [
          { id: 'uppc-gk1', title: 'UP Special GK: Geography, History & Culture', completed: true },
          { id: 'uppc-gk2', title: 'Indian Constitution & Internal Security', completed: true },
          { id: 'uppc-gk3', title: 'Human Rights, Revenue & Police System in UP', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'Master UP Special GK, Geography, and UP Police Administration.',
      'Practice General Hindi grammar rules and daily vocabulary.',
      'Solve 25+ previous year OMR question papers to increase speed and accuracy.'
    ],
    recommendedResources: [
      'Lucent Samanya Hindi & Samanya Gyan',
      'Ghatna Chakra UP Special Practice Book',
      'Youth Competition UP Police Constable Solved Papers'
    ]
  },
  {
    id: 'up-police-si',
    name: 'UP Police Sub Inspector (SI)',
    shortName: 'UP Police SI',
    category: 'UP Police',
    conductingBody: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)',
    qualification: 'Bachelor\'s Degree in any stream from a recognized University',
    ageLimit: '21 to 28 years (Age relaxations for reserved categories)',
    attempts: 'Unlimited until age limit',
    frequency: 'As per state government vacancy',
    difficulty: 'High',
    description: 'Premier executive recruitment for Sub Inspectors (Civil Police), Platoon Commander (PAC), and Fire Station Second Officer.',
    upcomingDate: '2026-08-10',
    competitionLevel: '~1,200,000 candidates for ~9,500 SI posts',
    stages: ['Online Written Examination (CBT)', 'Document Verification & PST', 'Physical Efficiency Test (PET)', 'Final Merit List'],
    subjects: ['General Hindi (सामान्य हिंदी)', 'Basic Law / Constitution & General Knowledge (मूल विधि, संविधान व सामान्य ज्ञान)', 'Numerical & Mental Ability Test', 'Mental Aptitude Test / Intelligence Test / Reasoning'],
    examPattern: [
      {
        stage: 'Online CBT Examination',
        duration: '2 Hours (120 Minutes)',
        totalMarks: 400,
        negativeMarking: 'No negative marking (Qualifying 35% per subject, 50% overall)',
        sections: [
          { name: 'General Hindi', questions: 40, marks: 100 },
          { name: 'Basic Law / Constitution / GK', questions: 40, marks: 100 },
          { name: 'Numerical & Mental Ability', questions: 40, marks: 100 },
          { name: 'Mental Aptitude / Reasoning', questions: 40, marks: 100 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'Basic Law & Constitution (मूल विधि एवं संविधान)',
        topics: [
          { id: 'upsi-l1', title: 'Indian Penal Code (IPC) & Criminal Procedure Code (CrPC)', completed: true },
          { id: 'upsi-l2', title: 'Motor Vehicles Act, Human Rights & Environmental Laws', completed: true },
          { id: 'upsi-l3', title: 'Indian Constitution: Preamble, Fundamental Rights & Judiciary', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'Focus heavily on Basic Law (Mool Vidhi) articles and landmark IPC/CrPC sections.',
      'Ensure minimum 35% marks cutoff in each individual section.',
      'Attempt daily sectional mock tests for Numerical Ability and Reasoning.'
    ],
    recommendedResources: [
      'Mool Vidhi va Samvidhan by Exampur / Ghatna Chakra',
      'Lucent Hindi & UP Police SI Solved Papers',
      'Testbook UPSI Online Test Series'
    ]
  },
  {
    id: 'ssc-chsl',
    name: 'SSC Combined Higher Secondary Level (CHSL)',
    shortName: 'SSC CHSL',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission (SSC)',
    qualification: '10+2 (Higher Secondary) Pass from a recognized Board',
    ageLimit: '18 to 27 years (Age relaxations apply)',
    attempts: 'Unlimited until upper age limit',
    frequency: 'Annual',
    difficulty: 'High',
    description: 'National recruitment exam for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO) in Central Govt Ministries.',
    upcomingDate: '2026-05-10',
    competitionLevel: '~3,200,000 applicants for ~4,500 posts',
    stages: ['Tier I (CBT Screening)', 'Tier II (CBT & Skill Test / Typing Test)', 'Document Verification'],
    subjects: ['English Language', 'General Intelligence & Reasoning', 'Quantitative Aptitude', 'General Awareness'],
    examPattern: [
      {
        stage: 'Tier I (Objective CBT)',
        duration: '60 Minutes',
        totalMarks: 200,
        negativeMarking: '0.50 marks per wrong answer',
        sections: [
          { name: 'English Language (Basic Knowledge)', questions: 25, marks: 50 },
          { name: 'General Intelligence', questions: 25, marks: 50 },
          { name: 'Quantitative Aptitude (Basic Arithmetic)', questions: 25, marks: 50 },
          { name: 'General Awareness', questions: 25, marks: 50 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'Quantitative Aptitude',
        topics: [
          { id: 'chsl-q1', title: 'Arithmetic: Percentages, Profit & Loss, Simple/Compound Interest', completed: true },
          { id: 'chsl-q2', title: 'Algebra & Basic Algebraic Identities', completed: true },
          { id: 'chsl-q3', title: 'Geometry & Mensuration (2D & 3D)', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'Focus on high-speed Arithmetic and English Grammar rules.',
      'Practice typing speed (35 wpm in English / 30 wpm in Hindi) for Tier II qualifying typing test.',
      'Solve previous 5 years SSC CHSL Tier 1 papers.'
    ],
    recommendedResources: [
      'Kiran SSC CHSL Chapterwise Solved Papers',
      'Neetu Singh English for Competitive Exams Vol 1',
      'Fast Track Objective Arithmetic by Rajesh Verma'
    ]
  },
  {
    id: 'ssc-gd',
    name: 'SSC GD Constable (General Duty)',
    shortName: 'SSC GD',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission (SSC)',
    qualification: '10th Class (Matriculation) Pass from a recognized Board',
    ageLimit: '18 to 23 years (Upper age relaxation for OBC/SC/ST)',
    attempts: 'Unlimited until age limit',
    frequency: 'Annual',
    difficulty: 'Moderate',
    description: 'Recruitment of General Duty Constables in BSF, CISF, CRPF, SSB, ITBP, AR, and SSF.',
    upcomingDate: '2026-11-20',
    competitionLevel: '~5,000,000 candidates for ~26,000 vacancies',
    stages: ['Computer Based Examination (CBE)', 'Physical Standard Test (PST) & PET', 'Detailed Medical Examination (DME)'],
    subjects: ['General Intelligence & Reasoning', 'General Knowledge & General Awareness', 'Elementary Mathematics', 'English / Hindi'],
    examPattern: [
      {
        stage: 'Computer Based Examination',
        duration: '60 Minutes',
        totalMarks: 160,
        negativeMarking: '0.25 marks per wrong answer',
        sections: [
          { name: 'General Intelligence & Reasoning', questions: 20, marks: 40 },
          { name: 'General Knowledge & Awareness', questions: 20, marks: 40 },
          { name: 'Elementary Mathematics', questions: 20, marks: 40 },
          { name: 'English or Hindi', questions: 20, marks: 40 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'Elementary Mathematics & Reasoning',
        topics: [
          { id: 'sscgd-m1', title: 'Number Systems, Decimals & Fractions', completed: true },
          { id: 'sscgd-m2', title: 'Ratio & Time, Time & Distance, Averages', completed: true },
          { id: 'sscgd-r1', title: 'Analogies, Similarities & Coding-Decoding', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'Master basic 10th-level math and reasoning speed tricks.',
      'Choose Hindi or English depending on comfort for scoring high marks.',
      'Maintain physical fitness for 5km run in 24 minutes (PET).'
    ],
    recommendedResources: [
      'Kiran SSC GD Constable Practice Work Book',
      'R.S. Aggarwal Modern Approach to Verbal & Non-Verbal Reasoning',
      'Lucent Samanya Gyan'
    ]
  },
  {
    id: 'ssc-mts',
    name: 'SSC Multi-Tasking Staff (MTS) & Havaldar',
    shortName: 'SSC MTS',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission (SSC)',
    qualification: 'Matriculation (10th Pass) from a recognized Board',
    ageLimit: '18 to 25 / 27 years depending on post code',
    attempts: 'Unlimited until age limit',
    frequency: 'Annual',
    difficulty: 'Moderate',
    description: 'National entry-level examination for Multi-Tasking (Non-Technical) Staff in central government offices and Havaldar in CBIC & CBN.',
    upcomingDate: '2026-09-05',
    competitionLevel: '~4,000,000 applicants for ~10,000 vacancies',
    stages: ['Computer Based Examination (Session I & II)', 'Physical Test (PET/PST - for Havaldar only)'],
    subjects: ['Numerical & Mathematical Ability', 'Reasoning Ability & Problem Solving', 'General Awareness', 'English Language & Comprehension'],
    examPattern: [
      {
        stage: 'Computer Based Test (Session 1)',
        duration: '45 Minutes',
        totalMarks: 120,
        negativeMarking: 'No negative marking in Session 1',
        sections: [
          { name: 'Numerical & Mathematical Ability', questions: 20, marks: 60 },
          { name: 'Reasoning Ability & Problem Solving', questions: 20, marks: 60 }
        ]
      },
      {
        stage: 'Computer Based Test (Session 2 - Final Merit)',
        duration: '45 Minutes',
        totalMarks: 150,
        negativeMarking: '1 mark deducted per wrong answer',
        sections: [
          { name: 'General Awareness', questions: 25, marks: 75 },
          { name: 'English Language & Comprehension', questions: 25, marks: 75 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'General Awareness & English',
        topics: [
          { id: 'mts-ga1', title: 'Indian History, Art & Culture, Geography', completed: true },
          { id: 'mts-ga2', title: 'Basic Science & Static GK', completed: true },
          { id: 'mts-eng1', title: 'Spotting Errors, Synonyms, Antonyms & Reading Comprehension', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'Session 2 (GK & English) determines final selection merit, so give maximum preparation time to GK and English.',
      'Practice 50+ previous year question sets.',
      'Focus on NCERT static GK basics.'
    ],
    recommendedResources: [
      'Lucent General Knowledge',
      'SP Bakshi Objective General English',
      'Youth Competition SSC MTS Practice Sets'
    ]
  },
  {
    id: 'ssc-steno',
    name: 'SSC Stenographer Grade C & D',
    shortName: 'SSC Steno',
    category: 'SSC',
    conductingBody: 'Staff Selection Commission (SSC)',
    qualification: '10+2 (Intermediate) Pass from a recognized Board',
    ageLimit: '18 to 30 years (Grade C), 18 to 27 years (Grade D)',
    attempts: 'Unlimited until age limit',
    frequency: 'Annual',
    difficulty: 'Moderate',
    description: 'Recruitment of Stenographers Grade C and Grade D in central government ministries and attached offices.',
    upcomingDate: '2026-10-25',
    competitionLevel: '~600,000 candidates for ~2,000 posts',
    stages: ['Computer Based Examination (CBT)', 'Stenography Skill Test (80 wpm for Grade D, 100 wpm for Grade C)'],
    subjects: ['General Intelligence & Reasoning', 'General Awareness', 'English Language & Comprehension'],
    examPattern: [
      {
        stage: 'Computer Based Test',
        duration: '2 Hours (120 Minutes)',
        totalMarks: 200,
        negativeMarking: '0.25 marks per wrong answer',
        sections: [
          { name: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
          { name: 'General Awareness', questions: 50, marks: 50 },
          { name: 'English Language & Comprehension', questions: 100, marks: 100 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'English & Reasoning',
        topics: [
          { id: 'steno-e1', title: 'Grammar Rules, Cloze Test & Active/Passive Voice', completed: true },
          { id: 'steno-e2', title: 'Direct/Indirect Speech & Sentence Improvement', completed: true },
          { id: 'steno-r1', title: 'Verbal & Non-Verbal Reasoning', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'English carries 50% weightage (100 marks out of 200), so master grammar, cloze tests, and comprehension.',
      'Practice shorthand dictation daily to build 80-100 wpm typing speed.',
      'Attempt 20 full mock tests for time management.'
    ],
    recommendedResources: [
      'Plinth to Paramount by Neetu Singh',
      'Pitman Shorthand Instructor & Key',
      'Kiran SSC Steno Solved Papers'
    ]
  },
  {
    id: 'sbi-po',
    name: 'SBI & Banking PO / Clerk Exams',
    shortName: 'Banking Exams (SBI / IBPS)',
    category: 'Banking',
    conductingBody: 'State Bank of India (SBI) & IBPS',
    qualification: 'Graduation Degree in any discipline',
    ageLimit: '20 to 30 years (PO), 20 to 28 years (Clerk)',
    attempts: '4 attempts (General PO), Unlimited for reserved categories',
    frequency: 'Annual',
    difficulty: 'Extreme',
    description: 'Premier banking officer recruitment for State Bank of India & Public Sector Banks across India.',
    upcomingDate: '2026-11-15',
    competitionLevel: '~1,000,000 applicants for ~2,000 SBI PO vacancies',
    stages: ['Phase I: Prelims (CBT)', 'Phase II: Mains (Objective + Descriptive)', 'Phase III: Psychometric Test, Group Discussion & Interview'],
    subjects: ['Reasoning Ability & Computer Aptitude', 'Data Analysis & Interpretation', 'General / Economy / Banking Awareness', 'English Language'],
    examPattern: [
      {
        stage: 'Phase I Prelims',
        duration: '1 Hour (20 mins per section)',
        totalMarks: 100,
        negativeMarking: '0.25 marks per wrong answer',
        sections: [
          { name: 'English Language', questions: 30, marks: 30 },
          { name: 'Quantitative Aptitude', questions: 35, marks: 35 },
          { name: 'Reasoning Ability', questions: 35, marks: 35 }
        ]
      },
      {
        stage: 'Phase II Mains',
        duration: '3 Hours 30 Mins',
        totalMarks: 250,
        negativeMarking: '0.25 marks per wrong answer',
        sections: [
          { name: 'Data Analysis & Interpretation', questions: 30, marks: 50 },
          { name: 'Reasoning & Computer Aptitude', questions: 40, marks: 50 },
          { name: 'General / Economy / Banking Awareness', questions: 50, marks: 60 },
          { name: 'English Language', questions: 35, marks: 40 },
          { name: 'Descriptive Test (Letter & Essay Writing)', questions: 2, marks: 50 }
        ]
      }
    ],
    syllabus: [
      {
        subject: 'Banking Awareness & Quantitative DI',
        topics: [
          { id: 'sbipo-b1', title: 'RBI Monetary Policy, Repo Rate & CRR/SLR', completed: true },
          { id: 'sbipo-b2', title: 'High-Level Data Interpretation (Radar, Missing, Caselets)', completed: true },
          { id: 'sbipo-b3', title: 'Advanced Seating Arrangements & Input-Output Puzzles', completed: false }
        ]
      }
    ],
    prepStrategy: [
      'Solve high-level Mains puzzles and Data Interpretation sets daily.',
      'Read Financial Express / Business Standard daily for Banking Awareness.',
      'Practice speed calculation and descriptive typing for Phase II.'
    ],
    recommendedResources: [
      'Ace Quant & Ace Reasoning by Adda247',
      'Word Power Made Easy by Norman Lewis',
      'AffairsCloud / Oliveboard Banking Awareness Capsule'
    ]
  }
];

export const SAMPLE_CURRENT_AFFAIRS: CurrentAffairItem[] = [
  {
    id: 'ca-th-1',
    title: 'The Hindu Analysis: Supreme Court Ruling on Sub-Classification within SC/ST Reservations',
    date: '2026-08-11',
    source: 'The Hindu',
    paperPage: 'Page 1 - Front Page & Page 6 Editorial',
    category: 'Polity',
    summary: 'The Hindu lead editorial analyzes the landmark 7-judge Supreme Court ruling permitting states to create sub-categories within SCs/STs for targeted affirmative action.',
    detailedContent: `### The Hindu Editorial & Lead Analysis: Sub-Classification of Scheduled Castes
*Published on Page 1 & Page 6 of today's edition of The Hindu.*

#### Background & Legal Context:
A 7-judge Constitution Bench of the Supreme Court of India in *State of Punjab v. Davinder Singh* held by a 6:1 majority that state legislatures have the constitutional power to sub-classify Scheduled Castes (SCs) and Scheduled Tribes (STs) to grant preference in reservations to the most backward sub-groups.

#### Key Constitutional Takeaways for UPSC GS-2:
1. **Article 14 & Article 16(4):** The Court affirmed that sub-classification does not violate the principle of equality under Article 14, provided it is backed by empirical data demonstrating inadequate representation.
2. **Article 341:** Sub-classification does not alter the President's List of Scheduled Castes notified under Article 341(1); it merely allocates quota percentages internally.
3. **Creamy Layer Concept:** The majority opinion suggested that the 'creamy layer' principle should also apply to SCs and STs to exclude affluent members from reservation benefits.

#### Exam Pointers for Prelims & Mains:
- Landmark case overruled: *E.V. Chinnaiah v. State of Andhra Pradesh (2005)*.
- Constitutional Articles invoked: Article 14, Article 15(4), Article 16(4), Article 341, Article 342.`,
    whyItMatters: 'Reshapes social justice jurisprudence, state legislative powers regarding affirmative action, and public administration policy.',
    examRelevance: [
      { exam: 'UPSC CSE', relevance: 'GS Paper 2: Indian Constitution, Fundamental Rights, Reservation Policies, Judiciary.' },
      { exam: 'State PCS', relevance: 'Polity: State reservation norms & Supreme Court constitutional benchmarks.' }
    ],
    keyFacts: [
      'Supreme Court Bench Size: 7 Judges (6:1 Majority)',
      'Overruled Decision: E.V. Chinnaiah v. State of A.P. (2005)',
      'Relevant Articles: Article 14, 16(4), 341 & 342'
    ],
    keywords: ['The Hindu', 'Editorial', 'Sub-Classification', 'Supreme Court', 'Article 341', 'Reservation'],
    possibleMCQs: [
      {
        question: 'Under which Article of the Indian Constitution does the President notify the list of Scheduled Castes for each State/UT?',
        options: ['Article 338', 'Article 341', 'Article 342', 'Article 366'],
        correctIndex: 1,
        explanation: 'Article 341 empowers the President to specify the castes, races, or tribes deemed to be Scheduled Castes.'
      }
    ],
    sources: [{ name: 'The Hindu E-Paper', url: 'https://www.thehindu.com', date: '2026-08-11' }],
    readTime: '5 min read'
  },
  {
    id: 'ca-toi-1',
    title: 'Times of India Special: India-EFTA Free Trade Agreement (TEPA) Comes into Force',
    date: '2026-08-11',
    source: 'Times of India',
    paperPage: 'Page 14 - Business & Economy',
    category: 'Economy',
    summary: 'Times of India reports on the formal implementation of the Trade and Economic Partnership Agreement (TEPA) bringing $100 Billion FDI commitments from Switzerland, Norway, Iceland & Liechtenstein.',
    detailedContent: `### Times of India Front Business Analysis: India-EFTA TEPA Pact
*Reported in Times of India Business Section.*

#### Major Deal Features:
1. **$100 Billion Investment Guarantee:** EFTA nations commit to invest $100 Billion in India over 15 years, generating 1 Million direct jobs.
2. **Tariff Elimination:** India gets duty-free access for 99% of its industrial exports to EFTA countries (Switzerland, Norway, Iceland, Liechtenstein).
3. **Swiss Watch & Chocolate Import Duty Phase-out:** Reduced import duties on high-end Swiss machinery, precision tools, and chocolates over 7-10 years.

#### Significance for Competitive Exams:
- EFTA is NOT part of the European Union (EU); it is a separate 4-nation economic bloc.
- First Indian FTA with a legally binding investment commitment clause.`,
    whyItMatters: 'Boosts India\'s foreign direct investment (FDI) inflow, manufacturing capability, and trade integration with European financial hubs.',
    examRelevance: [
      { exam: 'UPSC CSE', relevance: 'GS Paper 3: Indian Economy, Bilateral & International Trade Agreements.' },
      { exam: 'SSC CGL', relevance: 'General Awareness: EFTA member countries, $100B target figure.' },
      { exam: 'IBPS PO', relevance: 'Banking & Financial Awareness: Foreign Investment (FDI) & Forex impacts.' }
    ],
    keyFacts: [
      'EFTA Member Countries: Switzerland, Norway, Iceland, Liechtenstein',
      'Target Investment: $100 Billion over 15 years',
      'Pact Name: Trade and Economic Partnership Agreement (TEPA)'
    ],
    keywords: ['Times of India', 'TOI', 'EFTA', 'TEPA', 'FDI', 'Switzerland', 'Free Trade Agreement'],
    possibleMCQs: [
      {
        question: 'Which of the following nations is NOT a member of the European Free Trade Association (EFTA)?',
        options: ['Switzerland', 'Norway', 'Iceland', 'Germany'],
        correctIndex: 3,
        explanation: 'Germany is a member of the European Union (EU), not EFTA. EFTA consists of Switzerland, Norway, Iceland, and Liechtenstein.'
      }
    ],
    sources: [{ name: 'Times of India', url: 'https://timesofindia.indiatimes.com', date: '2026-08-11' }],
    readTime: '4 min read'
  },
  {
    id: 'ca-1',
    title: 'India Semiconductor Mission 2.0 Launched with ₹85,000 Crore Allocation',
    date: '2026-08-10',
    source: 'PIB',
    paperPage: 'PIB Release & National Dailies',
    category: 'Government Schemes',
    summary: 'The Cabinet approved Phase 2 of the India Semiconductor Mission (ISM 2.0) focusing on domestic commercial chip fabrication, silicon photonics, and advanced packaging ecosystems.',
    detailedContent: `The Union Cabinet chaired by the Prime Minister has formally launched Phase 2 of the India Semiconductor Mission (ISM 2.0) with an expanded outlay of ₹85,000 crore. Building upon ISM 1.0 which saw groundbreakings in Gujarat and Assam, ISM 2.0 prioritizes:

1. End-to-end silicon wafer manufacturing and compound semiconductor fabs.
2. Design Linked Incentive (DLI) 2.0 supporting 50+ domestic semiconductor startups.
3. R&D cluster development at IIT Madras and IISc Bangalore for next-generation gallium nitride (GaN) and silicon photonics chips.
4. Setting up of National Semiconductor Talent Hub to train 100,000 specialized engineers over 5 years.

This mission aligns with India's goal to become a global chip manufacturing alternative in the global electronics supply chain.`,
    whyItMatters: 'Strategic autonomy in critical electronic hardware, reduction in import dependencies ($30B+ annually), and boosting high-tech electronics export manufacturing.',
    examRelevance: [
      { exam: 'UPSC CSE', relevance: 'GS Paper 3: Science & Technology, Indigenization of Tech, Infrastructure Development, Government Schemes.' },
      { exam: 'SSC CGL', relevance: 'General Awareness: Outlay amount, launching ministry, full forms, tech hubs.' },
      { exam: 'IBPS PO', relevance: 'Banking & Financial Awareness: Financial outlays, DLI scheme, industrial credit growth.' }
    ],
    keyFacts: [
      'Total ISM 2.0 Outlay: ₹85,000 Crore',
      'Nodal Ministry: Ministry of Electronics and Information Technology (MeitY)',
      'Target Talent: 100,000 semiconductor engineers trained by 2030',
      'Focus Fabs: Compound Semiconductors, OSAT (Outsourced Semiconductor Assembly and Test), Silicon Photonics'
    ],
    keywords: ['Semiconductor', 'MeitY', 'DLI Scheme', 'Fab', 'OSAT', 'Gallium Nitride', 'Wafer'],
    possibleMCQs: [
      {
        question: 'Which ministry is the nodal agency for executing the India Semiconductor Mission (ISM)?',
        options: ['Ministry of Commerce and Industry', 'Ministry of Electronics & Information Technology (MeitY)', 'Ministry of Science & Technology', 'NITI Aayog'],
        correctIndex: 1,
        explanation: 'ISM is executed by the Digital India Corporation under MeitY.'
      },
      {
        question: 'What is the primary objective of the Design Linked Incentive (DLI) scheme under ISM?',
        options: ['Financial assistance for hardware exports', 'Financial incentives & design infrastructure support for domestic semiconductor startups', 'Import duty waiver on silicon wafers', 'Subsidized power for fab plants'],
        correctIndex: 1,
        explanation: 'DLI offers financial incentives and design infrastructure to Indian startups engaged in semiconductor design.'
      }
    ],
    sources: [
      { name: 'Press Information Bureau (PIB)', url: 'https://pib.gov.in', date: '2026-08-10' },
      { name: 'MeitY Official Portal', url: 'https://meity.gov.in', date: '2026-08-10' }
    ],
    readTime: '4 min read'
  },
  {
    id: 'ca-2',
    title: 'RBI Keeps Repo Rate Unchanged at 6.25% in August 2026 MPC Meeting',
    date: '2026-08-08',
    source: 'Times of India',
    paperPage: 'Page 1 Business',
    category: 'Economy',
    summary: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India decided unanimously to keep the policy repo rate unchanged at 6.25% while maintaining a "neutral" stance.',
    detailedContent: `The Reserve Bank of India's Monetary Policy Committee (MPC) headed by the Governor announced its bi-monthly monetary policy decision:

- **Repo Rate:** Unchanged at 6.25%
- **Standing Deposit Facility (SDF) Rate:** 6.00%
- **Marginal Standing Facility (MSF) Rate & Bank Rate:** 6.50%
- **Policy Stance:** Neutral
- **GDP Growth Projection for FY27:** Revised upwards to 7.2%
- **CPI Inflation Target:** Projected at 4.3% for FY27

The Governor noted that core inflation has anchored steadily around 4%, allowing the central bank flexibility to support economic expansion amidst benign monsoon indicators and healthy corporate balance sheets.`,
    whyItMatters: 'Direct impact on loan interest rates (home, auto, commercial), government borrowing costs, liquidity in the banking system, and inflation expectations.',
    examRelevance: [
      { exam: 'UPSC CSE', relevance: 'GS Paper 3: Indian Economy, Monetary Policy, Inflation vs Growth trade-off, RBI tools.' },
      { exam: 'IBPS PO / SBI PO', relevance: 'Core Banking Awareness: Policy rates, MPC composition, liquidity facilities (SDF/MSF).' }
    ],
    keyFacts: [
      'Repo Rate: 6.25%',
      'SDF Rate: 6.00%',
      'MSF Rate: 6.50%',
      'MPC Strength: 6 Members (3 internal RBI, 3 external government-appointed)',
      'Statutory provision: Section 45ZB of the Reserve Bank of India Act, 1934'
    ],
    keywords: ['Repo Rate', 'MPC', 'RBI Act 1934', 'Standing Deposit Facility', 'CPI Inflation'],
    possibleMCQs: [
      {
        question: 'Under which section of the RBI Act 1934 was the Monetary Policy Committee (MPC) constituted?',
        options: ['Section 22', 'Section 45ZB', 'Section 17', 'Section 35A'],
        correctIndex: 1,
        explanation: 'Section 45ZB of the Reserve Bank of India Act, 1934 provides for the constitution of the 6-member MPC.'
      }
    ],
    sources: [
      { name: 'Reserve Bank of India (RBI)', url: 'https://rbi.org.in', date: '2026-08-08' }
    ],
    readTime: '3 min read'
  },
  {
    id: 'ca-3',
    title: 'Supreme Court Clarifies Scope of Article 300A (Right to Property)',
    date: '2026-08-05',
    source: 'The Hindu',
    paperPage: 'Page 8 Law & Constitution',
    category: 'Polity',
    summary: 'A Constitution Bench ruled that the Right to Property under Article 300A is a constitutional & human right, requiring fair compensation and statutory process before deprivation.',
    detailedContent: `In a landmark judgment, a five-judge Constitution Bench reaffirmed that although the Right to Property ceased to be a Fundamental Right via the 44th Constitutional Amendment Act, 1978, it remains a constitutional and fundamental human right under Article 300A.

The Court held that:
1. No citizen can be deprived of property save by authority of law.
2. The term 'law' under Article 300A means a valid legislative enactment, not mere executive orders or administrative guidelines.
3. Adequate compensation and a fair procedural process are implicit requirements under Article 300A.`,
    whyItMatters: 'Reinforces constitutional safeguards against arbitrary state land acquisition and clarifies the hierarchy between Fundamental Rights and Constitutional Rights.',
    examRelevance: [
      { exam: 'UPSC CSE', relevance: 'GS Paper 2: Indian Constitution, Fundamental Rights vs Legal Rights, Landmark Judgments.' },
      { exam: 'SSC CGL', relevance: 'Polity: 44th Amendment Act 1978, Constitutional Articles.' }
    ],
    keyFacts: [
      'Original Status: Fundamental Right under Article 19(1)(f) & Article 31',
      '44th Amendment Act, 1978 moved Right to Property to Part XII, Chapter IV, Article 300A',
      'Current Status: Constitutional / Legal Right'
    ],
    keywords: ['Article 300A', '44th Amendment 1978', 'Right to Property', 'Land Acquisition', 'Constitution Bench'],
    possibleMCQs: [
      {
        question: 'Which constitutional amendment removed the Right to Property from the list of Fundamental Rights?',
        options: ['42nd Amendment Act, 1976', '44th Amendment Act, 1978', '73rd Amendment Act, 1992', '86th Amendment Act, 2002'],
        correctIndex: 1,
        explanation: 'The 44th Constitutional Amendment Act of 1978 omitted Article 19(1)(f) and Article 31, creating Article 300A.'
      }
    ],
    sources: [
      { name: 'Supreme Court of India Judgments', url: 'https://main.sci.gov.in', date: '2026-08-05' }
    ],
    readTime: '3 min read'
  }
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    question: 'With reference to the Preamble of the Indian Constitution, which one of the following statements is correct?',
    options: [
      'It is a part of the Constitution and can be amended, but the basic structure cannot be altered.',
      'It is not a part of the Constitution and carries no legal force.',
      'It was drafted by Dr. B.R. Ambedkar and cannot be amended by Parliament.',
      'It can be amended by simple majority in Parliament under Article 368.'
    ],
    correctAnswer: 0,
    explanation: 'In the Kesavananda Bharati case (1973), the Supreme Court ruled that the Preamble IS a part of the Constitution and can be amended under Article 368, subject to the condition that the basic structure is not modified. It was amended once by the 42nd Amendment Act, 1976 (adding Socialist, Secular, Integrity).',
    subject: 'Polity & Constitution',
    topic: 'Preamble & Constitutional Framework',
    difficulty: 'Exam-level',
    exam: 'UPSC CSE',
    year: 2024,
    stage: 'Prelims GS 1',
    misconceptions: [
      'Option B is incorrect because Berubari Union (1960) ruled it not a part, but Kesavananda Bharati (1973) overruled it.',
      'Option D is incorrect because Article 368 requires a special majority, not a simple majority.'
    ]
  },
  {
    id: 'q-102',
    question: 'Which of the following bodies in India is/are Constitutional Bodies?\n1. NITI Aayog\n2. Finance Commission\n3. Election Commission of India\n4. National Human Rights Commission (NHRC)',
    options: [
      '1 and 4 only',
      '2 and 3 only',
      '2, 3 and 4 only',
      '1, 2, 3 and 4'
    ],
    correctAnswer: 1,
    explanation: 'Finance Commission (Article 280) and Election Commission of India (Article 324) are Constitutional Bodies established directly by constitutional provisions. NITI Aayog is a non-statutory extra-constitutional executive body. NHRC is a Statutory Body created under the Protection of Human Rights Act, 1993.',
    subject: 'Polity & Constitution',
    topic: 'Constitutional & Non-Constitutional Bodies',
    difficulty: 'Medium',
    exam: 'UPSC CSE',
    year: 2023,
    stage: 'Prelims GS 1'
  },
  {
    id: 'q-103',
    question: 'The ratio of the speed of a boat in still water to the speed of the current is 5:1. If the boat takes 4 hours to travel 60 km downstream, how much time will it take to travel the same distance upstream?',
    options: [
      '5 hours',
      '6 hours',
      '7.5 hours',
      '8 hours'
    ],
    correctAnswer: 1,
    explanation: 'Let speed in still water = 5x km/h and current speed = x km/h.\nDownstream speed = 5x + x = 6x km/h.\nDownstream speed = Distance / Time = 60 / 4 = 15 km/h.\nSo, 6x = 15 => x = 2.5 km/h.\nUpstream speed = 5x - x = 4x = 4 * 2.5 = 10 km/h.\nTime upstream = Distance / Upstream speed = 60 / 10 = 6 hours.',
    subject: 'Quantitative Aptitude',
    topic: 'Speed, Distance & Time / Boats & Streams',
    difficulty: 'Medium',
    exam: 'SSC CGL',
    year: 2024,
    stage: 'Tier I'
  },
  {
    id: 'q-104',
    question: 'Under the provisions of the RBI Act 1934, what is the maximum number of Deputy Governors the Reserve Bank of India can have?',
    options: [
      '2',
      '3',
      '4',
      '5'
    ],
    correctAnswer: 2,
    explanation: 'As per Section 8(1)(a) of the RBI Act 1934, the Central Board of RBI consists of the Governor and not more than 4 Deputy Governors.',
    subject: 'Banking & Finance',
    topic: 'RBI Structure & Functions',
    difficulty: 'Easy',
    exam: 'IBPS PO',
    year: 2025
  },
  {
    id: 'q-105',
    question: 'In the Indian Parliamentary system, the concept of "Zero Hour" is:',
    options: [
      'An informal device created by the Indian parliamentarians in 1962.',
      'A formal rule mentioned in the Rules of Procedure of Lok Sabha.',
      'Borrowed directly from the British Parliamentary Constitution.',
      'Held before the Question Hour every morning.'
    ],
    correctAnswer: 0,
    explanation: 'Zero Hour is an Indian innovation in the field of parliamentary procedures since 1962. It is NOT mentioned in the Rules of Procedure. It starts immediately after the Question Hour (around 12 noon, hence called Zero Hour).',
    subject: 'Polity & Constitution',
    topic: 'Parliamentary Proceedings & Devices',
    difficulty: 'Exam-level',
    exam: 'UPSC CSE',
    year: 2022
  },
  {
    id: 'q-106',
    question: 'With reference to the Indian economy, consider the following statements regarding Inflation-Indexed Bonds (IIBs):\n1. The Government can issue IIBs to protect investors from inflation uncertainty.\n2. IIBs provide inflation protection to both principal and coupon payments.\n3. The interest received as well as capital gains on IIBs are completely tax-exempt.\nWhich of the statements given above are correct?',
    options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    correctAnswer: 0,
    explanation: 'Statements 1 and 2 are correct. Statement 3 is incorrect because interest earned on IIBs is taxable under Income Tax Act, though capital gains indexation benefits apply.',
    subject: 'Indian Economy',
    topic: 'Government Securities & Inflation',
    difficulty: 'Hard',
    exam: 'UPSC CSE',
    year: 2022,
    stage: 'Prelims GS 1'
  },
  {
    id: 'q-107',
    question: 'In the Context of Ancient Indian History, the term "Agrahara" refers to:',
    options: [
      'A land grant given to Brahmins which was exempt from taxes.',
      'A royal tax levied on agricultural produce during the Gupta Empire.',
      'A guild of merchant traders operating along the Silk Route.',
      'A military cantonment area in Southern Dynasties.'
    ],
    correctAnswer: 0,
    explanation: 'An Agrahara was a land grant given to Brahmins or religious institutions, usually tax-free and with rights to collect local revenues, widely prevalent in Gupta and Post-Gupta eras.',
    subject: 'History & Culture',
    topic: 'Ancient India & Land Grants',
    difficulty: 'Medium',
    exam: 'UPSC CSE',
    year: 2023,
    stage: 'Prelims GS 1'
  },
  {
    id: 'q-108',
    question: 'If a sum of money doubles itself at Compound Interest in 5 years, in how many years will it become 8 times itself at the same rate of interest?',
    options: ['10 years', '12 years', '15 years', '20 years'],
    correctAnswer: 2,
    explanation: 'In Compound Interest, if money becomes 2x in 5 years, it becomes 2^3 = 8x in 3 * 5 = 15 years.',
    subject: 'Quantitative Aptitude',
    topic: 'Compound Interest',
    difficulty: 'Easy',
    exam: 'SSC CGL',
    year: 2023,
    stage: 'Tier I'
  },
  {
    id: 'q-109',
    question: 'Which Ramsar Wetland Site in India is famous as the wintering ground for the endangered Irrawaddy Dolphins and migratory birds?',
    options: ['Keoladeo National Park', 'Chilika Lake', 'Loktak Lake', 'Wular Lake'],
    correctAnswer: 1,
    explanation: 'Chilika Lake in Odisha is the largest coastal lagoon in India and a designated Ramsar site famous for Irrawaddy dolphins.',
    subject: 'Environment & Ecology',
    topic: 'Ramsar Sites & Wetlands',
    difficulty: 'Medium',
    exam: 'UPSC CSE',
    year: 2021,
    stage: 'Prelims GS 1'
  },
  {
    id: 'q-110',
    question: 'Which Article of the Constitution of India provides for the establishment of the Finance Commission every five years?',
    options: ['Article 280', 'Article 312', 'Article 324', 'Article 356'],
    correctAnswer: 0,
    explanation: 'Article 280 mandates the President of India to constitute a Finance Commission every five years to recommend net tax distribution between Union and States.',
    subject: 'Polity & Constitution',
    topic: 'Constitutional Bodies',
    difficulty: 'Easy',
    exam: 'SSC CGL',
    year: 2025,
    stage: 'Tier I'
  },
  {
    id: 'q-111',
    question: 'With reference to Indian Physical Geography, consider the following statements regarding the Western Ghats:\n1. The Western Ghats are higher in elevation in the southern section than in the northern section.\n2. Anamudi is the highest peak in the Western Ghats.\n3. The Western Ghats are continuous mountains while Eastern Ghats are discontinuous and dissected by rivers.\nWhich of the statements given above are correct?',
    options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    correctAnswer: 3,
    explanation: 'All three statements are correct. The Western Ghats rise progressively higher towards the south, reaching 2,695 m at Anamudi in Kerala. Eastern Ghats are eroded and broken by rivers like Mahanadi, Godavari, Krishna, and Cauvery.',
    subject: 'Geography & Climate',
    topic: 'Physical Geography of India',
    difficulty: 'Medium',
    exam: 'UPSC CSE',
    year: 2024,
    stage: 'Prelims GS 1'
  },
  {
    id: 'q-112',
    question: 'What is the primary function of "CRISPR-Cas9" technology which has revolutionized biotechnology and gene editing?',
    options: [
      'Molecular scissors that precisely cut specific sequences of DNA in living organisms.',
      'A protein enzyme used to synthesize synthetic RNA vaccines against viral infections.',
      'A targeted delivery vehicle using lipid nanoparticles for intracellular gene transport.',
      'A quantum sequencing device used for rapid whole-genome mapping.'
    ],
    correctAnswer: 0,
    explanation: 'CRISPR-Cas9 acts as RNA-guided molecular scissors allowing geneticists to edit parts of the genome by altering, removing, or adding DNA sequence locations.',
    subject: 'Science & Technology',
    topic: 'Biotechnology & Genetic Engineering',
    difficulty: 'Medium',
    exam: 'UPSC CSE',
    year: 2023,
    stage: 'Prelims GS 1'
  },
  {
    id: 'q-113',
    question: 'In a certain code language, if "POLITY" is written as "QNMJUZ", how will "ECONOMY" be written in the same code system?',
    options: ['FDPOPNZ', 'FDPPNPZ', 'FDPONPZ', 'FDPPNPZ'],
    correctAnswer: 2,
    explanation: 'Each letter is shifted forward by +1 positions sequentially: E->F, C->D, O->P, N->O, O->P, M->N, Y->Z -> FDPOPNZ (wait: E+1=F, C+1=D, O+1=P, N+1=O, O+1=P, M+1=N, Y+1=Z -> FDPOPNZ).',
    subject: 'Reasoning Ability',
    topic: 'Coding-Decoding',
    difficulty: 'Easy',
    exam: 'SSC CGL',
    year: 2024,
    stage: 'Tier I'
  },
  {
    id: 'q-114',
    question: 'Choose the word that is most nearly OPPOSITE in meaning (Antonym) to the word "MANDATORY":',
    options: ['Compulsory', 'Imperative', 'Optional', 'Essential'],
    correctAnswer: 2,
    explanation: 'Mandatory means required by law or rules; compulsory. The antonym is "Optional" or voluntary.',
    subject: 'English Comprehension',
    topic: 'Vocabulary & Antonyms',
    difficulty: 'Easy',
    exam: 'IBPS PO',
    year: 2024,
    stage: 'Prelims'
  },
  {
    id: 'q-115',
    question: 'Which country recently joined as the 32nd official member state of the North Atlantic Treaty Organization (NATO) in 2024?',
    options: ['Finland', 'Sweden', 'Ukraine', 'Georgia'],
    correctAnswer: 1,
    explanation: 'Sweden officially joined NATO on March 7, 2024, becoming its 32nd member state (following Finland which joined as the 31st member in April 2023).',
    subject: 'General Awareness',
    topic: 'International Organizations & Alliances',
    difficulty: 'Easy',
    exam: 'RRB NTPC',
    year: 2025,
    stage: 'CBT 1'
  }
];

export const SAMPLE_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-upsc-prelims-1',
    title: 'UPSC Prelims Full Length Mock Test - GS Paper 1',
    exam: 'UPSC CSE',
    durationMinutes: 120,
    totalQuestions: 100,
    totalMarks: 200,
    passingMarks: 95,
    negativeMarking: 0.33,
    instructions: [
      'This test contains 100 objective questions testing GS Paper 1 syllabus.',
      'Each question carries 2 marks. 0.66 marks will be deducted for every incorrect answer.',
      'You can mark questions for review and return to them anytime before submission.',
      'Submit the test when completed to view instant score analysis and topic weakness report.'
    ],
    questions: [
      ...SAMPLE_QUESTIONS,
      {
        id: 'q-106',
        question: 'Which of the following river basins in India is known as the "Granary of South India"?',
        options: ['Krishna Basin', 'Kaveri (Cauvery) Delta', 'Godavari Basin', 'Mahanadi Basin'],
        correctAnswer: 1,
        explanation: 'The Kaveri Delta region in Tamil Nadu (Thanjavur) is historically termed the Granary of South India.',
        subject: 'Geography',
        topic: 'Indian Drainage System',
        difficulty: 'Medium',
        exam: 'UPSC CSE'
      },
      {
        id: 'q-107',
        question: 'Consider the following statements regarding the Monetary Policy Committee (MPC):\n1. It is a 6-member committee.\n2. The Governor of RBI has a casting vote in case of a tie.\n3. Its decisions are binding on the Reserve Bank of India.\nWhich of the statements given above are correct?',
        options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
        correctAnswer: 3,
        explanation: 'All three statements are correct under Section 45ZB of the RBI Act 1934. The Governor acts as ex-officio Chairperson and possesses a second/casting vote.',
        subject: 'Indian Economy',
        topic: 'Monetary Policy',
        difficulty: 'Hard',
        exam: 'UPSC CSE'
      }
    ]
  },
  {
    id: 'mock-ssc-tier1-1',
    title: 'SSC CGL Tier I Complete Speed Test 2026',
    exam: 'SSC CGL',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 200,
    passingMarks: 135,
    negativeMarking: 0.25,
    instructions: [
      'Test consists of 4 sections: Quant, Reasoning, English, General Awareness.',
      'Speed and accuracy are crucial for SSC Tier I qualification.',
      'Negative marking of 0.50 marks per wrong answer.'
    ],
    questions: [
      ...SAMPLE_QUESTIONS
    ]
  }
];

export const SAMPLE_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Fundamental Rights - Articles 12 to 35 Quick Revision',
    folder: 'Indian Polity',
    tags: ['Polity', 'UPSC', 'Constitutional Rights'],
    isBookmarked: true,
    content: `# Fundamental Rights (Part III of Constitution)

Derived from the **US Bill of Rights**. Magna Carta of India.

## Key Features
- **Justiciable:** Directly enforceable in Supreme Court under Article 32.
- **Not Absolute:** Subject to reasonable restrictions (e.g., public order, morality, security of state).
- **Suspension:** Suspended during National Emergency (Article 352) except **Articles 20 & 21** which can NEVER be suspended.

## Six Fundamental Rights Categories
1. **Right to Equality (Articles 14-18)**
   - Art 14: Equality before law & Equal protection of laws
   - Art 15: Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth
   - Art 16: Equality of opportunity in public employment
   - Art 17: Abolition of Untouchability
   - Art 18: Abolition of Titles
2. **Right to Freedom (Articles 19-22)**
   - Art 19: Six basic freedoms (Speech, Assembly, Association, Movement, Residence, Profession)
   - Art 20: Protection in respect of conviction for offences (No ex-post facto, No double jeopardy, No self-incrimination)
   - Art 21: Protection of Life and Personal Liberty (Maneka Gandhi case expanded scope)
   - Art 21A: Right to Education (86th Amendment 2002)
   - Art 22: Protection against arrest and detention
3. **Right against Exploitation (Articles 23-24)**
4. **Right to Freedom of Religion (Articles 25-28)**
5. **Cultural and Educational Rights (Articles 29-30)**
6. **Right to Constitutional Remedies (Article 32)** - Heart & Soul of Constitution (Dr. Ambedkar).`,
    createdAt: '2026-08-01',
    updatedAt: '2026-08-09'
  },
  {
    id: 'note-2',
    title: 'Monetary Policy Tools & Repo Rate Dynamics',
    folder: 'Indian Economy',
    tags: ['Economy', 'RBI', 'Banking'],
    isBookmarked: false,
    content: `# RBI Monetary Policy Framework

## Quantitative Tools
- **Repo Rate:** Rate at which RBI lends short-term money to commercial banks against government securities.
- **Reverse Repo Rate:** Rate at which banks deposit surplus funds with RBI.
- **Standing Deposit Facility (SDF):** Uncollateralized liquidity absorption mechanism.
- **Marginal Standing Facility (MSF):** Emergency overnight borrowing facility for banks at penal interest rate.
- **CRR (Cash Reserve Ratio):** Percentage of NDTL that banks must hold as cash reserves with RBI (no interest paid).
- **SLR (Statutory Liquidity Ratio):** Percentage of NDTL held in liquid assets (Gold, Govt Securities, Cash).

## Qualitative Tools
- Moral Suasion, Margin Requirements, Credit Rationing.`,
    createdAt: '2026-08-04',
    updatedAt: '2026-08-07'
  }
];

export const SAMPLE_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    front: 'What is Article 32 of the Indian Constitution?',
    back: 'Right to Constitutional Remedies. Allows citizens to approach the Supreme Court directly for enforcement of Fundamental Rights via writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari). Termed the "Heart and Soul of the Constitution" by Dr. B.R. Ambedkar.',
    category: 'Indian Polity',
    difficulty: 'Medium'
  },
  {
    id: 'fc-2',
    front: 'Which amendment introduced Article 21A (Right to Education)?',
    back: 'The 86th Constitutional Amendment Act, 2002. It made free and compulsory education for children aged 6 to 14 a Fundamental Right.',
    category: 'Indian Polity',
    difficulty: 'Easy'
  },
  {
    id: 'fc-3',
    front: 'What is the distinction between Repo Rate and Bank Rate?',
    back: 'Repo Rate involves short-term borrowing backed by collateral (Govt Securities). Bank Rate involves long-term borrowing without collateral.',
    category: 'Indian Economy',
    difficulty: 'Medium'
  },
  {
    id: 'fc-4',
    front: 'Who presides over a joint sitting of both Houses of Parliament?',
    back: 'The Speaker of the Lok Sabha (under Article 108/118). In their absence, the Deputy Speaker of Lok Sabha, followed by the Deputy Chairman of Rajya Sabha.',
    category: 'Indian Polity',
    difficulty: 'Medium'
  }
];

export const SAMPLE_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Union Budget 2026-27 Official Key Highlights Summary',
    category: 'Reports',
    author: 'Ministry of Finance, Govt of India',
    date: '2026-02-01',
    examRelevance: 'High for UPSC GS 3, SSC General Awareness, IBPS PO Banking Awareness',
    description: 'Comprehensive official summary of capital expenditure outlays, tax restructuring, agricultural credit targets, and green energy investments.',
    readUrl: '#'
  },
  {
    id: 'res-2',
    title: 'Economic Survey 2025-26 Overview & Sectoral Analysis',
    category: 'Government Documents',
    author: 'Chief Economic Adviser, Govt of India',
    date: '2026-01-31',
    examRelevance: 'Essential reading for UPSC Civil Services Economy Mains & Prelims',
    description: 'Analytical review of Indian economy growth drivers, GDP projections, employment trends, and trade metrics.',
    readUrl: '#'
  },
  {
    id: 'res-3',
    title: 'Indian Polity 7th Edition Summary Notes PDF',
    category: 'Notes',
    author: 'ExamNexus Academic Team',
    date: '2026-05-10',
    examRelevance: 'UPSC CSE, State PCS, SSC CGL',
    description: 'Concise chapterwise charts, comparison tables, landmark Supreme Court cases, and constitutional article mapping.',
    downloadUrl: '#'
  }
];

export const SAMPLE_STUDY_PLAN: StudyPlan = {
  id: 'plan-upsc-90',
  examName: 'UPSC Civil Services 2026',
  targetDate: '2026-05-24',
  dailyHours: 6,
  weeks: [
    {
      weekNumber: 1,
      title: 'Constitutional Core & Polity Foundations',
      focus: 'Preamble, Fundamental Rights, DPSP, Fundamental Duties',
      tasks: [
        { id: 't-1', day: 1, title: 'Read Laxmikanth Ch 1-4 (Constitutional Background & Preamble)', subject: 'Polity', duration: '3 hrs', completed: true, type: 'Theory' },
        { id: 't-2', day: 1, title: 'Solve 25 PYQs on Preamble and Citizenship', subject: 'Polity', duration: '1 hr', completed: true, type: 'Practice' },
        { id: 't-3', day: 2, title: 'Study Fundamental Rights Articles 12 to 22 in detail', subject: 'Polity', duration: '3.5 hrs', completed: true, type: 'Theory' },
        { id: 't-4', day: 2, title: 'Read Daily Current Affairs + Make Notes', subject: 'Current Affairs', duration: '1.5 hrs', completed: true, type: 'Theory' },
        { id: 't-5', day: 3, title: 'Study Fundamental Rights Articles 23 to 35 & Writs', subject: 'Polity', duration: '3 hrs', completed: false, type: 'Theory' },
        { id: 't-6', day: 3, title: 'Attempt 30 MCQ Quiz on Fundamental Rights', subject: 'Polity', duration: '1.5 hrs', completed: false, type: 'Practice' }
      ]
    },
    {
      weekNumber: 2,
      title: 'Executive & Legislature Structure',
      focus: 'President, Vice President, Prime Minister, Parliament',
      tasks: [
        { id: 't-7', day: 8, title: 'Parliamentary System & Federal Features', subject: 'Polity', duration: '3 hrs', completed: false, type: 'Theory' },
        { id: 't-8', day: 9, title: 'Lok Sabha vs Rajya Sabha Powers & Budgetary Process', subject: 'Polity', duration: '3 hrs', completed: false, type: 'Theory' }
      ]
    }
  ]
};

export const SAMPLE_FAQS = [
  {
    q: "What competitive exams are covered on ExamNexus AI?",
    a: "ExamNexus AI covers UPSC Civil Services, SSC CGL/CHSL/MTS, Banking (IBPS PO/Clerk, SBI PO/Clerk, RBI Grade B), Railway (RRB NTPC/Group D), Defence (CDS/NDA/AFCAT), State PCS (UPPSC, BPSC, MPSC, MPPSC), Teaching (UGC NET, CTET), and CUET."
  },
  {
    q: "How does the AI Study Assistant work?",
    a: "The AI Study Assistant uses server-side Google Gemini models fine-tuned with competitive exam pedagogy. It explains concepts in simple or detailed exam-oriented formats, generates custom MCQs, creates revision flashcards, and summarizes current affairs."
  },
  {
    q: "Can I generate custom quizzes and mock tests?",
    a: "Yes! You can specify your target exam, subject, topic, difficulty level (Easy, Medium, Hard, Exam-level), and number of questions. The AI will build an interactive quiz with a live timer, scoring, and explanation analysis."
  },
  {
    q: "Are the current affairs updated daily?",
    a: "Yes, Daily Current Affairs are categorized into National, International, Economy, Polity, Environment, Science, and Defence with key facts, why it matters, and possible Prelims/Mains questions."
  },
  {
    q: "Is there a source verification feature in Research Mode?",
    a: "In Research Mode, the platform outlines facts, government schemes, timelines, and links to official source portals (e.g. PIB, RBI, Supreme Court, Ministries) ensuring factual reliability for serious aspirants."
  }
];
