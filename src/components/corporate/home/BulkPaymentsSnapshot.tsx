import React from 'react';
import { Layers } from 'lucide-react';
import type { CorporateBulkPaymentsSnapshot } from '../../../types/corporateDashboard';
import { CorpCard, CorpSectionHeader, CorpSkeleton } from './shared/CorporateHomeUI';

interface BulkPaymentsSnapshotProps {
  data: CorporateBulkPaymentsSnapshot;
  isLoading?: boolean;
  onViewBatches: () => void;
}

export const BulkPaymentsSnapshot: React.FC<BulkPaymentsSnapshotProps> = ({
  data,
  isLoading,
  onViewBatches,
}) => (
  <section aria-label="Bulk Payments">
    <CorpSectionHeader title="Bulk Payments" />
    {isLoading ? (
      <CorpSkeleton className="h-24 mx-4" />
    ) : (
      <CorpCard className="mx-4! p-4 border-[#E4E7EC]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
            <Layers className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#667085]">Manage vendor and batch payments</p>
            <p className="text-sm font-semibold text-[#111827] dark:text-white mt-1">
              {data.pendingBatches} batches pending
            </p>
            <button
              type="button"
              onClick={onViewBatches}
              className="mt-2 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
            >
              View Batches
            </button>
          </div>
        </div>
      </CorpCard>
    )}
  </section>
);
