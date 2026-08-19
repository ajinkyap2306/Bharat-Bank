import React from 'react';
import type { AccountStatementData } from '../../../../types/corporateAccountStatements';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface StatementInsightsProps {
  statement: AccountStatementData;
  showBalances: boolean;
}

export const StatementInsights: React.FC<StatementInsightsProps> = ({ statement, showBalances }) => {
  const netPrefix = statement.netMovement >= 0 ? '+' : '−';
  return (
    <div className="px-4">
      <div className="flex gap-3 overflow-x-auto no-scrollbar rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-3 shadow-sm">
        <div className="shrink-0 min-w-20">
          <p className="text-[11px] text-[#667085]">Credits</p>
          <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-0.5">{statement.creditCount}</p>
        </div>
        <div className="shrink-0 min-w-20">
          <p className="text-[11px] text-[#667085]">Debits</p>
          <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-0.5">{statement.debitCount}</p>
        </div>
        <div className="shrink-0 min-w-25">
          <p className="text-[11px] text-[#667085]">Net Movement</p>
          <p className={`text-[15px] font-semibold tabular-nums mt-0.5 ${statement.netMovement >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
            {showBalances
              ? `${netPrefix} ${formatAccountCurrency(Math.abs(statement.netMovement), statement.currency)}`
              : '••••••'}
          </p>
        </div>
      </div>
    </div>
  );
};
