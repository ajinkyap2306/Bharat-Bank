import React from 'react';

interface PaymentReferenceInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PaymentReferenceInput: React.FC<PaymentReferenceInputProps> = ({
  value,
  onChange,
}) => (
  <section className="px-4" aria-labelledby="payment-reference-label">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <label id="payment-reference-label" htmlFor="payment-reference" className="text-[14px] font-semibold text-slate-900 dark:text-white">
        Payment Reference
      </label>
      <input
        id="payment-reference"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 100))}
        placeholder="Add payment reference"
        maxLength={100}
        className="mt-2 w-full text-[14px] text-slate-900 dark:text-white bg-transparent outline-none min-h-11 placeholder:text-slate-500 dark:text-slate-400"
      />
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
        This reference will appear in transaction records.
      </p>
    </div>
  </section>
);
