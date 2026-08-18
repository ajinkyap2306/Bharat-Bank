import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  ScrollText, 
  Info 
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';

interface LoanAgreementStepProps {
  appState: LoanApplicationState;
  onContinueToESign: () => void;
  onBack: () => void;
}

export const LoanAgreementStep: React.FC<LoanAgreementStepProps> = ({
  appState,
  onContinueToESign,
  onBack
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
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
            Legal Agreement
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Digital Loan Agreement
          </h2>
        </div>
      </div>

      {/* Agreement Actions Bar */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
        <div className="flex items-center gap-2.5">
          <ScrollText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Master Facility Agreement
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">
              DOC-APX-LA-{appState.applicationId.slice(-5)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
        </button>
      </div>

      {/* Contract Viewer Box */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 max-h-[360px] overflow-y-auto text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans scrollbar-thin">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            BHARAT CO-OPERATIVE BANK (MUMBAI) LTD — RETAIL LOAN CONTRACT
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            This digital contract is executed between Bharat Co-operative Bank (Mumbai) Ltd ("Lender") and {appState.personal.fullName} ("Borrower").
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
              1. SANCTIONED CREDIT FACILITY
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              The Lender hereby sanctions a <strong>{appState.loanType}</strong> facility of <strong>₹{appState.requestedAmount.toLocaleString('en-IN')}</strong> (Rupees {appState.requestedAmount.toLocaleString('en-IN')} only) for a tenure of <strong>{appState.tenureMonths} calendar months</strong> at an annualized fixed interest rate of <strong>{appState.interestRate}% p.a.</strong>
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
              2. REPAYMENT & AUTO-DEBIT (e-NACH MANDATE)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              The Borrower covenants to repay the loan facility in <strong>{appState.tenureMonths} equated monthly installments (EMIs) of ₹{appState.calculatedEmi.toLocaleString('en-IN')}</strong> payable on the 5th day of each successive calendar month through automated electronic standing instruction.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
              3. PREPAYMENT & FORECLOSURE TERMS
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Zero prepayment or foreclosure penalty shall be levied if full or part prepayment is effected after the completion of six (6) regular monthly EMIs from the date of initial disbursement.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
              4. DISBURSEMENT DESTINATION
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Net proceeds amounting to <strong>₹{(appState.requestedAmount - appState.processingFee).toLocaleString('en-IN')}</strong> shall be credited directly to the Borrower's Primary Savings Account (•••• 0012) via instantaneous RTGS upon execution of the electronic signature.
            </p>
          </div>
        </div>
      </div>

      {/* Security badge */}
      <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-100 dark:border-emerald-900/60">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Compliant with Information Technology Act, 2000 & RBI Digital Lending Guidelines.</span>
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
          onClick={onContinueToESign}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>Continue to e-Sign</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
