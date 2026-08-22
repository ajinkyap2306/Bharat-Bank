import React from 'react';
import { ChevronRight } from 'lucide-react';
import { formatPaymentDisplayDate, getTodayIso } from '../../../../../../data/corporateVendorPaymentDetailsMock';

interface PaymentDateSelectorProps {
  paymentDate: string;
  onPaymentDateChange: (iso: string) => void;
  scheduled: boolean;
}

export const PaymentDateSelector: React.FC<PaymentDateSelectorProps> = ({
  paymentDate,
  onPaymentDateChange,
  scheduled,
}) => {
  const todayIso = getTodayIso();
  const isToday = paymentDate === todayIso;
  const displayLabel = isToday
    ? `Today — ${formatPaymentDisplayDate(paymentDate)}`
    : formatPaymentDisplayDate(paymentDate);

  if (scheduled) return null;

  return (
    <section className="px-4" aria-labelledby="payment-date-label">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <p id="payment-date-label" className="text-[14px] font-semibold text-slate-900 dark:text-white mb-3">
          Payment Date
        </p>

        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => onPaymentDateChange(todayIso)}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold min-h-11 border ${
              isToday
                ? 'bg-congress-blue-700 text-white border-congress-blue-700'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              onPaymentDateChange(tomorrow.toISOString().slice(0, 10));
            }}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold min-h-11 border ${
              !isToday
                ? 'bg-congress-blue-700 text-white border-congress-blue-700'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            Future Date
          </button>
        </div>

        <label className="flex items-center justify-between gap-3 min-h-11">
          <span className="text-[14px] text-slate-900 dark:text-white">{displayLabel}</span>
          <input
            type="date"
            value={paymentDate}
            min={todayIso}
            onChange={(e) => onPaymentDateChange(e.target.value)}
            className="sr-only"
            id="payment-date-picker"
          />
          <label
            htmlFor="payment-date-picker"
            className="flex items-center gap-1 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 cursor-pointer min-h-11 px-2"
          >
            Change
            <ChevronRight className="w-4 h-4" aria-hidden />
          </label>
        </label>
      </div>
    </section>
  );
};
