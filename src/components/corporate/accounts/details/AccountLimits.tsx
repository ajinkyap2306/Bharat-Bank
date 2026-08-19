import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { AccountTransferLimits } from '../../../../types/corporateAccountDetails';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface AccountLimitsProps {
  limits: AccountTransferLimits;
  currency?: string;
  showBalances: boolean;
  onViewLimits: () => void;
}

export const AccountLimits: React.FC<AccountLimitsProps> = ({
  limits,
  currency = '₹',
  showBalances,
  onViewLimits,
}) => (
  <section className="px-4" aria-label="Account Limits">
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-3">Account Limits</h2>
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] text-[#667085]">Daily Transfer Limit</span>
          <span className="text-[13px] font-semibold text-[#111827] dark:text-white tabular-nums">
            {showBalances ? formatAccountCurrency(limits.dailyLimit, currency) : '••••••'}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] text-[#667085]">Used Today</span>
          <span className="text-[13px] font-semibold text-[#111827] dark:text-white tabular-nums">
            {showBalances ? formatAccountCurrency(limits.usedToday, currency) : '••••••'}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] text-[#667085]">Remaining</span>
          <span className="text-[13px] font-semibold text-[#16A34A] tabular-nums">
            {showBalances ? formatAccountCurrency(limits.remaining, currency) : '••••••'}
          </span>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[#F7F9FC] dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#0B5CAB]"
          style={{ width: `${Math.min(100, (limits.usedToday / limits.dailyLimit) * 100)}%` }}
          role="progressbar"
          aria-valuenow={limits.usedToday}
          aria-valuemin={0}
          aria-valuemax={limits.dailyLimit}
        />
      </div>
      <button
        type="button"
        onClick={onViewLimits}
        className="w-full mt-4 flex items-center justify-center gap-1 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
      >
        View Limits
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </section>
);
