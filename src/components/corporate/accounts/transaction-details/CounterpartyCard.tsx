import React from 'react';
import type { CounterpartyDetails } from '../../../../types/corporateTransactionDetails';

interface CounterpartyCardProps {
  direction: 'credit' | 'debit';
  counterparty: CounterpartyDetails;
}

export const CounterpartyCard: React.FC<CounterpartyCardProps> = ({
  direction,
  counterparty,
}) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm" aria-label={direction === 'credit' ? 'Received From' : 'Paid To'}>
    <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3">
      {direction === 'credit' ? 'Received From' : 'Paid To'}
    </h2>
    <p className="text-[16px] font-semibold text-[#111827] dark:text-white">{counterparty.name}</p>
    <div className="mt-3 space-y-2">
      <div className="flex justify-between gap-3 text-[13px]">
        <span className="text-[#667085]">Account</span>
        <span className="font-mono text-[#111827] dark:text-white">{counterparty.maskedAccount}</span>
      </div>
      <div className="flex justify-between gap-3 text-[13px]">
        <span className="text-[#667085]">Bank</span>
        <span className="text-[#111827] dark:text-white text-right">{counterparty.bank}</span>
      </div>
      <div className="flex justify-between gap-3 text-[13px]">
        <span className="text-[#667085]">IFSC</span>
        <span className="font-mono text-[#111827] dark:text-white">{counterparty.ifsc}</span>
      </div>
    </div>
  </section>
);
