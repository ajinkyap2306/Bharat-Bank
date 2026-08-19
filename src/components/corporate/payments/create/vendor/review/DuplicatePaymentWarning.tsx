import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DuplicatePaymentWarningProps {
  onReviewPrevious: () => void;
  onContinue: () => void;
  dismissed: boolean;
  onDismissContinue: () => void;
}

export const DuplicatePaymentWarning: React.FC<DuplicatePaymentWarningProps> = ({
  onReviewPrevious,
  onContinue,
  dismissed,
  onDismissContinue,
}) => {
  if (dismissed) return null;

  return (
    <section className="px-4" role="alert" aria-labelledby="duplicate-warning-title">
      <div className="rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 p-4">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1">
            <h2 id="duplicate-warning-title" className="text-[14px] font-semibold text-[#111827] dark:text-white">
              Possible Duplicate Payment
            </h2>
            <p className="text-[13px] text-[#667085] mt-1 leading-relaxed">
              A similar payment to this beneficiary and invoice was recently submitted.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={onReviewPrevious}
                className="px-4 py-2 rounded-xl border border-[#E4E7EC] dark:border-slate-800 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
              >
                Review Previous Payment
              </button>
              <button
                type="button"
                onClick={() => {
                  onDismissContinue();
                  onContinue();
                }}
                className="px-4 py-2 rounded-xl bg-[#0B5CAB] text-white text-[13px] font-semibold min-h-11"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
