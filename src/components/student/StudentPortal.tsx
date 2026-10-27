import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  ArrowRight,
  ExternalLink,
  KeyRound,
  Plus,
  Send,
  User,
  LogOut,
  MessageSquare,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentSubmission, AssignedAssessment, Classroom } from '../../types';
import { TASK_TYPE_LABELS } from '../../data/mockData';
import { StudentTestModal } from '../classrooms/StudentTestModal';

export const StudentPortal: React.FC = () => {
  const {
    currentStudent,
    setCurrentStudent,
    classrooms,
    submissions,
    assessments,
    submitStudentWork,
    setUserRole,
    showToast,
  } = useApp();

  // Active tab: 'tasks' | 'results' | 'join-class'
  const [activeTab, setActiveTab] = useState<'tasks' | 'results' | 'join-class'>('tasks');

  // Active assignment being tested
  const [activeTestingModal, setActiveTestingModal] = useState<{
    classroom: Classroom;
    assignment: AssignedAssessment;
  } | null>(null);

  // Selected graded submission for viewing details
  const [viewingSubmission, setViewingSubmission] = useState<StudentSubmission | null>(null);

  // Join class by code form
  const [joinClassCode, setJoinClassCode] = useState('');
  const [registerName, setRegisterName] = useState(currentStudent?.name || '');

  // Find classes the student belongs to
  const studentClasses = classrooms.filter(
    (c) =>
      c.name === currentStudent?.className ||
      c.students.some((s) => s.name.toLowerCase() === currentStudent?.name.toLowerCase())
  );

  // Collect all assigned assessments across student's classes
  const assignedList: { classroom: Classroom; assignment: AssignedAssessment }[] = [];
  studentClasses.forEach((c) => {
    c.assignedAssessments.forEach((a) => {
      assignedList.push({ classroom: c, assignment: a });
    });
  });

  // Collect student's submissions
  const mySubmissions = submissions.filter(
    (s) => s.studentName.toLowerCase() === (currentStudent?.name || '').toLowerCase()
  );

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    const foundClass = classrooms.find(
      (c) => c.code.toLowerCase() === joinClassCode.trim().toLowerCase()
    );

    if (!foundClass) {
      showToast('Мұндай сынып коды табылмады. Кодты тексеріңіз.', 'error');
      return;
    }

    if (currentStudent) {
      setCurrentStudent({
        ...currentStudent,
        name: registerName.trim() || currentStudent.name,
        className: foundClass.name,
        classCode: foundClass.code,
      });
    }

    showToast(`Сіз «${foundClass.name} — ${foundClass.subject}» сыныбына сәтті қосылдыңыз!`, 'success');
    setJoinClassCode('');
    setActiveTab('tasks');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
              <GraduationCap className="w-4 h-4" />
              <span>EduAccess • Оқушы порталы</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Сәлем, {currentStudent?.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Сыныбыңыз: <strong>{currentStudent?.className}</strong> • Тапсырмаларды орындап, мұғалімге тексеруге жіберіңіз және бағаңызды көріңіз.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setUserRole('teacher')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Мұғалім кабинетіне ауысу</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Орындауға берілген тапсырмалар ({assignedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'results'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Тексерілген нәтижелер ({mySubmissions.filter((s) => s.status === 'Тексерілді').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('join-class')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
            activeTab === 'join-class'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Сыныпқа қосылу</span>
        </button>
      </div>

      {/* Tab 1: Assigned Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {assignedList.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Қазіргі уақытта орындауға тапсырмалар жоқ
              </h4>
              <p className="text-xs text-slate-500">
                Мұғалім сынып бумасына жаңа БЖБ немесе ТЖБ тағайындаған кезде, ол осы жерде көрінеді.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedList.map(({ classroom, assignment }) => {
                const existingSub = mySubmissions.find(
                  (s) => s.assessmentId === assignment.assessmentId
                );
                const isSubmitted = !!existingSub;
                const isGraded = existingSub?.status === 'Тексерілді';

                return (
                  <div
                    key={assignment.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          assignment.type === 'ҚБ'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {assignment.type}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isGraded
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : isSubmitted
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {isGraded
                            ? `Тексерілді: ${existingSub.totalScore}/${existingSub.maxScore}`
                            : isSubmitted
                            ? 'Мұғалімге тексеруге жіберілді'
                            : 'Орындау керек'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                        {assignment.assessmentTitle}
                      </h3>

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {classroom.name} • {classroom.subject}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span>⏱ {assignment.durationMinutes} мин</span>
                        <span>🎯 {assignment.totalPoints} балл</span>
                        <span>
                          📅 Мерзімі: {new Date(assignment.deadline).toLocaleDateString('kk-KZ')}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      {isGraded ? (
                        <button
                          onClick={() => {
                            setViewingSubmission(existingSub);
                            setActiveTab('results');
                          }}
                          className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Award className="w-4 h-4" />
                          <span>Баға мен мұғалімнің пікірін көру</span>
                        </button>
                      ) : isSubmitted ? (
                        <div className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-semibold text-center">
                          Жұмыс тексерілуде...
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setActiveTestingModal({ classroom, assignment })
                          }
                          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Тапсырманы орындауды бастау</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Graded Results & Teacher Feedback */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {mySubmissions.filter((s) => s.status === 'Тексерілді').length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Award className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Әзірге тексерілген жұмыстар жоқ
              </h4>
              <p className="text-xs text-slate-500">
                Тапсырманы орындап жіберген соң, мұғалім бағалап, кері байланыспен осында қайтарады.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mySubmissions
                .filter((s) => s.status === 'Тексерілді')
                .map((sub) => {
                  const fullAss = assessments.find((a) => a.id === sub.assessmentId);

                  return (
                    <div
                      key={sub.id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-slate-900 dark:text-white">
                              {sub.assessmentTitle}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold">
                              {sub.subject}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            Тексерілген күн: {sub.gradedAt ? new Date(sub.gradedAt).toLocaleDateString('kk-KZ') : '—'}
                          </span>
                        </div>

                        {/* Big Score Badge */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-black text-slate-900 dark:text-white">
                              {sub.totalScore} / {sub.maxScore} балл
                            </div>
                            <div className="text-xs font-bold text-indigo-600">
                              {sub.percentage}% • {sub.level} деңгей
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Teacher's personal qualitative feedback */}
                      {sub.teacherFeedback && (
                        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
                          <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <span>Мұғалімнің сізге берген кері байланысы:</span>
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                            «{sub.teacherFeedback}»
                          </p>
                        </div>
                      )}

                      {/* Task breakdown */}
                      <div className="space-y-3 pt-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          Тапсырмалар мен дескрипторлардың орындалуы:
                        </span>

                        {fullAss?.tasks.map((task, idx) => {
                          const studentAns = sub.answers[task.id];
                          const earned = sub.taskScores[task.id] ?? 0;
                          const descChecks = sub.taskDescriptorsAchieved?.[task.id] || [];

                          return (
                            <div
                              key={task.id || idx}
                              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  №{idx + 1}. {task.title}
                                </span>
                                <span className="font-bold text-indigo-600">
                                  {earned} / {task.points} балл
                                </span>
                              </div>

                              <div className="text-slate-600 dark:text-slate-400">
                                <strong>Сіздің жауабыңыз:</strong> {studentAns ? String(studentAns) : 'Жауап жоқ'}
                              </div>

                              {task.descriptors && (
                                <div className="space-y-0.5 pt-1 border-t border-slate-200 dark:border-slate-700">
                                  {task.descriptors.map((d, dIdx) => {
                                    const passed = descChecks[dIdx] ?? true;
                                    return (
                                      <div
                                        key={dIdx}
                                        className={`flex items-center gap-1.5 ${
                                          passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 line-through'
                                        }`}
                                      >
                                        <span>{passed ? '✓' : '✗'}</span>
                                        <span>{d}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Join Classroom with Code */}
      {activeTab === 'join-class' && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <KeyRound className="w-10 h-10 mx-auto text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Сыныпқа код арқылы қосылу
            </h3>
            <p className="text-xs text-slate-500">
              Мұғалім берген сынып кодын енгізіңіз (мысалы: <code>EDU-8A42</code> немесе <code>EDU-8B19</code>)
            </p>
          </div>

          <form onSubmit={handleJoinClass} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Аты-жөніңіз:
              </label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Сапарбаев Айдос"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Сынып коды (Class Code):
              </label>
              <input
                type="text"
                value={joinClassCode}
                onChange={(e) => setJoinClassCode(e.target.value)}
                placeholder="EDU-8A42"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold uppercase tracking-wider outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Сыныпқа тіркелу
            </button>
          </form>
        </div>
      )}

      {/* Interactive Testing Modal */}
      {activeTestingModal && (
        <StudentTestModal
          classroom={activeTestingModal.classroom}
          assignment={activeTestingModal.assignment}
          onClose={() => setActiveTestingModal(null)}
        />
      )}
    </div>
  );
};
