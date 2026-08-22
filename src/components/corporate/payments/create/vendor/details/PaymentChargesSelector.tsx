import React from 'react';
import type { PaymentChargeBearer } from '../../../../../../types/corporateVendorPaymentDetails';
import { CHARGE_OPTIONS } from '../../../../../../data/corporateVendorPaymentDetailsMock';

interface PaymentChargesSelectorProps {
  value: PaymentChargeBearer;
  onChange: (value: PaymentChargeBearer) => void;
  visible?: boolean;
}

export const PaymentChargesSelector: React.FC<PaymentChargesSelectorProps> = ({
  value,
  onChange,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <section className="px-4" aria-labelledby="payment-charges-label">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <p id="payment-charges-label" className="text-[14px] font-semibold text-slate-900 dark:text-white mb-3">
          Payment Charges
        </p>
        <div className="flex flex-wrap gap-2">
          {CHARGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-4 py-2.5 rounded-full text-[13px] font-semibold min-h-11 border ${
                value === opt.id
                  ? 'bg-congress-blue-700 text-white border-congress-blue-700'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3">
          Charges depend on the selected payment route.
        </p>
      </div>
    </section>
  );
};
