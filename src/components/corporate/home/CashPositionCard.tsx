import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { CorporateCashPosition } from '../../../types/corporateDashboard';
import { CorpCard, CorpSkeleton, formatCorpCurrency } from './shared/CorporateHomeUI';

interface CashPositionCardProps {
  data: CorporateCashPosition;
  isLoading?: boolean;
  onViewAccounts: () => void;
}

export const CashPositionCard: React.FC<CashPositionCardProps> = ({
  data,
  isLoading,
  onViewAccounts,
}) => {
  const [hidden, setHidden] = useState(false);

  if (isLoading) return <CorpSkeleton className="h-48 mx-4" />;

  const mask = (value: string) => (hidden ? '••••••' : value);

  return (
    <CorpCard className="mx-4! p-4 shadow-sm border-[#E4E7EC]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-medium text-[#667085]">Total Cash Position</p>
        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          className="flex items-center gap-1 text-[12px] font-medium text-[#0B5CAB] min-h-11 px-1"
          aria-label={hidden ? 'Show balance' : 'Hide balance'}
        >
          {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          Hide Balance
        </button>
      </div>

      <p className="text-[24px] font-semibold text-[#111827] dark:text-white tracking-tight tabular-nums">
        {mask(formatCorpCurrency(data.totalBalance))}
      </p>

      <div className="mt-4 pt-4 border-t border-[#E4E7EC] dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">Available Balance</span>
          <span className="text-[15px] font-semibold text-[#111827] dark:text-white tabular-nums">
            {mask(formatCorpCurrency(data.availableBalance))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">Today&apos;s Inflow</span>
          <span className="text-[15px] font-semibold text-[#16A34A] tabular-nums">
            {hidden ? '••••••' : `+ ${formatCorpCurrency(data.todayInflow)}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">Today&apos;s Outflow</span>
          <span className="text-[15px] font-semibold text-[#DC2626] tabular-nums">
            {hidden ? '••••••' : `− ${formatCorpCurrency(data.todayOutflow)}`}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewAccounts}
        className="mt-4 w-full py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12 active:scale-[0.99] transition-transform"
      >
        View Accounts
      </button>
    </CorpCard>
  );
};
