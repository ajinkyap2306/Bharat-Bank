import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { VendorPaymentPurpose } from '../../../../../../types/corporateVendorPaymentDetails';
import { PAYMENT_PURPOSE_OPTIONS } from '../../../../../../data/corporateVendorPaymentDetailsMock';

interface PaymentPurposeSelectorProps {
  value: VendorPaymentPurpose;
  onOpen: () => void;
}

export const PaymentPurposeSelector: React.FC<PaymentPurposeSelectorProps> = ({
  value,
  onOpen,
}) => {
  const label = PAYMENT_PURPOSE_OPTIONS.find((o) => o.id === value)?.label ?? 'Select purpose';

  return (
    <section className="px-4" aria-labelledby="payment-purpose-label">
      <button
        type="button"
        id="payment-purpose-label"
        onClick={onOpen}
        className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left min-h-14 active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
              Payment Purpose <span className="text-[#DC2626]">*</span>
            </p>
            <p className="text-[14px] text-slate-900 dark:text-white mt-1">{label}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
        </div>
      </button>
    </section>
  );
};

interface PaymentPurposeSheetProps {
  isOpen: boolean;
  value: VendorPaymentPurpose;
  onClose: () => void;
  onSelect: (purpose: VendorPaymentPurpose) => void;
}

export const PaymentPurposeSheet: React.FC<PaymentPurposeSheetProps> = ({
  isOpen,
  value,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl p-5 pb-safe max-h-[70vh] overflow-y-auto">
        <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-3">
          Payment Purpose
        </h3>
        <div className="space-y-2">
          {PAYMENT_PURPOSE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id);
                onClose();
              }}
              className={`w-full p-4 rounded-2xl border text-left min-h-14 ${
                value === opt.id
                  ? 'border-congress-blue-700 bg-congress-blue-700/5'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{opt.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
