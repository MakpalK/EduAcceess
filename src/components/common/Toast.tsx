import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/95 dark:bg-slate-900',
    error: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/95 dark:bg-slate-900',
    info: 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/95 dark:bg-slate-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 max-w-md">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 flex-1 leading-snug">
          {toast.text}
        </div>
      </div>
    </div>
  );
};
