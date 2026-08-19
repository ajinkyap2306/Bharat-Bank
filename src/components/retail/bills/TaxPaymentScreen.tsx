import React, { useState } from 'react';
import { CheckCircle2, Landmark } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { TAX_PAYMENT_TYPES } from '../../../data/level3Mock';

interface TaxPaymentScreenProps {
  onBack: () => void;
}

export const TaxPaymentScreen: React.FC<TaxPaymentScreenProps> = ({ onBack }) => {
  const { accounts, getDefaultDebitAccount, addToast, processTaxPayment } = useBanking();
  const defaultDebit = getDefaultDebitAccount();

  const [taxType, setTaxType] = useState(TAX_PAYMENT_TYPES[0].id);
  const [pan, setPan] = useState('ABCDE1234F');
  const [assessmentYear, setAssessmentYear] = useState('2026-27');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(defaultDebit.id);
  const [challanRef, setChallanRef] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  const selectedType = TAX_PAYMENT_TYPES.find((t) => t.id === taxType)!;
  const eligible = accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType) && a.status !== 'frozen');

  const handlePay = () => {
    const num = Number(amount);
    if (!num || num <= 0) {
      addToast({ type: 'error', title: 'Invalid amount', message: 'Enter a valid tax amount.' });
      return;
    }
    setShowAuth(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 pb-24">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Tax Payment Successful</h2>
        <p className="text-xs text-slate-500 mt-2">Challan / CIN: <span className="font-mono font-bold">{challanRef}</span></p>
        <button type="button" onClick={onBack} className="mt-8 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
          Back to Bills
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950">
      <ScreenHeader title="Tax Payment" subtitle="Pay taxes online (demo)" onBack={onBack} />

      <div className="px-4 py-4 space-y-4 pb-24">
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 flex gap-3">
          <Landmark className="w-8 h-8 text-blue-600 shrink-0" />
          <div>
            <p className="text-sm font-bold">{selectedType.label}</p>
            <p className="text-xs text-slate-500">{selectedType.authority}</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500">Tax Type</label>
          <select
            value={taxType}
            onChange={(e) => setTaxType(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          >
            {TAX_PAYMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))} placeholder="PAN" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono" />
        <input value={assessmentYear} onChange={(e) => setAssessmentYear(e.target.value)} placeholder="Assessment Year" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount (₹)" inputMode="numeric" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
          {eligible.map((a) => (
            <option key={a.id} value={a.id}>{a.accountType} {a.maskedNumber}</option>
          ))}
        </select>
        <button type="button" onClick={handlePay} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
          Pay Tax
        </button>
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          const ref = processTaxPayment({
            accountId,
            amount: Number(amount),
            taxType: selectedType.label,
            pan,
            assessmentYear,
          });
          setChallanRef(ref);
          setShowAuth(false);
          setDone(true);
        }}
        title="Authenticate tax payment"
      />
    </div>
  );
};
