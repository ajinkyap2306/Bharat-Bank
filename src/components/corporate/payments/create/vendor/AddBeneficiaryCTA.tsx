import React from 'react';
import { Plus } from 'lucide-react';

interface AddBeneficiaryCTAProps {
  onClick: () => void;
  variant?: 'outlined' | 'primary';
}

export const AddBeneficiaryCTA: React.FC<AddBeneficiaryCTAProps> = ({
  onClick,
  variant = 'outlined',
}) => (
  <section className="px-4" aria-label="Add new beneficiary">
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed min-h-12 px-4 py-3 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2 ${
        variant === 'outlined'
          ? 'border-[#0B5CAB]/40 text-[#0B5CAB] bg-white dark:bg-slate-900 active:bg-[#0B5CAB]/5'
          : 'border-[#0B5CAB] bg-[#0B5CAB] text-white'
      }`}
    >
      <Plus className="w-4 h-4" aria-hidden />
      Add New Beneficiary
    </button>
  </section>
);
