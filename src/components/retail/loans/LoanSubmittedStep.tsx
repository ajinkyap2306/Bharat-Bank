import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  FileText, 
  Copy, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';

interface LoanSubmittedStepProps {
  appState: LoanApplicationState;
  onTrackApplication: () => void;
  onBackToLoans: () => void;
}

export const LoanSubmittedStep: React.FC<LoanSubmittedStepProps> = ({
  appState,
  onTrackApplication,
  onBackToLoans
}) => {
  return (
    <div className="space-y-5 pb-10 text-center">
      {/* Celebration Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      {/* Heading */}
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
          Submission Confirmed
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Submitted Successfully
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Your loan application is registered in our automated underwriting queue. Real-time sanction processing has commenced.
        </p>
      </div>

      {/* Application Snapshot Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-left space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Application Reference ID</span>
            <p className="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400">
              {appState.applicationId}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">Loan Type</span>
            <span className="font-bold text-slate-900 dark:text-white">{appState.loanType}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Requested Amount</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              ₹{appState.requestedAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Application Date</span>
            <span className="font-medium text-slate-900 dark:text-white">17 Aug 2026</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Expected Processing</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Instant Sanction</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>SMS & Email confirmation sent to {appState.personal.mobile}.</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onTrackApplication}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>Track Application Status</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onBackToLoans}
          className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Back to Loans Home
        </button>
      </div>
    </div>
  );
};
