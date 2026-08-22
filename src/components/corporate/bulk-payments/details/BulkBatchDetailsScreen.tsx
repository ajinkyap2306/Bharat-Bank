import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBulkBatchId } from '../../../../utils/bulkPaymentRoutes';
import { useBanking } from '../../../../context/BankingContext';
import { fetchBatchTracking } from '../../../../data/corporateBulkBatchStatusMock';
import { fetchBulkPaymentResults } from '../../../../data/corporateBulkPaymentResultsMock';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import type { BulkPaymentResultsData } from '../../../../types/corporateBulkPaymentResults';
import { BatchStatusHeader } from '../submitted/BatchStatusHeader';
import { BulkPaymentErrorState } from '../BulkPaymentErrorState';
import { BatchStatusSkeleton } from '../submitted/BatchStatusSkeleton';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';

export const BulkBatchDetailsScreen: React.FC = () => {
  const batchId = useBulkBatchId();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, openDetailFlow, closeDetailFlow, corporateSession } = useBanking();

  const [batch, setBatch] = useState<BulkBatchTrackingData | null>(null);
  const [results, setResults] = useState<BulkPaymentResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const viewerRole = corporateSession?.role === 'checker' ? 'checker' : 'maker';

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [batchData, resultsData] = await Promise.all([
        fetchBatchTracking(batchId, null, viewerRole),
        fetchBulkPaymentResults(batchId),
      ]);
      if (!batchData) {
        setError(true);
        return;
      }
      setBatch(batchData);
      setResults(resultsData);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [batchId, viewerRole]);

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow();
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = () => navigate(`/corporate/bulk-payments/${batchId}/submitted`);

  if (loading && !batch) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 max-w-[430px] -mx-3">
        <BatchStatusHeader onBack={handleBack} onMore={() => {}} />
        <BatchStatusSkeleton />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 max-w-[430px] -mx-3">
        <BatchStatusHeader onBack={handleBack} onMore={() => {}} />
        <BulkPaymentErrorState title="Unable to load batch details" message="Please try again." onRetry={load} />
      </div>
    );
  }

  const previewItems = results?.items.slice(0, 8) ?? [];

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 max-w-[430px] -mx-3 pb-8">
      <BatchStatusHeader
        onBack={handleBack}
        onMore={() =>
          addToast({ type: 'success', title: 'Downloaded', message: 'Batch detail report saved.' })
        }
      />

      <main className="px-4 pt-4 space-y-4">
        <PayCard className="p-4">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Batch Overview</p>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">{batch.batchName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{batch.reference} • {batch.batchId}</p>
          <div className="grid grid-cols-2 gap-3 mt-4 text-[12px]">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Payments</p>
              <p className="font-bold text-slate-900 dark:text-white">{batch.paymentCount}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Total amount</p>
              <p className="font-bold text-slate-900 dark:text-white">{formatPaymentCurrency(batch.totalAmount)}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Source account</p>
              <p className="font-bold text-slate-900 dark:text-white">{batch.sourceAccount.name}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Status</p>
              <p className="font-bold text-slate-900 dark:text-white">{batch.statusLabel}</p>
            </div>
          </div>
        </PayCard>

        <PayCard className="p-4">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Validation Summary</p>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Valid rows</span><span className="font-semibold">{batch.validCount}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Errors</span><span className="font-semibold">{batch.errorCount}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Duplicates flagged</span><span className="font-semibold">{batch.duplicateCount}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Processing fee</span><span className="font-semibold">{formatPaymentCurrency(batch.fee)}</span></div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
              <span className="text-slate-500 dark:text-slate-400">Total debit</span>
              <span className="font-bold">{formatPaymentCurrency(batch.totalDebit)}</span>
            </div>
          </div>
        </PayCard>

        {previewItems.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-1">Payment Lines (preview)</p>
            {previewItems.map((item) => (
              <PayCard key={item.id} className="p-3">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.beneficiaryName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.paymentId}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums">{formatPaymentCurrency(item.amount)}</p>
                    <p className="text-[10px] capitalize text-slate-500 dark:text-slate-400">{item.status}</p>
                  </div>
                </div>
              </PayCard>
            ))}
          </div>
        )}

        {results && results.items.length > 8 && (
          <button
            type="button"
            onClick={() => navigate(`/corporate/bulk-payments/${batchId}/results`)}
            className="w-full py-3 rounded-2xl border border-congress-blue-700 text-congress-blue-700 dark:text-congress-blue-400 text-sm font-bold"
          >
            View all {results.items.length} payments
          </button>
        )}
      </main>
    </div>
  );
};
