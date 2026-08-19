import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { PaymentAccount } from '../../../../types/corporatePaymentTypeSelection';
import { formatAccountCurrency } from '../../accounts/shared/CorporateAccountsUI';

interface PaymentSourceAccountProps {
  account: PaymentAccount;
  showBalances: boolean;
  onOpen: () => void;
}

export const PaymentSourceAccount: React.FC<PaymentSourceAccountProps> = ({
  account,
  showBalances,
  onOpen,
}) => (
  <section className="px-4" aria-label="Source account">
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 text-left shadow-sm min-h-[76px] active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#667085] uppercase tracking-wide">
            Pay From
          </p>
          <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-1">
            {account.name}
          </p>
          <p className="text-[13px] text-[#667085] tabular-nums">{account.maskedNumber}</p>
          <div className="mt-2">
            <p className="text-[12px] text-[#667085]">Available</p>
            <p className="text-[16px] font-bold text-[#111827] dark:text-white tabular-nums">
              {showBalances
                ? formatAccountCurrency(account.availableBalance, account.currency)
                : '••••••'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#667085] shrink-0" aria-hidden />
      </div>
    </button>
  </section>
);
