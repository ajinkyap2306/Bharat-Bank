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
            className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border min-h-16 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 ${
              !eligible
                ? 'border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                : selected
                  ? 'border-congress-blue-700 bg-congress-blue-700/5'
                  : 'border-slate-200 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/40'
            }`}
          >
            <div>
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                {account.name}
              </p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums">{account.maskedNumber}</p>
              <p className="text-[12px] font-medium text-slate-900 dark:text-white tabular-nums mt-1">
                {showBalances
                  ? formatAccountCurrency(account.availableBalance, account.currency)
                  : '••••••'}
              </p>
              <p
                className={`text-[11px] font-semibold mt-1 ${
                  eligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#DC2626]'
                }`}
              >
                {eligible ? 'Eligible' : 'Not available for vendor payments'}
              </p>
            </div>
            {selected && eligible && (
              <Check className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400 shrink-0" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  </BottomSheet>
);
