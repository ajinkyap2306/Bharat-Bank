import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBanking } from '../../../../context/BankingContext';
import { clonePreferences } from '../../../../data/corporateAccountPreferencesMock';
import {
  fetchApprovalDetail,
  submitApprovalAction,
} from '../../../../data/corporateApprovalDetailsMock';
import {
  APPROVAL_RESULT_TOAST_KEY,
  buildApprovalResult,
  saveApprovalResult,
} from '../../../../data/corporateApprovalResultMock';
import type {
  ApprovalLimitInfo,
  CorporateApprovalDetail,
} from '../../../../types/corporateApprovalDetails';
import type { ApprovalDocument } from '../../../../types/corporateApprovalDetails';
import { ApprovalDetailsHeader } from './ApprovalDetailsHeader';
import { ApprovalStatusHero } from './ApprovalStatusHero';
import { ApprovalReference } from './ApprovalReference';
import { PaymentSummary } from './PaymentSummary';
import { PaymentDetails } from './PaymentDetails';
import { BeneficiaryVerification } from './BeneficiaryVerification';
import { DebitAccountCheck } from './DebitAccountCheck';
import { PaymentLimitCheck } from './PaymentLimitCheck';
import { RequestorInformation } from './RequestorInformation';
import { ApprovalTimeline } from './ApprovalTimeline';
import { ApprovalHistory } from './ApprovalHistory';
import { RiskWarning } from './RiskWarning';
import { SupportingDocuments } from './SupportingDocuments';
import { MakerComment } from './MakerComment';
import { ApproverComment } from './ApproverComment';
import { ApprovalActionsBar } from './ApprovalActionsBar';
import { ApproveConfirmationSheet } from './ApproveConfirmationSheet';
import { RejectConfirmationSheet } from './RejectConfirmationSheet';
import { ReturnChangesSheet } from './ReturnChangesSheet';
import { ApprovalAuthenticationSheet } from './ApprovalAuthenticationSheet';
import { ApprovalMoreSheet } from './ApprovalMoreSheet';
import { AlreadyProcessedState } from './AlreadyProcessedState';
import { ApprovalErrorState } from './ApprovalErrorState';
import { ApprovalDetailsSkeleton } from './ApprovalDetailsSkeleton';

type ViewMode =
  | 'detail'
  | 'already_processed'
  | 'session_expired'
  | 'not_found';

function buildLimitInfo(amount: number): ApprovalLimitInfo {
  const dailyLimit = 5000000;
  const usedBefore = 1250000;
  const remainingAfter = dailyLimit - usedBefore - amount;
  return {
    dailyLimit,
    usedBefore,
    thisPayment: amount,
    remainingAfter,
    withinLimit: remainingAfter >= 0,
  };
}

export const ApprovalDetails: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, closeDetailFlow, openDetailFlow, corporateSession } = useBanking();

  const approvalId = useMemo(() => {
    const match = location.pathname.match(/^\/corporate\/approvals\/([^/]+)\/?$/);
    return match?.[1] ?? '';
  }, [location.pathname]);

  const [detail, setDetail] = useState<CorporateApprovalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('detail');
  const [approverComment, setApproverComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const demoState = searchParams.get('state');
  const hideAmounts = clonePreferences('acc_corp_op_01')?.hideBalance ?? false;

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchApprovalDetail(approvalId, false, corporateSession?.role);
      if (!data) {
        setViewMode('not_found');
        setDetail(null);
        return;
      }

      if (demoState === 'already_processed') {
        setViewMode('already_processed');
      } else if (demoState === 'session_expired') {
        setViewMode('session_expired');
      } else {
        setViewMode('detail');
      }

      if (demoState === 'insufficient_balance' && data.sourceAccount) {
        setDetail({
          ...data,
          sourceAccount: {
            ...data.sourceAccount,
            sufficientBalance: false,
            availableBalance: 100000,
            balanceAfter: -150025,
          },
        });
        return;
      }

      setDetail(data);
    } catch {
      setError(true);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [approvalId, demoState, corporateSession?.role]);

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

  const limitInfo = useMemo(() => {
    if (!detail?.amount) return null;
    return buildLimitInfo(detail.amount);
  }, [detail?.amount]);

  const canApprove = useMemo(() => {
    if (!detail || viewMode !== 'detail') return false;
    if (!detail.canAct || detail.status !== 'pending_yours') return false;
    if (detail.beneficiary && !detail.beneficiary.verified) return false;
    if (detail.sourceAccount && !detail.sourceAccount.sufficientBalance) return false;
    if (limitInfo && !limitInfo.withinLimit) return false;
    return true;
  }, [detail, viewMode, limitInfo]);

  const handleBack = () => navigate('/corporate/approvals');

  const handleCopy = () => {
    addToast({ type: 'success', title: 'Copied to clipboard', message: '' });
  };

  const handleApproveConfirm = () => {
    setShowApprove(false);
    setShowAuth(true);
  };

  const goToResult = (action: 'approve' | 'reject' | 'return', payload: { reason?: string; comment?: string }) => {
    if (!detail) return;
    const result = buildApprovalResult(detail, action, payload);
    saveApprovalResult(result);
    sessionStorage.removeItem(APPROVAL_RESULT_TOAST_KEY);
    navigate(`/corporate/approvals/${detail.approvalId}/result`, { replace: true });
  };

  const handleAuthConfirm = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await submitApprovalAction('approve', detail, { comment: approverComment }, corporateSession?.role);
      setShowAuth(false);
      goToResult('approve', { comment: approverComment });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await submitApprovalAction('reject', detail, { reason, comment: approverComment }, corporateSession?.role);
      setShowReject(false);
      goToResult('reject', { reason, comment: approverComment });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async (comment: string) => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await submitApprovalAction('return', detail, { comment }, corporateSession?.role);
      setShowReturn(false);
      goToResult('return', { comment });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDocumentView = (doc: ApprovalDocument) => {
    addToast({ type: 'info', title: 'Opening document', message: doc.name });
  };

  const handleDocumentDownload = (doc: ApprovalDocument) => {
    addToast({ type: 'success', title: 'Download started', message: doc.name });
  };

  if (loading) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ApprovalDetailsHeader onBack={handleBack} onMore={() => {}} />
        <ApprovalDetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ApprovalDetailsHeader onBack={handleBack} onMore={() => {}} />
        <ApprovalErrorState onRetry={load} onBack={handleBack} />
      </div>
    );
  }

  if (viewMode === 'not_found' || !detail) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ApprovalDetailsHeader onBack={handleBack} onMore={() => {}} />
        <ApprovalErrorState
          message="Approval request not found."
          onRetry={load}
          onBack={handleBack}
        />
      </div>
    );
  }

  if (viewMode === 'session_expired') {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ApprovalDetailsHeader onBack={handleBack} onMore={() => {}} />
        <div className="max-w-[430px] mx-auto px-4 py-12 text-center">
          <h2 className="text-[18px] font-semibold text-slate-900 dark:text-white">
            Your session has expired
          </h2>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'already_processed') {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ApprovalDetailsHeader onBack={handleBack} onMore={() => {}} />
        <AlreadyProcessedState onRefresh={load} onBack={handleBack} />
      </div>
    );
  }

  const showActions = detail.canAct && detail.status === 'pending_yours';

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-44">
      <ApprovalDetailsHeader onBack={handleBack} onMore={() => setShowMore(true)} />

      <motion.div
        className="space-y-4 pt-4 max-w-[430px] mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <ApprovalStatusHero detail={detail} hideAmounts={hideAmounts} />
        <ApprovalReference
          approvalId={detail.approvalId}
          paymentId={detail.paymentId}
          onCopied={handleCopy}
        />
        <PaymentSummary detail={detail} hideAmounts={hideAmounts} />
        <PaymentDetails detail={detail} />
        {detail.beneficiary && (
          <BeneficiaryVerification beneficiary={detail.beneficiary} />
        )}
        {detail.sourceAccount && (
          <DebitAccountCheck
            account={detail.sourceAccount}
            totalDebit={detail.paymentDetails?.totalDebit}
            hideAmounts={hideAmounts}
            currency={detail.currency}
          />
        )}
        {limitInfo && <PaymentLimitCheck limit={limitInfo} currency={detail.currency} />}
        <RequestorInformation requestor={detail.requestor} />
        <ApprovalTimeline events={detail.timeline} />
        <ApprovalHistory entries={detail.previousApprovals} />
        <RiskWarning warnings={detail.warnings} />
        <SupportingDocuments
          documents={detail.documents}
          onView={handleDocumentView}
          onDownload={handleDocumentDownload}
        />
        {detail.makerComment && <MakerComment comment={detail.makerComment} />}
        {showActions && (
          <ApproverComment
            value={approverComment}
            onChange={setApproverComment}
            disabled={actionLoading}
          />
        )}
      </motion.div>

      {showActions && (
        <ApprovalActionsBar
          onApprove={() => setShowApprove(true)}
          onReject={() => setShowReject(true)}
          onReturn={() => setShowReturn(true)}
          approveDisabled={!canApprove}
          secondaryDisabled={actionLoading}
          loading={actionLoading}
        />
      )}

      <ApproveConfirmationSheet
        isOpen={showApprove}
        detail={detail}
        onClose={() => setShowApprove(false)}
        onConfirm={handleApproveConfirm}
      />
      <RejectConfirmationSheet
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        loading={actionLoading}
      />
      <ReturnChangesSheet
        isOpen={showReturn}
        onClose={() => setShowReturn(false)}
        onConfirm={handleReturn}
        loading={actionLoading}
      />
      <ApprovalAuthenticationSheet
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onConfirm={handleAuthConfirm}
        processing={actionLoading}
      />
      <ApprovalMoreSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        onViewHistory={() => navigate(`/corporate/approvals/${approvalId}/history`)}
        onDownload={() =>
          addToast({ type: 'success', title: 'Details downloaded', message: 'Approval details saved.' })
        }
        onReport={() =>
          addToast({ type: 'info', title: 'Report submitted', message: 'Your issue has been logged.' })
        }
      />
    </div>
  );
};
