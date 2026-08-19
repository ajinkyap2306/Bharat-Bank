import React from 'react';
import { Check } from 'lucide-react';
import { BottomSheet } from '../../../../common/BottomSheet';
import type { PaymentAccount } from '../../../../../types/corporatePaymentTypeSelection';
import { formatAccountCurrency } from '../../../accounts/shared/CorporateAccountsUI';

interface VendorAccountSelectorSheetProps {
  isOpen: boolean;
  accounts: PaymentAccount[];
  selectedId: string;
  showBalances: boolean;
  isVendorEligible: (accountId: string) => boolean;
  onClose: () => void;
  onSelect: (accountId: string) => void;
}

export const VendorAccountSelectorSheet: React.FC<VendorAccountSelectorSheetProps> = ({
  isOpen,
  accounts,
  selectedId,
  showBalances,
  isVendorEligible,
  onClose,
  onSelect,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Payment Account">
    <div className="space-y-2 pb-2" role="listbox" aria-label="Select payment account for vendor payment">
      {accounts.map((account) => {
        const selected = account.id === selectedId;
        const eligible = isVendorEligible(account.id);

        return (
          <button
            key={account.id}
            type="button"
            role="option"
            aria-selected={selected}
            disabled={!eligible}
            onClick={() => {
              if (!eligible) return;
              onSelect(account.id);
              onClose();
            }}
            className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border min-h-16 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] ${
              !eligible
                ? 'border-[#E4E7EC] dark:border-slate-800 opacity-60 cursor-not-allowed'
                : selected
                  ? 'border-[#0B5CAB] bg-[#0B5CAB]/5'
                  : 'border-[#E4E7EC] dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/40'
            }`}
          >
            <div>
              <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
                {account.name}
              </p>
              <p className="text-[13px] text-[#667085] tabular-nums">{account.maskedNumber}</p>
              <p className="text-[12px] font-medium text-[#111827] dark:text-white tabular-nums mt-1">
                {showBalances
                  ? formatAccountCurrency(account.availableBalance, account.currency)
                  : '••••••'}
              </p>
              <p
                className={`text-[11px] font-semibold mt-1 ${
                  eligible ? 'text-[#16A34A]' : 'text-[#DC2626]'
                }`}
              >
                {eligible ? 'Eligible' : 'Not available for vendor payments'}
              </p>
            </div>
            {selected && eligible && (
              <Check className="w-5 h-5 text-[#0B5CAB] shrink-0" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  </BottomSheet>
);
