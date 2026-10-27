import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Plus,
  Printer,
  Copy,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FolderKanban,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assessment, AssessmentType } from '../../types';
import { PrintPreviewModal } from '../common/PrintPreviewModal';

export const MyAssessments: React.FC = () => {
  const {
    assessments,
    deleteAssessment,
    duplicateAssessment,
    openAssessmentInBuilder,
    createNewAssessment,
    loadDemoData,
    classrooms,
    assignAssessmentToClass,
    searchQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'БЖБ' | 'ТЖБ' | 'ready' | 'draft'>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [previewAssessment, setPreviewAssessment] = useState<Assessment | null>(null);
  const [assigningAssessment, setAssigningAssessment] = useState<Assessment | null>(null);
  const [targetClassId, setTargetClassId] = useState<string>(classrooms[0]?.id || '');

  const filteredAssessments = useMemo(() => {
    return assessments.filter((ass) => {
      // Tab filter
      if (activeTab === 'БЖБ' && ass.type !== 'БЖБ') return false;
      if (activeTab === 'ТЖБ' && ass.type !== 'ТЖБ') return false;
      if (activeTab === 'ready' && ass.status !== 'Дайын') return false;
      if (activeTab === 'draft' && ass.status !== 'Жоба') return false;

      // Query filter
      const q = (localSearch || searchQuery).trim().toLowerCase();
      if (q) {
        const matches =
          ass.title.toLowerCase().includes(q) ||
          ass.subject.toLowerCase().includes(q) ||
          ass.unitOrTopic.toLowerCase().includes(q) ||
          String(ass.grade).includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [assessments, activeTab, localSearch, searchQuery]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Менің жұмыстарым ({assessments.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Құрастырылған барлық БЖБ және ТЖБ бағалау құжаттарының тізімі
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => createNewAssessment('БЖБ')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Жаңа БЖБ</span>
          </button>
          <button
            onClick={() => createNewAssessment('ТЖБ')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm shadow-emerald-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Жаңа ТЖБ</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Барлығы ({assessments.length})
          </button>
          <button
            onClick={() => setActiveTab('БЖБ')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'БЖБ'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            БЖБ ({assessments.filter((a) => a.type === 'БЖБ').length})
          </button>
          <button
            onClick={() => setActiveTab('ТЖБ')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ТЖБ'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ТЖБ ({assessments.filter((a) => a.type === 'ТЖБ').length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ready'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Дайын ({assessments.filter((a) => a.status === 'Дайын').length})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'draft'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Жобалар ({assessments.filter((a) => a.status === 'Жоба').length})
          </button>
        </div>

        {/* Local search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Жұмыстарды сүзу..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none"
          />
        </div>
      </div>

      {/* Assessments Grid */}
      {filteredAssessments.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Бағалау жұмысы табылмады
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Таңдалған санатта құжат жоқ. Жаңа БЖБ құруды бастаңыз немесе үлгілік деректерді қалпына келтіріңіз.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => createNewAssessment('БЖБ')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              БЖБ құру
            </button>
            <button
              onClick={loadDemoData}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Үлгілерді қалпына келтіру
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssessments.map((ass) => {
            const totalScore = ass.tasks.reduce((sum, t) => sum + (t.points || 0), 0);

            return (
              <div
                key={ass.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          ass.type === 'БЖБ'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {ass.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {ass.grade}-сынып • {ass.term}-тоқсан
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ass.status === 'Дайын'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                      }`}
                    >
                      {ass.status}
                    </span>
                  </div>

                  <h3
                    onClick={() => openAssessmentInBuilder(ass)}
                    className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {ass.title}
                  </h3>

                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {ass.subject}
                    </span>{' '}
                    — {ass.unitOrTopic}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Балл: <strong className="text-slate-800 dark:text-slate-200">{totalScore}</strong> /{' '}
                      {ass.targetPoints}
                    </span>
                    <span>{ass.tasks.length} тапсырма</span>
                    <span>{ass.durationMinutes} мин</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewAssessment(ass)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Баспаға дайындау (Оқушы/Мұғалім)"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicateAssessment(ass.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Көшірмесін жасау"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAssessment(ass.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Жою"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setAssigningAssessment(ass);
                        setTargetClassId(classrooms[0]?.id || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1"
                      title="Сынып бумасына салу / Оқушыларға жіберу"
                    >
                      <FolderKanban className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Сыныпқа салу</span>
                    </button>

                    <button
                      onClick={() => openAssessmentInBuilder(ass)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-300 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Өңдеу</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Print Preview Modal */}
      {previewAssessment && (
        <PrintPreviewModal
          assessment={previewAssessment}
          onClose={() => setPreviewAssessment(null)}
        />
      )}

      {/* Assign to Class Modal */}
      {assigningAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Сынып бумасына салу
              </h3>
              <button
                onClick={() => setAssigningAssessment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <span className="text-[10px] font-bold uppercase text-indigo-600 block">
                  Таңдалған бағалау:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {assigningAssessment.title}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Қай сыныптың бумасына салғыңыз келеді?
                </label>
                {classrooms.length > 0 ? (
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {classrooms.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} — {cls.subject} ({cls.students.length} оқушы)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-rose-500">
                    Сыныптар тізімі бос. Алдымен «Сыныптар» бөлімінде сынып құрыңыз.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssigningAssessment(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Болдырмау
                </button>
                <button
                  type="button"
                  disabled={classrooms.length === 0}
                  onClick={() => {
                    if (targetClassId) {
                      assignAssessmentToClass(targetClassId, assigningAssessment.id, '');
                      setAssigningAssessment(null);
                    }
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  Бумаға салу және тағайындау
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
