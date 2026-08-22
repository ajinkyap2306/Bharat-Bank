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
    <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-3">Account Limits</h2>
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] text-slate-500 dark:text-slate-400">Daily Transfer Limit</span>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white tabular-nums">
            {showBalances ? formatAccountCurrency(limits.dailyLimit, currency) : '••••••'}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] text-slate-500 dark:text-slate-400">Used Today</span>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white tabular-nums">
            {showBalances ? formatAccountCurrency(limits.usedToday, currency) : '••••••'}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] text-slate-500 dark:text-slate-400">Remaining</span>
          <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {showBalances ? formatAccountCurrency(limits.remaining, currency) : '••••••'}
          </span>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-congress-blue-700"
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
        className="w-full mt-4 flex items-center justify-center gap-1 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
      >
        View Limits
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </section>
);
