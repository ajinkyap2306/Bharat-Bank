import React from 'react';
import {
  getLimitStatus,
  getUtilizationPercent,
} from '../../../../types/corporateAccountLimits';
import { AccessibleProgressBar, LimitsCard, LimitsRow, maskAmount } from './LimitsUI';
import { LimitStatusBadge, getStatusMessage } from './LimitStatusBadge';

interface BeneficiaryLimitProps {
  dailyLimit: number;
  used: number;
  currency?: string;
  showBalances: boolean;
}

export const BeneficiaryLimit: React.FC<BeneficiaryLimitProps> = ({
  dailyLimit,
  used,
  currency = '₹',
  showBalances,
}) => {
  const remaining = Math.max(0, dailyLimit - used);
  const percent = getUtilizationPercent(used, dailyLimit);
  const status = getLimitStatus(used, dailyLimit);

  return (
    <LimitsCard ariaLabel="Beneficiary transfer limit">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
            Beneficiary Transfer Limit
          </h2>
          <LimitStatusBadge
            status={status}
            message={getStatusMessage(status, remaining, currency, showBalances)}
          />
        </div>

        <LimitsRow label="Daily Limit" value={maskAmount(dailyLimit, currency, showBalances)} />
        <LimitsRow label="Used" value={maskAmount(used, currency, showBalances)} />
        <LimitsRow
          label="Remaining"
          value={maskAmount(remaining, currency, showBalances)}
          valueClassName="text-[#16A34A]"
        />

        <div className="mt-3">
          <AccessibleProgressBar
            label="Beneficiary utilization"
            percent={percent}
            statusLabel={`Beneficiary transfer limit, ${percent} percent used`}
            variant="primary"
          />
        </div>

        <p className="text-[12px] text-[#667085] mt-3 font-medium">Resets daily</p>
      </div>
    </LimitsCard>
  );
};
