import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Landmark, 
  Percent, 
  Calendar, 
  FileText, 
  ShieldCheck,
  Download
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';

interface LoanApprovalStepProps {
  appState: LoanApplicationState;
  onViewAgreement: () => void;
  onBack: () => void;
}

export const LoanApprovalStep: React.FC<LoanApprovalStepProps> = ({
  appState,
  onViewAgreement,
  onBack
}) => {
  const netDisbursement = appState.requestedAmount - appState.processingFee;

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            Official Sanction
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loan Sanction Letter
          </h2>
        </div>
      </div>

      {/* Hero Sanction Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-xl space-y-4 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center mx-auto shadow-lg backdrop-blur-xs">
          <Award className="w-8 h-8 text-amber-300" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-3 py-1 rounded-full">
            🎉 Congratulations {appState.personal.fullName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your Loan is Approved!
          </h1>
          <p className="text-xs text-emerald-100 max-w-xs mx-auto">
            Sanction Letter #{appState.applicationId} issued by Bharat Co-operative Bank Credit Committee.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-1">
          <span className="text-xs text-emerald-200 font-medium">Sanctioned Principal Amount</span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            ₹{appState.requestedAmount.toLocaleString('en-IN')}
          </h2>
        </div>
      </div>

      {/* Sanction Terms Breakdown */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Approved Key Terms
        </h4>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Loan Facility</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{appState.loanType}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Interest Rate</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{appState.interestRate}% p.a. (Fixed)</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Repayment Tenure</span>
            <span className="font-bold text-slate-900 dark:text-white">{appState.tenureMonths / 12} Years ({appState.tenureMonths} Months)</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Monthly EMI</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
              ₹{appState.calculatedEmi.toLocaleString('en-IN')}/mo
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Processing Fee (Deducted at source)</span>
            <span className="font-bold text-slate-900 dark:text-white">
              - ₹{appState.processingFee.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-2 bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 font-extrabold text-sm">
            <span className="text-emerald-900 dark:text-emerald-200">Net Disbursement to Savings</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              ₹{netDisbursement.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Direct Agreement CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 max-w-xl mx-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onViewAgreement}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>View Loan Agreement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
