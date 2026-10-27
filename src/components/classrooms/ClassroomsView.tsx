import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Users,
  BookOpen,
  Share2,
  Calendar,
  Clock,
  Printer,
  Trash2,
  Edit3,
  ExternalLink,
  KeyRound,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  UserPlus,
  Send,
  ClipboardCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Classroom, AssignedAssessment, Assessment } from '../../types';
import { KAZAKH_SUBJECTS, GRADES } from '../../data/mockData';
import { ShareModal } from './ShareModal';
import { StudentTestModal } from './StudentTestModal';
import { PrintPreviewModal } from '../common/PrintPreviewModal';

export const ClassroomsView: React.FC = () => {
  const {
    classrooms,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    assignAssessmentToClass,
    removeAssessmentFromClass,
    addStudentToClass,
    removeStudentFromClass,
    assessments,
    selectedSubject,
    setCurrentPage,
    showToast,
  } = useApp();

  // Active opened classroom (detail view)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const selectedClass = classrooms.find((c) => c.id === selectedClassId);

  // Tab inside folder view: 'assignments' | 'students'
  const [folderTab, setFolderTab] = useState<'assignments' | 'students'>('assignments');

  // Modals
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [isAssigningModal, setIsAssigningModal] = useState(false);
  const [isAddingStudentModal, setIsAddingStudentModal] = useState(false);

  // Assignment action modals
  const [sharingAssignment, setSharingAssignment] = useState<AssignedAssessment | null>(null);
  const [testingAssignment, setTestingAssignment] = useState<AssignedAssessment | null>(null);
  const [printingAssessment, setPrintingAssessment] = useState<Assessment | null>(null);

  // New classroom form state
  const [newClassName, setNewClassName] = useState('8 "А"');
  const [newSubject, setNewSubject] = useState(selectedSubject || 'Физика');

  React.useEffect(() => {
    if (selectedSubject) {
      setNewSubject(selectedSubject);
    }
  }, [selectedSubject]);
  const [newGrade, setNewGrade] = useState(8);
  const [newColor, setNewColor] = useState('indigo');
  const [newDescription, setNewDescription] = useState('');
  const [bulkStudents, setBulkStudents] = useState('');

  // Assign assessment form state
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    assessments[0]?.id || ''
  );
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [assignInstructions, setAssignInstructions] = useState('');

  // Single student add state
  const [singleStudentName, setSingleStudentName] = useState('');

  // Copy code helper
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse bulk students
    const parsedStudents = bulkStudents
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((name, idx) => ({
        id: `st_${Date.now()}_${idx}`,
        name,
        joinedAt: new Date().toISOString(),
      }));

    const newClass: Classroom = {
      id: `class_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: newClassName.trim(),
      subject: newSubject,
      grade: Number(newGrade),
      academicYear: '2026-2027',
      code: `EDU-${newClassName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}${Math.floor(
        10 + Math.random() * 89
      )}`,
      color: newColor,
      description: newDescription.trim() || `${newSubject} пәні бойынша оқу тобы`,
      students: parsedStudents.length > 0 ? parsedStudents : [
        { id: `st_${Date.now()}_1`, name: 'Әлиханұлы Нұрболат' },
        { id: `st_${Date.now()}_2`, name: 'Бекболатқызы Дарина' },
      ],
      assignedAssessments: [],
      createdAt: new Date().toISOString(),
    };

    addClassroom(newClass);
    setIsCreatingClass(false);
    setBulkStudents('');
    setNewDescription('');
    setSelectedClassId(newClass.id);
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !selectedAssessmentId) return;

    const deadline = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toISOString();
    assignAssessmentToClass(selectedClassId, selectedAssessmentId, deadline, assignInstructions);
    setIsAssigningModal(false);
  };

  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !singleStudentName.trim()) return;
    addStudentToClass(selectedClassId, singleStudentName.trim());
    setSingleStudentName('');
    setIsAddingStudentModal(false);
  };

  const colorStyles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-900',
      text: 'text-indigo-600 dark:text-indigo-400',
      badge: 'bg-indigo-600 text-white',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-600 text-white',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200 dark:border-purple-900',
      text: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-600 text-white',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900',
      text: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-600 text-white',
    },
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* View 1: Classroom List View */}
      {!selectedClass && (
        <>
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Сыныптар мен бумалар ({classrooms.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Мұғалім сыныптары, дайындалған тапсырмалар қоржыны және оқушыларға жіберу
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCreatingClass(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-all self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Жаңа сынып құру</span>
            </button>
          </div>

          {/* Classroom Cards Grid */}
          {classrooms.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Әзірге сыныптар құрылмаған
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Оқушыларыңызға тапсырмаларды жіберу үшін сынып бумасын құрыңыз.
              </p>
              <button
                onClick={() => setIsCreatingClass(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
              >
                Сынып құру
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classrooms.map((cls) => {
                const style = colorStyles[cls.color] || colorStyles.indigo;
                return (
                  <div
                    key={cls.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Card Top */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${style.badge}`}>
                            {cls.name}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {cls.subject}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteClassroom(cls.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                            title="Сыныпты өшіру"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {cls.description}
                      </p>

                      {/* Code and Year */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-500">Код:</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {cls.code}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(cls.code, cls.id)}
                          className="text-slate-400 hover:text-indigo-600 p-1"
                          title="Кодты көшіру"
                        >
                          {copiedCodeId === cls.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {cls.students.length} оқушы
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                          <BookOpen className="w-3.5 h-3.5" />
                          {cls.assignedAssessments.length} тапсырма
                        </span>
                      </div>
                    </div>

                    {/* Open Folder Action */}
                    <button
                      onClick={() => setSelectedClassId(cls.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 group"
                    >
                      <span>Буманы ашу және тапсырмалар</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* View 2: Classroom Folder Detail View */}
      {selectedClass && (
        <div className="space-y-6">
          {/* Breadcrumb & Folder Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedClassId(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Барлық сыныптарға қайту"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-xs">
                    {selectedClass.name}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {selectedClass.subject} — Сынып бумасы
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Сыныпқа қосылу коды: <strong className="font-mono text-indigo-600">{selectedClass.code}</strong> • {selectedClass.academicYear} оқу жылы
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAssigningModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-600/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Бумаға тапсырма салу / Тағайындау</span>
              </button>
            </div>
          </div>

          {/* Folder Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setFolderTab('assignments')}
              className={`px-5 py-3 font-semibold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
                folderTab === 'assignments'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Тағайындалған тапсырмалар ({selectedClass.assignedAssessments.length})</span>
            </button>

            <button
              onClick={() => setFolderTab('students')}
              className={`px-5 py-3 font-semibold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-2 ${
                folderTab === 'students'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Оқушылар тізімі ({selectedClass.students.length})</span>
            </button>
          </div>

          {/* Tab 1: Assigned Assessments in Folder */}
          {folderTab === 'assignments' && (
            <div className="space-y-4">
              {selectedClass.assignedAssessments.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Бұл сыныпқа әзірге тапсырма салынбаған
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Дайын БЖБ немесе ТЖБ бағалау жұмысын осы сыныптың бумасына салып, оқушыларға жіберіңіз.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAssigningModal(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Тапсырма тағайындау
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedClass.assignedAssessments.map((assign) => {
                    const fullAss = assessments.find((a) => a.id === assign.assessmentId);

                    return (
                      <div
                        key={assign.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                assign.type === 'ҚБ'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : assign.type === 'БЖБ'
                                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {assign.type}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {assign.subject} • {assign.grade}-сынып
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800">
                              {assign.status}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {assign.assessmentTitle}
                          </h4>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>Балл: {assign.totalPoints} балл</span>
                            <span>•</span>
                            <span>Уақыты: {assign.durationMinutes} мин</span>
                            <span>•</span>
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              Мерзімі: {new Date(assign.deadline).toLocaleDateString('kk-KZ')}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Тапсырғандар: {assign.submissionsCount} / {selectedClass.students.length}
                            </span>
                          </div>
                        </div>

                        {/* Actions: Send to students, preview, print, remove */}
                        <div className="flex items-center gap-2 flex-wrap self-end lg:self-center">
                          <button
                            onClick={() => setSharingAssignment(assign)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Оқушыларға жіберу</span>
                          </button>

                          <button
                            onClick={() => setCurrentPage('grading')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-semibold text-xs border border-amber-500/30 transition-colors"
                            title="Оқушылар жіберген жауаптарды тексеру"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Жұмыстарды тексеру</span>
                            {assign.submissionsCount > 0 && (
                              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-600 text-white font-bold">
                                {assign.submissionsCount}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => setTestingAssignment(assign)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                            title="Оқушы көзімен көру немесе тексеру"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Оқушы режимі</span>
                          </button>

                          {fullAss && (
                            <button
                              onClick={() => setPrintingAssessment(fullAss)}
                              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Қағаз нұсқасын басып шығару"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => removeAssessmentFromClass(selectedClass.id, assign.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="Бумадан өшіру"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Students Roster in Folder */}
          {folderTab === 'students' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedClass.name} сыныбы оқушыларының тізімі
                  </h3>
                  <p className="text-xs text-slate-500">
                    Барлығы {selectedClass.students.length} оқушы тіркелген
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingStudentModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Оқушы қосу</span>
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3.5 w-12 text-center">№</th>
                      <th className="p-3.5">Оқушының аты-жөні</th>
                      <th className="p-3.5">Электронды поштасы / ID</th>
                      <th className="p-3.5">Сыныбы</th>
                      <th className="p-3.5 text-right">Әрекет</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedClass.students.map((st, idx) => (
                      <tr key={st.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 text-center text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{st.name}</td>
                        <td className="p-3.5 text-slate-500">{st.email || '—'}</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                          {selectedClass.name}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => removeStudentFromClass(selectedClass.id, st.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                            title="Сыныптан өшіру"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Create New Classroom */}
      {isCreatingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Жаңа сынып бумасын құру
              </h3>
              <button
                onClick={() => setIsCreatingClass(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClassroom} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Сынып атауы
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Мысалы: 8 &quot;А&quot;"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Пән
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {KAZAKH_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Сынып деңгейі
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}-сынып
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Бума түсі
                  </label>
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="indigo">Көкшіл (Indigo)</option>
                    <option value="emerald">Жасыл (Emerald)</option>
                    <option value="purple">Күлгін (Purple)</option>
                    <option value="amber">Сары (Amber)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Сынып сипаттамасы (қосымша)
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Мысалы: Тереңдетілген бағыттағы топ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Оқушылар тізімін енгізу (әр жолға бір оқушы аты-жөні)
                </label>
                <textarea
                  rows={4}
                  value={bulkStudents}
                  onChange={(e) => setBulkStudents(e.target.value)}
                  placeholder="Әлиханұлы Нұрболат&#10;Бекболатқызы Дарина&#10;Серікбаев Мансұр"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingClass(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Сыныпты сақтау
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Assign Assessment to Class */}
      {isAssigningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Сыныпқа тапсырма салу / Тағайындау
              </h3>
              <button
                onClick={() => setIsAssigningModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Дайындалған бағалау жұмысын таңдаңыз:
                </label>
                <select
                  value={selectedAssessmentId}
                  onChange={(e) => setSelectedAssessmentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                >
                  {assessments.map((ass) => (
                    <option key={ass.id} value={ass.id}>
                      [{ass.type}] {ass.title} ({ass.subject}, {ass.tasks.length} тапсырма)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Орындау мерзімі (күн саны):
                </label>
                <select
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value={1}>1 күн (бүгін кешке дейін)</option>
                  <option value={3}>3 күн</option>
                  <option value={7}>7 күн (1 апта)</option>
                  <option value={14}>14 күн (2 апта)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Оқушыларға арналған нұсқаулық:
                </label>
                <textarea
                  rows={3}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  placeholder="Тапсырманы орындау кезінде калькуляторды қолдануға болады..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssigningModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Сыныпқа тағайындау
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Single Student */}
      {isAddingStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Оқушы қосу
              </h3>
              <button
                onClick={() => setIsAddingStudentModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSingleStudent} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Оқушының толық аты-жөні
                </label>
                <input
                  type="text"
                  value={singleStudentName}
                  onChange={(e) => setSingleStudentName(e.target.value)}
                  placeholder="Мысалы: Бақытжан Данияр"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingStudentModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Қосу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingAssignment && selectedClass && (
        <ShareModal
          classroom={selectedClass}
          assignment={sharingAssignment}
          onClose={() => setSharingAssignment(null)}
          onOpenStudentPreview={() => {
            const current = sharingAssignment;
            setSharingAssignment(null);
            setTestingAssignment(current);
          }}
        />
      )}

      {/* Student Testing Modal */}
      {testingAssignment && selectedClass && (
        <StudentTestModal
          classroom={selectedClass}
          assignment={testingAssignment}
          onClose={() => setTestingAssignment(null)}
        />
      )}

      {/* Printable Preview Modal */}
      {printingAssessment && (
        <PrintPreviewModal
          assessment={printingAssessment}
          onClose={() => setPrintingAssessment(null)}
        />
      )}
    </div>
  );
};
