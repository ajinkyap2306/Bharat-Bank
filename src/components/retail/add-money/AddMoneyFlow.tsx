import React, { useCallback, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Fingerprint,
  Plus,
  QrCode,
  XCircle,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type {
  AddMoneyDraft,
  AddMoneyResult,
  AddMoneySourceType,
  AddMoneyStep,
} from '../../../types/retailAddMoney';
import {
  ADD_MONEY_LIMITS,
  DEMO_FAIL_AMOUNT,
  LINKED_BANK_ACCOUNTS,
  LINKED_DEBIT_CARDS,
  QUICK_AMOUNTS,
  UPI_APPS,
  buildTransactionId,
  formatAddMoneyTimestamp,
  playAddMoneySuccessChime,
  validateAddMoneyAmount,
} from '../../../data/retailAddMoneyMock';
import {
  AddMoneyLayout,
  AmountField,
  ProcessingState,
  QuickAmountChips,
  RadioSelectCard,
  ReviewRow,
  SourceOptionCard,
  StickyAddMoneyCTA,
} from './shared/AddMoneyUI';

const INITIAL_DRAFT: AddMoneyDraft = {
  sourceType: null,
  sourceId: '',
  upiId: 'devansh@apexbank',
  upiApp: '',
  amount: '',
};

interface AddMoneyFlowProps {
  onClose: () => void;
}

export const AddMoneyFlow: React.FC<AddMoneyFlowProps> = ({ onClose }) => {
  const { addMoneyToAccount, getPrimaryAccount, user, addToast } = useBanking();

  const [step, setStep] = useState<AddMoneyStep>('home');
  const [draft, setDraft] = useState<AddMoneyDraft>(INITIAL_DRAFT);
  const [amountError, setAmountError] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [cardOtp, setCardOtp] = useState('');
  const [result, setResult] = useState<AddMoneyResult | null>(null);
  const [failReason, setFailReason] = useState('We couldn\'t complete this transaction.');
  const chimePlayed = useRef(false);

  const skippedSourceSelection =
    draft.sourceType === 'bank_account' && LINKED_BANK_ACCOUNTS.length === 1 ||
    draft.sourceType === 'debit_card' && LINKED_DEBIT_CARDS.length === 1;

  const primaryAccount = getPrimaryAccount();
  const creditAccountLabel = primaryAccount
    ? `${primaryAccount.accountType} ${primaryAccount.maskedNumber}`
    : 'Savings Account';

  const selectedBank = LINKED_BANK_ACCOUNTS.find((a) => a.id === draft.sourceId);
  const selectedCard = LINKED_DEBIT_CARDS.find((c) => c.id === draft.sourceId);

  const sourceLabel = useMemo(() => {
    if (draft.sourceType === 'bank_account' && selectedBank) {
      return `${selectedBank.bankName} ${selectedBank.maskedNumber}`;
    }
    if (draft.sourceType === 'debit_card' && selectedCard) {
      return `${selectedCard.bankName} ${selectedCard.maskedNumber}`;
    }
    if (draft.sourceType === 'upi') {
      const app = UPI_APPS.find((a) => a.id === draft.upiApp)?.label;
      return app ? `${app} (${draft.upiId})` : draft.upiId;
    }
    return '—';
  }, [draft, selectedBank, selectedCard]);

  const amountNum = Number(draft.amount) || 0;

  const goBack = useCallback(() => {
    const flow: AddMoneyStep[] = ['home', 'select-source', 'amount', 'auth'];
    if (['processing', 'success', 'failed', 'transaction-detail'].includes(step)) {
      onClose();
      return;
    }
    if (step === 'amount') {
      if (skippedSourceSelection || draft.sourceType === 'upi') {
        if (draft.sourceType === 'upi') setStep('select-source');
        else setStep('home');
      } else {
        setStep('select-source');
      }
      return;
    }
    const idx = flow.indexOf(step);
    if (idx <= 0) onClose();
    else setStep(flow[idx - 1]);
  }, [step, onClose, skippedSourceSelection, draft.sourceType]);

  const pickSourceType = (sourceType: AddMoneySourceType) => {
    if (sourceType === 'bank_account' && LINKED_BANK_ACCOUNTS.length === 1) {
      setDraft((d) => ({
        ...d,
        sourceType,
        sourceId: LINKED_BANK_ACCOUNTS[0].id,
      }));
      setStep('amount');
      return;
    }
    if (sourceType === 'debit_card' && LINKED_DEBIT_CARDS.length === 1) {
      setDraft((d) => ({
        ...d,
        sourceType,
        sourceId: LINKED_DEBIT_CARDS[0].id,
      }));
      setStep('amount');
      return;
    }
    setDraft((d) => ({
      ...d,
      sourceType,
      sourceId: sourceType === 'upi' ? '' : d.sourceId,
      upiApp: sourceType === 'upi' ? '' : d.upiApp,
    }));
    setStep('select-source');
  };

  const validateAmount = () => {
    const validation = validateAddMoneyAmount(
      draft.amount,
      ADD_MONEY_LIMITS,
      draft.sourceType,
      draft.sourceType === 'bank_account' ? selectedBank?.availableBalance : undefined
    );
    if (validation.code !== 'valid') {
      setAmountError(validation.message ?? 'Enter a valid amount.');
      return false;
    }
    setAmountError('');
    return true;
  };

  const runProcessing = () => {
    setStep('processing');
    const shouldFail = amountNum === DEMO_FAIL_AMOUNT;

    setTimeout(() => {
      if (shouldFail) {
        setFailReason('We couldn\'t complete this transaction.');
        setStep('failed');
        return;
      }

      if (!primaryAccount) {
        setFailReason('Destination account is unavailable.');
        setStep('failed');
        return;
      }

      const txn = addMoneyToAccount(primaryAccount.id, amountNum, sourceLabel);
      const successResult: AddMoneyResult = {
        transactionId: buildTransactionId(),
        referenceNumber: txn.referenceNumber,
        amount: amountNum,
        creditedAccountLabel: creditAccountLabel,
        sourceLabel,
        timestamp: formatAddMoneyTimestamp(),
      };
      setResult(successResult);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.55 } });
      if (!chimePlayed.current) {
        playAddMoneySuccessChime();
        chimePlayed.current = true;
      }
      addToast({
        type: 'success',
        title: 'Money Added',
        message: `₹${amountNum.toLocaleString('en-IN')} credited to your account.`,
      });
      setStep('success');
    }, 2200);
  };

  const handleAuthConfirm = () => {
    if (draft.sourceType === 'bank_account' && authPin.length < 6) {
      addToast({ type: 'error', title: 'Invalid TPIN', message: 'Enter your 6-digit TPIN.' });
      return;
    }
    if (draft.sourceType === 'debit_card' && cardOtp.length < 6) {
      addToast({ type: 'error', title: 'Invalid OTP', message: 'Enter the 6-digit OTP sent to your mobile.' });
      return;
    }
    if (draft.sourceType === 'upi' && !draft.upiApp) {
      addToast({ type: 'error', title: 'Select UPI App', message: 'Choose a UPI app to continue.' });
      return;
    }
    runProcessing();
  };

  if (step === 'processing') {
    return (
      <AddMoneyLayout title="Add Money" onBack={() => {}}>
        <ProcessingState title={`Adding ₹${amountNum.toLocaleString('en-IN')}…`} amount={amountNum} />
      </AddMoneyLayout>
    );
  }

  if (step === 'success' && result) {
    return (
      <AddMoneyLayout title="Add Money" onBack={onClose}>
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
            Money Added Successfully
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.28 }}
            className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tabular-nums"
          >
            ₹{result.amount.toLocaleString('en-IN')}
          </motion.p>
          <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-2">
            <ReviewRow label="Added to" value={result.creditedAccountLabel} />
            <ReviewRow label="Date & Time" value={result.timestamp} />
            <ReviewRow label="Transaction ID" value={result.transactionId} />
          </div>
        </div>
        <StickyAddMoneyCTA
          label="View Transaction"
          onClick={() => setStep('transaction-detail')}
          secondaryLabel="Done"
          onSecondary={onClose}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'transaction-detail' && result) {
    return (
      <AddMoneyLayout title="Transaction Details" onBack={() => setStep('success')}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-emerald-600 uppercase">Credit</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              +₹{result.amount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 mt-1">Money Added via {result.sourceLabel}</p>
          </div>
          <div className="pt-2">
            <ReviewRow label="Reference" value={result.referenceNumber} />
            <ReviewRow label="Transaction ID" value={result.transactionId} />
            <ReviewRow label="To Account" value={result.creditedAccountLabel} />
            <ReviewRow label="From" value={result.sourceLabel} />
            <ReviewRow label="Date" value={result.timestamp} />
            <ReviewRow label="Status" value="Completed" bold />
          </div>
        </div>
        <StickyAddMoneyCTA label="Done" onClick={onClose} />
      </AddMoneyLayout>
    );
  }

  if (step === 'failed') {
    return (
      <AddMoneyLayout title="Add Money" onBack={onClose}>
        <div className="flex flex-col items-center text-center px-2 pt-6">
          <span className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-4">
            <XCircle className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Money Addition Failed</h2>
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

  if (step === 'auth') {
    return (
      <AddMoneyLayout title="Confirm Add Money" onBack={goBack}>
        <div className="text-center pt-2">
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            ₹{amountNum.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-500 mt-1">From {sourceLabel}</p>
        </div>

        {draft.sourceType === 'bank_account' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mt-4">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-3">
              Enter TPIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={authPin}
              onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              className="w-full text-center text-xl tracking-[0.5em] font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-congress-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                addToast({ type: 'info', title: 'Biometric', message: 'Fingerprint verified (demo).' });
                setAuthPin('123456');
              }}
              className="w-full mt-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4" /> Use Biometric
            </button>
          </div>
        )}

        {draft.sourceType === 'debit_card' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mt-4">
            <p className="text-xs text-slate-500 mb-3">
              OTP sent to {user?.phone ?? 'your registered mobile'} for {selectedCard?.maskedNumber}
            </p>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              Enter Card OTP
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={cardOtp}
              onChange={(e) => setCardOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit OTP"
              className="w-full text-center text-lg font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-congress-blue-500"
            />
          </div>
        )}

        {draft.sourceType === 'upi' && (
          <div className="space-y-2 mt-4">
            <p className="text-xs font-bold text-slate-500 px-1">Authorize in UPI App</p>
            {UPI_APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, upiApp: app.id }))}
                className={`w-full p-3.5 rounded-2xl border text-left font-semibold text-sm ${
                  draft.upiApp === app.id
                    ? 'border-congress-blue-600 bg-congress-blue-50 dark:bg-congress-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {app.label}
              </button>
            ))}
          </div>
        )}

        <StickyAddMoneyCTA label="Confirm" onClick={handleAuthConfirm} />
      </AddMoneyLayout>
    );
  }

  if (step === 'amount') {
    return (
      <AddMoneyLayout title="Add Money" onBack={goBack}>
        <AmountField
          value={draft.amount}
          onChange={(v) => {
            setDraft((d) => ({ ...d, amount: v }));
            setAmountError('');
          }}
          error={amountError}
        />
        <QuickAmountChips
          amounts={QUICK_AMOUNTS}
          selected={draft.amount}
          onSelect={(amt) => {
            setDraft((d) => ({ ...d, amount: String(amt) }));
            setAmountError('');
          }}
        />
        <p className="text-[11px] text-slate-400 px-1">
          Minimum amount: ₹{ADD_MONEY_LIMITS.minAmount.toLocaleString('en-IN')} · Maximum amount: ₹
          {ADD_MONEY_LIMITS.maxAmount.toLocaleString('en-IN')}
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adding from</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{sourceLabel}</p>
        </div>
        <StickyAddMoneyCTA
          label={`Add ₹${amountNum > 0 ? amountNum.toLocaleString('en-IN') : '0'}`}
          onClick={() => {
            if (validateAmount()) setStep('auth');
          }}
        />
      </AddMoneyLayout>
    );
  }

  if (step === 'select-source') {
    if (draft.sourceType === 'bank_account') {
      return (
        <AddMoneyLayout title="Select Bank Account" subtitle="Which account do you want to use?" onBack={goBack}>
          <div className="space-y-2">
            {LINKED_BANK_ACCOUNTS.map((account) => (
              <RadioSelectCard
                key={account.id}
                selected={draft.sourceId === account.id}
                title={account.bankName}
                subtitle={`${account.accountType} ${account.maskedNumber}`}
                meta={`Available ₹${account.availableBalance.toLocaleString('en-IN')}`}
                onSelect={() => setDraft((d) => ({ ...d, sourceId: account.id }))}
              />
            ))}
          </div>
          <StickyAddMoneyCTA
            label="Continue"
            disabled={!draft.sourceId}
            onClick={() => setStep('amount')}
          />
        </AddMoneyLayout>
      );
    }

    if (draft.sourceType === 'debit_card') {
      return (
        <AddMoneyLayout title="Select Debit Card" onBack={goBack}>
          <div className="space-y-2">
            {LINKED_DEBIT_CARDS.map((card) => (
              <RadioSelectCard
                key={card.id}
                selected={draft.sourceId === card.id}
                title="Debit Card"
                subtitle={card.maskedNumber}
                onSelect={() => setDraft((d) => ({ ...d, sourceId: card.id }))}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                addToast({ type: 'info', title: 'Add Card', message: 'Card linking will be available in a future update.' })
              }
              className="w-full p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-sm font-semibold text-congress-blue-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Debit Card
            </button>
          </div>
          <StickyAddMoneyCTA
            label="Continue"
            disabled={!draft.sourceId}
            onClick={() => setStep('amount')}
          />
        </AddMoneyLayout>
      );
    }

    return (
      <AddMoneyLayout title="Add Money via UPI" onBack={goBack}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">UPI ID</label>
          <input
            type="text"
            value={draft.upiId}
            onChange={(e) => setDraft((d) => ({ ...d, upiId: e.target.value }))}
            placeholder="name@upi"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium outline-none focus:border-congress-blue-500"
          />
        </div>
        <p className="text-xs text-slate-500 px-1">Amount will be entered on the next screen.</p>
        <p className="text-center text-xs text-slate-400">or</p>
        <p className="text-xs font-bold text-slate-500 px-1">Choose UPI App</p>
        <div className="grid grid-cols-3 gap-2">
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => setDraft((d) => ({ ...d, upiApp: app.id }))}
              className={`p-3 rounded-2xl border text-xs font-bold ${
                draft.upiApp === app.id
                  ? 'border-congress-blue-600 bg-congress-blue-50 dark:bg-congress-blue-950/30 text-congress-blue-700'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>
        <StickyAddMoneyCTA
          label="Continue"
          disabled={!draft.upiId.trim()}
          onClick={() => setStep('amount')}
        />
      </AddMoneyLayout>
    );
  }

  return (
    <AddMoneyLayout title="Add Money" onBack={onClose}>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Add money from
        </p>
        <div className="space-y-2">
          <SourceOptionCard
            icon={<Building2 className="w-5 h-5" />}
            title="Bank Account"
            subtitle="Linked bank account"
            onClick={() => pickSourceType('bank_account')}
          />
          <SourceOptionCard
            icon={<CreditCard className="w-5 h-5" />}
            title="Debit Card"
            subtitle="Add using card"
            onClick={() => pickSourceType('debit_card')}
          />
          <SourceOptionCard
            icon={<QrCode className="w-5 h-5" />}
            title="UPI"
            subtitle="Pay using UPI"
            onClick={() => pickSourceType('upi')}
          />
        </div>
      </div>
    </AddMoneyLayout>
  );
};
