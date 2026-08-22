import React from 'react';
import { ChevronRight } from 'lucide-react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { CorporateApprovalItem } from '../../../../types/corporateApprovalsDashboard';
import { ApprovalTypeIcon } from './ApprovalTypeIcon';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';
import { ApprovalPriorityBadge } from './ApprovalPriorityBadge';
import { ApprovalProgress } from './ApprovalProgress';

interface ApprovalCardProps {
  item: CorporateApprovalItem;
  hideAmounts?: boolean;
  onClick: () => void;
  compact?: boolean;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  item,
  hideAmounts = false,
  onClick,
  compact = false,
}) => {
  const amountText =
    item.amount !== undefined
      ? hideAmounts
        ? '₹••••••'
        : formatPaymentCurrency(item.amount, item.currency)
      : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left active:bg-slate-50 dark:active:bg-slate-800/40 ${
        compact ? 'px-4 py-3.5' : 'mx-4 max-w-[calc(100%-2rem)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs'
      }`}
      aria-label={`${item.typeLabel} ${item.title}`}
    >
      <div className="flex items-start gap-3">
        <ApprovalTypeIcon type={item.type} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-congress-blue-700 dark:text-congress-blue-400 dark:text-blue-400">{item.typeLabel}</p>
          <div className="flex items-start justify-between gap-2 mt-0.5">
            <p className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
              {item.title}
            </p>
            {amountText && (
              <p className="text-[14px] font-extrabold text-slate-900 dark:text-white tabular-nums shrink-0">
                {amountText}
              </p>
            )}
          </div>
          {item.description && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{item.description}</p>
          )}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            {item.createdBy} · {item.createdAt}
          </p>
          {item.totalSteps > 0 && (
            <div className="mt-2">
              <ApprovalProgress
                steps={item.approvalSteps}
                completedSteps={item.completedSteps}
                totalSteps={item.totalSteps}
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <ApprovalStatusBadge status={item.status} label={item.statusLabel} />
            <ApprovalPriorityBadge
              priority={item.priority}
              dueLabel={item.dueLabel}
              isOverdue={item.isOverdue}
            />
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-1" aria-hidden />
      </div>
    </button>
  );
};
