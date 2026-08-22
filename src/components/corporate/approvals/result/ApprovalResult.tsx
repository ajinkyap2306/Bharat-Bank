import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBanking } from '../../../../context/BankingContext';
import {
  APPROVAL_RESULT_TOAST_KEY,
  fetchApprovalResult,
} from '../../../../data/corporateApprovalResultMock';
import type { CorporateApprovalResultData } from '../../../../types/corporateApprovalResult';
import { ResultHeader } from './ResultHeader';
import { ResultHero } from './ResultHero';
import { RequestSummary } from './RequestSummary';
import { ActionDetails } from './ActionDetails';
import { ResultTimeline } from './ResultTimeline';
import { NextApprovalCard } from './NextApprovalCard';
import { FinalApprovalCard } from './FinalApprovalCard';
import { RejectionReason } from './RejectionReason';
import { ReturnComment } from './ReturnComment';
import { ResultAlreadyProcessed } from './ResultAlreadyProcessed';
import { ActionFailedState } from './ActionFailedState';
import { ConfirmationActions } from './ConfirmationActions';
import { ResultMoreSheet } from './ResultMoreSheet';
import { ApprovalResultSkeleton } from './ApprovalResultSkeleton';

export const ApprovalResult: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const approvalId = useMemo(() => {
    const match = location.pathname.match(/^\/corporate\/approvals\/([^/]+)\/result\/?$/);
    return match?.[1] ?? '';
  }, [location.pathname]);

  const [data, setData] = useState<CorporateApprovalResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const toastShown = useRef(false);

  const variant = searchParams.get('variant');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchApprovalResult(approvalId, variant);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [approvalId, variant]);

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

  useEffect(() => {
    if (!data || toastShown.current) return;
    const alreadyShown = sessionStorage.getItem(APPROVAL_RESULT_TOAST_KEY) === 'true';
    if (alreadyShown) return;

    if (data.status === 'rejected') {
      addToast({ type: 'info', title: 'Payment rejected successfully', message: '' });
    } else if (data.status === 'returned') {
      addToast({ type: 'info', title: 'Request returned to maker', message: '' });
    } else if (data.status === 'approved_next' || data.status === 'approved_final') {
      addToast({
        type: 'success',
        title: 'Approval action completed successfully',
        message: '',
      });
    }
    sessionStorage.setItem(APPROVAL_RESULT_TOAST_KEY, 'true');
    toastShown.current = true;
  }, [data, addToast]);

  const handleBack = () => navigate('/corporate/approvals');

  const handleViewApproval = () => navigate(`/corporate/approvals/${approvalId}`);

  const handleViewPayment = () => {
    if (data?.paymentId) {
      navigate(`/corporate/payments/${data.paymentId}`);
    }
  };

  const handleDownload = () => {
    const label =
      data?.status === 'rejected'
        ? 'Rejection confirmation downloaded'
        : data?.status === 'returned'
          ? 'Return confirmation downloaded'
          : 'Approval confirmation downloaded';
    addToast({ type: 'success', title: label, message: 'Saved to your device.' });
  };

  const handleShare = async () => {
    if (!data) return;
    const text = [
      `Approval Status: ${data.status}`,
      `Request: ${data.requestType}`,
      `Beneficiary: ${data.beneficiary}`,
      data.amount ? `Amount: ₹${data.amount.toLocaleString('en-IN')}` : '',
      `Approval ID: ${data.approvalId}`,
      data.paymentId ? `Payment ID: ${data.paymentId}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Approval confirmation', text });
      } else {
        await navigator.clipboard.writeText(text);
        addToast({ type: 'info', title: 'Copied to clipboard', message: 'Confirmation details copied.' });
      }
    } catch {
      // cancelled
    }
  };

  const handlePaymentIdCopied = () => {
    addToast({ type: 'success', title: 'Payment ID copied', message: '' });
  };

  const handleRetry = () => navigate(`/corporate/approvals/${approvalId}`);

  if (loading || !data) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ResultHeader onBack={handleBack} onMore={() => {}} />
        <ApprovalResultSkeleton />
      </div>
    );
  }

  const downloadLabel =
    data.status === 'rejected'
      ? 'Download Confirmation'
      : data.status === 'returned'
        ? 'Download Confirmation'
        : 'Download Confirmation';

  const showStickyCta =
    data.status === 'rejected' || data.status === 'returned';

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-32">
      <ResultHeader onBack={handleBack} onMore={() => setShowMore(true)} />

      <motion.div
        className="space-y-4 pt-4 max-w-[430px] mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <ResultHero status={data.status} />
        <RequestSummary data={data} onPaymentIdCopied={handlePaymentIdCopied} />
        <ActionDetails data={data} />

        {data.status === 'approved_next' && (
          <NextApprovalCard data={data} onViewApprovalStatus={handleViewApproval} />
        )}
        {data.status === 'approved_final' && (
          <FinalApprovalCard data={data} onViewPayment={handleViewPayment} />
        )}
        {data.status === 'already_processed' && (
          <ResultAlreadyProcessed
            currentStatus={data.currentWorkflowStatus}
            onRefresh={load}
            onBack={handleBack}
          />
        )}
        {data.status === 'failed' && (
          <ActionFailedState onRetry={handleRetry} onBack={handleViewApproval} />
        )}

        <RejectionReason data={data} />
        <ReturnComment data={data} />

        {data.status !== 'failed' && data.status !== 'already_processed' && (
          <ResultTimeline steps={data.timeline} />
        )}

        {data.status !== 'failed' && (
          <ConfirmationActions
            onDownload={handleDownload}
            onShare={handleShare}
            downloadLabel={downloadLabel}
          />
        )}
      </motion.div>

      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-[430px] mx-auto space-y-2">
            <button
              type="button"
              onClick={data.status === 'returned' ? handleViewPayment : handleViewPayment}
              className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-[15px] font-semibold min-h-12"
            >
              {data.status === 'returned' ? 'View Request' : 'View Payment'}
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[15px] font-semibold min-h-12"
            >
              Back to Approvals
            </button>
          </div>
        </div>
      )}

      <ResultMoreSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        onViewRequest={handleViewApproval}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      <span className="sr-only" aria-live="polite">
        {data.status === 'approved_next' &&
          `Approval successful. Vendor payment of ${data.amount?.toLocaleString('en-IN')} rupees has been approved. One additional approval is required.`}
      </span>
    </div>
  );
};
