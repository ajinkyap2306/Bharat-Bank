import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  getLimitStatus,
  getUtilizationPercent,
} from '../../../../types/corporateAccountLimits';
import { AccessibleProgressBar, LimitsCard, LimitsRow, maskAmount } from './LimitsUI';
import { LimitStatusBadge, getStatusMessage } from './LimitStatusBadge';

interface BulkPaymentLimitProps {
  dailyLimit: number;
  maxBatch: number;
  used: number;
  currency?: string;
  showBalances: boolean;
  onViewRules: () => void;
}

export const BulkPaymentLimit: React.FC<BulkPaymentLimitProps> = ({
  dailyLimit,
  maxBatch,
  used,
  currency = '₹',
  showBalances,
  onViewRules,
}) => {
  const remaining = Math.max(0, dailyLimit - used);
  const percent = getUtilizationPercent(used, dailyLimit);
  const status = getLimitStatus(used, dailyLimit);

  return (
    <LimitsCard ariaLabel="Bulk payment limit">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
            Bulk Payment Limit
          </h2>
          <LimitStatusBadge
            status={status}
            message={getStatusMessage(status, remaining, currency, showBalances)}
          />
        </div>

        <LimitsRow label="Daily Limit" value={maskAmount(dailyLimit, currency, showBalances)} />
        <LimitsRow
          label="Maximum Batch"
          value={maskAmount(maxBatch, currency, showBalances)}
        />
        <LimitsRow label="Used Today" value={maskAmount(used, currency, showBalances)} />
        <LimitsRow
          label="Remaining"
          value={maskAmount(remaining, currency, showBalances)}
          valueClassName="text-[#16A34A]"
        />

        <div className="mt-3">
          <AccessibleProgressBar
            label="Bulk utilization"
            percent={percent}
            statusLabel={`Bulk payment limit, ${percent} percent used`}
            variant={status === 'near_limit' ? 'warning' : 'primary'}
          />
        </div>

        <button
          type="button"
          onClick={onViewRules}
          className="w-full mt-4 flex items-center justify-center gap-1 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
        >
          View Bulk Payment Rules
          <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      </div>
    </LimitsCard>
  );
};
