import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Shield, Heart, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">
                ExamNexus AI
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An AI-powered competitive exam research, study, current-affairs, MCQ practice, and mock test ecosystem engineered for serious Indian competitive exam aspirants.
            </p>
            <div className="flex flex-col gap-1.5 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Syllabus Alignment • UPSC, SSC, Banking, Railways</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-semibold pt-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contact Support: <a href="mailto:gurubhairishu567@gmail.com" className="hover:underline text-white">gurubhairishu567@gmail.com</a></span>
              </div>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage('exams')} className="hover:text-white transition">Explore Exams</button></li>
              <li><button onClick={() => setCurrentPage('current-affairs')} className="hover:text-white transition">Current Affairs</button></li>
              <li><button onClick={() => setCurrentPage('mcq-practice')} className="hover:text-white transition">MCQ Practice</button></li>
              <li><button onClick={() => setCurrentPage('research')} className="hover:text-white transition">Research Mode</button></li>
              <li><button onClick={() => setCurrentPage('ai-assistant')} className="hover:text-white transition">AI Study Mentor</button></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage('pyq')} className="hover:text-white transition">Previous Year Papers</button></li>
              <li><button onClick={() => setCurrentPage('notes')} className="hover:text-white transition">Digital Notes</button></li>
              <li><button onClick={() => setCurrentPage('study-planner')} className="hover:text-white transition">AI Study Planner</button></li>
              <li><button onClick={() => setCurrentPage('flashcards')} className="hover:text-white transition">Flashcards</button></li>
              <li><button onClick={() => setCurrentPage('resources')} className="hover:text-white transition">Digital Library</button></li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">About Platform</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="mailto:gurubhairishu567@gmail.com" className="hover:text-white transition text-indigo-400 font-semibold">Contact: gurubhairishu567@gmail.com</a></li>
              <li><button onClick={() => setCurrentPage('admin')} className="hover:text-white transition text-slate-500">Admin Portal</button></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© 2026 ExamNexus AI. Designed for Indian Competitive Examination Aspirants.</p>
          <p className="flex items-center justify-center gap-1 text-slate-500">
            Crafted with precision for UPSC, SSC, Banking & State PCS.
          </p>
        </div>
      </div>
    </footer>
  );
};
