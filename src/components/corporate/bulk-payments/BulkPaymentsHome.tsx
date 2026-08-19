import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Upload } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { fetchBulkPaymentsHome, clearBulkBatchDraft } from '../../../data/corporateBulkPaymentsMock';
import type { BulkPaymentsHomeData } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency } from '../payments/shared/CorporatePaymentsUI';
import { PayHomeCard } from '../payments/home/PaymentsHomeUI';
import { BulkPaymentsHeader } from './BulkPaymentsHeader';
import { BulkPaymentsMoreSheet } from './BulkPaymentsMoreSheet';
import { BulkPaymentSkeleton } from './BulkPaymentSkeleton';
import { BatchStatusBadge } from './BatchStatusBadge';
import { useCorporateMakerGate } from '../../../hooks/useCorporateMakerGate';
import { downloadBulkPaymentTemplate } from '../../../utils/bulkPaymentTemplate';

export const BulkPaymentsHome: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useBanking();
  const { canCreateBulk, blockBulkIfChecker } = useCorporateMakerGate();
  const [data, setData] = useState<BulkPaymentsHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchBulkPaymentsHome().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const handleBack = () => navigate('/corporate/payments');

  const handleCreate = () => {
    if (blockBulkIfChecker()) return;
    navigate('/corporate/bulk-payments/create');
  };

  const handleUpload = () => {
    if (blockBulkIfChecker()) return;
    clearBulkBatchDraft();
    navigate('/corporate/bulk-payments/create?action=upload');
  };

  const handleDownloadTemplate = async () => {
    await downloadBulkPaymentTemplate();
    addToast({
      type: 'success',
      title: 'Sample file downloaded',
      message: 'Bulk payment CSV template saved to your device.',
    });
  };

  if (loading || !data) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
        <BulkPaymentsHeader subtitle="Pay multiple beneficiaries in one batch" onBack={handleBack} onMore={() => {}} />
        <BulkPaymentSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto pb-4">
      <BulkPaymentsHeader
        subtitle="Pay multiple beneficiaries in one batch"
        onBack={handleBack}
        onMore={() => setShowMore(true)}
      />

      <main className="px-4 space-y-4 pt-4">
        {canCreateBulk ? (
          <section className="space-y-2">
            <button
              type="button"
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0B5CAB] text-white font-bold text-[15px] min-h-12 shadow-sm"
            >
              <Layers className="w-5 h-5" aria-hidden />
              Create Bulk Payment
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 font-bold text-sm text-[#0B5CAB] min-h-11"
            >
              <Upload className="w-4 h-4" aria-hidden />
              Upload Payment File
            </button>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="w-full text-center text-[13px] font-semibold text-[#0B5CAB] py-2 min-h-11"
            >
              Download sample CSV file
            </button>
          </section>
        ) : (
          <section className="rounded-2xl border border-[#E4E7EC] dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <p className="text-[14px] font-semibold text-[#111827] dark:text-white">View-only access</p>
            <p className="text-[12px] text-[#667085] mt-1">
              Bulk payment creation is restricted to Finance Maker. You can review batches awaiting approval.
            </p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-3">
          <PayHomeCard className="p-4 text-center">
            <p className="text-[11px] text-[#667085]">Pending Batches</p>
            <p className="text-[22px] font-bold text-[#111827] dark:text-white mt-1">{data.pendingBatches}</p>
          </PayHomeCard>
          <PayHomeCard className="p-4 text-center">
            <p className="text-[11px] text-[#667085]">Awaiting Approval</p>
            <p className="text-[16px] font-bold text-[#111827] dark:text-white mt-1">
              {formatPaymentCurrency(data.awaitingApprovalAmount)}
            </p>
          </PayHomeCard>
          <PayHomeCard className="p-4 text-center col-span-2">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-[11px] text-[#667085]">Completed This Month</p>
                <p className="text-[18px] font-bold text-[#111827] dark:text-white mt-0.5">
                  {data.completedThisMonth} Batches
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#667085]">Total</p>
                <p className="text-[16px] font-bold text-[#16A34A]">
                  {formatPaymentCurrency(data.completedThisMonthAmount)}
                </p>
              </div>
            </div>
          </PayHomeCard>
        </div>

        <section id="recent-bulk-batches">
          <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-2">Recent Batches</h2>
          <PayHomeCard className="divide-y divide-[#E4E7EC]/80 dark:divide-slate-800">
            {data.recentBatches.map((batch) => (
              <button
                key={batch.id}
                type="button"
                onClick={() => {
                  if (batch.id === 'batch_aug_vendor_01') {
                    navigate('/corporate/bulk-payments/create?demo=validated');
                  } else {
                    addToast({ type: 'info', title: batch.name, message: 'Batch details available in a future update.' });
                  }
                }}
                className="w-full flex items-center justify-between gap-3 p-4 min-h-16 text-left active:bg-slate-50 dark:active:bg-slate-800/40"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#111827] dark:text-white truncate">
                      {batch.name}
                    </p>
                    <BatchStatusBadge status={batch.status} />
                  </div>
                  <p className="text-[12px] text-[#667085] mt-0.5">{batch.date}</p>
                </div>
                <p className="text-[14px] font-bold tabular-nums shrink-0">
                  {formatPaymentCurrency(batch.amount)}
                </p>
              </button>
            ))}
          </PayHomeCard>
        </section>
      </main>

      <BulkPaymentsMoreSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        onDownloadTemplate={handleDownloadTemplate}
        onViewHistory={() => {
          setShowMore(false);
          document.getElementById('recent-bulk-batches')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onHelp={() => addToast({ type: 'info', title: 'Bulk payments help', message: 'Contact treasury support.' })}
      />
    </div>
  );
};
