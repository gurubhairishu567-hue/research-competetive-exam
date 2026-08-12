import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Layers } from 'lucide-react';

export const SyllabusTrackerPage: React.FC = () => {
  const { selectedExam, completedSyllabusTopics, toggleSyllabusTopic } = useApp();

  const allTopics = selectedExam.syllabus.flatMap(s => s.topics);
  const totalTopicCount = allTopics.length;
  const completedCount = allTopics.filter(t => completedSyllabusTopics.includes(t.id)).length;
  const progressPercent = totalTopicCount > 0 ? Math.round((completedCount / totalTopicCount) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Interactive Syllabus Completion Tracker</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black">{selectedExam.name} Syllabus Matrix</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Track subject completion percentage topic by topic to ensure zero coverage gaps before the examination date.
        </p>

        {/* Overall Progress Gauge */}
        <div className="pt-4 max-w-md space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span>Overall Syllabus Completion:</span>
            <span className="text-emerald-400">{progressPercent}% ({completedCount}/{totalTopicCount} Topics)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Subject Wise Syllabus Accordion */}
      <div className="space-y-6">
        {selectedExam.syllabus.map((subj, idx) => {
          const subjCompleted = subj.topics.filter(t => completedSyllabusTopics.includes(t.id)).length;
          const subjPercent = Math.round((subjCompleted / subj.topics.length) * 100);

          return (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{subj.subject}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded">
                  {subjPercent}% Done ({subjCompleted}/{subj.topics.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subj.topics.map(top => {
                  const isDone = completedSyllabusTopics.includes(top.id);
                  return (
                    <div
                      key={top.id}
                      onClick={() => toggleSyllabusTopic(top.id)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                      }`}
                    >
                      <span>{top.title}</span>
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
