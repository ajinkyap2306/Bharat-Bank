import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { BulkDuplicatePayment } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency, PayCard } from '../payments/shared/CorporatePaymentsUI';

interface DuplicatePaymentsProps {
  duplicates: BulkDuplicatePayment[];
  onReview: (id: string) => void;
  onRemove: (id: string) => void;
  onKeep: (id: string) => void;
}

export const DuplicatePayments: React.FC<DuplicatePaymentsProps> = ({
  duplicates,
  onReview,
  onRemove,
  onKeep,
}) => {
  const pending = duplicates.filter((d) => d.resolution === 'pending');
  if (pending.length === 0) return null;

  return (
    <PayCard className="p-4 border-amber-200 dark:border-amber-900">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-[#F59E0B]" aria-hidden />
        <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">
          Possible Duplicates
        </h3>
      </div>
      <ul className="space-y-4" aria-label="Possible duplicate payments">
        {pending.map((dup) => (
          <li key={dup.id} className="pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0">
            <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{dup.beneficiary}</p>
            <p className="text-[15px] font-bold text-slate-900 dark:text-white mt-0.5">
              {formatPaymentCurrency(dup.amount)}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
              Similar payment found: {dup.similarDate}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-mono">Payment ID: {dup.similarPaymentId}</p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => onReview(dup.id)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-[12px] font-semibold min-h-10"
              >
                Review
              </button>
              <button
                type="button"
                onClick={() => onRemove(dup.id)}
                className="flex-1 py-2 rounded-xl border border-rose-200 text-[#DC2626] text-[12px] font-semibold min-h-10"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => onKeep(dup.id)}
                className="flex-1 py-2 rounded-xl bg-congress-blue-700 text-white text-[12px] font-semibold min-h-10"
              >
                Keep
              </button>
            </div>
          </li>
        ))}
      </ul>
    </PayCard>
  );
};
