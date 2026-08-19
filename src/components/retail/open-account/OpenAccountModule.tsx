import React, { useState } from 'react';
import { CheckCircle2, Wallet } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { OPEN_ACCOUNT_TYPES } from '../../../data/level4Mock';

export const OpenAccountModule: React.FC = () => {
  const { openRetailAccount, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [step, setStep] = useState<'select' | 'details' | 'success'>('select');
  const [accountType, setAccountType] = useState<(typeof OPEN_ACCOUNT_TYPES)[number]['id']>('savings');
  const [nickname, setNickname] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const selected = OPEN_ACCOUNT_TYPES.find((t) => t.id === accountType)!;

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 pb-24 -mx-3 bg-slate-50 dark:bg-slate-950 min-h-full">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Account Opened</h2>
        <p className="text-sm text-slate-500 mt-2">{selected.label} is now active.</p>
        <p className="text-xs font-mono font-bold mt-2">{newAccountNumber}</p>
        <button type="button" onClick={() => setRetailTab('accounts')} className="mt-8 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
          View Accounts
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Open New Account" subtitle="Instant digital opening" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        {step === 'select' && (
          <>
            {OPEN_ACCOUNT_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAccountType(t.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  accountType === t.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className="text-xs text-slate-500">{t.rate} • Min ₹{t.minBalance.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </button>
            ))}
            <button type="button" onClick={() => setStep('details')} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
              Continue
            </button>
          </>
        )}

        {step === 'details' && (
          <>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">Opening</p>
              <p className="text-sm font-bold">{selected.label}</p>
            </div>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Account nickname (optional)"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
            <p className="text-[11px] text-slate-500 px-1">
              By continuing you agree to account terms. A zero-balance holding period may apply for NRE accounts.
            </p>
            <button type="button" onClick={() => setShowAuth(true)} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
              Open Account
            </button>
            <button type="button" onClick={() => setStep('select')} className="w-full py-2 text-sm text-slate-500 font-semibold">
              Back
            </button>
          </>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          const acc = openRetailAccount(accountType, nickname || undefined);
          setNewAccountNumber(acc.maskedNumber);
          setShowAuth(false);
          setStep('success');
          addToast({ type: 'success', title: 'Account Opened', message: `${selected.label} created successfully.` });
        }}
        title="Authenticate account opening"
      />
    </div>
  );
};
