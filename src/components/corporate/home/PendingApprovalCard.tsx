import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { CorporatePendingApproval } from '../../../types/corporateDashboard';
import { CorpCard, CorpSectionHeader, CorpSkeleton, CorpTxnStatus, formatCorpCurrency } from './shared/CorporateHomeUI';

interface PendingApprovalCardProps {
  approval: CorporatePendingApproval;
  onClick: () => void;
}

export const PendingApprovalCard: React.FC<PendingApprovalCardProps> = ({
  approval,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800/40 transition-colors min-h-11"
  >
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
        {approval.title}
      </p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{approval.subtitle}</p>
      <p className="text-[14px] font-semibold text-slate-900 dark:text-white tabular-nums mt-1">
        {formatCorpCurrency(approval.amount)}
      </p>
      {approval.createdBy && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Created by {approval.createdBy}</p>
      )}
    </div>
    <div className="flex flex-col items-end gap-2 shrink-0">
      <CorpTxnStatus status="Pending Approval" />
      <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden />
    </div>
  </button>
);

interface PendingApprovalsSectionProps {
  approvals: CorporatePendingApproval[];
  isLoading?: boolean;
  onViewAll: () => void;
  onItemClick: () => void;
}

export const PendingApprovalsSection: React.FC<PendingApprovalsSectionProps> = ({
  approvals,
  isLoading,
  onViewAll,
  onItemClick,
}) => (
  <section aria-label="Pending Approvals">
    <CorpSectionHeader
      title="Pending Approvals"
      action="View All Approvals"
      onAction={onViewAll}
    />
    {isLoading ? (
      <CorpSkeleton className="h-40 mx-4" />
    ) : approvals.length === 0 ? (
      <CorpCard className="mx-4! p-4 text-center">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          You&apos;re all caught up
        </p>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
          No approvals require your attention.
        </p>
      </CorpCard>
    ) : (
      <CorpCard className="mx-4! divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800 overflow-hidden border-slate-200 dark:border-slate-800">
        {approvals.slice(0, 3).map((approval) => (
          <PendingApprovalCard key={approval.id} approval={approval} onClick={onItemClick} />
        ))}
      </CorpCard>
    )}
  </section>
);
