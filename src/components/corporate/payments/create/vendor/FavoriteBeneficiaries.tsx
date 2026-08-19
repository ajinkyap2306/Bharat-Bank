import React from 'react';
import type { VendorBeneficiary } from '../../../../../types/corporateVendorBeneficiarySelection';
import { BeneficiaryItem } from './BeneficiaryItem';

interface FavoriteBeneficiariesProps {
  beneficiaries: VendorBeneficiary[];
  onSelect: (beneficiary: VendorBeneficiary) => void;
  onToggleFavorite: (beneficiaryId: string) => void;
}

export const FavoriteBeneficiaries: React.FC<FavoriteBeneficiariesProps> = ({
  beneficiaries,
  onSelect,
  onToggleFavorite,
}) => {
  const favorites = beneficiaries.filter((b) => b.isFavorite).slice(0, 4);
  if (favorites.length === 0) return null;

  return (
    <section className="px-4" aria-labelledby="favorite-beneficiaries-heading">
      <h2
        id="favorite-beneficiaries-heading"
        className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3"
      >
        Favorites
      </h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {favorites.map((beneficiary) => (
          <BeneficiaryItem
            key={beneficiary.id}
            beneficiary={beneficiary}
            variant="favorite"
            onSelect={onSelect}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
};
