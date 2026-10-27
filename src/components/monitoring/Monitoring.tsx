import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Users,
  TrendingUp,
  Award,
  Download,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentResult } from '../../types';
import { KAZAKH_SUBJECTS, TERMS } from '../../data/mockData';

export const Monitoring: React.FC = () => {
  const {
    studentResults,
    addStudentResult,
    deleteStudentResult,
    assessments,
    selectedSubject: teacherSubject,
    showToast,
  } = useApp();

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('Барлығы');
  const [selectedSubject, setSelectedSubject] = useState<string>('Барлығы');
  const [selectedLevel, setSelectedLevel] = useState<string>('Барлығы');

  // Modal for adding student score
  const [isAddingResult, setIsAddingResult] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newClassName, setNewClassName] = useState('8 "А"');
  const [newSubject, setNewSubject] = useState(teacherSubject || 'Физика');
  const [newScore, setNewScore] = useState<number>(6);
  const [newMaxScore, setNewMaxScore] = useState<number>(7);
  const [newFeedback, setNewFeedback] = useState('Жақсы орындалған, есептеулер дәл жүргізілген.');

  // Classes list from results
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    studentResults.forEach((r) => set.add(r.className));
    return Array.from(set);
  }, [studentResults]);

  // Filtered student results
  const filteredResults = useMemo(() => {
    return studentResults.filter((r) => {
      if (selectedClass !== 'Барлығы' && r.className !== selectedClass) return false;
      if (selectedSubject !== 'Барлығы' && r.subject !== selectedSubject) return false;
      if (selectedLevel !== 'Барлығы' && r.level !== selectedLevel) return false;
      return true;
    });
  }, [studentResults, selectedClass, selectedSubject, selectedLevel]);

  // Statistical calculations
  const totalCount = filteredResults.length;
  const avgPercent =
    totalCount > 0
      ? Math.round(
          filteredResults.reduce((sum, r) => sum + r.percentage, 0) / totalCount
        )
      : 0;

  const highCount = filteredResults.filter((r) => r.level === 'Жоғары').length;
  const mediumCount = filteredResults.filter((r) => r.level === 'Орта').length;
  const lowCount = filteredResults.filter((r) => r.level === 'Төмен').length;

  const qualityRate = totalCount > 0 ? Math.round((highCount / totalCount) * 100) : 0;
  const progressRate = totalCount > 0 ? Math.round(((highCount + mediumCount) / totalCount) * 100) : 0;

  // Real CSV export
  const handleExportCSV = () => {
    if (filteredResults.length === 0) {
      showToast('Экспорттау үшін мәліметтер жоқ', 'error');
      return;
    }

    const headers = [
      'Оқушының аты-жөні',
      'Сыныбы',
      'Пән',
      'Жинаған балы',
      'Максималды балл',
      'Пайыздық көрсеткіш (%)',
      'Деңгей',
      'Мұғалімнің ұсынысы',
      'Күні',
    ];

    const rows = filteredResults.map((r) => [
      `"${r.studentName}"`,
      `"${r.className}"`,
      `"${r.subject}"`,
      r.score,
      r.maxScore,
      `${r.percentage}%`,
      `"${r.level}"`,
      `"${r.teacherFeedback.replace(/"/g, '""')}"`,
      `"${new Date(r.recordedAt).toLocaleDateString('kk-KZ')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EduAccess_Мониторинг_${selectedClass}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Мониторинг есебі CSV форматында сәтті жүктелді', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNewResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const percentage = Math.round((newScore / newMaxScore) * 100);
    const level = percentage >= 85 ? 'Жоғары' : percentage >= 40 ? 'Орта' : 'Төмен';

    const result: StudentResult = {
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      assessmentId: 'ass_manual',
      assessmentTitle: `${newSubject} жиынтық бағалау`,
      subject: newSubject,
      grade: 8,
      className: newClassName,
      studentName: newStudentName.trim(),
      score: Number(newScore),
      maxScore: Number(newMaxScore),
      percentage,
      level,
      objectiveResults: [
        { objective: 'Негізгі мақсат', achieved: percentage >= 40 },
      ],
      teacherFeedback: newFeedback.trim() || 'Жақсы нәтиже.',
      recordedAt: new Date().toISOString(),
    };

    addStudentResult(result);
    setIsAddingResult(false);
    setNewStudentName('');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Оқу жетістіктерінің мониторингі
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Сыныптар бойынша БЖБ/ТЖБ нәтижелері, оқу мақсаттары және сапа талдауы
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            title="CSV форматында Excel-ге экспорттау"
          >
            <Download className="w-4 h-4" />
            <span>CSV экспорт</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Басып шығару</span>
          </button>

          <button
            onClick={() => setIsAddingResult(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Нәтиже енгізу</span>
          </button>
        </div>
      </div>

      {/* Demo Data Disclaimer Badge */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            <strong>Ескертпе:</strong> Мониторинг кестесінде көрсетілген деректер
            жүйені сынақтан өткізуге арналған үлгілік нәтижелер болып табылады.
            «Нәтиже енгізу» арқылы нақты сынып деректерін енгізе аласыз.
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Сынып:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="Барлығы">Барлық сыныптар</option>
            {availableClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="8 &quot;Б&quot;">8 &quot;Б&quot;</option>
            <option value="9 &quot;А&quot;">9 &quot;А&quot;</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Пән:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
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
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Жетістік деңгейі:
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="Барлығы">Барлық деңгейлер</option>
            <option value="Жоғары">Жоғары (85–100%)</option>
            <option value="Орта">Орта (40–84%)</option>
            <option value="Төмен">Төмен (0–39%)</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Оқушылар саны</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalCount} оқушы
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Тізімдегі барлық жазбалар</div>
        </div>

        {/* Average Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Орташа көрсеткіш</span>
            <BarChart3 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {avgPercent}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Сынып бойынша орташа балл</div>
        </div>

        {/* Quality % */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Білім сапасы</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {qualityRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {highCount} оқушы жоғары деңгейде
          </div>
        </div>

        {/* Progress % */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Үлгерім деңгейі</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {progressRate}%
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {lowCount} оқушы төмен деңгейде
          </div>
        </div>
      </div>

      {/* Learning Objectives Performance Bars */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Оқу мақсаттары бойынша меңгеру деңгейі</span>
          <span className="text-xs font-normal text-slate-500">ҚР білім стандарты</span>
        </h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                8.3.2.1 - Меншікті жылусыйымдылық формуласын қолдану
              </span>
              <span className="font-bold text-indigo-600">67% (4/6 меңгерді)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '67%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                8.3.1.2 - Жылу берілу түрлерін (жылуөткізгіштік, конвекция) салыстыру
              </span>
              <span className="font-bold text-emerald-600">83% (5/6 меңгерді)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '83%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Student Results Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Оқушылардың жеке бағалау ведомосі
          </h3>
          <span className="text-xs text-slate-500">{filteredResults.length} нәтиже</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Оқушының аты-жөні</th>
                <th className="p-3.5">Сыныбы</th>
                <th className="p-3.5">Пән</th>
                <th className="p-3.5 text-center">Балл</th>
                <th className="p-3.5 text-center">Пайыз (%)</th>
                <th className="p-3.5">Деңгейі</th>
                <th className="p-3.5">Мұғалімнің кері байланысы</th>
                <th className="p-3.5 text-right">Әрекет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredResults.map((result) => (
                <tr
                  key={result.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {result.studentName}
                  </td>
                  <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">
                    {result.className}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {result.subject}
                  </td>
                  <td className="p-3.5 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {result.score} / {result.maxScore}
                  </td>
                  <td className="p-3.5 text-center font-bold whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full ${
                        result.percentage >= 85
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : result.percentage >= 40
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {result.percentage}%
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        result.level === 'Жоғары'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                          : result.level === 'Орта'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {result.level}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {result.teacherFeedback}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => deleteStudentResult(result.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                      title="Өшіру"
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

      {/* Add Student Result Modal */}
      {isAddingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Оқушы нәтижесін енгізу
              </h3>
              <button
                onClick={() => setIsAddingResult(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewResult} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Оқушының толық аты-жөні
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Мысалы: Сапарбаев Айдос"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Сыныбы
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="8 &quot;А&quot;"
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
                    Жиналған балл
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={newMaxScore}
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Максималды балл
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Мұғалімнің ұсынысы / Кері байланыс
                </label>
                <textarea
                  rows={3}
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  placeholder="Оқушының күшті тұстары мен толықтыруды қажет ететін сәттері..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingResult(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                >
                  Сақтау
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
