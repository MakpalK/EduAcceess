import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  Layers,
  GraduationCap,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KAZAKH_SUBJECTS, SUBJECT_CATEGORIES, GRADES } from '../../data/mockData';

interface SubjectSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubjectSelectModal: React.FC<SubjectSelectModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedSubject,
    setSelectedSubject,
    teacherProfile,
    setTeacherProfile,
    showToast,
  } = useApp();

  const [activeSubjectChoice, setActiveSubjectChoice] = useState(
    selectedSubject || teacherProfile.activeSubject || teacherProfile.subjects[0] || 'Физика'
  );
  const [taughtSubjects, setTaughtSubjects] = useState<string[]>(
    teacherProfile.subjects && teacherProfile.subjects.length > 0
      ? teacherProfile.subjects
      : ['Физика', 'Информатика']
  );
  const [taughtGrades, setTaughtGrades] = useState<number[]>(
    teacherProfile.grades && teacherProfile.grades.length > 0
      ? teacherProfile.grades
      : [7, 8, 9, 10]
  );
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const toggleTaughtSubject = (subject: string) => {
    if (taughtSubjects.includes(subject)) {
      if (taughtSubjects.length > 1) {
        const next = taughtSubjects.filter((s) => s !== subject);
        setTaughtSubjects(next);
        if (activeSubjectChoice === subject) {
          setActiveSubjectChoice(next[0]);
        }
      } else {
        showToast('Кем дегенде бір пәнді таңдауыңыз қажет', 'error');
      }
    } else {
      setTaughtSubjects([...taughtSubjects, subject]);
    }
  };

  const toggleGrade = (grade: number) => {
    if (taughtGrades.includes(grade)) {
      if (taughtGrades.length > 1) {
        setTaughtGrades(taughtGrades.filter((g) => g !== grade));
      }
    } else {
      setTaughtGrades([...taughtGrades, grade].sort((a, b) => a - b));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedSubject(activeSubjectChoice);
    setTeacherProfile({
      ...teacherProfile,
      subjects: taughtSubjects.includes(activeSubjectChoice)
        ? taughtSubjects
        : [activeSubjectChoice, ...taughtSubjects],
      activeSubject: activeSubjectChoice,
      grades: taughtGrades,
    });
    showToast(`Негізгі пән «${activeSubjectChoice}» ретінде орнатылды!`, 'success');
    onClose();
  };

  const filteredCategories = SUBJECT_CATEGORIES.map((cat) => ({
    ...cat,
    subjects: cat.subjects.filter((s) =>
      s.toLowerCase().includes(searchFilter.trim().toLowerCase())
    ),
  })).filter((cat) => cat.subjects.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Мұғалімнің оқыту пәнін таңдау
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Негізгі жұмыс пәніңіз бен сыныптарыңызды көрсетіңіз
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Active Subject Selector */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Қазіргі белсенді негізгі пән:</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white shadow-xs">
                {activeSubjectChoice}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              БЖБ, ТЖБ құрастырғанда, ЖИ тапсырмаларын жасағанда осы пән автоматты түрде таңдалады.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Пән атын іздеу (мысалы: Физика, Алгебра, Химия...)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Subject Categories & Selection */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              1. Негізгі жұмыс пәніңізді таңдаңыз (бір пәнге басыңыз):
            </label>

            <div className="space-y-4">
              {filteredCategories.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {cat.category}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cat.subjects.map((sub) => {
                      const isActive = activeSubjectChoice === sub;
                      const isTaught = taughtSubjects.includes(sub);

                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setActiveSubjectChoice(sub);
                            if (!taughtSubjects.includes(sub)) {
                              setTaughtSubjects([...taughtSubjects, sub]);
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                              : isTaught
                              ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900 hover:border-indigo-400'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                          }`}
                        >
                          <span className="truncate mr-2">{sub}</span>
                          {isActive && <Check className="w-4 h-4 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multiple Subjects Taught Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                2. Сіз оқытатын барлық пәндер (бірнешеуін таңдауға болады):
              </label>
              <span className="text-[11px] text-slate-400">
                {taughtSubjects.length} пән таңдалды
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {KAZAKH_SUBJECTS.map((sub) => {
                const checked = taughtSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleTaughtSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      checked
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" />}
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grades Selection */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              3. Оқытатын сыныптарыңыз:
            </label>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => {
                const isSelected = taughtGrades.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGrade(g)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {g}-сынып
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Таңдалған негізгі пән: <strong className="text-indigo-600 dark:text-indigo-400">{activeSubjectChoice}</strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Болдырмау
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Пәнді сақтау</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
