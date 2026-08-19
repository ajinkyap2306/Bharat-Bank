import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { CORPORATE_BENEFICIARY_SUMMARY } from '../../../../data/corporateBeneficiariesMock';
import { CorporateBeneficiaryRecord, CorporateBeneficiaryTab } from '../../../../types/corporateBeneficiaries';
import { useCorporateMakerGate } from '../../../../hooks/useCorporateMakerGate';
import { ScreenHeader } from '../../../common/ScreenHeader';
import {
  BenCard,
  BenSkeleton,
  BenStatusBadge,
  BEN_TABS,
  formatBenCurrency,
  StickyBenCTA,
} from '../shared/CorporateBeneficiaryUI';
import { BeneficiaryFilterSheet } from '../components/BeneficiaryFilterSheet';

interface BeneficiaryHomeScreenProps {
  beneficiaries: CorporateBeneficiaryRecord[];
  onAdd: () => void;
  onOpen: (id: string) => void;
  onGroups: () => void;
}

export const BeneficiaryHomeScreen: React.FC<BeneficiaryHomeScreenProps> = ({
  beneficiaries,
  onAdd,
  onOpen,
  onGroups,
}) => {
  const navigate = useNavigate();
  const { canCreatePayment, blockIfChecker } = useCorporateMakerGate();
  const [tab, setTab] = useState<CorporateBeneficiaryTab>('all');
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = beneficiaries.filter((b) => b.status !== 'Deleted');
    if (tab === 'pending') list = list.filter((b) => b.status === 'Pending Approval');
    else if (tab === 'active') list = list.filter((b) => b.status === 'Active' || b.status === 'Cooling Period');
    else if (tab === 'blocked') list = list.filter((b) => b.status === 'Blocked');
    if (typeFilter) list = list.filter((b) => b.type === typeFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.companyName.toLowerCase().includes(q) ||
          b.bankName.toLowerCase().includes(q) ||
          b.ifsc.toLowerCase().includes(q) ||
          b.beneficiaryId.toLowerCase().includes(q) ||
          b.maskedAccount.includes(q)
      );
    }
    return list;
  }, [beneficiaries, tab, query, typeFilter]);

  const handleAdd = () => {
    if (blockIfChecker('add beneficiaries')) return;
    onAdd();
  };

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-28">
      <ScreenHeader
        title="Beneficiaries"
        subtitle="Manage business payees"
        onBack={() => navigate('/corporate/more')}
        edgeToEdge={false}
        rightAction={
          <button
            type="button"
            onClick={() => setShowFilter(true)}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center min-h-11 min-w-11"
            aria-label="Filter beneficiaries"
          >
            <Filter className="w-4 h-4 text-[#667085]" />
          </button>
        }
      />

      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, bank, IFSC, account..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
      </div>

      <div className="pt-1 space-y-4">
        {isLoading ? (
          <BenSkeleton className="h-20" />
        ) : (
          <div className="grid grid-cols-3 gap-2 px-3">
            {[
              { label: 'Active', value: CORPORATE_BENEFICIARY_SUMMARY.active },
              { label: 'Pending', value: CORPORATE_BENEFICIARY_SUMMARY.pending },
              { label: 'Blocked', value: CORPORATE_BENEFICIARY_SUMMARY.blocked },
            ].map((s) => (
              <div key={s.label} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 text-center">
                <p className="text-lg font-bold text-[#111827] dark:text-white">{s.value}</p>
                <p className="text-[9px] text-[#667085] font-bold uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-1.5 overflow-x-auto px-3 pb-1 no-scrollbar">
          {BEN_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                tab === t.id ? 'bg-[#0B5CAB] text-white' : 'bg-white dark:bg-slate-900 text-[#667085] border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onGroups}
          className="mx-3 w-[calc(100%-1.5rem)] p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 flex items-center justify-between min-h-11"
        >
          <span className="text-sm font-bold text-[#111827] dark:text-white">Beneficiary Groups</span>
          <ChevronRight className="w-4 h-4 text-[#667085]" />
        </button>

        {isLoading ? (
          <BenSkeleton className="h-36" />
        ) : filtered.length === 0 ? (
          <BenCard className="p-6 text-center">
            <p className="text-sm font-bold text-[#111827] dark:text-white">
              {tab === 'pending' ? "You're all caught up" : 'No beneficiaries yet'}
            </p>
            <p className="text-xs text-[#667085] mt-1">
              {tab === 'all' ? 'Add a vendor, supplier or other business beneficiary.' : 'Try another tab or search.'}
            </p>
            {tab === 'all' && canCreatePayment && (
              <button type="button" onClick={handleAdd} className="mt-3 text-sm font-bold text-[#0B5CAB] min-h-11">
                Add Beneficiary
              </button>
            )}
          </BenCard>
        ) : (
          filtered.map((ben) => (
            <BenCard key={ben.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[#111827] dark:text-white truncate flex-1">{ben.name}</p>
                <BenStatusBadge status={ben.status} />
              </div>

              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-[#667085]">{ben.typeLabel}</p>
                <p className="text-xs text-[#667085]">{ben.bankName}</p>
                <p className="text-xs font-mono text-[#111827] dark:text-white">A/C {ben.maskedAccount}</p>
              </div>

              {ben.status === 'Pending Approval' && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Submitted By</span>
                    <span className="font-medium">{ben.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Submitted</span>
                    <span className="font-medium">{ben.createdDate}</span>
                  </div>
                  <p className="text-[11px] font-bold text-amber-600 pt-1">Pending Checker Approval</p>
                </div>
              )}

              {ben.status === 'Blocked' && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  {ben.blockedReason && (
                    <div>
                      <span className="text-[#667085]">Reason</span>
                      <p className="font-medium mt-0.5">{ben.blockedReason}</p>
                    </div>
                  )}
                  {ben.blockedOn && (
                    <div className="flex justify-between pt-1">
                      <span className="text-[#667085]">Blocked On</span>
                      <span className="font-medium">{ben.blockedOn}</span>
                    </div>
                  )}
                </div>
              )}

              {(ben.status === 'Active' || ben.status === 'Cooling Period') && ben.lastPaymentAmount && (
                <>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
                    <span className="text-[#667085]">Last Payment</span>
                    <span className="font-bold font-mono">{formatBenCurrency(ben.lastPaymentAmount)}</span>
                  </div>
                  {ben.lastPaymentDate && (
                    <p className="text-[10px] text-[#667085] text-right">{ben.lastPaymentDate}</p>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={() => onOpen(ben.id)}
                className="mt-3 w-full flex items-center justify-between text-xs font-bold text-[#0B5CAB] min-h-11"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </BenCard>
          ))
        )}
      </div>

      {canCreatePayment && (
        <StickyBenCTA label="Add Beneficiary" onClick={handleAdd} />
      )}

      <BeneficiaryFilterSheet
        isOpen={showFilter}
        typeFilter={typeFilter}
        onClose={() => setShowFilter(false)}
        onApply={(type) => {
          setTypeFilter(type);
          setShowFilter(false);
        }}
        onClear={() => {
          setTypeFilter(null);
          setShowFilter(false);
        }}
      />
    </div>
  );
};
