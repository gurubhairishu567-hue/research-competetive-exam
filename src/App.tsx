import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

import { AdminGuardModal } from './components/common/AdminGuardModal';
import { AuthModal } from './components/common/AuthModal';
import { SeasonalThemeBanner } from './components/common/SeasonalThemeBanner';
import { FESTIVAL_THEMES } from './data/festivalThemes';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { SearchPage } from './pages/SearchPage';
import { ExamsPage } from './pages/ExamsPage';
import { ExamDetailPage } from './pages/ExamDetailPage';
import { ExamComparePage } from './pages/ExamComparePage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ResearchModePage } from './pages/ResearchModePage';
import { CurrentAffairsPage } from './pages/CurrentAffairsPage';
import { WorldNewsPage } from './pages/WorldNewsPage';
import { MCQPracticePage } from './pages/MCQPracticePage';
import { QuizGeneratorPage } from './pages/QuizGeneratorPage';
import { MockTestPage } from './pages/MockTestPage';
import { MockTestInterface } from './pages/MockTestInterface';
import { PYQPage } from './pages/PYQPage';
import { NotesPage } from './pages/NotesPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { SyllabusTrackerPage } from './pages/SyllabusTrackerPage';
import { ResourceLibraryPage } from './pages/ResourceLibraryPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { AdminPage } from './pages/AdminPage';

const MainLayout: React.FC = () => {
  const { 
    currentPage, 
    theme, 
    showAuthModal, 
    setShowAuthModal, 
    authModalMode,
    effectiveFestivalTheme 
  } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const activeFestivalConfig = FESTIVAL_THEMES[effectiveFestivalTheme] || FESTIVAL_THEMES.classic;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'search':
        return <SearchPage />;
      case 'exams':
        return <ExamsPage />;
      case 'exam-detail':
        return <ExamDetailPage />;
      case 'compare':
        return <ExamComparePage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'research':
        return <ResearchModePage />;
      case 'current-affairs':
        return <CurrentAffairsPage />;
      case 'world-news':
        return <WorldNewsPage />;
      case 'mcq-practice':
        return <MCQPracticePage />;
      case 'quiz-generator':
        return <QuizGeneratorPage />;
      case 'mock-tests':
        return <MockTestPage />;
      case 'mock-test-interface':
        return <MockTestInterface />;
      case 'pyq':
        return <PYQPage />;
      case 'notes':
        return <NotesPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'study-planner':
        return <StudyPlannerPage />;
      case 'syllabus':
        return <SyllabusTrackerPage />;
      case 'resources':
        return <ResourceLibraryPage />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-600 selection:text-white relative">
      
      {/* Top Dynamic Seasonal & Indian Festival Ribbon */}
      <SeasonalThemeBanner />

      {/* Top Navigation Bar */}
      <Navbar onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderCurrentPage()}
        </main>

      </div>

      {/* Page Footer */}
      <Footer />

      {/* Global Simple & Static Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Global Admin Permission Guard Modal */}
      <AdminGuardModal />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
