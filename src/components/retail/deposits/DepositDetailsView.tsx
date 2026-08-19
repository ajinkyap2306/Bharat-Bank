import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  Percent, 
  ArrowDownLeft, 
  FileText, 
  ChevronRight,
  Info,
  AlertTriangle,
  History,
  ShieldCheck,
  MoreVertical,
  Download,
  Settings
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { FixedDeposit, RecurringDeposit } from '../../../types/banking';
import { BottomSheet } from '../../common/BottomSheet';
import { SecureAuthModal } from '../../common/SecureAuthModal';

interface DepositDetailsViewProps {
  deposit: FixedDeposit | RecurringDeposit;
  type: 'FD' | 'RD';
  onClose: () => void;
}

export const DepositDetailsView: React.FC<DepositDetailsViewProps> = ({ deposit, type, onClose }) => {
  const { closeDeposit, updateMaturityInstruction, getDepositTransactions, addToast, payRdInstallment, getDefaultDebitAccount } = useBanking();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isClosureConfirmOpen, setIsClosureConfirmOpen] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [showRdPayAuth, setShowRdPayAuth] = useState(false);
  const defaultDebit = getDefaultDebitAccount();

  const transactions = getDepositTransactions(deposit.id);

  const handlePrematureClosure = () => {
    closeDeposit(deposit.id, type);
    setIsClosureConfirmOpen(false);
    onClose();
  };

  const handleUpdateInstruction = (instruction: any) => {
    if (type === 'FD') {
      updateMaturityInstruction(deposit.id, instruction);
    }
    setIsInstructionOpen(false);
  };

  const isFD = type === 'FD';
  const fd = deposit as FixedDeposit;
  const rd = deposit as RecurringDeposit;

  const handleDownloadAdvice = () => {
    const num = isFD ? fd.fdNumber : rd.rdNumber;
    addToast({
      type: 'success',
      title: 'Deposit Advice Downloaded',
      message: `${type} advice for ${num} saved as PDF.`,
    });
    setIsOptionsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Deposit Details</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">{isFD ? fd.fdNumber : rd.rdNumber}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOptionsOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Status Card */}
        <div className="p-6">
          <div className="p-6 rounded-[32px] bg-slate-900 text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {isFD ? 'Maturity Amount' : 'Estimated Maturity'}
              </p>
              <h3 className="text-3xl font-black mt-1">
                ₹{(isFD ? fd.maturityAmount : rd.estimatedMaturityAmount).toLocaleString('en-IN')}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Principal</p>
                <p className="text-sm font-bold mt-1">₹{(isFD ? fd.principalAmount : rd.totalInvested).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Returns</p>
                <p className="text-sm font-bold mt-1 text-emerald-400">
                  ₹{((isFD ? fd.maturityAmount - fd.principalAmount : rd.estimatedMaturityAmount - rd.totalInvested)).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest Rate</p>
                <p className="text-sm font-bold mt-1">{deposit.interestRate}% p.a.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tenure</p>
                <p className="text-sm font-bold mt-1">{deposit.tenureMonths} Months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Blocks */}
        <div className="px-6 space-y-4">
          <div className="flex items-center gap-4 p-5 rounded-[28px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Maturity Date</h4>
              <p className="text-xs text-slate-500 mt-0.5">{deposit.maturityDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-[28px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Linked Account</h4>
              <p className="text-xs text-slate-500 mt-0.5">{deposit.linkedAccount}</p>
            </div>
          </div>

          {isFD && fd.maturityInstruction && (
            <div 
              onClick={() => setIsInstructionOpen(true)}
              className="flex items-center gap-4 p-5 rounded-[28px] bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 shadow-sm shadow-blue-500/5 cursor-pointer hover:bg-blue-50/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Maturity Instruction</h4>
                <p className="text-xs text-blue-600 font-bold mt-0.5">{fd.maturityInstruction}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          )}

          {!isFD && (
            <div className="flex items-center gap-4 p-5 rounded-[28px] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Next RD Installment</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ₹{rd.monthlyAmount.toLocaleString('en-IN')} due {rd.nextInstallmentDate}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="mt-8 px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">Timeline & Activity</h3>
            <button className="text-[10px] font-bold text-blue-600">Download All</button>
          </div>
          
          <div className="space-y-3">
            {transactions.map(txn => (
              <div key={txn.id} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative z-10">
                    <History className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 my-1" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{txn.description}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{txn.date}</p>
                    </div>
                    <p className={`text-xs font-bold ${txn.type === 'Interest' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {txn.type === 'Interest' ? '+' : ''}₹{txn.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-blue-600">Account Verified</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">DICGC insurance applied</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md absolute bottom-0 left-0 right-0">
        <div className="flex gap-3">
          {!isFD ? (
            <button
              type="button"
              onClick={() => setShowRdPayAuth(true)}
              className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              Pay ₹{rd.monthlyAmount.toLocaleString('en-IN')} Installment
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDownloadAdvice}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Deposit Advice
            </button>
          )}
          <button 
            onClick={() => setIsClosureConfirmOpen(true)}
            className="flex-1 py-4 bg-red-50 dark:bg-red-950/30 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Close Early
          </button>
        </div>
      </div>

      {/* Options Bottom Sheet */}
      <BottomSheet
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        title="Deposit Options"
      >
        <div className="space-y-2 p-2">
          <button type="button" onClick={handleDownloadAdvice} className="w-full p-4 flex items-center gap-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Download Certificate</p>
              <p className="text-[10px] text-slate-500">Official FD/RD advice (PDF)</p>
            </div>
          </button>
          <button className="w-full p-4 flex items-center gap-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900 dark:text-white">Form 15G/H</p>
              <p className="text-[10px] text-slate-500">Tax exemption declaration</p>
            </div>
          </button>
          {isFD && (
            <button 
              onClick={() => { setIsOptionsOpen(false); setIsInstructionOpen(true); }}
              className="w-full p-4 flex items-center gap-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Maturity Instructions</p>
                <p className="text-[10px] text-slate-500">Change renewal preferences</p>
              </div>
            </button>
          )}
        </div>
      </BottomSheet>

      {/* Closure Confirmation */}
      <BottomSheet
        isOpen={isClosureConfirmOpen}
        onClose={() => setIsClosureConfirmOpen(false)}
        title="Confirm Premature Closure"
      >
        <div className="p-4 space-y-6">
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400">Important Penalty Notice</h4>
              <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed">
                Closing your deposit before the maturity date will attract a penalty of <span className="font-bold">1%</span> on the effective interest rate.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Principal Amount</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{(isFD ? fd.principalAmount : rd.totalInvested).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Interest Accrued</span>
              <span className="font-bold text-emerald-600">₹{Math.round((isFD ? fd.maturityAmount - fd.principalAmount : rd.estimatedMaturityAmount - rd.totalInvested) * 0.4).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Closure Penalty</span>
              <span className="font-bold text-red-500">-₹2,500</span>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="font-extrabold text-slate-900 dark:text-white">Net Credit Amount</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">₹{Math.round((isFD ? fd.principalAmount : rd.totalInvested) + 12500).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => setIsClosureConfirmOpen(false)}
              className="py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl"
            >
              Cancel
            </button>
            <button 
              onClick={handlePrematureClosure}
              className="py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 dark:shadow-none"
            >
              Confirm Closure
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Instruction Bottom Sheet */}
      <BottomSheet
        isOpen={isInstructionOpen}
        onClose={() => setIsInstructionOpen(false)}
        title="Update Maturity Instruction"
      >
        <div className="p-4 space-y-4">
          {[
            { id: 'Renew Principal + Interest', title: 'Renew Principal + Interest', desc: 'Roll over the entire amount into a new FD.' },
            { id: 'Renew Principal Only', title: 'Renew Principal Only', desc: 'Credit interest to account and roll over principal.' },
            { id: 'Transfer to Account', title: 'Payout Full Amount', desc: 'Credit principal and interest to your linked account.' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => handleUpdateInstruction(opt.id)}
              className={`w-full p-5 rounded-[28px] border-2 text-left transition-all ${
                isFD && fd.maturityInstruction === opt.id 
                  ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/20' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{opt.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </BottomSheet>

      <SecureAuthModal
        isOpen={showRdPayAuth}
        onClose={() => setShowRdPayAuth(false)}
        onSuccess={() => {
          payRdInstallment(rd.id, defaultDebit.id);
          setShowRdPayAuth(false);
        }}
        title="Authenticate RD installment"
      />
    </div>
  );
};
