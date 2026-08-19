import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Flashlight,
  Fingerprint,
  Image as ImageIcon,
  Loader2,
  QrCode,
  Share2,
  X,
  XCircle,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type {
  QrErrorType,
  QrMerchant,
  QrPaymentDraft,
  QrPaymentResult,
  QrPaymentStep,
} from '../../../types/retailQrPayment';
import {
  DEMO_QR_MERCHANTS,
  QR_DEMO_FAIL_AMOUNT,
  QR_PAYMENT_FEE,
  buildUpiTransactionId,
  clearQrPaymentPending,
  formatQrPaymentTimestamp,
  isQrPaymentDuplicate,
  markQrPaymentPending,
  validateQrAmount,
} from '../../../data/retailQrPaymentMock';
import { resetPaymentSuccessSound } from '../../../utils/paymentSuccessFeedback';
import { PaymentSuccessHero } from './PaymentSuccessHero';
import {
  AmountKeypad,
  QrCard,
  QrDetailRow,
  QrShell,
  QrStickyCTA,
  VerifiedBadge,
} from './shared/QrPayUI';

const INITIAL_DRAFT: QrPaymentDraft = {
  merchant: null,
  amount: '',
  accountId: '',
};

interface QrPaymentFlowProps {
  onClose: () => void;
}

export const QrPaymentFlow: React.FC<QrPaymentFlowProps> = ({ onClose }) => {
  const { executeTransfer, getPrimaryAccount, accounts, addToast, user } = useBanking();

  const [step, setStep] = useState<QrPaymentStep>('scanner');
  const [draft, setDraft] = useState<QrPaymentDraft>(INITIAL_DRAFT);
  const [qrError, setQrError] = useState<QrErrorType | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [authPin, setAuthPin] = useState('');
  const [amountError, setAmountError] = useState('');
  const [failReason, setFailReason] = useState('Transaction could not be completed.');
  const [result, setResult] = useState<QrPaymentResult | null>(null);
  const [lastResult, setLastResult] = useState<QrPaymentResult | null>(null);

  const primaryAccount = getPrimaryAccount();
  const payAccount = accounts.find((a) => a.id === draft.accountId) || primaryAccount;
  const fromLabel = payAccount
    ? `${payAccount.accountType} ${payAccount.maskedNumber}`
    : 'Savings Account';

  const amountNum = useMemo(() => {
    if (draft.merchant?.encodedAmount && step !== 'amount') {
      return draft.merchant.encodedAmount;
    }
    return Number(draft.amount) || 0;
  }, [draft.merchant, draft.amount, step]);

  useEffect(() => {
    resetPaymentSuccessSound();
  }, []);

  useEffect(() => {
    if (primaryAccount && !draft.accountId) {
      setDraft((d) => ({ ...d, accountId: primaryAccount.id }));
    }
  }, [primaryAccount, draft.accountId]);

  useEffect(() => {
    if (step === 'detected') {
      const t = setTimeout(() => setStep('merchant'), 650);
      return () => clearTimeout(t);
    }
  }, [step]);

  const resetAndClose = useCallback(() => {
    resetPaymentSuccessSound();
    clearQrPaymentPending();
    setStep('scanner');
    setDraft(INITIAL_DRAFT);
    setQrError(null);
    setAuthPin('');
    setResult(null);
    onClose();
  }, [onClose]);

  const handleScanMerchant = (merchant: QrMerchant, error?: QrErrorType) => {
    if (error) {
      setQrError(error);
      return;
    }
    if (isQrPaymentDuplicate(merchant.id)) {
      setQrError('duplicate');
      return;
    }
    setDraft((d) => ({
      ...d,
      merchant,
      amount: merchant.encodedAmount ? String(merchant.encodedAmount) : '',
      accountId: d.accountId || primaryAccount?.id || '',
    }));
    setStep('detected');
  };

  const goBack = () => {
    const flow: QrPaymentStep[] = ['scanner', 'merchant', 'amount', 'review', 'auth'];
    const idx = flow.indexOf(step);
    if (['processing', 'success', 'failed', 'transaction-detail', 'detected', 'my-qr'].includes(step)) {
      if (step === 'my-qr') setStep('scanner');
      else if (step === 'transaction-detail') setStep('success');
      else resetAndClose();
      return;
    }
    if (qrError) {
      setQrError(null);
      setStep('scanner');
      return;
    }
    if (idx <= 0) resetAndClose();
    else setStep(flow[idx - 1]);
  };

  const continueFromMerchant = () => {
    if (draft.merchant?.encodedAmount) {
      setStep('review');
    } else {
      setStep('amount');
    }
  };

  const continueFromAmount = () => {
    const validation = validateQrAmount(draft.amount, payAccount?.availableBalance ?? 0);
    if (!validation.valid) {
      setAmountError(validation.message ?? 'Invalid amount');
      return;
    }
    setAmountError('');
    setStep('review');
  };

  const runPayment = () => {
    if (!draft.merchant || !payAccount) return;
    markQrPaymentPending(draft.merchant.id);
    setStep('processing');

    const shouldFail = amountNum === QR_DEMO_FAIL_AMOUNT;

    setTimeout(() => {
      if (shouldFail) {
        clearQrPaymentPending();
        setFailReason('Transaction could not be completed.');
        setStep('failed');
        return;
      }

      const txn = executeTransfer({
        fromAccountId: payAccount.id,
        beneficiaryName: draft.merchant!.name,
        beneficiaryAccount: draft.merchant!.upiId,
        bankName: 'UPI',
        amount: amountNum,
        mode: 'UPI',
        remarks: `QR payment to ${draft.merchant!.name}`,
      });

      const paymentResult: QrPaymentResult = {
        transactionId: buildUpiTransactionId(),
        referenceNumber: txn.referenceNumber,
        amount: amountNum,
        merchantName: draft.merchant!.name,
        merchantUpiId: draft.merchant!.upiId,
        fromAccountLabel: fromLabel,
        timestamp: formatQrPaymentTimestamp(),
      };

      clearQrPaymentPending();
      setResult(paymentResult);
      setLastResult(paymentResult);
      setStep('success');
    }, 2200);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `Paid ₹${result.amount} to ${result.merchantName}. UPI Ref: ${result.transactionId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Payment Receipt', text });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard?.writeText?.(text);
    addToast({ type: 'success', title: 'Receipt copied', message: 'Payment details copied to clipboard.' });
  };

  if (qrError) {
    const copy: Record<QrErrorType, { title: string; message: string; primary: string }> = {
      invalid: {
        title: 'Invalid QR Code',
        message: "This QR code isn't supported.",
        primary: 'Scan Again',
      },
      expired: {
        title: 'QR Code Expired',
        message: 'Please ask the merchant for a new QR code.',
        primary: 'Scan Again',
      },
      unsupported: {
        title: 'Unsupported QR',
        message: "This QR code can't be used for payments.",
        primary: 'Scan Again',
      },
      duplicate: {
        title: 'Payment Already Initiated',
        message: 'A payment for this QR is already being processed.',
        primary: 'View Transaction',
      },
    };
    const e = copy[qrError];
    return (
      <QrShell title="Scan QR" onClose={resetAndClose}>
        <div className="flex flex-col items-center text-center px-6 pt-10">
          <span className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
            <XCircle className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold">{e.title}</h2>
          <p className="text-sm text-slate-500 mt-2">{e.message}</p>
        </div>
        <QrStickyCTA
          label={e.primary}
          onClick={() => {
            if (qrError === 'duplicate' && lastResult) {
              setResult(lastResult);
              setStep('transaction-detail');
              setQrError(null);
            } else {
              setQrError(null);
              setStep('scanner');
            }
          }}
          secondaryLabel="Done"
          onSecondary={resetAndClose}
        />
      </QrShell>
    );
  }

  if (step === 'scanner') {
    return (
      <QrShell title="Scan QR" onClose={resetAndClose} dark>
        <div className="flex flex-col items-center px-6 pt-4 pb-8">
          <div className="relative w-72 h-72 rounded-3xl border-2 border-white/30 flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-congress-blue-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-congress-blue-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-congress-blue-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-congress-blue-400 rounded-br-2xl" />
            <motion.div
              animate={{ y: [-120, 120] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', repeatType: 'reverse' }}
              className="absolute w-full h-0.5 bg-congress-blue-400/80 shadow-[0_0_12px_#38b9ff]"
            />
            <p className="text-white/50 text-xs text-center px-6">Scan a merchant QR to pay</p>
          </div>

          <div className="flex items-center justify-center gap-10 mt-10">
            <button
              type="button"
              onClick={() => setTorchOn(!torchOn)}
              className={`p-3.5 rounded-full ${torchOn ? 'bg-amber-400 text-slate-900' : 'bg-white/15 text-white'}`}
              aria-label="Toggle flash"
            >
              <Flashlight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScanMerchant(DEMO_QR_MERCHANTS.abc_restaurant)}
              className="p-3.5 rounded-full bg-white/15 text-white"
              aria-label="Upload from gallery"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setStep('my-qr')}
              className="p-3.5 rounded-full bg-white/15 text-white"
              aria-label="My QR"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[10px] text-white/40 mt-8 uppercase tracking-wider">Demo scan</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <button
              type="button"
              onClick={() => handleScanMerchant(DEMO_QR_MERCHANTS.abc_restaurant)}
              className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[11px]"
            >
              ABC Restaurant ₹850
            </button>
            <button
              type="button"
              onClick={() => handleScanMerchant(DEMO_QR_MERCHANTS.metro_grocery)}
              className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[11px]"
            >
              Open Amount
            </button>
            <button type="button" onClick={() => setQrError('invalid')} className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-[11px]">
              Invalid
            </button>
            <button type="button" onClick={() => setQrError('expired')} className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-[11px]">
              Expired
            </button>
            <button type="button" onClick={() => setQrError('unsupported')} className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-[11px]">
              Unsupported
            </button>
            <button
              type="button"
              onClick={() => {
                markQrPaymentPending('abc_restaurant');
                setQrError('duplicate');
              }}
              className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-[11px]"
            >
              Duplicate
            </button>
          </div>
        </div>
      </QrShell>
    );
  }

  if (step === 'my-qr') {
    return (
      <QrShell title="My QR" onBack={goBack} dark>
        <div className="flex flex-col items-center px-6 pt-6 text-white">
          <p className="text-xs text-white/60">{user?.name ?? 'Customer'}</p>
          <p className="text-sm font-mono mt-1">devansh@apexbank</p>
          <div className="my-6 p-4 bg-white rounded-2xl">
            <QrCode className="w-44 h-44 text-slate-900" strokeWidth={1} />
          </div>
          <p className="text-xs text-white/50">Share this QR to receive payments</p>
        </div>
      </QrShell>
    );
  }

  if (step === 'detected' && draft.merchant) {
    return (
      <QrShell title="Scan QR" onBack={goBack}>
        <div className="flex flex-col items-center text-center px-6 pt-10">
          <p className="text-sm font-bold text-emerald-600">QR Detected ✓</p>
          <h2 className="text-xl font-extrabold mt-3">{draft.merchant.name}</h2>
          <VerifiedBadge />
          <p className="text-sm text-slate-500 mt-2">{draft.merchant.city}</p>
          <QrCard className="mt-6 w-full">
            <p className="text-xs text-slate-500">UPI ID</p>
            <p className="text-sm font-mono font-semibold mt-1">{draft.merchant.upiId}</p>
            {draft.merchant.encodedAmount && (
              <>
                <p className="text-xs text-slate-500 mt-3">Amount</p>
                <p className="text-2xl font-extrabold mt-1">₹{draft.merchant.encodedAmount.toLocaleString('en-IN')}</p>
              </>
            )}
          </QrCard>
          <Loader2 className="w-5 h-5 animate-spin text-congress-blue-600 mt-6" />
        </div>
      </QrShell>
    );
  }

  if (step === 'merchant' && draft.merchant) {
    return (
      <QrShell title="Pay To" onBack={goBack}>
        <QrCard>
          <p className="text-xs text-slate-500">Pay To</p>
          <h2 className="text-lg font-bold mt-1">{draft.merchant.name}</h2>
          <div className="mt-1">
            <VerifiedBadge />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500">UPI ID</p>
            <p className="text-sm font-mono font-semibold">{draft.merchant.upiId}</p>
          </div>
          {draft.merchant.encodedAmount && (
            <div className="mt-3">
              <p className="text-xs text-slate-500">Amount</p>
              <p className="text-xl font-extrabold">₹{draft.merchant.encodedAmount.toLocaleString('en-IN')}</p>
            </div>
          )}
        </QrCard>
        <QrCard className="mt-3">
          <p className="text-xs text-slate-500">Pay From</p>
          <p className="text-sm font-bold mt-1">{fromLabel}</p>
          <p className="text-xs text-slate-500 mt-2">Available Balance</p>
          <p className="text-sm font-semibold text-emerald-600">
            ₹{(payAccount?.availableBalance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </QrCard>
        <QrStickyCTA label="Continue" onClick={continueFromMerchant} />
      </QrShell>
    );
  }

  if (step === 'amount' && draft.merchant) {
    return (
      <QrShell title="Enter Amount" onBack={goBack}>
        <div className="text-center px-4 mb-4">
          <p className="text-sm text-slate-500">{draft.merchant.name}</p>
          <p className="text-4xl font-extrabold mt-2 tabular-nums">
            ₹{draft.amount || '0'}
          </p>
          {amountError && <p className="text-xs text-red-600 mt-2">{amountError}</p>}
        </div>
        <AmountKeypad value={draft.amount} onChange={(v) => { setDraft((d) => ({ ...d, amount: v })); setAmountError(''); }} />
        <QrStickyCTA label="Continue" onClick={continueFromAmount} />
      </QrShell>
    );
  }

  if (step === 'review' && draft.merchant) {
    const total = amountNum + QR_PAYMENT_FEE;
    return (
      <QrShell title="Review Payment" onBack={goBack}>
        <QrCard>
          <QrDetailRow label="Paying To" value={draft.merchant.name} />
          <p className="text-xs text-emerald-600 font-semibold text-right -mt-1 mb-2">✓ Verified</p>
          <QrDetailRow label="Amount" value={`₹${amountNum.toLocaleString('en-IN')}`} bold />
          <QrDetailRow label="Payment Method" value="UPI" />
          <QrDetailRow label="Pay From" value={fromLabel} />
          <QrDetailRow label="Transaction Fee" value={`₹${QR_PAYMENT_FEE}`} />
          <QrDetailRow label="Total" value={`₹${total.toLocaleString('en-IN')}`} bold />
        </QrCard>
        <QrStickyCTA label={`Pay ₹${amountNum.toLocaleString('en-IN')}`} onClick={() => setStep('auth')} />
      </QrShell>
    );
  }

  if (step === 'auth' && draft.merchant) {
    return (
      <QrShell title="Confirm Payment" onBack={goBack}>
        <div className="text-center pt-4 px-4">
          <p className="text-3xl font-extrabold tabular-nums">₹{amountNum.toLocaleString('en-IN')}</p>
          <p className="text-sm text-slate-500 mt-1">{draft.merchant.name}</p>
        </div>
        <QrCard className="mt-4">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-3">
            Enter MPIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={authPin}
            onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="• • • • • •"
            className="w-full text-center text-xl tracking-[0.4em] font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-congress-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              addToast({ type: 'info', title: 'Biometric verified', message: 'Fingerprint authenticated (demo).' });
              setAuthPin('123456');
            }}
            className="w-full mt-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Fingerprint className="w-4 h-4" /> Use Biometric
          </button>
        </QrCard>
        <QrStickyCTA
          label="Confirm"
          disabled={authPin.length < 6}
          onClick={runPayment}
        />
      </QrShell>
    );
  }

  if (step === 'processing' && draft.merchant) {
    return (
      <QrShell title="Processing Payment" onBack={() => {}}>
        <div className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center">
          <Loader2 className="w-10 h-10 text-congress-blue-600 animate-spin mb-4" />
          <p className="text-2xl font-extrabold tabular-nums">₹{amountNum.toLocaleString('en-IN')}</p>
          <p className="text-sm text-slate-500 mt-2">Paying {draft.merchant.name}</p>
          <p className="text-xs text-slate-400 mt-4">Please don&apos;t close the app.</p>
        </div>
      </QrShell>
    );
  }

  if (step === 'success' && result) {
    return (
      <QrShell title="Payment" onClose={resetAndClose}>
        <PaymentSuccessHero
          amount={result.amount}
          merchantName={result.merchantName}
          fromAccountLabel={result.fromAccountLabel}
          timestamp={result.timestamp}
          transactionId={result.transactionId}
        />
        <div className="px-4 space-y-2 pb-4">
          <button
            type="button"
            onClick={() => setStep('transaction-detail')}
            className="w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            View Transaction
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share Receipt
          </button>
          <button type="button" onClick={resetAndClose} className="w-full py-3 rounded-2xl font-semibold text-sm text-slate-600">
            Done
          </button>
        </div>
      </QrShell>
    );
  }

  if (step === 'transaction-detail' && result) {
    return (
      <QrShell title="Transaction Details" onBack={() => setStep('success')}>
        <QrCard>
          <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-red-600 uppercase">Debit</p>
            <p className="text-2xl font-extrabold mt-1">−₹{result.amount.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-500 mt-1">UPI QR Payment</p>
          </div>
          <QrDetailRow label="Paid to" value={result.merchantName} />
          <QrDetailRow label="UPI ID" value={result.merchantUpiId} />
          <QrDetailRow label="From" value={result.fromAccountLabel} />
          <QrDetailRow label="UPI Transaction ID" value={result.transactionId} />
          <QrDetailRow label="Reference" value={result.referenceNumber} />
          <QrDetailRow label="Date" value={result.timestamp} />
          <QrDetailRow label="Status" value="Completed" bold />
        </QrCard>
        <QrStickyCTA label="Done" onClick={resetAndClose} />
      </QrShell>
    );
  }

  if (step === 'failed' && draft.merchant) {
    return (
      <QrShell title="Payment Failed" onClose={resetAndClose}>
        <div className="flex flex-col items-center text-center px-6 pt-8">
          <span className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-4">
            <X className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold">Payment Failed</h2>
          <p className="text-sm text-slate-500 mt-2">We couldn&apos;t complete this payment.</p>
          <p className="text-2xl font-extrabold mt-4">₹{amountNum.toLocaleString('en-IN')}</p>
          <p className="text-sm font-semibold mt-1">{draft.merchant.name}</p>
          <QrCard className="mt-5 w-full text-left">
            <p className="text-xs font-bold text-slate-500 uppercase">Reason</p>
            <p className="text-sm font-semibold mt-1">{failReason}</p>
          </QrCard>
        </div>
        <QrStickyCTA
          label="Try Again"
          onClick={() => setStep('review')}
          secondaryLabel="Done"
          onSecondary={resetAndClose}
        />
      </QrShell>
    );
  }

  return null;
};
