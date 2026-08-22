import React from 'react';
import {
  getLimitStatus,
  getUtilizationPercent,
} from '../../../../types/corporateAccountLimits';
import { AccessibleProgressBar, LimitsCard, LimitsRow, maskAmount } from './LimitsUI';
import { LimitStatusBadge, getStatusMessage } from './LimitStatusBadge';

interface PayrollLimitProps {
  monthlyLimit: number;
  used: number;
  currency?: string;
  showBalances: boolean;
}

export const PayrollLimit: React.FC<PayrollLimitProps> = ({
  monthlyLimit,
  used,
  currency = '₹',
  showBalances,
}) => {
  const remaining = Math.max(0, monthlyLimit - used);
  const percent = getUtilizationPercent(used, monthlyLimit);
  const status = getLimitStatus(used, monthlyLimit);

  return (
    <LimitsCard ariaLabel="Payroll limit">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
            Payroll Limit
          </h2>
          <LimitStatusBadge
            status={status}
            message={getStatusMessage(status, remaining, currency, showBalances)}
          />
        </div>

        <LimitsRow
          label="Monthly Limit"
          value={maskAmount(monthlyLimit, currency, showBalances)}
        />
        <LimitsRow
          label="Current Month"
          value={maskAmount(used, currency, showBalances)}
        />
        <LimitsRow
          label="Remaining"
          value={maskAmount(remaining, currency, showBalances)}
          valueClassName="text-emerald-600 dark:text-emerald-400"
        />

        <div className="mt-4">
          <AccessibleProgressBar
            label="Payroll utilization"
            percent={percent}
            statusLabel={`Payroll limit, ${percent} percent used`}
            variant={status === 'near_limit' ? 'warning' : 'primary'}
          />
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
          Aggregate payroll limits only. Individual employee details are not shown.
        </p>
      </div>
    </LimitsCard>
  );
};
