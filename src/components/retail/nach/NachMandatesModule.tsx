import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { BottomSheet } from '../../common/BottomSheet';
import type { NachMandate } from '../../../data/level3Mock';

export const NachMandatesModule: React.FC = () => {
  const { nachMandates, deleteNachMandate, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [deleteTarget, setDeleteTarget] = useState<NachMandate | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const active = nachMandates.filter((m) => m.status === 'active');
  const inactive = nachMandates.filter((m) => m.status !== 'active');

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="NACH Mandates" subtitle="View and cancel e-mandates" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <p className="text-xs text-slate-500 px-1">
          Mandates registered for auto-debit from your account. Cancelled mandates cannot be reinstated from the app.
        </p>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase px-1">Active ({active.length})</p>
          {active.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No active mandates.</p>
          ) : (
            active.map((m) => (
              <MandateCard key={m.id} mandate={m} onDelete={() => setDeleteTarget(m)} />
            ))
          )}
        </div>

        {inactive.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-1">Inactive</p>
            {inactive.map((m) => (
              <MandateCard key={m.id} mandate={m} />
            ))}
          </div>
        )}
      </div>

      <BottomSheet
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Cancel NACH Mandate?"
      >
        {deleteTarget && (
          <div className="space-y-4 pb-2">
            <p className="text-sm text-slate-600">
              Cancel mandate <span className="font-mono font-bold">{deleteTarget.umrn}</span> for{' '}
              {deleteTarget.utilityName}? Future auto-debits will stop.
            </p>
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              className="w-full py-3.5 bg-rose-600 text-white font-bold rounded-2xl"
            >
              Cancel Mandate
            </button>
          </div>
        )}
      </BottomSheet>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (deleteTarget) {
            deleteNachMandate(deleteTarget.id);
            addToast({ type: 'success', title: 'Mandate Cancelled', message: `UMRN ${deleteTarget.umrn} cancelled.` });
          }
          setShowAuth(false);
          setDeleteTarget(null);
        }}
        title="Authenticate mandate cancellation"
      />
    </div>
  );
};

const MandateCard: React.FC<{ mandate: NachMandate; onDelete?: () => void }> = ({ mandate, onDelete }) => (
  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
    <div className="flex justify-between gap-2">
      <p className="text-sm font-bold">{mandate.utilityName}</p>
      <span
        className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
          mandate.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {mandate.status}
      </span>
    </div>
    <p className="text-[10px] font-mono text-slate-500 mt-1">UMRN: {mandate.umrn}</p>
    <p className="text-xs text-slate-500 mt-2">{mandate.accountLabel}</p>
    <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-slate-400">
      <span>Max ₹{mandate.maxAmount.toLocaleString('en-IN')}</span>
      <span>•</span>
      <span>{mandate.frequency}</span>
      <span>•</span>
      <span>{mandate.startDate} – {mandate.endDate}</span>
    </div>
    {onDelete && mandate.status === 'active' && (
      <button
        type="button"
        onClick={onDelete}
        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-rose-600"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete Mandate
      </button>
    )}
  </div>
);
