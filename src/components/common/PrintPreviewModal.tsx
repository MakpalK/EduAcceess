import React, { useState } from 'react';
import { X, Printer, Eye, Award, CheckCircle, FileText } from 'lucide-react';
import { Assessment, Task } from '../../types';
import { TASK_TYPE_LABELS } from '../../data/mockData';

interface PrintPreviewModalProps {
  assessment: Assessment;
  onClose: () => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  assessment,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

  const totalPoints = assessment.tasks.reduce((sum, t) => sum + (t.points || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Баспаға шығару және алдын ала қарау
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ҚР 125-бұйрық білім беру стандартына сәйкестендірілген ресми пішім
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex p-1 bg-slate-200 dark:bg-slate-700/80 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('student')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'student'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Оқушы нұсқасы
              </button>
              <button
                onClick={() => setViewMode('teacher')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'teacher'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Мұғалім нұсқасы (Кілттермен)
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Басып шығару</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Sheet Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 dark:bg-slate-950">
          <div className="max-w-3xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0">
            {/* Kazakhstan Official Assessment Header */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                {assessment.schoolName || 'Қазақстан Республикасы Оқу-ағарту министрлігі'}
              </div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">
                {assessment.title}
              </h2>
              <div className="text-sm font-medium text-slate-700 mt-1">
                {assessment.subject} — {assessment.grade}-сынып | {assessment.term}-тоқсан
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Бөлім: {assessment.unitOrTopic}
              </div>

              {/* Student identification block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200 text-left text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block">Оқушының аты-жөні:</span>
                  <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Сыныбы:</span>
                  <div className="border-b border-dotted border-slate-400 h-5 mt-1 font-bold">
                    {assessment.grade} «____»
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Күні:</span>
                  <div className="border-b border-dotted border-slate-400 h-5 mt-1"></div>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 block">Нұсқасы / Уақыты:</span>
                  <div className="border-b border-dotted border-slate-400 h-5 mt-1 font-semibold text-slate-700">
                    1-нұсқа ({assessment.durationMinutes} мин)
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {assessment.instructions && (
                <div className="mt-4 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-left italic text-slate-600">
                  <span className="font-semibold not-italic text-slate-800">Нұсқаулық: </span>
                  {assessment.instructions}
                </div>
              )}
            </div>

            {/* Tasks Section */}
            <div className="space-y-8">
              {assessment.tasks.map((task, idx) => (
                <div key={task.id || idx} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{task.title}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                        {TASK_TYPE_LABELS[task.type] || task.type}
                      </span>
                    </div>

                    <div className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 flex-shrink-0">
                      [{task.points} балл]
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-sm text-slate-800 leading-relaxed font-medium pl-8 whitespace-pre-line">
                    {task.question}
                  </p>

                  {/* Options for single / multiple choice */}
                  {task.options && task.options.length > 0 && (
                    <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {task.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 flex items-center gap-2"
                        >
                          <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]"></span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Pairs */}
                  {task.matchingPairs && task.matchingPairs.length > 0 && (
                    <div className="pl-8 my-2">
                      <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-2 w-1/2">Элемент</th>
                              <th className="p-2 w-1/2">Сәйкес анықтама</th>
                            </tr>
                          </thead>
                          <tbody>
                            {task.matchingPairs.map((pair, pIdx) => (
                              <tr key={pIdx} className="border-b border-slate-100">
                                <td className="p-2 font-medium bg-slate-50/50">{pair.left}</td>
                                <td className="p-2">{pair.right}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {viewMode === 'student' && (
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-600">Жауабыңыз:</span>
                          <span className="border-b border-slate-400 flex-1 h-5"></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code snippet if any */}
                  {task.codeSnippet && (
                    <div className="pl-8 my-2">
                      <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
                        {task.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Student blank lines for open answers */}
                  {viewMode === 'student' &&
                    ['calculation', 'open-ended response', 'short answer', 'practical coding task'].includes(
                      task.type
                    ) && (
                      <div className="pl-8 pt-2 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-400">
                          Шешуі мен жауабы үшін орын:
                        </div>
                        <div className="border-b border-dashed border-slate-300 h-6"></div>
                        <div className="border-b border-dashed border-slate-300 h-6"></div>
                        <div className="border-b border-dashed border-slate-300 h-6"></div>
                      </div>
                    )}

                  {/* Teacher Mode: Answer Key, Criteria, Descriptors */}
                  {viewMode === 'teacher' && (
                    <div className="pl-8 pt-2">
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>Бағалау критерийі: {task.criteria}</span>
                        </div>

                        {/* Descriptors */}
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-700 block">Дескрипторлар:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                            {task.descriptors.map((desc, dIdx) => (
                              <li key={dIdx} className="leading-snug">
                                {desc}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Correct Answer */}
                        <div className="pt-1 border-t border-amber-200/60">
                          <span className="font-bold text-emerald-800">Дұрыс жауап кілті: </span>
                          <span className="text-slate-800 font-mono">{task.answerKey}</span>
                        </div>

                        {task.explanation && (
                          <div className="text-[11px] text-slate-500 italic">
                            Түсіндірме: {task.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Official Scoring Summary Table at Bottom */}
            <div className="mt-10 pt-6 border-t-2 border-slate-900">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Балл жиынтығы кестесі (Мұғалім толтырады)
              </div>
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-center">
                  <thead className="bg-slate-100 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Тапсырма №</th>
                      {assessment.tasks.map((_, i) => (
                        <th key={i} className="p-2 border-r border-slate-300">
                          №{i + 1}
                        </th>
                      ))}
                      <th className="p-2 font-bold bg-slate-200">Жалпы балл</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Макс. балл
                      </td>
                      {assessment.tasks.map((t, i) => (
                        <td key={i} className="p-2 border-r border-slate-300">
                          {t.points}
                        </td>
                      ))}
                      <td className="p-2 font-bold bg-slate-100">{totalPoints}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold bg-slate-50 border-r border-slate-300">
                        Жиналған балл
                      </td>
                      {assessment.tasks.map((_, i) => (
                        <td key={i} className="p-2 border-r border-slate-300 h-8"></td>
                      ))}
                      <td className="p-2 font-bold bg-slate-100"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-end mt-8 text-xs text-slate-600">
                <div>Мұғалімнің қолы: ____________________</div>
                <div>Кері байланыс берілген күн: «____» ___________ 2026 ж.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
