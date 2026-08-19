import React from 'react';
import { LimitsCard, LimitsRow, maskAmount } from './LimitsUI';

interface SingleTransactionLimitProps {
  limit: number;
  currency?: string;
  showBalances: boolean;
}

export const SingleTransactionLimit: React.FC<SingleTransactionLimitProps> = ({
  limit,
  currency = '₹',
  showBalances,
}) => (
  <LimitsCard ariaLabel="Single transaction limit">
    <div className="p-4">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
        Single Transaction Limit
      </h2>
      <p className="text-[12px] text-[#667085] mt-1">
        Maximum amount allowed for a single eligible transaction.
      </p>
      <div className="mt-3 space-y-0">
        <LimitsRow label="Maximum" value={maskAmount(limit, currency, showBalances)} />
        <LimitsRow
          label="Available for single transaction"
          value={maskAmount(limit, currency, showBalances)}
        />
      </div>
      <p className="text-[11px] text-[#667085] mt-3">
        Limits may vary by transaction type and corporate policy.
      </p>
    </div>
  </LimitsCard>
);
