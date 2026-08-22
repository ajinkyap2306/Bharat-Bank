import React from 'react';
import { Check } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { PaymentAccount, PaymentTypeId } from '../../../../types/corporatePaymentTypeSelection';
import { formatAccountCurrency } from '../../accounts/shared/CorporateAccountsUI';

interface AccountSelectorSheetProps {
  isOpen: boolean;
  accounts: PaymentAccount[];
  selectedId: string;
  showBalances: boolean;
  paymentTypeId?: PaymentTypeId;
  onClose: () => void;
  onSelect: (accountId: string) => void;
}

export const AccountSelectorSheet: React.FC<AccountSelectorSheetProps> = ({
  isOpen,
  accounts,
  selectedId,
  showBalances,
  paymentTypeId,
  onClose,
  onSelect,
}) => {
  const title = paymentTypeId ? 'Select Eligible Account' : 'Select Payment Account';

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-2 pb-2" role="listbox" aria-label={title}>
        {accounts.map((account) => {
          const selected = account.id === selectedId;
          const eligible = paymentTypeId
            ? account.eligiblePaymentTypes.includes(paymentTypeId)
            : true;

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
                  ? 'border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'
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
                {!eligible && (
                  <p className="text-[11px] text-[#DC2626] mt-1">Not eligible for this payment type</p>
                )}
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
};
