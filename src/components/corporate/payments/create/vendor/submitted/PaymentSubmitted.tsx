import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBanking } from '../../../../../../context/BankingContext';
import {
  loadVendorPaymentSubmission,
  saveVendorPaymentSubmission,
  updateSubmissionStatus,
} from '../../../../../../data/corporateVendorPaymentSubmissionMock';
import type {
  VendorPaymentSubmissionData,
  VendorPaymentSubmissionStatus,
} from '../../../../../../types/corporateVendorPaymentSubmission';
import { SubmissionSuccessHeader } from './SubmissionSuccessHeader';
import { PaymentStatusState } from './PaymentStatusState';
import { PaymentAmountSummary } from './PaymentAmountSummary';
import { PaymentReferenceCard } from './PaymentReferenceCard';
import { PaymentSummary } from './PaymentSummary';
import { SubmissionDetails } from './SubmissionDetails';
import { ApprovalProgress } from './ApprovalProgress';
import { NextActionCard } from './NextActionCard';
import { ConfirmationActions } from './ConfirmationActions';
import { CancelPaymentSheet } from './CancelPaymentSheet';
import { PaymentSubmittedSkeleton } from './PaymentSubmittedSkeleton';

const PAYMENTS_HOME = '/corporate/payments';
const SUBMISSION_TOAST_KEY = 'vendorPaymentSubmissionToastShown';

const DEMO_STATUS_MAP: Record<string, VendorPaymentSubmissionStatus> = {
  submitted: 'submitted',
  'approval-in-progress': 'approval-in-progress',
  approved: 'approved',
  processing: 'processing',
  completed: 'completed',
  rejected: 'rejected',
  cancelled: 'cancelled',
  failed: 'failed',
};

export const PaymentSubmitted: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast, setBottomNavHidden, closeDetailFlow } = useBanking();

  const [data, setData] = useState<VendorPaymentSubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const toastShown = useRef(false);

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    const stored = loadVendorPaymentSubmission();
    if (!stored) {
      navigate(PAYMENTS_HOME, { replace: true });
      return;
    }

    const demoStatus = searchParams.get('status');
    const statusOverride = demoStatus ? DEMO_STATUS_MAP[demoStatus] : undefined;
    const next = statusOverride ? updateSubmissionStatus(stored, statusOverride) : stored;

    setData(next);
    if (statusOverride) {
      saveVendorPaymentSubmission(next);
    }
    setLoading(false);
  }, [navigate, searchParams]);

  useEffect(() => {
    if (!data || toastShown.current) return;
    const alreadyShown = sessionStorage.getItem(SUBMISSION_TOAST_KEY) === 'true';
    if (alreadyShown) return;

    addToast({
      type: 'success',
      title: 'Payment submitted for approval',
      message: 'Your payment request is pending corporate approval.',
    });
    sessionStorage.setItem(SUBMISSION_TOAST_KEY, 'true');
    toastShown.current = true;
  }, [data, addToast]);

  const canCancel = useMemo(
    () => Boolean(data?.canCancel && (data.status === 'submitted' || data.status === 'approval-in-progress')),
    [data]
  );

  const handleBack = () => navigate(PAYMENTS_HOME);

  const handleViewPaymentDetails = useCallback(() => {
    if (!data) return;
    navigate(`/corporate/payments/${data.paymentId}`);
  }, [data, navigate]);

  const handleViewApprovalStatus = useCallback(() => {
    if (!data) return;
    navigate(`/corporate/approvals/${data.approvalId}`);
  }, [data, navigate]);

  const handleViewTransaction = useCallback(() => {
    if (!data?.transactionId) return;
    navigate(`/corporate/accounts/${data.sourceAccount.id}/transactions/${data.transactionId}`);
  }, [data, navigate]);

  const handleDownload = useCallback(() => {
    addToast({
      type: 'success',
      title: 'Confirmation downloaded',
      message: 'Payment submission confirmation saved to your device.',
    });
  }, [addToast]);

  const handleShare = useCallback(async () => {
    if (!data) return;
    const shareText = `Payment submission confirmation\nPayment ID: ${data.paymentId}\nAmount: ₹${data.amount.toLocaleString('en-IN')}\nStatus: Pending Approval`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Payment submission confirmation',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        addToast({
          type: 'info',
          title: 'Copied to clipboard',
          message: 'Confirmation details copied for sharing.',
        });
      }
    } catch {
      // User cancelled share
    }
  }, [data, addToast]);

  const handleCopyId = useCallback(() => {
    addToast({
      type: 'success',
      title: 'Payment ID copied',
      message: data?.paymentId ?? '',
    });
  }, [addToast, data?.paymentId]);

  const handleConfirmCancel = useCallback(async () => {
    if (!data) return;
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 600));
    const cancelled = updateSubmissionStatus(data, 'cancelled');
    const withReason = {
      ...cancelled,
      cancellationReason: 'Cancelled by payment initiator',
      cancelledAt: new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      canCancel: false,
    };
    saveVendorPaymentSubmission(withReason);
    setData(withReason);
    setCancelling(false);
    setShowCancelSheet(false);
    addToast({
      type: 'info',
      title: 'Payment Cancelled',
      message: 'The payment request has been cancelled.',
    });
  }, [data, addToast]);

  const handleCreateNew = useCallback(() => {
    navigate(data?.createNewRoute ?? '/corporate/payments/create/vendor');
  }, [navigate, data?.createNewRoute]);

  if (loading || !data) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <SubmissionSuccessHeader onBack={handleBack} onMore={() => {}} />
        <PaymentSubmittedSkeleton />
      </div>
    );
  }

  const isCompleted = data.status === 'completed';
  const isRejected = data.status === 'rejected';

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-8">
      <SubmissionSuccessHeader onBack={handleBack} onMore={() => setShowMore(true)} />

      <motion.div
        className="space-y-4 pt-4 max-w-[430px] mx-auto pb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <PaymentStatusState data={data} />
        <PaymentAmountSummary data={data} />
        <PaymentReferenceCard paymentId={data.paymentId} onCopied={handleCopyId} />
        <PaymentSummary data={data} />
        <SubmissionDetails data={data} />
        <ApprovalProgress data={data} />
        <NextActionCard data={data} onViewApprovalStatus={handleViewApprovalStatus} />

        <ConfirmationActions
          showMoreSheet={showMore}
          onCloseMore={() => setShowMore(false)}
          onDownload={handleDownload}
          onShare={handleShare}
          onViewPaymentDetails={handleViewPaymentDetails}
          onViewPaymentDetailsSecondary={isRejected ? handleViewPaymentDetails : undefined}
          showCancel={canCancel}
          onCancelPayment={() => setShowCancelSheet(true)}
          showViewTransaction={isCompleted}
          onViewTransaction={handleViewTransaction}
          onDownloadReceipt={handleDownload}
          showCreateNew={isRejected}
          onCreateNewPayment={handleCreateNew}
        />
      </motion.div>

      <CancelPaymentSheet
        isOpen={showCancelSheet}
        onClose={() => setShowCancelSheet(false)}
        onKeep={() => setShowCancelSheet(false)}
        onConfirmCancel={handleConfirmCancel}
        loading={cancelling}
      />
    </div>
  );
};
