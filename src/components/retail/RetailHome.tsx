import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Eye, 
  EyeOff, 
  SendHorizontal, 
  Receipt, 
  Scan, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Landmark, 
  Plus, 
  PlusCircle,
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight,
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Award, 
  Wallet,
  Globe,
  Smartphone,
  QrCode,
  Users,
  FileText,
  Percent,
  Layers,
  X,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Tag,
  Gift,
  Check,
  Building2
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount, Transaction } from '../../types/banking';

export const RetailHome: React.FC = () => {
  const { 
    user, 
    accounts, 
    transactions, 
    cards, 
    setRetailTab, 
    openScanner,
    addMoneyToAccount,
    addToast,
    setBottomNavHidden 
  } = useBanking();

  const [hiddenAccounts, setHiddenAccounts] = useState<Record<string, boolean>>({});
  const [hideCreditCardDue, setHideCreditCardDue] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const toggleAccountBalance = (accId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenAccounts(prev => ({
      ...prev,
      [accId]: !prev[accId]
    }));
  };

  // Feature Modals
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showForexModal, setShowForexModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showStatementsModal, setShowStatementsModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  // Add Money State
  const [addAmount, setAddAmount] = useState('5000');
  const [addSource, setAddSource] = useState('HDFC Bank UPI (hdfcbank@upi)');
  const [isAddingMoney, setIsAddingMoney] = useState(false);

  // Recharge State
  const [rechargeMobile, setRechargeMobile] = useState('9876543210');
  const [rechargeOperator, setRechargeOperator] = useState('Jio Prepaid');
  const [rechargePlan, setRechargePlan] = useState('₹299 - 2GB/day (28 Days)');
  const [isRecharging, setIsRecharging] = useState(false);

  // Rewards State
  const [rewardPoints, setRewardPoints] = useState(14850);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Copied state
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Check if any modal is active to hide Bottom Navigation
  const hasActiveModal = !!(
    selectedTxn || 
    showAddMoneyModal || 
    showInsuranceModal || 
    showForexModal || 
    showRechargeModal || 
    showUpiModal || 
    showStatementsModal || 
    showOffersModal || 
    showRewardsModal
  );

  useEffect(() => {
    setBottomNavHidden(hasActiveModal);
    return () => setBottomNavHidden(false);
  }, [hasActiveModal, setBottomNavHidden]);

  const totalRelationshipBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const primaryAccount = accounts[0] || { id: 'acc_01', balance: 0, accountType: 'Savings' };
  const creditCard = cards.find(c => c.cardType === 'credit');

  const handleAddMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(addAmount);
    if (isNaN(num) || num <= 0) {
      addToast({ type: 'error', title: 'Invalid Amount', message: 'Please enter a valid amount to add.' });
      return;
    }

    setIsAddingMoney(true);
    setTimeout(() => {
      addMoneyToAccount(primaryAccount.id, num, addSource);
      confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } });
      setIsAddingMoney(false);
      setShowAddMoneyModal(false);
    }, 900);
  };

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rechargeMobile || rechargeMobile.length < 10) {
      addToast({ type: 'error', title: 'Invalid Number', message: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsRecharging(true);
    setTimeout(() => {
      const planCost = parseInt(rechargePlan.replace(/[^0-9]/g, '')) || 299;
      addToast({
        type: 'success',
        title: 'Recharge Successful',
        message: `Plan ${rechargePlan} activated on ${rechargeMobile} via ${rechargeOperator}.`,
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setIsRecharging(false);
      setShowRechargeModal(false);
    }, 1000);
  };

  const handleRedeemRewards = () => {
    setIsRedeeming(true);
    setTimeout(() => {
      const cashEquivalent = Math.round(rewardPoints * 0.25);
      addMoneyToAccount(primaryAccount.id, cashEquivalent, 'Bharat Reward Points Redemption');
      setRewardPoints(0);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      setIsRedeeming(false);
      setShowRewardsModal(false);
      addToast({
        type: 'success',
        title: 'Rewards Redeemed for Cash',
        message: `₹${cashEquivalent.toLocaleString('en-IN')} cashback credited to your Savings account!`,
      });
    }, 1000);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText?.(user?.upiId || 'devansh@apexbank');
    setCopiedUpi(true);
    addToast({ type: 'info', title: 'UPI ID Copied', message: `${user?.upiId || 'devansh@apexbank'} copied to clipboard.` });
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 1. Account Cards Carousel */}
      <div className="pt-1">
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Your Accounts
          </h3>
          <button
            onClick={() => setRetailTab('accounts')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            All Accounts <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Account Cards Horizontal Snap */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 snap-x">
          {accounts.map((acc, idx) => {
            const isPrimary = idx === 0;
            const isHidden = !!hiddenAccounts[acc.id];
            return (
              <motion.div
                key={acc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRetailTab('accounts')}
                className={`min-w-[280px] sm:min-w-[300px] p-4.5 rounded-3xl cursor-pointer snap-center shadow-lg transition-all ${
                  isPrimary
                    ? 'bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isPrimary ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    }`}>
                      <Wallet className="w-4 h-4" />
                    </span>
                    <div>
                      <p className={`text-xs font-bold ${isPrimary ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {acc.accountType} Account
                      </p>
                      <p className={`text-[10px] font-mono ${isPrimary ? 'text-blue-100' : 'text-slate-400'}`}>
                        {acc.maskedNumber}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPrimary ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {acc.status === 'active' ? 'Active' : acc.status}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <p className={`text-[10px] font-medium ${isPrimary ? 'text-blue-100' : 'text-slate-400'}`}>
                      Available Balance
                    </p>
                    <button
                      type="button"
                      onClick={(e) => toggleAccountBalance(acc.id, e)}
                      className={`p-1 rounded-lg transition-colors flex items-center justify-center ${
                        isPrimary
                          ? 'text-blue-100 hover:text-white hover:bg-white/20'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      aria-label={isHidden ? 'Show balance' : 'Hide balance'}
                      title={isHidden ? 'Show balance' : 'Hide balance'}
                    >
                      {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xl font-extrabold tracking-tight mt-0.5">
                    {isHidden ? '••••••••' : `₹${acc.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  </p>
                </div>

                <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${
                  isPrimary ? 'border-white/20 text-blue-100' : 'border-slate-100 dark:border-slate-800 text-slate-500'
                }`}>
                  <span>IFSC: {acc.ifsc}</span>
                  <span className="font-semibold">{acc.interestRate ? `${acc.interestRate}% p.a.` : 'Flexi'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Quick Actions — Single Card containing all 4 Actions in a Single Horizontal Line (1x4) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Quick Actions
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full">
              Instant (24/7)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {/* Send Money */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('transfers')}
            className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform mb-2">
              <SendHorizontal className="w-6 h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
              Send Money
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block whitespace-nowrap mt-0.5">
              Account / UPI
            </span>
          </motion.button>

          {/* Pay Bills */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('bills')}
            className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform mb-2">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap">
              Pay Bills
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block whitespace-nowrap mt-0.5">
              Electricity & DTH
            </span>
          </motion.button>

          {/* Scan & Pay */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={openScanner}
            className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform mb-2">
              <Scan className="w-6 h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              Scan & Pay
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block whitespace-nowrap mt-0.5">
              Any QR Code
            </span>
          </motion.button>

          {/* Add Money */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowAddMoneyModal(true)}
            className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center group cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform mb-2">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors whitespace-nowrap">
              Add Money
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block whitespace-nowrap mt-0.5">
              Top-up Balance
            </span>
          </motion.button>
        </div>
      </div>

      {/* 3. Single 4×4 Services Card (16 Banking Module Tiles) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Banking Services
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full">
              16 Modules
            </span>
          </div>
          <button
            onClick={() => setRetailTab('services')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            All Services <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4×4 Services Grid */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center pt-1">
          {/* Row 1 — Core Banking */}
          {/* 1. Accounts */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('accounts')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Accounts</span>
          </motion.button>

          {/* 2. Cards */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('cards')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Cards</span>
          </motion.button>

          {/* 3. Transfers */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('transfers')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Transfers</span>
          </motion.button>

          {/* 4. Deposits */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('deposits')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-2xs">
              <PiggyBank className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Deposits</span>
          </motion.button>

          {/* Row 2 — Financial */}
          {/* 5. Loans */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('loans')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Loans</span>
          </motion.button>

          {/* 6. Investments */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('investments')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Investments</span>
          </motion.button>

          {/* 7. Insurance */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowInsuranceModal(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Insurance</span>
          </motion.button>

          {/* 8. Forex */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowForexModal(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Forex</span>
          </motion.button>

          {/* Row 3 — Payments */}
          {/* 9. Bill Payments */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('bills')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xs">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Bill Payments</span>
          </motion.button>

          {/* 10. Mobile Recharge */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowRechargeModal(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-2xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Recharge</span>
          </motion.button>

          {/* 11. UPI / QR */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowUpiModal(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-2xs">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">UPI / QR</span>
          </motion.button>

          {/* 12. Beneficiaries */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('beneficiaries')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-lime-50 dark:bg-lime-950/60 text-lime-700 dark:text-lime-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-lime-600 group-hover:text-white transition-all shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Beneficiaries</span>
          </motion.button>

          {/* Row 4 — Utility */}
          {/* 13. Statements */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('statements')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-blue-700 group-hover:text-white transition-all shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Statements</span>
          </motion.button>

          {/* 14. Offers */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowOffersModal(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-2xs">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Offers</span>
          </motion.button>

          {/* 15. Rewards */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowRewardsModal(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">Rewards</span>
          </motion.button>

          {/* 16. More */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setRetailTab('services')}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-slate-700 group-hover:text-white transition-all shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">More</span>
          </motion.button>
        </div>
      </div>

      {/* Credit Card Snapshot Banner */}
      {creditCard && (
        <div className="p-4.5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
                <CreditCard className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-bold">{creditCard.tier} {creditCard.network}</p>
                <p className="text-[10px] text-slate-400 font-mono">{creditCard.maskedNumber}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
              Due in 11 days
            </span>
          </div>

          <div className="flex items-end justify-between mt-3">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] text-slate-400 font-medium">Total Outstanding Due</p>
                <button
                  type="button"
                  onClick={() => setHideCreditCardDue(!hideCreditCardDue)}
                  className="text-slate-400 hover:text-slate-200 p-0.5 transition-colors rounded"
                  aria-label={hideCreditCardDue ? 'Show outstanding due' : 'Hide outstanding due'}
                  title={hideCreditCardDue ? 'Show outstanding due' : 'Hide outstanding due'}
                >
                  {hideCreditCardDue ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-lg font-extrabold text-white">
                {hideCreditCardDue ? '••••••••' : `₹${creditCard.outstandingBalance?.toLocaleString('en-IN')}`}
              </p>
            </div>
            <button
              onClick={() => setRetailTab('cards')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
            >
              Pay Card Bill
            </button>
          </div>
        </div>
      )}

      {/* 4. Recent Transactions List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Recent Transactions
          </h3>
          <button
            onClick={() => setRetailTab('statements')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Statement
          </button>
        </div>

        <div className="space-y-2.5">
          {transactions.slice(0, 5).map((txn) => {
            const isCredit = txn.type === 'credit';
            return (
              <div
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCredit 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {txn.description}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {txn.date} • {txn.paymentMode}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-xs font-extrabold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {txn.status === 'completed' ? 'Success' : txn.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Pre-Approved Offer Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-300" /> Pre-Approved Offer
          </span>
          <h4 className="text-sm font-bold">Instant Personal Loan up to ₹5,00,000</h4>
          <p className="text-xs text-blue-100">Disbursed in 30 seconds with zero paperwork.</p>
        </div>
        <button
          onClick={() => setRetailTab('loans')}
          className="px-3.5 py-2 bg-white text-blue-700 text-xs font-bold rounded-xl shadow-md shrink-0 hover:bg-blue-50 active:scale-95 transition-all"
        >
          Avail Now
        </button>
      </div>

      {/* ================= MODALS & DETAIL FLOWS ================= */}

      {/* A. Add Money Modal */}
      <AnimatePresence>
        {showAddMoneyModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Money</h3>
                    <p className="text-[10px] text-slate-400">To {primaryAccount.accountType} ({primaryAccount.maskedNumber})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddMoneyModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMoneySubmit} className="mt-4 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Enter Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="5,000"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-lg font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  {/* Quick Chips */}
                  <div className="flex gap-2 mt-2">
                    {['1000', '2500', '5000', '10000'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setAddAmount(chip)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          addAmount === chip 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300'
                        }`}
                      >
                        +₹{parseInt(chip).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Fund Source / Payment Method
                  </label>
                  <select
                    value={addSource}
                    onChange={(e) => setAddSource(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="HDFC Bank UPI (hdfcbank@upi)">HDFC Bank UPI (hdfcbank@upi)</option>
                    <option value="ICICI Bank NetBanking">ICICI Bank NetBanking</option>
                    <option value="State Bank of India Debit Card (•••• 8920)">SBI Debit Card (•••• 8920)</option>
                    <option value="Instant UPI Collect (Any UPI App)">Instant UPI Collect Request</option>
                  </select>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Zero convenience fee. Funds credited instantly via RBI IMPS/UPI rails.</span>
                </div>

                <button
                  type="submit"
                  disabled={isAddingMoney}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {isAddingMoney ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Add ₹{parseInt(addAmount || '0').toLocaleString('en-IN')} Instantly</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. Insurance Modal */}
      <AnimatePresence>
        {showInsuranceModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Insurance 360</h3>
                    <p className="text-[10px] text-slate-400">Health, Life & Cyber Shield</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInsuranceModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-cyan-600 text-white rounded-md">Active Policy</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Bharat Term Life Cover</h4>
                      <p className="text-[11px] text-slate-500">₹1,00,00,000 Sum Assured</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300">POL-882910</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-cyan-200/60 dark:border-cyan-800/40 flex justify-between text-[10px] text-slate-500">
                    <span>Premium: ₹840/mo</span>
                    <span>Next Due: 15 Sep 2026</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cyber Fraud & Banking Shield</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">₹5,00,000 coverage against phishing, unauthorized UPI & SIM swap.</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-600">₹49 / month</span>
                    <button 
                      onClick={() => {
                        addToast({ type: 'success', title: 'Cyber Shield Activated', message: 'Your digital accounts are now protected up to ₹5,00,000.' });
                        setShowInsuranceModal(false);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-xl"
                    >
                      Instant Protect
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Super Health Top-Up</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">₹25,00,000 cashless family floater across 12,000+ hospitals.</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">From ₹650 / mo</span>
                    <button 
                      onClick={() => {
                        addToast({ type: 'info', title: 'Quote Requested', message: 'Our health advisor will contact you with policy schedule.' });
                        setShowInsuranceModal(false);
                      }}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-bold rounded-xl"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInsuranceModal(false)}
                className="w-full mt-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* C. Forex Modal */}
      <AnimatePresence>
        {showForexModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Forex & Multi-Currency</h3>
                    <p className="text-[10px] text-slate-400">Live Interbank FX Rates</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowForexModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Multi-Currency Card Balance */}
              <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl text-white">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-amber-200">
                  <span>Bharat World Forex Card</span>
                  <span>Active</span>
                </div>
                <div className="mt-2 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-amber-100">Loaded USD Balance</p>
                    <p className="text-xl font-extrabold">$2,450.00</p>
                  </div>
                  <span className="text-xs font-mono bg-white/20 px-2 py-1 rounded-lg">EUR €850.00</span>
                </div>
              </div>

              {/* Live FX Rates */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Today's Live Exchange Rates
                </span>
                <div className="space-y-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">USD / INR</span>
                    <span className="text-emerald-600 font-bold">₹83.42 (+0.04%)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">EUR / INR</span>
                    <span className="text-emerald-600 font-bold">₹90.15 (+0.12%)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">GBP / INR</span>
                    <span className="text-emerald-600 font-bold">₹105.80 (-0.08%)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">AED / INR</span>
                    <span className="text-emerald-600 font-bold">₹22.71 (0.00%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    addToast({ type: 'success', title: 'Card Reloaded', message: '$500 added to your Bharat World Forex Card.' });
                    setShowForexModal(false);
                  }}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs"
                >
                  Reload Forex Card
                </button>
                <button
                  onClick={() => setShowForexModal(false)}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* D. Mobile Recharge Modal */}
      <AnimatePresence>
        {showRechargeModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mobile Recharge</h3>
                    <p className="text-[10px] text-slate-400">Prepaid & Postpaid Fast Recharge</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRechargeModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRechargeSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={rechargeMobile}
                    onChange={(e) => setRechargeMobile(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Operator
                    </label>
                    <select
                      value={rechargeOperator}
                      onChange={(e) => setRechargeOperator(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="Jio Prepaid">Jio</option>
                      <option value="Airtel Prepaid">Airtel</option>
                      <option value="Vi Prepaid">Vi</option>
                      <option value="BSNL Prepaid">BSNL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Circle
                    </label>
                    <select
                      className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option>Mumbai</option>
                      <option>Delhi NCR</option>
                      <option>Karnataka</option>
                      <option>Maharashtra</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Select Popular Plan
                  </label>
                  <select
                    value={rechargePlan}
                    onChange={(e) => setRechargePlan(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="₹299 - 2GB/day (28 Days)">₹299 - 2GB/day + Unlimited 5G (28 Days)</option>
                    <option value="₹349 - 2.5GB/day (28 Days)">₹349 - 2.5GB/day + OTT App (28 Days)</option>
                    <option value="₹666 - 1.5GB/day (70 Days)">₹666 - 1.5GB/day + Voice (70 Days)</option>
                    <option value="₹2999 - 2.5GB/day (365 Days)">₹2999 - Annual Mega Pack (365 Days)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isRecharging}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl shadow-md text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  {isRecharging ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Proceed to Recharge</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* E. UPI / QR Management Modal */}
      <AnimatePresence>
        {showUpiModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">UPI & QR Hub</h3>
                    <p className="text-[10px] text-slate-400">NPCI Integrated</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowUpiModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Box */}
              <div className="my-4 p-4 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block">
                <div className="w-44 h-44 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                  <QrCode className="w-36 h-36 text-white" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-[10px] border-2 border-white shadow-md">
                      APEX
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI ID Banner */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium">Primary UPI VPA</p>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">{user?.upiId || 'devansh@apexbank'}</p>
                </div>
                <button
                  onClick={handleCopyUpi}
                  className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold rounded-xl flex items-center gap-1"
                >
                  {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Actions */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setShowUpiModal(false);
                    openScanner();
                  }}
                  className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <Scan className="w-4 h-4" />
                  <span>Scan Any QR</span>
                </button>
                <button
                  onClick={() => {
                    addToast({ type: 'info', title: 'UPI PIN Reset Request', message: 'SMS verification sent to your registered mobile number.' });
                    setShowUpiModal(false);
                  }}
                  className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-2xl"
                >
                  Change UPI PIN
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* F. Statements Modal */}
      <AnimatePresence>
        {showStatementsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Download Statements</h3>
                    <p className="text-[10px] text-slate-400">Digitally Certified PDF & Excel</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowStatementsModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  { label: 'Current Month (Aug 2026)', desc: `${transactions.length} Transactions` },
                  { label: 'Last 3 Months', desc: 'May 2026 - Jul 2026' },
                  { label: 'Last 6 Months (ITR Ready)', desc: 'Feb 2026 - Jul 2026' },
                  { label: 'Financial Year 2025-26', desc: 'Full annual audited summary' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        addToast({ type: 'success', title: 'Statement Downloaded', message: `${item.label} PDF exported to device storage.` });
                        setShowStatementsModal(false);
                      }}
                      className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs"
                      aria-label={`Download ${item.label}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    addToast({ type: 'success', title: 'Email Sent', message: 'Statement dispatched to devansh@singhania.in.' });
                    setShowStatementsModal(false);
                  }}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs"
                >
                  Email Statement
                </button>
                <button
                  onClick={() => setShowStatementsModal(false)}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* G. Offers Modal */}
      <AnimatePresence>
        {showOffersModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-600 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curated Bank Offers</h3>
                    <p className="text-[10px] text-slate-400">Exclusive to Bharat Bank Members</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowOffersModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-pink-50/80 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-pink-600 text-white rounded-md">Shopping</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">10% Instant Cashback on Amazon & Flipkart</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Use promo code <span className="font-mono font-bold text-pink-700 dark:text-pink-300">BHARAT10</span> on checkout.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-amber-600 text-white rounded-md">Dining & Travel</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Complimentary Airport Lounge Access</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">2 free international & 4 domestic lounge visits per quarter.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-purple-600 text-white rounded-md">Entertainment</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Buy 1 Get 1 Free on BookMyShow</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Valid on all Bharat Platinum debit & credit cards on weekends.</p>
                </div>
              </div>

              <button
                onClick={() => setShowOffersModal(false)}
                className="w-full mt-4 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl text-xs shadow-md"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* H. Rewards Modal */}
      <AnimatePresence>
        {showRewardsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bharat Rewards</h3>
                    <p className="text-[10px] text-slate-400">1 pt = ₹0.25 Direct Cash</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRewardsModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 p-4 bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-500 rounded-3xl text-white shadow-lg shadow-amber-500/20">
                <p className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">Available Balance</p>
                <h3 className="text-3xl font-extrabold mt-1 tracking-tight">{rewardPoints.toLocaleString('en-IN')}</h3>
                <p className="text-xs text-amber-100 mt-1">Cash value: ≈ ₹{(rewardPoints * 0.25).toLocaleString('en-IN')}</p>
              </div>

              <div className="space-y-2 text-left text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Redeem for Instant Cash</p>
                    <p className="text-[10px] text-slate-400">Directly credits to your Savings Account</p>
                  </div>
                  <span className="font-bold text-emerald-600">₹{(rewardPoints * 0.25).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleRedeemRewards}
                disabled={isRedeeming || rewardPoints <= 0}
                className="w-full mt-4 py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2"
              >
                {isRedeeming ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Redeem Full Points as Cash</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* I. Transaction Detail Sheet */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Receipt</span>
                <button 
                  onClick={() => setSelectedTxn(null)} 
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedTxn.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {selectedTxn.type === 'credit' ? 'Money Credited' : 'Payment Sent'}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  ₹{selectedTxn.amount.toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{selectedTxn.description}</p>
              </div>

              <div className="py-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                <div className="flex justify-between">
                  <span>Reference UTR:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-200">{selectedTxn.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{selectedTxn.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span>{selectedTxn.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Counterparty:</span>
                  <span>{selectedTxn.counterpartyName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-500 font-bold">COMPLETED</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTxn(null)}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-md text-xs transition-all"
              >
                Close Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
