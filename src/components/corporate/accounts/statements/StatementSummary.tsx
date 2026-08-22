import React from 'react';
import type { AccountStatementData } from '../../../../types/corporateAccountStatements';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface StatementSummaryProps {
  statement: AccountStatementData;
  showBalances: boolean;
  isLoading?: boolean;
}

export const StatementSummary: React.FC<StatementSummaryProps> = ({
  statement,
  showBalances,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="mx-4 h-44 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse" />;
  }

  const mask = (v: string) => (showBalances ? v : '••••••');

  const rows = [
    { label: 'Opening Balance', value: formatAccountCurrency(statement.openingBalance, statement.currency) },
    { label: 'Total Credits', value: `+ ${formatAccountCurrency(statement.totalCredits, statement.currency)}`, className: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Total Debits', value: `− ${formatAccountCurrency(statement.totalDebits, statement.currency)}`, className: 'text-[#DC2626]' },
    { label: 'Closing Balance', value: formatAccountCurrency(statement.closingBalance, statement.currency), bold: true },
  ];

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm" aria-label="Statement Summary">
      <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-3">Statement Summary</h2>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-[13px] text-slate-500 dark:text-slate-400">{row.label}</span>
            <span className={`text-[15px] tabular-nums ${row.bold ? 'font-semibold text-slate-900 dark:text-white text-[18px]' : `font-medium ${row.className ?? 'text-slate-900 dark:text-white'}`}`}>
              {mask(row.value)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 dark:border-slate-800">
          <span className="text-[13px] text-slate-500 dark:text-slate-400">Transactions</span>
          <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{statement.transactionCount}</span>
        </div>
      </div>
    </section>
  );
};
