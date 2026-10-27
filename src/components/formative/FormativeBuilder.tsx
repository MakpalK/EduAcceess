import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  Printer,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit3,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Send,
  Layers,
  HelpCircle,
  Eye,
  Check,
  Star,
  MessageSquare,
  Compass,
  FileCheck,
  RotateCcw,
  Tag,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Task,
  TaskType,
  LessonStage,
  FormativeMethod,
  DifficultyLevel,
} from '../../types';
import {
  KAZAKH_SUBJECTS,
  GRADES,
  LEARNING_OBJECTIVES_PRESETS,
} from '../../data/mockData';
import { TaskEditModal } from '../common/TaskEditModal';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { generateAiTasksApi } from '../../services/api';

// Popular Kazakh formative assessment templates
const FORMATIVE_TEMPLATES: {
  id: string;
  name: string;
  description: string;
  stage: LessonStage;
  badge: string;
  createTasks: (topic: string, objective: string) => Partial<Task>[];
}[] = [
  {
    id: 'diff_abc',
    name: '«А, В, С» деңгейлік тапсырмалары',
    description: 'Сабақ ортасына арналған саралап оқыту: А (жеңіл), В (орташа), С (күрделі)',
    stage: 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)',
    badge: 'Саралау',
    createTasks: (topic, objective) => [
      {
        title: 'А деңгейі (Базалық)',
        type: 'single-choice',
        question: `«${topic}» тақырыбы бойынша негізгі ережені немесе анықтаманы көрсетіңіз.`,
        options: [
          'A) Негізгі ұғымның дұрыс анықтамасы',
          'B) Жалған анықтама',
          'C) Қатысы жоқ параметр',
          'D) Қосымша шарт',
        ],
        points: 2,
        difficulty: 'Базалық',
        learningObjective: objective,
        criteria: 'Тақырыптың негізгі ұғымдарын біледі және таниды',
        descriptors: ['Дұрыс нұсқаны таңдайды (2 балл)'],
        answerKey: 'A',
        lessonStage: 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)',
        differentiation: 'А деңгейі',
        teacherFeedbackSample: 'Жарайсың! Негізгі анықтаманы жақсы меңгердің.',
      },
      {
        title: 'В деңгейі (Қолдану)',
        type: 'calculation',
        question: `Берілген мәндерді пайдаланып, «${topic}» формуласын қолданып есептеу жүргізіңіз.`,
        points: 3,
        difficulty: 'Орташа',
        learningObjective: objective,
        criteria: 'Формуланы қолданып есептеулер жүргізеді',
        descriptors: [
          'Қажетті формуланы дұрыс таңдайды (1 балл)',
          'Мәндерді қойып, дұрыс жауабын есептейді (2 балл)',
        ],
        answerKey: 'Есептеу нәтижесі',
        lessonStage: 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)',
        differentiation: 'В деңгейі',
        teacherFeedbackSample: 'Жақсы нәтиже! Есепті шығару алгоритмін толық түсіндің.',
      },
      {
        title: 'С деңгейі (Күрделі / Талдау)',
        type: 'open-ended response',
        question: `«${topic}» ұғымын күнделікті өмірмен байланыстырып, мысал арқылы дәлелдеңіз немесе күрделі жағдаятты талдаңыз.`,
        points: 3,
        difficulty: 'Жоғары',
        learningObjective: objective,
        criteria: 'Құбылысты талдап, дәлелді қорытынды жасайды',
        descriptors: [
          'Себеп-салдарлық байланысты түсіндіреді (1 балл)',
          'Өз ойын дәлелдермен негіздейді (2 балл)',
        ],
        answerKey: 'Оқушының өз ойы мен дәлелдері',
        lessonStage: 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)',
        differentiation: 'С деңгейі',
        teacherFeedbackSample: 'Керемет! Шығармашылық ойлауың мен талдау дағдың өте жоғары.',
      },
    ],
  },
  {
    id: 'exit_ticket',
    name: '«Шығу парағы» (Exit Ticket)',
    description: 'Сабақ соңында 2-3 минутта оқушының жаңа сабақты қалай түсінгенін анықтау',
    stage: 'Сабақтың соңы (Шығу парағы / Рефлексия)',
    badge: 'Сабақ соңы',
    createTasks: (topic, objective) => [
      {
        title: 'Шығу парағы: Негізгі түйін',
        type: 'short answer',
        question: `Бүгінгі сабақта «${topic}» тақырыбы бойынша ең маңызды 1 ұғым немесе ереже не болды? Қысқаша жазыңыз.`,
        points: 1,
        difficulty: 'Базалық',
        learningObjective: objective,
        criteria: 'Сабақтың басты идеясын қорытындылайды',
        descriptors: ['Негізгі ұғымды нақты жазады (1 балл)'],
        answerKey: 'Тақырыптың басты формуласы немесе ережесі',
        lessonStage: 'Сабақтың соңы (Шығу парағы / Рефлексия)',
        teacherFeedbackSample: 'Ойын нақты әрі қысқа жеткізе білдің, жарайсың!',
      },
      {
        title: 'Шығу парағы: Қиындық тудырған сұрақ',
        type: 'short answer',
        question: `Сабақта сізге қай тұс әлі де толық түсініксіз немесе қайталауды қажет етеді?`,
        points: 1,
        difficulty: 'Базалық',
        learningObjective: objective,
        criteria: 'Өз оқу әрекетіне рефлексия жасайды',
        descriptors: ['Өзіне түсініксіз сұрақты немесе ұсынысын жазады (1 балл)'],
        answerKey: 'Оқушының кері байланысы',
        lessonStage: 'Сабақтың соңы (Шығу парағы / Рефлексия)',
        teacherFeedbackSample: 'Кері байланысың үшін рақмет! Келесі сабақта осы сұраққа тоқталамыз.',
      },
    ],
  },
  {
    id: 'method_321',
    name: '«3-2-1» рефлексиялық әдісі',
    description: '3 жаңа дерек, 2 қызықты мәлімет, 1 сұрақ',
    stage: 'Сабақтың соңы (Шығу парағы / Рефлексия)',
    badge: 'Рефлексия',
    createTasks: (topic, objective) => [
      {
        title: '«3-2-1» ҚБ әдісі',
        type: 'open-ended response',
        question: `«${topic}» сабағы бойынша жауап беріңіз:\n1) Бүгін үйренген 3 жаңа дерек;\n2) Сізді қызықтырған 2 маңызды сұрақ немесе мысал;\n3) Әлі де нақтылауды қажет ететін 1 қиындық.`,
        points: 3,
        difficulty: 'Орташа',
        learningObjective: objective,
        criteria: 'Сабақ мазмұны бойынша сыни рефлексия жасайды',
        descriptors: [
          '3 жаңа мәліметті атайды (1 балл)',
          '2 қызықты мысалды келтіреді (1 балл)',
          '1 сұрағын жазады (1 балл)',
        ],
        answerKey: 'Оқушының рефлексиясы',
        lessonStage: 'Сабақтың соңы (Шығу парағы / Рефлексия)',
        teacherFeedbackSample: 'Өте жүйелі рефлексия! Барлық 3 тармақ толық орындалған.',
      },
    ],
  },
  {
    id: 'warmup_quiz',
    name: '«Миға шабуыл» (Сабақ басы)',
    description: 'Сабақ басында үй тапсырмасын немесе өткен сабақты тексеру (2-3 сұрақ)',
    stage: 'Сабақтың басы (Кіріспе / Миға шабуыл)',
    badge: 'Сабақ басы',
    createTasks: (topic, objective) => [
      {
        title: 'Миға шабуыл: Ақиқат / Жалған',
        type: 'true/false',
        question: `«${topic}» ұғымына қатысты тұжырымдардың ақиқат немесе жалған екенін белгілеңіз.`,
        options: ['Ақиқат', 'Жалған'],
        points: 1,
        difficulty: 'Базалық',
        learningObjective: objective,
        criteria: 'Өткен білімді жаңғыртады',
        descriptors: ['Тұжырымның дұрыстығын анықтайды (1 балл)'],
        answerKey: 'Ақиқат',
        lessonStage: 'Сабақтың басы (Кіріспе / Миға шабуыл)',
        teacherFeedbackSample: 'Кіріспе сұраққа мүдірмей жауап бердің!',
      },
    ],
  },
];

export const FormativeBuilder: React.FC = () => {
  const {
    activeAssessment,
    setActiveAssessment,
    saveCurrentAssessment,
    selectedSubject,
    setSelectedSubject,
    classrooms,
    assignAssessmentToClass,
    addToQuestionBank,
    showToast,
  } = useApp();

  // Modals
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignClassId, setAssignClassId] = useState(classrooms[0]?.id || '');
  const [assignDeadlineDays, setAssignDeadlineDays] = useState(2); // Short deadline for daily formative

  // AI Generator inline drawer
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState(activeAssessment.unitOrTopic || 'Квадрат теңдеулер');
  const [aiObjective, setAiObjective] = useState(activeAssessment.learningObjectives[0] || '8.2.2.3');
  const [aiFormativeMethod, setAiFormativeMethod] = useState<FormativeMethod>(
    'Деңгейлік тапсырмалар (A, B, C)'
  );
  const [aiTaskCount, setAiTaskCount] = useState<number>(3);

  // Active stage filter
  const [stageFilter, setStageFilter] = useState<'all' | LessonStage>('all');

  // Total points calculation
  const totalPoints = activeAssessment.tasks.reduce((sum, t) => sum + (t.points || 0), 0);

  // Quick preset learning objectives
  const currentPresets = LEARNING_OBJECTIVES_PRESETS[activeAssessment.subject] || [];

  // Update assessment fields
  const handleFieldChange = (field: string, value: any) => {
    setActiveAssessment((prev) => ({
      ...prev,
      type: 'ҚБ',
      [field]: value,
    }));
  };

  // Add Task
  const handleSaveTask = (savedTask: Task) => {
    if (editingTask) {
      setActiveAssessment({
        ...activeAssessment,
        tasks: activeAssessment.tasks.map((t) => (t.id === savedTask.id ? savedTask : t)),
      });
      showToast('ҚБ тапсырмасы жаңартылды', 'success');
    } else {
      setActiveAssessment({
        ...activeAssessment,
        tasks: [...activeAssessment.tasks, savedTask],
      });
      showToast('Жаңа ҚБ тапсырмасы қосылды', 'success');
    }
    setEditingTask(null);
    setIsCreatingNewTask(false);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    setActiveAssessment({
      ...activeAssessment,
      tasks: activeAssessment.tasks.filter((t) => t.id !== taskId),
    });
    showToast('Тапсырма өшірілді', 'info');
  };

  // Duplicate Task
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
    showToast('Тапсырма көшірмесі жасалды', 'success');
  };

  // Move Task Up/Down
  const handleMoveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...activeAssessment.tasks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newTasks.length) return;

    const temp = newTasks[index];
    newTasks[index] = newTasks[targetIdx];
    newTasks[targetIdx] = temp;

    setActiveAssessment({
      ...activeAssessment,
      tasks: newTasks,
    });
  };

  // Apply Formative Template
  const handleApplyTemplate = (tmpl: (typeof FORMATIVE_TEMPLATES)[0]) => {
    const tasksToAdd = tmpl.createTasks(activeAssessment.unitOrTopic, activeAssessment.learningObjectives[0] || '8.1.1.1').map((t, idx) => ({
      ...t,
      id: `task_qb_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      subject: activeAssessment.subject,
      grade: activeAssessment.grade,
      title: t.title || `${idx + 1}-тапсырма`,
      type: t.type || 'short answer',
      question: t.question || 'Сұрақ',
      points: t.points || 1,
      difficulty: t.difficulty || 'Базалық',
      learningObjective: t.learningObjective || activeAssessment.learningObjectives[0] || '8.1.1.1',
      criteria: t.criteria || 'Тақырыпты меңгергенін көрсетеді',
      descriptors: t.descriptors || ['Дұрыс орындайды (1 балл)'],
      answerKey: t.answerKey || 'Дұрыс жауап',
    })) as Task[];

    setActiveAssessment((prev) => ({
      ...prev,
      tasks: [...prev.tasks, ...tasksToAdd],
    }));

    showToast(`«${tmpl.name}» әдісінің тапсырмалары қосылды!`, 'success');
  };

  // AI Quick Formative Pack Generator
  const handleAiGenerateFormative = async () => {
    setIsAiGenerating(true);
    try {
      const res = await generateAiTasksApi({
        subject: activeAssessment.subject,
        grade: activeAssessment.grade,
        term: activeAssessment.term,
        topic: aiTopic || activeAssessment.unitOrTopic,
        learningObjective: aiObjective || activeAssessment.learningObjectives[0],
        taskTypes: ['single-choice', 'short answer', 'calculation'],
        taskCount: aiTaskCount,
        difficulty: 'Орташа',
        targetPoints: 10,
        assessmentType: 'ҚБ',
        formativeMethod: aiFormativeMethod,
        additionalInstructions: 'Күнделікті сабақ үстінде қалыптастырушы бағалауға арналған нақты деңгейлік сұрақтар мен мұғалім кері байланысын құрастыру.',
      });

      if (!res.success || !res.tasks || res.tasks.length === 0) {
        throw new Error(res.error || 'Тапсырма генерацияланбады');
      }

      // Mark tasks as formative
      const formattedTasks = res.tasks.map((t, i) => {
        let stage: LessonStage = 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)';
        let diff: 'А деңгейі' | 'В деңгейі' | 'С деңгейі' = 'В деңгейі';

        if (i === 0) {
          stage = 'Сабақтың басы (Кіріспе / Миға шабуыл)';
          diff = 'А деңгейі';
        } else if (i === res.tasks!.length - 1 && res.tasks!.length > 2) {
          stage = 'Сабақтың соңы (Шығу парағы / Рефлексия)';
          diff = 'В деңгейі';
        } else {
          diff = i === 1 ? 'В деңгейі' : 'С деңгейі';
        }

        return {
          ...t,
          lessonStage: (t.lessonStage as LessonStage) || stage,
          differentiation: (t.differentiation as any) || diff,
          teacherFeedbackSample:
            t.teacherFeedbackSample ||
            `Жарайсың! ${activeAssessment.subject} сабағындағы белсенділігің үшін алғыс.`,
        };
      });

      setActiveAssessment((prev) => ({
        ...prev,
        tasks: [...prev.tasks, ...formattedTasks],
      }));

      showToast(`ЖИ арқылы ${formattedTasks.length} ҚБ тапсырмасы қосылды!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'ЖИ генерациялау сәтсіз аяқталды', 'error');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Assign to Classroom
  const handleAssignToClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignClassId) return;

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + assignDeadlineDays);
    const deadlineStr = deadlineDate.toISOString().split('T')[0];

    assignAssessmentToClass(
      assignClassId,
      activeAssessment.id,
      deadlineStr,
      `Күнделікті сабаққа арналған қалыптастырушы бағалау (ҚБ). 1–10 балл аралығында бағаланады.`
    );

    setIsAssignModalOpen(false);
    showToast('ҚБ тапсырмасы сынып оқушыларына күнделікті орындауға жіберілді!', 'success');
  };

  // Filter tasks by lesson stage
  const filteredTasks =
    stageFilter === 'all'
      ? activeAssessment.tasks
      : activeAssessment.tasks.filter((t) => t.lessonStage === stageFilter);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Қалыптастырушы бағалау (ҚБ) құрастырушысы
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold">
                1–10 балл • Күнделікті сабақ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Сабақ басы (миға шабуыл), сабақ ортасы (А, В, С деңгейлік тапсырмалары) және сабақ соңы (шығу парағы)
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPrintModal(true)}
            disabled={activeAssessment.tasks.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors disabled:opacity-50"
            title="Таратпа парақша / Тапсырма карточкаларын басып шығару"
          >
            <Printer className="w-4 h-4" />
            <span>Баспаға шығару</span>
          </button>

          <button
            onClick={() => setIsAssignModalOpen(true)}
            disabled={activeAssessment.tasks.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
            title="Оқушыларға күнделікті тапсырма ретінде жіберу"
          >
            <Send className="w-4 h-4" />
            <span>Сыныпқа жіберу</span>
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

      {/* Lesson Metadata Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Сабақ тақырыбы мен оқу мақсатын таңдау
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Пән:
            </label>
            <select
              value={activeAssessment.subject}
              onChange={(e) => {
                handleFieldChange('subject', e.target.value);
                setSelectedSubject(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {KAZAKH_SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Сынып:
            </label>
            <select
              value={activeAssessment.grade}
              onChange={(e) => handleFieldChange('grade', Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}-сынып
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Сабақ тақырыбы:
            </label>
            <input
              type="text"
              value={activeAssessment.unitOrTopic}
              onChange={(e) => handleFieldChange('unitOrTopic', e.target.value)}
              placeholder="Мысалы: Квадрат теңдеулерді шешу"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Оқу мақсаты:
            </label>
            <div className="relative">
              <input
                type="text"
                value={activeAssessment.learningObjectives[0] || ''}
                onChange={(e) => handleFieldChange('learningObjectives', [e.target.value])}
                placeholder="Мысалы: 8.2.2.3"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Presets for Learning Objectives */}
        {currentPresets.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-slate-400 font-medium">Дайын мақсаттар:</span>
            {currentPresets.slice(0, 4).map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => {
                  handleFieldChange('learningObjectives', [p.code]);
                  handleFieldChange('unitOrTopic', p.title);
                  setAiTopic(p.title);
                  setAiObjective(p.code);
                }}
                className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
              >
                {p.code} ({p.title.slice(0, 24)}...)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AI Quick Formative Pack Generator Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400 text-slate-950">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-white">
                ЖИ көмегімен сабаққа ҚБ тапсырмалар жинағын құру
              </h4>
            </div>
            <span className="text-xs text-indigo-200">
              1–10 балдық сабақ шкаласына бейімделген
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-indigo-200 mb-1">
                ҚБ әдістемесі:
              </label>
              <select
                value={aiFormativeMethod}
                onChange={(e) => setAiFormativeMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-indigo-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="Деңгейлік тапсырмалар (A, B, C)">Деңгейлік тапсырмалар (A, B, C)</option>
                <option value="Шығу парағы (Exit ticket)">Шығу парағы (Exit ticket)</option>
                <option value="«3-2-1» әдісі">«3-2-1» рефлексиясы</option>
                <option value="Экспресс-тест (5 минут)">Экспресс 5-минуттық тест</option>
                <option value="Күнделікті 1–10 балдық жұмыс">Күнделікті 1–10 балдық жұмыс</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-indigo-200 mb-1">
                Сабақ тақырыбы:
              </label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Мысалы: Жылу мөлшері"
                className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-indigo-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-indigo-200 mb-1">
                Тапсырмалар саны:
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={aiTaskCount}
                  onChange={(e) => setAiTaskCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-indigo-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value={2}>2 тапсырма</option>
                  <option value={3}>3 тапсырма (Сабақ басы + ортасы + соңы)</option>
                  <option value={4}>4 тапсырма</option>
                  <option value={5}>5 тапсырма (Толық деңгейлік сабақ)</option>
                </select>

                <button
                  type="button"
                  onClick={handleAiGenerateFormative}
                  disabled={isAiGenerating}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiGenerating ? 'Құрылуда...' : 'ЖИ арқылы жасау'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Formative Assessment Templates Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Дайын әдістемелік ҚБ үлгілері (1 басумен қосу):
          </h4>
          <span className="text-xs text-slate-500">ҚР білім беру стандарты</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FORMATIVE_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {tmpl.badge}
                  </span>
                </div>
                <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-xs mb-1">
                  {tmpl.name}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="mt-3 w-full py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-300 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Сабаққа қосу</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task List Header & Stage Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Сабақ тапсырмалары</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              {activeAssessment.tasks.length} тапсырма
            </span>
          </h3>

          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300">
            Жалпы: <strong>{totalPoints}</strong> / 10 балл
          </div>
        </div>

        {/* Lesson Stage Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              stageFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Барлығы ({activeAssessment.tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setStageFilter('Сабақтың басы (Кіріспе / Миға шабуыл)')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              stageFilter === 'Сабақтың басы (Кіріспе / Миға шабуыл)'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Сабақ басы
          </button>
          <button
            type="button"
            onClick={() => setStageFilter('Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              stageFilter === 'Сабақтың ортасы (Жаңа сабақты бекіту / Тапсырмалар)'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Сабақ ортасы (А/В/С)
          </button>
          <button
            type="button"
            onClick={() => setStageFilter('Сабақтың соңы (Шығу парағы / Рефлексия)')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              stageFilter === 'Сабақтың соңы (Шығу парағы / Рефлексия)'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Шығу парағы
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Сабақта әлі қалыптастырушы тапсырмалар жоқ
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Жоғарыдағы «ЖИ көмегімен сабаққа ҚБ жинағын құру» түймесін басыңыз немесе «Дайын әдістемелік ҚБ үлгілерін» (А, В, С немесе Шығу парағы) пайдаланыңыз.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreatingNewTask(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>Қолдан жаңа тапсырма жазу</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, idx) => (
            <div
              key={task.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 transition-all"
            >
              {/* Task Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                    №{idx + 1}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    {task.title}
                  </h4>

                  {/* Stage Badge */}
                  {task.lessonStage && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {task.lessonStage.split(' ')[0]} {task.lessonStage.split(' ')[1] || ''}
                    </span>
                  )}

                  {/* Differentiation level */}
                  {task.differentiation && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {task.differentiation}
                    </span>
                  )}

                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {task.type}
                  </span>
                </div>

                {/* Score & Actions */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                    {task.points} балл
                  </span>

                  <button
                    type="button"
                    onClick={() => handleMoveTask(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                    title="Жоғары жылжыту"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveTask(idx, 'down')}
                    disabled={idx === filteredTasks.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                    title="Төмен жылжыту"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateTask(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    title="Көшірмесін жасау"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingTask(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    title="Өңдеу"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Жою"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                {task.question}
              </div>

              {/* Options if Test */}
              {task.options && task.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {task.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              {/* Descriptors & Criteria Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Бағалау критерийі мен дескриптор</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Балл</span>
                </div>
                <div className="p-2.5 bg-slate-50/50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">Критерий:</span> <strong>{task.criteria}</strong>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {task.descriptors.map((desc, dIdx) => (
                    <div
                      key={dIdx}
                      className="px-3.5 py-2 flex items-center justify-between text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
                    >
                      <span>• {desc}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0 ml-3">
                        1 балл
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Constructive Feedback Template */}
              {task.teacherFeedbackSample && (
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs flex items-start gap-2 text-amber-900 dark:text-amber-200">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <strong className="font-semibold">Мұғалімнің сындарлы кері байланысы:</strong>{' '}
                    <span>{task.teacherFeedbackSample}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Task button at bottom */}
          <button
            type="button"
            onClick={() => setIsCreatingNewTask(true)}
            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 rounded-2xl flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 text-sm font-semibold transition-all bg-white dark:bg-slate-900"
          >
            <Plus className="w-4 h-4" />
            <span>Жаңа ҚБ тапсырмасын қолдан қосу</span>
          </button>
        </div>
      )}

      {/* Task Edit Modal */}
      {(editingTask || isCreatingNewTask) && (
        <TaskEditModal
          task={editingTask || undefined}
          onSave={handleSaveTask}
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

      {/* Assign to Class Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Сыныпқа ҚБ тапсырмасын жіберу
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                «{activeAssessment.title}» сабақ бағалауын таңдалған сыныпқа күнделікті жұмыс ретінде жіберу
              </p>
            </div>

            <form onSubmit={handleAssignToClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Сыныпты таңдаңыз:
                </label>
                <select
                  value={assignClassId}
                  onChange={(e) => setAssignClassId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.subject} ({c.students.length} оқушы)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Орындау мерзімі:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setAssignDeadlineDays(days)}
                      className={`py-2 rounded-xl text-xs font-semibold border ${
                        assignDeadlineDays === days
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {days} күн (Күнделікті)
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md"
                >
                  Сыныпқа жіберу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
