import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Filter, 
  IndianRupee, 
  FileSpreadsheet 
} from 'lucide-react';
import { LoanAccount, EmiScheduleItem } from '../../../types/banking';
import { generateEmiSchedule } from './LoanFlowData';

interface LoanEmiScheduleModalProps {
  loan: LoanAccount;
  onClose: () => void;
  onPayEmi?: (loanId: string, amount: number) => void;
}

export const LoanEmiScheduleModal: React.FC<LoanEmiScheduleModalProps> = ({
  loan,
  onClose,
  onPayEmi
}) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'upcoming'>('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate or use schedule
  const schedule: EmiScheduleItem[] = loan.emiSchedule && loan.emiSchedule.length > 0
    ? loan.emiSchedule
    : generateEmiSchedule(
        loan.sanctionedAmount,
        loan.interestRate,
        loan.totalTenureMonths,
        Math.max(0, loan.totalTenureMonths - loan.tenureRemainingMonths)
      );

  const filtered = schedule.filter(item => {
    if (filter === 'paid') return item.status === 'paid';
    if (filter === 'upcoming') return item.status === 'upcoming' || item.status === 'overdue';
    return true;
  });

  const totalPaid = schedule.filter(s => s.status === 'paid').length;
  const totalUpcoming = schedule.filter(s => s.status !== 'paid').length;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Repayment & Amortization Schedule
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {loan.type} • {loan.loanNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Summary Banner */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Monthly EMI</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400">
              ₹{loan.emiAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Paid EMIs</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalPaid} / {schedule.length}
            </span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block">Remaining</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {totalUpcoming} Months
            </span>
          </div>
        </div>

        {/* Filter Pills & Export */}
        <div className="p-3.5 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['all', 'upcoming', 'paid'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab === 'all' ? `All (${schedule.length})` : tab === 'upcoming' ? `Upcoming (${totalUpcoming})` : `Paid (${totalPaid})`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export PDF'}</span>
          </button>
        </div>

        {/* Table / List Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[420px] scrollbar-thin">
          {filtered.map((item) => {
            const isPaid = item.status === 'paid';
            const isUpcoming = item.status === 'upcoming';
            const isOverdue = item.status === 'overdue';

            return (
              <div
                key={item.emiNumber}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  isPaid
                    ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    #{item.emiNumber}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        Due: {item.dueDate}
                      </h5>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isPaid
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            : isOverdue
                            ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                      <span>Principal: ₹{item.principal.toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span>Interest: ₹{item.interest.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                    ₹{item.emiAmount.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Bal: ₹{item.remainingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
          >
            Close Schedule
          </button>
        </div>
      </motion.div>
    </div>
  );
};
