import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  Plus,
  XCircle,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { Beneficiary, BankAccount } from '../../../types/banking';
import type { BankTransferMode } from '../../../types/retailBankTransfer';
import type { JointTransferRequest, JointTransferStep } from '../../../types/retailJointTransfer';
import {
  DEMO_FAIL_TRANSFER_AMOUNT,
  defaultTransferMode,
  getAvailableTransferModes,
  playTransferSuccessChime,
} from '../../../data/retailBankTransferMock';
import {
  getJointStatusLabel,
  requiresJointApproval,
  verifyRetailJointUserMpin,
} from '../../../data/retailJointTransferMock';
import { NumericPinInput } from '../../common/NumericPinInput';
import {
  AddMoneyLayout,
  AmountField,
  ProcessingState,
  RadioSelectCard,
  ReviewRow,
  SourceOptionCard,
  StickyAddMoneyCTA,
} from '../add-money/shared/AddMoneyUI';

interface JointTransferFlowProps {
  accountId: string;
  onClose: () => void;
}

type Path = 'self' | 'bank';

const SELF_TYPES = new Set(['Savings', 'Current']);

interface Draft {
  path: Path | null;
  toAccountId: string;
  beneficiaryId: string | null;
  amount: string;
  note: string;
  transferMode: BankTransferMode;
}

export const JointTransferFlow: React.FC<JointTransferFlowProps> = ({ accountId, onClose }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestParam = searchParams.get('request');

  const {
    accounts,
    beneficiaries,
    retailActiveUserId,
    setBottomNavHidden,
    submitJointTransferRequest,
    executeSelfTransfer,
    executeTransfer,
    getJointRequestById,
    getJointRequestsForUser,
  } = useBanking();

  const fromAccount = accounts.find((a) => a.id === accountId);
  const needsApproval = requiresJointApproval(fromAccount);
  const selfAccounts = accounts.filter(
    (a) => SELF_TYPES.has(a.accountType) && a.id !== accountId && a.status !== 'frozen'
  );
  const payees = beneficiaries.filter((b) => b.type !== 'upi' && b.status === 'active');

  const [step, setStep] = useState<JointTransferStep>(requestParam ? 'request-detail' : 'home');
  const [draft, setDraft] = useState<Draft>({
    path: null,
    toAccountId: selfAccounts[0]?.id ?? '',
    beneficiaryId: null,
    amount: '',
    note: '',
    transferMode: 'IMPS',
  });
  const [amountError, setAmountError] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<JointTransferRequest | null>(null);
  const [failReason, setFailReason] = useState('');
  const chimePlayed = useRef(false);

  const viewingRequest = requestParam
    ? getJointRequestById(requestParam)
    : submittedRequest;

  useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const amountNum = parseFloat(draft.amount.replace(/,/g, '')) || 0;
  const selectedBeneficiary = payees.find((b) => b.id === draft.beneficiaryId);
  const toAccount = accounts.find((a) => a.id === draft.toAccountId);

  const receiver = useMemo(() => {
    if (draft.path === 'self' && toAccount) {
      return {
        name: `${toAccount.accountType} Account`,
        bank: 'My Account',
        account: toAccount.maskedNumber,
      };
    }
    if (selectedBeneficiary) {
      return {
        name: selectedBeneficiary.nickname ?? selectedBeneficiary.name,
        bank: selectedBeneficiary.bankName,
        account: selectedBeneficiary.maskedAccount,
      };
    }
    return null;
  }, [draft.path, toAccount, selectedBeneficiary]);

  const validateAmount = (available = fromAccount?.availableBalance) => {
    if (!draft.amount || amountNum <= 0) {
      setAmountError('Enter a valid amount.');
      return false;
    }
    if (available !== undefined && amountNum > available) {
      setAmountError('Insufficient balance.');
      return false;
    }
    setAmountError('');
    return true;
  };

  const goBack = useCallback(() => {
    if (step === 'home') onClose();
    else if (step === 'self' || step === 'bank-beneficiary') setStep('home');
    else if (step === 'amount') setStep(draft.path === 'self' ? 'self' : 'bank-beneficiary');
    else if (step === 'auth') setStep('amount');
    else if (step === 'request-detail') onClose();
    else onClose();
  }, [step, draft.path, onClose]);

  const runDirectTransfer = async () => {
    setStep('processing');
    await new Promise((r) => window.setTimeout(r, 1600));
    if (amountNum === DEMO_FAIL_TRANSFER_AMOUNT) {
      setFailReason('Transaction service unavailable. Please try again.');
      setStep('failed');
      return;
    }
    try {
      if (draft.path === 'self' && draft.toAccountId) {
        executeSelfTransfer({
          fromAccountId: accountId,
          toAccountId: draft.toAccountId,
          amount: amountNum,
          remarks: draft.note,
        });
      } else if (selectedBeneficiary) {
        executeTransfer({
          fromAccountId: accountId,
          beneficiaryName: selectedBeneficiary.name,
          beneficiaryAccount: selectedBeneficiary.accountNumber,
          bankName: selectedBeneficiary.bankName,
          amount: amountNum,
          mode: draft.transferMode,
          remarks: draft.note,
        });
      }
      setStep('success');
    } catch {
      setFailReason('Unable to complete this transfer.');
      setStep('failed');
    }
  };

  const handleAuthConfirm = () => {
    if (authPin.length !== 6) {
      setAuthError('Enter your 6-digit MPIN.');
      return;
    }
    if (!verifyRetailJointUserMpin(retailActiveUserId, authPin)) {
      setAuthError('Incorrect MPIN.');
      setAuthPin('');
      return;
    }
    setAuthError('');

    if (needsApproval) {
      if (!receiver) return;
      const req = submitJointTransferRequest({
        fromAccountId: accountId,
        beneficiaryId: selectedBeneficiary?.id,
        beneficiaryName: receiver.name,
        beneficiaryBank: receiver.bank,
        beneficiaryAccountMasked: receiver.account,
        amount: amountNum,
        mode: draft.path === 'self' ? 'Internal' : draft.transferMode,
        note: draft.note,
        isSelfTransfer: draft.path === 'self',
        toAccountId: draft.path === 'self' ? draft.toAccountId : undefined,
      });
      if (req) {
        setSubmittedRequest(req);
        setStep('submitted');
      } else {
        setStep('unavailable');
      }
      return;
    }

    void runDirectTransfer();
  };

  useEffect(() => {
    if (step === 'success' && !chimePlayed.current) {
      playTransferSuccessChime();
      chimePlayed.current = true;
    }
  }, [step]);

  if (!fromAccount) {
    return (
      <AddMoneyLayout title="Fund Transfer" onBack={onClose}>
        <p className="text-sm text-slate-500">Account not found.</p>
      </AddMoneyLayout>
    );
  }

  const accountCard = (acc: BankAccount, selected: boolean, onSelect: () => void) => (
    <RadioSelectCard
      key={acc.id}
      selected={selected}
      title={`${acc.accountType} Account`}
      subtitle={acc.maskedNumber}
      meta={`₹${acc.availableBalance.toLocaleString('en-IN')}`}
      onSelect={onSelect}
    />
  );

  const pendingForUser = getJointRequestsForUser(retailActiveUserId).filter(
    (r) => r.fromAccountId === accountId && r.status === 'pending_joint_approval'
  );

  if (step === 'unavailable') {
    return (
      <AddMoneyLayout title="Joint Approval Unavailable" onBack={onClose}>
        <div className="text-center px-2 pt-6">
          <XCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <p className="text-sm text-slate-600">
            This transaction requires authorization from another eligible joint holder.
          </p>
        </div>
        <StickyAddMoneyCTA label="Try Again" onClick={() => setStep('amount')} />
      </AddMoneyLayout>
    );
  }

  if (step === 'submitted' && submittedRequest) {
    return (
      <AddMoneyLayout title="Request Submitted" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mb-3" />
          <h2 className="text-lg font-bold">Request Submitted</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">
            Your transfer request has been sent to the other joint holder for approval.
          </p>
          <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border p-4 text-left space-y-2">
            <ReviewRow label="Amount" value={`₹${submittedRequest.amount.toLocaleString('en-IN')}`} />
            <ReviewRow label="To" value={submittedRequest.beneficiaryName} />
            <ReviewRow label="Status" value={getJointStatusLabel(submittedRequest.status)} />
            <ReviewRow label="Reference" value={submittedRequest.reference} />
          </div>
        </div>
        <StickyAddMoneyCTA
          label="Done"
          onClick={onClose}
          secondaryLabel="View Request"
          onSecondary={() => setStep('request-detail')}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'request-detail' && viewingRequest) {
    const isInitiator = viewingRequest.initiatedByUserId === retailActiveUserId;
    return (
      <AddMoneyLayout title="Transfer Details" onBack={goBack}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 space-y-1">
          <p className="text-2xl font-extrabold tabular-nums">
            ₹{viewingRequest.amount.toLocaleString('en-IN')}
          </p>
          <p className="text-sm font-bold">{viewingRequest.beneficiaryName}</p>
          <p className="text-xs text-amber-700 font-semibold mt-2">
            ● {getJointStatusLabel(viewingRequest.status)}
          </p>
          <ReviewRow label="Initiated By" value={viewingRequest.initiatedByName} />
          <ReviewRow label="Approver" value={viewingRequest.approverName} />
          <ReviewRow label="Created" value={viewingRequest.createdAt} />
          <ReviewRow label="Reference" value={viewingRequest.reference} />
          {viewingRequest.status === 'rejected' && viewingRequest.rejectedByName && (
            <ReviewRow label="Rejected by" value={viewingRequest.rejectedByName} />
          )}
          {isInitiator && viewingRequest.status === 'pending_joint_approval' && (
            <p className="text-xs text-slate-500 pt-2">
              Awaiting approval from {viewingRequest.approverName}.
            </p>
          )}
        </div>
        <StickyAddMoneyCTA label="Done" onClick={onClose} />
      </AddMoneyLayout>
    );
  }

  if (step === 'processing') {
    return (
      <AddMoneyLayout title="Processing Transfer" onBack={() => {}}>
        <ProcessingState
          title="Processing Transfer"
          amount={amountNum}
          message={`To ${receiver?.name ?? 'beneficiary'}. Please wait while the transaction is being processed.`}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'success') {
    return (
      <AddMoneyLayout title="Transfer Successful" onBack={onClose}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center pt-4"
        >
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <p className="text-2xl font-extrabold tabular-nums">₹{amountNum.toLocaleString('en-IN')}</p>
          <p className="text-sm text-slate-500 mt-1">Sent to {receiver?.name}</p>
          <p className="text-xs text-slate-400 mt-1">From {fromAccount.maskedNumber}</p>
        </motion.div>
        <StickyAddMoneyCTA label="Done" onClick={onClose} />
      </AddMoneyLayout>
    );
  }

  if (step === 'failed') {
    return (
      <AddMoneyLayout title="Unable to Submit Request" onBack={onClose}>
        <div className="text-center pt-6">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-sm text-slate-600">{failReason}</p>
        </div>
        <StickyAddMoneyCTA
          label="Try Again"
          onClick={() => setStep('amount')}
          secondaryLabel="Done"
          onSecondary={onClose}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'auth') {
    return (
      <AddMoneyLayout title="Confirm Request" onBack={goBack}>
        <div className="text-center pt-2">
          <p className="text-3xl font-extrabold tabular-nums">₹{amountNum.toLocaleString('en-IN')}</p>
          <p className="text-sm text-slate-500 mt-1">{receiver?.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{receiver?.account}</p>
        </div>
        {needsApproval && (
          <p className="text-xs text-slate-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 rounded-xl p-3 mt-4">
            This jointly operated account requires approval from the other joint holder.
          </p>
        )}
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
        <StickyAddMoneyCTA
          label={needsApproval ? 'Submit for Approval' : 'Confirm'}
          onClick={handleAuthConfirm}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'amount') {
    const modes = getAvailableTransferModes(amountNum);
    return (
      <AddMoneyLayout title="Transfer Details" onBack={goBack}>
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border p-3 text-sm space-y-1">
          <ReviewRow label="From" value={`Joint Savings ${fromAccount.maskedNumber}`} />
          <ReviewRow label="To" value={`${receiver?.name} ${receiver?.account}`} />
        </div>
        <AmountField
          value={draft.amount}
          onChange={(v) => {
            setDraft((d) => ({
              ...d,
              amount: v,
              transferMode: defaultTransferMode(parseFloat(v.replace(/,/g, '')) || 0),
            }));
            setAmountError('');
          }}
          error={amountError}
        />
        {draft.path === 'bank' && amountNum > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 px-1">Transfer Type</p>
            {modes.map((m) => (
              <RadioSelectCard
                key={m}
                selected={draft.transferMode === m}
                title={m}
                subtitle={`${m} transfer`}
                onSelect={() => setDraft((d) => ({ ...d, transferMode: m }))}
              />
            ))}
          </div>
        )}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-2">Note (Optional)</label>
          <input
            type="text"
            value={draft.note}
            onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900 text-sm outline-none"
            placeholder="Payment note"
          />
        </div>
        <StickyAddMoneyCTA
          label={needsApproval ? 'Submit for Approval' : 'Continue'}
          onClick={() => {
            if (validateAmount(fromAccount.availableBalance)) setStep('auth');
          }}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'bank-beneficiary') {
    return (
      <AddMoneyLayout title="Select Beneficiary" onBack={goBack}>
        <div className="space-y-2">
          {payees.map((ben: Beneficiary) => (
            <RadioSelectCard
              key={ben.id}
              selected={draft.beneficiaryId === ben.id}
              title={ben.nickname ?? ben.name}
              subtitle={`${ben.bankName} • ${ben.maskedAccount}`}
              onSelect={() => {
                setDraft((d) => ({ ...d, beneficiaryId: ben.id }));
                setStep('amount');
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => navigate('/retail/beneficiaries')}
            className="w-full flex items-center gap-2 p-4 rounded-2xl border border-dashed text-sm font-semibold text-[#005DD4]"
          >
            <Plus className="w-4 h-4" /> Add Beneficiary
          </button>
        </div>
      </AddMoneyLayout>
    );
  }

  if (step === 'self') {
    return (
      <AddMoneyLayout title="Self Transfer" onBack={goBack}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 mb-3">
          <p className="text-xs text-slate-500">From</p>
          <p className="text-sm font-bold">{fromAccount.jointAccountLabel ?? 'Joint Savings'}</p>
          <p className="text-xs font-mono text-slate-500">{fromAccount.maskedNumber}</p>
        </div>
        <ArrowDown className="w-5 h-5 text-slate-400 mx-auto" />
        <div className="space-y-2 mt-3">
          {selfAccounts.map((acc) =>
            accountCard(acc, draft.toAccountId === acc.id, () => {
              setDraft((d) => ({ ...d, toAccountId: acc.id }));
              setStep('amount');
            })
          )}
        </div>
      </AddMoneyLayout>
    );
  }

  return (
    <AddMoneyLayout title="Fund Transfer" subtitle="Transfer Money" onBack={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-4 mb-3">
        <p className="text-xs text-slate-500">From</p>
        <p className="text-sm font-bold">{fromAccount.jointAccountLabel ?? 'Joint Savings Account'}</p>
        <p className="text-xs font-mono text-slate-500">{fromAccount.maskedNumber}</p>
        <p className="text-[11px] font-semibold text-slate-500 uppercase mt-3">Available Balance</p>
        <p className="text-xl font-extrabold tabular-nums">
          ₹{fromAccount.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {pendingForUser.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-slate-500 mb-2 px-1">Pending Approval</p>
          {pendingForUser.map((req) => (
            <button
              key={req.id}
              type="button"
              onClick={() => navigate(`/retail/joint-transfer/${accountId}?request=${req.id}`)}
              className="w-full text-left p-3 rounded-xl border bg-amber-50/80 border-amber-200 mb-2"
            >
              <p className="text-sm font-bold">{req.beneficiaryName}</p>
              <p className="text-sm tabular-nums">₹{req.amount.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-amber-700 font-semibold mt-1">
                ● {getJointStatusLabel(req.status)}
              </p>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs font-bold text-slate-500 mb-2 px-1">Transfer To</p>
      <div className="space-y-2">
        <SourceOptionCard
          icon={<ArrowLeftRight className="w-5 h-5" />}
          title="Self Transfer"
          subtitle="Transfer between your own bank accounts"
          onClick={() => {
            setDraft((d) => ({ ...d, path: 'self', amount: '', note: '' }));
            setStep('self');
          }}
        />
        <SourceOptionCard
          icon={<Building2 className="w-5 h-5" />}
          title="Other Bank Account"
          subtitle="Transfer to a registered beneficiary"
          onClick={() => {
            setDraft((d) => ({ ...d, path: 'bank', beneficiaryId: null, amount: '', note: '' }));
            setStep('bank-beneficiary');
          }}
        />
      </div>
    </AddMoneyLayout>
  );
};
