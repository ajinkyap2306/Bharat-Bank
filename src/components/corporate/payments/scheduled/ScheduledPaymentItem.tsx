import React from 'react';
import { ChevronRight, Calendar } from 'lucide-react';
import type { ScheduledPaymentListItem } from '../../../../types/corporateScheduledPayments';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { ScheduledStatusBadge } from './ScheduledStatusBadge';

interface ScheduledPaymentItemProps {
  item: ScheduledPaymentListItem;
  showBalances: boolean;
  onSelect: (id: string) => void;
}

export const ScheduledPaymentItem: React.FC<ScheduledPaymentItemProps> = ({
  item,
  showBalances,
  onSelect,
}) => (
  <button
    type="button"
    onClick={() => onSelect(item.id)}
    className="w-full flex items-start gap-3 p-4 min-h-[80px] active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-congress-blue-500"
  >
    <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0 mt-0.5">
      <Calendar className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
    </span>
    <div className="flex-1 min-w-0 text-left">
      <p className="text-[14px] font-semibold text-slate-900 dark:text-white truncate">{item.beneficiaryName}</p>
      <p className="text-[15px] font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
        {showBalances ? formatPaymentCurrency(item.amount, item.currency) : '••••••'}
      </p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
        {item.scheduledDate} • {item.executionTime}
      </p>
      <div className="mt-2">
        <ScheduledStatusBadge status={item.status} />
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-3" aria-hidden />
  </button>
);
