import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface DuplicateCheckProps {
  data: BulkBatchReview;
  onReviewDuplicates?: () => void;
}

export const DuplicateCheck: React.FC<DuplicateCheckProps> = ({ data, onReviewDuplicates }) => {
  const clear = data.duplicateCount === 0;

  return (
    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Duplicate Check</h3>
      <div className="flex items-center gap-2 text-[13px] font-semibold">
        {clear ? (
          <>
            <CheckCircle className="w-4 h-4 text-[#16A34A]" aria-hidden />
            <span className="text-[#16A34A]">No duplicate payments detected</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-[#F59E0B]" aria-hidden />
            <span className="text-[#F59E0B]">
              {data.duplicateCount} possible duplicate{data.duplicateCount > 1 ? 's' : ''} detected
            </span>
          </>
        )}
      </div>
      {!clear && onReviewDuplicates && (
        <button
          type="button"
          onClick={onReviewDuplicates}
          className="mt-3 w-full py-2.5 rounded-xl border border-amber-200 text-[#F59E0B] text-[13px] font-semibold min-h-11"
        >
          Review Duplicates
        </button>
      )}
    </PayCard>
  );
};
