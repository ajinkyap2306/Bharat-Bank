import React from 'react';
import { CopyPaymentId } from './CopyPaymentId';

interface PaymentReferenceCardProps {
  paymentId: string;
  onCopied: () => void;
}

export const PaymentReferenceCard: React.FC<PaymentReferenceCardProps> = ({
  paymentId,
  onCopied,
}) => (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
    aria-labelledby="payment-id-label"
  >
    <p id="payment-id-label" className="text-[12px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
      Payment ID
    </p>
    <div className="flex items-center justify-between gap-3 mt-2">
      <p className="text-[15px] font-semibold text-slate-900 dark:text-white font-mono tracking-tight break-all">
        {paymentId}
      </p>
      <CopyPaymentId paymentId={paymentId} onCopied={onCopied} />
    </div>
  </section>
);
