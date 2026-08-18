import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2, XCircle, Download, Share2, ChevronRight,
  AlertTriangle, Star,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { BillPayStep, BillPayContext } from './billTypes';
import {
  BillLayout, BillCard, StickyBillCTA, BillStatusBadge, ProcessingTimeline,
  FetchingLoader, AmountInput, getCategoryIcon, getBillIcon,
} from './shared/BillUI';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { FetchedBill, BillPaymentRecord } from '../../../types/bills';
import { BillCategory } from '../../../types/bills';

interface BillPayFlowProps {
  initialContext: BillPayContext;
  onBack: () => void;
  onDone: () => void;
  onViewReceipt: (paymentId: string) => void;
}

export const BillPayFlow: React.FC<BillPayFlowProps> = ({
  initialContext, onBack, onDone, onViewReceipt,
}) => {
  const {
    billProviders, billers, accounts, fetchBill, processBillPayment,
    getDefaultDebitAccount, addToast, addSavedBiller,
  } = useBanking();

  const [step, setStep] = useState<BillPayStep>(() => {
    if (initialContext.savedBillerId || initialContext.providerId) return 'customer-details';
    if (initialContext.category) return 'biller-list';
    return 'category';
  });

  const [category, setCategory] = useState<BillCategory | undefined>(initialContext.category);
  const [providerId, setProviderId] = useState(initialContext.providerId || '');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fetchedBill, setFetchedBill] = useState<FetchedBill | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [amountType, setAmountType] = useState<'full' | 'custom'>('full');
  const [selectedAccountId, setSelectedAccountId] = useState(getDefaultDebitAccount().id);
  const [confirmed, setConfirmed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [fetchStage, setFetchStage] = useState(0);
  const [processStage, setProcessStage] = useState(0);
  const [paymentResult, setPaymentResult] = useState<BillPaymentRecord | null>(null);
  const [saveBiller, setSaveBiller] = useState(false);
  const [billerNickname, setBillerNickname] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const savedBiller = initialContext.savedBillerId
    ? billers.find((b) => b.id === initialContext.savedBillerId)
    : undefined;

  const provider = billProviders.find((p) => p.id === (providerId || savedBiller?.providerId));
  const eligibleAccounts = accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType));
  const selectedAccount = eligibleAccounts.find((a) => a.id === selectedAccountId) || getDefaultDebitAccount();

  useEffect(() => {
    if (savedBiller && !providerId) {
      setProviderId(savedBiller.providerId || '');
      setFormData({ consumerNumber: savedBiller.consumerNumber, mobile: savedBiller.consumerNumber });
    }
  }, [savedBiller, providerId]);

  const goBack = useCallback(() => {
    const flow: BillPayStep[] = ['category', 'biller-list', 'biller-info', 'customer-details', 'bill-details', 'amount', 'select-account', 'review'];
    const idx = flow.indexOf(step);
    if (idx <= 0 || ['fetching', 'processing', 'success', 'failed', 'auth'].includes(step)) {
      onBack();
    } else {
      setStep(flow[idx - 1]);
    }
  }, [step, onBack]);

  const handleFetchBill = () => {
    if (!provider) return;
    const missing = provider.identifierFields.filter((f) => f.required && !formData[f.key]);
    if (missing.length) {
      addToast({ type: 'error', title: 'Missing Fields', message: `Please enter ${missing[0].label}` });
      return;
    }
    setStep('fetching');
    setFetchStage(0);
    const t1 = setTimeout(() => setFetchStage(1), 800);
    const t2 = setTimeout(() => setFetchStage(2), 1600);
    const t3 = setTimeout(() => {
      const bill = fetchBill(provider.id, formData);
      if (bill) {
        setFetchedBill(bill);
        setPayAmount(bill.amount.toString());
        setStep('bill-details');
      }
      clearTimeout(t1);
      clearTimeout(t2);
    }, 2400);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setStep('processing');
    setIsProcessing(true);
    setProcessStage(0);

    const stages = [0, 1, 2, 3];
    stages.forEach((s, i) => setTimeout(() => setProcessStage(s), i * 700));

    setTimeout(() => {
      if (!fetchedBill) return;
      const amount = Number(payAmount);
      const result = processBillPayment({
        fetchedBill,
        amount,
        accountId: selectedAccountId,
      });
      setPaymentResult(result);
      setIsProcessing(false);
      setStep('success');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 3000);
  };

  const totalPayable = fetchedBill ? Number(payAmount) + (fetchedBill.convenienceFee || 0) : 0;
  const insufficient = selectedAccount.availableBalance < totalPayable;

  // Category selection
  if (step === 'category') {
    const cats = [...new Set(billProviders.map((p) => p.category))] as BillCategory[];
    return (
      <BillLayout title="Select Category" onBack={goBack}>
        <div className="grid grid-cols-2 gap-2">
          {cats.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setCategory(cat); setStep('biller-list'); }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 active:scale-[0.99]"
            >
              {getCategoryIcon(cat)}
              <span className="text-sm font-bold capitalize">{cat.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </BillLayout>
    );
  }

  // Biller list
  if (step === 'biller-list') {
    const list = billProviders.filter((p) => p.category === category);
    return (
      <BillLayout title={category?.replace('_', ' ') || 'Billers'} subtitle="Select your biller" onBack={goBack}>
        <div className="space-y-2">
          {list.map((p) => {
            const isSaved = billers.some((b) => b.providerId === p.id);
            return (
              <BillCard key={p.id} onClick={() => { setProviderId(p.id); setStep('biller-info'); }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/50 text-congress-blue-700 flex items-center justify-center">
                    {getBillIcon(p.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.serviceArea}</p>
                  </div>
                  {isSaved && <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </BillCard>
            );
          })}
        </div>
      </BillLayout>
    );
  }

  // Biller info
  if (step === 'biller-info' && provider) {
    return (
      <BillLayout title="Biller Details" onBack={goBack}>
        <BillCard className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-congress-blue-50 text-congress-blue-700 flex items-center justify-center">
              {getBillIcon(provider.iconName, 'w-6 h-6')}
            </div>
            <div>
              <p className="text-base font-bold">{provider.name}</p>
              <p className="text-xs text-slate-500 capitalize">{provider.category.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="text-sm space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex justify-between"><span className="text-slate-500">Service Area</span><span className="font-semibold">{provider.serviceArea}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Payment Method</span><span className="font-semibold">{provider.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Required</span><span className="font-semibold">{provider.identifierFields.map((f) => f.label).join(', ')}</span></div>
            {provider.processingInfo && <p className="text-xs text-slate-500">{provider.processingInfo}</p>}
          </div>
        </BillCard>
        <StickyBillCTA label="Continue" onClick={() => setStep('customer-details')} />
      </BillLayout>
    );
  }

  // Customer details
  if (step === 'customer-details' && provider) {
    return (
      <BillLayout title="Customer Details" subtitle={provider.name} onBack={goBack}>
        <div className="space-y-3 pb-24">
          {provider.identifierFields.map((field) => (
            <BillCard key={field.key}>
              <label className="text-xs font-semibold text-slate-500">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-900"
                >
                  <option value="">Select...</option>
                  {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.key] || (field.key === 'consumerNumber' && savedBiller ? savedBiller.consumerNumber : '')}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
                />
              )}
            </BillCard>
          ))}
        </div>
        <StickyBillCTA label="Fetch Bill" onClick={handleFetchBill} />
      </BillLayout>
    );
  }

  // Fetching
  if (step === 'fetching') {
    return (
      <BillLayout title="Fetching Bill" onBack={goBack}>
        <FetchingLoader stage={fetchStage} />
      </BillLayout>
    );
  }

  // Bill details
  if (step === 'bill-details' && fetchedBill) {
    if (fetchedBill.status === 'no_outstanding') {
      return (
        <BillLayout title="Bill Status" onBack={goBack}>
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold">No Outstanding Bill</h2>
            <p className="text-sm text-slate-500 mt-2">There is no amount due for this account.</p>
            <button type="button" onClick={onDone} className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm">Done</button>
          </div>
        </BillLayout>
      );
    }

    if (fetchedBill.status === 'paid') {
      return (
        <BillLayout title="Bill Status" onBack={goBack}>
          <BillCard className="text-center py-8">
            <BillStatusBadge status="paid" />
            <p className="text-lg font-bold mt-3">Bill Paid</p>
            <p className="text-sm text-slate-500 mt-1">Payment date: {fetchedBill.billDate}</p>
          </BillCard>
        </BillLayout>
      );
    }

    return (
      <BillLayout title="Bill Details" onBack={goBack}>
        <BillCard className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 uppercase">{fetchedBill.category.replace('_', ' ')} Bill</p>
              <p className="text-base font-bold mt-1">{fetchedBill.billerName}</p>
            </div>
            <BillStatusBadge status={fetchedBill.status} />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Customer</span><span className="font-semibold">{fetchedBill.customerName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-mono">{fetchedBill.maskedConsumerNumber}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Bill Number</span><span className="font-mono text-xs">{fetchedBill.billNumber}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Bill Date</span><span>{fetchedBill.billDate}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Due Date</span><span className="font-bold">{fetchedBill.dueDate}</span></div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500">Bill Amount</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">₹{fetchedBill.amount.toLocaleString('en-IN')}</p>
            <p className={`text-sm font-bold mt-1 ${fetchedBill.status === 'overdue' ? 'text-rose-600' : 'text-amber-600'}`}>
              ₹{fetchedBill.amount.toLocaleString('en-IN')} {fetchedBill.status === 'overdue' ? 'Overdue' : 'Due'}
            </p>
          </div>
          {fetchedBill.lateFeeNote && (
            <div className="flex gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {fetchedBill.lateFeeNote}
            </div>
          )}
        </BillCard>
        <StickyBillCTA label="Pay Bill" onClick={() => setStep(fetchedBill.allowsPartialPayment ? 'amount' : 'select-account')} />
      </BillLayout>
    );
  }

  // Amount
  if (step === 'amount' && fetchedBill) {
    return (
      <BillLayout title="Payment Amount" onBack={goBack}>
        <div className="space-y-3 pb-24">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setAmountType('full'); setPayAmount(fetchedBill.amount.toString()); }}
              className={`p-4 rounded-2xl border text-left ${amountType === 'full' ? 'border-congress-blue-600 bg-congress-blue-50/50' : 'border-slate-200'}`}
            >
              <p className="text-xs text-slate-500">Full Amount</p>
              <p className="text-lg font-bold">₹{fetchedBill.amount.toLocaleString('en-IN')}</p>
            </button>
            <button
              type="button"
              onClick={() => setAmountType('custom')}
              className={`p-4 rounded-2xl border text-left ${amountType === 'custom' ? 'border-congress-blue-600 bg-congress-blue-50/50' : 'border-slate-200'}`}
            >
              <p className="text-xs text-slate-500">Custom Amount</p>
              <p className="text-lg font-bold">Enter amount</p>
            </button>
          </div>
          {amountType === 'custom' && (
            <AmountInput value={payAmount} onChange={setPayAmount} />
          )}
        </div>
        <StickyBillCTA
          label="Continue"
          disabled={!payAmount || Number(payAmount) <= 0 || Number(payAmount) > fetchedBill.amount}
          onClick={() => setStep('select-account')}
        />
      </BillLayout>
    );
  }

  // Select account
  if (step === 'select-account') {
    return (
      <BillLayout title="Payment Account" subtitle="Debit from" onBack={goBack}>
        <div className="space-y-2 pb-24">
          {eligibleAccounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => setSelectedAccountId(acc.id)}
              className={`w-full p-4 rounded-2xl border text-left ${
                selectedAccountId === acc.id ? 'border-congress-blue-600 bg-congress-blue-50/50' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-bold">{acc.nickname || acc.accountType}</p>
                  <p className="text-xs text-slate-500 font-mono">{acc.maskedNumber}</p>
                </div>
                {acc.id === getDefaultDebitAccount().id && (
                  <span className="text-[10px] font-bold text-congress-blue-600">Primary</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">Available: ₹{acc.availableBalance.toLocaleString('en-IN')}</p>
              {acc.id === selectedAccountId && insufficient && (
                <p className="text-xs font-bold text-rose-600 mt-1">Insufficient balance</p>
              )}
            </button>
          ))}
        </div>
        <StickyBillCTA label="Continue" disabled={insufficient} onClick={() => setStep('review')} />
      </BillLayout>
    );
  }

  // Review
  if (step === 'review' && fetchedBill) {
    return (
      <>
        <BillLayout title="Review Payment" onBack={goBack}>
          <div className="space-y-3 pb-28">
            <BillCard>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Bill Details</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Biller</span><span className="font-semibold text-right max-w-[55%]">{fetchedBill.billerName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Customer</span><span>{fetchedBill.customerName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Consumer ID</span><span className="font-mono">{fetchedBill.maskedConsumerNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Due Date</span><span>{fetchedBill.dueDate}</span></div>
              </div>
            </BillCard>
            <BillCard>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Payment</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Bill amount</span><span>₹{Number(payAmount).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Convenience fee</span><span>₹{fetchedBill.convenienceFee}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                  <span>Total payable</span><span>₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </BillCard>
            <BillCard>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Debit Account</p>
              <p className="text-sm font-bold">{selectedAccount.accountType} {selectedAccount.maskedNumber}</p>
            </BillCard>
            <label className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 rounded" />
              <span>I confirm that I have reviewed the payment details.</span>
            </label>
          </div>
          <StickyBillCTA label="Confirm & Pay" disabled={!confirmed || isProcessing} onClick={() => setShowAuth(true)} />
        </BillLayout>
        <SecureAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} title="Authenticate Payment" />
      </>
    );
  }

  // Processing
  if (step === 'processing') {
    const stages = [
      { label: 'Payment Initiated', status: processStage >= 0 ? 'done' as const : 'pending' as const },
      { label: 'Bank Authentication', status: processStage >= 1 ? 'done' as const : processStage === 0 ? 'active' as const : 'pending' as const },
      { label: 'Biller Confirmation', status: processStage >= 2 ? 'done' as const : processStage === 1 ? 'active' as const : 'pending' as const },
      { label: 'Payment Complete', status: processStage >= 3 ? 'done' as const : processStage === 2 ? 'active' as const : 'pending' as const },
    ];
    return (
      <BillLayout title="Processing" onBack={() => {}}>
        <BillCard>
          <ProcessingTimeline steps={stages} />
          <p className="text-center text-sm text-slate-500">Please do not close or refresh.</p>
        </BillCard>
      </BillLayout>
    );
  }

  // Success
  if (step === 'success' && paymentResult) {
    const isNewBiller = !billers.some((b) => b.providerId === fetchedBill?.providerId);
    return (
      <div className="pb-24 max-w-lg mx-auto">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8 px-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Bill Paid Successfully</h2>
          <p className="text-3xl font-black text-congress-blue-700 mt-2">₹{paymentResult.totalPaid.toLocaleString('en-IN')}</p>
          <p className="text-sm text-slate-500 mt-1">{paymentResult.billerName}</p>
        </motion.div>
        <BillCard className="mx-0 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Payment Date</span><span>{paymentResult.paymentDate}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Debit Account</span><span>{paymentResult.debitAccountType} {paymentResult.debitAccountMasked}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Transaction ID</span><span className="font-mono text-xs">{paymentResult.txnId}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Reference</span><span className="font-mono text-xs">{paymentResult.referenceNumber}</span></div>
        </BillCard>
        {isNewBiller && (
          <BillCard className="mt-3 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={saveBiller} onChange={(e) => setSaveBiller(e.target.checked)} />
              Save Biller
            </label>
            {saveBiller && (
              <input
                value={billerNickname}
                onChange={(e) => setBillerNickname(e.target.value)}
                placeholder="Nickname e.g. Home Electricity"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            )}
          </BillCard>
        )}
        <div className="grid grid-cols-3 gap-2 mt-4 px-0">
          <button type="button" onClick={() => onViewReceipt(paymentResult.id)} className="py-3 rounded-xl border border-slate-200 text-xs font-bold flex flex-col items-center gap-1">
            <Download className="w-4 h-4" /> Receipt
          </button>
          <button type="button" onClick={() => addToast({ type: 'info', title: 'Shared', message: 'Receipt shared.' })} className="py-3 rounded-xl border border-slate-200 text-xs font-bold flex flex-col items-center gap-1">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button type="button" onClick={() => {
            if (saveBiller && fetchedBill) {
              const prov = billProviders.find((p) => p.id === fetchedBill.providerId);
              addSavedBiller({
                name: fetchedBill.billerName,
                nickname: billerNickname || fetchedBill.billerName,
                category: fetchedBill.category,
                consumerNumber: fetchedBill.consumerNumber,
                customerName: fetchedBill.customerName,
                serviceArea: prov?.serviceArea,
                providerId: fetchedBill.providerId,
                lastPaymentDate: paymentResult.paymentDate,
                billStatus: 'paid',
                isAutoPay: false,
                iconName: prov?.iconName || 'Zap',
              });
            }
            onDone();
          }} className="py-3 rounded-xl bg-congress-blue-700 text-white text-xs font-bold">Done</button>
        </div>
      </div>
    );
  }

  // Failed (demo fallback - rarely shown)
  if (step === 'failed') {
    return (
      <BillLayout title="Payment Failed" onBack={onDone}>
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold">Payment Could Not Be Completed</h2>
          <button type="button" onClick={() => setStep('review')} className="mt-4 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm">Try Again</button>
          <button type="button" onClick={onDone} className="mt-2 text-sm font-bold text-slate-500">Back to Bill Payments</button>
        </div>
      </BillLayout>
    );
  }

  return null;
};
