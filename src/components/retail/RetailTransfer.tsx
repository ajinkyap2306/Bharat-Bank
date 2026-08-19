import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  SendHorizontal, 
  UserPlus, 
  Building2, 
  Smartphone, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  QrCode, 
  Clock, 
  Share2, 
  Download, 
  Search,
  ChevronLeft
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Beneficiary, BankAccount, Transaction } from '../../types/banking';
import { NumericPinInput } from '../common/NumericPinInput';
import { MOBILE_PAY_CONTACTS } from '../../data/level3Mock';

export const RetailTransfer: React.FC = () => {
  const { 
    accounts, 
    beneficiaries, 
    addBeneficiary, 
    executeTransfer, 
    addToast,
    setBottomNavHidden,
    getDefaultDebitAccount,
    defaultDebitAccountId,
    lookupBanlName,
    transferRepeat,
    clearTransferRepeat,
  } = useBanking();

  const defaultDebit = getDefaultDebitAccount();

  // Wizard state: 'select_payee' | 'enter_amount' | 'mpin' | 'success' | 'add_beneficiary'
  const [step, setStep] = useState<'select_payee' | 'enter_amount' | 'mpin' | 'success' | 'add_beneficiary'>('select_payee');
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT' | 'RTGS' | 'UPI' | 'Internal'>('IMPS');
  const [selectedDebitAccount, setSelectedDebitAccount] = useState<BankAccount>(defaultDebit);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  // Sync default debit account from profile preferences
  useEffect(() => {
    setSelectedDebitAccount(getDefaultDebitAccount());
  }, [defaultDebitAccountId]);

  // Bottom Navigation visibility: ONLY visible on Payments Home ('select_payee'), HIDDEN during active transfer flow & add beneficiary
  useEffect(() => {
    if (step === 'select_payee') {
      setBottomNavHidden(false);
    } else {
      setBottomNavHidden(true);
    }
    return () => setBottomNavHidden(false);
  }, [step, setBottomNavHidden]);

  // New beneficiary form state
  const [newBenName, setNewBenName] = useState('');
  const [newBenAccount, setNewBenAccount] = useState('');
  const [newBenConfirmAccount, setNewBenConfirmAccount] = useState('');
  const [newBenIfsc, setNewBenIfsc] = useState('HDFC0000120');
  const [newBenBank, setNewBenBank] = useState('HDFC Bank');
  const [newBenType, setNewBenType] = useState<'retail_internal' | 'retail_other' | 'upi'>('retail_other');

  const [searchBeneficiary, setSearchBeneficiary] = useState('');
  const [banlResult, setBanlResult] = useState<ReturnType<typeof lookupBanlName> | null>(null);
  const [banlLoading, setBanlLoading] = useState(false);

  useEffect(() => {
    if (!transferRepeat) return;
    const match = beneficiaries.find(
      (b) =>
        b.name === transferRepeat.beneficiaryName ||
        b.accountNumber === transferRepeat.beneficiaryAccount
    );
    if (match) {
      setSelectedBeneficiary(match);
      setTransferMode(
        transferRepeat.mode === 'UPI'
          ? 'UPI'
          : transferRepeat.mode === 'Internal'
            ? 'Internal'
            : (transferRepeat.mode as 'IMPS' | 'NEFT' | 'RTGS')
      );
    }
    setAmount(String(transferRepeat.amount));
    setRemarks(transferRepeat.remarks || '');
    setStep('enter_amount');
    clearTransferRepeat();
  }, [transferRepeat, beneficiaries, clearTransferRepeat]);

  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchBeneficiary.toLowerCase()) ||
    b.accountNumber.toLowerCase().includes(searchBeneficiary.toLowerCase())
  );

  const handleSelectBeneficiary = (ben: Beneficiary) => {
    setSelectedBeneficiary(ben);
    if (ben.type === 'upi') {
      setTransferMode('UPI');
    } else if (ben.type === 'retail_internal') {
      setTransferMode('Internal');
    } else {
      setTransferMode('IMPS');
    }
    setStep('enter_amount');
  };

  const handleMobileContactPay = (contactId: string) => {
    const contact = MOBILE_PAY_CONTACTS.find((c) => c.id === contactId);
    if (!contact) return;

    const existing = beneficiaries.find(
      (b) => b.accountNumber === contact.accountNumber || b.phone === contact.mobile
    );
    if (existing) {
      handleSelectBeneficiary(existing);
      return;
    }

    const tempBen: Beneficiary = {
      id: `contact_${contact.id}`,
      name: contact.name,
      accountNumber: contact.accountNumber,
      maskedAccount: `•••• ${contact.accountNumber.slice(-4)}`,
      bankName: contact.bankName,
      ifsc: contact.ifsc,
      type: contact.bankName.toLowerCase().includes('bharat') ? 'retail_internal' : 'retail_other',
      transferLimit: 200000,
      status: 'active',
      phone: contact.mobile,
    };
    setSelectedBeneficiary(tempBen);
    setTransferMode(contact.upiId ? 'UPI' : tempBen.type === 'retail_internal' ? 'Internal' : 'IMPS');
    addToast({
      type: 'info',
      title: 'Contact Selected',
      message: `Paying ${contact.name} (${contact.mobile})`,
    });
    setStep('enter_amount');
  };

  const filteredMobileContacts = MOBILE_PAY_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchBeneficiary.toLowerCase()) ||
      c.mobile.includes(searchBeneficiary)
  );

  const handleProceedToMpin = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid transfer amount.',
      });
      return;
    }
    if (numAmount > selectedDebitAccount.availableBalance) {
      addToast({
        type: 'error',
        title: 'Insufficient Balance',
        message: `Available balance is ₹${selectedDebitAccount.availableBalance.toLocaleString('en-IN')}`,
      });
      return;
    }
    setPin('');
    setStep('mpin');
  };

  const submitTransfer = useCallback(() => {
    if (isProcessing || !selectedDebitAccount) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      try {
        const txn = executeTransfer({
          fromAccountId: selectedDebitAccount.id,
          beneficiaryName: selectedBeneficiary?.name || 'Payee',
          beneficiaryAccount: selectedBeneficiary?.accountNumber || 'Acc',
          bankName: selectedBeneficiary?.bankName || 'Bank',
          amount: Number(amount),
          mode: transferMode,
          remarks: remarks || 'Fund Transfer via Bharat Corporate Banking',
        });
        setCompletedTxn(txn);
        setStep('success');

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        setPin('');
        setStep('enter_amount');
      }
    }, 1000);
  }, [
    isProcessing,
    selectedDebitAccount,
    selectedBeneficiary,
    amount,
    transferMode,
    remarks,
    executeTransfer,
  ]);

  useEffect(() => {
    if (step === 'mpin' && pin.length === 4 && !isProcessing) {
      submitTransfer();
    }
  }, [step, pin, isProcessing, submitTransfer]);

  const handleBanlLookup = () => {
    if (newBenType === 'upi' || newBenAccount.length < 8 || newBenIfsc.length < 11) {
      addToast({ type: 'error', title: 'BANL', message: 'Enter valid account number and IFSC.' });
      return;
    }
    setBanlLoading(true);
    setTimeout(() => {
      const result = lookupBanlName(newBenAccount, newBenIfsc);
      setBanlResult(result);
      if (result.matchStatus === 'matched' || result.matchStatus === 'partial') {
        setNewBenName(result.accountHolderName);
        setNewBenBank(result.bankName);
        addToast({
          type: 'success',
          title: 'BANL Verified',
          message: `Account name: ${result.accountHolderName}`,
        });
      } else {
        addToast({ type: 'error', title: 'BANL Failed', message: 'Could not verify beneficiary name.' });
      }
      setBanlLoading(false);
    }, 900);
  };

  const handleCreateBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName || !newBenAccount) {
      addToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please fill in beneficiary details.',
      });
      return;
    }
    if (newBenType !== 'upi' && newBenAccount !== newBenConfirmAccount) {
      addToast({
        type: 'error',
        title: 'Account Mismatch',
        message: 'Account numbers do not match.',
      });
      return;
    }

    const created = addBeneficiary({
      name: newBenName,
      accountNumber: newBenAccount,
      bankName: newBenType === 'upi' ? 'UPI Virtual Account' : newBenBank,
      ifsc: newBenType === 'upi' ? 'UPI' : newBenIfsc,
      type: newBenType,
      transferLimit: 500000,
    });

    setSelectedBeneficiary(created);
    setStep('enter_amount');
  };

  const handleReset = () => {
    setStep('select_payee');
    setSelectedBeneficiary(null);
    setAmount('');
    setRemarks('');
    setPin('');
    setCompletedTxn(null);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* 1. SELECT BENEFICIARY & MODE */}
      {step === 'select_payee' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Transfer Money</h3>
              <p className="text-xs text-slate-500">Select payee or add a new beneficiary</p>
            </div>
            <button
              onClick={() => setStep('add_beneficiary')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Payee
            </button>
          </div>

          {/* Quick Payee Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchBeneficiary}
              onChange={(e) => setSearchBeneficiary(e.target.value)}
              placeholder="Search saved beneficiaries or UPI IDs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          {/* Beneficiaries List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Saved Beneficiaries ({filteredBeneficiaries.length})
            </h4>

            <div className="space-y-2">
              {filteredBeneficiaries.map((ben) => (
                <div
                  key={ben.id}
                  onClick={() => handleSelectBeneficiary(ben)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 cursor-pointer shadow-xs active:scale-98 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                      {ben.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {ben.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {ben.bankName} • {ben.maskedAccount}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          {/* Pay via Mobile Contact */}
          {filteredMobileContacts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Pay via Contact
              </h4>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {filteredMobileContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => handleMobileContactPay(contact.id)}
                    className="shrink-0 w-28 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left active:scale-95 transition-transform"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">
                      {contact.name.charAt(0)}
                    </div>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{contact.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{contact.mobile}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 2. ADD BENEFICIARY WIZARD */}
      {step === 'add_beneficiary' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setStep('select_payee')}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Beneficiary</h3>
          </div>

          <form onSubmit={handleCreateBeneficiary} className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            {/* Payee Type Selector */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setNewBenType('retail_other')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  newBenType === 'retail_other'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Other Bank
              </button>
              <button
                type="button"
                onClick={() => setNewBenType('retail_internal')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  newBenType === 'retail_internal'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Bharat Bank
              </button>
              <button
                type="button"
                onClick={() => setNewBenType('upi')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  newBenType === 'upi'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                UPI ID
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Beneficiary Full Name
              </label>
              <input
                type="text"
                value={newBenName}
                onChange={(e) => setNewBenName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {newBenType === 'upi' ? 'UPI ID / VPA' : 'Bank Account Number'}
              </label>
              <input
                type="text"
                value={newBenAccount}
                onChange={(e) => setNewBenAccount(e.target.value)}
                placeholder={newBenType === 'upi' ? 'name@okhdfcbank' : '501009182901'}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>

            {newBenType !== 'upi' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Re-enter Account Number
                  </label>
                  <input
                    type="password"
                    value={newBenConfirmAccount}
                    onChange={(e) => setNewBenConfirmAccount(e.target.value)}
                    placeholder="Confirm account number"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={newBenIfsc}
                    onChange={(e) => {
                      setNewBenIfsc(e.target.value.toUpperCase());
                      setBanlResult(null);
                    }}
                    placeholder="HDFC0000120"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 font-mono"
                    required
                  />
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <button
                      type="button"
                      onClick={handleBanlLookup}
                      disabled={banlLoading}
                      className="text-[10px] font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded-lg"
                    >
                      {banlLoading ? 'Verifying…' : 'BANL Name Lookup'}
                    </button>
                    {banlResult && banlResult.matchStatus !== 'not_found' && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {banlResult.accountHolderName}
                      </p>
                    )}
                  </div>
                  {!banlResult && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Demo: 501009182901 + HDFC0000120 → Priya Sharma
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              Verify & Save Beneficiary
            </button>
          </form>
        </motion.div>
      )}

      {/* 3. ENTER AMOUNT */}
      {step === 'enter_amount' && selectedBeneficiary && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep('select_payee')}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Enter Transfer Details</h3>
          </div>

          {/* Payee Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                {selectedBeneficiary.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{selectedBeneficiary.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{selectedBeneficiary.bankName} • {selectedBeneficiary.maskedAccount}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          {/* From Account Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-500">Pay From Account</label>
            <select
              value={selectedDebitAccount.id}
              onChange={(e) => {
                const acc = accounts.find(a => a.id === e.target.value);
                if (acc) setSelectedDebitAccount(acc);
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white outline-none"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType} ({acc.maskedNumber}) - Balance: ₹{acc.availableBalance.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-500">Transfer Amount</label>
            <div className="flex items-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white mr-2">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-3xl font-extrabold bg-transparent outline-none text-slate-900 dark:text-white"
                autoFocus
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 pt-2 overflow-x-auto no-scrollbar">
              {[1000, 5000, 10000, 25000, 50000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shrink-0"
                >
                  +₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-500 block mb-1">Remarks (Optional)</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Monthly rent, Gift, Dinner"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>

          <button
            onClick={handleProceedToMpin}
            disabled={!amount || Number(amount) <= 0}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all"
          >
            Authorize with MPIN
          </button>
        </motion.div>
      )}

      {/* 4. MPIN */}
      {step === 'mpin' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center">
          <div className="flex items-center gap-2 text-left">
            <button
              type="button"
              onClick={() => {
                setPin('');
                setStep('enter_amount');
              }}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Authorize Transfer</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enter 4-Digit MPIN</h3>
          <p className="text-xs text-slate-500">
            Authorizing transfer of ₹{Number(amount).toLocaleString('en-IN')} to {selectedBeneficiary?.name}
          </p>

          <div className="my-6 px-4">
            <NumericPinInput
              value={pin}
              onChange={setPin}
              length={4}
              masked
              autoFocus
              autoComplete="off"
              ariaLabel="4-digit MPIN"
              gapClassName="gap-3"
              digitClassName="h-14 text-2xl"
            />
          </div>

          {isProcessing && (
            <p className="text-xs text-slate-500">Authorizing payment…</p>
          )}

          <p className="text-[11px] text-slate-400">Demo PIN: 1234</p>
        </motion.div>
      )}

      {/* 6. SUCCESS RECEIPT */}
      {step === 'success' && completedTxn && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full mx-auto flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                Transaction Successful
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                ₹{completedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Paid to {completedTxn.counterpartyName}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-left space-y-2 text-xs font-mono text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Bank Reference / UTR:</span>
                <span className="font-bold text-slate-900 dark:text-white">{completedTxn.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Timestamp:</span>
                <span>{completedTxn.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span>{completedTxn.paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Balance:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{completedTxn.balanceAfter?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => addToast({ type: 'info', title: 'Receipt Shared', message: 'Transaction link copied.' })}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => addToast({ type: 'success', title: 'Receipt Saved', message: 'PDF receipt downloaded.' })}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-md text-xs"
            >
              Make Another Transfer
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
