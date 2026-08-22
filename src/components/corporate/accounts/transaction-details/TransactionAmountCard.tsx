import React from 'react';
import type { CorporateTransactionDetails } from '../../../../types/corporateTransactionDetails';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';
import { getTransactionTypeIcon } from '../transactions/TransactionTypeIcon';
import type { CorporateAccountTransaction } from '../../../../types/corporateAccounts';

interface TransactionAmountCardProps {
  details: CorporateTransactionDetails;
  showBalances: boolean;
}

export const TransactionAmountCard: React.FC<TransactionAmountCardProps> = ({
  details,
  showBalances,
}) => {
  const mask = (v: string) => (showBalances ? v : '••••••');
  const total =
    details.direction === 'debit' ? details.amount + details.fee : details.amount;

  const mockTxn = {
    type: details.direction,
    txnType: details.txnType,
  } as CorporateAccountTransaction;

  const TypeIcon = getTransactionTypeIcon(mockTxn);

  return (
    <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800">
        <div>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">Amount</p>
          <p className="text-[20px] font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">
            {mask(formatAccountCurrency(details.amount, details.currency))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-slate-500 dark:text-slate-400">Currency</p>
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white mt-0.5">
            {details.currencyCode}
          </p>
        </div>
      </div>

      {details.fee > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">Transaction Fee</span>
            <span className="text-[14px] font-medium text-slate-900 dark:text-white tabular-nums">
              {mask(formatAccountCurrency(details.fee, details.currency))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
              Total Debit
            </span>
            <span className="text-[15px] font-semibold text-slate-900 dark:text-white tabular-nums">
              {mask(formatAccountCurrency(total, details.currency))}
            </span>
          </div>
        </>
      )}

      {details.fee === 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-slate-500 dark:text-slate-400">Transaction Fee</span>
          <span className="text-[14px] font-medium text-slate-900 dark:text-white tabular-nums">
            {mask(formatAccountCurrency(0, details.currency))}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center">
          <TypeIcon className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
        </div>
        <div>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">Transaction Type</p>
          <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
            {details.txnType}
          </p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">
            {details.category} • {details.direction === 'credit' ? 'Credit' : 'Debit'}
          </p>
        </div>
      </div>
    </div>
  );
};
