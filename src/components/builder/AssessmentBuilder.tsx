import React, { useState } from 'react';
import {
  Save,
  Printer,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit3,
  Award,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Database,
  Eye,
  Info,
  Clock,
  BookOpen,
  FileUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskType, AssessmentType, DifficultyLevel } from '../../types';
import {
  KAZAKH_SUBJECTS,
  GRADES,
  TERMS,
  TASK_TYPE_LABELS,
  LEARNING_OBJECTIVES_PRESETS,
} from '../../data/mockData';
import { TaskEditModal } from '../common/TaskEditModal';
import { PrintPreviewModal } from '../common/PrintPreviewModal';

interface AssessmentBuilderProps {
  type: AssessmentType; // 'БЖБ' | 'ТЖБ'
}

export const AssessmentBuilder: React.FC<AssessmentBuilderProps> = ({ type }) => {
  const {
    activeAssessment,
    setActiveAssessment,
    saveCurrentAssessment,
    questionBank,
    addTaskToActiveAssessment,
    setCurrentPage,
    showToast,
  } = useApp();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showBankPickerModal, setShowBankPickerModal] = useState(false);

  // Sync type if changed from navigation
  React.useEffect(() => {
    if (activeAssessment.type !== type) {
      setActiveAssessment((prev) => ({
        ...prev,
        type,
        durationMinutes: type === 'БЖБ' ? 20 : 40,
        targetPoints: type === 'БЖБ' ? 10 : 20,
      }));
    }
  }, [type]);

  // Points calculation
  const currentTotalPoints = activeAssessment.tasks.reduce(
    (sum, t) => sum + (t.points || 0),
    0
  );
  const targetPoints = activeAssessment.targetPoints || (type === 'БЖБ' ? 10 : 20);
  const pointsDiff = targetPoints - currentTotalPoints;

  // Task reordering
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...activeAssessment.tasks];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    setActiveAssessment({ ...activeAssessment, tasks: copy });
  };

  const handleMoveDown = (index: number) => {
    if (index === activeAssessment.tasks.length - 1) return;
    const copy = [...activeAssessment.tasks];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    setActiveAssessment({ ...activeAssessment, tasks: copy });
  };

  const handleDeleteTask = (taskId: string) => {
    setActiveAssessment({
      ...activeAssessment,
      tasks: activeAssessment.tasks.filter((t) => t.id !== taskId),
    });
    showToast('Тапсырма өшірілді', 'info');
  };

  const handleDuplicateTask = (task: Task) => {
    const copy: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${task.title} (Көшірме)`,
    };
    setActiveAssessment({
      ...activeAssessment,
      tasks: [...activeAssessment.tasks, copy],
    });
    showToast('Тапсырма көшірмесі қосылды', 'success');
  };

  const handleSaveEditedTask = (savedTask: Task) => {
    const existingIndex = activeAssessment.tasks.findIndex((t) => t.id === savedTask.id);
    if (existingIndex >= 0) {
      const copy = [...activeAssessment.tasks];
      copy[existingIndex] = savedTask;
      setActiveAssessment({ ...activeAssessment, tasks: copy });
      showToast('Тапсырма жаңартылды', 'success');
    } else {
      setActiveAssessment({
        ...activeAssessment,
        tasks: [...activeAssessment.tasks, savedTask],
      });
      showToast('Жаңа тапсырма қосылды', 'success');
    }
    setEditingTask(null);
    setIsCreatingNewTask(false);
  };

  // Quick preset learning objectives for current subject
  const currentPresets = LEARNING_OBJECTIVES_PRESETS[activeAssessment.subject] || [];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              type === 'БЖБ'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{type === 'БЖБ' ? 'БЖБ құрастырушы' : 'ТЖБ құрастырушы'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {activeAssessment.status}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ҚР 125-бұйрық білім беру стандартына сай дескрипторлық спецификация
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPrintModal(true)}
            disabled={activeAssessment.tasks.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            <span>Алдын ала көру / Басу</span>
          </button>

          <button
            onClick={() => setCurrentPage('ai-generator')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>ЖИ арқылы тапсырма алу</span>
          </button>

          <button
            onClick={() => setCurrentPage('converter')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 transition-colors"
            title="Дайын Word немесе PDF құжатынан тапсырмаларды импорттау"
          >
            <FileUp className="w-4 h-4" />
            <span>Файлдан жүктеу</span>
          </button>

          <button
            onClick={saveCurrentAssessment}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Сақтау</span>
          </button>
        </div>
      </div>

      {/* Specification & Metadata Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          1. Жиынтық бағалаудың жалпы параметрлері (Спецификация)
        </h3>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Бағалау жұмысының тақырыбы / Атауы
          </label>
          <input
            type="text"
            value={activeAssessment.title}
            onChange={(e) =>
              setActiveAssessment({ ...activeAssessment, title: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-semibold"
          />
        </div>

        {/* Metadata Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Пән
            </label>
            <select
              value={activeAssessment.subject}
              onChange={(e) =>
                setActiveAssessment({ ...activeAssessment, subject: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            >
              {KAZAKH_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Сынып
            </label>
            <select
              value={activeAssessment.grade}
              onChange={(e) =>
                setActiveAssessment({
                  ...activeAssessment,
                  grade: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}-сынып
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Тоқсан
            </label>
            <select
              value={activeAssessment.term}
              onChange={(e) =>
                setActiveAssessment({
                  ...activeAssessment,
                  term: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}-тоқсан
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Уақыты (минут)
            </label>
            <div className="relative">
              <input
                type="number"
                min={10}
                max={90}
                value={activeAssessment.durationMinutes}
                onChange={(e) =>
                  setActiveAssessment({
                    ...activeAssessment,
                    durationMinutes: Number(e.target.value),
                  })
                }
                className="w-full pl-3 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
              />
              <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Topic, Target Points, Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Бөлім немесе тақырып
            </label>
            <input
              type="text"
              value={activeAssessment.unitOrTopic}
              onChange={(e) =>
                setActiveAssessment({ ...activeAssessment, unitOrTopic: e.target.value })
              }
              placeholder="Мысалы: Жылу құбылыстары"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Жоспарланған мақсатты балл
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={activeAssessment.targetPoints}
              onChange={(e) =>
                setActiveAssessment({
                  ...activeAssessment,
                  targetPoints: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Күйі (Статус)
            </label>
            <select
              value={activeAssessment.status}
              onChange={(e) =>
                setActiveAssessment({
                  ...activeAssessment,
                  status: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            >
              <option value="Жоба">Жоба (Құрастырылуда)</option>
              <option value="Дайын">Дайын (Бекітілген)</option>
              <option value="Өткізілді">Өткізілді (Тексерілуде)</option>
            </select>
          </div>
        </div>

        {/* Quick Learning Objective selector */}
        {currentPresets.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              {activeAssessment.subject} бойынша типтік оқу мақсаттары:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentPresets.map((preset) => {
                const isSelected = activeAssessment.learningObjectives.includes(preset.code);
                return (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setActiveAssessment({
                          ...activeAssessment,
                          learningObjectives: activeAssessment.learningObjectives.filter(
                            (o) => o !== preset.code
                          ),
                        });
                      } else {
                        setActiveAssessment({
                          ...activeAssessment,
                          learningObjectives: [...activeAssessment.learningObjectives, preset.code],
                        });
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    <span className="font-bold">{preset.code}</span> — {preset.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Points Validation Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
          pointsDiff === 0
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : pointsDiff > 0
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {pointsDiff === 0 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          )}
          <div>
            <div className="text-xs sm:text-sm font-bold">
              {pointsDiff === 0
                ? `Балл толық сәйкес: ${currentTotalPoints} / ${targetPoints} балл`
                : pointsDiff > 0
                ? `Балл жетпейді: ағымдағы ${currentTotalPoints} балл / мақсатты ${targetPoints} балл (Тағы ${pointsDiff} балл қажет)`
                : `Балл асып кетті: ағымдағы ${currentTotalPoints} балл / мақсатты ${targetPoints} балл (${Math.abs(pointsDiff)} балл артық)`}
            </div>
            <p className="text-[11px] opacity-80">
              ҚР стандарты бойынша тапсырмалардың дескриптор баллдары мақсатты баллға тең болуы қажет.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 shadow-sm border border-current">
            {activeAssessment.tasks.length} тапсырма
          </span>
        </div>
      </div>

      {/* Tasks Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            2. Бағалау тапсырмалары мен дескрипторлар
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Барлық 11 тапсырма түрі қолжетімді (тесттер, сәйкестендіру, есептер, кодтау т.б.)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBankPickerModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Банктен таңдау</span>
          </button>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsCreatingNewTask(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Жаңа тапсырма</span>
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      {activeAssessment.tasks.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Әзірге бірде-бір тапсырма қосылмаған
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Жаңа тапсырманы қолмен қосыңыз, Тапсырмалар банкінен жүктеңіз немесе ЖИ генераторын пайдаланыңыз.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsCreatingNewTask(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              Қолмен құру
            </button>
            <button
              onClick={() => setShowBankPickerModal(true)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Банктен таңдау
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeAssessment.tasks.map((task, idx) => (
            <div
              key={task.id || idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
            >
              {/* Card Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                    №{idx + 1}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {task.title}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {TASK_TYPE_LABELS[task.type] || task.type}
                  </span>
                  {task.learningObjective && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {task.learningObjective}
                    </span>
                  )}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {task.difficulty}
                  </span>
                </div>

                {/* Score & Reorder Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <div className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                    {task.points} балл
                  </div>

                  <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-700 pl-2">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                      title="Жоғары жылжыту"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === activeAssessment.tasks.length - 1}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                      title="Төмен жылжыту"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateTask(task)}
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
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Өшіру"
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

              {/* Descriptors & Criteria Block */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
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
                      <li key={dIdx} className="leading-snug">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Answer Key */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Дұрыс жауап:
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {task.answerKey}
                  </span>
                  {task.explanation && (
                    <span className="text-[11px] text-slate-400 italic">
                      ({task.explanation})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Edit Modal */}
      {(editingTask || isCreatingNewTask) && (
        <TaskEditModal
          task={editingTask || undefined}
          onSave={handleSaveEditedTask}
          onClose={() => {
            setEditingTask(null);
            setIsCreatingNewTask(false);
          }}
        />
      )}

      {/* Print Preview Modal */}
      {showPrintModal && (
        <PrintPreviewModal
          assessment={activeAssessment}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Question Bank Picker Modal */}
      {showBankPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Тапсырмалар банкінен таңдау
              </h3>
              <button
                onClick={() => setShowBankPickerModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {questionBank.map((bankTask) => (
                <div
                  key={bankTask.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-400 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {bankTask.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {TASK_TYPE_LABELS[bankTask.type]}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600">
                        {bankTask.points} балл
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {bankTask.question}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addTaskToActiveAssessment(bankTask);
                      setShowBankPickerModal(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs whitespace-nowrap self-end sm:self-center"
                  >
                    + Қосу
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
