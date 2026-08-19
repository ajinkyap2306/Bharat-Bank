import React from 'react';
import { formatPaymentDisplayDate } from '../../../../../../data/corporateVendorPaymentDetailsMock';

interface SchedulePaymentToggleProps {
  scheduled: boolean;
  executionDate: string;
  repeatPayment: boolean;
  onScheduledChange: (scheduled: boolean) => void;
  onExecutionDateChange: (iso: string) => void;
  onRepeatChange: (repeat: boolean) => void;
}

export const SchedulePaymentToggle: React.FC<SchedulePaymentToggleProps> = ({
  scheduled,
  executionDate,
  repeatPayment,
  onScheduledChange,
  onExecutionDateChange,
  onRepeatChange,
}) => (
  <section className="px-4" aria-labelledby="schedule-payment-label">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 min-h-11">
        <div className="min-w-0">
          <p id="schedule-payment-label" className="text-[14px] font-semibold text-[#111827] dark:text-white">
            Schedule this payment
          </p>
          <p className="text-[12px] text-[#667085] mt-1">
            Process this payment on a future date.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={scheduled}
          onClick={() => onScheduledChange(!scheduled)}
          className={`relative w-12 h-7 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] ${
            scheduled ? 'bg-[#0B5CAB]' : 'bg-[#E4E7EC] dark:bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
              scheduled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {scheduled && (
        <div className="mt-4 pt-4 border-t border-[#E4E7EC] dark:border-slate-800 space-y-4">
          <div>
            <label htmlFor="execution-date" className="text-[13px] font-semibold text-[#111827] dark:text-white">
              Execution Date
            </label>
            <input
              id="execution-date"
              type="date"
              value={executionDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => onExecutionDateChange(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E4E7EC] dark:border-slate-800 px-3 py-2.5 text-[14px] min-h-11 bg-white dark:bg-slate-900"
            />
            <p className="text-[12px] text-[#667085] mt-1">
              {formatPaymentDisplayDate(executionDate)}
            </p>
          </div>

          <label className="flex items-center gap-3 min-h-11">
            <input
              type="checkbox"
              checked={repeatPayment}
              onChange={(e) => onRepeatChange(e.target.checked)}
              className="w-4 h-4 accent-[#0B5CAB]"
            />
            <span className="text-[14px] text-[#111827] dark:text-white">Repeat payment</span>
          </label>
        </div>
      )}
    </div>
  </section>
);
