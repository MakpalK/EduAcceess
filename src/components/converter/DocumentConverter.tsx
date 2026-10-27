import React, { useState, useRef } from 'react';
import {
  FileUp,
  Sparkles,
  FileText,
  FileType,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Send,
  Database,
  Printer,
  RotateCcw,
  Eye,
  Check,
  ChevronDown,
  HelpCircle,
  Clock,
  Award,
  Layers,
  BookOpen,
  ArrowRight,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';
import mammoth from 'mammoth';
import { useApp } from '../../context/AppContext';
import {
  Task,
  Assessment,
  AssessmentType,
  ConvertedAssessmentResult,
  DifficultyLevel,
} from '../../types';
import { KAZAKH_SUBJECTS, GRADES } from '../../data/mockData';
import { convertDocumentApi } from '../../services/api';
import { PrintPreviewModal } from '../common/PrintPreviewModal';

// Sample Kazakh curriculum documents for 1-click testing
const SAMPLE_DOCUMENTS = [
  {
    id: 'sample_algebra_8',
    title: '8-сынып Алгебра: Квадрат теңдеулер (БЖБ)',
    subject: 'Алгебра',
    grade: 8,
    type: 'БЖБ' as AssessmentType,
    fileName: 'Algebra_8synyp_BJB_Kvadrat_tendeu.docx',
    text: `БӨЛІМ БОЙЫНША ЖИЫНТЫҚ БАҒАЛАУ (БЖБ)
Пән: Алгебра
Сынып: 8
Бөлім: «Квадрат теңдеулер»
Орындау уақыты: 25 минут
Жалпы балл: 10

Оқу мақсаттары:
8.2.2.3 толымсыз және толық квадрат теңдеулерді шешу;
8.2.2.4 Виет теоремасын қолдану;
8.2.2.8 квадрат теңдеулердің көмегімен мәтінді есептерді шешу.

1-тапсырма. (1 балл)
Берілген теңдеулердің ішінен толымсыз квадрат теңдеуді көрсетіңіз:
A) 2x² - 5x + 3 = 0
B) 3x² - 12 = 0
C) x² + 4x + 4 = 0
D) 5x - 7 = 0

2-тапсырма. (3 балл)
2x² - 7x + 3 = 0 квадрат теңдеуін дискриминант арқылы шешіңіз.

3-тапсырма. (3 балл)
Виет теоремасын қолданып, x² - 8x + 15 = 0 теңдеуінің түбірлерін және түбірлерінің көбейтіндісі мен қосындысын табыңыз.

4-тапсырма. (3 балл)
Тіктөртбұрыштың бір қабырғасы екіншісінен 4 см ұзын, ал ауданы 60 см²-ге тең. Тіктөртбұрыштың қабырғаларын квадрат теңдеу құру арқылы анықтаңыз.`,
  },
  {
    id: 'sample_physics_9',
    title: '9-сынып Физика: Жылу құбылыстары (БЖБ)',
    subject: 'Физика',
    grade: 9,
    type: 'БЖБ' as AssessmentType,
    fileName: 'Fizika_9synyp_BJB_Zhylu_kubylystary.pdf',
    text: `БӨЛІМ БОЙЫНША ЖИЫНТЫҚ БАҒАЛАУ (БЖБ)
Пән: Физика
Сынып: 9
Бөлім: «Жылу құбылыстары және термодинамика негіздері»
Орындау уақыты: 25 минут
Жалпы балл: 10

Оқу мақсаттары:
9.3.2.1 жылу құбылыстарын бөлшектер қозғалысы тұрғысынан сипаттау;
9.3.2.5 жылу мөлшерінің формуласын Q = cm(t2 - t1) қолдану;
9.3.2.9 меншікті балқу жылуын пайдаланып есептер шығару.

1-тапсырма. (1 балл)
Қатты денелердегі жылу өткізгіштік процесі қалай жүреді?
A) Бөлшектердің ретсіз соқтығысуы арқылы заттың тасымалдануынсыз энергия алмасуы
B) Сұйықтың конвекциялық ағындары арқылы
C) Электромагниттік сәуле шығару арқылы
D) Тек сыртқы күштердің әсерінен

2-тапсырма. (2 балл)
Сол жақтағы жылулық физикалық процестерді оң жақтағы формулаларымен сәйкестендіріңіз:
1. Затты қыздыруға қажетті жылу мөлшері | А. Q = λ * m
2. Заттың балқуы кезіндегі жылу мөлшері | В. Q = c * m * Δt
3. Отын жанғанда бөлінетін жылу мөлшері | С. Q = q * m

3-тапсырма. (4 балл)
Массасы 2 кг суды 20 °C-тан 80 °C-қа дейін қыздыру үшін қанша жылу мөлшері қажет? (Судың меншікті жылусыйымдылығы c = 4200 Дж/(кг*°C)).

4-тапсырма. (3 балл)
Массасы 0.5 кг мұзды 0 °C температурада толықтай суға айналдыру үшін жұмсалатын жылу мөлшерін есептеңіз. (Мұздың меншікті балқу жылуы λ = 3.34 * 10⁵ Дж/кг).`,
  },
  {
    id: 'sample_informatics_7',
    title: '7-сынып Информатика: Python тіліндегі алгоритмдер (ТЖБ)',
    subject: 'Информатика',
    grade: 7,
    type: 'ТЖБ' as AssessmentType,
    fileName: 'Informatika_7synyp_TZHB_Python.docx',
    text: `ТОҚСАНДЫҚ ЖИЫНТЫҚ БАҒАЛАУ (ТЖБ)
Пән: Информатика
Сынып: 7
Тоқсан: 2-тоқсан
Орындау уақыты: 40 минут
Жалпы балл: 15

Оқу мақсаттары:
7.3.2.1 циклдік алгоритмдерді өңдеуде for және while операторларын қолдану;
7.3.3.1 бағдарлама кодын талдау және нәтижесін анықтау;
7.3.1.1 алгоритмнің сызықтық, тармақталу және цикл түрлерін ажырату.

1-тапсырма. (1 балл)
Python тілінде қайталау саны алдын ала белгілі болғанда қолданылатын цикл операторы:
A) while
B) for
C) if-else
D) def

2-тапсырма. (2 балл)
Төмендегі кодтың экранға шығаратын нәтижесін табыңыз:
s = 0
for i in range(1, 5):
    s += i
print(s)
A) 10
B) 15
C) 5
D) 4

3-тапсырма. (4 балл)
while циклін қолданып, 1-ден 10-ға дейінгі жұп сандарды басып шығаратын Python бағдарламасын құрыңыз немесе логикалық алгоритмін сипаттаңыз.

4-тапсырма. (4 балл)
Оқушының 3 сабақтан алған бағалары берілген. Олардың арифметикалық ортасын табатын бағдарлама кодын жазыңыз.

5-тапсырма. (4 балл)
Сызықтық және циклдік алгоритмдердің негізгі айырмашылығын сипаттап, өмірден мысал келтіріңіз.`,
  },
];

export const DocumentConverter: React.FC = () => {
  const {
    selectedSubject,
    setSelectedSubject,
    openAssessmentInBuilder,
    addToQuestionBank,
    classrooms,
    assignAssessmentToClass,
    showToast,
  } = useApp();

  // Input tabs: 'file' | 'text' | 'samples'
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'samples'>('file');

  // File Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [extractedDocxText, setExtractedDocxText] = useState<string>('');
  const [pastedText, setPastedText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Conversion Options
  const [targetSubject, setTargetSubject] = useState(selectedSubject || 'Физика');
  const [targetGrade, setTargetGrade] = useState<number>(8);
  const [targetType, setTargetType] = useState<AssessmentType | 'auto'>('auto');

  // Processing state
  const [isConverting, setIsConverting] = useState(false);
  const [convertingStep, setConvertingStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Converted Result state
  const [convertedResult, setConvertedResult] = useState<ConvertedAssessmentResult | null>(null);
  const [previewMode, setPreviewMode] = useState<'teacher' | 'student'>('teacher');
  const [editingTaskIdx, setEditingTaskIdx] = useState<number | null>(null);

  // Interactive Student simulation state
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [showAnswerKeys, setShowAnswerKeys] = useState(false);

  // Modals inside result
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignClassId, setAssignClassId] = useState(classrooms[0]?.id || '');
  const [assignDeadlineDays, setAssignDeadlineDays] = useState(7);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Sync targetSubject when selectedSubject changes
  React.useEffect(() => {
    if (selectedSubject) {
      setTargetSubject(selectedSubject);
    }
  }, [selectedSubject]);

  // Handle file select
  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);

    const ext = file.name.split('.').pop()?.toLowerCase();

    // If it's a Word document (.docx)
    if (ext === 'docx') {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (arrayBuffer) {
            const result = await mammoth.extractRawText({ arrayBuffer });
            setExtractedDocxText(result.value);
            showToast('Word (.docx) мәтіні сәтті оқылды', 'success');
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        console.error('Word extraction error:', err);
        showToast('Word файлын оқу кезінде қате болды, мәтінді тікелей көшіріп қоюға болады', 'error');
      }
    } else if (ext === 'txt') {
      // Plain text
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setExtractedDocxText(text);
        showToast('Мәтіндік файл оқылды', 'success');
      };
      reader.readAsText(file);
    } else {
      // PDF or Images (PNG, JPG, etc.) -> Read base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFileBase64(dataUrl);
        showToast('Құжат суреті/PDF сандық түрде жүктелді', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Convert Action
  const handleStartConversion = async () => {
    setErrorMessage(null);
    let textToSend = '';
    let fileBase64ToSend = '';
    let mimeToSend = 'application/pdf';
    let docName = '';

    if (activeTab === 'file') {
      if (!selectedFile) {
        setErrorMessage('Алдымен түрлендіретін Word, PDF немесе сурет файлын таңдаңыз');
        return;
      }
      docName = selectedFile.name;
      mimeToSend = selectedFile.type || 'application/pdf';
      textToSend = extractedDocxText;
      fileBase64ToSend = fileBase64;
    } else if (activeTab === 'text') {
      if (!pastedText.trim()) {
        setErrorMessage('БЖБ немесе ТЖБ тапсырмаларының мәтінін жазыңыз немесе қойыңыз');
        return;
      }
      docName = 'Мәтіннен енгізілген тапсырмалар';
      textToSend = pastedText;
    }

    setIsConverting(true);
    setConvertingStep(1);

    // Progress simulation
    const timer1 = setTimeout(() => setConvertingStep(2), 1200);
    const timer2 = setTimeout(() => setConvertingStep(3), 2600);

    try {
      const res = await convertDocumentApi({
        text: textToSend,
        fileBase64: fileBase64ToSend,
        fileName: docName,
        mimeType: mimeToSend,
        subjectHint: targetSubject,
        gradeHint: targetGrade,
        assessmentTypeHint: targetType,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.success || !res.result) {
        throw new Error(res.error || 'Құжатты өңдеу нәтижесі алынбады');
      }

      setConvertedResult(res.result);
      setIsConverting(false);
      showToast('Құжат интерактивті тапсырмаларға сәтті айналдырылды!', 'success');
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsConverting(false);
      setErrorMessage(err.message || 'Түрлендіру кезінде қате пайда болды');
      showToast('Түрлендіру сәтсіз аяқталды', 'error');
    }
  };

  // Convert Sample Document in 1 click
  const handleConvertSample = async (sample: typeof SAMPLE_DOCUMENTS[0]) => {
    setTargetSubject(sample.subject);
    setTargetGrade(sample.grade);
    setTargetType(sample.type);
    setSelectedSubject(sample.subject);

    setIsConverting(true);
    setConvertingStep(1);
    const timer1 = setTimeout(() => setConvertingStep(2), 1000);
    const timer2 = setTimeout(() => setConvertingStep(3), 2200);

    try {
      const res = await convertDocumentApi({
        text: sample.text,
        fileName: sample.fileName,
        subjectHint: sample.subject,
        gradeHint: sample.grade,
        assessmentTypeHint: sample.type,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.success || !res.result) {
        throw new Error(res.error || 'Үлгілік құжат өңделмеді');
      }

      setConvertedResult(res.result);
      setIsConverting(false);
      showToast(`«${sample.title}» интерактивті түрге көшірілді!`, 'success');
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsConverting(false);
      setErrorMessage(err.message || 'Үлгіні түрлендіру кезінде қате орын алды');
    }
  };

  // Turn converted result into Assessment object
  const buildAssessmentFromConverted = (): Assessment => {
    if (!convertedResult) throw new Error('Нәтиже табылмады');
    return {
      id: `ass_conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: convertedResult.title,
      type: convertedResult.type,
      subject: convertedResult.subject,
      grade: convertedResult.grade,
      term: convertedResult.term,
      unitOrTopic: convertedResult.unitOrTopic,
      learningObjectives: convertedResult.learningObjectives,
      durationMinutes: convertedResult.durationMinutes,
      targetPoints: convertedResult.targetPoints,
      difficulty: 'Орташа',
      tasks: convertedResult.tasks,
      status: 'Дайын',
      author: 'Мұғалім (EduAccess)',
      instructions: 'Тапсырмаларды мұқият оқып, сұрақтарға жауап беріңіз. Әр тапсырмаға бағалау критерийі мен дескриптор берілген.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // 1-Click: Open in Builder
  const handleOpenInBuilder = () => {
    if (!convertedResult) return;
    const assessment = buildAssessmentFromConverted();
    openAssessmentInBuilder(assessment);
  };

  // 1-Click: Save all tasks to Question Bank
  const handleSaveAllToBank = async () => {
    if (!convertedResult) return;
    for (const task of convertedResult.tasks) {
      await addToQuestionBank(task);
    }
    showToast(`Барлық ${convertedResult.tasks.length} тапсырма Тапсырмалар банкіне қосылды!`, 'success');
  };

  // 1-Click: Assign to Classroom
  const handleAssignToClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertedResult || !assignClassId) return;

    const assessment = buildAssessmentFromConverted();
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + assignDeadlineDays);
    const deadlineStr = deadlineDate.toISOString().split('T')[0];

    assignAssessmentToClass(
      assignClassId,
      assessment.id,
      deadlineStr,
      `Құжаттан түрлендірілген ${assessment.title}. Барлық тапсырмаларды мерзімінде орындаңыз.`
    );

    setIsAssignModalOpen(false);
    showToast(`Тапсырма таңдалған сыныпқа сәтті тағайындалды! Оқушылар онлайн орындай алады.`, 'success');
  };

  // Interactive student answer handling
  const handleStudentSelect = (taskId: string, answer: string) => {
    setStudentAnswers((prev) => ({ ...prev, [taskId]: answer }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            ҚР №125 стандарты және жаңартылған мазмұн
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            БЖБ және ТЖБ файлдарын интерактивті тапсырмаларға түрлендіргіш
          </h1>
          <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
            Компьютеріңіздегі дайын Word (.docx), PDF құжатын, скан-суретті немесе тест мәтінін жүктеңіз. EduAccess жасанды интеллекті құжатты оқып, сұрақтарды интерактивті тест, есептер мен дескрипторлар кестесіне айналдырып береді.
          </p>
        </div>
      </div>

      {!convertedResult ? (
        /* Document Upload & Input Area */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-2 gap-2">
            <button
              onClick={() => setActiveTab('file')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'file'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FileUp className="w-4 h-4" />
              Файлды жүктеу (Word / PDF / Скан)
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'text'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Мәтінді тікелей қою
            </button>
            <button
              onClick={() => setActiveTab('samples')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'samples'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Дайын үлгілік құжаттар
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Tab 1: File Dropzone */}
            {activeTab === 'file' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                      : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.pdf,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        {selectedFile.name.endsWith('.docx') ? (
                          <FileText className="w-8 h-8" />
                        ) : selectedFile.name.endsWith('.pdf') ? (
                          <FileType className="w-8 h-8" />
                        ) : (
                          <ImageIcon className="w-8 h-8" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Жүктелді
                        </p>
                      </div>
                      {extractedDocxText && (
                        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Word мәтіні сәтті оқылды ({extractedDocxText.length} таңба)
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setExtractedDocxText('');
                          setFileBase64('');
                        }}
                        className="text-xs text-red-600 hover:text-red-700 underline mt-2"
                      >
                        Басқа файл таңдау
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                        <FileUp className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                          Файлды осы жерге сүйреп әкеліңіз немесе таңдау үшін басыңыз
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Қолдау көрсетілетін форматтар: Word (.docx), PDF құжаты, скан/фото (PNG, JPG), мәтіндік файл (.txt)
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          Word (.docx)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                          PDF құжаты
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          Скан / Фото
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Paste Text */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    БЖБ немесе ТЖБ тапсырмаларының мәтіні:
                  </label>
                  <button
                    type="button"
                    onClick={() => setPastedText('')}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Тазалау
                  </button>
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="БЖБ немесе ТЖБ сұрақтарын, тапсырмаларын осы жерге көшіріп қойыңыз (Word, WhatsApp немесе кез келген құжаттан)..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs md:text-sm"
                />
              </div>
            )}

            {/* Tab 3: Sample Documents */}
            {activeTab === 'samples' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Қазақстанның нақты оқу бағдарламасына сай дайындалған үлгілік БЖБ/ТЖБ құжаттарын таңдап, 1 басу арқылы интерактивті режимге көшіріңіз:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SAMPLE_DOCUMENTS.map((sample) => (
                    <div
                      key={sample.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all bg-white dark:bg-slate-800/40 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              sample.type === 'БЖБ'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                            }`}
                          >
                            {sample.type}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {sample.grade}-сынып
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                          {sample.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 font-mono mt-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-200/50 dark:border-slate-800">
                          {sample.text.slice(0, 150)}...
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleConvertSample(sample)}
                        disabled={isConverting}
                        className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium text-xs hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Интерактивті ету
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Options (Subject, Grade, Type) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Пән (Қажет болса нақтылау):
                </label>
                <select
                  value={targetSubject}
                  onChange={(e) => {
                    setTargetSubject(e.target.value);
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
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(Number(e.target.value))}
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
                  Бағалау түрі:
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="auto">Авто-анықтау (Құжаттан)</option>
                  <option value="БЖБ">БЖБ (Бөлім бойынша)</option>
                  <option value="ТЖБ">ТЖБ (Тоқсандық)</option>
                </select>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Convert Button */}
            {activeTab !== 'samples' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartConversion}
                  disabled={isConverting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 text-base"
                >
                  <Sparkles className="w-5 h-5" />
                  ЖИ арқылы интерактивті тапсырмаларға айналдыру
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Loading Progress State */}
      {isConverting && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Құжат сарапталып, интерактивті форматқа түрлендірілуде...
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              ҚР БҒМ №125 бұйрығы негізінде бағалау критерийлері мен дескрипторлар құрылуда
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${convertingStep * 33}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className={convertingStep >= 1 ? 'text-indigo-600 font-semibold' : ''}>
                1. Құжат оқылуда
              </span>
              <span className={convertingStep >= 2 ? 'text-indigo-600 font-semibold' : ''}>
                2. Дескрипторлар кестесі
              </span>
              <span className={convertingStep >= 3 ? 'text-indigo-600 font-semibold' : ''}>
                3. Интерактивті тесттер
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Converted Results View */}
      {convertedResult && !isConverting && (
        <div className="space-y-6">
          {/* Result Header & Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      convertedResult.type === 'БЖБ'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                    }`}
                  >
                    {convertedResult.type}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {convertedResult.grade}-сынып • {convertedResult.subject}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Құжаттан сәтті түрлендірілді
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {convertedResult.title}
                </h2>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {convertedResult.summary}
                </p>
              </div>

              {/* View Mode Toggle (Teacher edit vs Student interactive test) */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setPreviewMode('teacher')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewMode === 'teacher'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Мұғалім режимі (Дескрипторлар)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('student')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    previewMode === 'student'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Интерактивті сынақ (Оқушы көзімен)
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400">Тапсырмалар саны</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {convertedResult.tasks.length} тапсырма
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400">Жалпы балл</p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {convertedResult.targetPoints} балл
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400">Орындау уақыты</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {convertedResult.durationMinutes} минут
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400">Оқу мақсаттары</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {convertedResult.learningObjectives.join(', ')}
                </p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleOpenInBuilder}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                <FolderPlus className="w-4 h-4" />
                {convertedResult.type} құрастырушысына жүктеу
              </button>

              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                Сыныпқа тағайындау
              </button>

              <button
                type="button"
                onClick={handleSaveAllToBank}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
              >
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Тапсырмалар банкіне сақтау
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                Баспаға шығару
              </button>

              <button
                type="button"
                onClick={() => {
                  setConvertedResult(null);
                  setSelectedFile(null);
                  setExtractedDocxText('');
                  setFileBase64('');
                  setPastedText('');
                }}
                className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Жаңа құжат жүктеу
              </button>
            </div>
          </div>

          {/* Mode 1: Teacher Mode (Specification, Rubrics & Descriptors) */}
          {previewMode === 'teacher' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Интерактивті тапсырмалар мен дескрипторлар тізімі
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ҚР №125 бұйрығы: әр қадамдық дескрипторға 1 балл
                </span>
              </div>

              {convertedResult.tasks.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  {/* Task Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                        №{idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {task.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {task.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        {task.points} балл
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Оқу мақсаты: <strong className="text-slate-700 dark:text-slate-200">{task.learningObjective}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {task.question}
                  </div>

                  {/* Options if single or multiple choice */}
                  {task.options && task.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {task.options.map((opt, oIdx) => {
                        const isCorrect = task.answerKey?.includes(opt.slice(0, 2)) || task.answerKey === opt;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-semibold'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                            {isCorrect && (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-auto shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Matching pairs if matching */}
                  {task.matchingPairs && task.matchingPairs.length > 0 && (
                    <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                      <p className="font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Сәйкестендіру элементтері:
                      </p>
                      {task.matchingPairs.map((pair, pIdx) => (
                        <div key={pIdx} className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{pair.left}</span>
                          <span className="text-slate-400">↔</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{pair.right}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Specification & Descriptors Table (ҚР №125 стандарты) */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Бағалау критерийі мен дескрипторлар (ҚР №125)</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">Балл</span>
                    </div>

                    <div className="p-3 bg-slate-50/50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">Критерий: </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{task.criteria}</span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {task.descriptors.map((desc, dIdx) => (
                        <div
                          key={dIdx}
                          className="px-4 py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{desc}</span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 shrink-0 ml-4">
                            1 балл
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answer Key & Explanation */}
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-3.5 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Дұрыс жауап кілті: <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">{task.answerKey}</span>
                    </div>
                    {task.explanation && (
                      <p className="text-slate-600 dark:text-slate-400 pl-5">
                        <strong className="text-slate-700 dark:text-slate-300">Түсіндірме:</strong> {task.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mode 2: Student Interactive Test Simulator */}
          {previewMode === 'student' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                    Интерактивті сынақ (Оқушы тапсырманы қалай көреді)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Оқушылар осы интерфейс арқылы онлайн жауап береді. Төменде сынап көріңіз:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {showAnswerKeys ? 'Жауап кілттерін жасыру' : 'Дұрыс жауаптарды тексеру'}
                </button>
              </div>

              <div className="space-y-6">
                {convertedResult.tasks.map((task, idx) => {
                  const currentAnswer = studentAnswers[task.id] || '';
                  const isAnswered = Boolean(currentAnswer);
                  const isCorrect =
                    showAnswerKeys &&
                    (currentAnswer.toLowerCase() === task.answerKey?.toLowerCase() ||
                      task.options?.some((o) => o === currentAnswer && task.answerKey?.includes(o.slice(0, 1))));

                  return (
                    <div
                      key={task.id || idx}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 bg-slate-50/40 dark:bg-slate-850"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {idx + 1}-тапсырма ({task.points} балл)
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {task.type}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                        {task.question}
                      </p>

                      {/* Single / Multiple choice options */}
                      {task.options && task.options.length > 0 ? (
                        <div className="space-y-2 pt-1">
                          {task.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              onClick={() => handleStudentSelect(task.id, opt)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs md:text-sm cursor-pointer transition-all ${
                                currentAnswer === opt
                                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`task_${task.id}`}
                                checked={currentAnswer === opt}
                                onChange={() => {}}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        /* Open text / calculation response */
                        <div className="space-y-2 pt-1">
                          <textarea
                            value={currentAnswer}
                            onChange={(e) => handleStudentSelect(task.id, e.target.value)}
                            placeholder="Оқушының жауабы немесе есептеу шешімі осы жерге енгізіледі..."
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      {/* Answer Key check status */}
                      {showAnswerKeys && (
                        <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
                          <p className="font-semibold text-indigo-900 dark:text-indigo-300">
                            Дұрыс жауап: <span className="font-mono">{task.answerKey}</span>
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            Дескриптор: {task.descriptors.join('; ')}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Quick Assign to Class */}
      {isAssignModalOpen && convertedResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Сыныпқа тағайындау
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Түрлендірілген «{convertedResult.title}» тапсырмасын сынып оқушыларына жіберу
              </p>
            </div>

            <form onSubmit={handleAssignToClassSubmit} className="space-y-4">
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
                  Орындау мерзімі (дедлайн):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 7, 14].map((days) => (
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
                      {days} күн
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md"
                >
                  Сыныпқа жіберу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Preview Modal */}
      {isPrintModalOpen && convertedResult && (
        <PrintPreviewModal
          assessment={buildAssessmentFromConverted()}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
};
