import React, { useState } from 'react';
import { Landmark, Building2, TrendingUp } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { BOND_OFFERINGS } from '../../../data/level6Mock';

export const BondsModule: React.FC = () => {
  const { bondHoldings, accounts, investInBond, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [tab, setTab] = useState<'explore' | 'holdings'>('explore');
  const [filter, setFilter] = useState<'all' | 'gsec' | 'sgb' | 'corporate'>('all');
  const [selectedBondId, setSelectedBondId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [showAuth, setShowAuth] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const offerings = BOND_OFFERINGS.filter((b) => filter === 'all' || b.category === filter);
  const selectedBond = BOND_OFFERINGS.find((b) => b.id === selectedBondId);

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Bonds & G-Sec" subtitle="Government & corporate debt" onBack={() => setRetailTab('services')} />

      <div className="flex gap-2 pt-3">
        {(['explore', 'holdings'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize ${tab === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'explore' && (
        <div className="flex gap-1.5 pt-3 overflow-x-auto pb-1">
          {(['all', 'gsec', 'sgb', 'corporate'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${filter === f ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
              {f === 'gsec' ? 'G-Sec' : f}
            </button>
          ))}
        </div>
      )}

      <div className="pt-3 pb-6 space-y-3">
        {tab === 'explore' ? (
          offerings.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex gap-3">
                {b.category === 'corporate' ? <Building2 className="w-8 h-8 text-indigo-600 shrink-0" /> : <Landmark className="w-8 h-8 text-emerald-600 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{b.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{b.couponRate}% p.a. • {b.maturityYears} yr • Min ₹{b.minInvestment.toLocaleString('en-IN')}</p>
                  {b.rating && <span className="text-[9px] font-bold text-blue-600 mt-1 inline-block">{b.rating}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedBondId(b.id); setAmount(String(b.minInvestment)); }}
                className="mt-3 w-full py-2.5 border border-blue-600 text-blue-600 text-xs font-bold rounded-xl"
              >
                Invest
              </button>
            </div>
          ))
        ) : bondHoldings.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No bond holdings yet.</p>
        ) : (
          bondHoldings.map((h) => (
            <div key={h.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between gap-2">
                <p className="text-sm font-bold">{h.bondName}</p>
                <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 mt-1">₹{h.investedAmount.toLocaleString('en-IN')} • {h.units} units • {h.couponRate}% coupon</p>
              <p className="text-[10px] text-slate-400 mt-1">Matures {h.maturityDate} • Bought {h.purchasedOn}</p>
            </div>
          ))
        )}
      </div>

      {selectedBondId && selectedBond && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-3">
            <p className="text-sm font-bold">Invest in {selectedBond.name}</p>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount (₹)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm" />
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.nickname || a.type} — ₹{a.availableBalance.toLocaleString('en-IN')}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={() => setSelectedBondId(null)} className="flex-1 py-3 border border-slate-200 rounded-2xl text-sm font-bold">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  const amt = Number(amount);
                  if (!amt || amt < selectedBond.minInvestment) {
                    addToast({ type: 'error', title: 'Invalid amount', message: `Minimum investment is ₹${selectedBond.minInvestment.toLocaleString('en-IN')}.` });
                    return;
                  }
                  setShowAuth(true);
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (selectedBondId) investInBond(selectedBondId, Number(amount), accountId);
          setShowAuth(false);
          setSelectedBondId(null);
          setAmount('');
          setTab('holdings');
        }}
        title="Confirm bond purchase"
      />
    </div>
  );
};
