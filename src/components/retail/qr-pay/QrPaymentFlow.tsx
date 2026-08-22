import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  CheckCircle2,
  Flashlight,
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
  QR_DEMO_PENDING_AMOUNT,
  buildUpiTransactionId,
  clearQrPaymentPending,
  formatQrPaymentTimestamp,
  isQrPaymentDuplicate,
  markQrPaymentPending,
  validateQrAmount,
} from '../../../data/retailQrPaymentMock';
import {
  getJointStatusLabel,
  requiresJointApproval,
  verifyRetailJointUserMpin,
} from '../../../data/retailJointTransferMock';
import type { JointTransferRequest } from '../../../types/retailJointTransfer';
import { resetPaymentSuccessSound } from '../../../utils/paymentSuccessFeedback';
import { PaymentSuccessHero } from './PaymentSuccessHero';
import {
  AmountKeypad,
  QrShell,
  QrStickyCTA,
  UpiPinSheet,
  VerifiedBadge,
} from './shared/QrPayUI';
import { ReviewRow } from '../add-money/shared/AddMoneyUI';

const INITIAL_DRAFT: QrPaymentDraft = {
  merchant: null,
  amount: '',
  accountId: '',
};

const PAYMENT_DELAY_MS = 1500;

interface QrPaymentFlowProps {
  onClose: () => void;
}

export const QrPaymentFlow: React.FC<QrPaymentFlowProps> = ({ onClose }) => {
  const {
    executeTransfer,
    getPrimaryAccount,
    accounts,
    addToast,
    user,
    retailActiveUserId,
    submitJointTransferRequest,
  } = useBanking();

  const [step, setStep] = useState<QrPaymentStep>('scanner');
  const [draft, setDraft] = useState<QrPaymentDraft>(INITIAL_DRAFT);
  const [qrError, setQrError] = useState<QrErrorType | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [result, setResult] = useState<QrPaymentResult | null>(null);
  const [lastResult, setLastResult] = useState<QrPaymentResult | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<JointTransferRequest | null>(null);

  const primaryAccount = getPrimaryAccount();
  const payAccount = accounts.find((a) => a.id === draft.accountId) || primaryAccount;
  const needsApproval = requiresJointApproval(payAccount);
  const fromLabel = payAccount
    ? `${payAccount.accountType} ${payAccount.maskedNumber}`
    : 'Savings Account';

  const isOpenAmount = !draft.merchant?.encodedAmount;

  const amountNum = useMemo(() => {
    if (draft.merchant?.encodedAmount) {
      return draft.merchant.encodedAmount;
    }
    return Number(draft.amount) || 0;
  }, [draft.merchant, draft.amount]);

  useEffect(() => {
    resetPaymentSuccessSound();
  }, []);

  useEffect(() => {
    if (primaryAccount && !draft.accountId) {
      setDraft((d) => ({ ...d, accountId: primaryAccount.id }));
    }
  }, [primaryAccount, draft.accountId]);

  const resetFlow = useCallback(() => {
    setStep('scanner');
    setDraft(INITIAL_DRAFT);
    setQrError(null);
    setAuthPin('');
    setAuthError('');
    setAmountError('');
    setShowPinSheet(false);
    setIsPaying(false);
    setResult(null);
    setSubmittedRequest(null);
  }, []);

  const resetAndClose = useCallback(() => {
    resetPaymentSuccessSound();
    clearQrPaymentPending();
    resetFlow();
    onClose();
  }, [onClose, resetFlow]);

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
    setStep('payment');
  };

  const goBack = () => {
    if (step === 'my-qr') {
      setStep('scanner');
      return;
    }
    if (['success', 'failed', 'pending'].includes(step)) {
      resetAndClose();
      return;
    }
    if (step === 'payment') {
      resetFlow();
      return;
    }
    resetAndClose();
  };

  const cyclePayAccount = () => {
    if (accounts.length <= 1) return;
    const idx = accounts.findIndex((a) => a.id === draft.accountId);
    const next = accounts[(idx + 1) % accounts.length];
    setDraft((d) => ({ ...d, accountId: next.id }));
  };

  const handlePayTap = () => {
    if (!draft.merchant || !payAccount) return;

    if (isOpenAmount) {
      const validation = validateQrAmount(draft.amount, payAccount.availableBalance ?? 0);
      if (!validation.valid) {
        setAmountError(validation.message ?? 'Invalid amount');
        return;
      }
    }

    setAmountError('');
    setAuthPin('');
    setShowPinSheet(true);
  };

  const closePinSheet = () => {
    if (isPaying) return;
    setShowPinSheet(false);
    setAuthPin('');
    setAuthError('');
  };

  const runPayment = () => {
    if (!draft.merchant || !payAccount || authPin.length < 6) return;

    if (needsApproval) {
      if (!verifyRetailJointUserMpin(retailActiveUserId, authPin)) {
        setAuthError('Incorrect MPIN.');
        setAuthPin('');
        return;
      }
      setAuthError('');

      const req = submitJointTransferRequest({
        fromAccountId: payAccount.id,
        beneficiaryName: draft.merchant.name,
        beneficiaryBank: 'UPI',
        beneficiaryAccountMasked: draft.merchant.upiId,
        amount: amountNum,
        mode: 'UPI',
        note: `QR payment to ${draft.merchant.name}`,
      });
      setIsPaying(false);
      setShowPinSheet(false);
      setAuthPin('');
      if (req) {
        setSubmittedRequest(req);
        setStep('submitted');
      } else {
        setStep('unavailable');
      }
      return;
    }

    markQrPaymentPending(draft.merchant.id);
    setIsPaying(true);

    const shouldFail = amountNum === QR_DEMO_FAIL_AMOUNT;
    const shouldPending = amountNum === QR_DEMO_PENDING_AMOUNT;

    setTimeout(() => {
      setIsPaying(false);
      setShowPinSheet(false);
      setAuthPin('');

      if (shouldFail) {
        clearQrPaymentPending();
        setStep('failed');
        return;
      }

      if (shouldPending) {
        setStep('pending');
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
    }, PAYMENT_DELAY_MS);
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

  const payCtaLabel =
    amountNum > 0
      ? needsApproval
        ? `Submit ₹${amountNum.toLocaleString('en-IN')} for Approval`
        : `Pay ₹${amountNum.toLocaleString('en-IN')}`
      : needsApproval
        ? 'Submit for Approval'
        : 'Pay';

  if (step === 'unavailable') {
    return (
      <QrShell title="" onClose={resetAndClose}>
        <div className="flex flex-col items-center text-center px-6 pt-10">
          <span className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
            <XCircle className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold">Approval Unavailable</h2>
          <p className="text-sm text-slate-500 mt-3">
            This jointly operated account requires authorization from another eligible joint holder.
          </p>
        </div>
        <QrStickyCTA label="Try Again" onClick={() => setStep('payment')} secondaryLabel="Done" onSecondary={resetAndClose} />
      </QrShell>
    );
  }

  if (step === 'submitted' && submittedRequest && payAccount) {
    return (
      <QrShell title="" onClose={resetAndClose}>
        <div className="flex flex-col items-center text-center px-4 pt-8">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mb-3" />
          <h2 className="text-lg font-bold">Sent for Approval</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">
            Your QR payment request has been sent to the other joint holder for approval.
          </p>
          <div className="w-full mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left space-y-2">
            <ReviewRow label="Amount" value={`₹${submittedRequest.amount.toLocaleString('en-IN')}`} />
            <ReviewRow label="To" value={submittedRequest.beneficiaryName} />
            <ReviewRow
              label="From"
              value={`${payAccount.jointAccountLabel ?? payAccount.accountType} ${payAccount.maskedNumber}`}
            />
            <ReviewRow label="Status" value={getJointStatusLabel(submittedRequest.status)} />
            <ReviewRow label="Reference" value={submittedRequest.reference} />
          </div>
        </div>
        <QrStickyCTA label="Done" onClick={resetAndClose} />
      </QrShell>
    );
  }

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
              setQrError(null);
              setStep('pending');
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
            <p className="text-white/50 text-xs text-center px-6">Scan any QR code</p>
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

  if (step === 'payment' && draft.merchant) {
    return (
      <>
        <QrShell title="" onBack={goBack}>
          <div className="flex flex-col items-center text-center px-4 pt-6">
            <h2 className="text-xl font-extrabold">{draft.merchant.name}</h2>
            <div className="mt-1">
              <VerifiedBadge />
            </div>

            <p className="text-4xl font-extrabold tabular-nums mt-6">
              ₹{isOpenAmount ? draft.amount || '0' : amountNum.toLocaleString('en-IN')}
            </p>
            {isOpenAmount && (
              <p className="text-xs text-slate-500 mt-1">Enter amount</p>
            )}
            {amountError && <p className="text-xs text-red-600 mt-2">{amountError}</p>}
          </div>

          {isOpenAmount && (
            <div className="mt-4">
              <AmountKeypad
                value={draft.amount}
                onChange={(v) => {
                  setDraft((d) => ({ ...d, amount: v }));
                  setAmountError('');
                }}
              />
            </div>
          )}

          <div className="mx-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={cyclePayAccount}
              className="w-full flex items-center justify-between gap-3 py-3"
            >
              <div className="text-left">
                <p className="text-xs text-slate-500">Pay from</p>
                <p className="text-sm font-bold mt-0.5">{fromLabel}</p>
                {needsApproval && (
                  <p className="text-[11px] text-blue-700 font-semibold mt-1">Jointly Operated · Approval required</p>
                )}
              </div>
              {accounts.length > 1 && <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
            </button>
          </div>

          {needsApproval && (
            <p className="mx-4 text-xs text-slate-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 rounded-xl p-3">
              Joint account selected — payment will be sent to the other joint holder for approval.
            </p>
          )}

          <QrStickyCTA label={payCtaLabel} onClick={handlePayTap} />
        </QrShell>

        <UpiPinSheet
          open={showPinSheet}
          merchantName={draft.merchant.name}
          amount={amountNum}
          pin={authPin}
          isPaying={isPaying}
          pinLabel={needsApproval ? 'Enter MPIN' : undefined}
          confirmLabel={needsApproval ? 'Submit for Approval' : undefined}
          pinError={authError}
          onPinChange={(value) => {
            setAuthPin(value);
            setAuthError('');
          }}
          onConfirm={runPayment}
          onClose={closePinSheet}
        />
      </>
    );
  }

  if (step === 'success' && result) {
    return (
      <QrShell title="" onClose={resetAndClose}>
        <PaymentSuccessHero
          amount={result.amount}
          merchantName={result.merchantName}
          fromAccountLabel={result.fromAccountLabel}
          timestamp={result.timestamp}
          transactionId={result.transactionId}
        />
        <div className="px-4 pb-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 min-h-11"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            type="button"
            onClick={resetAndClose}
            className="py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm min-h-11"
          >
            Done
          </button>
        </div>
      </QrShell>
    );
  }

  if (step === 'pending' && draft.merchant) {
    return (
      <QrShell title="" onClose={resetAndClose}>
        <div className="flex flex-col items-center text-center px-6 pt-10">
          <span className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-4">
            <Loader2 className="w-9 h-9 animate-spin" />
          </span>
          <h2 className="text-lg font-bold">Payment Pending</h2>
          <p className="text-2xl font-extrabold tabular-nums mt-4">₹{amountNum.toLocaleString('en-IN')}</p>
          <p className="text-sm font-semibold mt-1">{draft.merchant.name}</p>
          <p className="text-sm text-slate-500 mt-3">We&apos;re checking your payment status.</p>
        </div>
        <QrStickyCTA
          label="View Transaction"
          onClick={() => {
            if (lastResult) {
              setResult(lastResult);
              setStep('success');
            } else {
              resetAndClose();
            }
          }}
          secondaryLabel="Done"
          onSecondary={resetAndClose}
        />
      </QrShell>
    );
  }

  if (step === 'failed' && draft.merchant) {
    return (
      <QrShell title="" onClose={resetAndClose}>
        <div className="flex flex-col items-center text-center px-6 pt-10">
          <span className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-4">
            <X className="w-9 h-9" />
          </span>
          <h2 className="text-lg font-bold">Payment Failed</h2>
          <p className="text-2xl font-extrabold tabular-nums mt-4">₹{amountNum.toLocaleString('en-IN')}</p>
          <p className="text-sm font-semibold mt-1">{draft.merchant.name}</p>
          <p className="text-sm text-slate-500 mt-3">We couldn&apos;t complete this payment.</p>
        </div>
        <QrStickyCTA
          label="Try Again"
          onClick={() => setStep('payment')}
          secondaryLabel="Done"
          onSecondary={resetAndClose}
        />
      </QrShell>
    );
  }

  return null;
};
