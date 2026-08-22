import React from 'react';
import type { AmountValidationState, VendorPaymentLimits } from '../../../../../../types/corporateVendorPaymentDetails';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';
import {
  getAmountValidationMessage,
} from '../../../../../../utils/vendorPaymentValidation';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  limits: VendorPaymentLimits;
  validationState: AmountValidationState;
  showBalances: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  limits,
  validationState,
  showBalances,
}) => {
  const message = getAmountValidationMessage(validationState, limits);
  const isValid = validationState === 'valid';
  const hasError = validationState !== 'empty' && validationState !== 'valid' && value !== '';

  return (
    <section className="px-4" aria-labelledby="payment-amount-label">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <label id="payment-amount-label" htmlFor="payment-amount" className="text-[14px] font-semibold text-slate-900 dark:text-white">
          Payment Amount
        </label>

        <div className="mt-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-[24px] font-bold text-slate-900 dark:text-white" aria-hidden>
            ₹
          </span>
          <input
            id="payment-amount"
            type="text"
            inputMode="decimal"
            enterKeyHint="done"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className="flex-1 text-[28px] font-bold text-slate-900 dark:text-white bg-transparent outline-none tabular-nums placeholder:text-slate-500 dark:text-slate-400/50 min-h-11"
            aria-describedby="payment-amount-hint payment-amount-validation"
            aria-invalid={hasError}
          />
          <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">INR</span>
        </div>

        <div id="payment-amount-hint" className="mt-3 space-y-1.5 text-[12px] text-slate-500 dark:text-slate-400">
          <div className="flex justify-between gap-2">
            <span>Available Balance</span>
            <span className="font-medium text-slate-900 dark:text-white tabular-nums">
              {showBalances
                ? formatPaymentCurrency(limits.availableBalance, limits.currency)
                : '••••••'}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Payment Limit</span>
            <span className="tabular-nums">
              {formatPaymentCurrency(limits.singleTransactionLimit, limits.currency)}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Remaining Daily Limit</span>
            <span className="tabular-nums">
              {formatPaymentCurrency(limits.dailyRemainingLimit, limits.currency)}
            </span>
          </div>
        </div>

        {message && value !== '' && (
          <p
            id="payment-amount-validation"
            role={hasError ? 'alert' : 'status'}
            className={`mt-3 text-[13px] font-medium ${
              isValid ? 'text-emerald-600 dark:text-emerald-400' : hasError ? 'text-[#DC2626]' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {message}
          </p>
        )}
        {validationState === 'empty' && value === '' && (
          <p id="payment-amount-validation" className="mt-3 text-[13px] text-slate-500 dark:text-slate-400">
            Enter a payment amount.
          </p>
        )}
      </div>
    </section>
  );
};
