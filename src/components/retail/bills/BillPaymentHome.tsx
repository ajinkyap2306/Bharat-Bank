import React from 'react';
import {
  Search, HelpCircle, Bell, History, Plus, Landmark,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { BILL_CATEGORIES } from '../../../data/billsMockData';
import { BillScreen } from './billTypes';
import { BillCard, BillStatusBadge, getCategoryIcon } from './shared/BillUI';
import { BillCategory } from '../../../types/bills';

interface BillPaymentHomeProps {
  onNavigate: (screen: BillScreen, params?: Record<string, string>) => void;
  onStartPay: (params: { category?: BillCategory; providerId?: string; savedBillerId?: string }) => void;
}

export const BillPaymentHome: React.FC<BillPaymentHomeProps> = ({ onNavigate, onStartPay }) => {
  const { upcomingBills, billers, billPaymentHistory, addToast } = useBanking();

  const reminders = upcomingBills.filter((b) => b.dueLabel.includes('tomorrow') || b.dueLabel.includes('2 days') || b.dueLabel.includes('3 days'));

  return (
    <div className="pt-1 pb-24 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Bill Payments</h1>
          <p className="text-[11px] text-slate-500">BBPS certified • 20,000+ billers</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-slate-600" />
          </button>
          <button
            type="button"
            onClick={() => addToast({ type: 'info', title: 'Help', message: 'Call 1800-202-APEX for bill payment support.' })}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center"
          >
            <HelpCircle className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Reminders */}
      {reminders.length > 0 && (
        <div className="space-y-2">
          {reminders.slice(0, 2).map((r) => (
            <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
              <Bell className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                {r.billerName} — {r.dueLabel}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Bills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Bills</h2>
        </div>
        {upcomingBills.length === 0 ? (
          <BillCard className="text-center py-6">
            <p className="text-sm text-slate-500">No upcoming bills</p>
          </BillCard>
        ) : (
          upcomingBills.map((bill) => (
            <BillCard key={bill.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/50 text-congress-blue-700 flex items-center justify-center shrink-0">
                    {getCategoryIcon(bill.category)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{bill.billerName}</p>
                    <p className="text-xs text-slate-500">{bill.dueLabel}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹{bill.amount.toLocaleString('en-IN')}</p>
                  <button
                    type="button"
                    onClick={() => onStartPay({ providerId: bill.providerId, savedBillerId: bill.savedBillerId, category: bill.category })}
                    className="text-xs font-bold text-congress-blue-600 mt-1"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </BillCard>
          ))
        )}
      </div>

      {/* Saved Billers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Billers</h2>
          <button type="button" onClick={() => onNavigate('saved-billers')} className="text-xs font-bold text-congress-blue-600">View All</button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {billers.slice(0, 4).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onStartPay({ savedBillerId: b.id, providerId: b.providerId, category: b.category })}
              className="shrink-0 w-24 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mx-auto mb-1.5">
                {getCategoryIcon(b.category, 'w-4 h-4')}
              </div>
              <p className="text-[10px] font-bold text-slate-800 dark:text-white truncate">{b.nickname || b.name}</p>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onNavigate('add-biller')}
            className="shrink-0 w-24 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-1.5">
              <Plus className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[10px] font-bold text-slate-500">Add</p>
          </button>
        </div>
      </div>

      {/* Tax Payment */}
      <button
        type="button"
        onClick={() => onNavigate('tax-payment')}
        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md active:scale-[0.99] transition-transform"
      >
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Landmark className="w-5 h-5" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-bold">Tax Payment Online</p>
          <p className="text-[11px] text-blue-100">Income tax, GST, TDS & challan</p>
        </div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Pay</span>
      </button>

      {/* Categories Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Categories</h2>
        <div className="grid grid-cols-4 gap-2">
          {BILL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => cat.id === 'more' ? onNavigate('search') : onStartPay({ category: cat.id as BillCategory })}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 active:scale-95 transition-transform min-h-18"
            >
              <div className="w-10 h-10 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/50 text-congress-blue-700 flex items-center justify-center">
                {getCategoryIcon(cat.id as BillCategory, 'w-5 h-5')}
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Payments</h2>
          <button type="button" onClick={() => onNavigate('history')} className="text-xs font-bold text-congress-blue-600 flex items-center gap-0.5">
            <History className="w-3.5 h-3.5" /> History
          </button>
        </div>
        <BillCard className="p-0! overflow-hidden">
          {billPaymentHistory.slice(0, 3).map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onNavigate('history-detail', { paymentId: p.id })}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-slate-50 dark:active:bg-slate-800/50 ${
                i > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getCategoryIcon(p.category, 'w-4 h-4')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.billerName}</p>
                  <p className="text-[11px] text-slate-500">{p.paymentDate}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold">₹{p.amount.toLocaleString('en-IN')}</p>
                <BillStatusBadge status={p.status} />
              </div>
            </button>
          ))}
        </BillCard>
      </div>
    </div>
  );
};
