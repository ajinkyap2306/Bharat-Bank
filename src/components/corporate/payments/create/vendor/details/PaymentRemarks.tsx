import React from 'react';

interface PaymentRemarksProps {
  value: string;
  onChange: (value: string) => void;
}

export const PaymentRemarks: React.FC<PaymentRemarksProps> = ({ value, onChange }) => (
  <section className="px-4" aria-labelledby="payment-remarks-label">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <label id="payment-remarks-label" htmlFor="payment-remarks" className="text-[14px] font-semibold text-slate-900 dark:text-white">
        Remarks
      </label>
      <textarea
        id="payment-remarks"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 250))}
        placeholder="Add internal payment remarks"
        maxLength={250}
        rows={3}
        className="mt-2 w-full text-[14px] text-slate-900 dark:text-white bg-transparent outline-none resize-none placeholder:text-slate-500 dark:text-slate-400 min-h-[88px]"
      />
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
        Internal note for your corporate records.
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">{value.length}/250</p>
    </div>
  </section>
);
