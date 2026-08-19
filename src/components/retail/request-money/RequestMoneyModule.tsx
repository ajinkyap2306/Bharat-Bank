import React, { useState } from 'react';
import { HandCoins, Check, X, Send } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { BottomSheet } from '../../common/BottomSheet';
import { MOBILE_PAY_CONTACTS } from '../../../data/level3Mock';

export const RequestMoneyModule: React.FC = () => {
  const {
    moneyRequests,
    createMoneyRequest,
    respondToMoneyRequest,
    addToast,
    setRetailTab,
    setBottomNavHidden,
  } = useBanking();

  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [showCreate, setShowCreate] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [contactId, setContactId] = useState(MOBILE_PAY_CONTACTS[0]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [payTargetId, setPayTargetId] = useState<string | null>(null);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const filtered = moneyRequests.filter((r) =>
    tab === 'received' ? r.direction === 'received' : r.direction === 'sent'
  );

  const contact = MOBILE_PAY_CONTACTS.find((c) => c.id === contactId);

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader
        title="Request Money"
        subtitle="UPI collect requests"
        onBack={() => setRetailTab('services')}
        rightAction={
          <button type="button" onClick={() => setShowCreate(true)} className="p-2 rounded-xl bg-blue-600 text-white">
            <Send className="w-4 h-4" />
          </button>
        }
      />

      <div className="flex gap-2 px-1 pt-2">
        {(['received', 'sent'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize ${
              tab === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-3 pb-6 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-10">No {tab} requests.</p>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold">{r.counterpartyName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{r.counterpartyUpi}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  r.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {r.status}
                </span>
              </div>
              <p className="text-lg font-extrabold mt-2">₹{r.amount.toLocaleString('en-IN')}</p>
              {r.note && <p className="text-xs text-slate-500 mt-0.5">{r.note}</p>}
              <p className="text-[10px] text-slate-400 mt-1">{r.createdAt}</p>
              {r.status === 'pending' && r.direction === 'received' && (
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => { setPayTargetId(r.id); setShowAuth(true); }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => respondToMoneyRequest(r.id, 'declined')}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <BottomSheet isOpen={showCreate} onClose={() => setShowCreate(false)} title="Request Money">
        <div className="space-y-3 pb-2">
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30">
            <HandCoins className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-slate-600">Send a UPI collect request to a contact.</p>
          </div>
          <select value={contactId} onChange={(e) => setContactId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
            {MOBILE_PAY_CONTACTS.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>
            ))}
          </select>
          <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount (₹)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
          <button
            type="button"
            onClick={() => {
              const num = Number(amount);
              if (!contact || !num) {
                addToast({ type: 'error', title: 'Invalid', message: 'Enter amount and select contact.' });
                return;
              }
              createMoneyRequest({
                counterpartyName: contact.name,
                counterpartyUpi: contact.upiId || `${contact.mobile}@apex`,
                amount: num,
                note,
              });
              setShowCreate(false);
              setAmount('');
              setNote('');
            }}
            className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
          >
            Send Request
          </button>
        </div>
      </BottomSheet>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (payTargetId) respondToMoneyRequest(payTargetId, 'paid');
          setPayTargetId(null);
          setShowAuth(false);
        }}
        title="Authenticate payment"
      />
    </div>
  );
};
