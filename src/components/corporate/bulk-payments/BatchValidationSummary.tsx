import React from 'react';
import type { BulkBatch } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency, PayCard } from '../payments/shared/CorporatePaymentsUI';

interface BatchValidationSummaryProps {
  batch: BulkBatch;
}

export const BatchValidationSummary: React.FC<BatchValidationSummaryProps> = ({ batch }) => (
  <PayCard className="p-4" aria-label="Batch validation summary">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">
      Batch Validation
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Records', value: String(batch.paymentCount), tone: 'neutral' },
        { label: 'Valid', value: String(batch.validCount), tone: 'success' },
        { label: 'Errors', value: String(batch.errorCount), tone: 'error' },
        { label: 'Duplicates', value: String(batch.duplicateCount), tone: 'warning' },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 p-3 text-center"
        >
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</p>
          <p
            className={`text-[18px] font-bold mt-0.5 ${
              item.tone === 'success'
                ? 'text-emerald-600 dark:text-emerald-400'
                : item.tone === 'error'
                  ? 'text-[#DC2626]'
                  : item.tone === 'warning'
                    ? 'text-[#F59E0B]'
                    : 'text-slate-900 dark:text-white'
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[13px]">
      <span className="text-slate-500 dark:text-slate-400">Total Amount</span>
      <span className="font-bold text-slate-900 dark:text-white">
        {formatPaymentCurrency(batch.totalAmount)}
      </span>
    </div>
    <span className="sr-only">
      Batch contains {batch.paymentCount} payments. {batch.validCount} valid, {batch.errorCount}{' '}
      errors, and {batch.duplicateCount} possible duplicates.
    </span>
  </PayCard>
);
