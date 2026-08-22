import React from 'react';
import { SendHorizontal, ArrowLeftRight, Calendar, FileStack, Search, Bell } from 'lucide-react';
import { MenuPayRow } from '../shared/CorporatePaymentsUI';

interface PaymentsHomeScreenProps {
  onNavigate: (screen: string) => void;
  onStartPayment: (type?: string) => void;
  pendingCount: number;
}

export const PaymentsHomeScreen: React.FC<PaymentsHomeScreenProps> = ({
  onNavigate,
  onStartPayment,
  pendingCount,
}) => (
  <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-4">
    <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 px-3 py-3 safe-top">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Payments & Transfers</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Corporate treasury operations</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onNavigate('history')} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
          <button type="button" className="relative w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center">
            <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            {pendingCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>

    <div className="pt-3 space-y-4">
      {pendingCount > 0 && (
        <div className="mx-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80">
          <p className="text-xs font-bold text-slate-900 dark:text-white">Approval Required</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{pendingCount} payments require your attention.</p>
          <button type="button" onClick={() => onNavigate('history')} className="mt-2 text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400">
            Review payments →
          </button>
        </div>
      )}

      <div className="mx-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <MenuPayRow icon={<SendHorizontal className="w-5 h-5" />} label="Make Payment" description="Create a new corporate payment" onClick={() => onStartPayment()} />
        <MenuPayRow icon={<ArrowLeftRight className="w-5 h-5" />} label="Transfer Funds" description="Internal or external transfer" onClick={() => onStartPayment('internal')} />
        <MenuPayRow icon={<Calendar className="w-5 h-5" />} label="Scheduled Payments" description="View upcoming scheduled payments" onClick={() => onNavigate('scheduled')} />
        <MenuPayRow icon={<FileStack className="w-5 h-5" />} label="Payment Templates" description="Reuse payment instructions" onClick={() => onNavigate('templates')} />
      </div>

      <div className="mx-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onNavigate('history')} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left min-h-11">
          <p className="text-xs font-bold text-slate-900 dark:text-white">Payment History</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Track all payments</p>
        </button>
        <button type="button" onClick={() => onNavigate('drafts')} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left min-h-11">
          <p className="text-xs font-bold text-slate-900 dark:text-white">Draft Payments</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Continue editing</p>
        </button>
      </div>

      <div className="mx-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Daily Payment Limit</p>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400">Used Today</span>
          <span className="font-bold text-slate-900 dark:text-white">₹1,25,00,000 / ₹5,00,00,000</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-congress-blue-700 rounded-full" style={{ width: '25%' }} />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Remaining: ₹3,75,00,000</p>
      </div>
    </div>
  </div>
);
