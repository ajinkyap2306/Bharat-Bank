import React, { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CORPORATE_PAYMENT_HISTORY } from '../../../../data/corporatePaymentsMock';
import { CorporatePaymentRecord } from '../../../../types/corporatePayments';
import { PayCard, PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';

type HistoryTab = 'All' | 'Pending' | 'Approved' | 'Completed' | 'Failed' | 'Rejected';

const tabStatusMap: Record<HistoryTab, string[] | null> = {
  All: null,
  Pending: ['Pending Approval', 'Processing', 'Scheduled'],
  Approved: ['Approved'],
  Completed: ['Completed'],
  Failed: ['Failed'],
  Rejected: ['Rejected'],
};

interface PaymentHistoryScreenProps {
  onBack: () => void;
  onOpenPayment: (id: string) => void;
  embedded?: boolean;
}

export const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({
  onBack,
  onOpenPayment,
  embedded,
}) => {
  const [tab, setTab] = useState<HistoryTab>('All');
  const [query, setQuery] = useState('');
  const [payments] = useState<CorporatePaymentRecord[]>(CORPORATE_PAYMENT_HISTORY);

  const filtered = useMemo(() => {
    let list = payments;
    const statuses = tabStatusMap[tab];
    if (statuses) list = list.filter((p) => statuses.includes(p.status));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.beneficiaryName.toLowerCase().includes(q) ||
          p.paymentId.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q) ||
          (p.invoiceNumber || '').toLowerCase().includes(q) ||
          String(p.amount).includes(q)
      );
    }
    return list;
  }, [payments, tab, query]);

  const tabs: HistoryTab[] = ['All', 'Pending', 'Approved', 'Completed', 'Failed', 'Rejected'];

  return (
    <div className={embedded ? '' : '-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6'}>
      {!embedded && <ScreenHeader title="Payment History" onBack={onBack} edgeToEdge={false} />}
      <div className="px-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beneficiary, payment ID, invoice..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold ${
                tab === t ? 'bg-congress-blue-700 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <PayCard className="p-6 text-center mx-3">
          <p className="text-sm font-bold">No payments found</p>
        </PayCard>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenPayment(p.id)}
              className="mx-3 w-[calc(100%-1.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 text-left min-h-11"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{p.beneficiaryName}</p>
                  <p className="text-sm font-mono font-bold mt-0.5">{formatPaymentCurrency(p.amount)}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{p.typeLabel} • {p.createdAt}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{p.paymentId}</p>
                </div>
                <PaymentStatusBadge status={p.status} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
