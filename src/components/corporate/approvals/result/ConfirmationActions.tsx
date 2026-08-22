import React from 'react';
import { Download, Share2 } from 'lucide-react';

interface ConfirmationActionsProps {
  onDownload: () => void;
  onShare: () => void;
  downloadLabel?: string;
}

export const ConfirmationActions: React.FC<ConfirmationActionsProps> = ({
  onDownload,
  onShare,
  downloadLabel = 'Download Confirmation',
}) => (
  <div className="mx-4 flex gap-2">
    <button
      type="button"
      onClick={onDownload}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[14px] font-medium min-h-11"
    >
      <Download className="w-4 h-4" aria-hidden />
      {downloadLabel}
    </button>
    <button
      type="button"
      onClick={onShare}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-[14px] font-medium min-h-11"
    >
      <Share2 className="w-4 h-4" aria-hidden />
      Share Confirmation
    </button>
  </div>
);
