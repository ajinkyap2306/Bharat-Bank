import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBulkBatchId } from '../../../../utils/bulkPaymentRoutes';
import { useBanking } from '../../../../context/BankingContext';
import { fetchBatchTracking } from '../../../../data/corporateBulkBatchStatusMock';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { BulkPaymentErrorState } from '../BulkPaymentErrorState';
import { BatchStatusHeader } from './BatchStatusHeader';
import { BatchStatusSkeleton } from './BatchStatusSkeleton';
import { BatchStatusHero } from './BatchStatusHero';
import { BatchAmountSummary } from './BatchAmountSummary';
import { BatchReferenceCard } from './BatchReferenceCard';
import { SubmissionDetails } from './SubmissionDetails';
import { BatchSummary } from './BatchSummary';
import { ApprovalProgress } from './ApprovalProgress';
import { NextApproverCard, MakerStatusCard } from './NextApproverCard';
import { BatchLifecycle } from './BatchLifecycle';
import { PaymentResultSummary } from './PaymentResultSummary';
import { StateDetailsCard } from './StateDetailsCard';
import { BatchStatusMoreSheet } from './BatchStatusMoreSheet';

const SUBMISSION_TOAST_KEY = 'bulkSubmissionToastShown';

export const BulkPaymentSubmitted: React.FC = () => {
  const batchId = useBulkBatchId();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, openDetailFlow, closeDetailFlow, corporateSession } = useBanking();

  const [data, setData] = useState<BulkBatchTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef(0);
  const toastShown = useRef(false);

  const variant = searchParams.get('status');
  const roleParam = searchParams.get('role');
  const viewerRole =
    roleParam === 'checker' || corporateSession?.role === 'checker' ? 'checker' : 'maker';

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchBatchTracking(batchId, variant, viewerRole);
      if (!result) {
        setError(true);
        setData(null);
      } else {
        setData(result);
        setLastUpdated(new Date());
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [batchId, variant, viewerRole]);

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

  useEffect(() => {
    if (!data || toastShown.current || variant) return;
    const shown = sessionStorage.getItem(SUBMISSION_TOAST_KEY) === 'true';
    if (shown) return;
    addToast({
      type: 'success',
      title: 'Bulk payment submitted for approval',
      message: `${data.paymentCount} payments sent for corporate approval.`,
    });
    sessionStorage.setItem(SUBMISSION_TOAST_KEY, 'true');
    toastShown.current = true;
  }, [data, addToast, variant]);

  const handleBack = () => navigate('/corporate/bulk-payments');

  const handleCopy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        addToast({ type: 'success', title: 'Copied to clipboard', message: '' });
      } catch {
        addToast({ type: 'error', title: 'Copy failed', message: '' });
      }
    },
    [addToast]
  );

  const handleViewApproval = () => {
    if (!data) return;
    navigate(`/corporate/approvals/${data.approvalId}`);
  };

  const handleViewDetails = () => {
    navigate(`/corporate/bulk-payments/${batchId}/details`);
  };

  const handleViewResults = () => {
    navigate(`/corporate/bulk-payments/${batchId}/results`);
  };

  const handleDownload = () => {
    addToast({
      type: 'success',
      title: 'Bulk Payment Submission Confirmation downloaded',
      message: 'Saved to your device.',
    });
  };

  const handleShare = useCallback(async () => {
    if (!data) return;
    const text = `Bulk Payment Batch ${data.batchId} — ${data.paymentCount} payments — ${data.statusLabel} — Ref ${data.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Bulk Payment Confirmation', text });
        return;
      } catch {
        /* fall through */
      }
    }
    await handleCopy(text);
  }, [data, handleCopy]);

  const handleRefresh = () => load();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) pullStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      const dist = Math.max(0, e.touches[0].clientY - pullStartY.current);
      if (dist < 120) setPullDistance(dist);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 72) handleRefresh();
    pullStartY.current = 0;
    setPullDistance(0);
  };

  if (loading && !data) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] -mx-3">
        <BatchStatusHeader onBack={handleBack} onMore={() => {}} />
        <BatchStatusSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
        <BatchStatusHeader onBack={handleBack} onMore={() => {}} />
        <BulkPaymentErrorState
          title="Unable to load batch status"
          message="Please try again."
          onRetry={load}
        />
      </div>
    );
  }

  const showSuccessHero =
    (data.status === 'pending_approval' && !variant) || data.status === 'completed';
  const showStickyCta =
    data.status === 'pending_approval' ||
    data.status === 'processing' ||
    data.status === 'rejected' ||
    data.status === 'returned' ||
    data.status === 'partially_completed';

  const stickyLabel = (() => {
    if (data.viewerRole === 'checker' && data.status === 'pending_approval') return 'Review Batch';
    if (data.status === 'processing') return 'View Batch Details';
    if (data.status === 'rejected' || data.status === 'returned') return 'View Batch Details';
    if (data.status === 'partially_completed') return 'View Payment Results';
    return 'View Approval Status';
  })();

  const stickyAction = () => {
    if (data.status === 'partially_completed') handleViewResults();
    else if (data.status === 'processing' || data.status === 'rejected' || data.status === 'returned')
      handleViewDetails();
    else handleViewApproval();
  };

  return (
    <div
      className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] -mx-3"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div className="flex justify-center py-2 text-[#667085] text-xs" style={{ height: pullDistance }}>
          {pullDistance > 72 ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}

      <BatchStatusHeader onBack={handleBack} onMore={() => setShowMore(true)} />

      <main className={`space-y-4 pt-4 ${showStickyCta ? 'pb-28' : 'pb-8'}`}>
        {lastUpdated && (
          <p className="text-center text-[11px] text-[#667085] px-4" aria-live="polite">
            Updated just now
          </p>
        )}

        <BatchStatusHero data={data} showSuccess={showSuccessHero} />
        <BatchAmountSummary data={data} />
        <BatchReferenceCard data={data} onCopy={handleCopy} />
        <SubmissionDetails data={data} />
        <BatchSummary data={data} />
        <ApprovalProgress
          steps={data.approvalSteps}
          completedStages={data.completedApprovalStages}
          totalStages={data.totalApprovalStages}
          currentApprover={data.currentApprover}
        />
        <MakerStatusCard data={data} />
        <NextApproverCard data={data} onViewApproval={handleViewApproval} />
        <BatchLifecycle steps={data.lifecycle} />
        <StateDetailsCard data={data} />
        <PaymentResultSummary data={data} onViewResults={handleViewResults} />
      </main>

      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
          <div className="max-w-[430px] mx-auto">
            <button
              type="button"
              onClick={stickyAction}
              className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11"
            >
              {stickyLabel}
            </button>
          </div>
        </div>
      )}

      <BatchStatusMoreSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        onDownload={handleDownload}
        onShare={handleShare}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};
