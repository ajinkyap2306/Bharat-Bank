import React from 'react';
import { formatAccountCurrency } from '../../../../accounts/shared/CorporateAccountsUI';
import { ReviewEditButton } from './ReviewEditButton';

interface SourceAccountReviewCardProps {
  name: string;
  maskedNumber: string;
  availableBalance: number;
  currency: string;
  showBalances: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const SourceAccountReviewCard: React.FC<SourceAccountReviewCardProps> = ({
  name,
  maskedNumber,
  availableBalance,
  currency,
  showBalances,
  onChange,
  disabled,
}) => (
  <section className="px-4" aria-labelledby="review-pay-from-heading">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h2 id="review-pay-from-heading" className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide">
          Pay From
        </h2>
        <ReviewEditButton label="Change" onClick={onChange} disabled={disabled} />
      </div>
      <p className="text-[16px] font-semibold text-[#111827] dark:text-white">{name}</p>
      <p className="text-[13px] text-[#667085] tabular-nums mt-0.5">{maskedNumber}</p>
      <p className="text-[12px] text-[#667085] mt-2">Available Balance</p>
      <p className="text-[16px] font-bold text-[#111827] dark:text-white tabular-nums">
        {showBalances ? formatAccountCurrency(availableBalance, currency) : '••••••'}
      </p>
    </div>
  </section>
);
