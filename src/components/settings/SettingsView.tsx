import React, { useState } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  Sparkles,
  Database,
  Save,
  Download,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KAZAKH_SUBJECTS, GRADES } from '../../data/mockData';

export const SettingsView: React.FC = () => {
  const {
    teacherProfile,
    setTeacherProfile,
    serverStatus,
    refreshStatus,
    loadDemoData,
    clearAllData,
    assessments,
    questionBank,
    studentResults,
    selectedSubject,
    setSelectedSubject,
    setIsSubjectModalOpen,
    showToast,
  } = useApp();

  const [name, setName] = useState(teacherProfile.name);
  const [email, setEmail] = useState(teacherProfile.email);
  const [school, setSchool] = useState(teacherProfile.school);
  const [activeSubject, setActiveSubject] = useState(
    selectedSubject || teacherProfile.activeSubject || teacherProfile.subjects[0] || 'Физика'
  );
  const [subjects, setSubjects] = useState<string[]>(
    teacherProfile.subjects || ['Физика', 'Информатика']
  );
  const [grades, setGrades] = useState<number[]>(
    teacherProfile.grades || [7, 8, 9, 10]
  );
  const [defaultDurationBJB, setDefaultDurationBJB] = useState(
    teacherProfile.defaultDurationBJB
  );
  const [defaultDurationTZHB, setDefaultDurationTZHB] = useState(
    teacherProfile.defaultDurationTZHB
  );
  const [autoSave, setAutoSave] = useState(teacherProfile.autoSave);

  const toggleSubject = (s: string) => {
    if (subjects.includes(s)) {
      if (subjects.length > 1) {
        const next = subjects.filter((item) => item !== s);
        setSubjects(next);
        if (activeSubject === s) {
          setActiveSubject(next[0]);
        }
      } else {
        showToast('Кем дегенде 1 пән таңдалуы керек', 'error');
      }
    } else {
      setSubjects([...subjects, s]);
    }
  };

  const toggleGrade = (g: number) => {
    if (grades.includes(g)) {
      if (grades.length > 1) {
        setGrades(grades.filter((item) => item !== g));
      }
    } else {
      setGrades([...grades, g].sort((a, b) => a - b));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedSubject(activeSubject);
    setTeacherProfile({
      ...teacherProfile,
      name,
      email,
      school,
      subjects: subjects.includes(activeSubject) ? subjects : [activeSubject, ...subjects],
      activeSubject,
      grades,
      defaultDurationBJB,
      defaultDurationTZHB,
      autoSave,
    });
    showToast('Мұғалім деректері мен таңдалған пәні сақталды!', 'success');
  };

  const handleExportBackup = () => {
    const backupData = {
      version: 'EduAccess 2.4',
      exportDate: new Date().toISOString(),
      teacherProfile,
      assessments,
      questionBank,
      studentResults,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduAccess_Сақтық_көшірме_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast('Жүйе деректері JSON форматында сәтті экспортталды', 'success');
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Жүйелік баптаулар
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Мұғалім деректері, бағалау стандарттары және ЖИ қызметінің күйі
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Profile & Standards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Teacher Profile Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Мұғалімнің жеке мәліметтері</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Аты-жөні (Т.А.Ә.)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Электронды пошта
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Мектеп / Білім беру ұйымы
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              {/* Teacher Subjects & Grades Configuration */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Оқыту пәндері және негізгі пән
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Негізгі жұмыс пәніңізді таңдаңыз және оқытатын қосымша пәндерді белгілеңіз
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSubjectModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Пәндер каталогы →
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Негізгі жұмыс пәні (әдепкі бойынша қолданылады):
                    </label>
                    <select
                      value={activeSubject}
                      onChange={(e) => {
                        setActiveSubject(e.target.value);
                        if (!subjects.includes(e.target.value)) {
                          setSubjects([...subjects, e.target.value]);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 outline-none"
                    >
                      {KAZAKH_SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s} {subjects.includes(s) ? '✓ (Сіздің пәніңіз)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Сіз оқытатын барлық пәндер:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {KAZAKH_SUBJECTS.map((s) => {
                        const isTaught = subjects.includes(s);
                        const isPrimary = activeSubject === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSubject(s)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                              isPrimary
                                ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                                : isTaught
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            <span>{s}</span>
                            {isPrimary ? (
                              <span className="text-[10px] bg-white/20 px-1 rounded">Негізгі</span>
                            ) : isTaught ? (
                              <span>✓</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Оқытатын сыныптарыңыз:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {GRADES.map((g) => {
                        const isSelected = grades.includes(g);
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGrade(g)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {g}-сынып
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Standards */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-3">
                  Бағалау жұмыстарының әдепкі параметрлері:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                      БЖБ әдепкі уақыты (минут)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={45}
                      value={defaultDurationBJB}
                      onChange={(e) => setDefaultDurationBJB(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                      ТЖБ әдепкі уақыты (минут)
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={90}
                      value={defaultDurationTZHB}
                      onChange={(e) => setDefaultDurationTZHB(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Auto save checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autosave"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="autosave" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Өзгерістерді жергілікті жадқа автоматты түрде сақтау (Автосақтау)
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-600/30 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Профильді сақтау</span>
                </button>
              </div>
            </form>
          </div>

          {/* Regulatory Compliance Info */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ҚР Оқу-ағарту министрлігінің стандарты</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              EduAccess платформасы Қазақстан Республикасы Оқу-ағарту министрінің 2008 жылғы 18 наурыздағы № 125 бұйрығымен бекітілген Орта білім беру ұйымдарындағы білім алушылардың үлгеріміне ағымдағы бақылау жүргізу, аралық және қорытынды аттестаттаудан өткізу қағидаларына толық сәйкес келеді.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                • 1 баллдық дескрипторлар
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                • БЖБ/ТЖБ спецификациясы
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                • 40% және 85% жетістік шкаласы
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 col: AI Status & Data Management */}
        <div className="space-y-6">
          {/* AI Status Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>ЖИ интеграциясы</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Байланыс күйі:</span>
                <span
                  className={`font-bold flex items-center gap-1.5 ${
                    serverStatus.aiConfigured
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      serverStatus.aiConfigured
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-amber-500'
                    }`}
                  />
                  {serverStatus.aiConfigured ? 'Қосылған' : 'Кілт күтілуде'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Модель:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {serverStatus.model}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Қауіпсіздік:</span>
                <span className="text-emerald-600 font-semibold">Серверлік қорғаныс</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              API кілттері ешқашан браузерде ашық қалмайды, тек сенімді Node.js сервері арқылы орындалады.
            </p>

            <button
              onClick={refreshStatus}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Байланысты қайта тексеру</span>
            </button>
          </div>

          {/* Data Management Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Деректерді басқару</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Барлық деректерді экспорттау</span>
              </button>

              <button
                onClick={loadDemoData}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Үлгілік деректерді қалпына келтіру</span>
              </button>

              <button
                onClick={clearAllData}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-900 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Барлық деректерді тазарту</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
