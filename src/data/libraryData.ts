export interface OfficialGovtResource {
  id: string;
  title: string;
  shortCode: string;
  ministry: string;
  officialGovtPortal: string;
  officialGovtPortalName: string;
  gazetteUrl?: string;
  category: 'Passed Act' | 'Pending Bill' | 'Constitutional Amendment' | 'Govt Report' | 'NCERT Textbook';
  subject: 'Polity' | 'Economy' | 'Governance' | 'Environment' | 'Social Issues' | 'History' | 'Geography' | 'Science & Tech';
  year: string;
  status: string;
  statusType: 'passed' | 'pending' | 'amendment' | 'official-report' | 'ncert';
  billNumber?: string;
  passedDate?: string;
  pdfFileName: string;
  pdfSize: string;
  officialPdfDownloadUrl: string;
  syllabusPaper: string; // e.g. 'GS Paper 2', 'GS Paper 3', 'Prelims + Mains'
  summaryOverview: string;
  keyProvisions: string[];
  examSignificance: string;
  tableOfContents: { title: string; summary: string }[];
}

export interface StandardBookItem {
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
  isCopyrightedCommercial: boolean;
  buyLinks: {
    amazon: string;
    flipkart: string;
    publisher?: string;
  };
  officialGovtPortal?: string;
  officialGovtPortalName?: string;
  pdfFileName: string;
  pdfSize: string;
  rating: number;
  reviewsCount: string;
  keyHighlights: string[];
  sampleChapters: { title: string; summary: string }[];
  isUserUploaded?: boolean;
}

export interface NCERTBookItem {
  id: string;
  bookTitle: string;
  classLevel: string; // 'Class 6' | 'Class 7' | ... | 'Class 12'
  subject: string;
  medium: string;
  code: string;
  officialNcertUrl: string;
  officialEpathshalaUrl: string;
  pdfFileName: string;
  pdfSize: string;
  chaptersCount: number;
  keyTopics: string[];
  prelimsRelevance: string;
  sampleChapters: { title: string; summary: string }[];
}

// 1. ALL PARLIAMENT PASSED ACTS, PENDING BILLS & CONSTITUTIONAL AMENDMENTS
export const PARLIAMENT_BILLS_DATA: OfficialGovtResource[] = [
  {
    id: 'bill-bns-2023',
    title: 'The Bharatiya Nyaya Sanhita (BNS), 2023',
    shortCode: 'BNS Act No. 45 of 2023',
    ministry: 'Ministry of Home Affairs & Ministry of Law and Justice',
    officialGovtPortal: 'https://legislative.gov.in',
    officialGovtPortalName: 'Legislative Department, Ministry of Law (legislative.gov.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Passed Act',
    subject: 'Polity',
    year: '2023–2024',
    status: 'Passed by Parliament & Came into Force on 1 July 2024',
    statusType: 'passed',
    billNumber: 'Bill No. 173-C of 2023',
    passedDate: 'Dec 21, 2023 (Assent: Dec 25, 2023)',
    pdfFileName: 'Bharatiya_Nyaya_Sanhita_2023_Official_Gazette.pdf',
    pdfSize: '18.4 MB',
    officialPdfDownloadUrl: 'https://egazette.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 (Criminal Justice Reforms & Constitution)',
    summaryOverview: 'Replaces the colonial Indian Penal Code (IPC) 1860 with 358 sections. Introduces community service for petty offences, defines terrorism, eliminates sedition (introducing offence of endangerment to sovereignty), and adds strict penalties for mob lynching and crimes against women/children.',
    keyProvisions: [
      'Repeals IPC 1860; consolidates substantive criminal law into 358 sections (down from 511).',
      'Introduces Community Service as an alternative non-custodial punishment for 6 petty crimes.',
      'Explicit statutory definition of "Terrorism" under Section 113, aligned with international standards.',
      'Stringent punishment including life imprisonment or death penalty for organized mob lynching based on race, caste, community, or place of birth.',
      'Eliminates the sedition law (Section 124A of IPC) and introduces Section 152 penalizing acts endangering sovereignty, unity, and integrity of India.'
    ],
    examSignificance: 'Crucial for UPSC Mains GS 2 (Judiciary & Criminal Justice Reform) and Prelims Legal terminology questions.',
    tableOfContents: [
      {
        title: 'Chapter 1 & 2: General Explanations & Punishments',
        summary: 'Definitions of gender, public servant, document, and 6 types of punishments including newly added Community Service.'
      },
      {
        title: 'Chapter 5: Offences Against Women and Children',
        summary: 'Sections 63 to 99 covering rape, gang rape, marriage under deceitful identity, and aggravated sexual offences with mandatory minimum sentencing.'
      },
      {
        title: 'Chapter 11: Offences Against the State (Section 147-158)',
        summary: 'Replaces sedition with precise provisions penalizing armed rebellion, subversive activities, and endangering sovereignty.'
      }
    ]
  },
  {
    id: 'bill-bnss-2023',
    title: 'The Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023',
    shortCode: 'BNSS Act No. 46 of 2023',
    ministry: 'Ministry of Home Affairs',
    officialGovtPortal: 'https://sansad.in',
    officialGovtPortalName: 'Sansad India Official Portal (sansad.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Passed Act',
    subject: 'Polity',
    year: '2023–2024',
    status: 'Passed & In Force across India from 1 July 2024',
    statusType: 'passed',
    billNumber: 'Bill No. 174-C of 2023',
    passedDate: 'Dec 21, 2023',
    pdfFileName: 'Bharatiya_Nagarik_Suraksha_Sanhita_2023_Full_Act.pdf',
    pdfSize: '24.2 MB',
    officialPdfDownloadUrl: 'https://legislative.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 (Rule of Law & Police Reforms)',
    summaryOverview: 'Replaces the Code of Criminal Procedure (CrPC) 1973. Mandates forensic investigation for offences punishable with 7+ years imprisonment, introduces Zero e-FIR, digitizes court trials, sets strict time limits for judgment delivery (within 45 days of trial completion), and permits trials in absentia.',
    keyProvisions: [
      'Forensic collection of evidence made compulsory for all offences punishable with 7 years or more.',
      'Nationwide electronic FIR (e-FIR) and Zero FIR enabled across all state police stations.',
      'Judgments must be pronounced within 45 days after the conclusion of arguments in trial courts.',
      'Trial in absentia allowed for proclaimed offenders who have absconded to evade justice.',
      'Use of audio-video electronic means made mandatory for search, seizure, and witness examination.'
    ],
    examSignificance: 'Frequently asked in Mains GS 2 for legal efficiency, undertrial prisoner reforms, and forensic modernization.',
    tableOfContents: [
      {
        title: 'Chapter 12: Information to the Police and Their Powers to Investigate',
        summary: 'Provisions governing zero FIR, electronic FIR registration, preliminary enquiry limits, and audio-video recording of search and seizure operations.'
      },
      {
        title: 'Chapter 33: Provisions as to Bail and Bonds',
        summary: 'First-time undertrial offender bail relief guidelines, electronic surety submission, and maximum detention period norms.'
      }
    ]
  },
  {
    id: 'bill-bsa-2023',
    title: 'The Bharatiya Sakshya Adhiniyam (BSA), 2023',
    shortCode: 'BSA Act No. 47 of 2023',
    ministry: 'Ministry of Law and Justice',
    officialGovtPortal: 'https://legislative.gov.in',
    officialGovtPortalName: 'Legislative Department (legislative.gov.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Passed Act',
    subject: 'Polity',
    year: '2023–2024',
    status: 'Enacted & In Force from 1 July 2024',
    statusType: 'passed',
    billNumber: 'Bill No. 175-C of 2023',
    passedDate: 'Dec 21, 2023',
    pdfFileName: 'Bharatiya_Sakshya_Adhiniyam_2023_Gazette.pdf',
    pdfSize: '12.8 MB',
    officialPdfDownloadUrl: 'https://egazette.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 (Evidence & Digital Justice)',
    summaryOverview: 'Replaces the Indian Evidence Act 1872. Expands the scope of secondary and primary electronic evidence, providing legal parity between digital records (cloud server logs, emails, smartphones, messaging logs) and physical paper documents in Indian courts.',
    keyProvisions: [
      'Gives full legal validity and evidentiary admissibility to electronic or digital records equal to physical documents.',
      'Broadens the definition of document to include semiconductor memory, server logs, mobile SMS, location logs, and encrypted messages.',
      'Modernizes the criteria for secondary evidence and oral evidence under video conferencing.'
    ],
    examSignificance: 'Key for questions on Cyber forensics, e-Courts Phase III, and technology in the Indian judicial system.',
    tableOfContents: [
      {
        title: 'Part 2: On Proof - Electronic and Digital Evidence',
        summary: 'Detailed statutory standards for proving electronic records without cumbersome certificate bottlenecks.'
      }
    ]
  },
  {
    id: 'bill-dpdp-2023',
    title: 'The Digital Personal Data Protection (DPDP) Act, 2023',
    shortCode: 'DPDP Act No. 22 of 2023',
    ministry: 'Ministry of Electronics and Information Technology (MeitY)',
    officialGovtPortal: 'https://meity.gov.in',
    officialGovtPortalName: 'MeitY Official Portal (meity.gov.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Passed Act',
    subject: 'Governance',
    year: '2023–2024',
    status: 'Passed by Parliament & Enacted',
    statusType: 'passed',
    billNumber: 'Act No. 22 of 2023',
    passedDate: 'August 11, 2023',
    pdfFileName: 'Digital_Personal_Data_Protection_Act_2023_Official.pdf',
    pdfSize: '11.5 MB',
    officialPdfDownloadUrl: 'https://meity.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 & 3 (Data Privacy, Fundamental Rights Art 21, Digital Economy)',
    summaryOverview: 'India’s first comprehensive privacy legislation establishing legal framework for processing digital personal data. Balances individuals’ Right to Privacy (Justice K.S. Puttaswamy judgment) with lawful processing needs, creating the Data Protection Board of India (DPBI) with penalties up to ₹250 Crore for major data breaches.',
    keyProvisions: [
      'Applies to processing of digital personal data within India and abroad if offering goods/services to Indian citizens.',
      'Mandates verifiable parental consent before processing any personal data belonging to children (under 18).',
      'Data Fiduciary duties: strict notice requirements, purpose limitation, and storage limitation.',
      'Establishment of the Data Protection Board of India (DPBI) as an adjudicatory mechanism.',
      'Penalties ranging up to ₹250 Crore for failure to take reasonable security safeguards to prevent data breach.'
    ],
    examSignificance: 'Extremely high yield for UPSC GS 2, GS 3 (Cyber Security) and essay on Digital Sovereignty.',
    tableOfContents: [
      {
        title: 'Chapter 2: Obligations of Data Fiduciaries & Rights of Data Principals',
        summary: 'Consent notice requirements, Right to access, Right to correction/erasure, and Right to grievance redressal.'
      },
      {
        title: 'Chapter 5: Data Protection Board of India & Penalties',
        summary: 'Constitution of DPBI, digital inquiries, summons, and monetary penalty calculation matrix.'
      }
    ]
  },
  {
    id: 'bill-telecom-2023',
    title: 'The Telecommunications Act, 2023',
    shortCode: 'Telecom Act No. 44 of 2023',
    ministry: 'Department of Telecommunications, Ministry of Communications',
    officialGovtPortal: 'https://dot.gov.in',
    officialGovtPortalName: 'Department of Telecommunications (dot.gov.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Passed Act',
    subject: 'Science & Tech',
    year: '2023–2024',
    status: 'Passed & Key Sections Notified in 2024',
    statusType: 'passed',
    billNumber: 'Bill No. 172 of 2023',
    passedDate: 'Dec 24, 2023',
    pdfFileName: 'Telecommunications_Act_2023_Govt_Gazette.pdf',
    pdfSize: '15.6 MB',
    officialPdfDownloadUrl: 'https://dot.gov.in',
    syllabusPaper: 'UPSC GS Paper 3 (Infrastructure, Spectrum Allocation & Cyber Security)',
    summaryOverview: 'Replaces 138-year-old Indian Telegraph Act 1885 and Wireless Telegraphy Act 1933. Modernizes spectrum assignment (enables administrative allocation for satellite broadband like Starlink/OneWeb), establishes the Digital Bharat Nidhi (replacing USOF), and provides robust right-of-way (RoW) rules for 5G/6G optical fibre rollout.',
    keyProvisions: [
      'Replaces legacy Indian Telegraph Act 1885, Telegraph Wires Act 1950, and Indian Wireless Telegraphy Act 1933.',
      'Enables non-auction administrative allocation of satellite spectrum for public interest and space broadband services.',
      'Universal Service Obligation Fund (USOF) transformed into "Digital Bharat Nidhi" to fund telecom research & rural digital access.',
      'Uniform Right of Way (RoW) rules across state municipal bodies for rapid nationwide 5G/6G tower deployments.'
    ],
    examSignificance: 'Directly tested in GS 3 Infrastructure, Satellite Internet, and Space Policy.',
    tableOfContents: [
      {
        title: 'Chapter 3: Assignment of Spectrum and Spectrum Harmonisation',
        summary: 'Auction mechanisms vs Administrative allocation for satellite services, spectrum refarming, and secondary sharing.'
      }
    ]
  },
  {
    id: 'bill-caa-106',
    title: 'The Constitution (106th Amendment) Act, 2023 (Nari Shakti Vandan Adhiniyam)',
    shortCode: '106th CAA / Women Reservation Act',
    ministry: 'Ministry of Law and Justice & Ministry of Women and Child Development',
    officialGovtPortal: 'https://legislative.gov.in',
    officialGovtPortalName: 'Legislative Department (legislative.gov.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Constitutional Amendment',
    subject: 'Polity',
    year: '2023',
    status: 'Enacted as 106th Constitutional Amendment Act',
    statusType: 'amendment',
    billNumber: 'Constitution (128th Amendment) Bill, 2023',
    passedDate: 'Sept 21, 2023 (Assent: Sept 28, 2023)',
    pdfFileName: 'Constitution_106th_Amendment_Act_2023_Gazette.pdf',
    pdfSize: '6.2 MB',
    officialPdfDownloadUrl: 'https://legislative.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 (Parliament, State Legislatures & Gender Empowerment)',
    summaryOverview: 'Landmark constitutional amendment reserving one-third (33%) of all seats for women in Lok Sabha, State Legislative Assemblies, and the Legislative Assembly of NCT of Delhi. Inserts new Articles 330A, 332A, and 334A into the Indian Constitution.',
    keyProvisions: [
      'Inserts Article 330A: 33% reservation for women in Lok Sabha, including horizontal quota within SC/ST seats.',
      'Inserts Article 332A: 33% reservation for women in all State Legislative Assemblies across India.',
      'Inserts Article 334A: Sunset clause of 15 years from commencement with provision for extension by Parliament.',
      'Implementation timeline: Effective after the first decennial census published post-enactment followed by delimitation.'
    ],
    examSignificance: 'Mandatory landmark topic for UPSC Prelims & Mains Polity (Articles 330A, 332A, 334A, 239AA).',
    tableOfContents: [
      {
        title: 'Clause 2, 3 & 4: Constitutional Amendments to Articles 239AA, 330A, 332A',
        summary: 'Text of newly inserted articles detailing reservation ratios, rotational seat mechanics, and sunset provisions.'
      }
    ]
  },
  {
    id: 'bill-caa-103',
    title: 'The Constitution (103rd Amendment) Act, 2019 (10% EWS Reservation)',
    shortCode: '103rd CAA (EWS Quota)',
    ministry: 'Ministry of Social Justice and Empowerment',
    officialGovtPortal: 'https://socialjustice.gov.in',
    officialGovtPortalName: 'Ministry of Social Justice & Empowerment (socialjustice.gov.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Constitutional Amendment',
    subject: 'Polity',
    year: '2019',
    status: 'In Force & Upheld by Supreme Court (Janki Prasad / Janhit Abhiyan v. UOI 2022)',
    statusType: 'amendment',
    billNumber: 'Constitution (124th Amendment) Bill, 2019',
    passedDate: 'Jan 9, 2019 (Assent: Jan 12, 2019)',
    pdfFileName: 'Constitution_103rd_Amendment_EWS_Official.pdf',
    pdfSize: '5.8 MB',
    officialPdfDownloadUrl: 'https://legislative.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 (Fundamental Rights Art 15 & 16, Affirmative Action)',
    summaryOverview: 'Amended Articles 15 and 16 to provide up to 10% reservation in higher educational institutions and government employment for Economically Weaker Sections (EWS) of citizens other than SC, ST, and OBCs. Upheld by a 3:2 majority by the Supreme Court Constitution Bench in Janhit Abhiyan (2022).',
    keyProvisions: [
      'Inserts Article 15(6): Permits State to make special provisions for advancement of economically weaker citizens in educational institutions.',
      'Inserts Article 16(6): Permits up to 10% reservation in government job appointments for EWS candidates.',
      'Supreme Court landmark validation: 50% ceiling rule (Indra Sawhney 1992) applies to caste-based reservations, not economic criteria.'
    ],
    examSignificance: 'Frequently tested across UPSC Prelims (Article 15(6)/16(6)) and Mains GS 2 Social Justice.',
    tableOfContents: [
      {
        title: 'Article 15(6) and 16(6) Interpretation & Supreme Court Doctrine',
        summary: 'Legal analysis of Basic Structure doctrine review in Janhit Abhiyan judgment.'
      }
    ]
  },
  {
    id: 'bill-caa-101',
    title: 'The Constitution (101st Amendment) Act, 2016 (Goods and Services Tax - GST)',
    shortCode: '101st CAA (GST Constitutional Framework)',
    ministry: 'Ministry of Finance & GST Council',
    officialGovtPortal: 'https://gstcouncil.gov.in',
    officialGovtPortalName: 'GST Council Official Portal (gstcouncil.gov.in)',
    gazetteUrl: 'https://egazette.gov.in',
    category: 'Constitutional Amendment',
    subject: 'Economy',
    year: '2016',
    status: 'In Force nationwide from 1 July 2017',
    statusType: 'amendment',
    billNumber: 'Constitution (122nd Amendment) Bill, 2014',
    passedDate: 'Sept 8, 2016',
    pdfFileName: 'Constitution_101st_Amendment_GST_Act.pdf',
    pdfSize: '8.4 MB',
    officialPdfDownloadUrl: 'https://gstcouncil.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 & 3 (Fiscal Federalism, Article 246A, 269A, 279A)',
    summaryOverview: 'Revolutionized Indian taxation by replacing cascading indirect taxes (Excise, VAT, Service Tax) with a unified Goods and Services Tax (GST). Introduced Article 246A (simultaneous power of Union and States to levy GST), Article 269A (Inter-state GST/IGST), and Article 279A (GST Council as a constitutional body).',
    keyProvisions: [
      'Inserts Article 246A conferring simultaneous legislative powers on Parliament and State Legislatures.',
      'Inserts Article 279A establishing the GST Council chaired by Union Finance Minister with 2/3rd voting weight to States and 1/3rd to Union.',
      'Inserts Article 269A for apportionment of Integrated GST (IGST) on inter-state trade and commerce.'
    ],
    examSignificance: 'Foundation of Indian fiscal federalism and economic syllabus in UPSC CSE.',
    tableOfContents: [
      {
        title: 'Constitutional Articles 246A, 269A & 279A Text & Working',
        summary: 'Detailed explanation of cooperative federalism, voting mechanism in GST Council, and dispute resolution.'
      }
    ]
  },
  {
    id: 'bill-waqf-pending-2024',
    title: 'The Waqf (Amendment) Bill, 2024 (Pending in Parliament / JPC)',
    shortCode: 'Waqf Amendment Bill 2024',
    ministry: 'Ministry of Minority Affairs',
    officialGovtPortal: 'https://sansad.in',
    officialGovtPortalName: 'Sansad India Official Portal (sansad.in)',
    gazetteUrl: 'https://prsindia.org',
    category: 'Pending Bill',
    subject: 'Governance',
    year: '2024–2025',
    status: 'Introduced in Lok Sabha • Referred to Joint Parliamentary Committee (JPC)',
    statusType: 'pending',
    billNumber: 'Bill No. 109 of 2024',
    passedDate: 'Pending Parliamentary Review',
    pdfFileName: 'Waqf_Amendment_Bill_2024_PRS_Summary.pdf',
    pdfSize: '9.5 MB',
    officialPdfDownloadUrl: 'https://sansad.in',
    syllabusPaper: 'UPSC GS Paper 2 (Governance, Statutory Bodies & Property Rights)',
    summaryOverview: 'Proposes substantial amendments to the Waqf Act 1995. Renames the parent law to the Unified Waqf Management, Empowerment, Efficiency and Development Act 1995. Mandates inclusion of women and non-Muslim members in Central Waqf Council and State Waqf Boards, removes "Waqf by user", mandates government portal registration, and empowers District Collectors to resolve government land disputes.',
    keyProvisions: [
      'Omits the provision of "Waqf by user" – creation of Waqf requires explicit declaration by practicing person for at least 5 years.',
      'Composition of Central Waqf Council and State Boards: Mandates representation of women (at least 2 Muslim women) and 2 non-Muslim members.',
      'Role of District Collector: If any property is disputed as government land, the Collector conducts inquiry and updates revenue records before board declaration.',
      'Central portal and database: Mandatory online registration of all Waqf properties within 6 months.',
      'Streamlines audit powers by empowering CAG or central government appointed auditors.'
    ],
    examSignificance: 'High-probability UPSC Mains GS 2 question on Parliamentary Standing Committees/JPC and statutory regulation.',
    tableOfContents: [
      {
        title: 'Key Controversies & Arguments For / Against the Bill',
        summary: 'Analysis of federal autonomy, religious denomination rights under Article 26, and administrative transparency.'
      }
    ]
  },
  {
    id: 'bill-disaster-mgmt-2024',
    title: 'The Disaster Management (Amendment) Bill, 2024 (Pending in Parliament)',
    shortCode: 'Disaster Management Bill 2024',
    ministry: 'Ministry of Home Affairs',
    officialGovtPortal: 'https://ndma.gov.in',
    officialGovtPortalName: 'National Disaster Management Authority (ndma.gov.in)',
    gazetteUrl: 'https://prsindia.org',
    category: 'Pending Bill',
    subject: 'Environment',
    year: '2024–2025',
    status: 'Introduced in Lok Sabha • Under Parliamentary Standing Committee Scrutiny',
    statusType: 'pending',
    billNumber: 'Bill No. 104 of 2024',
    passedDate: 'Pending in Lok Sabha',
    pdfFileName: 'Disaster_Management_Amendment_Bill_2024.pdf',
    pdfSize: '10.2 MB',
    officialPdfDownloadUrl: 'https://ndma.gov.in',
    syllabusPaper: 'UPSC GS Paper 3 (Disaster Management, Urban Flooding & NDMA Framework)',
    summaryOverview: 'Amends the Disaster Management Act 2005 to create statutory Urban Disaster Management Authorities (UDMAs) for major state capital cities and million-plus municipal corporations, establishes a national disaster database, and integrates early warning systems with state disaster response forces.',
    keyProvisions: [
      'Creation of Urban Disaster Management Authorities (UDMA) headed by Municipal Commissioners to tackle urban flash floods and heatwaves.',
      'National Disaster Database: Digital mapping of disaster risk profiles, historical hazard data, and shelter capacities.',
      'Statutory recognition for State Disaster Response Forces (SDRF) on par with NDRF.'
    ],
    examSignificance: 'Directly applicable for GS 3 Disaster Management questions on Urban Floods, Glacial Lake Outburst Floods (GLOF), and Climate Resilience.',
    tableOfContents: [
      {
        title: 'Key Structural Changes to DM Act 2005',
        summary: 'Decentralization to municipal level, disaster mitigation funds allocation rules, and penal provision revisions.'
      }
    ]
  },
  {
    id: 'bill-banking-laws-2024',
    title: 'The Banking Laws (Amendment) Bill, 2024',
    shortCode: 'Banking Amendment Bill 2024',
    ministry: 'Department of Financial Services, Ministry of Finance',
    officialGovtPortal: 'https://financialservices.gov.in',
    officialGovtPortalName: 'Department of Financial Services (financialservices.gov.in)',
    gazetteUrl: 'https://prsindia.org',
    category: 'Pending Bill',
    subject: 'Economy',
    year: '2024–2025',
    status: 'Introduced in Parliament',
    statusType: 'pending',
    billNumber: 'Bill No. 115 of 2024',
    passedDate: 'Pending Parliamentary Review',
    pdfFileName: 'Banking_Laws_Amendment_Bill_2024.pdf',
    pdfSize: '8.7 MB',
    officialPdfDownloadUrl: 'https://financialservices.gov.in',
    syllabusPaper: 'UPSC GS Paper 3 (Banking Sector, RBI Regulatory Power & Financial Inclusion)',
    summaryOverview: 'Amends the Reserve Bank of India Act 1934, Banking Regulation Act 1949, State Bank of India Act 1955, and Banking Companies Acquisition Acts. Allows bank account holders to nominate up to four nominees (simultaneously or consecutively), updates substantial interest thresholds from ₹5 Lakh to ₹2 Crore, and changes reporting dates for banks from fortnightly alternate Fridays to 15th and last day of month.',
    keyProvisions: [
      'Increases maximum number of nominees per bank account / deposit from 1 to 4.',
      'Redefines "substantial interest" for bank directorships from ₹5 Lakh to ₹2 Crore reflecting 6 decades of economic growth.',
      'Harmonizes bank reporting timeline with calendar month-end cycle.'
    ],
    examSignificance: 'High yield for Banking / RBI exams and UPSC Prelims Economy.',
    tableOfContents: [
      {
        title: 'Amendments to Banking Regulation Act 1949',
        summary: 'Nomination rules, auditor tenure flexibilities, and co-operative bank regulatory provisions.'
      }
    ]
  }
];

// 2. OFFICIAL GOVERNMENT REPORTS & ECONOMIC DOCUMENTS
export const GOVERNMENT_REPORTS_DATA: OfficialGovtResource[] = [
  {
    id: 'rep-union-budget-2026',
    title: 'Union Budget 2026-27 Complete Speech, Capex Allocation & Tax Framework',
    shortCode: 'Union Budget 2026-27 (Official)',
    ministry: 'Ministry of Finance, Government of India',
    officialGovtPortal: 'https://www.indiabudget.gov.in',
    officialGovtPortalName: 'Union Budget Official Portal (indiabudget.gov.in)',
    gazetteUrl: 'https://pib.gov.in',
    category: 'Govt Report',
    subject: 'Economy',
    year: '2026–2027',
    status: 'Presented in Parliament & Enacted',
    statusType: 'official-report',
    pdfFileName: 'Union_Budget_2026_27_Full_Official_Compendium.pdf',
    pdfSize: '32.6 MB',
    officialPdfDownloadUrl: 'https://www.indiabudget.gov.in',
    syllabusPaper: 'UPSC GS Paper 3 (Fiscal Policy, Budgeting, Taxation & Infrastructure Capex)',
    summaryOverview: 'Official Union Budget highlighting ₹11.11+ Lakh Crore capital expenditure push (3.4% of GDP), fiscal deficit consolidation path targeted at below 4.5% of GDP, revised income tax slab limits under the New Tax Regime, PM Surya Ghar Muft Bijli Yojana, and Next-Gen semiconductor & AI skilling corridors.',
    keyProvisions: [
      'Capital Expenditure (Capex) Target: Maintained at record highs to drive multi-modal logistics & rail freight corridors.',
      'Fiscal Deficit Target: Consolidated towards 4.5% of GDP in line with Medium Term Fiscal Policy framework.',
      'New Income Tax Regime: Standard deduction enhanced; slab revisions providing relief to middle-income earners.',
      'Green Energy & Agriculture: Digital Agriculture Public Infrastructure (DPI) and Climate Resilient Crop Seeds rollout.'
    ],
    examSignificance: 'Mandatory for all 2026-27 competitive exams (UPSC Prelims/Mains, RBI Grade B, SSC CGL, State PCS).',
    tableOfContents: [
      {
        title: 'Part A: Macroeconomic Framework, Capex & Sectoral Allocations',
        summary: 'Agriculture, Infrastructure, Energy Transition, MSME Credit Guarantee scheme, and Skill Development.'
      },
      {
        title: 'Part B: Direct and Indirect Tax Proposals',
        summary: 'Customs duty rationalization on critical minerals, electronics manufacturing exemptions, and corporate tax rates.'
      }
    ]
  },
  {
    id: 'rep-econ-survey-2025-26',
    title: 'Economic Survey 2025-26 Volume I & II Full Analytical Report',
    shortCode: 'Economic Survey 2025-26',
    ministry: 'Department of Economic Affairs, Ministry of Finance',
    officialGovtPortal: 'https://www.econsurvey.gov.in',
    officialGovtPortalName: 'Economic Survey Official Portal (econsurvey.gov.in)',
    category: 'Govt Report',
    subject: 'Economy',
    year: '2025–2026',
    status: 'Official Annual Report',
    statusType: 'official-report',
    pdfFileName: 'Economic_Survey_2025_26_Complete_Volume_1_2.pdf',
    pdfSize: '44.8 MB',
    officialPdfDownloadUrl: 'https://www.econsurvey.gov.in',
    syllabusPaper: 'UPSC GS Paper 3 (Macroeconomics, Monetary Policy, External Sector & Employment)',
    summaryOverview: 'Prepared under the Chief Economic Advisor (CEA), analyzing India’s real GDP growth at 6.5%–7.0%, foreign exchange resilience exceeding $650 Billion, private capital expenditure revival, services exports strength, and strategic policies for AI integration and climate adaptation.',
    keyProvisions: [
      'Real GDP Growth: Projected at 6.5% - 7.0% supported by robust domestic consumption and infrastructure investment.',
      'Inflation & Food Dynamics: Core inflation at multi-year lows; supply-side buffer management for perishable commodities.',
      'External Sector: Current Account Deficit (CAD) contained below 1.5% of GDP; record services export surplus.',
      'Employment & Skilling: Tripartite model for employment generation, gig economy worker formalization, and women labor force participation.'
    ],
    examSignificance: 'The single most cited government document in UPSC CSE Mains GS 3 questions.',
    tableOfContents: [
      {
        title: 'Chapter 1: State of the Economy - Steady and Resilient',
        summary: 'Global headwinds vs Indian macroeconomic tailwinds, domestic demand, credit growth, and corporate balance sheets.'
      },
      {
        title: 'Chapter 4: Monetary Management and Financial Intermediation',
        summary: 'Scheduled Commercial Banks GNPA drop to decade low, digital public infrastructure, and UPI global expansion.'
      }
    ]
  },
  {
    id: 'rep-niti-sdg-2025',
    title: 'NITI Aayog SDG India Index & Multidimensional Poverty Report 2025-26',
    shortCode: 'NITI Aayog SDG Index',
    ministry: 'NITI Aayog (National Institution for Transforming India)',
    officialGovtPortal: 'https://niti.gov.in',
    officialGovtPortalName: 'NITI Aayog Official Portal (niti.gov.in)',
    category: 'Govt Report',
    subject: 'Governance',
    year: '2025–2026',
    status: 'Official Apex Policy Report',
    statusType: 'official-report',
    pdfFileName: 'NITI_Aayog_SDG_India_Index_2025_26.pdf',
    pdfSize: '28.1 MB',
    officialPdfDownloadUrl: 'https://niti.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 & 3 (Poverty, Health, Education, SDG 2030 Targets & Federalism)',
    summaryOverview: 'Official composite index tracking India’s progress across all 17 Sustainable Development Goals (SDGs). Highlights that over 24.8 Crore Indians exited multidimensional poverty over the last 9 years, with states like Kerala, Uttarakhand, and Tamil Nadu leading the composite scoreboards.',
    keyProvisions: [
      'Comprehensive performance scoring (0-100) for all 28 States and 8 UTs across 115 national indicators.',
      'Multidimensional Poverty Headcount ratio dropped from 29.17% (2013-14) to under 11.28%.',
      'Target progress in Clean Water (SDG 6 via Jal Jeevan Mission) and Affordable Clean Energy (SDG 7 via PM Ujjwala/Saubhagya).'
    ],
    examSignificance: 'Essential data points for UPSC Mains Essay, GS 2 Governance, and GS 3 Poverty eradication.',
    tableOfContents: [
      {
        title: 'National & State-wise Scorecard on SDGs 1 to 17',
        summary: 'Front-runner states, aspirational districts program impact, and methodology of Multidimensional Poverty measurement.'
      }
    ]
  },
  {
    id: 'rep-2nd-arc-reports',
    title: '2nd Administrative Reforms Commission (ARC) Complete 15 Reports Compendium',
    shortCode: '2nd ARC Reports (15 Volumes)',
    ministry: 'Department of Administrative Reforms and Public Grievances (DARPG)',
    officialGovtPortal: 'https://darpg.gov.in',
    officialGovtPortalName: 'DARPG Portal (darpg.gov.in)',
    category: 'Govt Report',
    subject: 'Governance',
    year: 'Official Compendium',
    status: 'Landmark Administrative Recommendations',
    statusType: 'official-report',
    pdfFileName: '2nd_ARC_Complete_15_Reports_Civil_Services_Summary.pdf',
    pdfSize: '36.4 MB',
    officialPdfDownloadUrl: 'https://darpg.gov.in',
    syllabusPaper: 'UPSC GS Paper 2 (Governance & Civil Services) & GS Paper 4 (Ethics, Integrity & Aptitude)',
    summaryOverview: 'The benchmark blueprint for civil service governance, containing high-yield summaries of Report 1 (Right to Information), Report 4 (Ethics in Governance), Report 6 (Local Governance), Report 10 (Personnel Administration), and Report 12 (Citizen Centric Administration).',
    keyProvisions: [
      'Report 4: Ethics in Governance – Code of Ethics, Whistleblowers protection, and Lokpal framework.',
      'Report 1: RTI - Master Key to Good Governance – Proactive disclosure under Section 4 and official secrets act reform.',
      'Report 10: Refurbishing Personnel Administration – Performance-linked incentives, lateral entry, and civil services code.',
      'Report 12: Citizen Centric Administration – Sevottam Model and Citizens Charters enforcement.'
    ],
    examSignificance: 'Mandatory reference for UPSC Ethics (GS 4) and Governance (GS 2) answer writing.',
    tableOfContents: [
      {
        title: 'Volume 4: Ethics in Governance & Anti-Corruption Mechanisms',
        summary: 'Nolan Committee 7 principles, institutional reforms, and code of conduct for civil servants.'
      }
    ]
  },
  {
    id: 'rep-isfr-forest-2025',
    title: 'India State of Forest Report (ISFR) 2025 (Forest Survey of India)',
    shortCode: 'ISFR 2025 Forest Report',
    ministry: 'Forest Survey of India (FSI) & Ministry of Environment, Forest and Climate Change (MoEFCC)',
    officialGovtPortal: 'https://fsi.nic.in',
    officialGovtPortalName: 'Forest Survey of India Official Portal (fsi.nic.in)',
    category: 'Govt Report',
    subject: 'Environment',
    year: '2025',
    status: 'Official Biennial Assessment',
    statusType: 'official-report',
    pdfFileName: 'India_State_of_Forest_Report_ISFR_2025.pdf',
    pdfSize: '38.0 MB',
    officialPdfDownloadUrl: 'https://fsi.nic.in',
    syllabusPaper: 'UPSC GS Paper 3 (Forest Cover, Mangroves, Bamboo Resources & Carbon Stock)',
    summaryOverview: 'Biennial official assessment mapping India’s total forest and tree cover, mangrove ecosystems, tiger reserve canopy density, bamboo resources, and national carbon stock (over 7,200 Million Tonnes). Madhya Pradesh leads in largest forest area, while Mizoram leads in percentage forest cover.',
    keyProvisions: [
      'Total Forest & Tree Cover: Estimated at 24.62%+ of total geographical area of India.',
      'States with highest forest cover by Area: Madhya Pradesh > Arunachal Pradesh > Chhattisgarh > Odisha.',
      'States with highest forest cover by Percentage: Mizoram > Arunachal Pradesh > Meghalaya > Manipur.',
      'Mangrove Cover: Sunderbans (West Bengal) and Gujarat coast leading mangrove growth.'
    ],
    examSignificance: 'Direct factual MCQs in UPSC Prelims Environment and State PCS exams every year.',
    tableOfContents: [
      {
        title: 'National Forest Cover & Decadal Growth Trends',
        summary: 'Very Dense Forest (VDF), Moderately Dense Forest (MDF), Open Forest (OF), and Scrub cover.'
      }
    ]
  },
  {
    id: 'rep-rbi-annual-report',
    title: 'Reserve Bank of India (RBI) Annual Report & Currency & Finance 2025-26',
    shortCode: 'RBI Annual Report 2025-26',
    ministry: 'Reserve Bank of India (RBI)',
    officialGovtPortal: 'https://www.rbi.org.in',
    officialGovtPortalName: 'Reserve Bank of India Official Portal (rbi.org.in)',
    category: 'Govt Report',
    subject: 'Economy',
    year: '2025–2026',
    status: 'Official Central Bank Publication',
    statusType: 'official-report',
    pdfFileName: 'RBI_Annual_Report_2025_26_Official.pdf',
    pdfSize: '26.4 MB',
    officialPdfDownloadUrl: 'https://www.rbi.org.in',
    syllabusPaper: 'UPSC GS Paper 3 (Monetary Policy, Central Bank Digital Currency e-Rupee, Forex & FinTech)',
    summaryOverview: 'The authoritative central banking report detailing India’s monetary transmission, liquidity management, Central Bank Digital Currency (CBDC / e-Rupee) retail pilots, foreign currency asset reserves, and systemic stability of Scheduled Commercial Banks.',
    keyProvisions: [
      'Monetary Policy stance, inflation targeting band (4% +/- 2%), and liquidity adjustment facility (LAF).',
      'Progress on CBDC / Digital Rupee adoption across wholesale and cross-border retail merchant settlements.',
      'Gross NPA ratio of banking system dropping below 2.8%, showcasing robust capital adequacy ratios (CRAR).'
    ],
    examSignificance: 'Vital for RBI Grade B Officers Exam, UPSC Prelims Economy, and Bank PO interviews.',
    tableOfContents: [
      {
        title: 'Chapter 2: Financial Stability, Digital Payments and Bank Regulation',
        summary: 'UPI transaction volume landmarks, cyber-security norms, and NBFC scale-based regulatory frameworks.'
      }
    ]
  }
];

// 3. COMPLETE NCERT TEXTBOOKS (CLASS 6 TO 12 SECTION-WISE)
export const NCERT_TEXTBOOKS_DATA: NCERTBookItem[] = [
  {
    id: 'ncert-hist-cl6',
    bookTitle: 'Our Pasts - I (History)',
    classLevel: 'Class 6',
    subject: 'History',
    medium: 'English & Hindi',
    code: 'fess101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?fess1=0-10',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_6_History_Our_Pasts_I.pdf',
    pdfSize: '14.5 MB',
    chaptersCount: 10,
    keyTopics: ['What, Where, How and When?', 'From Hunting-Gathering to Growing Food', 'In the Earliest Cities (Harappa)', 'What Books and Burials Tell Us (Vedas)', 'Kingdoms, Kings and an Early Republic (Janapadas & Mahajanapadas)'],
    prelimsRelevance: 'High: Indus Valley seals, Megalithic burial types, Mahajanapadas 16 capitals.',
    sampleChapters: [
      {
        title: 'Chapter 3: In the Earliest Cities (Harappan Civilisation)',
        summary: 'Citadel vs Lower Town, Great Bath at Mohenjo-daro, Harappan drainage system, seals, terracotta toys, bronze dancing girl, and trade dockyard at Lothal.'
      },
      {
        title: 'Chapter 5: Kingdoms, Kings and an Early Republic',
        summary: 'Ashvamedha ritual, 16 Mahajanapadas, Magadha rise under Bimbisara and Ajatashatru, Vajji Sangha democracy, and taxation (bhaga - 1/6th of produce).'
      }
    ]
  },
  {
    id: 'ncert-hist-cl7',
    bookTitle: 'Our Pasts - II (History)',
    classLevel: 'Class 7',
    subject: 'History',
    medium: 'English & Hindi',
    code: 'gess101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?gess1=0-8',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_7_History_Our_Pasts_II.pdf',
    pdfSize: '16.2 MB',
    chaptersCount: 8,
    keyTopics: ['Kings and Kingdoms (Cholas)', 'Delhi: 12th to 15th Century (Sultanate)', 'The Mughals (16th to 17th Century)', 'Tribes, Nomads and Settled Communities', 'Devotional Paths to the Divine (Bhakti & Sufi)'],
    prelimsRelevance: 'Chola local administration (Uttaramerur inscription), Delhi Sultanate market reforms (Alauddin Khalji), Mughal Mansabdari system.',
    sampleChapters: [
      {
        title: 'Chapter 2: Kings and Kingdoms - The Cholas',
        summary: 'Rajaraja I and Rajendra I, Gangaikondacholapuram, Brihadisvara Temple, Chola bronze Nataraja, and village assemblies (Ur and Sabha).'
      },
      {
        title: 'Chapter 6: Devotional Paths to the Divine (Bhakti Movement)',
        summary: 'Nayanars (Shiva) and Alvars (Vishnu), Shankara (Advaita), Ramanuja (Vishishtadvaita), Basavanna Virashaivism, Kabir, Mirabai, and Guru Nanak.'
      }
    ]
  },
  {
    id: 'ncert-hist-cl8',
    bookTitle: 'Our Pasts - III (Modern History)',
    classLevel: 'Class 8',
    subject: 'History',
    medium: 'English & Hindi',
    code: 'hess101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?hess1=0-8',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_8_History_Our_Pasts_III.pdf',
    pdfSize: '18.4 MB',
    chaptersCount: 8,
    keyTopics: ['From Trade to Territory (Company Rule)', 'Ruling the Countryside (Permanent Settlement)', 'Tribals, Dikus and the Vision of a Golden Age (Birsa Munda)', 'When People Rebel: 1857 and After', 'Civilising the "Native", Educating the Nation (Macaulay Minute)'],
    prelimsRelevance: 'Permanent Settlement, Ryotwari vs Mahalwari systems, 1857 leaders, Santhal & Munda uprisings.',
    sampleChapters: [
      {
        title: 'Chapter 5: When People Rebel (1857 and After)',
        summary: 'Causes of sepoy discontent, Enfield rifle greased cartridges, capture of Delhi, Bahadur Shah Zafar proclamation, and GOI Act 1858 transferring power to British Crown.'
      }
    ]
  },
  {
    id: 'ncert-hist-cl11',
    bookTitle: 'Themes in World History',
    classLevel: 'Class 11',
    subject: 'History',
    medium: 'English & Hindi',
    code: 'kess101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?kess1=0-7',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_11_History_Themes_in_World_History.pdf',
    pdfSize: '22.0 MB',
    chaptersCount: 7,
    keyTopics: ['Writing and City Life (Mesopotamia)', 'An Empire Across Three Continents (Roman Empire)', 'Nomadic Empires (Genghis Khan & Mongols)', 'The Three Orders (Feudal Europe)', 'Changing Cultural Traditions (Renaissance)', 'Displacing Indigenous Peoples', 'Paths to Modernisation (Japan & China)'],
    prelimsRelevance: 'World History GS 1 Mains syllabus: Renaissance, Industrial Revolution, Meiji Restoration in Japan.',
    sampleChapters: [
      {
        title: 'Theme 7: Paths to Modernisation (Japan & China)',
        summary: 'Tokugawa Shogunate, Meiji Restoration 1868, Fukuzawa Yukichi modernization ideas, Opium Wars in China, Sun Yat-sen Three Principles, and 1949 Chinese Revolution.'
      }
    ]
  },
  {
    id: 'ncert-hist-cl12-comp',
    bookTitle: 'Themes in Indian History - Part I, II & III (Compendium)',
    classLevel: 'Class 12',
    subject: 'History',
    medium: 'English & Hindi',
    code: 'less101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?less1=0-4',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_12_Themes_in_Indian_History_Complete.pdf',
    pdfSize: '34.5 MB',
    chaptersCount: 12,
    keyTopics: ['Bricks, Beads and Bones (Harappa)', 'Kings, Farmers and Towns (Inscriptions & Mauryas)', 'Kinship, Caste and Class (Mahabharata society)', 'Thinkers, Beliefs and Buildings (Sanchi Stupa & Buddhism)', 'Through the Eyes of Travellers (Al-Biruni, Ibn Battuta, Bernier)', 'Bhakti-Sufi Traditions', 'An Imperial Capital: Vijayanagara', 'Peasants, Zamindars and the State (Ain-i-Akbari)', 'Colonialism and the Countryside', 'Rebels and the Raj (1857)', 'Mahatma Gandhi and the Nationalist Movement', 'Framing the Constitution'],
    prelimsRelevance: 'The single most critical book for UPSC Prelims Ancient, Medieval, and Modern History MCQs.',
    sampleChapters: [
      {
        title: 'Theme 7: An Imperial Capital - Vijayanagara',
        summary: 'Foundation by Harihara and Bukka (1336), Krishnadevaraya reign, Mahanavami Dibba, Lotus Mahal, Hazara Rama Temple, water systems (Kamalapuram tank & Hiriya canal), and Battle of Talikota 1565.'
      },
      {
        title: 'Theme 12: Framing the Constitution',
        summary: 'Constituent Assembly debates on Fundamental Rights, Language question (Hindustani vs Hindi), Separate Electorates rejection, and Federalism distribution of powers.'
      }
    ]
  },
  {
    id: 'ncert-geog-cl11-phy',
    bookTitle: 'Fundamentals of Physical Geography',
    classLevel: 'Class 11',
    subject: 'Geography',
    medium: 'English & Hindi',
    code: 'kegy101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?kegy1=0-14',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_11_Fundamentals_of_Physical_Geography.pdf',
    pdfSize: '24.8 MB',
    chaptersCount: 14,
    keyTopics: ['The Origin and Evolution of the Earth', 'Interior of the Earth (Seismic P & S waves)', 'Distribution of Oceans and Continents (Continental Drift & Plate Tectonics)', 'Geomorphic Processes (Weathering & Mass Movements)', 'Landforms and their Evolution (Fluvial, Aeolian, Karst, Glacial, Coastal)', 'Composition and Structure of Atmosphere', 'Solar Radiation, Heat Balance and Temperature', 'Atmospheric Circulation and Weather Systems', 'Water in the Atmosphere', 'World Climate and Climate Change (Koppen Classification)', 'Water (Oceans) - Submarine Relief & Tides', 'Movements of Ocean Water (Ocean Currents)', 'Life on the Earth (Biomes & Ecology)'],
    prelimsRelevance: 'Gold Standard for UPSC Geography Prelims & Mains Geomorphology, Oceanography, and Climatology.',
    sampleChapters: [
      {
        title: 'Chapter 4: Plate Tectonics and Seafloor Spreading',
        summary: 'Alfred Wegener Continental Drift evidence, Paleomagnetism, Seafloor spreading (Harry Hess), 7 major plates, convergent/divergent boundaries, and Pacific Ring of Fire.'
      },
      {
        title: 'Chapter 10: Atmospheric Circulation & Cyclones',
        summary: 'Hadley, Ferrel, and Polar cells, Coriolis force, Jet streams, Tropical Cyclones formation conditions, and Temperate vs Tropical cyclone comparison.'
      }
    ]
  },
  {
    id: 'ncert-geog-cl11-ind',
    bookTitle: 'India - Physical Environment',
    classLevel: 'Class 11',
    subject: 'Geography',
    medium: 'English & Hindi',
    code: 'kegy201',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?kegy2=0-7',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_11_India_Physical_Environment.pdf',
    pdfSize: '26.2 MB',
    chaptersCount: 7,
    keyTopics: ['India - Location & Frontiers', 'Structure and Physiography (Himalayas, Northern Plains, Peninsular Plateau, Coastal Plains, Islands)', 'Drainage System (Himalayan vs Peninsular River Systems)', 'Climate (Monsoon Mechanism, ITCZ, Western Disturbances)', 'Natural Vegetation (Tropical Evergreen to Alpine)', 'Soils (Alluvial, Black, Red, Laterite, Arid)', 'Natural Hazards and Disasters'],
    prelimsRelevance: 'Critical for all Indian Geography map questions: River tributaries, passes, mountain peaks, and soil types.',
    sampleChapters: [
      {
        title: 'Chapter 3: Drainage System of India',
        summary: 'Indus, Ganga, Brahmaputra river systems with left/right bank tributaries; Peninsular rivers (Godavari, Krishna, Cauvery, Narmada, Tapi, Mahanadi) and drainage patterns (Dendritic, Radial, Trellis).'
      }
    ]
  },
  {
    id: 'ncert-polity-cl11',
    bookTitle: 'Indian Constitution at Work',
    classLevel: 'Class 11',
    subject: 'Polity',
    medium: 'English & Hindi',
    code: 'keps101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?keps1=0-10',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_11_Indian_Constitution_at_Work.pdf',
    pdfSize: '19.4 MB',
    chaptersCount: 10,
    keyTopics: ['Constitution: Why and How?', 'Rights in the Indian Constitution (Fundamental Rights vs DPSP)', 'Election and Representation (First-Past-The-Post vs Proportional Representation)', 'Executive (President, PM, Council of Ministers)', 'Legislature (Parliamentary Procedures & Committees)', 'Judiciary (Judicial Independence, Judicial Review & PIL)', 'Federalism (Centre-State Relations & Inter-State Council)', 'Local Governments (73rd and 74th Amendments)', 'Constitution as a Living Document', 'The Philosophy of the Constitution'],
    prelimsRelevance: 'Conceptual backbone of UPSC Polity: FPTP system, Basic Structure doctrine, and Judicial Review.',
    sampleChapters: [
      {
        title: 'Chapter 2: Rights in the Indian Constitution',
        summary: 'Differences between Fundamental Rights and Ordinary Legal Rights, Writs under Article 32, National Human Rights Commission (NHRC), and Relationship between Fundamental Rights and Directive Principles.'
      },
      {
        title: 'Chapter 6: Judiciary & Judicial Activism',
        summary: 'Appointment of Judges (Collegium System), Original/Appellate/Advisory jurisdiction of Supreme Court, Public Interest Litigation (PIL), and Judicial Overreach debate.'
      }
    ]
  },
  {
    id: 'ncert-econ-cl11',
    bookTitle: 'Indian Economic Development',
    classLevel: 'Class 11',
    subject: 'Economy',
    medium: 'English & Hindi',
    code: 'keec101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?keec1=0-8',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_11_Indian_Economic_Development.pdf',
    pdfSize: '21.0 MB',
    chaptersCount: 8,
    keyTopics: ['Indian Economy on the Eve of Independence', 'Indian Economy (1950-1990) - Five Year Plans & Industrial Policy 1956', 'Liberalisation, Privatisation and Globalisation: An Appraisal (LPG Reforms 1991)', 'Human Capital Formation in India', 'Rural Development (Micro-credit, Self-Help Groups, Organic Farming)', 'Employment: Growth, Informalisation and Other Issues', 'Environment and Sustainable Development', 'Comparative Development Experiences of India and Its Neighbours (China & Pakistan)'],
    prelimsRelevance: 'Essential for Mains GS 3 Indian Economy planning, LPG reforms 1991, and Green Revolution evaluations.',
    sampleChapters: [
      {
        title: 'Chapter 3: Liberalisation, Privatisation and Globalisation (LPG 1991)',
        summary: 'Balance of Payment (BOP) crisis 1991, IMF structural adjustment conditionalities, industrial delicensing, financial sector reforms, disinvestment, and WTO establishment.'
      }
    ]
  },
  {
    id: 'ncert-econ-cl12-macro',
    bookTitle: 'Introductory Macroeconomics',
    classLevel: 'Class 12',
    subject: 'Economy',
    medium: 'English & Hindi',
    code: 'leec101',
    officialNcertUrl: 'https://ncert.nic.in/textbook.php?leec1=0-6',
    officialEpathshalaUrl: 'https://epathshala.nic.in',
    pdfFileName: 'NCERT_Class_12_Introductory_Macroeconomics.pdf',
    pdfSize: '15.8 MB',
    chaptersCount: 6,
    keyTopics: ['Introduction to Macroeconomics', 'National Income Accounting (GDP, GNP, NNP, Real vs Nominal)', 'Money and Banking (Money Creation, High Powered Money, RBI Tools)', 'Determination of Income and Employment (Keynesian Aggregate Demand)', 'Government Budget and the Economy (Revenue/Capital Deficit, Fiscal Deficit)', 'Open Economy Macroeconomics (BOP, Foreign Exchange Rate, Real Effective Exchange Rate)'],
    prelimsRelevance: 'The fundamental theoretical source for all UPSC Prelims Macroeconomics MCQs.',
    sampleChapters: [
      {
        title: 'Chapter 3: Money and Banking',
        summary: 'Functions of money, Motives for holding money (Transaction & Speculative), Money Multiplier formula (1/LRR), Cash Reserve Ratio (CRR), Statutory Liquidity Ratio (SLR), and High-Powered Money (M0 to M3).'
      }
    ]
  }
];

// 4. COMMERCIAL STANDARD REFERENCE TEXTBOOKS WITH AMAZON & FLIPKART LINKS
export const STANDARD_BOOKS_DATA: StandardBookItem[] = [
  {
    id: 'bk-polity-laxmikanth',
    title: 'Indian Polity for Civil Services & State Examinations',
    author: 'M. Laxmikanth',
    edition: '7th Revised Edition (2025–2026)',
    publisher: 'McGraw Hill Education',
    category: 'Polity',
    exam: ['UPSC CSE', 'State PCS', 'SSC CGL', 'IBPS PO', 'NDA/CDS'],
    mrp: '₹995',
    discountPrice: '₹685',
    discountPercent: '31% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=M+Laxmikanth+Indian+Polity+7th+Edition',
      flipkart: 'https://www.flipkart.com/search?q=Indian+Polity+M+Laxmikanth+7th+edition',
      publisher: 'https://www.mheducation.co.in'
    },
    pdfFileName: 'Indian_Polity_7th_Edition_Laxmikanth_Revision_Summary.pdf',
    pdfSize: '28.4 MB',
    rating: 4.9,
    reviewsCount: '24,500+',
    keyHighlights: [
      'Updated with the 106th Constitutional Amendment Act (Nari Shakti Vandan) & newly created UTs',
      'Contains 80 comprehensive chapters covering Preamble, Fundamental Rights to Statutory Commissions',
      'Includes chapter-wise Prelims and Mains model questions with detailed answer keys'
    ],
    sampleChapters: [
      {
        title: 'Chapter 1: Historical Background & Making of the Constitution',
        summary: 'Chronology of Regulating Act 1773, Pitt’s India Act 1784, Charter Acts (1813, 1833, 1853), Government of India Acts 1858, 1919 & 1935, Constituent Assembly committees, and drafting landmarks.'
      },
      {
        title: 'Chapter 7: Fundamental Rights (Articles 12 to 35)',
        summary: 'In-depth analysis of Right to Equality (Art 14-18), Freedom (Art 19-22), Right against Exploitation (Art 23-24), Religious Freedom (Art 25-28), Cultural Rights (Art 29-30), and Writs under Article 32.'
      },
      {
        title: 'Chapter 12: Parliamentary System & Cabinet Committees',
        summary: 'Comparison between Presidential and Parliamentary forms, Collective Responsibility, No-Confidence Motion, Cut Motions, and Cabinet Committees.'
      }
    ]
  },
  {
    id: 'bk-economy-ramesh',
    title: 'Indian Economy for UPSC & State Services',
    author: 'Ramesh Singh',
    edition: '16th Latest Edition (2025–2026)',
    publisher: 'McGraw Hill Education',
    category: 'Economy',
    exam: ['UPSC CSE', 'State PCS', 'RBI Grade B', 'IBPS PO'],
    mrp: '₹850',
    discountPrice: '₹590',
    discountPercent: '30% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=Ramesh+Singh+Indian+Economy+16th+edition',
      flipkart: 'https://www.flipkart.com/search?q=Indian+Economy+Ramesh+Singh',
      publisher: 'https://www.mheducation.co.in'
    },
    pdfFileName: 'Indian_Economy_Ramesh_Singh_16th_Ed_Summary.pdf',
    pdfSize: '22.1 MB',
    rating: 4.8,
    reviewsCount: '18,200+',
    keyHighlights: [
      'Comprehensive integration with Union Budget 2026-27 & Economic Survey High-Yield Key Points',
      'In-depth explanations of Inflation, RBI Monetary Policy, Banking Sector & Insolvency Code',
      'Glossary of 500+ Macroeconomic terms for UPSC Prelims'
    ],
    sampleChapters: [
      {
        title: 'Chapter 3: Growth, Development & Happiness Index',
        summary: 'GDP vs GNP vs NNP calculations, Real vs Nominal GDP, Human Development Index (HDI), Multidimensional Poverty Index (MPI), and Gross National Happiness.'
      },
      {
        title: 'Chapter 7: Banking Sector & Non-Performing Assets (NPAs)',
        summary: 'RBI Monetary Policy instruments (Repo, Reverse Repo, CRR, SLR, MSF, SDF), Insolvency and Bankruptcy Code (IBC 2016), SARFAESI Act, and Bad Bank (NARCL).'
      }
    ]
  },
  {
    id: 'bk-history-spectrum',
    title: 'A Brief History of Modern India (Spectrum)',
    author: 'Rajiv Ahir (IPS)',
    edition: '2025–2026 Revised & Enlarged Edition',
    publisher: 'Spectrum Books Pvt Ltd',
    category: 'History',
    exam: ['UPSC CSE', 'SSC CGL', 'State PCS', 'RRB NTPC', 'NDA/CDS'],
    mrp: '₹495',
    discountPrice: '₹370',
    discountPercent: '25% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=Spectrum+Modern+India+Rajiv+Ahir',
      flipkart: 'https://www.flipkart.com/search?q=Brief+History+of+Modern+India+Spectrum'
    },
    pdfFileName: 'Spectrum_Modern_Indian_History_HighYield_Compendium.pdf',
    pdfSize: '19.8 MB',
    rating: 4.9,
    reviewsCount: '32,100+',
    keyHighlights: [
      'Chronological breakdown from Decline of Mughals & Advent of Europeans to Independence 1947',
      'Summary tables at the end of every chapter for rapid last-minute revision',
      'Covers Governor Generals, Tribal/Peasant Uprisings, Constitutional Acts, and Press Regulations'
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
    edition: '4th Edition with Full Colour Illustrations',
    publisher: 'McGraw Hill Education',
    category: 'History',
    exam: ['UPSC CSE', 'State PCS'],
    mrp: '₹895',
    discountPrice: '₹620',
    discountPercent: '30% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=Nitin+Singhania+Art+and+Culture',
      flipkart: 'https://www.flipkart.com/search?q=Indian+Art+and+Culture+Nitin+Singhania'
    },
    pdfFileName: 'Nitin_Singhania_Art_and_Culture_Notes.pdf',
    pdfSize: '31.2 MB',
    rating: 4.8,
    reviewsCount: '15,400+',
    keyHighlights: [
      'Visual diagrams for Temple Architecture (Nagara, Dravida, Vesara styles)',
      'Comprehensive breakdown of UNESCO World Heritage Sites in India',
      'Classical Dances, Carnatic & Hindustani Music, Folk Arts & Martial Arts of India'
    ],
    sampleChapters: [
      {
        title: 'Chapter 1: Indian Architecture, Sculpture & Pottery',
        summary: 'Indus Valley Civilisation Seals & Bronzes, Mauryan Pillars, Stupas (Sanchi & Bharhut), Rock-cut caves (Ajanta & Ellora), and Temple architectural evolution.'
      }
    ]
  },
  {
    id: 'bk-geography-gcleong',
    title: 'Certificate Physical and Human Geography',
    author: 'G.C. Leong',
    edition: 'Oxford University Press Standard Classic',
    publisher: 'Oxford University Press',
    category: 'Geography',
    exam: ['UPSC CSE', 'State PCS', 'SSC CGL'],
    mrp: '₹425',
    discountPrice: '₹315',
    discountPercent: '26% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=GC+Leong+Certificate+Physical+and+Human+Geography',
      flipkart: 'https://www.flipkart.com/search?q=Certificate+Physical+and+Human+Geography+GC+Leong'
    },
    pdfFileName: 'GC_Leong_Physical_Geography_Full_Book_PDF.pdf',
    pdfSize: '16.5 MB',
    rating: 4.9,
    reviewsCount: '21,000+',
    keyHighlights: [
      'Fundamental text for Geomorphology, Climatology & Oceanography worldwide',
      'Clear hand-drawn diagrams explaining Plate Tectonics, Weathering, River Landforms',
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
    edition: '10th Updated Edition (2025–2026)',
    publisher: 'Shankar IAS Publications',
    category: 'Environment',
    exam: ['UPSC CSE', 'State PCS', 'Forest Service (IFoS)'],
    mrp: '₹550',
    discountPrice: '₹410',
    discountPercent: '25% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=Shankar+IAS+Environment+10th+Edition',
      flipkart: 'https://www.flipkart.com/search?q=Environment+Shankar+IAS+latest+edition'
    },
    pdfFileName: 'Shankar_IAS_Environment_HighYield_Notes.pdf',
    pdfSize: '24.0 MB',
    rating: 4.8,
    reviewsCount: '19,800+',
    keyHighlights: [
      'Complete list of 85+ Ramsar Wetland Sites & 106 National Parks in India',
      'IUCN Red List Categories & Critically Endangered Species in India with map pins',
      'Wildlife Protection Act 1972 (Amended 2022) & Environmental Protection Act 1986'
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
    exam: ['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC CSAT', 'State PCS', 'UP Police'],
    mrp: '₹899',
    discountPrice: '₹599',
    discountPercent: '33% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=RS+Aggarwal+Quantitative+Aptitude',
      flipkart: 'https://www.flipkart.com/search?q=Quantitative+Aptitude+RS+Aggarwal'
    },
    pdfFileName: 'RS_Aggarwal_Quantitative_Aptitude_Solved_PDF.pdf',
    pdfSize: '35.4 MB',
    rating: 4.9,
    reviewsCount: '45,000+',
    keyHighlights: [
      '5,000+ Solved MCQs with shortcut tricks & formula tables',
      'Covers Arithmetic, Algebra, Geometry, Mensuration & Data Interpretation',
      'Essential practice benchmark for SSC CGL Tier 1 & 2, Bank PO & UPSC CSAT'
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
    exam: ['SSC CGL', 'IBPS PO', 'RRB NTPC', 'UPSC CSAT', 'UP Police'],
    mrp: '₹950',
    discountPrice: '₹660',
    discountPercent: '30% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=RS+Aggarwal+Verbal+and+Non+Verbal+Reasoning',
      flipkart: 'https://www.flipkart.com/search?q=Verbal+and+Non+Verbal+Reasoning+RS+Aggarwal'
    },
    pdfFileName: 'RS_Aggarwal_Verbal_NonVerbal_Reasoning_PDF.pdf',
    pdfSize: '29.8 MB',
    rating: 4.8,
    reviewsCount: '38,000+',
    keyHighlights: [
      'Covers Coding-Decoding, Syllogisms, Seating Arrangements & Complex Puzzles',
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
    edition: 'Classic Mass Market Edition',
    publisher: 'Goyal Publishers',
    category: 'General English',
    exam: ['SSC CGL', 'IBPS PO', 'UPSC CSAT', 'CAT', 'NDA/CDS', 'State PCS'],
    mrp: '₹250',
    discountPrice: '₹140',
    discountPercent: '44% OFF',
    isCopyrightedCommercial: true,
    buyLinks: {
      amazon: 'https://www.amazon.in/s?k=Word+Power+Made+Easy+Norman+Lewis',
      flipkart: 'https://www.flipkart.com/search?q=Word+Power+Made+Easy+Norman+Lewis'
    },
    pdfFileName: 'Word_Power_Made_Easy_Norman_Lewis_Full_PDF.pdf',
    pdfSize: '8.2 MB',
    rating: 4.9,
    reviewsCount: '85,000+',
    keyHighlights: [
      'Root word technique (Greek & Latin roots) to master 3,000+ high-frequency English vocabulary words',
      'Self-testing quizzes and spaced repetition exercises at the end of every session',
      'Indispensable for SSC CGL Tier 1 & 2 English Comprehension and CSAT Reading Passages'
    ],
    sampleChapters: [
      {
        title: 'Session 1: How to Talk About Personality Types',
        summary: 'Roots: Ego (I), Alter (Other), Intro (Inward), Extro (Outward), Vert (Turn), Mis (Hate), Anthropos (Mankind), Gyne (Woman), Gamos (Marriage).'
      }
    ]
  }
];
