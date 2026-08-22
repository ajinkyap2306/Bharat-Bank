import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { BulkPaymentAccount } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency } from '../payments/shared/CorporatePaymentsUI';
import { PayCard } from '../payments/shared/CorporatePaymentsUI';

interface BulkAccountSelectorProps {
  account: BulkPaymentAccount;
  hideBalance: boolean;
  onSelect: () => void;
}

export const BulkAccountSelector: React.FC<BulkAccountSelectorProps> = ({
  account,
  hideBalance,
  onSelect,
}) => (
  <PayCard className="p-4">
    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Pay From</p>
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center justify-between gap-3 text-left min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 rounded-xl"
    >
      <div>
        <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{account.name}</p>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{account.maskedNumber}</p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
          Available Balance:{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {hideBalance ? '••••••' : formatPaymentCurrency(account.availableBalance, account.currency)}
          </span>
        </p>
      </div>
      <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
    </button>
  </PayCard>
);
