import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-5 px-6 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">EduAccess</span>
          <span>•</span>
          <span>Нұсқасы 2.4.0 (KZ 2026)</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            ҚР Критериалды бағалау стандарты
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>БЖБ және ТЖБ электронды құрастырушысы</span>
          <span>•</span>
          <span>Барлық құқықтар қорғалған</span>
        </div>
      </div>
    </footer>
  );
};
