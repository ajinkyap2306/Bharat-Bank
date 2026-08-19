import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBulkBatchId } from '../../../../utils/bulkPaymentRoutes';
import { useBanking } from '../../../../context/BankingContext';
import { fetchBulkPaymentResults } from '../../../../data/corporateBulkPaymentResultsMock';
import type {
  BulkPaymentResultItem,
  BulkPaymentResultsData,
  BulkPaymentResultStatus,
} from '../../../../types/corporateBulkPaymentResults';
import { formatPaymentCurrency, PayCard } from '../../payments/shared/CorporatePaymentsUI';
import { BulkPaymentErrorState } from '../BulkPaymentErrorState';

const TABS: { id: BulkPaymentResultStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'successful', label: 'Successful' },
  { id: 'processing', label: 'Processing' },
  { id: 'failed', label: 'Failed' },
];

const statusTone: Record<BulkPaymentResultStatus, string> = {
  successful: 'bg-emerald-50 text-emerald-700',
  processing: 'bg-blue-50 text-blue-700',
  failed: 'bg-rose-50 text-rose-700',
  rejected: 'bg-slate-100 text-slate-600',
};

export const BulkPaymentResults: React.FC = () => {
  const batchId = useBulkBatchId();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, openDetailFlow, closeDetailFlow } = useBanking();

  const [data, setData] = useState<BulkPaymentResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<BulkPaymentResultStatus | 'all'>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow();
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchBulkPaymentResults(batchId);
      if (!result) {
        setError(true);
        setData(null);
      } else {
        setData(result);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let items: BulkPaymentResultItem[] = data.items;
    if (activeTab !== 'all') {
      items = items.filter((i) => i.status === activeTab);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) =>
          i.beneficiaryName.toLowerCase().includes(q) ||
          i.paymentId?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [data, activeTab, query]);

  const handleBack = () => navigate(`/corporate/bulk-payments/${batchId}/submitted`);

  if (loading) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-8">
        <header className="sticky top-0 z-10 bg-[#F7F9FC]/95 backdrop-blur-md border-b border-[#E4E7EC] px-4 py-3 safe-top">
          <h1 className="text-[17px] font-semibold text-[#111827]">Payment Results</h1>
        </header>
        <div className="p-4 space-y-3">
          <div className="h-28 rounded-2xl bg-slate-200/60 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-200/60 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <BulkPaymentErrorState onRetry={load} />
      </div>
    );
  }

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-8">
      <header className="sticky top-0 z-10 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 px-4 py-3 safe-top">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm font-semibold text-[#0B5CAB]"
          >
            Back
          </button>
          <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white flex-1 truncate">
            Payment Results
          </h1>
        </div>
        <p className="text-[12px] text-[#667085] mt-1 font-mono">{data.batchRef}</p>
      </header>

      <div className="space-y-4 pt-4 px-1">
        <PayCard className="p-4 mx-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-[11px] text-[#667085]">Successful</p>
              <p className="text-xl font-bold text-[#16A34A]">{data.successfulCount}</p>
              <p className="text-[11px] text-[#667085] tabular-nums">
                {formatPaymentCurrency(data.successfulAmount)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#667085]">Failed</p>
              <p className="text-xl font-bold text-[#DC2626]">{data.failedCount}</p>
              <p className="text-[11px] text-[#667085] tabular-nums">
                {formatPaymentCurrency(data.failedAmount)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#667085]">Processing</p>
              <p className="text-xl font-bold text-[#0B5CAB]">{data.processingCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#667085]">Total</p>
              <p className="text-xl font-bold">{data.totalPayments}</p>
              <p className="text-[11px] text-[#667085] tabular-nums">
                {formatPaymentCurrency(data.totalAmount)}
              </p>
            </div>
          </div>
        </PayCard>

        <div className="px-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beneficiary or payment ID"
            className="w-full rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm min-h-11"
          />
        </div>

        <div className="flex gap-2 px-3 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold ${
                activeTab === tab.id
                  ? 'bg-[#0B5CAB] text-white'
                  : 'bg-white dark:bg-slate-900 border border-[#E4E7EC] text-[#667085]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-2 px-3">
          {filtered.map((item) => (
            <PayCard key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111827] dark:text-white">
                    {item.beneficiaryName}
                  </p>
                  <p className="text-[12px] text-[#667085]">
                    {item.maskedAccount} · {item.bankName}
                  </p>
                  {item.paymentId && (
                    <p className="text-[11px] font-mono text-[#667085] mt-1">{item.paymentId}</p>
                  )}
                  {item.failureReason && (
                    <p className="text-[12px] text-[#DC2626] mt-1">{item.failureReason}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusTone[item.status]}`}
                  >
                    {item.statusLabel}
                  </span>
                  <p className="text-sm font-bold tabular-nums mt-2">
                    {formatPaymentCurrency(item.amount)}
                  </p>
                </div>
              </div>
            </PayCard>
          ))}
        </div>

        <div className="px-3 flex gap-2">
          <button
            type="button"
            onClick={() =>
              addToast({
                type: 'success',
                title: 'Results downloaded',
                message: 'Batch payment results saved to your device.',
              })
            }
            className="flex-1 py-3 rounded-2xl border border-[#E4E7EC] font-semibold text-sm text-[#0B5CAB] min-h-11"
          >
            Download Results
          </button>
          <button
            type="button"
            onClick={() =>
              addToast({ type: 'info', title: 'Export', message: 'CSV export ready for download.' })
            }
            className="flex-1 py-3 rounded-2xl bg-[#0B5CAB] text-white font-semibold text-sm min-h-11"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};
