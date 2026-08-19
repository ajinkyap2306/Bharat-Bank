import React from 'react';
import { Download, Share2 } from 'lucide-react';

interface StatementDownloadActionsProps {
  disabled?: boolean;
  onDownloadPdf: () => void;
  onDownloadCsv: () => void;
  onShare: () => void;
}

export const StatementDownloadActions: React.FC<StatementDownloadActionsProps> = ({
  disabled,
  onDownloadPdf,
  onDownloadCsv,
  onShare,
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 px-4 py-3 safe-bottom bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC]/80 dark:border-slate-800">
    <button
      type="button"
      disabled={disabled}
      onClick={onDownloadPdf}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[15px] font-semibold min-h-12 disabled:opacity-50"
    >
      <Download className="w-5 h-5" aria-hidden />
      Download PDF
    </button>
    <div className="flex gap-2 mt-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onDownloadCsv}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-semibold text-[#111827] dark:text-white min-h-11 disabled:opacity-50"
      >
        <Download className="w-4 h-4" aria-hidden />
        Download CSV
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onShare}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-semibold text-[#0B5CAB] min-h-11 disabled:opacity-50"
      >
        <Share2 className="w-4 h-4" aria-hidden />
        Share
      </button>
    </div>
  </div>
);
