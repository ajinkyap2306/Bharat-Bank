import React from 'react';
import { Download, Upload, UserPlus } from 'lucide-react';

interface BulkPaymentEmptyStateProps {
  onUpload: () => void;
  onAddManual: () => void;
  onDownloadSample: () => void;
}

export const BulkPaymentEmptyState: React.FC<BulkPaymentEmptyStateProps> = ({
  onUpload,
  onAddManual,
  onDownloadSample,
}) => (
  <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-8 text-center">
    <p className="text-[15px] font-semibold text-[#111827] dark:text-white">No payments in this batch</p>
    <p className="text-[13px] text-[#667085] mt-2">
      Upload a payment file or add payments manually.
    </p>
    <div className="flex flex-col gap-2 mt-6">
      <button
        type="button"
        onClick={onUpload}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11"
      >
        <Upload className="w-4 h-4" aria-hidden />
        Upload File
      </button>
      <button
        type="button"
        onClick={onAddManual}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 font-bold text-sm text-[#111827] dark:text-white min-h-11"
      >
        <UserPlus className="w-4 h-4" aria-hidden />
        Add Payment
      </button>
      <button
        type="button"
        onClick={onDownloadSample}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 font-semibold text-sm text-[#0B5CAB] min-h-11"
      >
        <Download className="w-4 h-4" aria-hidden />
        Download Sample File
      </button>
    </div>
  </div>
);
