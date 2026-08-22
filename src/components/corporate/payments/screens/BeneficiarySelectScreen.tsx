import React, { useMemo, useState } from 'react';
import { Search, Star, Clock, AlertCircle } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { useBanking } from '../../../../context/BankingContext';
import { Beneficiary } from '../../../../types/banking';
import { PayCard, PaymentStatusBadge } from '../shared/CorporatePaymentsUI';

const EXTRA_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben_corp_abc',
    name: 'ABC Suppliers Ltd.',
    accountNumber: '50200045829101',
    maskedAccount: 'XXXX 4582',
    bankName: 'HDFC Bank',
    ifsc: 'HDFC0000060',
    type: 'corporate_vendor',
    transferLimit: 5000000,
    status: 'active',
    nickname: 'Office Supplies Vendor',
  },
];

type BenTab = 'recent' | 'favourites' | 'all' | 'pending';

interface BeneficiarySelectScreenProps {
  onBack: () => void;
  onSelect: (beneficiaryId: string) => void;
  onAddBeneficiary: () => void;
  selectedId?: string;
}

export const BeneficiarySelectScreen: React.FC<BeneficiarySelectScreenProps> = ({
  onBack,
  onSelect,
  onAddBeneficiary,
  selectedId,
}) => {
  const { beneficiaries } = useBanking();
  const [tab, setTab] = useState<BenTab>('all');
  const [query, setQuery] = useState('');

  const allBens = useMemo(() => {
    const merged = [...beneficiaries];
    EXTRA_BENEFICIARIES.forEach((b) => {
      if (!merged.find((m) => m.id === b.id)) merged.push(b);
    });
    return merged;
  }, [beneficiaries]);

  const filtered = useMemo(() => {
    let list = allBens;
    if (tab === 'pending') list = list.filter((b) => b.status === 'pending_approval');
    else if (tab === 'recent') list = list.slice(0, 3);
    else if (tab === 'favourites') list = list.filter((b) => b.status === 'active').slice(0, 2);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.bankName.toLowerCase().includes(q) ||
          b.maskedAccount.toLowerCase().includes(q) ||
          b.accountNumber.includes(q)
      );
    }
    return list;
  }, [allBens, tab, query]);

  const tabs: { id: BenTab; label: string; icon?: React.ReactNode }[] = [
    { id: 'recent', label: 'Recent', icon: <Clock className="w-3 h-3" /> },
    { id: 'favourites', label: 'Favourites', icon: <Star className="w-3 h-3" /> },
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending Approval', icon: <AlertCircle className="w-3 h-3" /> },
  ];

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Select Beneficiary" onBack={onBack} edgeToEdge={false} />
      <div className="px-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beneficiary, account, bank..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                tab === t.id ? 'bg-congress-blue-700 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <PayCard className="p-6 text-center">
            <p className="text-sm font-bold">No beneficiaries found</p>
          </PayCard>
        ) : (
          filtered.map((ben) => (
            <PayCard key={ben.id} className={`p-4 ${selectedId === ben.id ? 'ring-2 ring-congress-blue-500/30' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{ben.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{ben.bankName}</p>
                  <p className="text-xs font-mono text-slate-900 dark:text-white mt-0.5">{ben.maskedAccount}</p>
                </div>
                <PaymentStatusBadge status={ben.status === 'active' ? 'Completed' : 'Pending Approval'} />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  disabled={ben.status === 'pending_approval'}
                  onClick={() => onSelect(ben.id)}
                  className="flex-1 py-2 rounded-xl bg-congress-blue-700 text-white text-xs font-bold disabled:opacity-50 min-h-11"
                >
                  Select
                </button>
                <button type="button" className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 dark:text-slate-400 min-h-11">
                  View Details
                </button>
              </div>
            </PayCard>
          ))
        )}
      </div>

      <div className="mx-3 mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Don&apos;t see the beneficiary?</p>
        <button type="button" onClick={onAddBeneficiary} className="mt-2 text-sm font-bold text-congress-blue-700 dark:text-congress-blue-400 min-h-11">
          Add New Beneficiary
        </button>
      </div>
    </div>
  );
};
