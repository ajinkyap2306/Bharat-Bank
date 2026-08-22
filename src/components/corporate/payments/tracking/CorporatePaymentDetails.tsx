import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { clonePreferences } from '../../../../data/corporateAccountPreferencesMock';
import { fetchPaymentTracking } from '../../../../data/corporatePaymentTrackingMock';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { PaymentDetailsHeader } from './PaymentDetailsHeader';
import { PaymentStatusHero } from './PaymentStatusHero';
import { PaymentAmountSummary } from './PaymentAmountSummary';
import { PaymentReferenceCard } from './PaymentReferenceCard';
import { BeneficiaryCard } from './BeneficiaryCard';
import { SourceAccountCard } from './SourceAccountCard';
import { PaymentInformation } from './PaymentInformation';
import { PaymentTimeline } from './PaymentTimeline';
import { ApprovalHistory } from './ApprovalHistory';
import { MakerInformation } from './MakerInformation';
import { ReferencesSection } from './ReferencesSection';
import { ReceiptActions } from './ReceiptActions';
import { ReportIssueSheet } from './ReportIssueSheet';
import { PaymentMoreSheet } from './PaymentMoreSheet';
import { ContextualActions } from './ContextualActions';
import { PaymentSkeleton } from './PaymentSkeleton';
import { PaymentErrorState } from './PaymentErrorState';

const PAYMENTS_HOME = '/corporate/payments';

export const CorporatePaymentDetails: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const paymentId = useMemo(() => {
    const match = location.pathname.match(/^\/corporate\/payments\/([^/]+)\/?$/);
    return match?.[1] ?? '';
  }, [location.pathname]);

  const [data, setData] = useState<CorporatePaymentTrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef(0);

  const statusVariant = searchParams.get('status');
  const hideAmounts = clonePreferences('acc_corp_op_01')?.hideBalance ?? false;

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(false);

      try {
        const result = await fetchPaymentTracking(paymentId, statusVariant);
        if (!result) {
          setError(true);
          setData(null);
        } else {
          setData(result);
        }
      } catch {
        setError(true);
        setData(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [paymentId, statusVariant]
  );

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow();
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, closeDetailFlow, openDetailFlow]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = () => navigate(-1);

  const handleCopy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        addToast({ type: 'success', title: 'Copied to clipboard', message: '' });
      } catch {
        addToast({ type: 'error', title: 'Copy failed', message: 'Unable to copy to clipboard.' });
      }
    },
    [addToast]
  );

  const handleRefresh = () => {
    load(true);
  };

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

  const handleDownloadReceipt = () => {
    addToast({
      type: 'success',
      title: 'Receipt downloaded',
      message: 'Payment receipt saved to your device.',
    });
  };

  const handleShare = useCallback(async () => {
    if (!data) return;
    const text = `Payment ${data.id} — ${data.statusLabel} — ${data.beneficiary.name}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Payment Details', text });
        return;
      } catch {
        /* fall through */
      }
    }
    await handleCopy(text);
  }, [data, handleCopy]);

  const handleReportIssue = (issue: string) => {
    addToast({
      type: 'success',
      title: 'Issue submitted successfully.',
      message: `We received your report: ${issue}`,
    });
  };

  const handleViewApproval = () => {
    if (data?.approvalId) navigate(`/corporate/approvals/${data.approvalId}`);
  };

  const handleCreateNewPayment = () => {
    navigate('/corporate/payments/create');
  };

  const hasStickyCta =
    data &&
    ['pending_approval', 'submitted', 'completed', 'rejected', 'failed'].includes(data.status);

  if (loading && !data) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 max-w-[430px] mx-auto">
        <PaymentDetailsHeader onBack={handleBack} onMore={() => {}} />
        <PaymentSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 max-w-[430px] mx-auto">
        <PaymentDetailsHeader onBack={() => navigate(PAYMENTS_HOME)} onMore={() => {}} />
        <PaymentErrorState onRetry={() => load()} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className="min-h-full bg-slate-50 dark:bg-slate-950 max-w-[430px] mx-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div
          className="flex justify-center py-2 text-slate-500 dark:text-slate-400 text-xs"
          style={{ height: pullDistance }}
          aria-hidden
        >
          {pullDistance > 72 ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}

      {refreshing && (
        <div className="flex items-center justify-center gap-2 py-2 text-slate-500 dark:text-slate-400 text-xs" aria-live="polite">
          <Loader2 className="w-3.5 h-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
          Updating…
        </div>
      )}

      <PaymentDetailsHeader onBack={handleBack} onMore={() => setShowMore(true)} />

      <main className={`space-y-4 pt-2 ${hasStickyCta ? 'pb-28' : 'pb-8'}`}>
        <PaymentStatusHero data={data} hideAmounts={hideAmounts} />
        <PaymentReferenceCard data={data} onCopy={handleCopy} />
        <PaymentAmountSummary data={data} hideAmounts={hideAmounts} />
        <BeneficiaryCard beneficiary={data.beneficiary} />
        <SourceAccountCard
          account={data.sourceAccount}
          status={data.status}
          hideAmounts={hideAmounts}
          currency={data.currency}
        />
        <PaymentInformation data={data} />
        <PaymentTimeline steps={data.timeline} />
        <ApprovalHistory entries={data.approvalHistory} />
        <MakerInformation data={data} />
        <ReferencesSection data={data} onCopy={handleCopy} />
        <ReceiptActions
          status={data.status}
          receiptAvailable={data.receiptAvailable}
          onDownload={handleDownloadReceipt}
          onShare={handleShare}
        />
      </main>

      <ContextualActions
        data={data}
        onViewApproval={handleViewApproval}
        onViewApprovalDetails={handleViewApproval}
        onDownloadReceipt={handleDownloadReceipt}
        onShareReceipt={handleShare}
        onCreateNewPayment={handleCreateNewPayment}
      />

      <PaymentMoreSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        receiptAvailable={data.receiptAvailable}
        onDownloadReceipt={handleDownloadReceipt}
        onShare={handleShare}
        onReportIssue={() => setShowReportIssue(true)}
      />

      <ReportIssueSheet
        isOpen={showReportIssue}
        onClose={() => setShowReportIssue(false)}
        onSubmit={handleReportIssue}
      />
    </div>
  );
};
