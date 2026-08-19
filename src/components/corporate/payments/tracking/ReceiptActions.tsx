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
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Payment Receipt</h3>
      {showReceipt ? (
        <>
          <p className="text-[13px] text-[#16A34A] font-medium mb-3">Available</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[13px] font-semibold text-[#111827] dark:text-white min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB]"
            >
              <Download className="w-4 h-4" aria-hidden />
              Download Receipt
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[13px] font-semibold text-[#111827] dark:text-white min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB]"
            >
              <Share2 className="w-4 h-4" aria-hidden />
              Share Receipt
            </button>
          </div>
        </>
      ) : (
        <p className="text-[13px] text-[#667085]">
          Receipt will be available after payment completion.
        </p>
      )}
    </PayCard>
  );
};
