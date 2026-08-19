import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { BulkPaymentValidationError } from '../../../types/corporateBulkPayments';
import { PayCard } from '../payments/shared/CorporatePaymentsUI';
import { BottomSheet } from '../../common/BottomSheet';

interface ValidationErrorsProps {
  errors: BulkPaymentValidationError[];
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  const [showAll, setShowAll] = useState(false);
  if (errors.length === 0) return null;

  const preview = errors.slice(0, 2);

  return (
    <>
      <PayCard className="p-4 border-rose-200 dark:border-rose-900">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-[#DC2626]" aria-hidden />
          <h3 className="text-[13px] font-semibold text-[#DC2626]">Errors Found</h3>
        </div>
        <ul className="space-y-3" aria-label="Validation errors">
          {preview.map((err) => (
            <li key={err.row} className="pb-3 border-b border-[#E4E7EC] dark:border-slate-800 last:border-0 last:pb-0">
              <p className="text-[12px] text-[#667085]">Row {err.row}</p>
              <p className="text-[14px] font-semibold text-[#111827] dark:text-white">{err.beneficiary}</p>
              <p className="text-[13px] text-[#DC2626] mt-0.5">{err.reason}</p>
            </li>
          ))}
        </ul>
        {errors.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-3 w-full py-2.5 rounded-xl border border-rose-200 text-[#DC2626] text-[13px] font-semibold min-h-11"
          >
            View Errors ({errors.length})
          </button>
        )}
      </PayCard>

      <BottomSheet isOpen={showAll} onClose={() => setShowAll(false)} title="Validation Errors">
        <ul className="px-4 pb-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {errors.map((err) => (
            <li key={err.row} className="pb-3 border-b border-[#E4E7EC] dark:border-slate-800">
              <p className="text-[12px] text-[#667085]">Row {err.row}</p>
              <p className="text-[14px] font-semibold">{err.beneficiary}</p>
              <p className="text-[13px] text-[#DC2626] mt-0.5">{err.reason}</p>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  );
};
