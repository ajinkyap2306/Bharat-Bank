import React from 'react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { CorporateApprovalDetail } from '../../../../types/corporateApprovalDetails';

interface PaymentSummaryProps {
  detail: CorporateApprovalDetail;
  hideAmounts?: boolean;
}

const Row: React.FC<{ label: string; value: string; bold?: boolean }> = ({
  label,
  value,
  bold,
}) => (
  <div className="flex justify-between gap-4 py-2.5 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800 last:border-0">
    <dt className="text-[13px] text-slate-500 dark:text-slate-400">{label}</dt>
    <dd className={`text-[13px] text-right text-slate-900 dark:text-white ${bold ? 'font-semibold' : 'font-medium'}`}>
      {value}
    </dd>
  </div>
);

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ detail, hideAmounts }) => {
  const pd = detail.paymentDetails;
  const ben = detail.beneficiary;
  const src = detail.sourceAccount;
  if (!pd || !ben || !src || detail.amount === undefined) return null;

  const mask = (v: number) =>
    hideAmounts ? '₹••••••' : formatPaymentCurrency(v, detail.currency);

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
      <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-1">
        Payment Summary
      </h2>
      <dl>
        <Row label="Pay To" value={ben.name} />
        <Row label="Account" value={ben.maskedAccount} />
        <Row label="Bank" value={ben.bankName} />
        <Row label="Pay From" value={src.name} />
        <Row label="" value={src.maskedNumber} />
        <Row label="Amount" value={mask(detail.amount)} />
        <Row label="Fee" value={mask(pd.fee)} />
        <Row label="Total Debit" value={mask(pd.totalDebit)} bold />
        <Row label="Currency" value={pd.currency} />
      </dl>
    </section>
  );
};
