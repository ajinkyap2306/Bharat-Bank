import React from 'react';
import { Check, X } from 'lucide-react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface ValidationSummaryProps {
  data: BulkBatchReview;
  onViewErrors?: () => void;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({ data, onViewErrors }) => {
  const allValid = data.errorCount === 0;

  return (
    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Validation</h3>
      <dl className="space-y-2 text-[13px]">
        <div className="flex justify-between items-center">
          <dt className="text-[#667085]">Valid Payments</dt>
          <dd className="flex items-center gap-1 font-semibold text-[#16A34A]">
            {data.validCount} <Check className="w-3.5 h-3.5" aria-hidden />
          </dd>
        </div>
        <div className="flex justify-between items-center">
          <dt className="text-[#667085]">Errors</dt>
          <dd
            className={`flex items-center gap-1 font-semibold ${
              allValid ? 'text-[#16A34A]' : 'text-[#DC2626]'
            }`}
          >
            {data.errorCount}{' '}
            {allValid ? (
              <Check className="w-3.5 h-3.5" aria-hidden />
            ) : (
              <X className="w-3.5 h-3.5" aria-hidden />
            )}
          </dd>
        </div>
        <div className="flex justify-between items-center">
          <dt className="text-[#667085]">Possible Duplicates</dt>
          <dd
            className={`flex items-center gap-1 font-semibold ${
              data.duplicateCount === 0 ? 'text-[#16A34A]' : 'text-[#F59E0B]'
            }`}
          >
            {data.duplicateCount}{' '}
            {data.duplicateCount === 0 ? (
              <Check className="w-3.5 h-3.5" aria-hidden />
            ) : (
              <X className="w-3.5 h-3.5" aria-hidden />
            )}
          </dd>
        </div>
      </dl>
      <p className={`mt-3 text-[13px] font-medium ${allValid ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
        {allValid ? 'All payments validated' : `${data.errorCount} validation errors found`}
      </p>
      {!allValid && onViewErrors && (
        <button
          type="button"
          onClick={onViewErrors}
          className="mt-3 w-full py-2.5 rounded-xl border border-rose-200 text-[#DC2626] text-[13px] font-semibold min-h-11"
        >
          View Errors
        </button>
      )}
    </PayCard>
  );
};
