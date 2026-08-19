import React, { useState } from 'react';
import { CalendarClock, Pause, Play, Trash2, Plus } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { BottomSheet } from '../../common/BottomSheet';
import type { ScheduledTransfer } from '../../../data/level4Mock';

export const ScheduledTransfersModule: React.FC = () => {
  const {
    scheduledTransfers,
    beneficiaries,
    accounts,
    createScheduledTransfer,
    cancelScheduledTransfer,
    toggleScheduledTransferPause,
    addToast,
    setRetailTab,
    setBottomNavHidden,
  } = useBanking();

  const [showCreate, setShowCreate] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<ScheduledTransfer | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authAction, setAuthAction] = useState<'create' | 'cancel'>('create');
  const [pendingCreate, setPendingCreate] = useState<Parameters<typeof createScheduledTransfer>[0] | null>(null);

  const [benId, setBenId] = useState(beneficiaries[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'once' | 'weekly' | 'monthly'>('monthly');
  const [mode, setMode] = useState<'IMPS' | 'NEFT' | 'RTGS' | 'Internal'>('IMPS');
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const active = scheduledTransfers.filter((s) => s.status === 'active' || s.status === 'paused');

  const handleCreate = () => {
    const num = Number(amount);
    const ben = beneficiaries.find((b) => b.id === benId);
    const acc = accounts.find((a) => a.id === accountId);
    if (!ben || !num || num <= 0) {
      addToast({ type: 'error', title: 'Invalid', message: 'Select payee and enter amount.' });
      return;
    }
    setAuthAction('create');
    setPendingCreate({
      beneficiaryName: ben.name,
      beneficiaryAccount: ben.accountNumber,
      bankName: ben.bankName,
      amount: num,
      mode,
      frequency,
      fromAccountLabel: `${acc?.accountType ?? 'Savings'} ${acc?.maskedNumber ?? ''}`,
    });
    setShowCreate(false);
    setShowAuth(true);
  };

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader
        title="Scheduled Transfers"
        subtitle="Future & recurring payments"
        onBack={() => setRetailTab('services')}
        rightAction={
          <button type="button" onClick={() => setShowCreate(true)} className="p-2 rounded-xl bg-blue-600 text-white">
            <Plus className="w-4 h-4" />
          </button>
        }
      />

      <div className="pt-3 pb-6 space-y-3">
        {active.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-10">No scheduled transfers yet.</p>
        ) : (
          active.map((s) => (
            <div key={s.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-sm font-bold">{s.beneficiaryName}</p>
                  <p className="text-[11px] text-slate-500">{s.bankName} • {s.mode}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {s.status}
                </span>
              </div>
              <p className="text-lg font-extrabold mt-2">₹{s.amount.toLocaleString('en-IN')}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                <CalendarClock className="w-3.5 h-3.5" />
                {s.frequency} • Next: {s.nextExecution}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => toggleScheduledTransferPause(s.id)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold flex items-center justify-center gap-1"
                >
                  {s.status === 'paused' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {s.status === 'paused' ? 'Resume' : 'Pause'}
                </button>
                <button
                  type="button"
                  onClick={() => setCancelTarget(s)}
                  className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomSheet isOpen={showCreate} onClose={() => setShowCreate(false)} title="Schedule Transfer">
        <div className="space-y-3 pb-2">
          <select value={benId} onChange={(e) => setBenId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>{b.name} — {b.maskedAccount}</option>
            ))}
          </select>
          <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount (₹)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as typeof frequency)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
            <option value="once">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
            <option value="IMPS">IMPS</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="Internal">Within Bank</option>
          </select>
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
            {accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType)).map((a) => (
              <option key={a.id} value={a.id}>{a.accountType} {a.maskedNumber}</option>
            ))}
          </select>
          <button type="button" onClick={handleCreate} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
            Schedule Payment
          </button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel scheduled transfer?">
        <p className="text-sm text-slate-600 mb-4">This will stop all future executions for this instruction.</p>
        <button
          type="button"
          onClick={() => { setAuthAction('cancel'); setShowAuth(true); }}
          className="w-full py-3.5 bg-rose-600 text-white font-bold rounded-2xl"
        >
          Confirm Cancel
        </button>
      </BottomSheet>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (authAction === 'cancel' && cancelTarget) {
            cancelScheduledTransfer(cancelTarget.id);
            setCancelTarget(null);
          } else if (pendingCreate) {
            createScheduledTransfer(pendingCreate);
            setPendingCreate(null);
          }
          setShowAuth(false);
        }}
        title="Authenticate"
      />
    </div>
  );
};
