import React, { useState } from 'react';
import { X, Plus, Trash2, Check, Award, HelpCircle } from 'lucide-react';
import { Task, TaskType, DifficultyLevel, ThinkingSkillLevel } from '../../types';
import { TASK_TYPE_LABELS } from '../../data/mockData';

interface TaskEditModalProps {
  task?: Task;
  onSave: (task: Task) => void;
  onClose: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  onSave,
  onClose,
}) => {
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || 'Жаңа тапсырма');
  const [type, setType] = useState<TaskType>(task?.type || 'single-choice');
  const [question, setQuestion] = useState(task?.question || '');
  const [options, setOptions] = useState<string[]>(
    task?.options || ['A) ', 'B) ', 'C) ', 'D) ']
  );
  const [matchingPairs, setMatchingPairs] = useState<{ left: string; right: string }[]>(
    task?.matchingPairs || [
      { left: '1. ', right: 'A. ' },
      { left: '2. ', right: 'B. ' },
    ]
  );
  const [codeSnippet, setCodeSnippet] = useState(task?.codeSnippet || '');
  const [points, setPoints] = useState<number>(task?.points || 2);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(task?.difficulty || 'Орташа');
  const [thinkingSkill, setThinkingSkill] = useState<ThinkingSkillLevel>(
    task?.thinkingSkill || 'Қолдану'
  );
  const [learningObjective, setLearningObjective] = useState(task?.learningObjective || '');
  const [criteria, setCriteria] = useState(task?.criteria || '');
  const [descriptors, setDescriptors] = useState<string[]>(
    task?.descriptors || ['Тапсырма шартын дұрыс талдайды (1 балл)', 'Дұрыс шешімді табады (1 балл)']
  );
  const [answerKey, setAnswerKey] = useState(task?.answerKey || '');
  const [explanation, setExplanation] = useState(task?.explanation || '');

  // Options handlers
  const handleAddOption = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const nextLetter = letters[options.length] || `${options.length + 1}`;
    setOptions([...options, `${nextLetter}) `]);
  };

  const handleUpdateOption = (index: number, val: string) => {
    const copy = [...options];
    copy[index] = val;
    setOptions(copy);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  // Matching pair handlers
  const handleAddMatchingPair = () => {
    const num = matchingPairs.length + 1;
    const letter = String.fromCharCode(65 + matchingPairs.length);
    setMatchingPairs([...matchingPairs, { left: `${num}. `, right: `${letter}. ` }]);
  };

  const handleUpdateMatchingPair = (index: number, side: 'left' | 'right', val: string) => {
    const copy = [...matchingPairs];
    copy[index] = { ...copy[index], [side]: val };
    setMatchingPairs(copy);
  };

  const handleRemoveMatchingPair = (index: number) => {
    setMatchingPairs(matchingPairs.filter((_, i) => i !== index));
  };

  // Descriptors handlers
  const handleAddDescriptor = () => {
    setDescriptors([...descriptors, 'Қосымша қадамды дұрыс орындайды (1 балл)']);
  };

  const handleUpdateDescriptor = (index: number, val: string) => {
    const copy = [...descriptors];
    copy[index] = val;
    setDescriptors(copy);
  };

  const handleRemoveDescriptor = (index: number) => {
    setDescriptors(descriptors.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask: Task = {
      id: task?.id || `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim() || 'Тапсырма',
      type,
      question: question.trim(),
      options: ['single-choice', 'multiple-choice'].includes(type) ? options : undefined,
      matchingPairs: type === 'matching' ? matchingPairs : undefined,
      codeSnippet: type === 'practical coding task' ? codeSnippet : undefined,
      points: Number(points) || descriptors.length || 1,
      difficulty,
      thinkingSkill,
      learningObjective: learningObjective.trim(),
      criteria: criteria.trim() || 'Тапсырманы стандартқа сәйкес орындайды',
      descriptors: descriptors.length > 0 ? descriptors : ['Тапсырманы дұрыс орындайды (1 балл)'],
      answerKey: answerKey.trim(),
      explanation: explanation.trim(),
      lessonStage: task?.lessonStage,
      differentiation: task?.differentiation,
      teacherFeedbackSample: task?.teacherFeedbackSample,
      updatedAt: new Date().toISOString(),
      savedToBank: task?.savedToBank,
    };

    onSave(updatedTask);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {isEditing ? 'Тапсырманы өңдеу' : 'Жаңа тапсырма құру'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Тапсырма мазмұнын, дескрипторларды және бағалау кілтін реттеңіз
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Тапсырма атауы
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Мысалы: Тапсырма 1 (Теңдеу шешу)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Тапсырма түрі
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              >
                {Object.entries(TASK_TYPE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Тапсырма шарты / Мәтіні
            </label>
            <textarea
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Оқушыға арналған тапсырманың толық мәтінін жазыңыз..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* Conditional Options Editor (for single-choice / multiple-choice) */}
          {['single-choice', 'multiple-choice'].includes(type) && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Жауап нұсқалары (A, B, C, D...)
                </span>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Нұсқа қосу
                </button>
              </div>

              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleUpdateOption(idx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Pairs Editor */}
          {type === 'matching' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Сәйкестендіру жұптары
                </span>
                <button
                  type="button"
                  onClick={handleAddMatchingPair}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Жұп қосу
                </button>
              </div>

              <div className="space-y-2">
                {matchingPairs.map((pair, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Сол жақ бөлік"
                      value={pair.left}
                      onChange={(e) => handleUpdateMatchingPair(idx, 'left', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                    <span className="text-slate-400">↔</span>
                    <input
                      type="text"
                      placeholder="Оң жақ сәйкесі"
                      value={pair.right}
                      onChange={(e) => handleUpdateMatchingPair(idx, 'right', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                    {matchingPairs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMatchingPair(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coding snippet editor */}
          {type === 'practical coding task' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Бастапқы код (Python/C++/Pascal)
              </label>
              <textarea
                rows={4}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="def example():\n    pass"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-emerald-400 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          )}

          {/* Objective, Points, Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Оқу мақсаты (код)
              </label>
              <input
                type="text"
                value={learningObjective}
                onChange={(e) => setLearningObjective(e.target.value)}
                placeholder="Мысалы: 8.3.2.1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Балл саны
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Қиындық деңгейі
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
              >
                <option value="Базалық">Базалық</option>
                <option value="Орташа">Орташа</option>
                <option value="Жоғары">Жоғары</option>
              </select>
            </div>
          </div>

          {/* Criteria & Thinking Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Бағалау критерийі
              </label>
              <input
                type="text"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                placeholder="Оқушы нені орындай алатынын көрсетеді"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Ойлау дағдыларының деңгейі
              </label>
              <select
                value={thinkingSkill}
                onChange={(e) => setThinkingSkill(e.target.value as ThinkingSkillLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
              >
                <option value="Білу және түсіну">Білу және түсіну</option>
                <option value="Қолдану">Қолдану</option>
                <option value="Жоғары деңгей дағдылары">Жоғары деңгей дағдылары</option>
              </select>
            </div>
          </div>

          {/* Descriptors */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  Дескрипторлар (әр дескриптор 1 балл)
                </span>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/70">
                  ҚР критериалды бағалау стандартына сай қадамдық бағалау
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddDescriptor}
                className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Қосу
              </button>
            </div>

            <div className="space-y-2">
              {descriptors.map((desc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 w-5 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => handleUpdateDescriptor(idx, e.target.value)}
                    placeholder="Мысалы: Формуланы дұрыс жазады (1 балл)"
                    className="flex-1 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                  />
                  {descriptors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDescriptor(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Answer Key & Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Дұрыс жауап кілті
              </label>
              <input
                type="text"
                value={answerKey}
                onChange={(e) => setAnswerKey(e.target.value)}
                placeholder="Мысалы: A нұсқасы немесе 252 кДж"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-mono outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Шешу жолы / Түсіндірме
              </label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Қысқаша шешім немесе ескертпе"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Болдырмау
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-600/30 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Өзгерістерді сақтау' : 'Тапсырманы қосу'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
