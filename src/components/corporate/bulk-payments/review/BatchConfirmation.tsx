import React from 'react';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface BatchConfirmationProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const BatchConfirmation: React.FC<BatchConfirmationProps> = ({
  checked,
  onChange,
  disabled = false,
}) => (
  <PayCard className="p-4">
    <label className="flex items-start gap-3 cursor-pointer min-h-11">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 w-5 h-5 rounded border-slate-200 dark:border-slate-800 text-congress-blue-700 dark:text-congress-blue-400 focus:ring-congress-blue-500 shrink-0"
        aria-describedby="batch-confirm-desc"
      />
      <span id="batch-confirm-desc" className="text-[13px] text-slate-900 dark:text-white leading-relaxed">
        I confirm that the batch details and payment records are correct and I am authorized to submit
        this batch.
      </span>
    </label>
  </PayCard>
);
