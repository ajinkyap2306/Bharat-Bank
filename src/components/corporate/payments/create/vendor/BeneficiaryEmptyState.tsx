import React from 'react';
import { Building2, Users } from 'lucide-react';
import { AddBeneficiaryCTA } from './AddBeneficiaryCTA';

interface BeneficiaryEmptyStateProps {
  onAddBeneficiary: () => void;
  onCancel: () => void;
}

export const BeneficiaryEmptyState: React.FC<BeneficiaryEmptyStateProps> = ({
  onAddBeneficiary,
  onCancel,
}) => (
  <section className="px-4 py-8 text-center" aria-labelledby="beneficiary-empty-title">
    <div className="w-16 h-16 rounded-full bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center mx-auto mb-4">
      <Users className="w-8 h-8 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
    </div>
    <h2 id="beneficiary-empty-title" className="text-[17px] font-semibold text-slate-900 dark:text-white">
      No beneficiaries yet
    </h2>
    <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
      Add a beneficiary to start making vendor payments.
    </p>
    <div className="mt-6 space-y-3 max-w-xs mx-auto">
      <AddBeneficiaryCTA onClick={onAddBeneficiary} variant="primary" />
      <button
        type="button"
        onClick={onCancel}
        className="w-full py-3 rounded-2xl text-[14px] font-semibold text-slate-500 dark:text-slate-400 min-h-11"
      >
        Cancel
      </button>
    </div>
  </section>
);

interface BeneficiarySearchEmptyStateProps {
  onAddBeneficiary: () => void;
}

export const BeneficiarySearchEmptyState: React.FC<BeneficiarySearchEmptyStateProps> = ({
  onAddBeneficiary,
}) => (
  <section className="px-4 py-10 text-center" aria-labelledby="beneficiary-search-empty-title">
    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
      <Building2 className="w-7 h-7 text-slate-500 dark:text-slate-400" aria-hidden />
    </div>
    <h2 id="beneficiary-search-empty-title" className="text-[16px] font-semibold text-slate-900 dark:text-white">
      No beneficiary found
    </h2>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
      Try another name, account number or bank.
    </p>
    <button
      type="button"
      onClick={onAddBeneficiary}
      className="mt-5 text-[14px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-4"
    >
      Add New Beneficiary
    </button>
  </section>
);
