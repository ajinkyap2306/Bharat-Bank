import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  User, 
  Briefcase, 
  IndianRupee, 
  Calendar, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { LOAN_TYPES_CONFIG, LoanCategoryType, LoanApplicationState, calculateEmi } from './LoanFlowData';

interface LoanEligibilityStepProps {
  loanType: LoanCategoryType;
  appState: LoanApplicationState;
  onUpdateAppState: (partial: Partial<LoanApplicationState>) => void;
  onEligibleContinue: () => void;
  onBack: () => void;
  onExploreOtherLoans: () => void;
}

export const LoanEligibilityStep: React.FC<LoanEligibilityStepProps> = ({
  loanType,
  appState,
  onUpdateAppState,
  onEligibleContinue,
  onBack,
  onExploreOtherLoans
}) => {
  const config = LOAN_TYPES_CONFIG[loanType];

  // Eligibility form state
  const [dob, setDob] = useState(appState.personal.dob || '1992-07-14');
  const [employmentType, setEmploymentType] = useState(appState.employment.employmentType || 'Salaried');
  const [monthlyIncome, setMonthlyIncome] = useState(appState.employment.monthlyNetIncome || 145000);
  const [existingEmi, setExistingEmi] = useState(appState.employment.existingMonthlyEmis || 12000);
  const [workExperienceYears, setWorkExperienceYears] = useState(appState.employment.totalWorkExperienceYears || 6);

  // Status state: 'form' | 'checking' | 'eligible' | 'ineligible'
  const [eligibilityStatus, setEligibilityStatus] = useState<'form' | 'checking' | 'eligible' | 'ineligible'>('form');
  const [checkingProgress, setCheckingProgress] = useState(0);

  const handleRunEligibilityCheck = () => {
    setEligibilityStatus('checking');
    setCheckingProgress(20);

    const t1 = setTimeout(() => setCheckingProgress(55), 600);
    const t2 = setTimeout(() => setCheckingProgress(85), 1100);
    const t3 = setTimeout(() => {
      setCheckingProgress(100);

      // Algorithmic qualification check
      // Disposable income = (monthlyIncome * 0.55) - existingEmi
      const disposable = (monthlyIncome * 0.55) - existingEmi;
      const isQualified = disposable > 15000 && monthlyIncome >= config.eligibilityCriteria.minIncome;

      if (isQualified) {
        // Calculate dynamic maximum eligible amount
        const maxEmiPossible = Math.max(10000, disposable * 0.85);
        const dynamicEligibleAmount = Math.min(
          config.maxAmount,
          Math.max(config.minAmount, Math.round((maxEmiPossible * 36 * 0.85) / 50000) * 50000)
        );

        const chosenAmount = Math.min(dynamicEligibleAmount, appState.requestedAmount || config.defaultAmount);
        const { emi, totalInterest, totalRepayment } = calculateEmi(
          chosenAmount,
          config.interestRateStart,
          config.defaultTenureMonths
        );

        onUpdateAppState({
          isEligible: true,
          eligibleAmount: dynamicEligibleAmount,
          requestedAmount: chosenAmount,
          interestRate: config.interestRateStart,
          calculatedEmi: emi,
          totalInterest,
          totalRepayment,
          personal: {
            ...appState.personal,
            dob
          },
          employment: {
            ...appState.employment,
            employmentType: employmentType as any,
            monthlyNetIncome: monthlyIncome,
            existingMonthlyEmis: existingEmi,
            totalWorkExperienceYears: workExperienceYears
          }
        });

        setEligibilityStatus('eligible');
      } else {
        setEligibilityStatus('ineligible');
      }
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

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
            Step 3: Instant Eligibility Check
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Check Your Loan Limit
          </h2>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* State 1: Form Input */}
        {eligibilityStatus === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Basic Financial Profile
                </h3>
                <p className="text-xs text-slate-400">
                  Instant soft credit pull — this does not impact your credit score.
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Employment Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Employment Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Salaried', 'Self-Employed Professional', 'Business Owner'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmploymentType(type)}
                      className={`p-2 rounded-xl text-center border text-[11px] font-bold transition-all ${
                        employmentType === type
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {type === 'Self-Employed Professional' ? 'Self Employed' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Net In-Hand Income */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-blue-600" /> Monthly Net In-Hand Income
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    ₹{monthlyIncome.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={500000}
                  step={5000}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹15,000</span>
                  <span>₹2,50,000</span>
                  <span>₹5,00,000+</span>
                </div>
              </div>

              {/* Existing Monthly EMIs */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Existing Monthly Obligations (EMIs)</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    ₹{existingEmi.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200000}
                  step={2000}
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹0 (None)</span>
                  <span>₹50,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Total Work Experience</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {workExperienceYears} Years
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 5, 8].map((yrs) => (
                    <button
                      key={yrs}
                      type="button"
                      onClick={() => setWorkExperienceYears(yrs)}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                        workExperienceYears === yrs
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {yrs === 8 ? '8+ Yrs' : `${yrs} Yrs`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>256-bit encrypted bank-grade credit verification. No credit score drop.</span>
            </div>

            {/* Submit Button */}
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
                onClick={handleRunEligibilityCheck}
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Check Eligibility</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* State 2: Checking Animation */}
        {eligibilityStatus === 'checking' && (
          <motion.div
            key="checking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg text-center space-y-6 my-10"
          >
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/40 animate-ping opacity-50" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Verifying Credit & Eligibility
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analyzing income streams, Debt-to-Income (DTI) ratio, and bureau profiles...
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 max-w-xs mx-auto">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${checkingProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {checkingProgress}% completed
              </span>
            </div>
          </motion.div>
        )}

        {/* State 3: Eligible */}
        {eligibilityStatus === 'eligible' && (
          <motion.div
            key="eligible"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    Pre-Approved Qualification
                  </span>
                  <h3 className="text-lg font-extrabold tracking-tight">
                    You're eligible to continue!
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-3">
                <div>
                  <span className="text-xs text-emerald-100 font-medium">Eligible Loan Amount Up To</span>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    ₹{appState.eligibleAmount.toLocaleString('en-IN')}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-xs">
                  <div>
                    <span className="text-emerald-200 text-[10px]">Estimated Rate</span>
                    <p className="font-extrabold text-sm">{config.interestRateStart}% p.a.</p>
                  </div>
                  <div>
                    <span className="text-emerald-200 text-[10px]">Estimated EMI</span>
                    <p className="font-extrabold text-sm">
                      ₹{appState.calculatedEmi.toLocaleString('en-IN')}/mo
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-100 leading-relaxed">
                🎉 Congratulations! Based on your steady income profile and credit score of 785, your application has been prioritized for instant paperless sanction.
              </p>
            </div>

            {/* Next Steps Card */}
            <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                What's Next in the Flow
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>Customize your exact Loan Amount & Tenure</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center text-[10px]">2</span>
                  <span>Confirm Personal & Employment Details</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center text-[10px]">3</span>
                  <span>Instant e-Sign and Instant RTGS Disbursement</span>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 max-w-xl mx-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEligibilityStatus('form')}
                className="w-1/3 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={onEligibleContinue}
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
              >
                <span>Continue Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* State 4: Ineligible */}
        {eligibilityStatus === 'ineligible' && (
          <motion.div
            key="ineligible"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  We're unable to proceed with this application
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Based on our automated risk & debt-to-income underwriting policies, current monthly obligations exceed our permissible lending threshold for this product.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-left text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Tip: Adding a co-applicant (spouse/parent) with supplementary income or adjusting existing EMI obligations can make you eligible immediately.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setEligibilityStatus('form')}
                className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again with Adjusted Details</span>
              </button>
              <button
                type="button"
                onClick={onExploreOtherLoans}
                className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Explore Other Loan Types
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
