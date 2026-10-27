import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Edit3,
  Trash2,
  Plus,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  ArrowRight,
  ShieldAlert,
  Layers,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, TaskType, DifficultyLevel } from '../../types';
import {
  KAZAKH_SUBJECTS,
  GRADES,
  TERMS,
  TASK_TYPE_LABELS,
  LEARNING_OBJECTIVES_PRESETS,
  INITIAL_BANK_TASKS,
} from '../../data/mockData';
import { generateAiTasksApi } from '../../services/api';
import { TaskEditModal } from '../common/TaskEditModal';

export const AiTaskGenerator: React.FC = () => {
  const {
    addTaskToActiveAssessment,
    addToQuestionBank,
    serverStatus,
    selectedSubject,
    setCurrentPage,
    showToast,
  } = useApp();

  // Generator form fields
  const [subject, setSubject] = useState(selectedSubject || 'Физика');
  const [grade, setGrade] = useState(8);
  const [term, setTerm] = useState(2);
  const [topic, setTopic] = useState('Жылу құбылыстары. Жылу сыйымдылығы');
  const [learningObjective, setLearningObjective] = useState(
    '8.3.2.1 - меншікті жылусыйымдылық формуласын есептер шығаруда қолдану'
  );

  // Sync when teacher selects another subject in header
  React.useEffect(() => {
    if (selectedSubject && selectedSubject !== subject) {
      setSubject(selectedSubject);
      const newPresets = LEARNING_OBJECTIVES_PRESETS[selectedSubject] || [];
      if (newPresets.length > 0) {
        setLearningObjective(`${newPresets[0].code} - ${newPresets[0].title}`);
        setTopic(`${selectedSubject} бойынша негізгі бөлім`);
        setGrade(newPresets[0].grade || 8);
      }
    }
  }, [selectedSubject]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<TaskType[]>([
    'single-choice',
    'calculation',
  ]);
  const [taskCount, setTaskCount] = useState(2);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Орташа');
  const [targetPoints, setTargetPoints] = useState(5);
  const [additionalInstructions, setAdditionalInstructions] = useState(
    'Қазақстанның күнделікті тұрмысымен байланысты мысалдар келтірілсін'
  );

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMissingKey, setIsMissingKey] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Subject presets
  const presets = LEARNING_OBJECTIVES_PRESETS[subject] || [];

  const handleToggleTaskType = (type: TaskType) => {
    if (selectedTaskTypes.includes(type)) {
      if (selectedTaskTypes.length > 1) {
        setSelectedTaskTypes(selectedTaskTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTaskTypes([...selectedTaskTypes, type]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setIsMissingKey(false);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < 3 ? s + 1 : s));
    }, 900);

    const result = await generateAiTasksApi({
      subject,
      grade,
      term,
      topic,
      learningObjective,
      taskTypes: selectedTaskTypes,
      taskCount,
      difficulty,
      targetPoints,
      additionalInstructions,
    });

    clearInterval(stepInterval);
    setIsGenerating(false);

    if (result.success && result.tasks && result.tasks.length > 0) {
      setGeneratedTasks(result.tasks);
      showToast(`${result.tasks.length} тапсырма сәтті құрастырылды!`, 'success');
    } else {
      setErrorMessage(
        result.error || 'ЖИ қызметімен байланыс үзілді немесе тапсырма генерацияланбады'
      );
      if (result.isMissingKey || !serverStatus.aiConfigured) {
        setIsMissingKey(true);
      }
    }
  };

  const handleAcceptAll = (destination: 'БЖБ' | 'ТЖБ' | 'ҚБ') => {
    generatedTasks.forEach((t) => {
      addTaskToActiveAssessment(t);
    });
    showToast(`Барлық тапсырмалар ${destination} құрастырушысына қосылды`, 'success');
    if (destination === 'ҚБ') {
      setCurrentPage('builder-qb');
    } else if (destination === 'БЖБ') {
      setCurrentPage('builder-bjb');
    } else {
      setCurrentPage('builder-tzhb');
    }
  };

  const handleRegenerateSingleTask = async (taskIndex: number) => {
    showToast('Тапсырма қайта құрастырылуда...', 'info');
    const result = await generateAiTasksApi({
      subject,
      grade,
      term,
      topic,
      learningObjective,
      taskTypes: [generatedTasks[taskIndex].type],
      taskCount: 1,
      difficulty,
      targetPoints: generatedTasks[taskIndex].points,
      additionalInstructions: 'Басқа сандық мәндер мен жаңа тұрмыстық контекст қолданыңыз',
    });

    if (result.success && result.tasks && result.tasks[0]) {
      const copy = [...generatedTasks];
      copy[taskIndex] = result.tasks[0];
      setGeneratedTasks(copy);
      showToast('Тапсырма жаңартылды', 'success');
    } else {
      showToast('Қайта генерациялау мүмкін болмады', 'error');
    }
  };

  const handleDeleteGeneratedTask = (id: string) => {
    setGeneratedTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Тапсырма өшірілді', 'info');
  };

  const handleSaveEditedTask = (saved: Task) => {
    setGeneratedTasks((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
    setEditingTask(null);
    showToast('Тапсырма түзетілді', 'success');
  };

  // Load verified Kazakh pedagogical sample tasks for testing
  const handleLoadDemoTasks = () => {
    const demoSample = INITIAL_BANK_TASKS.slice(0, 3).map((t, idx) => ({
      ...t,
      id: `ai_demo_${Date.now()}_${idx}`,
      isAiGenerated: true,
      title: `[Үлгі] ${t.title}`,
    }));
    setGeneratedTasks(demoSample);
    setErrorMessage(null);
    setIsMissingKey(false);
    showToast('Қазақстандық сараптамалық үлгі тапсырмалар жүктелді', 'info');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Visual Workspace Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>EduAccess AI Studio • Жасанды интеллект кеңістігі</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ЖИ тапсырма генераторы
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Қазақстан Республикасының мемлекеттік жалпыға міндетті білім беру стандартына (МЖМБС) сәйкес кез келген оқу мақсатына дескрипторлары мен жауап кілттері бар тапсырмаларды автоматты түрде құрастырыңыз.
            </p>
          </div>

          {/* AI Status Badge */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col gap-1.5 min-w-[210px] self-start md:self-center">
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Жүйе байланысы:
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  serverStatus.aiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-bold text-sm text-white">
                {serverStatus.aiConfigured ? 'Gemini 3.8 Flash' : 'API кілті орнатылмаған'}
              </span>
            </div>
            <span className="text-[11px] text-slate-300">
              {serverStatus.aiConfigured
                ? 'Қазақ тіліндегі модель қосулы'
                : 'Сұраныс сервер арқылы қорғалған'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Generator Layout: Configuration Form (Left) & Results Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Тапсырма параметрлері</span>
            </h3>

            {/* Subject, Grade, Term */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Пән
                </label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    const newPresets = LEARNING_OBJECTIVES_PRESETS[e.target.value] || [];
                    if (newPresets.length > 0) {
                      setLearningObjective(`${newPresets[0].code} - ${newPresets[0].title}`);
                    }
                  }}
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Сынып
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}-сынып
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic / Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Бөлім / Тақырып
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Мысалы: Жылу сыйымдылығы, Квадрат теңдеулер..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                required
              />
            </div>

            {/* Learning Objective */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Оқу мақсаты (ҚР стандарты)
              </label>
              <textarea
                rows={2}
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
                placeholder="Мысалы: 8.3.2.1 - жылусыйымдылық формуласын есептер шығаруда қолдану"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none leading-relaxed"
                required
              />

              {/* Quick Presets pills */}
              {presets.length > 0 && (
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Дайын оқу мақсаттарынан таңдау:
                  </span>
                  <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
                    {presets.map((p) => (
                      <button
                        key={p.code}
                        type="button"
                        onClick={() => setLearningObjective(`${p.code} - ${p.title}`)}
                        className="text-left text-[11px] p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <strong className="text-indigo-600 dark:text-indigo-400">{p.code}</strong> — {p.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Task Types Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Тапсырма түрлерін таңдаңыз ({selectedTaskTypes.length} таңдалды)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((t) => {
                  const isChecked = selectedTaskTypes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleToggleTaskType(t)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isChecked
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {TASK_TYPE_LABELS[t]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity, Difficulty, Points */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Саны
                </label>
                <select
                  value={taskCount}
                  onChange={(e) => setTaskCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                >
                  <option value={1}>1 тапсырма</option>
                  <option value={2}>2 тапсырма</option>
                  <option value={3}>3 тапсырма</option>
                  <option value={4}>4 тапсырма</option>
                  <option value={5}>5 тапсырма</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Қиындығы
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                >
                  <option value="Базалық">Базалық</option>
                  <option value="Орташа">Орташа</option>
                  <option value="Жоғары">Жоғары</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Жалпы балл
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={targetPoints}
                  onChange={(e) => setTargetPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none font-bold"
                />
              </div>
            </div>

            {/* Additional requirements */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Қосымша әдістемелік талаптар
              </label>
              <input
                type="text"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="Мысалы: Практикалық есеп, суретпен байланыстыру..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ЖИ тапсырма құрастыруда...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ЖИ арқылы тапсырма құрастыру</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header of results */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Генерация нәтижелері
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Тапсырмаларды өңдеңіз, қайта құрастырыңыз немесе БЖБ/ТЖБ-ға қабылдаңыз
              </p>
            </div>

            {generatedTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAcceptAll('БЖБ')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                >
                  Барлығын БЖБ-ға қосу
                </button>
                <button
                  onClick={() => handleAcceptAll('ТЖБ')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                >
                  ТЖБ-ға қосу
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  ЖИ тапсырмаларды әзірлеп жатыр...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  ҚР білім беру стандартына сәйкес дескрипторлар мен бағалау критерийлері дайындалуда
                </p>
              </div>

              {/* Progress Steps */}
              <div className="max-w-xs mx-auto space-y-2 text-left text-xs">
                <div
                  className={`flex items-center gap-2 ${
                    loadingStep >= 1 ? 'text-indigo-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Оқу мақсаты мен деңгейін талдау</span>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    loadingStep >= 2 ? 'text-indigo-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. Тапсырма мазмұнын қазақ тілінде құру</span>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    loadingStep >= 3 ? 'text-indigo-600 font-semibold' : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3. Әр қадамға дескриптор мен кілт беру</span>
                </div>
              </div>
            </div>
          )}

          {/* Error / Missing API Key State */}
          {errorMessage && !isGenerating && (
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200">
                    {isMissingKey ? 'GEMINI_API_KEY табылмады' : 'Тапсырма құрастыруда қате орын алды'}
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {isMissingKey
                      ? 'ЖИ арқылы тапсырмаларды генерациялау үшін жүйеге GEMINI_API_KEY құпия кілті қажет. Платформа талаптарына сәйкес ЖИ қосылмаған кезде нәтижені жасанды түрде модельдемейміз.'
                      : errorMessage}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleLoadDemoTasks}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  Үлгілік дайын ЖИ тапсырмаларын жүктеу (Демо)
                </button>
                <button
                  onClick={() => setCurrentPage('settings')}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Баптауларды тексеру
                </button>
              </div>
            </div>
          )}

          {/* Empty State (Before Generation) */}
          {generatedTasks.length === 0 && !isGenerating && !errorMessage && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                <Lightbulb className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Тапсырма генерациясын бастаңыз
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Сол жақтан параметрлерді көрсетіп, «ЖИ арқылы тапсырма құрастыру» түймесін басыңыз.
                </p>
              </div>

              {/* Inspiration Presets */}
              <div className="text-left space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Мұғалімдер жиі қолданатын үлгілер:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSubject('Физика');
                      setGrade(8);
                      setTopic('Жылу құбылыстары');
                      setLearningObjective('8.3.2.1 - жылусыйымдылық формуласын қолдану');
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Физика 8-сынып
                    </div>
                    <div className="text-[11px] text-slate-500">Жылу сыйымдылығы және есептер</div>
                  </button>

                  <button
                    onClick={() => {
                      setSubject('Алгебра');
                      setGrade(8);
                      setTopic('Квадрат теңдеулер');
                      setLearningObjective('8.2.1.3 - дискриминант арқылы шешу');
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Алгебра 8-сынып
                    </div>
                    <div className="text-[11px] text-slate-500">Квадрат теңдеулер мен Виет теоремасы</div>
                  </button>

                  <button
                    onClick={() => {
                      setSubject('Информатика');
                      setGrade(8);
                      setTopic('Python бағдарламалау');
                      setLearningObjective('8.3.3.1 - цикл операторларын қолдану');
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Информатика 8-сынып
                    </div>
                    <div className="text-[11px] text-slate-500">Python циклдері және шарттар</div>
                  </button>

                  <button
                    onClick={() => {
                      setSubject('Қазақ тілі');
                      setGrade(7);
                      setTopic('Төл сөз бен төлеу сөз');
                      setLearningObjective('7.2.3.1 - төл сөз тыныс белгілері');
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 text-left transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Қазақ тілі 7-сынып
                    </div>
                    <div className="text-[11px] text-slate-500">Төл сөз және автор сөзі</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generated Tasks Cards (Success State) */}
          {generatedTasks.length > 0 && !isGenerating && (
            <div className="space-y-4">
              {/* Batch Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Құрастырылған {generatedTasks.length} тапсырманы қосу:
                  </span>
                  <p className="text-[11px] text-slate-500">Қажетті құрастырушыны таңдаңыз</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleAcceptAll('ҚБ')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors"
                  >
                    ҚБ-ға қосу (Сабаққа)
                  </button>
                  <button
                    onClick={() => handleAcceptAll('БЖБ')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    БЖБ-ға қосу
                  </button>
                  <button
                    onClick={() => handleAcceptAll('ТЖБ')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                  >
                    ТЖБ-ға қосу
                  </button>
                </div>
              </div>

              {generatedTasks.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {t.title}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {TASK_TYPE_LABELS[t.type] || t.type}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {t.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                        {t.points} балл
                      </span>

                      {/* Card actions */}
                      <button
                        onClick={() => handleRegenerateSingleTask(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Тапсырманы қайта құрастыру"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTask(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Өңдеу"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGeneratedTask(t.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Жою"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                    {t.question}
                  </p>

                  {/* Options if test */}
                  {t.options && t.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {t.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Criteria and Descriptors */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Бағалау критерийі: {t.criteria}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        Дескрипторлар ({t.descriptors?.length || 0}):
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 pl-1">
                        {t.descriptors?.map((d, dIdx) => (
                          <li key={dIdx}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Answer Key */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        Дұрыс жауап:
                      </span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {t.answerKey}
                      </span>
                      {t.explanation && (
                        <span className="text-[11px] text-slate-400 italic">({t.explanation})</span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => addToQuestionBank(t)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Банкке сақтау</span>
                    </button>

                    <button
                      onClick={() => addTaskToActiveAssessment(t)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Құрастырушыға қосу</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleSaveEditedTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};
