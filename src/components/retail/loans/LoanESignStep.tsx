import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  PenTool, 
  ShieldCheck, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  FileCheck2 
} from 'lucide-react';
import { LoanApplicationState } from './LoanFlowData';

interface LoanESignStepProps {
  appState: LoanApplicationState;
  onSignComplete: () => void;
  onBack: () => void;
}

export const LoanESignStep: React.FC<LoanESignStepProps> = ({
  appState,
  onSignComplete,
  onBack
}) => {
  const [eSignOtp, setESignOtp] = useState('894120');
  const [isAadhaarChecked, setIsAadhaarChecked] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'aadhaar' | 'draw'>('aadhaar');

  const handleSignAgreement = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      onSignComplete();
    }, 1500);
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
            Electronic Execution
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Review & Sign Agreement
          </h2>
        </div>
      </div>

      {/* Hero Signing Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Aadhaar e-Sign Gateway (CDAC / NSDL)
            </h3>
            <p className="text-xs text-slate-400">
              Legally binding digital signature under IT Act Sec 3A.
            </p>
          </div>
        </div>

        {/* Digital Signature Certificate Stamp Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Digital Signatory</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              UIDAI Validated
            </span>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {appState.personal.fullName}
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              Aadhaar No: •••• •••• 8912 | PAN: ABCPS••••F
            </p>
            <p className="text-[10px] text-slate-400">
              Timestamp: 17 Aug 2026, 10:20:45 IST
            </p>
          </div>
        </div>

        {/* Aadhaar OTP Input */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Enter Aadhaar OTP sent to +91 98765•••••
          </label>

          <div className="relative">
            <input
              type="text"
              maxLength={6}
              value={eSignOtp}
              onChange={(e) => setESignOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base font-extrabold font-mono tracking-widest text-center focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
            <span className="absolute right-3 top-3 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-md">
              Valid OTP
            </span>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-2.5 pt-2">
          <input
            type="checkbox"
            id="esign-check"
            checked={isAadhaarChecked}
            onChange={(e) => setIsAadhaarChecked(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-blue-600 rounded cursor-pointer"
          />
          <label htmlFor="esign-check" className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight cursor-pointer">
            I hereby authenticate and affix my Aadhaar e-Sign to the Loan Sanction Agreement with Bharat Co-operative Bank.
          </label>
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
          disabled={!isAadhaarChecked || eSignOtp.length < 6 || isSigning}
          onClick={handleSignAgreement}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isSigning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Affixing e-Signature...</span>
            </>
          ) : (
            <>
              <PenTool className="w-4 h-4" />
              <span>Sign Agreement</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
