import React from 'react';
import type { PaymentRailMethod } from '../../../../../../types/corporateVendorPaymentDetails';
import { PAYMENT_METHOD_OPTIONS } from '../../../../../../data/corporateVendorPaymentDetailsMock';

interface PaymentMethodSelectorProps {
  value: PaymentRailMethod;
  recommended: PaymentRailMethod;
  availableMethods: PaymentRailMethod[];
  onChange: (method: PaymentRailMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  recommended,
  availableMethods,
  onChange,
}) => (
  <section className="px-4" aria-labelledby="payment-method-label">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
      <p id="payment-method-label" className="text-[14px] font-semibold text-[#111827] dark:text-white mb-3">
        Payment Method
      </p>
      <div className="space-y-2">
        {PAYMENT_METHOD_OPTIONS.filter((m) => availableMethods.includes(m.id)).map((method) => {
          const isRecommended = method.id === recommended;
          const selected = method.id === value;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange(method.id)}
              className={`w-full p-4 rounded-xl border text-left min-h-14 ${
                selected
                  ? 'border-[#0B5CAB] bg-[#0B5CAB]/5'
                  : 'border-[#E4E7EC] dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
                    {method.label}
                    {isRecommended && (
                      <span className="ml-2 text-[10px] font-semibold uppercase text-[#0B5CAB]">
                        Recommended
                      </span>
                    )}
                  </p>
                  <p className="text-[12px] text-[#667085] mt-0.5">{method.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                    selected ? 'border-[#0B5CAB] bg-[#0B5CAB]' : 'border-[#E4E7EC]'
                  }`}
                  aria-hidden
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </section>
);
