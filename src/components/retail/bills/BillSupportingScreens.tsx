import React, { useState } from 'react';
import {
  Search, Trash2, Edit3, Download, Share2,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { BillScreen } from './billTypes';
import { BillLayout, BillCard, BillStatusBadge, StickyBillCTA, getCategoryIcon } from './shared/BillUI';
import { BottomSheet } from '../../common/BottomSheet';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { BILL_CATEGORIES } from '../../../data/billsMockData';
import { BillCategory } from '../../../types/bills';

interface Props {
  onNavigate: (screen: BillScreen, params?: Record<string, string>) => void;
  onBack: () => void;
  onStartPay: (params: { savedBillerId?: string; providerId?: string; category?: BillCategory }) => void;
  params?: Record<string, string>;
}

// Search
export const BillSearchScreen: React.FC<Props> = ({ onBack, onStartPay }) => {
  const { billProviders, billers } = useBanking();
  const [query, setQuery] = useState('');

  const results = query.length >= 2
    ? billProviders.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.includes(query.toLowerCase()))
    : [];

  const popular = billProviders.slice(0, 4);
  const recent = billers.slice(0, 3);

  return (
    <BillLayout title="Search Biller" onBack={onBack}>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by biller, provider, service..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm"
          autoFocus
        />
      </div>
      {results.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">Results</p>
          {results.map((p) => (
            <BillCard key={p.id} onClick={() => onStartPay({ providerId: p.id, category: p.category })}>
              <p className="text-sm font-bold">{p.name}</p>
              <p className="text-xs text-slate-500 capitalize">{p.category.replace('_', ' ')}</p>
            </BillCard>
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Recently Used</p>
          <div className="space-y-2 mb-4">
            {recent.map((b) => (
              <BillCard key={b.id} onClick={() => onStartPay({ savedBillerId: b.id, providerId: b.providerId, category: b.category })}>
                <p className="text-sm font-bold">{b.nickname || b.name}</p>
              </BillCard>
            ))}
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Popular</p>
          <div className="space-y-2">
            {popular.map((p) => (
              <BillCard key={p.id} onClick={() => onStartPay({ providerId: p.id, category: p.category })}>
                <p className="text-sm font-bold">{p.name}</p>
              </BillCard>
            ))}
          </div>
        </>
      )}
    </BillLayout>
  );
};

// History
export const BillHistoryScreen: React.FC<Props> = ({ onNavigate, onBack }) => {
  const { billPaymentHistory } = useBanking();
  const [tab, setTab] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const filtered = billPaymentHistory.filter((p) =>
    tab === 'all' ? true : tab === 'completed' ? p.status === 'completed' : p.status === tab
  );

  return (
    <BillLayout title="Payment History" onBack={onBack}>
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
        {(['all', 'completed', 'pending', 'failed'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-[10px] font-bold rounded-lg capitalize ${
              tab === t ? 'bg-white dark:bg-slate-900 shadow-xs text-congress-blue-700' : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <BillCard className="text-center py-8 text-sm text-slate-500">No payments found</BillCard>
        ) : (
          filtered.map((p) => (
            <BillCard key={p.id} onClick={() => onNavigate('history-detail', { paymentId: p.id })}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(p.category, 'w-4 h-4')}
                  <div>
                    <p className="text-sm font-bold">{p.billerName}</p>
                    <p className="text-xs text-slate-500">{p.paymentDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{p.amount.toLocaleString('en-IN')}</p>
                  <BillStatusBadge status={p.status} />
                </div>
              </div>
            </BillCard>
          ))
        )}
      </div>
    </BillLayout>
  );
};

export const BillHistoryDetailScreen: React.FC<Props> = ({ onNavigate, onBack, params }) => {
  const { billPaymentHistory, addToast } = useBanking();
  const payment = billPaymentHistory.find((p) => p.id === params?.paymentId);

  if (!payment) return <BillLayout title="Payment" onBack={onBack}><p className="text-sm text-slate-500">Not found</p></BillLayout>;

  return (
    <BillLayout title="Payment Details" onBack={onBack}>
      <BillCard className="text-center py-4 mb-3">
        <p className="text-3xl font-black">₹{payment.totalPaid.toLocaleString('en-IN')}</p>
        <BillStatusBadge status={payment.status} />
      </BillCard>
      <BillCard className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Biller</span><span className="font-semibold">{payment.billerName}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Customer</span><span>{payment.customerName}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Bill Number</span><span className="font-mono text-xs">{payment.billNumber}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Payment Date</span><span>{payment.paymentDate}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Debit Account</span><span>{payment.debitAccountType} {payment.debitAccountMasked}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Transaction ID</span><span className="font-mono text-xs">{payment.txnId}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Reference</span><span className="font-mono text-xs">{payment.referenceNumber}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Method</span><span>{payment.paymentMethod}</span></div>
      </BillCard>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button type="button" onClick={() => onNavigate('receipt', { paymentId: payment.id })} className="py-3 rounded-xl border font-bold text-xs">View Receipt</button>
        <button type="button" onClick={() => addToast({ type: 'success', title: 'Downloaded', message: 'Receipt saved.' })} className="py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1"><Download className="w-4 h-4" /> Download</button>
      </div>
    </BillLayout>
  );
};

export const BillReceiptScreen: React.FC<Props> = ({ onBack, params }) => {
  const { billPaymentHistory, addToast } = useBanking();
  const payment = billPaymentHistory.find((p) => p.id === params?.paymentId);
  if (!payment) return null;

  return (
    <BillLayout title="Receipt" onBack={onBack}>
      <BillCard className="text-center space-y-2">
        <p className="text-xs font-bold text-emerald-600 uppercase">Payment Successful</p>
        <p className="text-3xl font-black">₹{payment.totalPaid.toLocaleString('en-IN')}</p>
        <p className="text-sm font-bold">{payment.billerName}</p>
        <div className="border-t border-dashed border-slate-200 pt-3 mt-3 space-y-1.5 text-sm text-left">
          <div className="flex justify-between"><span className="text-slate-500">Customer</span><span>{payment.customerName}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-mono">{payment.consumerNumberMasked}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Bill No.</span><span>{payment.billNumber}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Date</span><span>{payment.paymentDate}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Txn ID</span><span className="font-mono text-xs">{payment.txnId}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Ref</span><span className="font-mono text-xs">{payment.referenceNumber}</span></div>
        </div>
      </BillCard>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button type="button" onClick={() => addToast({ type: 'success', title: 'Downloaded', message: 'Receipt saved to device.' })} className="py-3 rounded-xl bg-congress-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1"><Download className="w-4 h-4" /> Download</button>
        <button type="button" onClick={() => addToast({ type: 'info', title: 'Shared', message: 'Receipt shared.' })} className="py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1"><Share2 className="w-4 h-4" /> Share</button>
      </div>
    </BillLayout>
  );
};

// Saved Billers
export const SavedBillersScreen: React.FC<Props> = ({ onNavigate, onBack, onStartPay }) => {
  const { billers } = useBanking();

  return (
    <BillLayout title="Saved Billers" onBack={onBack} rightAction={
      <button type="button" onClick={() => onNavigate('add-biller')} className="text-xs font-bold text-congress-blue-600">Add</button>
    }>
      <div className="space-y-2 pb-20">
        {billers.map((b) => (
          <BillCard key={b.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  {getCategoryIcon(b.category, 'w-4 h-4')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{b.nickname || b.name}</p>
                  <p className="text-xs text-slate-500">{b.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">•••• {b.consumerNumber.slice(-4)}</p>
                  {b.isAutoPay && <span className="text-[10px] font-bold text-emerald-600">AutoPay enabled</span>}
                </div>
              </div>
              <button type="button" onClick={() => onStartPay({ savedBillerId: b.id, providerId: b.providerId, category: b.category })} className="text-xs font-bold text-congress-blue-600 shrink-0">Pay</button>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => onNavigate('edit-biller', { billerId: b.id })} className="flex-1 py-2 text-xs font-bold text-slate-600 flex items-center justify-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button type="button" onClick={() => onNavigate('autopay', { billerId: b.id })} className="flex-1 py-2 text-xs font-bold text-slate-600">AutoPay</button>
            </div>
          </BillCard>
        ))}
      </div>
      <StickyBillCTA label="Add Biller" onClick={() => onNavigate('add-biller')} />
    </BillLayout>
  );
};

export const AddBillerScreen: React.FC<Props> = ({ onNavigate, onBack, onStartPay }) => (
  <BillLayout title="Add Biller" subtitle="Select a category" onBack={onBack}>
    <div className="grid grid-cols-2 gap-2">
      {BILL_CATEGORIES.filter((c) => c.id !== 'more').map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onStartPay({ category: cat.id as BillCategory })}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2"
        >
          {getCategoryIcon(cat.id as BillCategory)}
          <span className="text-xs font-bold">{cat.label}</span>
        </button>
      ))}
    </div>
  </BillLayout>
);

export const EditBillerScreen: React.FC<Props> = ({ onBack, params }) => {
  const { billers, updateSavedBiller, deleteSavedBiller } = useBanking();
  const biller = billers.find((b) => b.id === params?.billerId);
  const [nickname, setNickname] = useState(biller?.nickname || '');
  const [showDelete, setShowDelete] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authAction, setAuthAction] = useState<'update' | 'delete'>('update');

  if (!biller) return null;

  return (
    <>
      <BillLayout title="Edit Biller" onBack={onBack}>
        <BillCard>
          <label className="text-xs font-semibold text-slate-500">Nickname</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border text-sm" />
          <p className="text-xs text-slate-400 mt-3">Consumer ID: •••• {biller.consumerNumber.slice(-4)} (cannot be edited)</p>
        </BillCard>
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={() => { setAuthAction('update'); setShowAuth(true); }} className="flex-1 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm">Save</button>
          <button type="button" onClick={() => setShowDelete(true)} className="py-3 px-4 rounded-2xl border border-rose-200 text-rose-600"><Trash2 className="w-4 h-4" /></button>
        </div>
      </BillLayout>
      <BottomSheet isOpen={showDelete} onClose={() => setShowDelete(false)} title="Remove this saved biller?">
        <p className="text-sm text-slate-600 mb-4">This biller will be removed from your saved list.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowDelete(false)} className="flex-1 py-3 rounded-2xl border font-bold text-sm">Cancel</button>
          <button type="button" onClick={() => { setShowDelete(false); setAuthAction('delete'); setShowAuth(true); }} className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm">Remove</button>
        </div>
      </BottomSheet>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (authAction === 'update') updateSavedBiller(biller.id, { nickname });
          else { deleteSavedBiller(biller.id); onBack(); }
          setShowAuth(false);
          if (authAction === 'update') onBack();
        }}
        title="Authenticate"
      />
    </>
  );
};

export const AutoPayScreen: React.FC<Props> = ({ onBack, params }) => {
  const { billers, toggleBillerAutoPay, getDefaultDebitAccount } = useBanking();
  const biller = billers.find((b) => b.id === params?.billerId);
  const [enabled, setEnabled] = useState(biller?.isAutoPay || false);
  const [rule, setRule] = useState<'full' | 'max_amount'>(biller?.autoPayRule || 'full');
  const [maxAmount, setMaxAmount] = useState(String(biller?.autoPayMaxAmount || 2000));
  const [showAuth, setShowAuth] = useState(false);

  if (!biller) return null;

  return (
    <>
      <BillLayout title="AutoPay Settings" subtitle={biller.nickname || biller.name} onBack={onBack}>
        <BillCard className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm font-bold">Enable AutoPay</span>
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="w-5 h-5" />
          </label>
          {enabled && (
            <>
              <div className="space-y-2">
                <button type="button" onClick={() => setRule('full')} className={`w-full p-3 rounded-xl border text-left text-sm ${rule === 'full' ? 'border-congress-blue-600' : ''}`}>Pay full bill amount</button>
                <button type="button" onClick={() => setRule('max_amount')} className={`w-full p-3 rounded-xl border text-left text-sm ${rule === 'max_amount' ? 'border-congress-blue-600' : ''}`}>Pay up to maximum amount</button>
              </div>
              {rule === 'max_amount' && (
                <input value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} type="number" className="w-full px-3 py-2 rounded-xl border text-sm" placeholder="Max amount" />
              )}
              <p className="text-xs text-slate-500">Debit from: {getDefaultDebitAccount().accountType} {getDefaultDebitAccount().maskedNumber}</p>
            </>
          )}
        </BillCard>
        <StickyBillCTA label={enabled ? 'Enable AutoPay' : 'Disable AutoPay'} onClick={() => setShowAuth(true)} />
      </BillLayout>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          toggleBillerAutoPay(biller.id, enabled, rule, Number(maxAmount));
          setShowAuth(false);
          onBack();
        }}
        title="Authenticate AutoPay"
      />
    </>
  );
};
