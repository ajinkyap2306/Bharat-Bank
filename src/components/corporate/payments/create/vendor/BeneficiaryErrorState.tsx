import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { AddBeneficiaryCTA } from './AddBeneficiaryCTA';

interface BeneficiaryErrorStateProps {
  onRetry: () => void;
  onAddBeneficiary: () => void;
}

export const BeneficiaryErrorState: React.FC<BeneficiaryErrorStateProps> = ({
  onRetry,
  onAddBeneficiary,
}) => (
  <section className="px-4 py-8 text-center" aria-labelledby="beneficiary-error-title">
    <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-7 h-7 text-[#DC2626]" aria-hidden />
    </div>
    <h2 id="beneficiary-error-title" className="text-[16px] font-semibold text-[#111827] dark:text-white">
      Unable to load beneficiaries
    </h2>
    <p className="text-[13px] text-[#667085] mt-2">Please try again.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-12"
    >
      <RefreshCw className="w-4 h-4" aria-hidden />
      Retry
    </button>
    <div className="mt-4 max-w-xs mx-auto">
      <AddBeneficiaryCTA onClick={onAddBeneficiary} />
    </div>
  </section>
);
