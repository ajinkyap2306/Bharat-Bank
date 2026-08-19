import React, { useState } from 'react';
import { BarChart3, CheckCircle2, Link2 } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';

export const DematModule: React.FC = () => {
  const { dematAccount, accounts, applyDematAccount, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [linkedAccountId, setLinkedAccountId] = useState(accounts[0]?.id || '');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  if (dematAccount?.status === 'active') {
    return (
      <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
        <ScreenHeader title="Demat Account" subtitle="Securities & holdings" onBack={() => setRetailTab('services')} />
        <div className="pt-3 pb-6 space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60">
            <p className="text-sm font-bold">Active Demat Account</p>
            <p className="text-xs text-slate-500 mt-1">DP ID: <span className="font-mono font-bold">{dematAccount.dpId}</span></p>
            <p className="text-xs text-slate-500">Client ID: <span className="font-mono font-bold">{dematAccount.clientId}</span></p>
            <p className="text-[11px] text-slate-400 mt-2">Linked: {dematAccount.linkedAccountLabel}</p>
            {dematAccount.openedOn && <p className="text-[11px] text-slate-400">Opened {dematAccount.openedOn}</p>}
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 mb-2">Holdings (Demo)</p>
            <p className="text-sm text-slate-600">No securities in demat yet. Invest via Bonds or link IPO applications.</p>
          </div>
        </div>
      </div>
    );
  }

  if (done || dematAccount?.status === 'pending') {
    const acct = dematAccount;
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 pb-24 -mx-3 bg-slate-50 dark:bg-slate-950 min-h-full">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Application Submitted</h2>
        <p className="text-xs text-slate-500 mt-2">Your demat account will be activated in 2–3 working days.</p>
        {acct && (
          <p className="text-xs text-slate-500 mt-1 font-mono">{acct.dpId} / {acct.clientId}</p>
        )}
        <button type="button" onClick={() => setRetailTab('services')} className="mt-8 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">Done</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Demat Account" subtitle="Open or link securities account" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 flex gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-600 shrink-0" />
          <p className="text-xs text-slate-600">Open a demat account to hold shares, bonds, ETFs and mutual fund units in electronic form.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1"><Link2 className="w-3.5 h-3.5" /> Link Savings Account</p>
          <select value={linkedAccountId} onChange={(e) => setLinkedAccountId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.nickname || a.type} — {a.accountNumber}</option>)}
          </select>
          <button
            type="button"
            onClick={() => {
              if (!linkedAccountId) {
                addToast({ type: 'error', title: 'Select account', message: 'Choose a linked savings account.' });
                return;
              }
              setShowAuth(true);
            }}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl"
          >
            Open Demat Account
          </button>
        </div>
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          applyDematAccount(linkedAccountId);
          setShowAuth(false);
          setDone(true);
        }}
        title="Authenticate demat application"
      />
    </div>
  );
};
