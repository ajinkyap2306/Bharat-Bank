import React from 'react';
import type { BulkBatch } from '../../../types/corporateBulkPayments';
import { PayCard } from '../payments/shared/CorporatePaymentsUI';
import { Copy } from 'lucide-react';

interface BatchDetailsFormProps {
  batch: BulkBatch;
  onChange: (field: keyof Pick<BulkBatch, 'name' | 'reference' | 'paymentDate'>, value: string) => void;
  onCopyReference: () => void;
  readOnly?: boolean;
}

export const BatchDetailsForm: React.FC<BatchDetailsFormProps> = ({
  batch,
  onChange,
  onCopyReference,
  readOnly = false,
}) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">New Payment Batch</h3>
    <div className="space-y-3">
      <label className="block">
        <span className="text-[12px] text-[#667085]">Batch Name *</span>
        <input
          type="text"
          value={batch.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="August Vendor Payments"
          disabled={readOnly}
          className="mt-1 w-full px-3 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-white dark:bg-slate-900 text-[14px] font-medium min-h-11 disabled:opacity-70"
          aria-required
        />
      </label>
      <div>
        <span className="text-[12px] text-[#667085]">Batch Reference</span>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={batch.reference}
            onChange={(e) => onChange('reference', e.target.value)}
            disabled={readOnly}
            className="flex-1 px-3 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-white dark:bg-slate-900 text-[14px] font-mono min-h-11 disabled:opacity-70"
          />
          <button
            type="button"
            onClick={onCopyReference}
            className="w-11 h-11 shrink-0 rounded-xl border border-[#E4E7EC] dark:border-slate-700 flex items-center justify-center"
            aria-label="Copy batch reference"
          >
            <Copy className="w-4 h-4 text-[#667085]" aria-hidden />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[12px] text-[#667085]">Payment Date</span>
          <input
            type="text"
            value={batch.paymentDate}
            onChange={(e) => onChange('paymentDate', e.target.value)}
            disabled={readOnly}
            className="mt-1 w-full px-3 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[14px] min-h-11 disabled:opacity-70"
          />
        </label>
        <label className="block">
          <span className="text-[12px] text-[#667085]">Currency</span>
          <input
            type="text"
            value={batch.currency}
            disabled
            className="mt-1 w-full px-3 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] min-h-11 opacity-70"
          />
        </label>
      </div>
    </div>
  </PayCard>
);
