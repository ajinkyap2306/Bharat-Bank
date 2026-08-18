import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  FileCheck, 
  ShieldCheck, 
  CreditCard, 
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';

interface LoanStatusTrackerStepProps {
  appState: LoanApplicationState;
  onProceedToApproval: () => void;
  onBackToLoans: () => void;
}

export const LoanStatusTrackerStep: React.FC<LoanStatusTrackerStepProps> = ({
  appState,
  onProceedToApproval,
  onBackToLoans
}) => {
  // Application lifecycle steps
  const timelineSteps = [
    {
      id: 'submitted',
      title: 'Application Submitted',
      description: 'Submitted on 17 Aug 2026 • Verified via MPIN',
      status: 'completed', // completed | current | upcoming
      time: '10:14 AM'
    },
    {
      id: 'docs',
      title: 'Document Verification',
      description: 'KYC, PAN, Aadhaar & Salary Slips verified via DigiLocker',
      status: 'completed',
      time: '10:15 AM'
    },
    {
      id: 'credit',
      title: 'Credit Assessment & Underwriting',
      description: 'CIBIL Score 785 • Zero default history • Risk Tier: A+',
      status: 'completed',
      time: '10:16 AM'
    },
    {
      id: 'approval',
      title: 'Sanction Approval',
      description: 'Sanction Letter generated for ₹' + appState.requestedAmount.toLocaleString('en-IN'),
      status: 'current',
      time: 'Instant'
    },
    {
      id: 'agreement',
      title: 'e-Sign Loan Agreement',
      description: 'Aadhaar OTP-based digital agreement execution',
      status: 'upcoming',
      time: 'Pending e-Sign'
    },
    {
      id: 'disbursement',
      title: 'Direct Bank Disbursement',
      description: 'Instant RTGS transfer to Savings A/C •••• 0012',
      status: 'upcoming',
      time: 'Post e-Sign'
    }
  ];

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToLoans}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
            Real-Time Timeline Tracker
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Status
          </h2>
        </div>
      </div>

      {/* Hero Status Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Digital Fast-Track
          </span>
          <span className="font-mono text-xs text-blue-200">
            {appState.applicationId}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-extrabold">{appState.loanType}</h3>
          <p className="text-2xl font-extrabold tracking-tight mt-0.5">
            ₹{appState.requestedAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-blue-100">
          <span>Current Stage:</span>
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <CircleDot className="w-3 h-3 animate-pulse" /> Sanction Approved (Action Required)
          </span>
        </div>
      </div>

      {/* Timeline Stepper Container */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Processing Milestones
        </h4>

        <div className="relative pl-6 space-y-7 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
          {timelineSteps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <div key={step.id} className="relative group">
                {/* Node icon on line */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 ring-4 ring-emerald-50 dark:ring-emerald-950'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-4 ring-blue-100 dark:ring-blue-950 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 ring-4 ring-white dark:ring-slate-900'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <CircleDot className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                  )}
                </div>

                {/* Step Content */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h5 className={`text-xs font-extrabold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                      {step.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>

                  {isCurrent && (
                    <div className="mt-2 pt-2">
                      <button
                        type="button"
                        onClick={onProceedToApproval}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20"
                      >
                        <span>View Sanction Letter & Terms</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 max-w-xl mx-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToLoans}
          className="w-1/3 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Loans Home
        </button>
        <button
          type="button"
          onClick={onProceedToApproval}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>View Sanction & e-Sign</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
