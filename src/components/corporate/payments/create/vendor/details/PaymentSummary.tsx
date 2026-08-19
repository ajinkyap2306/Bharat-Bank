import React from 'react';
import { formatPaymentCurrency } from '../../../shared/CorporatePaymentsUI';
import { formatPaymentDisplayDate } from '../../../../../../data/corporateVendorPaymentDetailsMock';

interface PaymentSummaryProps {
  beneficiaryName: string;
  accountLabel: string;
  amount: number;
  fee: number;
  totalDebit: number;
  paymentDate: string;
  currency?: string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  beneficiaryName,
  accountLabel,
  amount,
  fee,
  totalDebit,
  paymentDate,
  currency = '₹',
}) => {
  if (amount <= 0) return null;

  const rows = [
    { label: 'Pay To', value: beneficiaryName },
    { label: 'Pay From', value: accountLabel },
    { label: 'Amount', value: formatPaymentCurrency(amount, currency) },
    { label: 'Fee', value: formatPaymentCurrency(fee, currency) },
    { label: 'Total Debit', value: formatPaymentCurrency(totalDebit, currency), bold: true },
    { label: 'Payment Date', value: formatPaymentDisplayDate(paymentDate) },
  ];

  return (
    <section className="px-4" aria-labelledby="payment-summary-heading">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
        <h2 id="payment-summary-heading" className="text-[14px] font-semibold text-[#111827] dark:text-white mb-3">
          Payment Summary
        </h2>
        <dl className="space-y-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3 text-[13px]">
              <dt className="text-[#667085] shrink-0">{row.label}</dt>
              <dd
                className={`text-right tabular-nums ${
                  row.bold
                    ? 'font-bold text-[#111827] dark:text-white'
                    : 'font-medium text-[#111827] dark:text-white'
                }`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
