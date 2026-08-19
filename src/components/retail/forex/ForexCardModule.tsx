import React, { useState } from 'react';
import { Globe, Plus, RefreshCw } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { FX_RATES } from '../../../data/level5Mock';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED'] as const;

export const ForexCardModule: React.FC = () => {
  const { forexCards, loadForexCard, applyForexCard, accounts, addToast, setRetailTab, setBottomNavHidden, getDefaultDebitAccount } = useBanking();
  const [cardId, setCardId] = useState(forexCards[0]?.id ?? '');
  const [loadCurrency, setLoadCurrency] = useState<(typeof CURRENCIES)[number]>('USD');
  const [loadAmount, setLoadAmount] = useState('');
  const [accountId, setAccountId] = useState(getDefaultDebitAccount().id);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'load' | 'apply'>('load');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const card = forexCards.find((c) => c.id === cardId);
  const inrEquivalent = loadAmount ? Math.ceil(Number(loadAmount) * (FX_RATES[loadCurrency] || 83.5)) : 0;

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Forex Card" subtitle="Multi-currency travel card" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        {forexCards.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <Globe className="w-12 h-12 text-blue-600 mx-auto" />
            <p className="text-sm text-slate-500">No forex card yet. Apply for a multi-currency travel card.</p>
            <button type="button" onClick={() => { setAuthMode('apply'); setShowAuth(true); }} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl">
              Apply Forex Card
            </button>
          </div>
        ) : (
          <>
            {forexCards.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCardId(c.id)}
                className={`w-full p-4 rounded-2xl border text-left ${cardId === c.id ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
              >
                <p className="text-sm font-bold">{c.cardLabel}</p>
                <p className="text-[11px] font-mono text-slate-500">{c.maskedNumber}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {c.balances.map((b) => (
                    <span key={b.currency} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                      {b.symbol}{b.amount} {b.currency}
                    </span>
                  ))}
                </div>
              </button>
            ))}

            {card && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Load Currency</p>
                <select value={loadCurrency} onChange={(e) => setLoadCurrency(e.target.value as typeof loadCurrency)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={loadAmount} onChange={(e) => setLoadAmount(e.target.value.replace(/[^\d.]/g, ''))} placeholder={`Amount in ${loadCurrency}`} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm" />
                {loadAmount && <p className="text-xs text-slate-500">Debit ≈ ₹{inrEquivalent.toLocaleString('en-IN')}</p>}
                <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
                  {accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType)).map((a) => (
                    <option key={a.id} value={a.id}>{a.accountType} {a.maskedNumber}</option>
                  ))}
                </select>
                <button type="button" onClick={() => { setAuthMode('load'); setShowAuth(true); }} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Load Card
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (authMode === 'apply') {
            applyForexCard();
          } else if (card) {
            loadForexCard(card.id, loadCurrency, Number(loadAmount), accountId, inrEquivalent);
            setLoadAmount('');
          }
          setShowAuth(false);
        }}
        title={authMode === 'apply' ? 'Authenticate card application' : 'Authenticate load'}
      />
    </div>
  );
};
