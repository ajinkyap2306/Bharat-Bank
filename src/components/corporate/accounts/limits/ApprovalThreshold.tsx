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
      <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
        Approval Threshold
      </h2>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
        Transactions above this amount require additional corporate approval.
      </p>
      <p className="text-[22px] font-bold text-slate-900 dark:text-white tabular-nums mt-3">
        {maskAmount(threshold, currency, showBalances)}
      </p>

      <div className="mt-4 space-y-2">
        {EXAMPLES.map((ex) => (
          <div
            key={ex.amount}
            className="rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3"
          >
            <div className="flex items-center justify-between gap-2 text-[13px]">
              <span className="text-slate-500 dark:text-slate-400">Payment</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {maskAmount(ex.amount, currency, showBalances)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-[12px] mt-1">
              <span className="text-slate-500 dark:text-slate-400">Approval</span>
              <span className="font-medium text-congress-blue-700 dark:text-congress-blue-400">{ex.approval}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
        Approval rules are configured by your corporate administrator.
      </p>
    </div>
  </LimitsCard>
);
