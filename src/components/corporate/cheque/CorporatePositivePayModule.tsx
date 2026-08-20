import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';

export const CorporatePositivePayModule: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, addToast, setBottomNavHidden } = useBanking();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');
  const [chequeNumber, setChequeNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const submit = () => {
    if (!chequeNumber.trim() || !amount || !payeeName.trim() || !chequeDate) {
      addToast({ type: 'error', title: 'Incomplete', message: 'Fill all cheque details.' });
      return;
    }
    setShowAuth(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 -mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Positive Pay Registered</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-xs">
          Reference: <span className="font-mono font-bold">{reference}</span>
        </p>
        <button
          type="button"
          onClick={() => navigate('/corporate/more')}
          className="mt-8 w-full max-w-sm py-3.5 bg-[#0B5CAB] text-white font-bold rounded-2xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-8">
      <ScreenHeader
        title="Positive Pay"
        subtitle="Register high-value cheques for added security"
        onBack={() => navigate('/corporate/more')}
      />

      <div className="pt-3 space-y-3">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Cheques above ₹50,000 should be registered before issuance. Unregistered cheques may be rejected at clearing.
          </p>
        </div>

        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.nickname || acc.accountType} — {acc.maskedNumber}
            </option>
          ))}
        </select>

        <input
          value={chequeNumber}
          onChange={(e) => setChequeNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Cheque number (6 digits)"
          inputMode="numeric"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
          placeholder="Cheque amount (₹)"
          inputMode="decimal"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
        <input
          value={payeeName}
          onChange={(e) => setPayeeName(e.target.value)}
          placeholder="Payee name"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
        <input
          type="date"
          value={chequeDate}
          onChange={(e) => setChequeDate(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />

        <button
          type="button"
          onClick={submit}
          className="w-full py-3.5 bg-[#0B5CAB] text-white font-bold rounded-2xl mt-2"
        >
          Register Positive Pay
        </button>
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          const ref = `PP-${Date.now().toString().slice(-8)}`;
          setReference(ref);
          setShowAuth(false);
          setDone(true);
          addToast({ type: 'success', title: 'Positive Pay Registered', message: `Reference: ${ref}` });
        }}
        title="Authenticate registration"
      />
    </div>
  );
};
