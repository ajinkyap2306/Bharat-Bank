import React from 'react';
import { AlertCircle, Wallet } from 'lucide-react';
import type { PaymentTypeErrorKind } from '../../../../types/corporatePaymentTypeSelection';

interface PaymentTypeErrorStateProps {
  kind: PaymentTypeErrorKind;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

export const PaymentTypeErrorState: React.FC<PaymentTypeErrorStateProps> = ({
  kind,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  const isAccountUnavailable = kind === 'account-unavailable';

  return (
    <section
      className="px-4"
      role="alert"
      aria-live="polite"
      aria-labelledby="payment-type-error-title"
    >
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5 text-center shadow-sm">
        <div
          className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
            isAccountUnavailable ? 'bg-[#F59E0B]/10' : 'bg-[#DC2626]/10'
          }`}
        >
          {isAccountUnavailable ? (
            <Wallet className="w-6 h-6 text-[#F59E0B]" aria-hidden />
          ) : (
            <AlertCircle className="w-6 h-6 text-[#DC2626]" aria-hidden />
          )}
        </div>

        <h2
          id="payment-type-error-title"
          className="text-[16px] font-semibold text-[#111827] dark:text-white"
        >
          {isAccountUnavailable ? 'Account unavailable' : 'No eligible account'}
        </h2>
        <p className="text-[13px] text-[#667085] mt-2 leading-relaxed">
          {isAccountUnavailable
            ? 'This account cannot be used for this type of payment.'
            : 'There is no account available for this payment type.'}
        </p>

        <button
          type="button"
          onClick={onPrimaryAction}
          className="mt-5 w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[14px] font-semibold min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
        >
          {isAccountUnavailable ? 'Select Another Account' : 'Choose Another Payment'}
        </button>

        {isAccountUnavailable && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="mt-2 w-full py-3 rounded-2xl text-[#667085] text-[14px] font-semibold min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </section>
  );
};
