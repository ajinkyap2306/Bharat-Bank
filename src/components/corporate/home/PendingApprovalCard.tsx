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
    className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-[#F7F9FC] dark:hover:bg-slate-800/40 transition-colors min-h-11"
  >
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-[#111827] dark:text-white truncate">
        {approval.title}
      </p>
      <p className="text-[12px] text-[#667085] mt-0.5">{approval.subtitle}</p>
      <p className="text-[14px] font-semibold text-[#111827] dark:text-white tabular-nums mt-1">
        {formatCorpCurrency(approval.amount)}
      </p>
      {approval.createdBy && (
        <p className="text-[11px] text-[#667085] mt-0.5">Created by {approval.createdBy}</p>
      )}
    </div>
    <div className="flex flex-col items-end gap-2 shrink-0">
      <CorpTxnStatus status="Pending Approval" />
      <ChevronRight className="w-4 h-4 text-[#667085]" aria-hidden />
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
        <p className="text-sm font-semibold text-[#111827] dark:text-white">
          You&apos;re all caught up
        </p>
        <p className="text-[13px] text-[#667085] mt-1">
          No approvals require your attention.
        </p>
      </CorpCard>
    ) : (
      <CorpCard className="mx-4! divide-y divide-[#E4E7EC] dark:divide-slate-800 overflow-hidden border-[#E4E7EC]">
        {approvals.slice(0, 3).map((approval) => (
          <PendingApprovalCard key={approval.id} approval={approval} onClick={onItemClick} />
        ))}
      </CorpCard>
    )}
  </section>
);
