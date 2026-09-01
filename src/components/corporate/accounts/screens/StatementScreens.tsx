import React, { useState } from 'react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import {
  CORPORATE_STATEMENT_PERIODS,
  getAccountById,
  getTransactionsForAccount,
} from '../../../../data/corporateAccountsMock';
import { useBanking } from '../../../../context/BankingContext';
import { AccountsCard, MenuRow } from '../shared/CorporateAccountsUI';
import { sendStatementToRegisteredEmail } from '../../../../utils/statementDelivery';

interface StatementsScreenProps {
  accountId: string;
  onBack: () => void;
  onPreview: (periodId: string) => void;
  onCustom: () => void;
}

export const StatementsScreen: React.FC<StatementsScreenProps> = ({
  accountId,
  onBack,
  onPreview,
  onCustom,
}) => {
  const account = getAccountById(accountId);
  const periods = CORPORATE_STATEMENT_PERIODS.filter((p) => p.accountId === accountId);

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Account Statements" subtitle={account?.nickname} onBack={onBack} edgeToEdge={false} />
      <div className="space-y-4">
        <AccountsCard>
          <MenuRow label="Custom Statement" description="Select date range" onClick={onCustom} />
        </AccountsCard>
        {periods.length === 0 ? (
          <AccountsCard className="p-6 text-center">
            <p className="text-sm font-bold">No statements available</p>
          </AccountsCard>
        ) : (
          periods.map((p) => (
            <AccountsCard key={p.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{p.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{account?.nickname}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.status}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => onPreview(p.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400 border border-congress-blue-700/30">
                    View
                  </button>
                </div>
              </div>
            </AccountsCard>
          ))
        )}
      </div>
    </div>
  );
};

interface CustomStatementScreenProps {
  accountId: string;
  onBack: () => void;
  onGenerate: () => void;
}

export const CustomStatementScreen: React.FC<CustomStatementScreenProps> = ({
  accountId,
  onBack,
  onGenerate,
}) => {
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-18');
  const account = getAccountById(accountId);

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Custom Statement" subtitle={account?.nickname} onBack={onBack} edgeToEdge={false} />
      <AccountsCard className="p-4 space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">From Date</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">To Date</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <button type="button" onClick={onGenerate} className="w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm">
          Generate Statement
        </button>
      </AccountsCard>
    </div>
  );
};

interface StatementPreviewScreenProps {
  accountId: string;
  periodLabel: string;
  onBack: () => void;
}

export const StatementPreviewScreen: React.FC<StatementPreviewScreenProps> = ({
  accountId,
  periodLabel,
  onBack,
}) => {
  const { addToast, user, corporateSession } = useBanking();
  const account = getAccountById(accountId);
  const txns = getTransactionsForAccount(accountId);
  const registeredEmail = corporateSession?.email ?? user.email;

  const download = (format: string) => {
    addToast({ type: 'success', title: `Downloaded ${format}`, message: `Statement for ${periodLabel} saved.` });
  };

  const sendToEmail = async () => {
    try {
      await sendStatementToRegisteredEmail({
        email: registeredEmail,
        accountLabel: account?.nickname || account?.companyName || 'Corporate account',
        periodLabel,
        format: 'PDF',
      });
      addToast({
        type: 'success',
        title: 'Statement Sent',
        message: `Statement for ${periodLabel} sent to ${registeredEmail}.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Unable to Send',
        message: 'No registered email found on your profile.',
      });
    }
  };

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Statement Preview" onBack={onBack} edgeToEdge={false} />
      <div className="space-y-4">
        <AccountsCard className="p-4">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Account</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{account?.companyName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{account?.accountType} • {account?.maskedNumber}</p>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-3">Period</p>
          <p className="text-sm text-slate-900 dark:text-white">01 Aug 2026 – 18 Aug 2026</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div><p className="text-slate-500 dark:text-slate-400">Opening</p><p className="font-bold font-mono">₹11,20,00,000</p></div>
            <div><p className="text-slate-500 dark:text-slate-400">Closing</p><p className="font-bold font-mono">₹12,45,00,000</p></div>
            <div><p className="text-slate-500 dark:text-slate-400">Credits</p><p className="font-bold text-emerald-600 dark:text-emerald-400">₹18,45,000</p></div>
            <div><p className="text-slate-500 dark:text-slate-400">Debits</p><p className="font-bold text-[#DC2626]">₹17,20,000</p></div>
          </div>
        </AccountsCard>

        <AccountsCard className="divide-y divide-slate-100 dark:divide-slate-800">
          {txns.slice(0, 5).map((t) => (
            <div key={t.id} className="p-3">
              <p className="text-sm font-bold">{t.counterpartyName}</p>
              <p className="text-xs font-mono">{t.type === 'credit' ? '+' : '-'} ₹{t.amount.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.date}</p>
            </div>
          ))}
        </AccountsCard>

        <div className="px-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => download('PDF')} className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold">Download PDF</button>
            <button type="button" onClick={() => void sendToEmail()} className="py-2.5 rounded-xl border border-congress-blue-700/30 text-congress-blue-700 dark:text-congress-blue-400 text-xs font-bold">Send to Email</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => download('CSV')} className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold">Download CSV</button>
            <button type="button" onClick={() => addToast({ type: 'info', title: 'Shared', message: 'Statement link copied.' })} className="py-2.5 rounded-xl bg-congress-blue-700 text-white text-xs font-bold">Share</button>
          </div>
          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">Registered email: {registeredEmail}</p>
        </div>
      </div>
    </div>
  );
};

interface DocumentsScreenProps {
  accountId: string;
  onBack: () => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ accountId, onBack }) => {
  const { addToast } = useBanking();
  const account = getAccountById(accountId);
  const docs = [
    'Account Statement',
    'Account Certificate',
    'Interest Certificate',
    'Tax Certificate',
    'Account Confirmation Letter',
  ];

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Documents" subtitle={account?.nickname} onBack={onBack} edgeToEdge={false} />
      <AccountsCard>
        {docs.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => addToast({ type: 'info', title: d, message: 'Document request submitted.' })}
            className="w-full p-3 text-left border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40"
          >
            <p className="text-sm font-bold text-slate-900 dark:text-white">{d}</p>
          </button>
        ))}
      </AccountsCard>
    </div>
  );
};
