import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CorporateTransactionDetails } from '../../../../types/corporateTransactionDetails';

interface PaymentInformationProps {
  details: CorporateTransactionDetails;
}

export const PaymentInformation: React.FC<PaymentInformationProps> = ({ details }) => {
  const [expanded, setExpanded] = useState(true);

  const rows = [
    { label: 'Payment Purpose', value: details.purpose },
    { label: 'Reference', value: details.reference },
    { label: 'Payment Date', value: details.paymentDate },
    { label: 'Processing Date', value: details.processingDate ?? '—' },
    { label: 'Currency', value: details.currencyCode },
    { label: 'Channel', value: details.channel },
  ];

  return (
    <section className="mx-4" aria-label="Payment Information">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm min-h-13"
        aria-expanded={expanded}
      >
        <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
          Payment Information
        </span>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />
        )}
      </button>
      {expanded && (
        <div className="mt-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-200 dark:border-slate-800/60 dark:border-slate-800 last:border-0"
            >
              <span className="text-[13px] text-slate-500 dark:text-slate-400 shrink-0">{row.label}</span>
              <span className="text-[13px] font-medium text-slate-900 dark:text-white text-right">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
