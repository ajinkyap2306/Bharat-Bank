import React, { useState } from 'react';
import { Lock, Calendar } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';

const SIZES = [
  { id: 'small' as const, label: 'Small (3×5 in)', rent: 3500 },
  { id: 'medium' as const, label: 'Medium (5×7 in)', rent: 4500 },
  { id: 'large' as const, label: 'Large (7×10 in)', rent: 6500 },
];

const BRANCHES = ['Bandra Kurla Complex, Mumbai', 'Connaught Place, New Delhi', 'MG Road, Bengaluru'];

export const LockerModule: React.FC = () => {
  const { lockerApplications, applyLocker, bookLockerVisit, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [size, setSize] = useState<(typeof SIZES)[number]['id']>('medium');
  const [visitDate, setVisitDate] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'apply' | 'visit'>('apply');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const active = lockerApplications.filter((l) => l.status === 'active');

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Safe Deposit Locker" subtitle="Apply & book visits" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-3">
          <Lock className="w-8 h-8 text-slate-600 shrink-0" />
          <p className="text-xs text-slate-600">Secure storage for valuables. Annual rent debited from linked account.</p>
        </div>

        {active.map((l) => (
          <div key={l.id} className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60">
            <p className="text-sm font-bold">Locker {l.lockerNumber} — {l.branchName}</p>
            <p className="text-xs text-slate-500 capitalize">{l.lockerSize} • ₹{l.annualRent}/year</p>
          </div>
        ))}

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs font-bold text-slate-500">New Locker Application</p>
          <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={size} onChange={(e) => setSize(e.target.value as typeof size)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            {SIZES.map((s) => <option key={s.id} value={s.id}>{s.label} — ₹{s.rent}/yr</option>)}
          </select>
          <button type="button" onClick={() => { setAuthMode('apply'); setShowAuth(true); }} className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl">
            Apply for Locker
          </button>
        </div>

        {active.length > 0 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Book Locker Visit</p>
            <input value={visitDate} onChange={(e) => setVisitDate(e.target.value)} placeholder="Visit date (e.g. 25 Aug 2026)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm" />
            <button
              type="button"
              onClick={() => {
                if (!visitDate) {
                  addToast({ type: 'error', title: 'Date required', message: 'Enter visit date.' });
                  return;
                }
                setAuthMode('visit');
                setShowAuth(true);
              }}
              className="w-full py-3 border border-blue-600 text-blue-600 font-bold rounded-2xl"
            >
              Book Visit
            </button>
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (authMode === 'apply') {
            const rent = SIZES.find((s) => s.id === size)!.rent;
            applyLocker({ branchName: branch, lockerSize: size, annualRent: rent });
          } else if (active[0]) {
            bookLockerVisit(active[0].id, visitDate);
            setVisitDate('');
          }
          setShowAuth(false);
        }}
        title="Authenticate"
      />
    </div>
  );
};
