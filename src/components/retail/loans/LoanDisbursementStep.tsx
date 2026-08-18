import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  CircleDot, 
  Landmark, 
  IndianRupee, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';
import { LoanAccount } from '../../../types/banking';

interface LoanDisbursementStepProps {
  appState: LoanApplicationState;
  createdLoan: LoanAccount | null;
  onViewLoanAccount: () => void;
}

export const LoanDisbursementStep: React.FC<LoanDisbursementStepProps> = ({
  appState,
  createdLoan,
  onViewLoanAccount
}) => {
  const [stage, setStage] = useState<number>(1);
  const netAmount = appState.requestedAmount - appState.processingFee;

  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 600);
    const t2 = setTimeout(() => setStage(3), 1300);
    const t3 = setTimeout(() => setStage(4), 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const isDone = stage >= 4;

  return (
    <div className="space-y-5 pb-10 text-center">
      {/* Celebration / Status Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center transition-all duration-500 shadow-xl ${
          isDone
            ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-500/25'
            : 'bg-blue-600 text-white shadow-blue-500/25 animate-pulse'
        }`}
      >
        {isDone ? (
          <CheckCircle2 className="w-10 h-10" />
        ) : (
          <Landmark className="w-10 h-10" />
        )}
      </motion.div>

      {/* Heading */}
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
          {isDone ? 'Disbursement Successful' : 'Processing RTGS Payout'}
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isDone ? 'Loan Amount Disbursed Successfully!' : 'Crediting Funds to Your Account'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {isDone
            ? 'The sanctioned funds are now available in your Bharat Bank Savings Account for immediate use.'
            : 'Initiating instant high-value interbank RTGS credit...'}
        </p>
      </div>

      {/* Disbursement Progress Stepper */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-left space-y-3.5">
        <div className="relative pl-6 space-y-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
          {/* Step 1 */}
          <div className="relative">
            <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              stage >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200'
            }`}>
              ✓
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Agreement Signed</h5>
              <p className="text-[10px] text-slate-400">Aadhaar e-Sign executed</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              stage >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200'
            }`}>
              {stage >= 2 ? '✓' : '2'}
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Disbursement Initiated</h5>
              <p className="text-[10px] text-slate-400">Sanctioned from Bharat Core Treasury</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              stage >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200'
            }`}>
              {stage >= 3 ? '✓' : '3'}
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Bank RTGS Clearing</h5>
              <p className="text-[10px] text-slate-400">Direct settlement cleared</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              stage >= 4 ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/40' : 'bg-slate-200'
            }`}>
              {stage >= 4 ? '✓' : '4'}
            </div>
            <div>
              <h5 className={`text-xs font-bold ${stage >= 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                Amount Credited to Savings A/C
              </h5>
              <p className="text-[10px] text-slate-400">Available balance updated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disbursed Receipt Card */}
      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-3"
        >
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 block">Disbursed Amount</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                ₹{appState.requestedAmount.toLocaleString('en-IN')}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              RTGS Settled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Credited Account</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                •••• •••• 0012
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Disbursement Date</span>
              <span className="font-medium text-slate-900 dark:text-white">17 Aug 2026</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Loan Account Number</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {createdLoan?.loanNumber || `LN-APEX-${Math.floor(1000000 + Math.random() * 9000000)}`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">First EMI Due</span>
              <span className="font-bold text-slate-900 dark:text-white">05 Sep 2026</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action CTA */}
      <div className="pt-3">
        <button
          type="button"
          disabled={!isDone}
          onClick={onViewLoanAccount}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <span>View Loan Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
