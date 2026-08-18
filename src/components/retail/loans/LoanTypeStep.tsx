import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Home, 
  Car, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Percent,
  Calendar,
  Clock
} from 'lucide-react';
import { LOAN_TYPES_CONFIG, LoanCategoryType, LoanTypeInfo } from './LoanFlowData';

interface LoanTypeStepProps {
  selectedType: LoanCategoryType;
  onSelectType: (type: LoanCategoryType) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const LoanTypeStep: React.FC<LoanTypeStepProps> = ({
  selectedType,
  onSelectType,
  onContinue,
  onBack
}) => {
  const getIcon = (type: LoanCategoryType) => {
    switch (type) {
      case 'Personal Loan':
        return <User className="w-6 h-6 text-white" />;
      case 'Home Loan':
        return <Home className="w-6 h-6 text-white" />;
      case 'Vehicle Loan':
        return <Car className="w-6 h-6 text-white" />;
      case 'Education Loan':
        return <GraduationCap className="w-6 h-6 text-white" />;
    }
  };

  const typesList = Object.values(LOAN_TYPES_CONFIG);

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
          Step 1: Select Loan Type
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Choose a Loan to Apply
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Instant digital sanction, lowest rates, and transparent paperless processing.
        </p>
      </div>

      {/* Loan Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {typesList.map((loan) => {
          const isSelected = selectedType === loan.id;
          return (
            <motion.div
              key={loan.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectType(loan.id)}
              className={`p-4.5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 dark:border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-600/30'
                  : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              {/* Top Row: Icon & Tag */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${loan.color} flex items-center justify-center shadow-md shadow-blue-500/20`}>
                    {getIcon(loan.id)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/60 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {loan.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {loan.shortDesc}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 text-center">
                  <span className="text-[10px] text-slate-400 font-medium block">Starting at</span>
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {loan.interestRateStart}% <span className="text-[9px] font-normal">p.a.</span>
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 text-center">
                  <span className="text-[10px] text-slate-400 font-medium block">Max Amount</span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block">
                    ₹{(loan.maxAmount / 100000).toLocaleString('en-IN')}L
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 text-center">
                  <span className="text-[10px] text-slate-400 font-medium block">Max Tenure</span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {loan.maxTenureMonths / 12} Yrs
                  </span>
                </div>
              </div>

              {/* Tagline pill */}
              <div className="mt-3 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg truncate">
                ✨ {loan.tagline}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 max-w-xl mx-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>Select & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
