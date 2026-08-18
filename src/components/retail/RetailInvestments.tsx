import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Calendar, 
  Star, 
  CheckCircle2, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { InvestmentItem } from '../../types/banking';

export const RetailInvestments: React.FC = () => {
  const { investments, createSIP, addToast, setBottomNavHidden } = useBanking();
  const [selectedFund, setSelectedFund] = useState<InvestmentItem | null>(null);
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipDate, setSipDate] = useState(10);
  const [isSettingSIP, setIsSettingSIP] = useState(false);

  // Bottom Navigation visibility: HIDDEN during SIP Investment Setup modal
  useEffect(() => {
    if (selectedFund) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [selectedFund, setBottomNavHidden]);

  const totalInvested = investments.reduce((sum, i) => sum + i.investedAmount, 0);
  const totalCurrentValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const overallReturns = totalCurrentValue - totalInvested;
  const returnPercentage = ((overallReturns / totalInvested) * 100).toFixed(2);

  const handleStartSIP = () => {
    if (!selectedFund) return;
    setIsSettingSIP(true);
    setTimeout(() => {
      setIsSettingSIP(false);
      createSIP(selectedFund.id, sipAmount, sipDate);
      setSelectedFund(null);
    }, 1000);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Portfolio Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-tr from-teal-700 via-emerald-700 to-teal-800 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
            Bharat Wealth Portfolio
          </span>
          <span className="text-xs font-extrabold text-emerald-200 flex items-center gap-0.5">
            <ArrowUpRight className="w-4 h-4" /> +{returnPercentage}% All-Time
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-teal-100">Total Portfolio Value</p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            ₹{totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20 text-xs">
          <div>
            <span className="text-teal-200 text-[10px]">Invested Amount</span>
            <p className="font-bold text-white">₹{totalInvested.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <span className="text-teal-200 text-[10px]">Total Profits / Gains</span>
            <p className="font-bold text-emerald-300">+₹{overallReturns.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Your Mutual Fund Holdings ({investments.length})
          </h4>
        </div>

        <div className="space-y-3">
          {investments.map((fund) => (
            <div
              key={fund.id}
              onClick={() => setSelectedFund(fund)}
              className="p-4.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/50 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold uppercase bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full">
                      {fund.category}
                    </span>
                    <div className="flex text-amber-400 text-[10px]">
                      {Array.from({ length: fund.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {fund.fundName}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    NAV: ₹{fund.nav} • Units: {fund.units.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{fund.returnsPercentage}%
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    ₹{fund.currentValue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {fund.sipAmount && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Active Monthly SIP: <strong className="text-slate-800 dark:text-slate-200">₹{fund.sipAmount.toLocaleString('en-IN')}</strong></span>
                  <span>Debit on: <strong>{fund.sipDate}th of month</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Start / Modify SIP Sheet */}
      {selectedFund && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600">
                Systematic Investment Plan (SIP)
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                {selectedFund.fundName}
              </h3>
            </div>

            <div className="py-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly SIP Amount</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{sipAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Monthly Auto-Debit Date
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                  {[5, 10, 15, 25].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSipDate(d)}
                      className={`py-2 rounded-xl border transition-all ${
                        sipDate === d
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {d}th
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setSelectedFund(null)}
                className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleStartSIP}
                disabled={isSettingSIP}
                className="py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
              >
                {isSettingSIP ? 'Configuring SIP...' : 'Confirm Monthly SIP'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
