import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { ApprovalBeneficiaryInfo } from '../../../../types/corporateApprovalDetails';

interface BeneficiaryVerificationProps {
  beneficiary: ApprovalBeneficiaryInfo;
}

export const BeneficiaryVerification: React.FC<BeneficiaryVerificationProps> = ({
  beneficiary,
}) => (
  <section
    className={`mx-4 rounded-2xl border p-4 ${
      beneficiary.verified
        ? 'bg-white dark:bg-slate-900 border-[#E4E7EC] dark:border-slate-800'
        : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
    }`}
    aria-labelledby="beneficiary-verification-heading"
  >
    <h2 id="beneficiary-verification-heading" className="text-[14px] font-semibold text-[#111827] dark:text-white">
      Beneficiary Verification
    </h2>
    <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-2">
      {beneficiary.name}
    </p>
    <div className="mt-3 space-y-2 text-[13px]">
      <div className="flex justify-between gap-3">
        <span className="text-[#667085]">Status</span>
        <span
          className={`font-semibold flex items-center gap-1 ${
            beneficiary.verified ? 'text-[#16A34A]' : 'text-[#F59E0B]'
          }`}
          role="status"
        >
          {beneficiary.verified ? (
            <>
              <CheckCircle className="w-4 h-4" aria-hidden />
              Verified
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" aria-hidden />
              Verification Required
            </>
          )}
        </span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-[#667085]">Bank</span>
        <span className="font-medium text-[#111827] dark:text-white">{beneficiary.bankName}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-[#667085]">Account</span>
        <span className="font-medium text-[#111827] dark:text-white">{beneficiary.maskedAccount}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-[#667085]">Beneficiary Type</span>
        <span className="font-medium text-[#111827] dark:text-white">{beneficiary.type}</span>
      </div>
    </div>
    {!beneficiary.verified && (
      <p className="text-[12px] text-[#F59E0B] mt-3 font-medium">
        Approval is disabled until beneficiary verification is completed.
      </p>
    )}
  </section>
);
