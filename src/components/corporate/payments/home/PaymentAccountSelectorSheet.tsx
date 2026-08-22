import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { Check } from 'lucide-react';
import type { PaymentAccountOption } from '../../../../types/corporatePaymentsHome';
import { formatAccountCurrency } from '../../accounts/shared/CorporateAccountsUI';

interface PaymentAccountSelectorSheetProps {
  isOpen: boolean;
  accounts: PaymentAccountOption[];
  selectedId: string;
  showBalances: boolean;
  onClose: () => void;
  onSelect: (accountId: string) => void;
}

export const PaymentAccountSelectorSheet: React.FC<PaymentAccountSelectorSheetProps> = ({
  isOpen,
  accounts,
  selectedId,
  showBalances,
  onClose,
  onSelect,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Payment Account">
    <div className="space-y-2 pb-2">
      {accounts.map((account) => {
        const selected = account.id === selectedId;
        return (
          <button
            key={account.id}
            type="button"
            onClick={() => {
              onSelect(account.id);
              onClose();
            }}
            className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border min-h-16 text-left ${
              selected
                ? 'border-congress-blue-700 bg-congress-blue-700/5'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                {account.accountType}
              </p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums">{account.maskedNumber}</p>
              <p className="text-[12px] font-medium text-slate-900 dark:text-white tabular-nums mt-1">
                {showBalances
                  ? formatAccountCurrency(account.availableBalance, account.currency)
                  : '••••••'}
              </p>
            </div>
            {selected && <Check className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400 shrink-0" aria-hidden />}
          </button>
        );
      })}
    </div>
  </BottomSheet>
);
