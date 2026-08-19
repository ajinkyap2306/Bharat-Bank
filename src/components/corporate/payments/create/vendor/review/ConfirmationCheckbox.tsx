import React from 'react';

interface ConfirmationCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CONFIRMATION_LABEL =
  'I confirm that the payment details are correct and I am authorized to submit this payment.';

export const ConfirmationCheckbox: React.FC<ConfirmationCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => (
  <section className="px-4" aria-labelledby="confirmation-checkbox-label">
    <label
      className={`flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 min-h-14 cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 accent-[#0B5CAB] shrink-0"
        aria-describedby="confirmation-checkbox-label"
      />
      <span id="confirmation-checkbox-label" className="text-[14px] text-[#111827] dark:text-white leading-snug">
        {CONFIRMATION_LABEL}
      </span>
    </label>
  </section>
);
