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
      <CorpCard className="mx-4! p-4 border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/60 flex items-center justify-center shrink-0">
            <Layers className="w-4.5 h-4.5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-slate-500 dark:text-slate-400">Manage vendor and batch payments</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
              {data.pendingBatches} batches pending
            </p>
            <button
              type="button"
              onClick={onViewBatches}
              className="mt-2 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
            >
              View Batches
            </button>
          </div>
        </div>
      </CorpCard>
    )}
  </section>
);
