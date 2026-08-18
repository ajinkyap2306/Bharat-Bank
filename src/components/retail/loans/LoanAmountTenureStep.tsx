import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  Sparkles, 
  Percent, 
  Clock, 
  ShieldCheck, 
  IndianRupee,
  Info
} from 'lucide-react';
import { LOAN_TYPES_CONFIG, LoanCategoryType, LoanApplicationState, calculateEmi } from './LoanFlowData';

interface LoanAmountTenureStepProps {
  loanType: LoanCategoryType;
  appState: LoanApplicationState;
  onUpdateAppState: (partial: Partial<LoanApplicationState>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const LoanAmountTenureStep: React.FC<LoanAmountTenureStepProps> = ({
  loanType,
  appState,
  onUpdateAppState,
  onContinue,
  onBack
}) => {
  const config = LOAN_TYPES_CONFIG[loanType];
  const maxAllowed = Math.min(config.maxAmount, appState.eligibleAmount || config.maxAmount);

  const [amount, setAmount] = useState<number>(appState.requestedAmount || config.defaultAmount);
  const [tenureMonths, setTenureMonths] = useState<number>(appState.tenureMonths || config.defaultTenureMonths);

  const rate = config.interestRateStart;
  const { emi, totalInterest, totalRepayment } = calculateEmi(amount, rate, tenureMonths);
  const processingFee = Math.max(
    config.minProcessingFee,
    Math.round((amount * config.processingFeePercent) / 100)
  );

  const handleAmountChange = (val: number) => {
    setAmount(val);
  };

  const handleTenureChange = (months: number) => {
    setTenureMonths(months);
  };

  const handleProceed = () => {
    onUpdateAppState({
      requestedAmount: amount,
      tenureMonths,
      interestRate: rate,
      calculatedEmi: emi,
      processingFee,
      totalInterest,
      totalRepayment
    });
    onContinue();
  };

  // Quick preset chips
  const amountPresets = [
    Math.min(maxAllowed, 100000),
    Math.min(maxAllowed, 300000),
    Math.min(maxAllowed, 500000),
    Math.min(maxAllowed, 1000000),
    maxAllowed
  ].filter((v, idx, arr) => arr.indexOf(v) === idx && v >= config.minAmount);

  const tenureYearsOptions = [1, 2, 3, 4, 5]
    .filter(y => y * 12 <= config.maxTenureMonths && y * 12 >= config.minTenureMonths);

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
            Step 4: Amount & Tenure
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customize Your Loan
          </h2>
        </div>
      </div>

      {/* Prominent Estimated EMI Hero Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Fixed Interest Rate
          </span>
          <span className="text-xs font-bold text-blue-200">
            {rate}% p.a.
          </span>
        </div>

        <div>
          <p className="text-xs text-blue-200 font-medium">Estimated Monthly EMI</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ₹{emi.toLocaleString('en-IN')}
            </h1>
            <span className="text-sm font-semibold text-blue-200">/ month</span>
          </div>
        </div>

        {/* Mini progress breakdown visual */}
        <div className="space-y-1.5 pt-2 border-t border-white/20">
          <div className="flex justify-between text-[11px] text-blue-100 font-medium">
            <span>Principal: ₹{amount.toLocaleString('en-IN')} ({Math.round((amount / totalRepayment) * 100)}%)</span>
            <span>Interest: ₹{totalInterest.toLocaleString('en-IN')} ({Math.round((totalInterest / totalRepayment) * 100)}%)</span>
          </div>
          <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-400 h-full rounded-l-full transition-all duration-300"
              style={{ width: `${(amount / totalRepayment) * 100}%` }}
            />
            <div 
              className="bg-amber-400 h-full rounded-r-full transition-all duration-300"
              style={{ width: `${(totalInterest / totalRepayment) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        {/* Loan Amount Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Loan Amount
            </label>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-400">₹</span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                {amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <input
            type="range"
            min={config.minAmount}
            max={maxAllowed}
            step={config.minAmount >= 500000 ? 50000 : 10000}
            value={amount}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Min: ₹{(config.minAmount / 1000).toLocaleString('en-IN')}k</span>
            <span>Eligible Max: ₹{(maxAllowed / 100000).toLocaleString('en-IN')} Lakhs</span>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {amountPresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleAmountChange(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  amount === val
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                ₹{(val / 100000).toFixed(val >= 100000 ? 1 : 0)}L
              </button>
            ))}
          </div>
        </div>

        {/* Repayment Tenure Control */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Repayment Tenure
            </label>
            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-blue-600 dark:text-blue-400">
              {tenureMonths / 12} Years ({tenureMonths} Months)
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {tenureYearsOptions.map((yrs) => {
              const months = yrs * 12;
              const isSelected = tenureMonths === months;
              return (
                <button
                  key={yrs}
                  type="button"
                  onClick={() => handleTenureChange(months)}
                  className={`py-2.5 rounded-2xl text-center border font-bold text-xs transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-sm">{yrs} Yr</span>
                  <span className="text-[10px] text-slate-400 font-normal">{months}m</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comprehensive Loan Financial Summary */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Loan Repayment & Fee Summary
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Principal Sanction Amount</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Interest Rate (Fixed)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {rate}% p.a.
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Total Interest Payable</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              ₹{totalInterest.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">One-time Processing Fee ({config.processingFeePercent}% + GST)</span>
            <span className="font-bold text-slate-900 dark:text-white">
              ₹{processingFee.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-1.5 font-extrabold text-sm">
            <span className="text-slate-900 dark:text-white">Total Amount to be Repaid</span>
            <span className="text-blue-600 dark:text-blue-400">
              ₹{totalRepayment.toLocaleString('en-IN')}
            </span>
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
          onClick={handleProceed}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
