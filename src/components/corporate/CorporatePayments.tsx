import React, { useState, useEffect } from 'react';
import { 
  SendHorizontal, 
  Landmark, 
  Building2, 
  Globe2, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  FileText, 
  AlertCircle, 
  Clock, 
  Download, 
  Copy,
  ChevronDown
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Beneficiary, Transaction } from '../../types/banking';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const CorporatePayments: React.FC = () => {
  const { 
    accounts, 
    beneficiaries, 
    addBeneficiary, 
    executeTransfer, 
    addToast,
    setBottomNavHidden 
  } = useBanking();

  // Mode: 'vendor' | 'tax' | 'internal' | 'forex'
  const [paymentType, setPaymentType] = useState<'vendor' | 'tax' | 'internal' | 'forex'>('vendor');
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');

  // Form State
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [selectedBen, setSelectedBen] = useState<Beneficiary | null>(beneficiaries[0] || null);
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'RTGS' | 'NEFT' | 'IMPS'>('RTGS');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-0819');
  const [remarks, setRemarks] = useState('');
  const [taxChallanType, setTaxChallanType] = useState('GST (GSTR-3B)');
  const [cpinNumber, setCpinNumber] = useState('26081920019284');
  const [forexCurrency, setForexCurrency] = useState('USD');
  const [forexPurpose, setForexPurpose] = useState('Software Import License (P0802)');

  // Add Payee Modal
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [newBenName, setNewBenName] = useState('');
  const [newBenAcc, setNewBenAcc] = useState('');
  const [newBenIfsc, setNewBenIfsc] = useState('');
  const [newBenBank, setNewBenBank] = useState('');
  const [newBenLimit, setNewBenLimit] = useState('5000000');

  // Success Receipt
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  // Bottom Navigation visibility: ONLY visible on Payments Root ('form'), HIDDEN during Review, Success receipt & Add Payee
  useEffect(() => {
    if (step !== 'form' || showAddBenModal) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [step, showAddBenModal, setBottomNavHidden]);

  const selectedFromAccount = accounts.find(a => a.id === fromAccountId) || accounts[0];

  const handleAddNewBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName || !newBenAcc || !newBenIfsc) {
      addToast({ type: 'warning', title: 'Missing Info', message: 'Please fill in all beneficiary details.' });
      return;
    }

    const created = addBeneficiary({
      name: newBenName,
      accountNumber: newBenAcc,
      bankName: newBenBank || 'HDFC Bank',
      ifsc: newBenIfsc.toUpperCase(),
      type: 'corporate_vendor',
      transferLimit: Number(newBenLimit) || 5000000,
    });

    setSelectedBen(created);
    setShowAddBenModal(false);
    setNewBenName('');
    setNewBenAcc('');
    setNewBenIfsc('');
    setNewBenBank('');
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      addToast({ type: 'warning', title: 'Invalid Amount', message: 'Please enter a valid transfer amount.' });
      return;
    }

    if (numericAmount > (selectedFromAccount?.availableBalance || 0)) {
      addToast({ type: 'error', title: 'Insufficient Funds', message: 'Amount exceeds available balance in chosen corporate account.' });
      return;
    }

    setStep('review');
  };

  const handleConfirmExecute = () => {
    const numericAmount = Number(amount);
    let payeeName = selectedBen?.name || 'Corporate Beneficiary';
    let payeeAcc = selectedBen?.accountNumber || '0000000000';
    let payeeBank = selectedBen?.bankName || 'Verified Bank';

    if (paymentType === 'tax') {
      payeeName = `Tax Settlement: ${taxChallanType} (CPIN: ${cpinNumber})`;
      payeeAcc = cpinNumber;
      payeeBank = 'Reserve Bank of India (e-Treasury)';
    } else if (paymentType === 'forex') {
      payeeName = `${selectedBen?.name || 'Global Vendor'} (${forexCurrency} Wire Remittance)`;
    }

    const txn = executeTransfer({
      fromAccountId: selectedFromAccount.id,
      beneficiaryName: payeeName,
      beneficiaryAccount: payeeAcc,
      bankName: payeeBank,
      amount: numericAmount,
      mode: paymentMode as any,
      remarks: remarks || `Invoice: ${invoiceNumber}`
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    setCompletedTxn(txn);
    setStep('success');
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-xl border border-teal-800/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Outward Remittance
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Corporate Payments</h2>
            <p className="text-xs text-slate-300">
              High-value RTGS, statutory tax challans & foreign wires
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <SendHorizontal className="w-6 h-6" />
          </div>
        </div>
      </div>

      {step === 'form' && (
        <div className="space-y-4">
          {/* Payment Category Selector */}
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => setPaymentType('vendor')}
              className={`py-2 px-1 rounded-xl transition-all text-center ${
                paymentType === 'vendor'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Vendor Wire
            </button>
            <button
              onClick={() => setPaymentType('tax')}
              className={`py-2 px-1 rounded-xl transition-all text-center ${
                paymentType === 'tax'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Tax & GST
            </button>
            <button
              onClick={() => setPaymentType('internal')}
              className={`py-2 px-1 rounded-xl transition-all text-center ${
                paymentType === 'internal'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Treasury
            </button>
            <button
              onClick={() => setPaymentType('forex')}
              className={`py-2 px-1 rounded-xl transition-all text-center ${
                paymentType === 'forex'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              EEFC Forex
            </button>
          </div>

          <form onSubmit={handleProceedToReview} className="space-y-4">
            {/* Source Account Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Debit Account
              </label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-teal-600 font-mono"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountType} (•• {acc.accountNumber.slice(-4)}) — Bal: ₹{(acc.balance / 100000).toFixed(2)}L
                  </option>
                ))}
              </select>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Available Liquidity:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ₹{selectedFromAccount.availableBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Vendor / Payee Section */}
            {paymentType !== 'tax' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Select Beneficiary
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddBenModal(true)}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Payee
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {beneficiaries.map(ben => (
                    <div
                      key={ben.id}
                      onClick={() => setSelectedBen(ben)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        selectedBen?.id === ben.id
                          ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 ring-1 ring-teal-600'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{ben.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {ben.bankName} • {ben.maskedAccount}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase">
                        Limit: ₹{(ben.transferLimit / 100000).toFixed(0)}L
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tax Challan CPIN details */}
            {paymentType === 'tax' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tax Challan Metadata</h4>
                
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Tax Head</label>
                  <select
                    value={taxChallanType}
                    onChange={(e) => setTaxChallanType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <option>GST (GSTR-3B) Liability</option>
                    <option>Corporate Advance Tax (ITNS 280)</option>
                    <option>TDS / TCS Remittance (ITNS 281)</option>
                    <option>Customs Duty / ICEGATE e-Payment</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">CPIN / Challan Reference #</label>
                  <input
                    type="text"
                    value={cpinNumber}
                    onChange={(e) => setCpinNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Amount & Mode */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Transfer Amount
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-3 text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-mono font-extrabold text-slate-900 dark:text-white focus:outline-teal-600"
                />
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-1.5 font-medium">Settlement Rail</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['RTGS', 'NEFT', 'IMPS'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        paymentMode === mode
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 ring-1 ring-teal-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invoicing Ref */}
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Invoice / PO Reference</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. PO-99124 / Q3 Hosting"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Review Corporate Outflow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4"
        >
          <div className="text-center space-y-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              Audit Confirmation
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verify Payment Details</h3>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 text-center">
            <p className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase">Amount to Transfer</p>
            <p className="text-2xl font-black text-teal-950 dark:text-teal-100 font-mono mt-1">
              ₹{Number(amount).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Rail: {paymentMode} • Immediate Settlement
            </p>
          </div>

          <div className="space-y-2.5 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="py-1 flex justify-between">
              <span className="text-slate-500">From Account:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedFromAccount.nickname} ({selectedFromAccount.maskedNumber})</span>
            </div>
            <div className="py-1 flex justify-between">
              <span className="text-slate-500">Beneficiary:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {paymentType === 'tax' ? taxChallanType : selectedBen?.name}
              </span>
            </div>
            <div className="py-1 flex justify-between">
              <span className="text-slate-500">Account / IFSC:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {selectedBen?.maskedAccount} ({selectedBen?.ifsc})
              </span>
            </div>
            <div className="py-1 flex justify-between">
              <span className="text-slate-500">Invoice Ref:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{invoiceNumber}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => setStep('form')}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={handleConfirmExecute}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authorize & Execute Transfer</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Success Receipt */}
      {step === 'success' && completedTxn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Executed</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              RTGS funds settlement dispatched to counterparty
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Sent:</span>
              <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                ₹{completedTxn.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">UTR / Ref Number:</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                {completedTxn.referenceNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{completedTxn.counterpartyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="text-slate-700 dark:text-slate-300">{completedTxn.date}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                setStep('form');
                setAmount('');
              }}
              className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
            >
              Initiate Another Payment
            </button>
            <button
              onClick={() => addToast({ type: 'success', title: 'Receipt Downloaded', message: 'Corporate payment voucher PDF saved.' })}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              title="Download Voucher"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Add Beneficiary Modal */}
      {showAddBenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Vendor Beneficiary</h3>
              <button onClick={() => setShowAddBenModal(false)} className="text-slate-400 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleAddNewBeneficiary} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1 font-semibold uppercase">Vendor Entity Name</label>
                <input
                  type="text"
                  required
                  value={newBenName}
                  onChange={(e) => setNewBenName(e.target.value)}
                  placeholder="e.g. Cisco Systems India Pvt Ltd"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1 font-semibold uppercase">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={newBenAcc}
                  onChange={(e) => setNewBenAcc(e.target.value)}
                  placeholder="e.g. 50200019283711"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 font-semibold uppercase">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={newBenIfsc}
                    onChange={(e) => setNewBenIfsc(e.target.value)}
                    placeholder="e.g. HDFC0000060"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 font-semibold uppercase">Bank Name</label>
                  <input
                    type="text"
                    value={newBenBank}
                    onChange={(e) => setNewBenBank(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Save & Validate Payee
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBenModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
