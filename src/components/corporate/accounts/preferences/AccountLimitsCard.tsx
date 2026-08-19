import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { AccountTransferLimits } from '../../../../types/corporateAccountDetails';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';
import { PreferencesCard } from './PreferencesUI';

interface AccountLimitsCardProps {
  limits: AccountTransferLimits;
  currency?: string;
  showBalances: boolean;
  onViewLimits: () => void;
}

export const AccountLimitsCard: React.FC<AccountLimitsCardProps> = ({
  limits,
  currency = '₹',
  showBalances,
  onViewLimits,
}) => {
  const mask = (v: string) => (showBalances ? v : '••••••');

  return (
    <PreferencesCard ariaLabel="Account limits">
      <div className="p-4">
        <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">Account Limits</h2>
        <p className="text-[13px] text-[#667085] mt-1">
          View configured transaction and transfer limits.
        </p>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <span className="text-[13px] text-[#667085]">Daily Transfer Limit</span>
            <span className="text-[13px] font-semibold text-[#111827] dark:text-white tabular-nums">
              {mask(formatAccountCurrency(limits.dailyLimit, currency))}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-[13px] text-[#667085]">Used Today</span>
            <span className="text-[13px] font-semibold text-[#111827] dark:text-white tabular-nums">
              {mask(formatAccountCurrency(limits.usedToday, currency))}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onViewLimits}
          className="w-full mt-4 flex items-center justify-center gap-1 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
        >
          View Limits
          <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      </div>
    </PreferencesCard>
  );
};
