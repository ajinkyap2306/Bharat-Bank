import React, { useMemo, useState } from 'react';
import { Search, Filter, Bell, UserPlus } from 'lucide-react';
import {
  CorporateApprovalRequest,
  ApprovalTab,
  ApprovalSummary,
} from '../../../../types/corporateApprovals';
import {
  ApprovalCard,
  ApprovalListCard,
  ApprovalSkeleton,
  APPROVAL_TABS,
} from '../shared/CorporateApprovalsUI';
import { ApprovalFilterSheet, ApprovalFilters } from '../components/ApprovalFilterSheet';

interface ApprovalsHomeScreenProps {
  requests: CorporateApprovalRequest[];
  summary: ApprovalSummary;
  onOpen: (id: string) => void;
  onDelegate: () => void;
  onReviewNow: () => void;
  selectMode: boolean;
  onToggleSelectMode: () => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onBulkReview: () => void;
}

const DEFAULT_FILTERS: ApprovalFilters = {
  categories: [],
  statuses: [],
  amountRanges: [],
  createdBy: '',
  dateRange: '',
};

export const ApprovalsHomeScreen: React.FC<ApprovalsHomeScreenProps> = ({
  requests,
  summary,
  onOpen,
  onDelegate,
  onReviewNow,
  selectMode,
  onToggleSelectMode,
  selectedIds,
  onToggleSelect,
  onBulkReview,
}) => {
  const [tab, setTab] = useState<ApprovalTab>('pending');
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ApprovalFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = [...requests];
    if (tab === 'pending') list = list.filter((r) => r.status === 'pending');
    else if (tab === 'approved') list = list.filter((r) => r.status === 'approved');
    else if (tab === 'rejected') list = list.filter((r) => r.status === 'rejected');
    else if (tab === 'delegated') list = list.filter((r) => r.status === 'delegated');
    else if (tab === 'history') list = list.filter((r) => ['approved', 'rejected', 'changes_requested'].includes(r.status));

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.beneficiaryName?.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q) ||
          r.createdBy.toLowerCase().includes(q) ||
          (r.amount && r.amount.toString().includes(q))
      );
    }

    if (filters.categories.length) list = list.filter((r) => filters.categories.includes(r.category));
    if (filters.statuses.length) list = list.filter((r) => filters.statuses.includes(r.status));
    if (filters.createdBy) list = list.filter((r) => r.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase()));

    if (filters.amountRanges.length) {
      list = list.filter((r) => {
        const amt = r.amount || 0;
        return filters.amountRanges.some((range) => {
          if (range === 'under1') return amt < 100000;
          if (range === '1to5') return amt >= 100000 && amt < 500000;
          if (range === '5to10') return amt >= 500000 && amt < 1000000;
          if (range === 'above10') return amt >= 1000000;
          return true;
        });
      });
    }

    return list;
  }, [requests, tab, query, filters]);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-28">
      <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 px-3 py-3 safe-top">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-slate-900 dark:text-white">Approvals</h1>
          <div className="flex items-center gap-1">
            <button type="button" className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center min-h-11">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            <button type="button" onClick={() => setShowFilters(true)} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center min-h-11">
              <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
            <button type="button" onClick={onDelegate} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center min-h-11">
              <UserPlus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search approvals..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
      </header>

      {pendingCount > 0 && tab === 'pending' && (
        <div className="px-3 pt-3">
          <ApprovalCard className="p-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Action Required</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Payments</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{summary.payments}</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Beneficiaries</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{summary.beneficiaries}</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Payroll</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{summary.payroll}</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                <p className="text-[10px] text-slate-500 dark:text-slate-400">User Requests</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{summary.userRequests}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-3">{summary.total} items require your attention</p>
            <button type="button" onClick={onReviewNow} className="w-full mt-3 py-3 rounded-xl bg-congress-blue-700 text-white font-bold text-sm min-h-11">
              Review Now
            </button>
          </ApprovalCard>
        </div>
      )}

      <div className="px-3 pt-3 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {APPROVAL_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap min-h-11 ${
                tab === t.id ? 'bg-congress-blue-700 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 pt-3 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
          {tab === 'pending' ? 'Pending Approvals' : tab === 'history' ? 'Approval History' : `${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
        </p>
        {tab === 'pending' && (
          <button type="button" onClick={onToggleSelectMode} className="text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-2">
            {selectMode ? 'Cancel' : 'Select'}
          </button>
        )}
      </div>

      <div className="space-y-2 pt-2">
        {isLoading ? (
          <>
            <ApprovalSkeleton />
            <ApprovalSkeleton />
            <ApprovalSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="px-3 py-12 text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {tab === 'pending' ? "You're all caught up" : tab === 'history' ? 'No approval history' : 'No items found'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {tab === 'pending' ? 'There are no approvals waiting for you.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <ApprovalListCard
              key={item.id}
              item={item}
              onClick={() => onOpen(item.id)}
              selectMode={selectMode}
              selected={selectedIds.includes(item.id)}
              onSelect={() => onToggleSelect(item.id)}
            />
          ))
        )}
      </div>

      {selectMode && selectedIds.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-30 p-3 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-t">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedIds.length} selected</span>
            <button type="button" onClick={onBulkReview} className="px-4 py-2.5 rounded-xl bg-congress-blue-700 text-white font-bold text-sm min-h-11">
              Review & Approve
            </button>
          </div>
        </div>
      )}

      <ApprovalFilterSheet
        open={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={(f) => { setFilters(f); setShowFilters(false); }}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
    </div>
  );
};
