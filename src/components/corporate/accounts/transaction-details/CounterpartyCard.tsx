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
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm" aria-label={direction === 'credit' ? 'Received From' : 'Paid To'}>
    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
      {direction === 'credit' ? 'Received From' : 'Paid To'}
    </h2>
    <p className="text-[16px] font-semibold text-slate-900 dark:text-white">{counterparty.name}</p>
    <div className="mt-3 space-y-2">
      <div className="flex justify-between gap-3 text-[13px]">
        <span className="text-slate-500 dark:text-slate-400">Account</span>
        <span className="font-mono text-slate-900 dark:text-white">{counterparty.maskedAccount}</span>
      </div>
      <div className="flex justify-between gap-3 text-[13px]">
        <span className="text-slate-500 dark:text-slate-400">Bank</span>
        <span className="text-slate-900 dark:text-white text-right">{counterparty.bank}</span>
      </div>
      <div className="flex justify-between gap-3 text-[13px]">
        <span className="text-slate-500 dark:text-slate-400">IFSC</span>
        <span className="font-mono text-slate-900 dark:text-white">{counterparty.ifsc}</span>
      </div>
    </div>
  </section>
);
