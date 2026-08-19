import React from 'react';
import { Download, Share2 } from 'lucide-react';

interface TransactionReceiptActionsProps {
  onDownload: () => void;
  onShare: () => void;
  disabled?: boolean;
}

export const TransactionReceiptActions: React.FC<TransactionReceiptActionsProps> = ({
  onDownload,
  onShare,
  disabled,
}) => (
  <div className="mx-4 flex gap-2">
    <button
      type="button"
      disabled={disabled}
      onClick={onDownload}
      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] font-semibold text-[#111827] dark:text-white min-h-12 disabled:opacity-50"
    >
      <Download className="w-4 h-4" aria-hidden />
      Download Receipt
    </button>
    <button
      type="button"
      disabled={disabled}
      onClick={onShare}
      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-12 disabled:opacity-50"
    >
      <Share2 className="w-4 h-4" aria-hidden />
      Share Receipt
    </button>
  </div>
);
