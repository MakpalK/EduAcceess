import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  User,
  Award,
  Send,
  X,
  Eye,
  Filter,
  Check,
  MessageSquare,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentSubmission, Task } from '../../types';
import { TASK_TYPE_LABELS } from '../../data/mockData';

export const TeacherGradingView: React.FC = () => {
  const { submissions, classrooms, assessments, gradeAndSendResultToStudent, showToast } =
    useApp();

  const [filterClass, setFilterClass] = useState<string>('Барлығы');
  const [filterStatus, setFilterStatus] = useState<string>('Барлығы');
  const [gradingSubmission, setGradingSubmission] = useState<StudentSubmission | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterClass !== 'Барлығы' && sub.className !== filterClass) return false;
    if (filterStatus === 'pending' && sub.status === 'Тексерілді') return false;
    if (filterStatus === 'graded' && sub.status !== 'Тексерілді') return false;
    return true;
  });

  const pendingCount = submissions.filter((s) => s.status !== 'Тексерілді').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Оқушылар жұмысын тексеру
              </h2>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                  {pendingCount} жұмыс күтілуде
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Оқушылар тапсырған жұмыстарды дескриптор бойынша бағалап, кері байланыспен қайтару
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="Барлығы">Барлық сыныптар</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.subject})
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="Барлығы">Барлық күйлер</option>
            <option value="pending">Тексеруді қажет етеді</option>
            <option value="graded">Тексерілгендер</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Тексеруге түскен жұмыстар жоқ
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Оқушылар өз кабинетінен тапсырмаларды орындап жіберген кезде, олар осы тізімде пайда болады.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((sub) => {
            const isGraded = sub.status === 'Тексерілді';

            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {sub.studentName}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sub.className}
                    </span>
                    <span className="text-xs text-slate-500">• {sub.subject}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isGraded
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {isGraded ? 'Тексерілді (Оқушыға жіберілді)' : 'Тексеруді қажет етеді'}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Тапсырма: <strong>{sub.assessmentTitle}</strong>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      Тапсырылған уақыты: {new Date(sub.submittedAt).toLocaleDateString('kk-KZ')},{' '}
                      {new Date(sub.submittedAt).toLocaleTimeString('kk-KZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isGraded && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-emerald-600">
                          Қойылған балл: {sub.totalScore} / {sub.maxScore} ({sub.percentage}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setGradingSubmission(sub)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                      isGraded
                        ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>{isGraded ? 'Нәтижені қарау / Түзету' : 'Жұмысты тексеру'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Grading Modal */}
      {gradingSubmission && (
        <GradeSubmissionModal
          submission={gradingSubmission}
          assessment={assessments.find((a) => a.id === gradingSubmission.assessmentId)}
          onClose={() => setGradingSubmission(null)}
          onComplete={(scores, descriptors, feedback) => {
            gradeAndSendResultToStudent(
              gradingSubmission.id,
              scores,
              descriptors,
              feedback
            );
            setGradingSubmission(null);
          }}
        />
      )}
    </div>
  );
};

// Modal for teacher to grade the student's submission item-by-item
interface GradeSubmissionModalProps {
  submission: StudentSubmission;
  assessment?: any;
  onClose: () => void;
  onComplete: (
    scores: Record<string, number>,
    descriptors: Record<string, boolean[]>,
    feedback: string
  ) => void;
}

const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({
  submission,
  assessment,
  onClose,
  onComplete,
}) => {
  // Map tasks from assessment
  const tasks: Task[] = assessment?.tasks || [];

  // Local state of awarded points per task
  const [taskScores, setTaskScores] = useState<Record<string, number>>(() => {
    if (submission.taskScores && Object.keys(submission.taskScores).length > 0) {
      return { ...submission.taskScores };
    }
    const initial: Record<string, number> = {};
    tasks.forEach((t) => {
      initial[t.id] = t.points || 1;
    });
    return initial;
  });

  // Local state of descriptor checks
  const [descriptorChecks, setDescriptorChecks] = useState<Record<string, boolean[]>>(() => {
    if (submission.taskDescriptorsAchieved) {
      return { ...submission.taskDescriptorsAchieved };
    }
    const initial: Record<string, boolean[]> = {};
    tasks.forEach((t) => {
      initial[t.id] = (t.descriptors || []).map(() => true);
    });
    return initial;
  });

  const [feedback, setFeedback] = useState(
    submission.teacherFeedback ||
      'Жарайсың! Тапсырмаларды мұқият орындап, жақсы нәтиже көрсеттің.'
  );

  const handleToggleDescriptor = (taskId: string, dIdx: number, taskMax: number) => {
    const current = descriptorChecks[taskId] || [];
    const updated = [...current];
    updated[dIdx] = !updated[dIdx];

    const copy = { ...descriptorChecks, [taskId]: updated };
    setDescriptorChecks(copy);

    // Calculate score based on achieved descriptors (1 point per descriptor)
    const earned = updated.filter(Boolean).length;
    setTaskScores({ ...taskScores, [taskId]: Math.min(taskMax, earned) });
  };

  const currentTotal = Object.values(taskScores).reduce((a, b) => a + (Number(b) || 0), 0);
  const maxTotal = tasks.reduce((sum, t) => sum + (t.points || 0), 0) || submission.maxScore || 1;
  const currentPercentage = Math.round((currentTotal / maxTotal) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Оқушы жұмысын бағалау ведомосі
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {submission.studentName} • {submission.className} • {submission.assessmentTitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              Жалпы: {currentTotal} / {maxTotal} балл ({currentPercentage}%)
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Tasks */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {tasks.map((task, idx) => {
            const studentAns = submission.answers[task.id];
            const taskEarned = taskScores[task.id] ?? 0;
            const descArray = descriptorChecks[task.id] || [];

            return (
              <div
                key={task.id || idx}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                {/* Task Top info */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs">
                      №{idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {task.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {TASK_TYPE_LABELS[task.type] || task.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Балл:</span>
                    <input
                      type="number"
                      min={0}
                      max={task.points}
                      value={taskEarned}
                      onChange={(e) =>
                        setTaskScores({
                          ...taskScores,
                          [task.id]: Math.min(task.points, Number(e.target.value)),
                        })
                      }
                      className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center font-bold text-xs outline-none"
                    />
                    <span className="text-xs text-slate-400">/ {task.points}</span>
                  </div>
                </div>

                {/* Question */}
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-8 leading-relaxed font-medium">
                  {task.question}
                </p>

                {/* Student's Answer */}
                <div className="pl-8 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Оқушының берген жауабы:</span>
                  </div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white whitespace-pre-line">
                    {studentAns ? String(studentAns) : 'Жауап берілмеген'}
                  </div>
                </div>

                {/* Model Answer Key */}
                <div className="pl-8 text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-bold text-emerald-600">Дұрыс кілт:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {task.answerKey}
                  </span>
                </div>

                {/* Descriptors Checkbox Grading */}
                {task.descriptors && task.descriptors.length > 0 && (
                  <div className="pl-8 pt-2 space-y-1.5">
                    <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Дескрипторларды орындалуы (әрқайсысы 1 балл):</span>
                    </div>

                    <div className="space-y-1">
                      {task.descriptors.map((desc, dIdx) => {
                        const isAchieved = descArray[dIdx] ?? true;
                        return (
                          <label
                            key={dIdx}
                            className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={isAchieved}
                              onChange={() => handleToggleDescriptor(task.id, dIdx, task.points)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            />
                            <span
                              className={
                                isAchieved
                                  ? 'text-slate-900 dark:text-white font-medium'
                                  : 'text-slate-400 line-through'
                              }
                            >
                              {desc}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Teacher Overall Qualitative Feedback */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2 text-xs">
            <label className="block text-xs font-bold text-indigo-950 dark:text-indigo-200">
              Мұғалімнің оқушыға арналған кері байланысы мен ұсыныстары:
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Оқушының жұмысына мадақтау, қателіктерді түзету жолдары..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <div className="text-xs text-slate-500">
            Оқушыға нәтижесі бірден оның жеке кабинетінде қолжетімді болады
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold"
            >
              Болдырмау
            </button>

            <button
              type="button"
              onClick={() => onComplete(taskScores, descriptorChecks, feedback)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Тексеруді аяқтау және нәтижені оқушыға жіберу</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
