import React, { useState } from 'react';
import { Landmark, Shield, Heart, Briefcase } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import type { GovtSchemeType } from '../../../data/level5Mock';

const SCHEME_META: Record<GovtSchemeType, { label: string; icon: React.ReactNode; color: string }> = {
  ppf: { label: 'Public Provident Fund', icon: <Shield className="w-5 h-5" />, color: 'text-emerald-600' },
  ssa: { label: 'Sukanya Samriddhi', icon: <Heart className="w-5 h-5" />, color: 'text-rose-600' },
  nps: { label: 'National Pension System', icon: <Briefcase className="w-5 h-5" />, color: 'text-blue-600' },
};

export const GovtSavingsModule: React.FC = () => {
  const { govtSavingsAccounts, contributeToGovtScheme, accounts, addToast, setRetailTab, setBottomNavHidden, getDefaultDebitAccount } = useBanking();
  const [selectedId, setSelectedId] = useState(govtSavingsAccounts[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(getDefaultDebitAccount().id);
  const [showAuth, setShowAuth] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const selected = govtSavingsAccounts.find((a) => a.id === selectedId);
  const meta = selected ? SCHEME_META[selected.scheme] : null;
  const remaining = selected ? selected.annualLimit - selected.contributedYtd : 0;

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Government Savings" subtitle="PPF, SSA & NPS" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 flex gap-3">
          <Landmark className="w-8 h-8 text-emerald-600 shrink-0" />
          <p className="text-xs text-slate-600">Contribute to government-backed savings schemes. Tax benefits as per prevailing rules.</p>
        </div>

        {govtSavingsAccounts.map((acc) => {
          const m = SCHEME_META[acc.scheme];
          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => setSelectedId(acc.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                selectedId === acc.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${m.color}`}>{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{m.label}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{acc.accountNumber}</p>
                </div>
                <p className="text-sm font-extrabold">₹{acc.balance.toLocaleString('en-IN')}</p>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">FY {acc.financialYear} • Contributed ₹{acc.contributedYtd.toLocaleString('en-IN')} / ₹{acc.annualLimit.toLocaleString('en-IN')}</p>
            </button>
          );
        })}

        {selected && meta && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs font-bold text-slate-500">Contribute to {meta.label}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Remaining FY limit: ₹{remaining.toLocaleString('en-IN')}</p>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount (₹)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm" />
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
              {accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType)).map((a) => (
                <option key={a.id} value={a.id}>{a.accountType} {a.maskedNumber}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const num = Number(amount);
                if (!num || num > remaining) {
                  addToast({ type: 'error', title: 'Invalid', message: `Enter up to ₹${remaining.toLocaleString('en-IN')}.` });
                  return;
                }
                setShowAuth(true);
              }}
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-2xl"
            >
              Contribute
            </button>
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (selected) contributeToGovtScheme(selected.id, Number(amount), accountId);
          setShowAuth(false);
          setAmount('');
        }}
        title="Authenticate contribution"
      />
    </div>
  );
};
