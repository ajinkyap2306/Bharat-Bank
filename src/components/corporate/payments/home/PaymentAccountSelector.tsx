import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { PaymentAccountOption } from '../../../../types/corporatePaymentsHome';
import { formatAccountCurrency } from '../../accounts/shared/CorporateAccountsUI';

interface PaymentAccountSelectorProps {
  account: PaymentAccountOption;
  showBalances: boolean;
  onOpen: () => void;
}

export const PaymentAccountSelector: React.FC<PaymentAccountSelectorProps> = ({
  account,
  showBalances,
  onOpen,
}) => (
  <section className="px-4" aria-label="Payment account">
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left shadow-sm min-h-18 active:bg-slate-50 dark:active:bg-slate-800/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
            {account.accountType}
          </p>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums">{account.maskedNumber}</p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Available</p>
          <p className="text-[18px] font-bold text-slate-900 dark:text-white tabular-nums">
            {showBalances
              ? formatAccountCurrency(account.availableBalance, account.currency)
              : '••••••'}
          </p>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
      </div>
    </button>
  </section>
);
