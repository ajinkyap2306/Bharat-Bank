import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Edit3, 
  CheckCircle2, 
  User, 
  Briefcase, 
  FileText, 
  Landmark, 
  ShieldCheck, 
  Clock, 
  Lock 
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';

interface LoanReviewStepProps {
  appState: LoanApplicationState;
  onEditSection: (section: 'type' | 'amount' | 'personal' | 'employment' | 'documents') => void;
  onContinue: () => void;
  onBack: () => void;
}

export const LoanReviewStep: React.FC<LoanReviewStepProps> = ({
  appState,
  onEditSection,
  onContinue,
  onBack
}) => {
  const [agreed, setAgreed] = useState<boolean>(true);

  return (
    <div className="space-y-5 pb-28">
      {/* Header & Step Indicator */}
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
            Step 4 of 6: Final Review
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Review Application
          </h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div className="bg-blue-600 h-full w-4/6 rounded-full transition-all duration-300" />
      </div>

      {/* SECTION 1: LOAN CONFIGURATION */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Loan Terms & Repayment
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditSection('amount')}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Loan Product</span>
            <span className="font-bold text-slate-900 dark:text-white">{appState.loanType}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Sanction Amount</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400">
              ₹{appState.requestedAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Tenure</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {appState.tenureMonths / 12} Years ({appState.tenureMonths} Months)
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Interest Rate</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {appState.interestRate}% p.a.
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Estimated Monthly EMI</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              ₹{appState.calculatedEmi.toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-medium">/mo</span>
            </span>
          </div>
          <div className="text-right text-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Processing Fee</span>
            <span className="font-bold text-slate-900 dark:text-white">
              ₹{appState.processingFee.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: APPLICANT PERSONAL INFO */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Applicant Information
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditSection('personal')}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Full Name</span>
            <span className="font-bold text-slate-900 dark:text-white">{appState.personal.fullName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Mobile & Email</span>
            <span className="font-medium text-slate-900 dark:text-white">{appState.personal.mobile}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Verified KYC (PAN / Aadhaar)</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              ABCPS••••F | •••• 8912
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Address</span>
            <span className="font-medium text-slate-900 dark:text-white text-right max-w-[200px] truncate">
              {appState.personal.addressLine1}, {appState.personal.city} ({appState.personal.pincode})
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: EMPLOYMENT & INCOME */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Employment & Income
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditSection('employment')}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Employer</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">{appState.employment.employerName}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Designation</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">{appState.employment.designation}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Net Monthly Salary</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{appState.employment.monthlyNetIncome.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Salary Bank</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">{appState.employment.salaryBank}</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: DOCUMENTS VERIFICATION STATUS */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              4. Attached Documents
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditSection('documents')}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          {appState.documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[220px]">
                {doc.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Declaration Checkbox */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
        <input
          type="checkbox"
          id="loan-declare"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer"
        />
        <label htmlFor="loan-declare" className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer">
          <strong>I confirm that the information provided is correct.</strong> I authorize Bharat Co-operative Bank to pull my credit information report from CIBIL/Experian and verify my identity through UIDAI/DigiLocker.
        </label>
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
          disabled={!agreed}
          onClick={onContinue}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <span>Submit Application</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
