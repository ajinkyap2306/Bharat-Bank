import React, { useState } from 'react';
import { Banknote, Clock, Copy, Check } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';

export const CardlessCashModule: React.FC = () => {
  const {
    cardlessWithdrawals,
    accounts,
    generateCardlessWithdrawal,
    addToast,
    setRetailTab,
    setBottomNavHidden,
    getDefaultDebitAccount,
  } = useBanking();

  const defaultDebit = getDefaultDebitAccount();
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(defaultDebit.id);
  const [showAuth, setShowAuth] = useState(false);
  const [generated, setGenerated] = useState<{ otp: string; expiresAt: string } | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const active = cardlessWithdrawals.filter((c) => c.status === 'active');

  const handleCopy = (otp: string) => {
    navigator.clipboard?.writeText(otp);
    setCopied(true);
    addToast({ type: 'info', title: 'Copied', message: 'Withdrawal code copied.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Cardless Cash" subtitle="Withdraw without your card" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 flex gap-3">
          <Banknote className="w-8 h-8 text-indigo-600 shrink-0" />
          <p className="text-xs text-slate-600">
            Generate a 6-digit code valid for 30 minutes. Enter it at any Bharat Bank ATM to withdraw cash.
          </p>
        </div>

        {generated && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Withdrawal Code</p>
            <p className="text-3xl font-mono font-black tracking-[0.3em] mt-2">{generated.otp}</p>
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-300 mt-2">
              <Clock className="w-3.5 h-3.5" /> Expires {generated.expiresAt}
            </div>
            <button
              type="button"
              onClick={() => handleCopy(generated.otp)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-300"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Code
            </button>
          </div>
        )}

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
          placeholder="Amount (₹) — max ₹10,000"
          inputMode="numeric"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        >
          {accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType) && a.status !== 'frozen').map((a) => (
            <option key={a.id} value={a.id}>{a.accountType} {a.maskedNumber}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const num = Number(amount);
            if (!num || num < 100 || num > 10000) {
              addToast({ type: 'error', title: 'Invalid amount', message: 'Enter between ₹100 and ₹10,000.' });
              return;
            }
            setShowAuth(true);
          }}
          className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl"
        >
          Generate Code
        </button>

        {active.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-1">Active Codes</p>
            {active.map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-sm font-mono font-bold">{c.otp}</p>
                  <p className="text-[10px] text-slate-500">₹{c.amount.toLocaleString('en-IN')} • {c.atmHint}</p>
                </div>
                <span className="text-[10px] text-amber-600 font-bold">{c.expiresAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          const result = generateCardlessWithdrawal(accountId, Number(amount));
          setGenerated({ otp: result.otp, expiresAt: result.expiresAt });
          setShowAuth(false);
          setAmount('');
        }}
        title="Authenticate cardless withdrawal"
      />
    </div>
  );
};
