import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Sparkles,
  Database,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  BookOpen,
  HelpCircle,
  RefreshCw,
  FolderKanban,
  ClipboardCheck,
  FileUp,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrintPreviewModal } from '../common/PrintPreviewModal';
import { Assessment } from '../../types';

export const Dashboard: React.FC = () => {
  const {
    assessments,
    questionBank,
    studentResults,
    classrooms,
    submissions,
    teacherProfile,
    selectedSubject,
    setIsSubjectModalOpen,
    setCurrentPage,
    createNewAssessment,
    openAssessmentInBuilder,
    loadDemoData,
    serverStatus,
  } = useApp();

  const [previewAssessment, setPreviewAssessment] = useState<Assessment | null>(null);

  // Statistics calculation
  const totalAssessments = assessments.length;
  const totalBankTasks = questionBank.length;
  const totalStudents = studentResults.length;

  const averageScorePercent =
    studentResults.length > 0
      ? Math.round(
          studentResults.reduce((acc, curr) => acc + curr.percentage, 0) /
            studentResults.length
        )
      : 0;

  const qualityRate =
    studentResults.length > 0
      ? Math.round(
          (studentResults.filter((r) => r.level === 'Жоғары').length /
            studentResults.length) *
            100
        )
      : 0;

  // Recent 5 assessments
  const recentAssessments = assessments.slice(0, 5);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>2026–2027 оқу жылы • 2-тоқсан</span>
              </div>
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/40 hover:bg-indigo-600/70 border border-indigo-400/30 text-indigo-200 hover:text-white text-xs font-semibold backdrop-blur-sm transition-all"
                title="Негізгі оқыту пәнін таңдау"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Пән: {selectedSubject}</span>
                <span className="text-[10px] text-indigo-300 underline">Өзгерту</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Қош келдіңіз, {teacherProfile.name}!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              EduAccess — Қазақстан мұғалімдеріне арналған критериалды бағалаудың
              цифрлық көмекшісі. БЖБ/ТЖБ спецификациясын құрастырыңыз, ЖИ
              арқылы дескрипторларды автоматтандырыңыз.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => createNewAssessment('ҚБ')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/20 transition-all hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4" />
              <span>ҚБ құрастыру (Сабаққа)</span>
            </button>

            <button
              onClick={() => createNewAssessment('БЖБ')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>БЖБ құрастыру</span>
            </button>

            <button
              onClick={() => createNewAssessment('ТЖБ')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 shadow-md transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>ТЖБ құрастыру</span>
            </button>

            <button
              onClick={() => setCurrentPage('classrooms')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 shadow-md transition-all hover:scale-[1.02]"
            >
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <span>Сыныптар ({classrooms.length})</span>
            </button>

            <button
              onClick={() => setCurrentPage('grading')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/20 transition-all hover:scale-[1.02]"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Жұмыстарды тексеру</span>
              {submissions.filter((s) => s.status !== 'Тексерілді').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 text-[10px] font-extrabold">
                  {submissions.filter((s) => s.status !== 'Тексерілді').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentPage('ai-generator')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>ЖИ генераторы</span>
            </button>

            <button
              onClick={() => setCurrentPage('converter')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02]"
            >
              <FileUp className="w-4 h-4" />
              <span>Файл жүктеу (Word/PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Converter Featured Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <FileUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Дайын БЖБ немесе ТЖБ файлдарыңыз бар ма?
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                Жаңа мүмкіндік
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Word (.docx), PDF немесе скан-суретті жүктеңіз. ЖИ сұрақтарды оқып, дескрипторлары бар интерактивті бағалауға айналдырып береді.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentPage('converter')}
          className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
        >
          Файлды түрлендіру →
        </button>
      </div>

      {/* Pending review notification banner */}
      {submissions.filter((s) => s.status !== 'Тексерілді').length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Оқушылардан жаңадан тапсырылған жұмыстар бар ({submissions.filter((s) => s.status !== 'Тексерілді').length})
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                Оқушылар БЖБ/ТЖБ тапсырмаларын орындап жіберді. Дескриптор бойынша тексеріп, нәтиже мен кері байланысты қайтарыңыз.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('grading')}
            className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Тексеруге өту →
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Assessments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Барлық бағалаулар
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalAssessments}
            </span>
            <span className="text-xs font-medium text-slate-400">құжат</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">
              {assessments.filter((a) => a.type === 'БЖБ').length} БЖБ
            </span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">
              {assessments.filter((a) => a.type === 'ТЖБ').length} ТЖБ
            </span>
          </div>
        </div>

        {/* Bank Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Банктегі тапсырмалар
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalBankTasks}
            </span>
            <span className="text-xs font-medium text-slate-400">дескрипторлы</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>ҚР стандартымен бекітілген</span>
          </div>
        </div>

        {/* Students Monitored */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Бағаланған оқушылар
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalStudents}
            </span>
            <span className="text-xs font-medium text-slate-400">оқушы</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Орташа балл: <span className="font-semibold text-slate-800 dark:text-slate-200">{averageScorePercent}%</span>
          </div>
        </div>

        {/* Knowledge Quality % */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Білім сапасы көрсеткіші
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {qualityRate}%
            </span>
            <span className="text-xs font-medium text-slate-400">сапа</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Жоғары деңгей: <span className="font-semibold text-emerald-600">{qualityRate}%</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Assessments & Progress Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Assessments (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Соңғы құрастырылған жиынтық жұмыстар
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                БЖБ және ТЖБ материалдарының ағымдағы жағдайы
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('my-assessments')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Барлығын қарау ({assessments.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentAssessments.length === 0 ? (
            /* Empty State */
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Әзірге бағалау жұмыстары құрылмаған
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                БЖБ немесе ТЖБ құрастыруды бастаңыз, не болмаса үлгілік қазақстандық оқу деректерін жүктеңіз.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => createNewAssessment('БЖБ')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                >
                  БЖБ құру
                </button>
                <button
                  onClick={loadDemoData}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Үлгілерді жүктеу
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAssessments.map((ass) => (
                  <div
                    key={ass.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
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
                          {ass.subject} • {ass.grade}-сынып • {ass.term}-тоқсан
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            ass.status === 'Дайын'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                              : 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                          }`}
                        >
                          {ass.status}
                        </span>
                      </div>

                      <h4
                        onClick={() => openAssessmentInBuilder(ass)}
                        className="font-bold text-sm text-slate-900 dark:text-white truncate cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {ass.title}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{ass.tasks.length} тапсырма</span>
                        <span>•</span>
                        <span>
                          Жалпы балл:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {ass.tasks.reduce((sum, t) => sum + (t.points || 0), 0)} /{' '}
                            {ass.targetPoints}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>Уақыты: {ass.durationMinutes} мин</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <button
                        onClick={() => setPreviewAssessment(ass)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Баспаға қарау (Оқушы/Мұғалім)"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openAssessmentInBuilder(ass)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold text-xs transition-colors"
                      >
                        Өңдеу
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Learning Progress Analytics & Skills Breakdown (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Оқу дағдыларының меңгерілуі
            </h3>
            <span className="text-xs text-slate-500">Блум таксономиясы</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Bloom taxonomy breakdown bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    1. Білу және түсіну (Теория)
                  </span>
                  <span className="font-bold text-emerald-600">88%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    2. Қолдану (Есептеу және тәжірибе)
                  </span>
                  <span className="font-bold text-indigo-600">76%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    3. Жоғары деңгей дағдылары (Талдау/Синтез)
                  </span>
                  <span className="font-bold text-purple-600">64%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '64%' }} />
                </div>
              </div>
            </div>

            {/* AI Advisor Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Әдістемелік ұсыныс:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                8-сыныптарда «Жоғары деңгей дағдылары» бойынша есептерді көбейтіп, ЖИ генераторында күрделілік деңгейін «Жоғары» деп таңдау ұсынылады.
              </p>
              <button
                onClick={() => setCurrentPage('ai-generator')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                ЖИ тапсырмасын құру →
              </button>
            </div>

            {/* Quick Demo Reset / Load helper if needed */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>ҚР Оқу-ағарту министрлігі үлгісі</span>
              <button
                onClick={loadDemoData}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Үлгілерді жаңарту</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {previewAssessment && (
        <PrintPreviewModal
          assessment={previewAssessment}
          onClose={() => setPreviewAssessment(null)}
        />
      )}
    </div>
  );
};
