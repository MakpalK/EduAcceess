import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Award,
  Eye,
  EyeOff,
  CheckCircle2,
  Database,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskType, DifficultyLevel } from '../../types';
import {
  KAZAKH_SUBJECTS,
  GRADES,
  TASK_TYPE_LABELS,
} from '../../data/mockData';
import { TaskEditModal } from '../common/TaskEditModal';

export const QuestionBank: React.FC = () => {
  const {
    questionBank,
    addToQuestionBank,
    deleteFromQuestionBank,
    addTaskToActiveAssessment,
    selectedSubject,
    searchQuery,
    setSearchQuery,
    loadDemoData,
    showToast,
  } = useApp();

  // Filters
  const [filterSubject, setFilterSubject] = useState<string>('Барлығы');
  const [filterGrade, setFilterGrade] = useState<string>('Барлығы');
  const [filterType, setFilterType] = useState<string>('Барлығы');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('Барлығы');
  const [showAnswerKeys, setShowAnswerKeys] = useState<boolean>(true);

  // Modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return questionBank.filter((task) => {
      // Search query (title, question, objective, criteria, subject)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          task.title?.toLowerCase().includes(q) ||
          task.question?.toLowerCase().includes(q) ||
          task.learningObjective?.toLowerCase().includes(q) ||
          task.criteria?.toLowerCase().includes(q) ||
          task.subject?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (filterSubject !== 'Барлығы' && task.subject !== filterSubject) return false;
      if (filterGrade !== 'Барлығы' && task.grade !== Number(filterGrade)) return false;
      if (filterType !== 'Барлығы' && task.type !== filterType) return false;
      if (filterDifficulty !== 'Барлығы' && task.difficulty !== filterDifficulty) return false;

      return true;
    });
  }, [questionBank, searchQuery, filterSubject, filterGrade, filterType, filterDifficulty]);

  const handleDuplicate = (task: Task) => {
    const copy: Task = {
      ...task,
      id: `bank_dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${task.title} (Көшірме)`,
    };
    addToQuestionBank(copy);
  };

  const handleSaveModal = (saved: Task) => {
    addToQuestionBank(saved);
    setEditingTask(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Тапсырмалар банкі ({questionBank.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ҚР оқу бағдарламаларына сәйкес дескрипторлы тапсырмалар қоры
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAnswerKeys(!showAnswerKeys)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              showAnswerKeys
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {showAnswerKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAnswerKeys ? 'Кілттерді жасыру' : 'Кілттерді көрсету'}</span>
          </button>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Жаңа тапсырма қосу</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Тақырып, сұрақ мәтіні, оқу мақсаты немесе критерий бойынша іздеу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {(searchQuery ||
            filterSubject !== 'Барлығы' ||
            filterGrade !== 'Барлығы' ||
            filterType !== 'Барлығы' ||
            filterDifficulty !== 'Барлығы') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterSubject('Барлығы');
                setFilterGrade('Барлығы');
                setFilterType('Барлығы');
                setFilterDifficulty('Барлығы');
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors whitespace-nowrap"
            >
              Сүзгілерді тазарту
            </button>
          )}
        </div>

        {/* Quick Subject Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Жылдам сүзгі:</span>
          <button
            onClick={() => setFilterSubject(selectedSubject)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              filterSubject === selectedSubject
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
            }`}
          >
            Менің пәнім ({selectedSubject})
          </button>
          <button
            onClick={() => setFilterSubject('Барлығы')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              filterSubject === 'Барлығы'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            Барлық пәндер
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Пән:</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Барлығы">Барлық пәндер</option>
              {KAZAKH_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Сынып:</label>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Барлығы">Барлық сыныптар</option>
              {GRADES.map((g) => (
                <option key={g} value={String(g)}>
                  {g}-сынып
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Тапсырма түрі:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Барлығы">Барлық түрлері</option>
              {Object.entries(TASK_TYPE_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Қиындығы:
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Барлығы">Барлық деңгейлер</option>
              <option value="Базалық">Базалық</option>
              <option value="Орташа">Орташа</option>
              <option value="Жоғары">Жоғары</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Тапсырмалар табылмады
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Таңдалған сүзгі параметрлеріне сәйкес тапсырмалар жоқ. Сүзгілерді қайта реттеп көріңіз немесе үлгілік базаны жаңартыңыз.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterSubject('Барлығы');
                setFilterGrade('Барлығы');
                setFilterType('Барлығы');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Сүзгіні тазалау
            </button>
            <button
              onClick={loadDemoData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
            >
              Үлгілік банкті жүктеу
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {task.title}
                  </span>

                  {/* Badge: Saved in bank vs AI draft */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      task.isAiGenerated
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {task.isAiGenerated ? (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>ЖИ генерациясы</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Банкте сақталған</span>
                      </>
                    )}
                  </span>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {TASK_TYPE_LABELS[task.type] || task.type}
                  </span>

                  {task.subject && (
                    <span className="text-[10px] font-medium text-slate-500">
                      {task.subject} {task.grade ? `(${task.grade}-сынып)` : ''}
                    </span>
                  )}

                  {task.learningObjective && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {task.learningObjective}
                    </span>
                  )}
                </div>

                {/* Points & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                    {task.points} балл
                  </span>

                  <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                    <button
                      onClick={() => handleDuplicate(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Көшірмесін жасау"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Өңдеу"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFromQuestionBank(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Банктен жою"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                {task.question}
              </p>

              {/* Options Preview */}
              {task.options && task.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {task.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              {/* Code Snippet if any */}
              {task.codeSnippet && (
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                  {task.codeSnippet}
                </pre>
              )}

              {/* Descriptors & Criteria Block */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Бағалау критерийі: {task.criteria}</span>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Дескрипторлар ({task.descriptors?.length || 0}):
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 pl-1">
                    {task.descriptors?.map((desc, dIdx) => (
                      <li key={dIdx}>{desc}</li>
                    ))}
                  </ul>
                </div>

                {/* Answer Key Toggle */}
                {showAnswerKeys && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Дұрыс жауап:
                    </span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {task.answerKey}
                    </span>
                    {task.explanation && (
                      <span className="text-[11px] text-slate-400 italic">
                        ({task.explanation})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Add to Assessment Action */}
              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => addTaskToActiveAssessment(task)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>БЖБ/ТЖБ құрастырушысына қосу</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Edit Modal */}
      {(editingTask || isCreatingNew) && (
        <TaskEditModal
          task={editingTask || undefined}
          onSave={handleSaveModal}
          onClose={() => {
            setEditingTask(null);
            setIsCreatingNew(false);
          }}
        />
      )}
    </div>
  );
};
