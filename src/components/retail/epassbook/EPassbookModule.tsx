import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { Transaction } from '../../../types/banking';

export const EPassbookModule: React.FC = () => {
  const { accounts, transactions, setRetailTab, setBottomNavHidden } = useBanking();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const account = accounts.find((a) => a.id === accountId) ?? accounts[0];

  const passbookEntries = useMemo(() => {
    const acctTxns = transactions.filter(
      (t) => t.type === 'credit' || t.type === 'debit'
    );
    let running = account?.balance ?? 0;
    const entries: (Transaction & { runningBalance: number })[] = [];

    [...acctTxns].reverse().forEach((txn) => {
      running = txn.type === 'credit' ? running - txn.amount : running + txn.amount;
      entries.unshift({
        ...txn,
        runningBalance: running + (txn.type === 'credit' ? txn.amount : -txn.amount),
      });
    });

    return entries.slice(-30).reverse();
  }, [transactions, account]);

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="ePassbook" subtitle="Running balance passbook view" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {accounts
            .filter((a) => ['Savings', 'Current', 'NRE Savings', 'Overdraft', 'BDD'].includes(a.accountType))
            .map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAccountId(a.id)}
                className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold border ${
                  accountId === a.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {a.accountType} {a.maskedNumber.slice(-4)}
              </button>
            ))}
        </div>

        <div className="p-4 rounded-2xl bg-linear-to-br from-congress-blue-800 to-indigo-900 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-200" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Passbook Balance</span>
          </div>
          <p className="text-2xl font-black">₹{account?.availableBalance.toLocaleString('en-IN')}</p>
          <p className="text-xs text-blue-200 mt-1 font-mono">{account?.maskedNumber}</p>
          {account?.status === 'frozen' && (
            <p className="text-[10px] font-bold mt-2 text-amber-300">Account frozen — credits only</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-[9px] font-bold uppercase text-slate-500">
            <span>Particulars</span>
            <span>Dr</span>
            <span>Cr</span>
            <span>Bal</span>
          </div>
          {passbookEntries.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No passbook entries yet.</p>
          ) : (
            passbookEntries.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-3 border-t border-slate-100 dark:border-slate-800 text-xs items-start"
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate flex items-center gap-1">
                    {entry.type === 'debit' ? (
                      <ArrowUpRight className="w-3 h-3 text-rose-500 shrink-0" />
                    ) : (
                      <ArrowDownLeft className="w-3 h-3 text-emerald-500 shrink-0" />
                    )}
                    {entry.counterpartyName}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{entry.date}</p>
                </div>
                <span className="font-mono text-rose-600 w-14 text-right">
                  {entry.type === 'debit' ? entry.amount.toLocaleString('en-IN') : '—'}
                </span>
                <span className="font-mono text-emerald-600 w-14 text-right">
                  {entry.type === 'credit' ? entry.amount.toLocaleString('en-IN') : '—'}
                </span>
                <span className="font-mono font-bold w-16 text-right text-[10px]">
                  {(entry.runningBalance ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
