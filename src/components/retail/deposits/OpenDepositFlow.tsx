import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  PiggyBank, 
  TrendingUp, 
  Calendar, 
  Wallet,
  CheckCircle2,
  ShieldCheck,
  Info,
  Clock,
  ArrowRight,
  Percent
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { getJointStatusLabel, requiresJointApproval, canUserInitiateJointTransaction } from '../../../data/retailJointTransferMock';
import type { JointTransferRequest } from '../../../types/retailJointTransfer';

interface OpenDepositFlowProps {
  type: 'FD' | 'RD';
  onClose: () => void;
}

type Step = 'intro' | 'configure' | 'payout' | 'account' | 'review' | 'submitted' | 'success';

export const OpenDepositFlow: React.FC<OpenDepositFlowProps> = ({ type, onClose }) => {
  const { accounts, createFixedDeposit, createRecurringDeposit, addToast, getDefaultDebitAccount, submitJointApprovalRequest, retailActiveUserId } = useBanking();
  const defaultDebit = getDefaultDebitAccount();
  const [step, setStep] = useState<Step>('intro');
  const [amount, setAmount] = useState(type === 'FD' ? 100000 : 10000);
  const [tenure, setTenure] = useState(type === 'FD' ? 12 : 24);
  const [payout, setPayout] = useState<'Monthly' | 'Quarterly' | 'On Maturity'>('On Maturity');
  const [maturityInstruction, setMaturityInstruction] = useState<'Renew Principal + Interest' | 'Renew Principal Only' | 'Transfer to Account'>('Renew Principal + Interest');
  const [selectedAccountId, setSelectedAccountId] = useState(defaultDebit.id);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<JointTransferRequest | null>(null);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const needsApproval = requiresJointApproval(selectedAccount);
  
  const interestRate = useMemo(() => {
    if (type === 'FD') return tenure >= 18 ? 7.75 : 7.25;
    return 6.75;
  }, [type, tenure]);

  const calculation = useMemo(() => {
    if (type === 'FD') {
      const interest = Math.round(amount * (interestRate / 100) * (tenure / 12));
      return {
        principal: amount,
        interest,
        maturity: amount + interest,
        rate: interestRate
      };
    } else {
      const totalInvested = amount * tenure;
      const interest = Math.round(totalInvested * (interestRate / 100) * (tenure / 24));
      return {
        principal: totalInvested,
        interest,
        maturity: totalInvested + interest,
        rate: interestRate
      };
    }
  }, [type, amount, tenure, interestRate]);

  const handleNext = () => {
    if (step === 'intro') setStep('configure');
    else if (step === 'configure') setStep(type === 'FD' ? 'payout' : 'account');
    else if (step === 'payout') setStep('account');
    else if (step === 'account') {
      if (selectedAccount && selectedAccount.availableBalance < (type === 'FD' ? amount : amount)) {
        addToast({
          type: 'error',
          title: 'Insufficient Balance',
          message: 'The selected account does not have enough balance to fund this deposit.'
        });
        return;
      }
      setStep('review');
    }
    else if (step === 'review') setIsAuthOpen(true);
  };

  const handleBack = () => {
    if (step === 'configure') setStep('intro');
    else if (step === 'payout') setStep('configure');
    else if (step === 'account') setStep(type === 'FD' ? 'payout' : 'configure');
    else if (step === 'review') setStep('account');
  };

  const handleAuthComplete = () => {
    setIsAuthOpen(false);

    if (needsApproval) {
      const req = submitJointApprovalRequest({
        requestType: type === 'FD' ? 'deposit_fd' : 'deposit_rd',
        fromAccountId: selectedAccountId,
        amount,
        beneficiaryName: type === 'FD' ? 'Fixed Deposit' : 'Recurring Deposit',
        beneficiaryBank: 'Deposits',
        beneficiaryAccountMasked: `${tenure} months · ${interestRate}% p.a.`,
        payload: {
          tenureMonths: tenure,
          ...(type === 'FD'
            ? { payout, maturityInstruction }
            : {}),
        },
      });
      if (req) {
        setSubmittedRequest(req);
        setStep('submitted');
      }
      return;
    }

    if (type === 'FD') {
      createFixedDeposit(amount, tenure, payout, maturityInstruction, selectedAccountId);
    } else {
      createRecurringDeposit(amount, tenure, selectedAccountId);
    }
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {step !== 'intro' && step !== 'success' && step !== 'submitted' && (
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {step === 'success' ? 'Deposit Created' : step === 'submitted' ? 'Sent for Approval' : `Open ${type === 'FD' ? 'Fixed' : 'Recurring'} Deposit`}
          </h2>
        </div>
        {step !== 'success' && step !== 'submitted' && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {step !== 'intro' && step !== 'success' && step !== 'submitted' && (
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: '0%' }}
            animate={{ 
              width: step === 'configure' ? '25%' : 
                     step === 'payout' ? '50%' : 
                     step === 'account' ? '75%' : '90%' 
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 rounded-4xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-8">
                {type === 'FD' ? (
                  <PiggyBank className="w-10 h-10 text-blue-600" />
                ) : (
                  <TrendingUp className="w-10 h-10 text-indigo-600" />
                )}
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {type === 'FD' ? 'Guaranteed Wealth Growth' : 'Smart Periodic Savings'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {type === 'FD' 
                    ? 'Invest a lump sum and earn higher interest with zero market risk.' 
                    : 'Save a fixed amount every month and build a substantial corpus for your goals.'}
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {[
                  { icon: Percent, title: `Earn up to ${type === 'FD' ? '7.75%' : '6.75%'} interest p.a.`, desc: 'Highest rates in the industry.' },
                  { icon: ShieldCheck, title: 'DICGC Insured', desc: 'Your deposits are safe up to ₹5 Lakh.' },
                  { icon: Clock, title: 'Flexible Tenures', desc: 'Choose from 6 months to 10 years.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'configure' && (
            <motion.div 
              key="configure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  {type === 'FD' ? 'Deposit Amount' : 'Monthly Contribution'}
                </label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400 group-focus-within:text-blue-600 transition-colors">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-950 rounded-3xl py-6 pl-12 pr-6 text-3xl font-extrabold text-slate-900 dark:text-white outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-2 px-1">
                  {[50000, 100000, 250000, 500000].map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      +₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Choose Tenure</label>
                <div className="grid grid-cols-3 gap-2">
                  {[6, 12, 18, 24, 36, 60].map(m => (
                    <button
                      key={m}
                      onClick={() => setTenure(m)}
                      className={`py-3 rounded-2xl font-bold text-xs transition-all border-2 ${
                        tenure === m 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {m < 12 ? `${m} Mo` : `${m/12} Yr`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600/70 uppercase tracking-wider">Interest Rate</span>
                  <span className="text-sm font-extrabold text-blue-700 dark:text-blue-400">{interestRate}% p.a.</span>
                </div>
                <div className="flex items-center justify-between border-t border-blue-100/30 dark:border-blue-900/30 pt-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {type === 'FD' ? 'Estimated Interest' : 'Total Interest'}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600">+₹{calculation.interest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Maturity Amount</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">₹{calculation.maturity.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payout' && (
            <motion.div 
              key="payout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Interest Payout</label>
                <div className="space-y-3">
                  {[
                    { id: 'On Maturity', title: 'Cumulative', desc: 'Interest is added to principal and paid at maturity. Maximizes returns.' },
                    { id: 'Monthly', title: 'Monthly Payout', desc: 'Get interest credited to your account every month.' },
                    { id: 'Quarterly', title: 'Quarterly Payout', desc: 'Get interest credited to your account every 3 months.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPayout(opt.id as any)}
                      className={`w-full p-5 rounded-[28px] border-2 text-left transition-all ${
                        payout === opt.id 
                          ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/20' 
                          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-sm font-bold ${payout === opt.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                          {opt.title}
                        </h4>
                        {payout === opt.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Maturity Instruction</label>
                <div className="space-y-3">
                  {[
                    { id: 'Renew Principal + Interest', title: 'Renew All', desc: 'Automatically reinvest the entire maturity amount.' },
                    { id: 'Transfer to Account', title: 'Payout All', desc: 'Credit the full amount to your linked account.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setMaturityInstruction(opt.id as any)}
                      className={`w-full p-5 rounded-[28px] border-2 text-left transition-all ${
                        maturityInstruction === opt.id 
                          ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/20' 
                          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`text-sm font-bold ${maturityInstruction === opt.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                          {opt.title}
                        </h4>
                        {maturityInstruction === opt.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'account' && (
            <motion.div 
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Debit From</label>
                {needsApproval && (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 text-xs text-slate-600 leading-relaxed">
                    Joint account selected — this deposit will be sent to the other joint holder for approval.
                  </div>
                )}
                <div className="space-y-3">
                  {accounts
                    .filter(
                      (a) =>
                        (a.accountType === 'Savings' || a.accountType === 'Current') &&
                        canUserInitiateJointTransaction(retailActiveUserId, a)
                    )
                    .map((acc) => {
                    const isJoint = requiresJointApproval(acc);
                    return (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccountId(acc.id)}
                      className={`w-full p-5 rounded-4xl border-2 text-left transition-all ${
                        selectedAccountId === acc.id 
                          ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/20' 
                          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {acc.jointAccountLabel ?? `${acc.accountType} Account`}
                            {isJoint ? ' · Jointly Operated' : ''}
                          </span>
                        </div>
                        {selectedAccountId === acc.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono tracking-wider">{acc.maskedNumber}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Available: ₹{acc.availableBalance.toLocaleString('en-IN')}</p>
                        </div>
                        <p className={`text-sm font-extrabold ${acc.availableBalance < (type === 'FD' ? amount : amount) ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                          ₹{acc.balance.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </button>
                  );})}
                </div>
              </div>

              {(selectedAccount && selectedAccount.availableBalance < (type === 'FD' ? amount : amount)) && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex gap-3">
                  <Info className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-xs text-red-600 leading-relaxed font-medium">
                    Insufficient balance in the selected account. Please select another account or add funds.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-4xl bg-slate-900 text-white space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investing</p>
                    <h3 className="text-2xl font-black mt-1">₹{amount.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    {type === 'FD' ? <PiggyBank className="w-6 h-6 text-blue-400" /> : <TrendingUp className="w-6 h-6 text-indigo-400" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tenure</p>
                    <p className="text-sm font-bold mt-1">{tenure} Months</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Interest Rate</p>
                    <p className="text-sm font-bold mt-1 text-emerald-400">{interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Interest Earned</p>
                    <p className="text-sm font-bold mt-1 text-emerald-400">₹{calculation.interest.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Maturity Value</p>
                    <p className="text-sm font-bold mt-1">₹{calculation.maturity.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Debit Account</p>
                    <p className="text-xs font-bold mt-1">{selectedAccount?.maskedNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Payout</p>
                    <p className="text-xs font-bold mt-1">{type === 'FD' ? payout : 'Monthly Contribution'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 flex gap-3 border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  {needsApproval
                    ? 'I agree to the terms. This jointly operated account requires approval from the other joint holder before the deposit is booked.'
                    : 'I agree to the terms and conditions and understand that premature withdrawal may attract a penalty as per bank policy.'}
                </p>
              </div>
            </motion.div>
          )}

          {step === 'submitted' && submittedRequest && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-600" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Sent for Approval</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Your {type === 'FD' ? 'Fixed' : 'Recurring'} Deposit request has been sent to the other joint holder.
                </p>
              </div>
              <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-5 space-y-3 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-amber-700">{getJointStatusLabel(submittedRequest.status)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Reference</span>
                  <span className="font-bold">{submittedRequest.reference}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl"
              >
                Done
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-12"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </motion.div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Deposit Confirmed!</h3>
                <p className="text-sm text-slate-500 max-w-70 mx-auto leading-relaxed">
                  Your {type === 'FD' ? 'Fixed' : 'Recurring'} Deposit has been successfully created and linked to your account.
                </p>
              </div>

              <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Maturity Date</span>
                  <span className="font-bold text-slate-900 dark:text-white">Aug 18, 2027</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Interest Rate</span>
                  <span className="font-bold text-emerald-600">{interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Maturity Value</span>
                  <span className="font-black text-slate-900 dark:text-white">₹{calculation.maturity.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Go to My Deposits <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      {step !== 'success' && step !== 'submitted' && (
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={handleNext}
            disabled={step === 'account' && selectedAccount && selectedAccount.availableBalance < (type === 'FD' ? amount : amount)}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
              step === 'account' && selectedAccount && selectedAccount.availableBalance < (type === 'FD' ? amount : amount)
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'
            }`}
          >
            {step === 'intro' ? `Start ${type} Application` : 
             step === 'review' ? (needsApproval ? 'Submit for Approval' : 'Confirm Deposit') : 'Continue'} 
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Authentication */}
      <SecureAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthComplete}
        title={needsApproval ? `Submit ${type} for Approval` : `Confirm ${type} Deposit`}
      />
    </div>
  );
};
