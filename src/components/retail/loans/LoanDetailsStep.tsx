import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Calculator, 
  Percent, 
  Clock, 
  FileText, 
  BadgeCheck, 
  Info 
} from 'lucide-react';
import { LOAN_TYPES_CONFIG, LoanCategoryType, calculateEmi } from './LoanFlowData';

interface LoanDetailsStepProps {
  loanType: LoanCategoryType;
  onContinue: () => void;
  onBack: () => void;
}

export const LoanDetailsStep: React.FC<LoanDetailsStepProps> = ({
  loanType,
  onContinue,
  onBack
}) => {
  const config = LOAN_TYPES_CONFIG[loanType];

  // Mini calculator on the details page
  const [calcAmount, setCalcAmount] = useState<number>(config.defaultAmount);
  const [calcTenure, setCalcTenure] = useState<number>(config.defaultTenureMonths);

  const { emi, totalInterest, totalRepayment } = calculateEmi(
    calcAmount,
    config.interestRateStart,
    calcTenure
  );

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
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
            Step 2: Overview & Rates
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {config.title} Details
          </h2>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className={`p-5 rounded-3xl bg-gradient-to-tr ${config.color} text-white shadow-lg space-y-3 relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase bg-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Digital Instant Sanction
          </span>
          <span className="text-xs font-bold bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
            {config.interestRateStart}% p.a. onwards
          </span>
        </div>

        <div>
          <h3 className="text-xl font-extrabold tracking-tight">{config.title}</h3>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">{config.shortDesc}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-center">
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-xs">
            <span className="text-[10px] text-white/80 block">Amount Range</span>
            <span className="text-xs font-extrabold">
              ₹{(config.minAmount / 1000).toLocaleString('en-IN')}k - ₹{(config.maxAmount / 100000).toLocaleString('en-IN')}L
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-xs">
            <span className="text-[10px] text-white/80 block">Max Tenure</span>
            <span className="text-xs font-extrabold">{config.maxTenureMonths / 12} Years</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-xs">
            <span className="text-[10px] text-white/80 block">Processing Fee</span>
            <span className="text-xs font-extrabold">{config.processingFeePercent}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Quick EMI Estimator */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Quick EMI Estimator
            </h4>
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            @ {config.interestRateStart}% p.a.
          </span>
        </div>

        {/* Amount Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Loan Amount</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              ₹{calcAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={config.minAmount}
            max={config.maxAmount}
            step={config.minAmount >= 500000 ? 50000 : 10000}
            value={calcAmount}
            onChange={(e) => setCalcAmount(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Repayment Tenure</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {calcTenure / 12} Years ({calcTenure} Months)
            </span>
          </div>
          <input
            type="range"
            min={config.minTenureMonths}
            max={config.maxTenureMonths}
            step={12}
            value={calcTenure}
            onChange={(e) => setCalcTenure(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Output EMI result */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
              Estimated Monthly EMI
            </span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              ₹{emi.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-medium">/month</span>
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Total Repayment</span>
            <span className="font-bold text-slate-900 dark:text-white">
              ₹{totalRepayment.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Key Benefits & Features */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Key Features & Benefits
        </h4>
        <div className="space-y-2.5">
          {config.highlights.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-tight">
                {feat}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Summary */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Eligibility Summary
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-medium block">Age Requirement</span>
            <p className="font-bold text-slate-900 dark:text-white">
              {config.eligibilityCriteria.minAge} to {config.eligibilityCriteria.maxAge} Years
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-medium block">Min Monthly Income</span>
            <p className="font-bold text-slate-900 dark:text-white">
              ₹{config.eligibilityCriteria.minIncome.toLocaleString('en-IN')} / mo
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-medium block">Minimum CIBIL Score</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              {config.eligibilityCriteria.minCreditScore}+
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-medium block">Applicant Category</span>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {config.eligibilityCriteria.employmentType}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
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
          onClick={onContinue}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>Check Eligibility</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
