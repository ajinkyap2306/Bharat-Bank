import React from 'react';
import { Download, Share2 } from 'lucide-react';
import type { CorporatePaymentStatus } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface ReceiptActionsProps {
  status: CorporatePaymentStatus;
  receiptAvailable: boolean;
  onDownload: () => void;
  onShare: () => void;
}

export const ReceiptActions: React.FC<ReceiptActionsProps> = ({
  status,
  receiptAvailable,
  onDownload,
  onShare,
}) => {
  const showReceipt = status === 'completed' && receiptAvailable;

  return (
    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Payment Receipt</h3>
      {showReceipt ? (
        <>
          <p className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium mb-3">Available</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[13px] font-semibold text-slate-900 dark:text-white min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
            >
              <Download className="w-4 h-4" aria-hidden />
              Download Receipt
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[13px] font-semibold text-slate-900 dark:text-white min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
            >
              <Share2 className="w-4 h-4" aria-hidden />
              Share Receipt
            </button>
          </div>
        </>
      ) : (
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          Receipt will be available after payment completion.
        </p>
      )}
    </PayCard>
  );
};
