import React from 'react';
import {
  getLimitStatus,
  getUtilizationPercent,
} from '../../../../types/corporateAccountLimits';
import { AccessibleProgressBar, LimitsCard, LimitsRow, maskAmount } from './LimitsUI';
import { LimitStatusBadge, getStatusMessage } from './LimitStatusBadge';

interface DailyLimitCardProps {
  limit: number;
  used: number;
  currency?: string;
  showBalances: boolean;
  restricted?: boolean;
}

export const DailyLimitCard: React.FC<DailyLimitCardProps> = ({
  limit,
  used,
  currency = '₹',
  showBalances,
  restricted,
}) => {
  const remaining = Math.max(0, limit - used);
  const percent = getUtilizationPercent(used, limit);
  const status = getLimitStatus(used, limit, restricted);
  const variant =
    status === 'exceeded'
      ? 'error'
      : status === 'near_limit'
        ? 'warning'
        : status === 'restricted'
          ? 'error'
          : 'primary';

  const srLabel = showBalances
    ? `Daily transfer limit, ${percent} percent used, ${remaining.toLocaleString('en-IN')} remaining`
    : `Daily transfer limit, ${percent} percent used`;

  return (
    <LimitsCard ariaLabel="Daily transfer limit">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
            Daily Transfer Limit
          </h2>
          <LimitStatusBadge
            status={status}
            message={getStatusMessage(status, remaining, currency, showBalances)}
          />
        </div>

        <LimitsRow
          label="Configured Limit"
          value={maskAmount(limit, currency, showBalances)}
        />
        <LimitsRow label="Used Today" value={maskAmount(used, currency, showBalances)} />
        <LimitsRow
          label="Remaining"
          value={maskAmount(remaining, currency, showBalances)}
          valueClassName="text-[#16A34A]"
        />

        <div className="mt-4">
          <AccessibleProgressBar
            label="Utilization"
            percent={percent}
            statusLabel={srLabel}
            variant={variant}
          />
        </div>

        <p className="text-[11px] text-[#667085] mt-3">Configured by Corporate Administrator</p>
      </div>
    </LimitsCard>
  );
};
