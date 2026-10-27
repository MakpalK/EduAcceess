import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  Send,
  User,
  BookOpen,
} from 'lucide-react';
import { AssignedAssessment, Classroom, Assessment, StudentResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { TASK_TYPE_LABELS } from '../../data/mockData';

interface StudentTestModalProps {
  classroom: Classroom;
  assignment: AssignedAssessment;
  onClose: () => void;
}

export const StudentTestModal: React.FC<StudentTestModalProps> = ({
  classroom,
  assignment,
  onClose,
}) => {
  const { assessments, addStudentResult, showToast } = useApp();

  // Find full assessment details
  const fullAssessment = assessments.find((a) => a.id === assignment.assessmentId);

  // Student identification state
  const [studentName, setStudentName] = useState(
    classroom.students[0]?.name || 'Әлиханұлы Нұрболат'
  );
  const [isTestStarted, setIsTestStarted] = useState(false);

  // Time tracking
  const [secondsLeft, setSecondsLeft] = useState((assignment.durationMinutes || 20) * 60);

  // Answers store (key = task.id, val = answer string or selected option)
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number>(0);
  const [submittedPercent, setSubmittedPercent] = useState<number>(0);

  useEffect(() => {
    if (!isTestStarted || isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTestStarted, isSubmitted]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (taskId: string, option: string) => {
    setAnswers({ ...answers, [taskId]: option });
  };

  const handleTextAnswer = (taskId: string, text: string) => {
    setAnswers({ ...answers, [taskId]: text });
  };

  const handleSubmitTest = () => {
    if (!fullAssessment) return;

    let totalEarned = 0;
    const totalMax = fullAssessment.tasks.reduce((sum, t) => sum + (t.points || 0), 0) || 1;

    // Evaluate answers
    fullAssessment.tasks.forEach((t) => {
      const studentAns = answers[t.id];
      if (!studentAns) return;

      if (['single-choice', 'true/false'].includes(t.type)) {
        // Compare option letter or start of string
        const cleanStudent = String(studentAns).trim().toLowerCase();
        const cleanCorrect = String(t.answerKey).trim().toLowerCase();
        if (
          cleanStudent.startsWith(cleanCorrect.slice(0, 2)) ||
          cleanCorrect.includes(cleanStudent) ||
          cleanStudent === cleanCorrect
        ) {
          totalEarned += t.points;
        }
      } else if (studentAns && String(studentAns).trim().length > 0) {
        // Award points for open answers / calculations
        totalEarned += t.points;
      }
    });

    const percent = Math.min(100, Math.round((totalEarned / totalMax) * 100));
    const level = percent >= 85 ? 'Жоғары' : percent >= 40 ? 'Орта' : 'Төмен';

    setSubmittedScore(totalEarned);
    setSubmittedPercent(percent);
    setIsSubmitted(true);

    // Save into central monitoring
    const result: StudentResult = {
      id: `res_stu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      assessmentId: assignment.assessmentId,
      assessmentTitle: assignment.assessmentTitle,
      subject: assignment.subject,
      grade: assignment.grade,
      className: classroom.name,
      studentName: studentName.trim(),
      score: totalEarned,
      maxScore: totalMax,
      percentage: percent,
      level,
      objectiveResults: fullAssessment.tasks.map((t) => ({
        objective: t.learningObjective || 'Оқу мақсаты',
        achieved: percent >= 50,
      })),
      teacherFeedback:
        percent >= 85
          ? 'Тамаша нәтиже! Барлық дескрипторларды толық орындап шықтың.'
          : percent >= 50
          ? 'Жақсы орындалған, қате жіберілген тұстарды пысықтау қажет.'
          : 'Тақырып бойынша қосымша консультация алу ұсынылады.',
      recordedAt: new Date().toISOString(),
    };

    addStudentResult(result);
    assignment.submissionsCount += 1;
    showToast(`${studentName} оқушысының жұмысы қабылданды: ${totalEarned}/${totalMax} балл`, 'success');
  };

  const tasksCount = fullAssessment?.tasks.length || 0;
  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== undefined && answers[k] !== '').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {assignment.assessmentTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {classroom.name} • {assignment.subject} • Оқушы режимі
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isTestStarted && !isSubmitted && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-xs ${
                  secondsLeft <= 180
                    ? 'bg-rose-100 text-rose-700 animate-pulse'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(secondsLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Step 1: Student Welcome / Selection */}
          {!isTestStarted && (
            <div className="max-w-md mx-auto text-center space-y-5 py-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Тапсырманы орындауды бастау
                </h4>
                <p className="text-xs text-slate-500">
                  Аты-жөніңізді таңдаңыз немесе жазыңыз. «Бастау» түймесін басқаннан кейін таймер қосылады.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Оқушының аты-жөні:
                </label>
                {classroom.students.length > 0 ? (
                  <select
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                  >
                    {classroom.students.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Аты-жөніңізді жазыңыз..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                    required
                  />
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 text-left space-y-1">
                <div>⏱ Уақыт шегі: <strong>{assignment.durationMinutes} минут</strong></div>
                <div>📝 Тапсырма саны: <strong>{tasksCount} тапсырма</strong></div>
                <div>🎯 Максималды балл: <strong>{assignment.totalPoints} балл</strong></div>
              </div>

              <button
                onClick={() => setIsTestStarted(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-600/30 transition-all"
              >
                Тапсырманы бастау
              </button>
            </div>
          )}

          {/* Step 2: Interactive Test Taking */}
          {isTestStarted && !isSubmitted && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>
                  Орындалуы: <strong>{answeredCount} / {tasksCount}</strong> тапсырма
                </span>
                <span>{Math.round((answeredCount / (tasksCount || 1)) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${(answeredCount / (tasksCount || 1)) * 100}%` }}
                />
              </div>

              {/* Tasks Render */}
              <div className="space-y-6 pt-2">
                {fullAssessment?.tasks.map((task, idx) => (
                  <div
                    key={task.id || idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {task.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">
                          {TASK_TYPE_LABELS[task.type] || task.type}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600">
                        [{task.points} балл]
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line pl-8">
                      {task.question}
                    </p>

                    {/* Options (for single-choice / multiple-choice) */}
                    {task.options && task.options.length > 0 && (
                      <div className="pl-8 space-y-2">
                        {task.options.map((opt, oIdx) => {
                          const isSelected = answers[task.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleSelectOption(task.id, opt)}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500'
                                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                  isSelected
                                    ? 'border-indigo-600 bg-indigo-600 text-white text-[10px]'
                                    : 'border-slate-400'
                                }`}
                              >
                                {isSelected ? '✓' : ''}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Matching pairs */}
                    {task.matchingPairs && task.matchingPairs.length > 0 && (
                      <div className="pl-8 space-y-2 text-xs">
                        {task.matchingPairs.map((pair, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between gap-3"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {pair.left}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="text-slate-600 dark:text-slate-400">{pair.right}</span>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder="Сәйкестік жауабыңызды жазыңыз (мысалы: 1-A, 2-B, 3-C)..."
                          value={answers[task.id] || ''}
                          onChange={(e) => handleTextAnswer(task.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none mt-2"
                        />
                      </div>
                    )}

                    {/* Free text / calculation / short answer / code */}
                    {['calculation', 'open-ended response', 'short answer', 'fill-in-the-blank', 'practical coding task'].includes(
                      task.type
                    ) && (
                      <div className="pl-8 space-y-1.5">
                        <textarea
                          rows={3}
                          placeholder="Жауабыңызды немесе шешу қадамдарыңызды жазыңыз..."
                          value={answers[task.id] || ''}
                          onChange={(e) => handleTextAnswer(task.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmitTest}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Тапсырманы аяқтау және жіберу</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Submitted Results Celebration & Review */}
          {isSubmitted && (
            <div className="max-w-md mx-auto text-center space-y-6 py-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Тапсырма сәтті аяқталды!
                </h4>
                <p className="text-xs text-slate-500">
                  {studentName} оқушысының нәтижесі қабылданды және ведомостьқа тіркелді.
                </p>
              </div>

              {/* Score Display Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Жинаған балы:</span>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {submittedScore} / {assignment.totalPoints} балл
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Пайыздық үлесі:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {submittedPercent}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Оқу жетістігінің деңгейі:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                      submittedPercent >= 85
                        ? 'bg-emerald-100 text-emerald-800'
                        : submittedPercent >= 40
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {submittedPercent >= 85
                      ? 'Жоғары (85–100%)'
                      : submittedPercent >= 40
                      ? 'Орта (40–84%)'
                      : 'Төмен (0–39%)'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors"
              >
                Жабу және сыныпқа оралу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
