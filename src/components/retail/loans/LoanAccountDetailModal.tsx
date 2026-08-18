import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Landmark, 
  Percent, 
  Calendar, 
  CreditCard, 
  FileText, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowDownLeft, 
  Receipt,
  Layers,
  Banknote
} from 'lucide-react';
import { LoanAccount } from '../../../types/banking';
import { useBanking } from '../../../context/BankingContext';
import { LoanEmiScheduleModal } from './LoanEmiScheduleModal';

interface LoanAccountDetailModalProps {
  loan: LoanAccount;
  onClose: () => void;
}

export const LoanAccountDetailModal: React.FC<LoanAccountDetailModalProps> = ({
  loan,
  onClose
}) => {
  const { addToast, setRetailAccounts, setLoans } = useBanking();
  const [showSchedule, setShowSchedule] = useState(false);
  const [isPayingEmi, setIsPayingEmi] = useState(false);
  const [showPartPaymentModal, setShowPartPaymentModal] = useState(false);
  const [partAmount, setPartAmount] = useState(50000);

  // Pay EMI Handler
  const handlePayEmi = () => {
    setIsPayingEmi(true);
    setTimeout(() => {
      setIsPayingEmi(false);
      // Deduct from savings balance and reduce outstanding
      setRetailAccounts(prev => prev.map(acc => {
        if (acc.accountType === 'Savings') {
          const bal = Math.max(0, acc.balance - loan.emiAmount);
          return { ...acc, balance: bal, availableBalance: bal };
        }
        return acc;
      }));

      setLoans(prev => prev.map(l => {
        if (l.id === loan.id) {
          const newOutstanding = Math.max(0, l.outstandingAmount - (loan.emiAmount * 0.75));
          return {
            ...l,
            outstandingAmount: Math.round(newOutstanding),
            tenureRemainingMonths: Math.max(0, l.tenureRemainingMonths - 1),
            nextEmiDate: '05 Oct 2026'
          };
        }
        return l;
      }));

      addToast({
        type: 'success',
        title: 'Monthly EMI Paid Successfully',
        message: `₹${loan.emiAmount.toLocaleString('en-IN')} debited from Savings A/C for ${loan.type}.`
      });
    }, 1200);
  };

  // Part Payment Handler
  const handlePartPayment = () => {
    setRetailAccounts(prev => prev.map(acc => {
      if (acc.accountType === 'Savings') {
        const bal = Math.max(0, acc.balance - partAmount);
        return { ...acc, balance: bal, availableBalance: bal };
      }
      return acc;
    }));

    setLoans(prev => prev.map(l => {
      if (l.id === loan.id) {
        const newOutstanding = Math.max(0, l.outstandingAmount - partAmount);
        return {
          ...l,
          outstandingAmount: Math.round(newOutstanding)
        };
      }
      return l;
    }));

    setShowPartPaymentModal(false);
    addToast({
      type: 'success',
      title: 'Part Payment Applied',
      message: `₹${partAmount.toLocaleString('en-IN')} credited towards principal balance.`
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="w-full max-w-xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {loan.type}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {loan.loanNumber}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4.5 space-y-4 scrollbar-thin">
            {/* Hero Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  Active Facility
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {loan.interestRate}% p.a.
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-300 block font-medium">
                  Outstanding Principal
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  ₹{loan.outstandingAmount.toLocaleString('en-IN')}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sanctioned Amount</span>
                  <p className="font-bold">₹{loan.sanctionedAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Remaining Tenure</span>
                  <p className="font-bold">{loan.tenureRemainingMonths} / {loan.totalTenureMonths} Months</p>
                </div>
              </div>
            </div>

            {/* Next EMI Action Card */}
            <div className="p-4 rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
                  Next EMI Due on {loan.nextEmiDate}
                </span>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  ₹{loan.emiAmount.toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="button"
                disabled={isPayingEmi}
                onClick={handlePayEmi}
                className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                {isPayingEmi ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay EMI Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowSchedule(true)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors space-y-1"
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  EMI Schedule
                </h5>
                <p className="text-[10px] text-slate-400">View complete amortization</p>
              </button>

              <button
                type="button"
                onClick={() => setShowPartPaymentModal(true)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors space-y-1"
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  Part Payment
                </h5>
                <p className="text-[10px] text-slate-400">Reduce outstanding balance</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Loan Statement Downloaded',
                    message: 'Official e-statement with interest certificate saved.'
                  });
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors space-y-1"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  Download Statement
                </h5>
                <p className="text-[10px] text-slate-400">Tax Certificate & Repayments</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Sanction Letter Retrieved',
                    message: 'Signed digital agreement agreement ready.'
                  });
                }}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors space-y-1"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  Agreement Copy
                </h5>
                <p className="text-[10px] text-slate-400">View digitally signed copy</p>
              </button>
            </div>

            {/* Account Details & Mandates */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2 text-xs">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Loan Specifications
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Auto-Debit Account</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">•••• 0012 (Savings A/C)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Interest Type</span>
                <span className="font-bold text-slate-900 dark:text-white">Fixed Monthly Reducing</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Foreclosure Charges</span>
                <span className="font-bold text-emerald-600">NIL (Zero Penalty)</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

      {/* Amortization Schedule Sub-Modal */}
      <AnimatePresence>
        {showSchedule && (
          <LoanEmiScheduleModal
            loan={loan}
            onClose={() => setShowSchedule(false)}
            onPayEmi={handlePayEmi}
          />
        )}
      </AnimatePresence>

      {/* Part Payment Sub-Modal */}
      <AnimatePresence>
        {showPartPaymentModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Make Part Payment
                </h4>
                <button
                  type="button"
                  onClick={() => setShowPartPaymentModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Part-payment directly reduces your outstanding principal, lowering subsequent interest and tenure.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Payment Amount
                </label>
                <input
                  type="number"
                  step={5000}
                  value={partAmount}
                  onChange={(e) => setPartAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-extrabold outline-hidden"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPartPaymentModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePartPayment}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  Pay ₹{partAmount.toLocaleString('en-IN')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
