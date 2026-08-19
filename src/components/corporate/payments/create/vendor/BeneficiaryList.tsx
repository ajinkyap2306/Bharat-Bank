import React from 'react';
import type { VendorBeneficiary } from '../../../../../types/corporateVendorBeneficiarySelection';
import { groupBeneficiariesByLetter } from '../../../../../data/corporateVendorBeneficiarySelectionMock';
import { BeneficiaryItem } from './BeneficiaryItem';

interface BeneficiaryListProps {
  beneficiaries: VendorBeneficiary[];
  onSelect: (beneficiary: VendorBeneficiary) => void;
  onToggleFavorite: (beneficiaryId: string) => void;
  onViewStatus: (beneficiaryId: string) => void;
  showHeading?: boolean;
}

export const BeneficiaryList: React.FC<BeneficiaryListProps> = ({
  beneficiaries,
  onSelect,
  onToggleFavorite,
  onViewStatus,
  showHeading = true,
}) => {
  if (beneficiaries.length === 0) return null;

  const groups = groupBeneficiariesByLetter(beneficiaries);

  return (
    <section className="px-4" aria-labelledby={showHeading ? 'all-beneficiaries-heading' : undefined}>
      {showHeading && (
        <h2
          id="all-beneficiaries-heading"
          className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3"
        >
          All Beneficiaries
        </h2>
      )}
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.letter}>
            <p
              className="text-[12px] font-bold text-[#667085] uppercase tracking-wide mb-2 px-1"
              aria-hidden
            >
              {group.letter}
            </p>
            <div className="space-y-2">
              {group.items.map((beneficiary) => (
                <BeneficiaryItem
                  key={beneficiary.id}
                  beneficiary={beneficiary}
                  variant="list"
                  onSelect={onSelect}
                  onToggleFavorite={onToggleFavorite}
                  onViewStatus={onViewStatus}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
