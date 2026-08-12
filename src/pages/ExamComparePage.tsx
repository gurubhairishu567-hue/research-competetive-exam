import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Check, X, ArrowLeft, Layers, Zap } from 'lucide-react';

export const ExamComparePage: React.FC = () => {
  const { exams, setCurrentPage } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>(['upsc-cse', 'ssc-cgl']);

  const toggleSelectExam = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(prev => prev.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const selectedExams = exams.filter(e => selectedIds.includes(e.id));

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3">
        <button
          onClick={() => setCurrentPage('exams')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exams</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
          <Scale className="w-7 h-7 text-blue-400" />
          <span>Competitive Examination Comparison Matrix</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
          Select 2 to 4 competitive exams to compare eligibility criteria, age limits, stage structures, syllabus overlap, and competition levels.
        </p>
      </div>

      {/* Exam Selector Chips */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Select Exams to Compare (Selected: {selectedIds.length}/4)
        </div>
        <div className="flex flex-wrap gap-2">
          {exams.map(ex => {
            const isSel = selectedIds.includes(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => toggleSelectExam(ex.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{ex.shortName}</span>
                {isSel ? <Check className="w-3.5 h-3.5" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="w-full text-xs text-left text-slate-800 dark:text-slate-200">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-4 w-44 min-w-[160px] bg-slate-100 dark:bg-slate-900/90 sticky left-0 z-10">
                Criteria
              </th>
              {selectedExams.map(ex => (
                <th key={ex.id} className="p-4 min-w-[220px]">
                  <div className="text-sm font-black text-slate-900 dark:text-white">{ex.shortName}</div>
                  <span className="text-[10px] text-blue-600 font-semibold">{ex.category}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Conducting Body
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4">{ex.conductingBody}</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Difficulty Level
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4 font-bold text-amber-600 dark:text-amber-400">{ex.difficulty}</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Educational Qualification
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4">{ex.qualification}</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Age Limit
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4">{ex.ageLimit}</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Attempts Allowed
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4">{ex.attempts}</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Selection Stages
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4">
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {ex.stages.map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Negative Marking
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4 text-rose-600 font-semibold">
                  {ex.examPattern[0]?.negativeMarking || 'Varies'}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Competition Level
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4 text-emerald-600 font-semibold">{ex.competitionLevel}</td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold bg-slate-50 dark:bg-slate-900/40 sticky left-0 text-slate-500">
                Core Subjects
              </td>
              {selectedExams.map(ex => (
                <td key={ex.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {ex.subjects.map((sub, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px]">
                        {sub}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
