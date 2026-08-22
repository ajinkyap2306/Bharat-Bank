import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { PaymentType } from '../../../../types/corporatePaymentTypeSelection';

interface PaymentTypeCardProps {
  paymentType: PaymentType;
  onSelect: (paymentType: PaymentType) => void;
  index?: number;
}

export const PaymentTypeCard: React.FC<PaymentTypeCardProps> = ({
  paymentType,
  onSelect,
}) => {
  const Icon = paymentType.icon;
  const srLabel = `${paymentType.name}. ${paymentType.description}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(paymentType)}
      disabled={!paymentType.available}
      aria-label={srLabel}
      className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left shadow-sm min-h-[76px] active:bg-slate-50 dark:active:bg-slate-800/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 shrink-0 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center"
          aria-hidden
        >
          <Icon className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[16px] font-semibold text-slate-900 dark:text-white">
                  {paymentType.name}
                </p>
                {paymentType.recommended && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-congress-blue-50 dark:bg-congress-blue-950/40 text-congress-blue-700 dark:text-congress-blue-400">
                    Most Used
                  </span>
                )}
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {paymentType.description}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" aria-hidden />
          </div>

          {paymentType.internalTransferPreview && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5 flex-wrap">
              <span>{paymentType.internalTransferPreview.from}</span>
              <span aria-hidden>→</span>
              <span>{paymentType.internalTransferPreview.to}</span>
            </p>
          )}

          {paymentType.examples && paymentType.examples.length > 0 && !paymentType.internalTransferPreview && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {paymentType.examples.join(' · ')}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};
