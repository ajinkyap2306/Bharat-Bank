import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  XCircle,
  Zap,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { Beneficiary, BankAccount } from '../../../types/banking';
import type { BankTransferDraft, BankTransferResult, BankTransferStep } from '../../../types/retailBankTransfer';
import {
  DEMO_FAIL_TRANSFER_AMOUNT,
  FUND_TRANSFER_TYPE_OPTIONS,
  buildTransferTransactionId,
  defaultTransferMode,
  formatTransferTimestamp,
  getAvailableTransferModes,
  maskAccountNumber,
  playTransferSuccessChime,
  validateTransferModeForAmount,
} from '../../../data/retailBankTransferMock';
import {
  getJointStatusLabel,
  requiresJointApproval,
  canUserDebitFromAccount,
  verifyRetailJointUserTpin,
} from '../../../data/retailJointTransferMock';
import type { JointTransferRequest } from '../../../types/retailJointTransfer';
import {
  AddMoneyLayout,
  AmountField,
  ProcessingState,
  RadioSelectCard,
  ReviewRow,
  SourceOptionCard,
  StickyAddMoneyCTA,
} from '../add-money/shared/AddMoneyUI';

interface BankTransferFlowProps {
  onClose: () => void;
}

const SELF_ACCOUNT_TYPES = new Set(['Savings', 'Current']);

function eligibleSelfAccounts(accounts: BankAccount[], userId: string): BankAccount[] {
  return accounts.filter(
    (a) =>
      SELF_ACCOUNT_TYPES.has(a.accountType) &&
      a.status !== 'frozen' &&
      canUserDebitFromAccount(userId, a)
  );
}

function bankBeneficiaries(beneficiaries: Beneficiary[]): Beneficiary[] {
  return beneficiaries.filter((b) => b.type !== 'upi' && b.status === 'active');
}

export const BankTransferFlow: React.FC<BankTransferFlowProps> = ({ onClose }) => {
  const {
    accounts,
    beneficiaries,
    executeTransfer,
    executeSelfTransfer,
    addToast,
    setBottomNavHidden,
    lookupBanlName,
    transferRepeat,
    clearTransferRepeat,
    retailActiveUserId,
    submitJointTransferRequest,
  } = useBanking();

  const selfAccounts = eligibleSelfAccounts(accounts, retailActiveUserId);
  const defaultDebit =
    selfAccounts[0] ?? accounts.find((a) => canUserDebitFromAccount(retailActiveUserId, a));
  const payees = bankBeneficiaries(beneficiaries);

  const [step, setStep] = useState<BankTransferStep>('home');
  const [draft, setDraft] = useState<BankTransferDraft>(() => ({
    path: null,
    fromAccountId: selfAccounts[0]?.id ?? '',
    toAccountId: selfAccounts.find((a) => a.id !== selfAccounts[0]?.id)?.id ?? '',
    beneficiaryId: null,
    manualReceiver: null,
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    amount: '',
    note: '',
    transferMode: 'IMPS',
  }));
  const [amountError, setAmountError] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<JointTransferRequest | null>(null);
  const [result, setResult] = useState<BankTransferResult | null>(null);
  const [failReason, setFailReason] = useState('We couldn\'t complete this transaction.');
  const [banlLoading, setBanlLoading] = useState(false);
  const [beneficiarySearch, setBeneficiarySearch] = useState('');
  const chimePlayed = useRef(false);

  const filteredPayees = useMemo(() => {
    const q = beneficiarySearch.trim().toLowerCase();
    if (!q) return payees;
    return payees.filter(
      (ben) =>
        ben.name.toLowerCase().includes(q) ||
        ben.bankName.toLowerCase().includes(q) ||
        ben.maskedAccount.toLowerCase().includes(q) ||
        ben.accountNumber.includes(q) ||
        (ben.nickname?.toLowerCase().includes(q) ?? false)
    );
  }, [payees, beneficiarySearch]);

  const fromAccount = accounts.find((a) => a.id === draft.fromAccountId);
  const toAccount = accounts.find((a) => a.id === draft.toAccountId);
  const selectedBeneficiary = payees.find((b) => b.id === draft.beneficiaryId);
  const needsApproval = requiresJointApproval(fromAccount);
  const canDebitFromSelected = canUserDebitFromAccount(retailActiveUserId, fromAccount);

  const receiver = useMemo(() => {
    if (draft.path === 'self' && toAccount) {
      return {
        name: `${toAccount.accountType} Account`,
        bank: 'My Account',
        account: toAccount.maskedNumber,
        ifsc: toAccount.ifsc,
      };
    }
    if (selectedBeneficiary) {
      return {
        name: selectedBeneficiary.name,
        bank: selectedBeneficiary.bankName,
        account: selectedBeneficiary.maskedAccount,
        ifsc: selectedBeneficiary.ifsc,
      };
    }
    if (draft.manualReceiver) {
      return {
        name: draft.manualReceiver.name,
        bank: draft.manualReceiver.bankName,
        account: draft.manualReceiver.maskedAccount,
        ifsc: draft.manualReceiver.ifsc,
      };
    }
    return null;
  }, [draft, toAccount, selectedBeneficiary]);

  const amountNum = Number(draft.amount) || 0;
  const availableModes = getAvailableTransferModes(amountNum);

  useEffect(() => {
    setSelectedDebitFromDefault();
  }, [retailActiveUserId, accounts]);

  useEffect(() => {
    setBottomNavHidden(step !== 'home');
    return () => setBottomNavHidden(false);
  }, [step, setBottomNavHidden]);

  useEffect(() => {
    if (!transferRepeat) return;
    const match = payees.find(
      (b) =>
        b.name === transferRepeat.beneficiaryName ||
        b.accountNumber === transferRepeat.beneficiaryAccount
    );
    const mode =
      transferRepeat.mode === 'IMPS' || transferRepeat.mode === 'NEFT' || transferRepeat.mode === 'RTGS'
        ? transferRepeat.mode
        : 'IMPS';
    setDraft((d) => ({
      ...d,
      path: 'bank',
      beneficiaryId: match?.id ?? null,
      amount: String(transferRepeat.amount),
      note: transferRepeat.remarks || '',
      transferMode: mode,
      fromAccountId: defaultDebit?.id ?? selfAccounts[0]?.id ?? '',
    }));
    setStep(match ? 'amount' : 'bank-beneficiary');
    clearTransferRepeat();
  }, [transferRepeat, payees, clearTransferRepeat, defaultDebit?.id, selfAccounts]);

  useEffect(() => {
    if (!availableModes.includes(draft.transferMode)) {
      setDraft((d) => ({ ...d, transferMode: defaultTransferMode(amountNum) }));
    }
  }, [amountNum, availableModes, draft.transferMode]);

  function setSelectedDebitFromDefault() {
    const debit = selfAccounts[0];
    if (!debit) return;
    const others = selfAccounts.filter((a) => a.id !== debit.id);
    setDraft((d) => ({
      ...d,
      fromAccountId: debit.id,
      toAccountId: d.toAccountId && d.toAccountId !== debit.id ? d.toAccountId : others[0]?.id ?? '',
    }));
  }

  useEffect(() => {
    if (!selfAccounts.length) return;
    if (!selfAccounts.some((a) => a.id === draft.fromAccountId)) {
      setDraft((d) => ({
        ...d,
        fromAccountId: selfAccounts[0].id,
        toAccountId:
          d.toAccountId && d.toAccountId !== selfAccounts[0].id
            ? d.toAccountId
            : selfAccounts.find((a) => a.id !== selfAccounts[0].id)?.id ?? '',
      }));
    }
  }, [selfAccounts, draft.fromAccountId]);

  const goBack = useCallback(() => {
    if (['processing', 'success', 'failed'].includes(step)) {
      onClose();
      return;
    }
    if (step === 'home') onClose();
    else if (step === 'self' || step === 'bank-beneficiary') setStep('home');
    else if (step === 'bank-enter') setStep('bank-beneficiary');
    else if (step === 'amount') {
      if (draft.manualReceiver) setStep('bank-enter');
      else setStep('bank-beneficiary');
    } else if (step === 'auth') {
      if (draft.path === 'self') setStep('self');
      else setStep('amount');
    }
  }, [step, onClose, draft.path, draft.manualReceiver]);

  const validateAmount = (balance?: number) => {
    if (!draft.amount.trim() || amountNum <= 0) {
      setAmountError('Enter a valid amount.');
      return false;
    }
    const bal = balance ?? fromAccount?.availableBalance ?? 0;
    if (amountNum > bal) {
      setAmountError(`Insufficient balance. Available ₹${bal.toLocaleString('en-IN')}.`);
      return false;
    }
    if (draft.path === 'bank') {
      const modeError = validateTransferModeForAmount(draft.transferMode, amountNum);
      if (modeError) {
        setAmountError(modeError);
        return false;
      }
    }
    setAmountError('');
    return true;
  };

  const goToAuth = () => {
    setAuthPin('');
    setAuthError('');
    setStep('auth');
  };

  const startFundTransfer = (option: (typeof FUND_TRANSFER_TYPE_OPTIONS)[number]) => {
    setAmountError('');
    if (option.path === 'self') {
      setDraft((d) => ({ ...d, path: 'self', amount: '', note: '' }));
      setStep('self');
      return;
    }
    setDraft((d) => ({
      ...d,
      path: 'bank',
      beneficiaryId: null,
      manualReceiver: null,
      accountNumber: '',
      confirmAccountNumber: '',
      ifsc: '',
      amount: '',
      note: '',
      transferMode: option.mode ?? 'IMPS',
    }));
    setStep('bank-beneficiary');
  };

  const fundTransferIcons: Record<(typeof FUND_TRANSFER_TYPE_OPTIONS)[number]['id'], React.ReactNode> = {
    'within-bank': <ArrowLeftRight className="w-5 h-5" />,
    imps: <Zap className="w-5 h-5" />,
    neft: <Clock className="w-5 h-5" />,
    rtgs: <Building2 className="w-5 h-5" />,
  };

  const runProcessing = () => {
    setStep('processing');
    const shouldFail = amountNum === DEMO_FAIL_TRANSFER_AMOUNT;

    setTimeout(() => {
      if (shouldFail) {
        setFailReason('We couldn\'t complete this transaction.');
        setStep('failed');
        return;
      }

      try {
        let txn;
        if (draft.path === 'self') {
          txn = executeSelfTransfer({
            fromAccountId: draft.fromAccountId,
            toAccountId: draft.toAccountId,
            amount: amountNum,
            remarks: draft.note || undefined,
          });
        } else if (receiver) {
          const benAccount =
            selectedBeneficiary?.accountNumber ?? draft.manualReceiver?.accountNumber ?? '';
          txn = executeTransfer({
            fromAccountId: draft.fromAccountId,
            beneficiaryName: receiver.name,
            beneficiaryAccount: benAccount,
            bankName: receiver.bank,
            amount: amountNum,
            mode: draft.transferMode,
            remarks: draft.note || undefined,
          });
        } else {
          throw new Error('Receiver missing');
        }

        const successResult: BankTransferResult = {
          transactionId: buildTransferTransactionId(),
          referenceNumber: txn.referenceNumber,
          amount: amountNum,
          mode: draft.path === 'self' ? 'Internal' : draft.transferMode,
          receiverLabel: receiver?.name ?? 'Recipient',
          receiverBank: receiver?.bank ?? '',
          receiverAccount: receiver?.account ?? '',
          receiverIfsc: receiver?.ifsc,
          timestamp: formatTransferTimestamp(),
          isSelf: draft.path === 'self',
        };
        setResult(successResult);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.55 } });
        if (!chimePlayed.current) {
          playTransferSuccessChime();
          chimePlayed.current = true;
        }
        setStep('success');
      } catch {
        setFailReason('We couldn\'t complete this transaction.');
        setStep('failed');
      }
    }, 1800);
  };

  const handleAuthConfirm = () => {
    if (authPin.length < 6) {
      addToast({
        type: 'error',
        title: 'Invalid TPIN',
        message: 'Enter your 6-digit TPIN.',
      });
      return;
    }

    if (!verifyRetailJointUserTpin(retailActiveUserId, authPin)) {
      setAuthError('Incorrect TPIN.');
      setAuthPin('');
      return;
    }
    setAuthError('');

    if (!fromAccount || !canDebitFromSelected) {
      addToast({
        type: 'info',
        title: 'Permission required',
        message: 'Joint account transfers can only be initiated by the joint account maker.',
      });
      setStep('unavailable');
      return;
    }

    if (needsApproval) {
      if (!receiver) return;
      const req = submitJointTransferRequest({
        fromAccountId: draft.fromAccountId,
        beneficiaryId: selectedBeneficiary?.id,
        beneficiaryName: receiver.name,
        beneficiaryBank: receiver.bank,
        beneficiaryAccountMasked: receiver.account,
        amount: amountNum,
        mode: draft.path === 'self' ? 'Internal' : draft.transferMode,
        note: draft.note || undefined,
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

    runProcessing();
  };

  const handleBankEnterContinue = () => {
    if (!draft.accountNumber.trim() || draft.accountNumber !== draft.confirmAccountNumber) {
      addToast({
        type: 'error',
        title: 'Account Mismatch',
        message: 'Account numbers do not match.',
      });
      return;
    }
    if (draft.ifsc.trim().length < 11) {
      addToast({ type: 'error', title: 'Invalid IFSC', message: 'Enter a valid 11-character IFSC.' });
      return;
    }
    setBanlLoading(true);
    setTimeout(() => {
      const banl = lookupBanlName(draft.accountNumber, draft.ifsc);
      setBanlLoading(false);
      if (banl.matchStatus !== 'matched' && banl.matchStatus !== 'partial') {
        addToast({ type: 'error', title: 'Verification Failed', message: 'Could not verify bank details.' });
        return;
      }
      setDraft((d) => ({
        ...d,
        beneficiaryId: null,
        manualReceiver: {
          name: banl.accountHolderName,
          accountNumber: d.accountNumber,
          maskedAccount: maskAccountNumber(d.accountNumber),
          bankName: banl.bankName || 'Bank',
          ifsc: d.ifsc,
        },
        transferMode: defaultTransferMode(Number(d.amount) || 0),
      }));
      setStep('amount');
    }, 700);
  };

  const accountCard = (account: BankAccount, selected: boolean, onSelect: () => void) => {
    const isJoint = requiresJointApproval(account);
    const accountTitle = account.jointAccountLabel ?? `${account.accountType} Account`;
    return (
      <RadioSelectCard
        key={account.id}
        selected={selected}
        title={accountTitle}
        subtitle={account.maskedNumber}
        meta={`Available ₹${account.availableBalance.toLocaleString('en-IN')}${isJoint ? ' · Jointly Operated' : ''}`}
        onSelect={onSelect}
      />
    );
  };

  if (step === 'unavailable') {
    return (
      <AddMoneyLayout title="Bank Transfer" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <span className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
            <XCircle className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Approval Unavailable</h2>
          <p className="text-sm text-slate-500 mt-2">
            This jointly operated account requires authorization from another eligible joint holder.
          </p>
        </div>
        <StickyAddMoneyCTA
          label="Try Again"
          onClick={() => setStep(draft.path === 'self' ? 'self' : 'amount')}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'submitted' && submittedRequest && fromAccount) {
    return (
      <AddMoneyLayout title="Request Submitted" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sent for Approval</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">
            Your transfer request has been sent to the other joint holder for approval.
          </p>
          <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-2">
            <ReviewRow label="Amount" value={`₹${submittedRequest.amount.toLocaleString('en-IN')}`} />
            <ReviewRow label="To" value={submittedRequest.beneficiaryName} />
            <ReviewRow
              label="From"
              value={`${fromAccount.jointAccountLabel ?? fromAccount.accountType} ${fromAccount.maskedNumber}`}
            />
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
      <AddMoneyLayout title="Bank Transfer" onBack={() => {}}>
        <ProcessingState title={`Transferring ₹${amountNum.toLocaleString('en-IN')}…`} amount={amountNum} />
      </AddMoneyLayout>
    );
  }

  if (step === 'success' && result) {
    return (
      <AddMoneyLayout title="Bank Transfer" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 14 }}
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Transfer Successful
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.28 }}
            className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tabular-nums"
          >
            ₹{result.amount.toLocaleString('en-IN')}
          </motion.p>
          <p className="text-sm text-slate-500 mt-2">
            Sent to {result.receiverLabel}
            <br />
            {result.receiverBank} · {result.receiverAccount}
          </p>
          <p className="text-xs font-semibold text-congress-blue-700 mt-1">{result.mode}</p>
          <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-2">
            <ReviewRow label="Transaction ID" value={result.transactionId} />
            <ReviewRow label="Date & Time" value={result.timestamp} />
          </div>
        </div>
        <StickyAddMoneyCTA
          label="Done"
          onClick={onClose}
          secondaryLabel="Share Receipt"
          onSecondary={() =>
            addToast({ type: 'info', title: 'Receipt Shared', message: 'Transfer receipt shared (demo).' })
          }
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'failed') {
    return (
      <AddMoneyLayout title="Bank Transfer" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <span className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-4">
            <XCircle className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transfer Failed</h2>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 tabular-nums">
            ₹{amountNum.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-500 mt-2">{failReason}</p>
        </div>
        <StickyAddMoneyCTA
          label="Try Again"
          onClick={() => setStep(draft.path === 'self' ? 'self' : 'amount')}
          secondaryLabel="Done"
          onSecondary={onClose}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'auth') {
    return (
      <AddMoneyLayout title={needsApproval ? 'Confirm Request' : 'Confirm Transfer'} onBack={goBack}>
        <div className="text-center pt-2">
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹{amountNum.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-500 mt-1">{receiver?.name}</p>
          {needsApproval && (
            <p className="text-xs text-blue-700 mt-2">
              Joint account — request will be sent for approval.
            </p>
          )}
        </div>
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
            className="w-full text-center text-xl tracking-[0.5em] font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-congress-blue-500"
          />
          {authError && <p className="text-xs text-red-600 mt-2 text-center">{authError}</p>}
        </div>
        <StickyAddMoneyCTA
          label={needsApproval ? 'Submit for Approval' : 'Confirm'}
          onClick={handleAuthConfirm}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'amount' && draft.path === 'bank') {
    return (
      <AddMoneyLayout title="Transfer Amount" onBack={goBack}>
        {receiver && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Receiver</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{receiver.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {receiver.bank} · {receiver.account}
            </p>
          </div>
        )}
        <AmountField
          value={draft.amount}
          onChange={(v) => {
            setDraft((d) => ({ ...d, amount: v }));
            setAmountError('');
          }}
          error={amountError}
        />
        <p className="text-xs text-slate-500 px-1">
          Available Balance ₹{(fromAccount?.availableBalance ?? 0).toLocaleString('en-IN')}
        </p>
        {availableModes.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">Transfer Type</p>
            <div className="space-y-2">
              {availableModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, transferMode: mode }))}
                  className={`w-full px-4 py-3 rounded-xl text-left border ${
                    draft.transferMode === mode
                      ? 'bg-congress-blue-700 text-white border-congress-blue-700'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <p className="text-sm font-bold">{mode}</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      draft.transferMode === mode ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {FUND_TRANSFER_TYPE_OPTIONS.find((o) => o.mode === mode)?.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
            Note (Optional)
          </label>
          <input
            type="text"
            value={draft.note}
            onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
            placeholder="Payment note"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 px-1">Debit from</p>
          {needsApproval && (
            <p className="text-xs text-slate-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 rounded-xl p-3">
              Joint account selected — transfer will be sent to the other joint holder for approval.
            </p>
          )}
          {selfAccounts.map((acc) =>
            accountCard(acc, draft.fromAccountId === acc.id, () =>
              setDraft((d) => ({ ...d, fromAccountId: acc.id }))
            )
          )}
        </div>
        <StickyAddMoneyCTA
          label={
            needsApproval
              ? `Submit ₹${amountNum.toLocaleString('en-IN')} for Approval`
              : `Transfer ₹${amountNum.toLocaleString('en-IN')}`
          }
          onClick={() => {
            if (validateAmount()) goToAuth();
          }}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'bank-enter') {
    return (
      <AddMoneyLayout title="Bank Account Transfer" subtitle="Receiver's Bank Details" onBack={goBack}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              Account Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={draft.accountNumber}
              onChange={(e) =>
                setDraft((d) => ({ ...d, accountNumber: e.target.value.replace(/\D/g, '') }))
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              Confirm Account Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={draft.confirmAccountNumber}
              onChange={(e) =>
                setDraft((d) => ({ ...d, confirmAccountNumber: e.target.value.replace(/\D/g, '') }))
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              value={draft.ifsc}
              onChange={(e) =>
                setDraft((d) => ({ ...d, ifsc: e.target.value.toUpperCase().slice(0, 11) }))
              }
              placeholder="HDFC0001234"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500 uppercase"
            />
          </div>
        </div>
        <StickyAddMoneyCTA
          label={banlLoading ? 'Verifying…' : 'Continue'}
          disabled={banlLoading}
          onClick={handleBankEnterContinue}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'bank-beneficiary') {
    return (
      <AddMoneyLayout title="Select Beneficiary" onBack={goBack}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={beneficiarySearch}
            onChange={(e) => setBeneficiarySearch(e.target.value)}
            placeholder="Search beneficiary, account, bank..."
            aria-label="Search beneficiary"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
          />
        </div>
        <div className="space-y-2">
          {filteredPayees.length === 0 ? (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-white">No beneficiaries found</p>
              <p className="text-xs text-slate-500 mt-1">
                {beneficiarySearch.trim()
                  ? `No match for "${beneficiarySearch.trim()}"`
                  : 'Add a beneficiary to continue'}
              </p>
            </div>
          ) : (
            filteredPayees.map((ben) => (
              <RadioSelectCard
                key={ben.id}
                selected={draft.beneficiaryId === ben.id}
                title={ben.name}
                subtitle={`${ben.bankName} · ${ben.maskedAccount}`}
                onSelect={() =>
                  setDraft((d) => ({
                    ...d,
                    beneficiaryId: ben.id,
                    manualReceiver: null,
                    transferMode: defaultTransferMode(Number(d.amount) || 0),
                  }))
                }
              />
            ))
          )}
          <button
            type="button"
            onClick={() => {
              setDraft((d) => ({
                ...d,
                beneficiaryId: null,
                manualReceiver: null,
                accountNumber: '',
                confirmAccountNumber: '',
                ifsc: '',
              }));
              setStep('bank-enter');
            }}
            className="w-full p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-sm font-semibold text-congress-blue-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Beneficiary
          </button>
        </div>
        <StickyAddMoneyCTA
          label="Continue"
          disabled={!draft.beneficiaryId}
          onClick={() => setStep('amount')}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'self') {
    const otherAccounts = selfAccounts.filter((a) => a.id !== draft.fromAccountId);
    return (
      <AddMoneyLayout title="Within Bank" onBack={goBack}>
        <div>
          <p className="text-xs font-bold text-slate-500 mb-2 px-1">From</p>
          <div className="space-y-2">
            {selfAccounts.map((acc) =>
              accountCard(acc, draft.fromAccountId === acc.id, () => {
                const nextTo =
                  acc.id === draft.toAccountId
                    ? selfAccounts.find((a) => a.id !== acc.id)?.id ?? ''
                    : draft.toAccountId;
                setDraft((d) => ({ ...d, fromAccountId: acc.id, toAccountId: nextTo }));
              })
            )}
          </div>
        </div>
        <div className="flex justify-center py-1">
          <ArrowDown className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 mb-2 px-1">To</p>
          <div className="space-y-2">
            {otherAccounts.map((acc) =>
              accountCard(acc, draft.toAccountId === acc.id, () =>
                setDraft((d) => ({ ...d, toAccountId: acc.id }))
              )
            )}
          </div>
        </div>
        <AmountField
          value={draft.amount}
          onChange={(v) => {
            setDraft((d) => ({ ...d, amount: v }));
            setAmountError('');
          }}
          error={amountError}
        />
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
            Note (Optional)
          </label>
          <input
            type="text"
            value={draft.note}
            onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
            placeholder="Salary transfer"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
          />
        </div>
        {needsApproval && (
          <p className="text-xs text-slate-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 rounded-xl p-3">
            Joint account selected — transfer will be sent to the other joint holder for approval.
          </p>
        )}
        <StickyAddMoneyCTA
          label={
            needsApproval
              ? `Submit ₹${amountNum.toLocaleString('en-IN')} for Approval`
              : `Transfer ₹${amountNum.toLocaleString('en-IN')}`
          }
          onClick={() => {
            if (!draft.toAccountId) {
              addToast({ type: 'error', title: 'Select Account', message: 'Choose a destination account.' });
              return;
            }
            if (validateAmount(fromAccount?.availableBalance)) goToAuth();
          }}
        />
      </AddMoneyLayout>
    );
  }

  return (
    <AddMoneyLayout title="Fund Transfer" subtitle="Transfer Money" onBack={onClose}>
      <div className="space-y-2">
        {FUND_TRANSFER_TYPE_OPTIONS.map((option) => (
          <SourceOptionCard
            key={option.id}
            icon={fundTransferIcons[option.id]}
            title={option.label}
            subtitle={option.subtitle}
            onClick={() => startFundTransfer(option)}
          />
        ))}
      </div>
    </AddMoneyLayout>
  );
};
