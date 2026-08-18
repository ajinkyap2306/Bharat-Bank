import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  X, 
  Clock, 
  Calculator, 
  Tag, 
  ChevronRight, 
  PlusCircle, 
  TrendingUp, 
  CreditCard, 
  Award,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { LoanAccount } from '../../types/banking';
import { 
  LoanCategoryType, 
  LoanApplicationState, 
  INITIAL_APPLICATION_STATE, 
  LOAN_TYPES_CONFIG, 
  calculateEmi 
} from './loans/LoanFlowData';

// Import all loan flow step components
import { LoanTypeStep } from './loans/LoanTypeStep';
import { LoanDetailsStep } from './loans/LoanDetailsStep';
import { LoanEligibilityStep } from './loans/LoanEligibilityStep';
import { LoanAmountTenureStep } from './loans/LoanAmountTenureStep';
import { LoanPersonalDetailsStep } from './loans/LoanPersonalDetailsStep';
import { LoanEmploymentStep } from './loans/LoanEmploymentStep';
import { LoanDocumentUploadStep } from './loans/LoanDocumentUploadStep';
import { LoanReviewStep } from './loans/LoanReviewStep';
import { LoanAuthStep } from './loans/LoanAuthStep';
import { LoanSubmittedStep } from './loans/LoanSubmittedStep';
import { LoanStatusTrackerStep } from './loans/LoanStatusTrackerStep';
import { LoanApprovalStep } from './loans/LoanApprovalStep';
import { LoanAgreementStep } from './loans/LoanAgreementStep';
import { LoanESignStep } from './loans/LoanESignStep';
import { LoanDisbursementStep } from './loans/LoanDisbursementStep';
import { LoanAccountDetailModal } from './loans/LoanAccountDetailModal';
import { LoanEmiScheduleModal } from './loans/LoanEmiScheduleModal';

type LoanFlowStep = 
  | 'home'
  | 'type'
  | 'details'
  | 'eligibility'
  | 'amount_tenure'
  | 'personal'
  | 'employment'
  | 'documents'
  | 'review'
  | 'auth'
  | 'submitted'
  | 'status_tracker'
  | 'approval'
  | 'agreement'
  | 'esign'
  | 'disbursement';

export const RetailLoans: React.FC = () => {
  const { loans, applyForLoan, setBottomNavHidden, addToast } = useBanking();

  // Active Flow Step State
  const [currentStep, setCurrentStep] = useState<LoanFlowStep>('home');
  const [selectedLoanType, setSelectedLoanType] = useState<LoanCategoryType>('Personal Loan');
  const [appState, setAppState] = useState<LoanApplicationState>(INITIAL_APPLICATION_STATE);
  const [createdLoan, setCreatedLoan] = useState<LoanAccount | null>(null);

  // Modals for existing loans on home
  const [selectedLoanForDetail, setSelectedLoanForDetail] = useState<LoanAccount | null>(null);
  const [selectedLoanForSchedule, setSelectedLoanForSchedule] = useState<LoanAccount | null>(null);

  // Home Quick Calculator State
  const [homeCalcType, setHomeCalcType] = useState<LoanCategoryType>('Personal Loan');
  const [homeCalcAmount, setHomeCalcAmount] = useState<number>(500000);
  const [homeCalcTenureYears, setHomeCalcTenureYears] = useState<number>(3);

  // Bottom Navigation Visibility Control:
  // Strictly hide bottom nav when user is in the loan application flow
  useEffect(() => {
    if (currentStep !== 'home') {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [currentStep, setBottomNavHidden]);

  // Home calculator math
  const homeRate = LOAN_TYPES_CONFIG[homeCalcType].interestRateStart;
  const homeMonths = homeCalcTenureYears * 12;
  const { emi: homeEmi, totalInterest: homeTotalInterest, totalRepayment: homeTotalRepay } = calculateEmi(
    homeCalcAmount,
    homeRate,
    homeMonths
  );

  // Aggregate active loans metrics
  const totalOutstanding = loans.reduce((acc, l) => acc + l.outstandingAmount, 0);
  const totalMonthlyEmi = loans.reduce((acc, l) => acc + l.emiAmount, 0);

  // Handler to start a new loan application flow
  const handleStartApplication = (type?: LoanCategoryType) => {
    const chosenType = type || 'Personal Loan';
    const config = LOAN_TYPES_CONFIG[chosenType];
    const { emi, totalInterest, totalRepayment } = calculateEmi(
      config.defaultAmount,
      config.interestRateStart,
      config.defaultTenureMonths
    );

    setSelectedLoanType(chosenType);
    setAppState({
      ...INITIAL_APPLICATION_STATE,
      loanType: chosenType,
      requestedAmount: config.defaultAmount,
      tenureMonths: config.defaultTenureMonths,
      interestRate: config.interestRateStart,
      calculatedEmi: emi,
      totalInterest,
      totalRepayment,
      processingFee: Math.round((config.defaultAmount * config.processingFeePercent) / 100),
      applicationId: 'APX-LN-2026-' + Math.floor(10000 + Math.random() * 90000)
    });

    if (type) {
      setCurrentStep('details');
    } else {
      setCurrentStep('type');
    }
  };

  // Updator for application state
  const handleUpdateAppState = (partial: Partial<LoanApplicationState>) => {
    setAppState(prev => ({ ...prev, ...partial }));
  };

  // Step 10: Auth success -> transition to Submitted
  const handleAuthSuccess = () => {
    setCurrentStep('submitted');
  };

  // Step 15: e-Sign complete -> execute real loan creation and transition to Disbursement
  const handleESignComplete = () => {
    // Actually disburse money and create loan in BankingContext
    const newLoan = applyForLoan(
      appState.loanType,
      appState.requestedAmount,
      appState.tenureMonths
    );
    setCreatedLoan(newLoan);
    setCurrentStep('disbursement');
  };

  // Step 16: Finish disbursement -> view active loan account
  const handleFinishToLoanAccount = () => {
    if (createdLoan) {
      setSelectedLoanForDetail(createdLoan);
    }
    setCurrentStep('home');
  };

  return (
    <div className="space-y-5 pb-6">
      {/* RENDER STEP: HOME vs FLOW */}
      {currentStep === 'home' && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          {/* Top Banner with Quick Apply */}
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-300" /> Digital Instant Sanction
              </span>
              <span className="text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Zero Paperwork
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Instant Loans in 15 Minutes
              </h2>
              <p className="text-xs text-blue-100 mt-1 max-w-sm">
                Sanctioned digitally with 100% paperless verification and immediate RTGS disbursement.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleStartApplication()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-blue-900 font-extrabold text-xs sm:text-sm shadow-lg shadow-black/20 flex items-center justify-center gap-2 hover:bg-blue-50 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>Apply for a Loan</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Active Loans Overview (if any) */}
          {loans.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active Loans ({loans.length})
                </h4>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  Total Outstanding: <strong className="text-slate-900 dark:text-white">₹{totalOutstanding.toLocaleString('en-IN')}</strong>
                </span>
              </div>

              <div className="space-y-3">
                {loans.map((loan) => (
                  <motion.div
                    key={loan.id}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedLoanForDetail(loan)}
                    className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Landmark className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {loan.type}
                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">
                              ACTIVE
                            </span>
                          </h5>
                          <p className="text-[10px] text-slate-400 font-mono">{loan.loanNumber}</p>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
                        {loan.interestRate}% p.a.
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px]">Outstanding Principal</span>
                        <p className="font-extrabold text-slate-900 dark:text-white">
                          ₹{loan.outstandingAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Monthly EMI (Due {loan.nextEmiDate})</span>
                        <p className="font-extrabold text-blue-600 dark:text-blue-400">
                          ₹{loan.emiAmount.toLocaleString('en-IN')}/mo
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-bold border-t border-slate-100 dark:border-slate-800">
                      <span>View Account & Repayment Schedule</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Available Loan Offers Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Pre-Approved Loan Offers
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Offer 1: Pre-approved Personal Loan */}
              <div className="p-4.5 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/80 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> Pre-Approved
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    10.49% p.a.
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Instant Personal Loan up to ₹10 Lakhs
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Zero collateral, zero foreclosure charges after 6 months.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartApplication('Personal Loan')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Claim Pre-Approved Loan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Offer 2: Festive Home Loan */}
              <div className="p-4.5 rounded-3xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/80 dark:border-emerald-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-600" /> Special Rate
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    8.40% p.a.
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Festive Home Loan Bonanza
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    50% discount on processing fee + free property valuation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartApplication('Home Loan')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Apply for Home Loan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Product Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Explore All Loan Facilities
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(LOAN_TYPES_CONFIG) as LoanCategoryType[]).map((type) => {
                const info = LOAN_TYPES_CONFIG[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleStartApplication(type)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-blue-400 dark:hover:border-blue-600 transition-all space-y-2 group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {info.interestRateStart}%
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                        {info.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Up to ₹{(info.maxAmount / 100000).toFixed(0)}L
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Loan Calculator on Home */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Interactive Loan EMI Calculator
                </h4>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                @ {homeRate}% p.a.
              </span>
            </div>

            {/* Loan Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(LOAN_TYPES_CONFIG) as LoanCategoryType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setHomeCalcType(type);
                    setHomeCalcAmount(LOAN_TYPES_CONFIG[type].defaultAmount);
                  }}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all text-center truncate ${
                    homeCalcType === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Amount Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Loan Amount</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  ₹{homeCalcAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={LOAN_TYPES_CONFIG[homeCalcType].minAmount}
                max={LOAN_TYPES_CONFIG[homeCalcType].maxAmount}
                step={LOAN_TYPES_CONFIG[homeCalcType].minAmount >= 500000 ? 50000 : 10000}
                value={homeCalcAmount}
                onChange={(e) => setHomeCalcAmount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
            </div>

            {/* Tenure Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Tenure</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {homeCalcTenureYears} Years ({homeMonths} Months)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={LOAN_TYPES_CONFIG[homeCalcType].maxTenureMonths / 12}
                step={1}
                value={homeCalcTenureYears}
                onChange={(e) => setHomeCalcTenureYears(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
            </div>

            {/* Calculated Result Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">
                  Estimated Monthly EMI
                </span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ₹{homeEmi.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-medium">/mo</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAppState(prev => ({
                    ...prev,
                    loanType: homeCalcType,
                    requestedAmount: homeCalcAmount,
                    tenureMonths: homeMonths,
                    interestRate: homeRate,
                    calculatedEmi: homeEmi,
                    totalInterest: homeTotalInterest,
                    totalRepayment: homeTotalRepay
                  }));
                  setCurrentStep('details');
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1"
              >
                <span>Apply with this EMI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 1: LOAN TYPE SELECTION */}
      {currentStep === 'type' && (
        <LoanTypeStep
          selectedType={selectedLoanType}
          onSelectType={(t) => {
            setSelectedLoanType(t);
            setAppState(prev => ({ ...prev, loanType: t }));
          }}
          onContinue={() => setCurrentStep('details')}
          onBack={() => setCurrentStep('home')}
        />
      )}

      {/* STEP 2: LOAN DETAILS & OVERVIEW */}
      {currentStep === 'details' && (
        <LoanDetailsStep
          loanType={selectedLoanType}
          onContinue={() => setCurrentStep('eligibility')}
          onBack={() => setCurrentStep('type')}
        />
      )}

      {/* STEP 3: ELIGIBILITY CHECK */}
      {currentStep === 'eligibility' && (
        <LoanEligibilityStep
          loanType={selectedLoanType}
          appState={appState}
          onUpdateAppState={handleUpdateAppState}
          onEligibleContinue={() => setCurrentStep('amount_tenure')}
          onBack={() => setCurrentStep('details')}
          onExploreOtherLoans={() => setCurrentStep('type')}
        />
      )}

      {/* STEP 4: LOAN AMOUNT & TENURE */}
      {currentStep === 'amount_tenure' && (
        <LoanAmountTenureStep
          loanType={selectedLoanType}
          appState={appState}
          onUpdateAppState={handleUpdateAppState}
          onContinue={() => setCurrentStep('personal')}
          onBack={() => setCurrentStep('eligibility')}
        />
      )}

      {/* STEP 5: PERSONAL DETAILS (STEP 1 OF 6) */}
      {currentStep === 'personal' && (
        <LoanPersonalDetailsStep
          appState={appState}
          onUpdatePersonal={(personal) => setAppState(prev => ({ ...prev, personal }))}
          onContinue={() => setCurrentStep('employment')}
          onBack={() => setCurrentStep('amount_tenure')}
        />
      )}

      {/* STEP 6: EMPLOYMENT & INCOME (STEP 2 OF 6) */}
      {currentStep === 'employment' && (
        <LoanEmploymentStep
          appState={appState}
          onUpdateEmployment={(employment) => setAppState(prev => ({ ...prev, employment }))}
          onContinue={() => setCurrentStep('documents')}
          onBack={() => setCurrentStep('personal')}
        />
      )}

      {/* STEP 7: DOCUMENT UPLOAD (STEP 3 OF 6) */}
      {currentStep === 'documents' && (
        <LoanDocumentUploadStep
          appState={appState}
          onUpdateDocuments={(documents) => setAppState(prev => ({ ...prev, documents }))}
          onContinue={() => setCurrentStep('review')}
          onBack={() => setCurrentStep('employment')}
        />
      )}

      {/* STEP 8: APPLICATION REVIEW (STEP 4 OF 6) */}
      {currentStep === 'review' && (
        <LoanReviewStep
          appState={appState}
          onEditSection={(sec) => {
            if (sec === 'type') setCurrentStep('type');
            else if (sec === 'amount') setCurrentStep('amount_tenure');
            else if (sec === 'personal') setCurrentStep('personal');
            else if (sec === 'employment') setCurrentStep('employment');
            else if (sec === 'documents') setCurrentStep('documents');
          }}
          onContinue={() => setCurrentStep('auth')}
          onBack={() => setCurrentStep('documents')}
        />
      )}

      {/* STEP 9: AUTHENTICATION (STEP 5 OF 6) */}
      {currentStep === 'auth' && (
        <LoanAuthStep
          appState={appState}
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setCurrentStep('review')}
        />
      )}

      {/* STEP 10: APPLICATION SUBMITTED (STEP 6 OF 6) */}
      {currentStep === 'submitted' && (
        <LoanSubmittedStep
          appState={appState}
          onTrackApplication={() => setCurrentStep('status_tracker')}
          onBackToLoans={() => setCurrentStep('home')}
        />
      )}

      {/* STEP 11: STATUS TRACKER TIMELINE */}
      {currentStep === 'status_tracker' && (
        <LoanStatusTrackerStep
          appState={appState}
          onProceedToApproval={() => setCurrentStep('approval')}
          onBackToLoans={() => setCurrentStep('home')}
        />
      )}

      {/* STEP 12: SANCTION APPROVAL */}
      {currentStep === 'approval' && (
        <LoanApprovalStep
          appState={appState}
          onViewAgreement={() => setCurrentStep('agreement')}
          onBack={() => setCurrentStep('status_tracker')}
        />
      )}

      {/* STEP 13: LOAN AGREEMENT */}
      {currentStep === 'agreement' && (
        <LoanAgreementStep
          appState={appState}
          onContinueToESign={() => setCurrentStep('esign')}
          onBack={() => setCurrentStep('approval')}
        />
      )}

      {/* STEP 14: E-SIGN */}
      {currentStep === 'esign' && (
        <LoanESignStep
          appState={appState}
          onSignComplete={handleESignComplete}
          onBack={() => setCurrentStep('agreement')}
        />
      )}

      {/* STEP 15: DISBURSEMENT */}
      {currentStep === 'disbursement' && (
        <LoanDisbursementStep
          appState={appState}
          createdLoan={createdLoan}
          onViewLoanAccount={handleFinishToLoanAccount}
        />
      )}

      {/* MODAL: Active Loan Account Details */}
      <AnimatePresence>
        {selectedLoanForDetail && (
          <LoanAccountDetailModal
            loan={selectedLoanForDetail}
            onClose={() => setSelectedLoanForDetail(null)}
          />
        )}
      </AnimatePresence>

      {/* MODAL: Loan EMI Schedule */}
      <AnimatePresence>
        {selectedLoanForSchedule && (
          <LoanEmiScheduleModal
            loan={selectedLoanForSchedule}
            onClose={() => setSelectedLoanForSchedule(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
