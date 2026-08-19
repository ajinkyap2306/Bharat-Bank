import React from 'react';
import type { PaymentType, PaymentTypeId } from '../../../../types/corporatePaymentTypeSelection';

interface RecentPaymentTypesProps {
  recentTypeIds: PaymentTypeId[];
  paymentTypes: PaymentType[];
  onSelect: (paymentType: PaymentType) => void;
}

export const RecentPaymentTypes: React.FC<RecentPaymentTypesProps> = ({
  recentTypeIds,
  paymentTypes,
  onSelect,
}) => {
  const recentTypes = recentTypeIds
    .map((id) => paymentTypes.find((t) => t.id === id))
    .filter((t): t is PaymentType => Boolean(t));

  if (recentTypes.length === 0) return null;

  return (
    <section className="px-4" aria-labelledby="recent-payment-types-heading">
      <h2
        id="recent-payment-types-heading"
        className="text-[15px] font-semibold text-[#111827] dark:text-white mb-2"
      >
        Recent Payment Types
      </h2>
      <div className="flex flex-wrap gap-2">
        {recentTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onSelect(type)}
            className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 text-[13px] font-semibold text-[#0B5CAB] min-h-11 active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
          >
            {type.name}
          </button>
        ))}
      </div>
    </section>
  );
};
