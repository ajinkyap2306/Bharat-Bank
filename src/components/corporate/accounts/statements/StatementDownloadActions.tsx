import React from 'react';
import { Download, Mail, Share2 } from 'lucide-react';
import { maskRegisteredEmail } from '../../../../utils/statementDelivery';

interface StatementDownloadActionsProps {
  disabled?: boolean;
  registeredEmail?: string;
  onDownloadPdf: () => void;
  onDownloadCsv: () => void;
  onSendEmail: () => void;
  onShare: () => void;
}

export const StatementDownloadActions: React.FC<StatementDownloadActionsProps> = ({
  disabled,
  registeredEmail,
  onDownloadPdf,
  onDownloadCsv,
  onSendEmail,
  onShare,
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 px-4 py-3 safe-bottom bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80">
    <div className="flex gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onDownloadPdf}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-congress-blue-700 text-white text-[15px] font-semibold min-h-12 disabled:opacity-50"
      >
        <Download className="w-5 h-5" aria-hidden />
        Download PDF
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onSendEmail}
        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-congress-blue-700/30 bg-white dark:bg-slate-900 text-congress-blue-700 dark:text-congress-blue-400 text-[15px] font-semibold min-h-12 disabled:opacity-50"
      >
        <Mail className="w-5 h-5" aria-hidden />
        Send to Email
      </button>
    </div>
    {registeredEmail && (
      <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-2">
        Registered email: {maskRegisteredEmail(registeredEmail)}
      </p>
    )}
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onDownloadCsv}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-semibold text-slate-900 dark:text-white min-h-11 disabled:opacity-50"
      >
        <Download className="w-4 h-4" aria-hidden />
        Download CSV
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onShare}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 disabled:opacity-50"
      >
        <Share2 className="w-4 h-4" aria-hidden />
        Share
      </button>
    </div>
  </div>
);
