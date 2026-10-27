import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Database,
  BarChart3,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  FolderKanban,
  ClipboardCheck,
  FileUp,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationPage } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    assessments,
    questionBank,
    classrooms,
    submissions,
    userRole,
    setUserRole,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    serverStatus,
  } = useApp();

  const pendingCount = submissions.filter((s) => s.status !== 'Тексерілді').length;

  const navItems: {
    id: NavigationPage;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    highlight?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Басты бет',
      icon: LayoutDashboard,
    },
    {
      id: 'builder-qb',
      label: 'ҚБ құрастыру (Сабаққа)',
      icon: Compass,
      badge: '1–10 балл',
      highlight: true,
    },
    {
      id: 'builder-bjb',
      label: 'БЖБ құрастыру',
      icon: FileSpreadsheet,
    },
    {
      id: 'builder-tzhb',
      label: 'ТЖБ құрастыру',
      icon: FileText,
    },
    {
      id: 'converter',
      label: 'Құжатты түрлендіргіш',
      icon: FileUp,
      badge: 'Word/PDF',
    },
    {
      id: 'classrooms',
      label: 'Сыныптар мен бумалар',
      icon: FolderKanban,
      badge: classrooms.length,
    },
    {
      id: 'grading',
      label: 'Жұмыстарды тексеру',
      icon: ClipboardCheck,
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
      highlight: pendingCount > 0,
    },
    {
      id: 'ai-generator',
      label: 'ЖИ тапсырма генераторы',
      icon: Sparkles,
      highlight: true,
      badge: 'AI',
    },
    {
      id: 'question-bank',
      label: 'Тапсырмалар банкі',
      icon: Database,
      badge: questionBank.length,
    },
    {
      id: 'monitoring',
      label: 'Мониторинг',
      icon: BarChart3,
    },
    {
      id: 'my-assessments',
      label: 'Менің жұмыстарым',
      icon: FolderOpen,
      badge: assessments.length,
    },
    {
      id: 'settings',
      label: 'Баптаулар',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        <div
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                EduAccess
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  KZ
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Критериалды бағалау
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSidebarCollapsed ? 'Панельді жаю' : 'Панельді жию'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : item.highlight
                  ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? 'text-white'
                    : item.highlight
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              />

              {!isSidebarCollapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}

              {!isSidebarCollapsed && item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : item.highlight
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed state */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status / Regulatory Banner */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        {!isSidebarCollapsed ? (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ҚР 125-бұйрық стандарты</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>ЖИ жүйесі:</span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  serverStatus.aiConfigured
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    serverStatus.aiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {serverStatus.aiConfigured ? 'Gemini 3.8' : 'Кілт күтілуде'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Жүйе күйі: ҚР Стандарты">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
