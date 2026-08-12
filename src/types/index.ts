export type ExamCategory = 'UPSC' | 'SSC' | 'Banking' | 'Railway' | 'UP Police' | 'Defence' | 'State PCS' | 'Teaching' | 'CUET' | 'Other';

export interface Exam {
  id: string;
  name: string;
  shortName: string;
  category: ExamCategory;
  conductingBody: string;
  qualification: string;
  ageLimit: string;
  attempts: string;
  frequency: string;
  difficulty: 'High' | 'Very High' | 'Moderate' | 'Extreme';
  description: string;
  upcomingDate: string;
  stages: string[];
  subjects: string[];
  examPattern: {
    stage: string;
    duration: string;
    totalMarks: number;
    negativeMarking: string;
    sections: { name: string; questions: number; marks: number }[];
  }[];
  syllabus: {
    subject: string;
    topics: { id: string; title: string; completed?: boolean }[];
  }[];
  prepStrategy: string[];
  recommendedResources: string[];
  competitionLevel: string;
}

export interface CurrentAffairItem {
  id: string;
  title: string;
  date: string;
  source?: 'The Hindu' | 'Times of India' | 'PIB' | 'Indian Express' | 'General';
  paperPage?: string;
  category: 'National' | 'International' | 'Economy' | 'Polity' | 'Science & Tech' | 'Environment' | 'Defence' | 'Sports' | 'Awards' | 'Government Schemes' | 'Reports & Indices' | 'Appointments' | 'Important Days' | 'Editorial';
  summary: string;
  detailedContent: string;
  whyItMatters: string;
  examRelevance: {
    exam: string;
    relevance: string;
  }[];
  keyFacts: string[];
  keywords: string[];
  possibleMCQs: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  sources?: { name: string; url: string; date: string }[];
  readTime: string;
}

export interface WorldNewsItem {
  id: string;
  title: string;
  date: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Middle East & Africa' | 'Latin America' | 'Global Economy' | 'Geopolitics & Defense' | 'Climate & Tech';
  country: string;
  sourceName: string;
  sourceUrl: string;
  summary: string;
  detailedAnalysis: string;
  geopoliticalImpact: string;
  indiaRelevance: string;
  keyFacts: string[];
  keyOrganizations: string[];
  possibleMCQs: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  readTime: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-level';
  exam: string;
  year?: number;
  stage?: string;
  misconceptions?: string[];
}

export interface MockTest {
  id: string;
  title: string;
  exam: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: number; // e.g. 0.33 or 0.25
  instructions: string[];
  questions: Question[];
}

export interface TestAttemptResult {
  testId: string;
  testTitle: string;
  exam: string;
  completedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  subjectBreakdown: {
    subject: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
  strongTopics: string[];
  weakTopics: string[];
  aiRecommendations: string[];
}

export interface NoteItem {
  id: string;
  title: string;
  folder: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastReviewed?: string;
  nextReviewDate?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Books' | 'PDFs' | 'Articles' | 'Reports' | 'Government Documents' | 'Previous Year Papers' | 'Notes' | 'Current Affairs';
  author: string;
  date: string;
  examRelevance: string;
  description: string;
  downloadUrl?: string;
  readUrl?: string;
}

export interface StudyTask {
  id: string;
  day: number;
  title: string;
  subject: string;
  duration: string;
  completed: boolean;
  type: 'Theory' | 'Practice' | 'Revision' | 'Mock Test';
}

export interface StudyPlan {
  id: string;
  examName: string;
  targetDate: string;
  dailyHours: number;
  weeks: {
    weekNumber: number;
    title: string;
    focus: string;
    tasks: StudyTask[];
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarPhoto?: string;
  targetExam: string;
  prepLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  dailyTargetMinutes: number;
  studyTimeTodayMinutes: number;
  questionsSolvedToday: number;
  accuracyRate: number;
  testsCompletedCount: number;
  streakDays: number;
}

export interface ResearchTopicResult {
  topic: string;
  overview: string;
  keyFacts: { label: string; value: string }[];
  timeline: { year: string; event: string }[];
  importantOrganizations: { name: string; role: string }[];
  governmentInitiatives: { name: string; detail: string }[];
  economicImportance: string;
  internationalContext: string;
  examRelevance: { exam: string; focus: string }[];
  prelimsMCQs: { question: string; options: string[]; answer: number; explanation: string }[];
  mainsQuestions: string[];
  interviewQuestions: string[];
  quickRevisionPoints: string[];
  sources: { name: string; url: string; lastVerified: string }[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: { name: string; url: string }[];
  mcqs?: { question: string; options: string[]; answer: number; explanation: string }[];
  isStreaming?: boolean;
}
