import React from 'react';
import type { CorporateCollectionsSnapshot } from '../../../types/corporateDashboard';
import { CorpCard, CorpSectionHeader, CorpSkeleton, formatCorpCurrency } from './shared/CorporateHomeUI';

interface CollectionsSnapshotProps {
  data: CorporateCollectionsSnapshot;
  isLoading?: boolean;
  onViewCollections: () => void;
}

export const CollectionsSnapshot: React.FC<CollectionsSnapshotProps> = ({
  data,
  isLoading,
  onViewCollections,
}) => (
  <section aria-label="Collections">
    <CorpSectionHeader title="Collections" action="View Collections" onAction={onViewCollections} />
    {isLoading ? (
      <CorpSkeleton className="h-32 mx-4" />
    ) : data.todayTotal === 0 ? (
      <CorpCard className="mx-4! p-4 text-center">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">No collections recorded</p>
      </CorpCard>
    ) : (
      <CorpCard className="mx-4! p-4 border-slate-200 dark:border-slate-800">
        <p className="text-[12px] text-slate-500 dark:text-slate-400">Today&apos;s Collections</p>
        <p className="text-[20px] font-semibold text-slate-900 dark:text-white tabular-nums mt-1">
          {formatCorpCurrency(data.todayTotal)}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Matched</p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatCorpCurrency(data.matched)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Unmatched</p>
            <p className="text-sm font-semibold text-[#F59E0B] tabular-nums">
              {formatCorpCurrency(data.unmatched)}
            </p>
          </div>
        </div>
      </CorpCard>
    )}
  </section>
);
