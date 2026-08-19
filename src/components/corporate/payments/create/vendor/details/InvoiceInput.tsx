import React from 'react';

interface InvoiceInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const InvoiceInput: React.FC<InvoiceInputProps> = ({ value, onChange }) => (
  <section className="px-4" aria-labelledby="invoice-number-label">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
      <label id="invoice-number-label" htmlFor="invoice-number" className="text-[14px] font-semibold text-[#111827] dark:text-white">
        Invoice Number
      </label>
      <input
        id="invoice-number"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 50))}
        placeholder="Enter invoice number"
        maxLength={50}
        className="mt-2 w-full text-[14px] text-[#111827] dark:text-white bg-transparent outline-none min-h-11 placeholder:text-[#667085]"
      />
      <p className="text-[11px] text-[#667085] mt-1">Optional · e.g. INV-2026-4582</p>
    </div>
  </section>
);
