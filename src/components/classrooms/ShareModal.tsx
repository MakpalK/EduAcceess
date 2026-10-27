import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  QrCode,
  ExternalLink,
  MessageCircle,
  Clock,
  Calendar,
  KeyRound,
  FileText,
} from 'lucide-react';
import { AssignedAssessment, Classroom } from '../../types';

interface ShareModalProps {
  classroom: Classroom;
  assignment: AssignedAssessment;
  onClose: () => void;
  onOpenStudentPreview: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  classroom,
  assignment,
  onClose,
  onOpenStudentPreview,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate accessible simulation URL
  const testUrl = `${window.location.origin}/?action=test&code=${assignment.accessCode}&class=${encodeURIComponent(
    classroom.name
  )}`;

  const shareText = `Сәлеметсіздер ме, құрметті ${classroom.name} сынып оқушылары!
${classroom.subject} пәнінен «${assignment.assessmentTitle}» (${assignment.type}) тапсырмасы тағайындалды.
⏱ Уақыты: ${assignment.durationMinutes} минут
🎯 Жалпы балл: ${assignment.totalPoints} балл
📅 Тапсыру мерзімі: ${new Date(assignment.deadline).toLocaleDateString('kk-KZ')}
🔑 Қатынас коды: ${assignment.accessCode}
🔗 Сілтеме арқылы орындау:
${testUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(assignment.accessCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Оқушыларға жіберу
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {classroom.name} • {classroom.subject}
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Assignment Summary Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                {assignment.assessmentTitle}
              </span>
              <span className="px-2 py-0.5 rounded-md font-bold uppercase text-[10px] bg-indigo-600 text-white">
                {assignment.type}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {assignment.durationMinutes} минут
              </span>
              <span>•</span>
              <span>Жалпы: {assignment.totalPoints} балл</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Мерзімі: {new Date(assignment.deadline).toLocaleDateString('kk-KZ')}
              </span>
            </div>
          </div>

          {/* Access Code and Direct Link */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Оқушылар үшін қатынас коды:
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider flex items-center justify-between">
                  <span>{assignment.accessCode}</span>
                  <KeyRound className="w-4 h-4 text-slate-400" />
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Көшірілді</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Көшіру</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Тікелей тапсырма сілтемесі:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={testUrl}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono truncate outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Көшірілді</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Сілтемені алу</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action channels: WhatsApp & Live Student Preview */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp арқылы жіберу</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenStudentPreview();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Оқушы көзімен көру / Тапсыру</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 leading-relaxed">
            💡 Оқушылар сілтеме арқылы немесе қатынас кодын енгізу арқылы өз аты-жөнін таңдап, тапсырманы таймермен онлайн орындай алады. Тапсырылған нәтижелер автоматты түрде «Мониторинг» бөлімінде сақталады.
          </div>
        </div>
      </div>
    </div>
  );
};
