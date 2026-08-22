import React from 'react';
import type { ApprovalPriority } from '../../../../types/corporateApprovalsDashboard';

interface ApprovalPriorityBadgeProps {
  priority: ApprovalPriority;
  dueLabel?: string;
  isOverdue?: boolean;
}

export const ApprovalPriorityBadge: React.FC<ApprovalPriorityBadgeProps> = ({
  priority,
  dueLabel,
  isOverdue,
}) => {
  if (isOverdue) {
    return (
      <span className="text-[11px] font-semibold text-[#DC2626]">Overdue</span>
    );
  }

  if (priority === 'urgent') {
    return (
      <span className="text-[11px] font-semibold text-[#DC2626]">
        Urgent{dueLabel ? ` · ${dueLabel}` : ''}
      </span>
    );
  }

  if (priority === 'high') {
    return (
      <span className="text-[11px] font-medium text-[#F59E0B]">
        High Priority{dueLabel ? ` · ${dueLabel}` : ''}
      </span>
    );
  }

  if (dueLabel) {
    return <span className="text-[11px] text-slate-500 dark:text-slate-400">{dueLabel}</span>;
  }

  return null;
};
