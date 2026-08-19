import React, { useState } from 'react';
import { Plane, Globe } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { FX_RATES, LRS_ANNUAL_LIMIT } from '../../../data/level5Mock';

const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'AE', name: 'UAE', currency: 'AED' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
];

export const RemittanceModule: React.FC = () => {
  const { remittanceRequests, submitRemittance, lrsUsedYtd, accounts, addToast, setRetailTab, setBottomNavHidden, getDefaultDebitAccount } = useBanking();
  const [tab, setTab] = useState<'swift' | 'lrs'>('swift');
  const [country, setCountry] = useState(COUNTRIES[0].code);
  const [beneficiary, setBeneficiary] = useState('');
  const [amountInr, setAmountInr] = useState('');
  const [purpose, setPurpose] = useState('Family Maintenance');
  const [accountId, setAccountId] = useState(getDefaultDebitAccount().id);
  const [showAuth, setShowAuth] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const selectedCountry = COUNTRIES.find((c) => c.code === country)!;
  const rate = FX_RATES[selectedCountry.currency] || 83.5;
  const foreignAmt = amountInr ? (Number(amountInr) / rate).toFixed(2) : '0';
  const lrsRemaining = LRS_ANNUAL_LIMIT - lrsUsedYtd;

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="International Remittance" subtitle="SWIFT & LRS transfers" onBack={() => setRetailTab('services')} />

      <div className="flex gap-2 px-1 pt-2">
        {(['swift', 'lrs'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase ${tab === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
            {t === 'swift' ? 'SWIFT Wire' : 'LRS'}
          </button>
        ))}
      </div>

      <div className="pt-3 pb-6 space-y-4">
        {tab === 'lrs' && (
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-xs">
            <p className="font-bold text-blue-800 dark:text-blue-300">LRS limit remaining: ₹{lrsRemaining.toLocaleString('en-IN')}</p>
            <p className="text-slate-500 mt-1">Annual cap ₹{LRS_ANNUAL_LIMIT.toLocaleString('en-IN')} per RBI guidelines.</p>
          </div>
        )}

        <input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Beneficiary name" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.currency})</option>)}
        </select>
        <input value={amountInr} onChange={(e) => setAmountInr(e.target.value.replace(/\D/g, ''))} placeholder="Amount in INR (₹)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        {amountInr && (
          <p className="text-xs text-slate-500 px-1 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> ≈ {selectedCountry.currency} {foreignAmt} @ ₹{rate}/unit</p>
        )}
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
          {['Family Maintenance', 'Education', 'Medical', 'Gift', 'Investment'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
          {accounts.filter((a) => ['Savings', 'Current', 'NRE Savings'].includes(a.accountType)).map((a) => (
            <option key={a.id} value={a.id}>{a.accountType} {a.maskedNumber}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const num = Number(amountInr);
            if (!beneficiary || !num) {
              addToast({ type: 'error', title: 'Incomplete', message: 'Fill beneficiary and amount.' });
              return;
            }
            if (tab === 'lrs' && num > lrsRemaining) {
              addToast({ type: 'error', title: 'LRS Limit', message: 'Amount exceeds remaining LRS limit.' });
              return;
            }
            setShowAuth(true);
          }}
          className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
        >
          <Plane className="w-4 h-4" /> Send Remittance
        </button>

        {remittanceRequests.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-1">Recent</p>
            {remittanceRequests.slice(0, 3).map((r) => (
              <div key={r.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <p className="text-sm font-bold">{r.beneficiaryName}</p>
                  <span className="text-[9px] font-bold uppercase text-slate-500">{r.scheme}</span>
                </div>
                <p className="text-xs text-slate-500">₹{r.amountInr.toLocaleString('en-IN')} → {r.currency} {r.amountForeign} • {r.reference}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          submitRemittance({
            beneficiaryName: beneficiary,
            country: selectedCountry.name,
            currency: selectedCountry.currency,
            amountInr: Number(amountInr),
            amountForeign: Number(foreignAmt),
            purpose,
            accountId,
            scheme: tab === 'lrs' ? 'LRS' : 'SWIFT',
          });
          setShowAuth(false);
          setBeneficiary('');
          setAmountInr('');
        }}
        title="Authenticate remittance"
      />
    </div>
  );
};
