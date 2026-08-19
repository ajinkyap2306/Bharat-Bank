import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { BENEFICIARY_TYPE_OPTIONS } from '../../../../data/corporateBeneficiariesMock';

interface BeneficiaryFilterSheetProps {
  isOpen: boolean;
  typeFilter: string | null;
  onClose: () => void;
  onApply: (type: string | null) => void;
  onClear: () => void;
}

export const BeneficiaryFilterSheet: React.FC<BeneficiaryFilterSheetProps> = ({
  isOpen,
  typeFilter,
  onClose,
  onApply,
  onClear,
}) => {
  const [draft, setDraft] = useState<string | null>(typeFilter);

  React.useEffect(() => {
    if (isOpen) setDraft(typeFilter);
  }, [isOpen, typeFilter]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Beneficiaries">
      <div className="px-4 pb-6 space-y-4">
        <div>
          <p className="text-xs font-bold text-[#667085] mb-2">Beneficiary Type</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="ben-type-filter"
                checked={draft === null}
                onChange={() => setDraft(null)}
              />
              All types
            </label>
            {BENEFICIARY_TYPE_OPTIONS.map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="ben-type-filter"
                  checked={draft === opt.id}
                  onChange={() => setDraft(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="w-full py-3 rounded-2xl border font-semibold text-sm min-h-11"
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11"
        >
          Apply Filters
        </button>
      </div>
    </BottomSheet>
  );
};
