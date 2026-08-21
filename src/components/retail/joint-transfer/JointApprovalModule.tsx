import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { JointApprovalStep } from '../../../types/retailJointTransfer';
import {
  canUserApproveJointRequest,
  getJointStatusLabel,
  verifyRetailJointUserMpin,
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

  const pending = getPendingJointApprovalsForUser(retailActiveUserId);
  const activeRequest = requestId ? getJointRequestById(requestId) : undefined;
  const fromAccount = activeRequest
    ? accounts.find((a) => a.id === activeRequest.fromAccountId)
    : undefined;

  useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  useEffect(() => {
    if (step === 'success' && !chimePlayed.current) {
      playTransferSuccessChime();
      chimePlayed.current = true;
    }
  }, [step]);

  const goHome = () => navigate('/', { replace: true });

  const handleApproveAuth = async () => {
    if (authPin.length !== 6) {
      setAuthError('Enter your 6-digit MPIN.');
      return;
    }
    if (!verifyRetailJointUserMpin(retailActiveUserId, authPin)) {
      setAuthError('Incorrect MPIN.');
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
      <AddMoneyLayout title="Pending Approvals" onBack={goHome}>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No pending approval requests.</p>
        ) : (
          <>
            <p className="text-xs text-slate-500 mb-3">{pending.length} pending request(s)</p>
            <div className="space-y-2">
              {pending.map((req) => {
                const reqAccount = accounts.find((a) => a.id === req.fromAccountId);
                return (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => navigate(`/retail/joint-approvals/${req.id}`)}
                  className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <p className="text-sm font-bold">{req.beneficiaryName}</p>
                  <p className="text-lg font-extrabold tabular-nums">
                    ₹{req.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {reqAccount?.maskedNumber ?? 'Joint Savings ••••4582'}
                  </p>
                  <p className="text-xs text-slate-500">Initiated by: {req.initiatedByName}</p>
                  <p className="text-[10px] text-amber-700 font-semibold mt-2">
                    ● Pending Approval
                  </p>
                </button>
              );})}
            </div>
          </>
        )}
      </AddMoneyLayout>
    );
  }

  if (!activeRequest) {
    return (
      <AddMoneyLayout title="Transfer Details" onBack={() => navigate('/retail/joint-approvals')}>
        <p className="text-sm text-slate-500">Request not found.</p>
      </AddMoneyLayout>
    );
  }

  const canApprove = canUserApproveJointRequest(activeRequest, retailActiveUserId);

  if (step === 'approved') {
    return (
      <AddMoneyLayout title="Transfer Approved" onBack={goHome}>
        <div className="text-center pt-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <p className="text-2xl font-extrabold tabular-nums">
            ₹{activeRequest.amount.toLocaleString('en-IN')}
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
      <AddMoneyLayout title="Processing Transfer" onBack={() => {}}>
        <ProcessingState
          title="Processing Transfer"
          amount={activeRequest.amount}
          message={`To ${activeRequest.beneficiaryName}. Please wait while the transaction is being processed.`}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'success') {
    const updated = getJointRequestById(activeRequest.id);
    return (
      <AddMoneyLayout title="Transfer Successful" onBack={goHome}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center pt-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <p className="text-2xl font-extrabold tabular-nums">
            ₹{activeRequest.amount.toLocaleString('en-IN')}
          </p>
          <ReviewRow label="Sent to" value={activeRequest.beneficiaryName} />
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
      <AddMoneyLayout title="Transfer Rejected" onBack={goHome}>
        <div className="text-center pt-4">
          <XCircle className="w-14 h-14 text-red-600 mx-auto mb-3" />
          <p className="text-2xl font-extrabold tabular-nums">
            ₹{activeRequest.amount.toLocaleString('en-IN')}
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
            ₹{activeRequest.amount.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-500 mt-1">{activeRequest.beneficiaryName}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 mt-4">
          <label className="text-xs font-bold text-slate-600 block mb-3">Enter MPIN</label>
          <NumericPinInput
            value={authPin}
            onChange={(v) => {
              setAuthPin(v);
              setAuthError('');
            }}
            length={6}
            masked
            hasError={Boolean(authError)}
            ariaLabel="MPIN"
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
        title="Transfer Details"
        onBack={() => navigate('/retail/joint-approvals')}
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4">
          <p className="text-lg font-bold">{activeRequest.beneficiaryName}</p>
          <p className="text-xs text-slate-500">{activeRequest.beneficiaryBank}</p>
          <ReviewRow label="Account" value={activeRequest.beneficiaryAccountMasked} />
          <ReviewRow label="From" value={`Joint Savings ${fromAccount?.maskedNumber ?? ''}`} />
          <ReviewRow label="Amount" value={`₹${activeRequest.amount.toLocaleString('en-IN')}`} />
          <ReviewRow label="Transfer Type" value={activeRequest.mode} />
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
              className="py-3 rounded-2xl bg-[#005DD4] text-white text-sm font-bold"
            >
              Approve
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center mt-4">
            ● {getJointStatusLabel(activeRequest.status)}
          </p>
        )}
      </AddMoneyLayout>

      <BottomSheet
        isOpen={showApproveSheet}
        onClose={() => setShowApproveSheet(false)}
        title="Approve Transfer?"
      >
        <p className="text-2xl font-extrabold tabular-nums mb-1">
          ₹{activeRequest.amount.toLocaleString('en-IN')}
        </p>
        <p className="text-sm text-slate-500 mb-1">To: {activeRequest.beneficiaryName}</p>
        <p className="text-xs text-slate-500 mb-4">This action will authorize the transaction.</p>
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

      <BottomSheet isOpen={showRejectSheet} onClose={() => setShowRejectSheet(false)} title="Reject Transfer?">
        <p className="text-sm font-bold tabular-nums mb-1">
          ₹{activeRequest.amount.toLocaleString('en-IN')}
        </p>
        <p className="text-sm text-slate-500 mb-3">{activeRequest.beneficiaryName}</p>
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
