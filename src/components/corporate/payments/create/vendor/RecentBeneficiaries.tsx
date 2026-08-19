import React from 'react';
import type { VendorBeneficiary } from '../../../../../types/corporateVendorBeneficiarySelection';
import { BeneficiaryItem } from './BeneficiaryItem';

interface RecentBeneficiariesProps {
  beneficiaries: VendorBeneficiary[];
  onSelect: (beneficiary: VendorBeneficiary) => void;
  onToggleFavorite: (beneficiaryId: string) => void;
}

export const RecentBeneficiaries: React.FC<RecentBeneficiariesProps> = ({
  beneficiaries,
  onSelect,
  onToggleFavorite,
}) => {
  const recent = [...beneficiaries]
    .filter((b) => b.lastPaymentDate)
    .sort((a, b) => {
      const da = a.lastPaymentDate ?? '';
      const db = b.lastPaymentDate ?? '';
      return db.localeCompare(da);
    })
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <section className="px-4" aria-labelledby="recent-beneficiaries-heading">
      <h2
        id="recent-beneficiaries-heading"
        className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3"
      >
        Recent
      </h2>
      <div className="space-y-2">
        {recent.map((beneficiary) => (
          <BeneficiaryItem
            key={beneficiary.id}
            beneficiary={beneficiary}
            variant="recent"
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
};
