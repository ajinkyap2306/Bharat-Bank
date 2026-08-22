import React, { useEffect, useState } from 'react';
import { BottomSheet } from '../../../../common/BottomSheet';
import type {
  VendorBeneficiaryFilters,
  VendorBeneficiaryStatus,
  VendorBeneficiaryType,
} from '../../../../../types/corporateVendorBeneficiarySelection';
import { DEFAULT_VENDOR_BENEFICIARY_FILTERS } from '../../../../../types/corporateVendorBeneficiarySelection';
import { VENDOR_BENEFICIARY_BANKS } from '../../../../../data/corporateVendorBeneficiarySelectionMock';

interface BeneficiaryFilterSheetProps {
  isOpen: boolean;
  filters: VendorBeneficiaryFilters;
  onClose: () => void;
  onApply: (filters: VendorBeneficiaryFilters) => void;
}

const STATUS_OPTIONS: { id: VendorBeneficiaryStatus; label: string }[] = [
  { id: 'verified', label: 'Verified' },
  { id: 'pending-verification', label: 'Pending Verification' },
  { id: 'pending-approval', label: 'Pending Approval' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'inactive', label: 'Inactive' },
];

const TYPE_OPTIONS: { id: VendorBeneficiaryType; label: string }[] = [
  { id: 'vendor', label: 'Vendor' },
  { id: 'supplier', label: 'Supplier' },
  { id: 'service-provider', label: 'Service Provider' },
];

const toggleItem = <T,>(list: T[], item: T): T[] =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

export const BeneficiaryFilterSheet: React.FC<BeneficiaryFilterSheetProps> = ({
  isOpen,
  filters,
  onClose,
  onApply,
}) => {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  const handleReset = () => {
    setDraft(DEFAULT_VENDOR_BENEFICIARY_FILTERS);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Beneficiaries">
      <div className="space-y-5 pb-2">
        <div>
          <p className="text-[13px] font-semibold text-slate-900 dark:text-white mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setDraft((d) => ({ ...d, statuses: toggleItem(d.statuses, opt.id) }))
                }
                className={`px-3 py-2 rounded-full text-[12px] font-semibold min-h-9 border ${
                  draft.statuses.includes(opt.id)
                    ? 'bg-congress-blue-700 text-white border-congress-blue-700'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-slate-900 dark:text-white mb-2">Bank</p>
          <div className="flex flex-wrap gap-2">
            {VENDOR_BENEFICIARY_BANKS.map((bank) => (
              <button
                key={bank}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, banks: toggleItem(d.banks, bank) }))}
                className={`px-3 py-2 rounded-full text-[12px] font-semibold min-h-9 border ${
                  draft.banks.includes(bank)
                    ? 'bg-congress-blue-700 text-white border-congress-blue-700'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {bank}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-slate-900 dark:text-white mb-2">Type</p>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, types: toggleItem(d.types, opt.id) }))}
                className={`px-3 py-2 rounded-full text-[12px] font-semibold min-h-9 border ${
                  draft.types.includes(opt.id)
                    ? 'bg-congress-blue-700 text-white border-congress-blue-700'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-14">
          <input
            type="checkbox"
            checked={draft.favoritesOnly}
            onChange={(e) => setDraft((d) => ({ ...d, favoritesOnly: e.target.checked }))}
            className="w-4 h-4 accent-congress-blue-700"
          />
          <span className="text-[14px] font-medium text-slate-900 dark:text-white">
            Favorites only
          </span>
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-[14px] font-semibold text-slate-500 dark:text-slate-400 min-h-11"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white text-[14px] font-semibold min-h-11"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
