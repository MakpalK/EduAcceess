import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  User,
  CheckCircle2,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  UserCheck,
  ClipboardCheck,
  BookOpen,
  ChevronDown,
  Check,
  Layers,
  FileUp,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentPage,
    searchQuery,
    setSearchQuery,
    darkMode,
    toggleDarkMode,
    teacherProfile,
    createNewAssessment,
    setCurrentPage,
    userRole,
    setUserRole,
    currentStudent,
    submissions,
    selectedSubject,
    setSelectedSubject,
    setIsSubjectModalOpen,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const subjectMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setShowCreateMenu(false);
      }
      if (subjectMenuRef.current && !subjectMenuRef.current.contains(e.target as Node)) {
        setShowSubjectMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageMeta = () => {
    if (userRole === 'student') {
      return {
        title: 'EduAccess • Оқушы порталы',
        subtitle: `${currentStudent?.name || 'Оқушы'} (${currentStudent?.className || 'Сынып'}) — Тапсырмаларды орындау және бағалау нәтижелері`,
      };
    }

    switch (currentPage) {
      case 'dashboard':
        return {
          title: 'Басты бет',
          subtitle: 'Мұғалімнің жұмыс кеңістігі және негізгі көрсеткіштер',
        };
      case 'converter':
        return {
          title: 'Құжатты түрлендіргіш (БЖБ/ТЖБ)',
          subtitle: 'Word (.docx), PDF және скан-суреттерді ҚР №125 стандарты бойынша интерактивті тапсырмаларға айналдыру',
        };
      case 'classrooms':
        return {
          title: 'Сыныптар мен бумалар',
          subtitle: 'Мұғалімнің оқу топтары, тапсырма бумалары және оқушыларға тарату',
        };
      case 'grading':
        return {
          title: 'Оқушылар жұмысын тексеру',
          subtitle: 'Оқушылар тапсырған БЖБ және ТЖБ жұмыстарын дескриптормен бағалау және нәтижесін жіберу',
        };
      case 'builder-qb':
        return {
          title: 'Қалыптастырушы бағалау (ҚБ)',
          subtitle: 'Күнделікті сабаққа арналған деңгейлік (А, В, С) тапсырмалар және шығу парағы (1–10 балл)',
        };
      case 'builder-bjb':
        return {
          title: 'БЖБ құрастыру',
          subtitle: 'Бөлім бойынша жиынтық бағалау құрастырушысы (дескрипторлар мен кілттер)',
        };
      case 'builder-tzhb':
        return {
          title: 'ТЖБ құрастыру',
          subtitle: 'Тоқсандық жиынтық бағалау спецификациясы және тапсырмалары',
        };
      case 'ai-generator':
        return {
          title: 'ЖИ тапсырма генераторы',
          subtitle: 'Оқу мақсаттарына негізделген жасанды интеллект көмекшісі',
        };
      case 'question-bank':
        return {
          title: 'Тапсырмалар банкі',
          subtitle: 'Дайын дескрипторлы оқу тапсырмаларының репозиторийі',
        };
      case 'monitoring':
        return {
          title: 'Мониторинг',
          subtitle: 'Сыныптар үлгерімі, оқу мақсаттарының орындалуы және білім сапасы',
        };
      case 'my-assessments':
        return {
          title: 'Менің жұмыстарым',
          subtitle: 'Сақталған БЖБ және ТЖБ құжаттарының мұрағаты',
        };
      case 'settings':
        return {
          title: 'Баптаулар',
          subtitle: 'Мұғалім профилі, жүйе стандарттары және ЖИ интеграциясы',
        };
      default:
        return { title: 'EduAccess', subtitle: 'Білім беру платформасы' };
    }
  };

  const { title, subtitle } = getPageMeta();

  const notifications = [
    {
      id: 'n1',
      title: '2-тоқсан БЖБ тапсыру кезеңі',
      desc: '8-сыныптар бойынша БЖБ нәтижелерін енгізуге 4 күн қалды.',
      time: '1 сағат бұрын',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Оқу мақсаты жаңартылды',
      desc: 'Физика 8.3.2.1 мақсатына жаңа 3 үлгілік дескриптор қосылды.',
      time: 'Кеше',
      unread: false,
    },
    {
      id: 'n3',
      title: 'Мониторинг талдауы дайын',
      desc: '8 "А" сыныбының сапа көрсеткіші 78%-ды құрады.',
      time: '2 күн бұрын',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Title & Subtitle */}
      <div className="flex flex-col min-w-0 mr-4">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
          {subtitle}
        </p>
      </div>

      {/* Center Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Пән, сынып, оқу мақсаты немесе тақырып бойынша іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Role Switcher */}
        <button
          onClick={() => {
            if (userRole === 'teacher') {
              setUserRole('student');
            } else {
              setUserRole('teacher');
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            userRole === 'student'
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
          }`}
          title={
            userRole === 'teacher'
              ? 'Оқушы порталына өту (Тест тапсыру және нәтижелер)'
              : 'Мұғалім кабинетіне оралу'
          }
        >
          {userRole === 'teacher' ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Оқушы режимі</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Мұғалім режимі</span>
            </>
          )}
        </button>

        {/* Teacher grading shortcut */}
        {userRole === 'teacher' && (
          <button
            onClick={() => setCurrentPage('grading')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              currentPage === 'grading'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Оқушылар тапсырған жұмыстарды тексеру"
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Тексеру</span>
            {submissions.filter((s) => s.status !== 'Тексерілді').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                {submissions.filter((s) => s.status !== 'Тексерілді').length}
              </span>
            )}
          </button>
        )}

        {/* Subject Picker dropdown */}
        {userRole === 'teacher' && (
          <div className="relative" ref={subjectMenuRef}>
            <button
              onClick={() => setShowSubjectMenu(!showSubjectMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors shadow-xs"
              title="Оқыту пәнін таңдау немесе ауыстыру"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none hidden sm:inline">
                  Пән
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[80px] sm:max-w-[120px] leading-tight">
                  {selectedSubject}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
            </button>

            {showSubjectMenu && (
              <div className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Менің пәндерім
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    {teacherProfile.subjects?.length || 1} пән
                  </span>
                </div>

                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {(teacherProfile.subjects && teacherProfile.subjects.length > 0
                    ? teacherProfile.subjects
                    : [selectedSubject]
                  ).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setSelectedSubject(sub);
                        setShowSubjectMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        selectedSubject === sub
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span>{sub}</span>
                      {selectedSubject === sub && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                <button
                  onClick={() => {
                    setShowSubjectMenu(false);
                    setIsSubjectModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Басқа пәнді таңдау / Баптау...</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Quick Action Dropdown */}
        <div className="relative" ref={createMenuRef}>
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Құрастыру</span>
          </button>

          {showCreateMenu && (
            <div className="absolute right-0 mt-2 w-60 p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  createNewAssessment('ҚБ');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-amber-900 dark:text-amber-300">Жаңа ҚБ құру</div>
                  <div className="text-[11px] text-slate-400">Күнделікті сабақ (1-10 балл)</div>
                </div>
              </button>

              <button
                onClick={() => {
                  createNewAssessment('БЖБ');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Жаңа БЖБ құру</div>
                  <div className="text-[11px] text-slate-400">Бөлім жиынтық бағалауы</div>
                </div>
              </button>

              <button
                onClick={() => {
                  createNewAssessment('ТЖБ');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Жаңа ТЖБ құру</div>
                  <div className="text-[11px] text-slate-400">Тоқсандық жиынтық бағалау</div>
                </div>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

              <button
                onClick={() => {
                  setCurrentPage('ai-generator');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">ЖИ генераторы</div>
                  <div className="text-[11px] text-indigo-500/80">Оқу мақсатымен құру</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentPage('converter');
                  setShowCreateMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300">
                  <FileUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Құжатты түрлендіру</div>
                  <div className="text-[11px] text-emerald-500/80">Word/PDF-тен импорттау</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Ашық тақырыпқа ауысу' : 'Күңгірт тақырыпқа ауысу'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 relative rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Хабарламалар"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Хабарламалар
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">
                  Оқылды деп белгілеу
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl transition-colors ${
                      n.unread
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Teacher Profile Chip */}
        <div
          onClick={() => setCurrentPage('settings')}
          className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-85 transition-opacity"
          title="Мұғалім профилі және баптаулар"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {teacherProfile.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
              {teacherProfile.name}
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[130px]">
              {selectedSubject} мұғалімі
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
