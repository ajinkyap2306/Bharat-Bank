import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { BankAccount } from '../../../types/banking';
import type { JointApprovalStep, JointTransferRequest } from '../../../types/retailJointTransfer';
import {
  canUserApproveJointRequest,
  canUserActAsJointChecker,
  canUserInitiateJointRequest,
  getJointRequestListAmount,
  getJointRequestListTitle,
  getJointRequestProcessingTitle,
  getJointRequestSuccessTitle,
  getJointRequestType,
  getJointRequestTypeLabel,
  getJointStatusLabel,
  verifyRetailJointUserTpin,
} from '../../../data/retailJointTransferMock';
import { playTransferSuccessChime } from '../../../data/retailBankTransferMock';
import { BottomSheet } from '../../common/BottomSheet';
import { NumericPinInput } from '../../common/NumericPinInput';
import {
  AddMoneyLayout,
  ProcessingState,
  ReviewRow,
  StickyAddMoneyCTA,
} from '../add-money/shared/AddMoneyUI';

function JointRequestCard({
  req,
  accounts,
  onSelect,
  subtitle,
  statusLabel,
  statusClassName = 'text-amber-700',
}: {
  req: JointTransferRequest;
  accounts: BankAccount[];
  onSelect: () => void;
  subtitle?: string;
  statusLabel: string;
  statusClassName?: string;
}) {
  const reqAccount = accounts.find((a) => a.id === req.fromAccountId);
  return (
    <button
      key={req.id}
      type="button"
      onClick={onSelect}
      className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
    >
      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
        {getJointRequestTypeLabel(getJointRequestType(req))}
      </p>
      <p className="text-sm font-bold">{getJointRequestListTitle(req)}</p>
      <p className="text-lg font-extrabold tabular-nums">{getJointRequestListAmount(req)}</p>
      <p className="text-xs text-slate-500 mt-1">
        {reqAccount?.maskedNumber ?? 'Joint Savings ••••4582'}
      </p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      <p className={`text-[10px] font-semibold mt-2 ${statusClassName}`}>● {statusLabel}</p>
    </button>
  );
}

export const JointApprovalModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestId = useMemo(() => {
    const match = location.pathname.match(/\/retail\/joint-approvals\/([^/?]+)/);
    return match?.[1];
  }, [location.pathname]);
  const {
    accounts,
    retailActiveUserId,
    setBottomNavHidden,
    getPendingJointApprovalsForUser,
    getPendingJointRequestsInitiatedByUser,
    getJointRequestById,
    approveJointTransferRequest,
    rejectJointTransferRequest,
    executeApprovedJointTransfer,
    user,
  } = useBanking();

  const [step, setStep] = useState<JointApprovalStep>(requestId ? 'detail' : 'list');
  const [showApproveSheet, setShowApproveSheet] = useState(false);
  const [showRejectSheet, setShowRejectSheet] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const chimePlayed = useRef(false);

  useEffect(() => {
    setStep(requestId ? 'detail' : 'list');
  }, [requestId]);

  const pendingToApprove = canUserActAsJointChecker(retailActiveUserId)
    ? getPendingJointApprovalsForUser(retailActiveUserId)
    : [];
  const pendingSubmitted = canUserInitiateJointRequest(retailActiveUserId)
    ? getPendingJointRequestsInitiatedByUser(retailActiveUserId)
    : [];
  const hasAnyRequests = pendingToApprove.length > 0 || pendingSubmitted.length > 0;
  const activeRequest = requestId ? getJointRequestById(requestId) : undefined;
  const fromAccount = activeRequest
    ? accounts.find((a) => a.id === activeRequest.fromAccountId)
    : undefined;
  const requestType = activeRequest ? getJointRequestType(activeRequest) : 'transfer';
  const isTransfer = requestType === 'transfer';
  const detailTitle = isTransfer ? 'Transfer Details' : 'Request Details';
  const approveSheetTitle = isTransfer ? 'Approve Transfer?' : 'Approve Request?';
  const rejectSheetTitle = isTransfer ? 'Reject Transfer?' : 'Reject Request?';
  const isDetailFlow = Boolean(requestId) || !['list'].includes(step);

  useEffect(() => {
    setBottomNavHidden(isDetailFlow);
    return () => setBottomNavHidden(false);
  }, [isDetailFlow, setBottomNavHidden]);

  useEffect(() => {
    if (step === 'success' && !chimePlayed.current) {
      playTransferSuccessChime();
      chimePlayed.current = true;
    }
  }, [step]);

  const goHome = () => navigate('/', { replace: true });

  const handleApproveAuth = async () => {
    if (authPin.length !== 6) {
      setAuthError('Enter your 6-digit TPIN.');
      return;
    }
    if (!verifyRetailJointUserTpin(retailActiveUserId, authPin)) {
      setAuthError('Incorrect TPIN.');
      setAuthPin('');
      return;
    }
    if (!activeRequest) return;

    const ok = approveJointTransferRequest(activeRequest.id);
    if (!ok) {
      setAuthError('Unable to approve this request.');
      return;
    }

    setAuthPin('');
    setAuthError('');
    setStep('approved');
  };

  const runProcessing = async () => {
    if (!activeRequest) return;
    setStep('processing');
    const ok = await executeApprovedJointTransfer(activeRequest.id);
    setStep(ok ? 'success' : 'rejected');
  };

  if (step === 'list') {
    return (
      <AddMoneyLayout title="Approvals" onBack={goHome}>
        {!hasAnyRequests ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-slate-500">No approval activity right now.</p>
            <p className="text-xs text-slate-400 mt-2">
              Submitted requests and items awaiting your approval will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingToApprove.length > 0 && (
              <section>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Awaiting your approval
                </p>
                <p className="text-xs text-slate-500 mb-3">{pendingToApprove.length} request(s)</p>
                <div className="space-y-2">
                  {pendingToApprove.map((req) => (
                    <JointRequestCard
                      key={req.id}
                      req={req}
                      accounts={accounts}
                      onSelect={() => navigate(`/retail/joint-approvals/${req.id}`)}
                      subtitle={`Initiated by: ${req.initiatedByName}`}
                      statusLabel="Pending Approval"
                    />
                  ))}
                </div>
              </section>
            )}

            {pendingSubmitted.length > 0 && (
              <section>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Your submitted requests
                </p>
                <p className="text-xs text-slate-500 mb-3">{pendingSubmitted.length} request(s)</p>
                <div className="space-y-2">
                  {pendingSubmitted.map((req) => (
                    <JointRequestCard
                      key={req.id}
                      req={req}
                      accounts={accounts}
                      onSelect={() => navigate(`/retail/joint-approvals/${req.id}`)}
                      subtitle={`Awaiting approval from ${req.approverName}`}
                      statusLabel={getJointStatusLabel(req.status)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </AddMoneyLayout>
    );
  }

  if (!activeRequest) {
    return (
      <AddMoneyLayout title={detailTitle} onBack={() => navigate('/retail/joint-approvals')}>
        <p className="text-sm text-slate-500">Request not found.</p>
      </AddMoneyLayout>
    );
  }

  const canApprove = canUserApproveJointRequest(activeRequest, retailActiveUserId);
  const isInitiator = activeRequest.initiatedByUserId === retailActiveUserId;

  if (step === 'approved') {
    return (
      <AddMoneyLayout title="Request Approved" onBack={goHome}>
        <div className="text-center pt-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <p className="text-xs font-bold text-blue-700 uppercase">{getJointRequestTypeLabel(requestType)}</p>
          <p className="text-2xl font-extrabold tabular-nums mt-1">
            {getJointRequestListAmount(activeRequest)}
          </p>
          <ReviewRow label="Approved by" value={activeRequest.approverName} />
          <ReviewRow label="Reference" value={activeRequest.reference} />
          <ReviewRow label="Status" value="Approved" />
        </div>
        <StickyAddMoneyCTA label="Continue" onClick={() => void runProcessing()} />
      </AddMoneyLayout>
    );
  }

  if (step === 'processing') {
    return (
      <AddMoneyLayout title={getJointRequestProcessingTitle(activeRequest)} onBack={() => {}}>
        <ProcessingState
          title={getJointRequestProcessingTitle(activeRequest)}
          amount={activeRequest.amount}
          message={`${getJointRequestListTitle(activeRequest)}. Please wait while the request is being processed.`}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'success') {
    const updated = getJointRequestById(activeRequest.id);
    return (
      <AddMoneyLayout title={getJointRequestSuccessTitle(activeRequest)} onBack={goHome}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center pt-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <p className="text-2xl font-extrabold tabular-nums">
            {getJointRequestListAmount(activeRequest)}
          </p>
          {isTransfer ? (
            <ReviewRow label="Sent to" value={activeRequest.beneficiaryName} />
          ) : (
            <ReviewRow label="Request" value={getJointRequestListTitle(activeRequest)} />
          )}
          <ReviewRow label="From" value={fromAccount?.maskedNumber ?? 'Joint account'} />
          {updated?.transactionId && (
            <ReviewRow label="Transaction ID" value={updated.transactionId} />
          )}
          {updated?.completedAt && <ReviewRow label="Date" value={updated.completedAt} />}
        </motion.div>
        <StickyAddMoneyCTA label="Done" onClick={goHome} />
      </AddMoneyLayout>
    );
  }

  if (step === 'rejected') {
    const updated = getJointRequestById(activeRequest.id);
    return (
      <AddMoneyLayout title="Request Rejected" onBack={goHome}>
        <div className="text-center pt-4">
          <XCircle className="w-14 h-14 text-red-600 mx-auto mb-3" />
          <p className="text-2xl font-extrabold tabular-nums">
            {getJointRequestListAmount(activeRequest)}
          </p>
          <ReviewRow label="Rejected by" value={updated?.rejectedByName ?? user.name} />
          <ReviewRow label="Reference" value={activeRequest.reference} />
          <ReviewRow label="Status" value="Rejected" />
        </div>
        <StickyAddMoneyCTA label="Done" onClick={goHome} />
      </AddMoneyLayout>
    );
  }

  if (step === 'approve-auth') {
    return (
      <AddMoneyLayout title="Confirm Approval" onBack={() => setStep('detail')}>
        <div className="text-center pt-2">
          <p className="text-3xl font-extrabold tabular-nums">
            {getJointRequestListAmount(activeRequest)}
          </p>
          <p className="text-sm text-slate-500 mt-1">{getJointRequestListTitle(activeRequest)}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 mt-4">
          <label className="text-xs font-bold text-slate-600 block mb-3">Enter TPIN</label>
          <NumericPinInput
            value={authPin}
            onChange={(v) => {
              setAuthPin(v);
              setAuthError('');
            }}
            length={6}
            masked
            hasError={Boolean(authError)}
            ariaLabel="TPIN"
          />
          {authError && <p className="text-xs text-red-600 text-center mt-2">{authError}</p>}
        </div>
        <StickyAddMoneyCTA label="Approve" onClick={() => void handleApproveAuth()} />
      </AddMoneyLayout>
    );
  }

  return (
    <>
      <AddMoneyLayout
        title={detailTitle}
        onBack={() => navigate('/retail/joint-approvals')}
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4">
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
            {getJointRequestTypeLabel(requestType)}
          </p>
          <p className="text-lg font-bold mt-1">{getJointRequestListTitle(activeRequest)}</p>
          {!isTransfer && activeRequest.beneficiaryBank && (
            <p className="text-xs text-slate-500">{activeRequest.beneficiaryBank}</p>
          )}
          {activeRequest.beneficiaryAccountMasked && (
            <ReviewRow label={isTransfer ? 'Account' : 'Details'} value={activeRequest.beneficiaryAccountMasked} />
          )}
          <ReviewRow label="From" value={`${fromAccount?.jointAccountLabel ?? 'Joint Savings'} ${fromAccount?.maskedNumber ?? ''}`} />
          {activeRequest.amount > 0 && (
            <ReviewRow label="Amount" value={`₹${activeRequest.amount.toLocaleString('en-IN')}`} />
          )}
          {isTransfer && <ReviewRow label="Transfer Type" value={activeRequest.mode} />}
          {requestType === 'deposit_fd' && activeRequest.payload && 'tenureMonths' in activeRequest.payload && (
            <>
              <ReviewRow label="Tenure" value={`${activeRequest.payload.tenureMonths} months`} />
              {activeRequest.payload.payout && (
                <ReviewRow label="Payout" value={activeRequest.payload.payout} />
              )}
            </>
          )}
          {requestType === 'deposit_rd' && activeRequest.payload && 'tenureMonths' in activeRequest.payload && (
            <ReviewRow label="Tenure" value={`${activeRequest.payload.tenureMonths} months`} />
          )}
          {requestType === 'stop_cheque' && activeRequest.payload && 'chequeNumber' in activeRequest.payload && (
            <>
              <ReviewRow label="Cheque No." value={activeRequest.payload.chequeNumber} />
              <ReviewRow label="Reason" value={activeRequest.payload.reason} />
            </>
          )}
          {requestType === 'positive_pay' && activeRequest.payload && 'chequeNumber' in activeRequest.payload && (
            <>
              <ReviewRow label="Cheque No." value={activeRequest.payload.chequeNumber} />
              <ReviewRow label="Payee" value={activeRequest.payload.payeeName} />
              <ReviewRow label="Issue Date" value={activeRequest.payload.issueDate} />
            </>
          )}
          {requestType === 'cheque_book' && activeRequest.payload && 'leaves' in activeRequest.payload && (
            <ReviewRow label="Leaves" value={String(activeRequest.payload.leaves)} />
          )}
          <ReviewRow label="Reference" value={activeRequest.reference} />
          <ReviewRow label="Initiated By" value={activeRequest.initiatedByName} />
          <ReviewRow label="Created" value={activeRequest.createdAt} />
        </div>

        {canApprove ? (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowRejectSheet(true)}
              className="py-3 rounded-2xl border border-red-200 text-red-600 text-sm font-bold"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => setShowApproveSheet(true)}
              className="py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-bold"
            >
              Approve
            </button>
          </div>
        ) : (
          <div className="text-center mt-4 space-y-2">
            <p className="text-xs text-slate-500">● {getJointStatusLabel(activeRequest.status)}</p>
            {isInitiator && activeRequest.status === 'pending_joint_approval' && (
              <p className="text-xs text-slate-500">
                Awaiting approval from {activeRequest.approverName}.
              </p>
            )}
          </div>
        )}
      </AddMoneyLayout>

      <BottomSheet
        isOpen={showApproveSheet}
        onClose={() => setShowApproveSheet(false)}
        title={approveSheetTitle}
      >
        <p className="text-2xl font-extrabold tabular-nums mb-1">
          {getJointRequestListAmount(activeRequest)}
        </p>
        <p className="text-sm text-slate-500 mb-1">{getJointRequestListTitle(activeRequest)}</p>
        <p className="text-xs text-slate-500 mb-4">This action will authorize the request.</p>
        <StickyAddMoneyCTA
          label="Approve"
          onClick={() => {
            setShowApproveSheet(false);
            setStep('approve-auth');
          }}
          secondaryLabel="Cancel"
          onSecondary={() => setShowApproveSheet(false)}
        />
      </BottomSheet>

      <BottomSheet isOpen={showRejectSheet} onClose={() => setShowRejectSheet(false)} title={rejectSheetTitle}>
        <p className="text-sm font-bold tabular-nums mb-1">
          {getJointRequestListAmount(activeRequest)}
        </p>
        <p className="text-sm text-slate-500 mb-3">{getJointRequestListTitle(activeRequest)}</p>
        <label className="text-xs font-bold text-slate-600 block mb-2">Reason for rejection</label>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className="w-full min-h-[80px] px-3 py-2 rounded-xl border text-sm outline-none mb-4"
          placeholder="Optional reason"
        />
        <StickyAddMoneyCTA
          label="Reject"
          onClick={() => {
            rejectJointTransferRequest(activeRequest.id, rejectReason || undefined);
            setShowRejectSheet(false);
            setStep('rejected');
          }}
          secondaryLabel="Cancel"
          onSecondary={() => setShowRejectSheet(false)}
        />
      </BottomSheet>
    </>
  );
};
