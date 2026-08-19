import React from 'react';
import { LimitsCard, maskAmount } from './LimitsUI';

interface ApprovalThresholdProps {
  threshold: number;
  currency?: string;
  showBalances: boolean;
}

const EXAMPLES = [
  { amount: 250000, approval: 'Standard approval' },
  { amount: 800000, approval: 'Additional approval required' },
];

export const ApprovalThreshold: React.FC<ApprovalThresholdProps> = ({
  threshold,
  currency = '₹',
  showBalances,
}) => (
  <LimitsCard ariaLabel="Approval threshold">
    <div className="p-4">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
        Approval Threshold
      </h2>
      <p className="text-[12px] text-[#667085] mt-1">
        Transactions above this amount require additional corporate approval.
      </p>
      <p className="text-[22px] font-bold text-[#111827] dark:text-white tabular-nums mt-3">
        {maskAmount(threshold, currency, showBalances)}
      </p>

      <div className="mt-4 space-y-2">
        {EXAMPLES.map((ex) => (
          <div
            key={ex.amount}
            className="rounded-xl bg-[#F7F9FC] dark:bg-slate-800/50 border border-[#E4E7EC] dark:border-slate-800 p-3"
          >
            <div className="flex items-center justify-between gap-2 text-[13px]">
              <span className="text-[#667085]">Payment</span>
              <span className="font-semibold text-[#111827] dark:text-white tabular-nums">
                {maskAmount(ex.amount, currency, showBalances)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[12px] mt-1">
              <span className="text-[#667085]">Approval</span>
              <span className="font-medium text-[#0B5CAB]">{ex.approval}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[#667085] mt-3">
        Approval rules are configured by your corporate administrator.
      </p>
    </div>
  </LimitsCard>
);
