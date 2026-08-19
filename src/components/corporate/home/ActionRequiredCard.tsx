import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { CorporateApprovalSummary } from '../../../types/corporateDashboard';
import { CorpCard, CorpSectionHeader, CorpSkeleton } from './shared/CorporateHomeUI';

interface ActionRequiredCardProps {
  summary: CorporateApprovalSummary;
  isLoading?: boolean;
  onReviewAll: () => void;
}

export const ActionRequiredCard: React.FC<ActionRequiredCardProps> = ({
  summary,
  isLoading,
  onReviewAll,
}) => (
  <section aria-label="Action Required">
    <CorpSectionHeader title="Action Required" />
    {isLoading ? (
      <CorpSkeleton className="h-36 mx-4" />
    ) : summary.total === 0 ? (
      <CorpCard className="mx-4! p-4 text-center border-[#E4E7EC]">
        <p className="text-sm font-semibold text-[#111827] dark:text-white">
          You&apos;re all caught up
        </p>
        <p className="text-[13px] text-[#667085] mt-1">
          No approvals require your attention.
        </p>
      </CorpCard>
    ) : (
      <CorpCard className="mx-4! p-4 border-[#F59E0B]/30 bg-amber-50/40 dark:bg-amber-950/15 shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4.5 h-4.5 text-[#F59E0B]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[#111827] dark:text-white">
              {summary.total} items need your attention
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px] text-[#667085]">
              {summary.payments > 0 && <span>{summary.payments} Payments</span>}
              {summary.beneficiaries > 0 && <span>{summary.beneficiaries} Beneficiaries</span>}
              {summary.payroll > 0 && <span>{summary.payroll} Payroll</span>}
              {summary.userRequests > 0 && <span>{summary.userRequests} User Request</span>}
            </div>
            <button
              type="button"
              onClick={onReviewAll}
              className="mt-3 w-full py-2.5 rounded-xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-11"
            >
              Review All
            </button>
          </div>
        </div>
      </CorpCard>
    )}
  </section>
);
