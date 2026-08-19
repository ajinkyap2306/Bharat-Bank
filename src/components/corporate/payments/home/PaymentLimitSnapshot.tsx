import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { PaymentLimitSnapshot } from '../../../../types/corporatePaymentsHome';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard } from './PaymentsHomeUI';

interface PaymentLimitSnapshotProps {
  limits: PaymentLimitSnapshot;
  currency?: string;
  showBalances: boolean;
  onViewLimits: () => void;
}

export const PaymentLimitSnapshotCard: React.FC<PaymentLimitSnapshotProps> = ({
  limits,
  currency = '₹',
  showBalances,
  onViewLimits,
}) => {
  const percent = Math.min(
    100,
    Math.round((limits.used / limits.dailyLimit) * 100)
  );

  return (
    <PayHomeCard ariaLabel="Today's payment limit">
      <div className="p-4">
        <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
          Today&apos;s Payment Limit
        </h2>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#667085]">Used</span>
            <span className="font-semibold text-[#111827] dark:text-white tabular-nums">
              {showBalances ? formatPaymentCurrency(limits.used, currency) : '••••••'}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#667085]">Remaining</span>
            <span className="font-semibold text-[#16A34A] tabular-nums">
              {showBalances ? formatPaymentCurrency(limits.remaining, currency) : '••••••'}
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#667085]">Daily Limit</span>
            <span className="font-semibold text-[#111827] dark:text-white tabular-nums">
              {showBalances ? formatPaymentCurrency(limits.dailyLimit, currency) : '••••••'}
            </span>
          </div>
        </div>
        <div
          className="mt-3 h-2.5 rounded-full bg-[#F7F9FC] dark:bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Payment limit ${percent} percent used`}
        >
          <div
            className="h-full rounded-full bg-[#0B5CAB] motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-[11px] text-[#667085] mt-1">{percent}% used</p>
        <button
          type="button"
          onClick={onViewLimits}
          className="w-full mt-3 flex items-center justify-center gap-1 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
        >
          View Limits
          <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      </div>
    </PayHomeCard>
  );
};
