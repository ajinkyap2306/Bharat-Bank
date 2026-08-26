import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Fingerprint,
  Plus,
  Search,
  User,
  XCircle,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type {
  SendMoneyDraft,
  SendMoneyRecipient,
  SendMoneyResult,
  SendMoneyStep,
} from '../../../types/retailSendMoney';
import {
  DEMO_FAIL_SEND_AMOUNT,
  DEMO_PENDING_SEND_AMOUNT,
  RECENT_SEND_RECIPIENTS,
  SEND_MONEY_QUICK_AMOUNTS,
  buildSendMoneyTransactionId,
  formatSendMoneyTimestamp,
  lookupSendMoneyQuery,
  playSendMoneySuccessChime,
  recipientDisplayLine,
} from '../../../data/retailSendMoneyMock';
import {
  getJointStatusLabel,
  requiresJointApproval,
  canUserInitiateJointTransaction,
  verifyRetailJointUserTpin,
} from '../../../data/retailJointTransferMock';
import type { JointTransferRequest } from '../../../types/retailJointTransfer';
import {
  AddMoneyLayout,
  AmountField,
  ProcessingState,
  QuickAmountChips,
  RadioSelectCard,
  ReviewRow,
  StickyAddMoneyCTA,
} from '../add-money/shared/AddMoneyUI';

interface SendMoneyFlowProps {
  onClose: () => void;
}

export const SendMoneyFlow: React.FC<SendMoneyFlowProps> = ({ onClose }) => {
  const {
    accounts,
    executeTransfer,
    addToast,
    getDefaultDebitAccount,
    defaultDebitAccountId,
    retailActiveUserId,
    submitJointTransferRequest,
  } = useBanking();

  const defaultDebit = getDefaultDebitAccount();
  const debitAccounts = accounts.filter(
    (a) =>
      (a.accountType === 'Savings' || a.accountType === 'Current') &&
      a.status !== 'frozen' &&
      canUserInitiateJointTransaction(retailActiveUserId, a)
  );

  const [step, setStep] = useState<SendMoneyStep>('home');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<SendMoneyDraft>({
    recipient: null,
    fromAccountId: defaultDebit.id,
    amount: '',
    note: '',
  });
  const [amountError, setAmountError] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<JointTransferRequest | null>(null);
  const [result, setResult] = useState<SendMoneyResult | null>(null);
  const [failReason, setFailReason] = useState('We couldn\'t complete this payment.');
  const chimePlayed = useRef(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const fromAccount = accounts.find((a) => a.id === draft.fromAccountId) ?? defaultDebit;
  const needsApproval = requiresJointApproval(fromAccount);
  const amountNum = Number(draft.amount) || 0;
  const lookupResult = search.trim() ? lookupSendMoneyQuery(search) : null;

  useEffect(() => {
    setDraft((d) => ({ ...d, fromAccountId: getDefaultDebitAccount().id }));
  }, [defaultDebitAccountId]);

  const goBack = useCallback(() => {
    if (['processing', 'success', 'failed', 'pending'].includes(step)) {
      onClose();
      return;
    }
    if (step === 'home') onClose();
    else if (step === 'recipient') setStep('home');
    else if (step === 'amount') {
      if (draft.recipient && RECENT_SEND_RECIPIENTS.some((r) => r.id === draft.recipient?.id)) {
        setStep('home');
      } else {
        setStep('recipient');
      }
    } else if (step === 'auth') setStep('amount');
  }, [step, onClose, draft.recipient]);

  const selectRecipient = (recipient: SendMoneyRecipient, skipRecipientStep = false) => {
    setDraft((d) => ({ ...d, recipient }));
    setStep(skipRecipientStep ? 'amount' : 'recipient');
  };

  const validateAmount = () => {
    if (!draft.amount.trim() || amountNum <= 0) {
      setAmountError('Enter a valid amount.');
      return false;
    }
    if (amountNum > fromAccount.availableBalance) {
      setAmountError(
        `Insufficient balance. Available ₹${fromAccount.availableBalance.toLocaleString('en-IN')}.`
      );
      return false;
    }
    setAmountError('');
    return true;
  };

  const runProcessing = () => {
    setStep('processing');
    const shouldFail = amountNum === DEMO_FAIL_SEND_AMOUNT;
    const shouldPending = amountNum === DEMO_PENDING_SEND_AMOUNT;

    setTimeout(() => {
      if (shouldFail) {
        setFailReason('We couldn\'t complete this payment.');
        setStep('failed');
        return;
      }
      if (shouldPending) {
        setStep('pending');
        return;
      }

      if (!draft.recipient) {
        setFailReason('We couldn\'t complete this payment.');
        setStep('failed');
        return;
      }

      try {
        const payeeId = draft.recipient.upiId ?? draft.recipient.mobile ?? draft.recipient.name;
        const txn = executeTransfer({
          fromAccountId: draft.fromAccountId,
          beneficiaryName: draft.recipient.name,
          beneficiaryAccount: payeeId,
          bankName: 'UPI',
          amount: amountNum,
          mode: 'UPI',
          remarks: draft.note || undefined,
        });

        const successResult: SendMoneyResult = {
          transactionId: buildSendMoneyTransactionId(),
          referenceNumber: txn.referenceNumber,
          amount: amountNum,
          recipientName: draft.recipient.name,
          recipientUpi: recipientDisplayLine(draft.recipient),
          fromAccountLabel: `${fromAccount.accountType} ${fromAccount.maskedNumber}`,
          timestamp: formatSendMoneyTimestamp(),
        };
        setResult(successResult);
        if (!chimePlayed.current) {
          playSendMoneySuccessChime();
          chimePlayed.current = true;
        }
        setStep('success');
      } catch {
        setFailReason('We couldn\'t complete this payment.');
        setStep('failed');
      }
    }, 1600);
  };

  const handleAuthConfirm = () => {
    if (authPin.length < 6) {
      addToast({ type: 'error', title: 'Invalid TPIN', message: 'Enter your 6-digit TPIN.' });
      return;
    }

    if (!verifyRetailJointUserTpin(retailActiveUserId, authPin)) {
      setAuthError('Incorrect TPIN.');
      setAuthPin('');
      return;
    }
    setAuthError('');

    if (needsApproval) {
      if (!draft.recipient) return;
      const req = submitJointTransferRequest({
        fromAccountId: draft.fromAccountId,
        beneficiaryName: draft.recipient.name,
        beneficiaryBank: 'UPI',
        beneficiaryAccountMasked: recipientDisplayLine(draft.recipient),
        amount: amountNum,
        mode: 'UPI',
        note: draft.note || undefined,
      });
      if (req) {
        setSubmittedRequest(req);
        setStep('submitted');
      } else {
        setStep('unavailable');
      }
      return;
    }

    runProcessing();
  };

  const verifiedCard = (recipient: SendMoneyRecipient, compact?: boolean) => (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 ${
        compact ? '' : 'mt-2'
      }`}
    >
      <span className="w-10 h-10 rounded-full bg-congress-blue-100 dark:bg-congress-blue-950 text-congress-blue-700 flex items-center justify-center shrink-0">
        <User className="w-5 h-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          {recipient.name}
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {recipient.upiId ? 'Verified UPI ID' : 'Verified Mobile'}
        </p>
        {recipient.upiId && (
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">{recipient.upiId}</p>
        )}
      </div>
    </div>
  );

  if (step === 'unavailable') {
    return (
      <AddMoneyLayout title="Send Money" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <span className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
            <XCircle className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Approval Unavailable</h2>
          <p className="text-sm text-slate-500 mt-2">
            This jointly operated account requires authorization from another eligible joint holder.
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sent for Approval</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">
            Your payment request has been sent to the other joint holder for approval.
          </p>
          <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-2">
            <ReviewRow label="Amount" value={`₹${submittedRequest.amount.toLocaleString('en-IN')}`} />
            <ReviewRow label="To" value={submittedRequest.beneficiaryName} />
            <ReviewRow label="From" value={`${fromAccount.jointAccountLabel ?? fromAccount.accountType} ${fromAccount.maskedNumber}`} />
            <ReviewRow label="Status" value={getJointStatusLabel(submittedRequest.status)} />
            <ReviewRow label="Reference" value={submittedRequest.reference} />
          </div>
        </div>
        <StickyAddMoneyCTA label="Done" onClick={onClose} />
      </AddMoneyLayout>
    );
  }

  if (step === 'processing') {
    return (
      <AddMoneyLayout title="Send Money" onBack={() => {}}>
        <ProcessingState title={`Sending ₹${amountNum.toLocaleString('en-IN')}…`} amount={amountNum} />
      </AddMoneyLayout>
    );
  }

  if (step === 'success' && result) {
    return (
      <AddMoneyLayout title="Send Money" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4 ring-4 ring-emerald-100/80 dark:ring-emerald-900/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 14 }}
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Payment Successful
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.26 }}
            className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tabular-nums"
          >
            ₹{result.amount.toLocaleString('en-IN')}
          </motion.p>
          <p className="text-sm text-slate-500 mt-3">
            Sent to {result.recipientName}
            <br />
            {result.recipientUpi}
          </p>
          <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-2">
            <ReviewRow label="From" value={result.fromAccountLabel} />
            <ReviewRow label="Date & Time" value={result.timestamp} />
            <ReviewRow label="UPI Transaction ID" value={result.transactionId} />
          </div>
        </div>
        <StickyAddMoneyCTA
          label="Done"
          onClick={onClose}
          secondaryLabel="Share Receipt"
          onSecondary={() =>
            addToast({ type: 'info', title: 'Receipt Shared', message: 'Payment receipt shared (demo).' })
          }
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'pending') {
    return (
      <AddMoneyLayout title="Send Money" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <span className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
            <Clock className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Pending</h2>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 tabular-nums">
            ₹{amountNum.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-500 mt-2">We&apos;re checking the payment status.</p>
        </div>
        <StickyAddMoneyCTA label="View Transaction" onClick={onClose} />
      </AddMoneyLayout>
    );
  }

  if (step === 'failed') {
    return (
      <AddMoneyLayout title="Send Money" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <span className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-4">
            <XCircle className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Failed</h2>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 tabular-nums">
            ₹{amountNum.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-500 mt-2">{failReason}</p>
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

  if (step === 'auth' && draft.recipient) {
    return (
      <AddMoneyLayout title={needsApproval ? 'Confirm Request' : 'Confirm Payment'} onBack={goBack}>
        <div className="text-center pt-2">
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹{amountNum.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-500 mt-1">{draft.recipient.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{recipientDisplayLine(draft.recipient)}</p>
        </div>
        {needsApproval && (
          <p className="text-xs text-slate-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 rounded-xl p-3 mt-4">
            This jointly operated account requires approval from the other joint holder before payment
            is sent.
          </p>
        )}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mt-4">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-3">
            Enter TPIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={authPin}
            onChange={(e) => {
              setAuthPin(e.target.value.replace(/\D/g, '').slice(0, 6));
              setAuthError('');
            }}
            placeholder="• • • • • •"
            className={`w-full text-center text-xl tracking-[0.5em] font-bold py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none focus:border-congress-blue-500 ${
              authError
                ? 'border-red-300 dark:border-red-800'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {authError && <p className="text-xs text-red-600 text-center mt-2">{authError}</p>}
          {!needsApproval && (
            <button
              type="button"
              onClick={() => {
                addToast({ type: 'info', title: 'Biometric', message: 'Fingerprint verified (demo).' });
                setAuthPin('654321');
              }}
              className="w-full mt-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" /> Use Biometric
            </button>
          )}
        </div>
        <StickyAddMoneyCTA
          label={needsApproval ? 'Submit for Approval' : 'Confirm'}
          onClick={handleAuthConfirm}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'amount' && draft.recipient) {
    return (
      <AddMoneyLayout title="Send Money" onBack={goBack}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Send to</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            {draft.recipient.name}
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-semibold text-emerald-600">Verified</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{recipientDisplayLine(draft.recipient)}</p>
        </div>
        <AmountField
          value={draft.amount}
          onChange={(v) => {
            setDraft((d) => ({ ...d, amount: v }));
            setAmountError('');
          }}
          error={amountError}
        />
        <QuickAmountChips
          amounts={SEND_MONEY_QUICK_AMOUNTS}
          selected={draft.amount}
          onSelect={(amt) => {
            setDraft((d) => ({ ...d, amount: String(amt) }));
            setAmountError('');
          }}
        />
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
            Add a note <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={draft.note}
            onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
            placeholder="Dinner"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
          />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 mb-2 px-1">From</p>
          {needsApproval && (
            <p className="text-xs text-slate-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 rounded-xl p-3 mb-2">
              Joint account selected — payment will be sent to the other joint holder for approval.
            </p>
          )}
          <div className="space-y-2">
            {debitAccounts.map((acc) => {
              const isJoint = requiresJointApproval(acc);
              const accountTitle = acc.jointAccountLabel ?? `${acc.accountType} Account`;
              return (
                <RadioSelectCard
                  key={acc.id}
                  selected={draft.fromAccountId === acc.id}
                  title={accountTitle}
                  subtitle={acc.maskedNumber}
                  meta={`Available ₹${acc.availableBalance.toLocaleString('en-IN')}${isJoint ? ' · Jointly Operated' : ''}`}
                  onSelect={() => setDraft((d) => ({ ...d, fromAccountId: acc.id }))}
                />
              );
            })}
          </div>
        </div>
        <StickyAddMoneyCTA
          label={
            needsApproval
              ? `Submit ₹${amountNum > 0 ? amountNum.toLocaleString('en-IN') : '0'} for Approval`
              : `Pay ₹${amountNum > 0 ? amountNum.toLocaleString('en-IN') : '0'}`
          }
          onClick={() => {
            if (validateAmount()) {
              setAuthPin('');
              setAuthError('');
              setStep('auth');
            }
          }}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'recipient' && draft.recipient) {
    return (
      <AddMoneyLayout title="Send Money" onBack={goBack}>
        <div className="text-center pt-4 pb-2">
          <span className="w-14 h-14 rounded-full bg-congress-blue-100 dark:bg-congress-blue-950 text-congress-blue-700 flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-3">{draft.recipient.name}</h2>
        </div>
        {draft.recipient.upiId && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UPI ID</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{draft.recipient.upiId}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </p>
          </div>
        )}
        <StickyAddMoneyCTA label="Continue" onClick={() => setStep('amount')} />
      </AddMoneyLayout>
    );
  }

  return (
    <AddMoneyLayout title="Send Money" onBack={onClose}>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">To</p>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile or UPI ID…"
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
          />
        </div>
        {lookupResult && search.trim() && verifiedCard(lookupResult)}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1 mt-4">Recent</p>
        <div className="space-y-2">
          {RECENT_SEND_RECIPIENTS.map((recipient) => (
            <button
              key={recipient.id}
              type="button"
              onClick={() => {
                setSearch('');
                selectRecipient(recipient, true);
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left active:scale-[0.99] transition-transform"
            >
              <span className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </span>
              <span className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{recipient.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{recipientDisplayLine(recipient)}</p>
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => searchRef.current?.focus()}
        className="w-full p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-sm font-semibold text-congress-blue-700 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> New Recipient
      </button>

      {lookupResult && search.trim() && (
        <StickyAddMoneyCTA
          label="Continue"
          onClick={() => {
            setDraft((d) => ({ ...d, recipient: lookupResult }));
            setStep('recipient');
          }}
        />
      )}
    </AddMoneyLayout>
  );
};
