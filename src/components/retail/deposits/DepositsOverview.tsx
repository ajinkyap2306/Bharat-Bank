import React from 'react';
import { motion } from 'motion/react';
import { 
  PiggyBank, 
  Plus, 
  ArrowRight, 
  TrendingUp,
  Percent,
  Calendar,
  Wallet,
  ChevronRight
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';

interface DepositsOverviewProps {
  onOpenDeposit: (type: 'FD' | 'RD') => void;
  onViewDetails: (deposit: any, type: 'FD' | 'RD') => void;
}

export const DepositsOverview: React.FC<DepositsOverviewProps> = ({ onOpenDeposit, onViewDetails }) => {
  const { fixedDeposits, recurringDeposits } = useBanking();

  const activeFDs = fixedDeposits.filter(f => f.status === 'active');
  const activeRDs = recurringDeposits.filter(r => r.status === 'active');

  const totalInvested = activeFDs.reduce((sum, f) => sum + f.principalAmount, 0) + 
                       activeRDs.reduce((sum, r) => sum + r.totalInvested, 0);
  
  const totalMaturity = activeFDs.reduce((sum, f) => sum + f.maturityAmount, 0) + 
                        activeRDs.reduce((sum, r) => sum + r.estimatedMaturityAmount, 0);

  const totalInterest = totalMaturity - totalInvested;

  return (
    <div className="space-y-6 pb-20">
      {/* Portfolio Summary Card */}
      <div className="p-6 rounded-[32px] bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full -ml-12 -mb-12 blur-2xl" />
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Deposit Portfolio</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">₹{totalMaturity.toLocaleString('en-IN')}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 font-medium">Estimated Value at Maturity</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">+{((totalInterest / totalInvested) * 100 || 0).toFixed(2)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Invested</p>
              <p className="text-sm font-bold text-slate-200 mt-0.5">₹{totalInvested.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Interest Earned</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">₹{totalInterest.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onOpenDeposit('FD')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Open FD</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Up to 7.75% p.a.</p>
        </button>

        <button 
          onClick={() => onOpenDeposit('RD')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Open RD</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Start from ₹500</p>
        </button>
      </div>

      {/* My Deposits List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deposits</h3>
          <button className="text-[10px] font-bold text-blue-600">View All</button>
        </div>

        <div className="space-y-3">
          {activeFDs.length === 0 && activeRDs.length === 0 && (
            <div className="p-8 rounded-[32px] bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <PiggyBank className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No active deposits</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Grow your savings with guaranteed high returns.</p>
            </div>
          )}

          {activeFDs.map(fd => (
            <motion.div
              key={fd.id}
              whileHover={{ scale: 0.99 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onViewDetails(fd, 'FD')}
              className="p-5 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Fixed Deposit</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{fd.fdNumber}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full mb-1">
                    Active
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{fd.interestRate}% p.a.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Principal</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{fd.principalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Maturity Value</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{fd.maturityAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>Matures: {fd.maturityDate}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}

          {activeRDs.map(rd => (
            <motion.div
              key={rd.id}
              whileHover={{ scale: 0.99 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onViewDetails(rd, 'RD')}
              className="p-5 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Recurring Deposit</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{rd.rdNumber}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full mb-1">
                    Active
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{rd.interestRate}% p.a.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Monthly</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{rd.monthlyAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Invested</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{rd.totalInvested.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>Next: {rd.nextInstallmentDate}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
