import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { clonePreferences } from '../../../../data/corporateAccountPreferencesMock';
import {
  countActiveFilters,
  fetchApprovalsDashboard,
  filterApprovalItems,
  searchApprovalItems,
  sortApprovalItems,
} from '../../../../data/corporateApprovalsDashboardMock';
import type {
  ApprovalCategoryTab,
  ApprovalDashboardFilters,
  ApprovalSortOption,
  ApprovalsDashboardData,
} from '../../../../types/corporateApprovalsDashboard';
import { DEFAULT_APPROVAL_FILTERS } from '../../../../types/corporateApprovalsDashboard';
import { ApprovalsHeader } from './ApprovalsHeader';
import { ApprovalSummary } from './ApprovalSummary';
import { ActionRequiredCard } from './ActionRequiredCard';
import { ApprovalCategoryTabs } from './ApprovalCategoryTabs';
import { ApprovalList } from './ApprovalList';
import { ApprovalSearch } from './ApprovalSearch';
import { ApprovalFilterSheet } from './ApprovalFilterSheet';
import { ApprovalSortSheet } from './ApprovalSortSheet';
import { ApprovalsSkeleton } from './ApprovalsSkeleton';
import { ApprovalsEmptyState } from './ApprovalsEmptyState';
import { ApprovalsErrorState } from './ApprovalsErrorState';

const SORT_LABELS: Record<ApprovalSortOption, string> = {
  newest: 'Newest First',
  oldest: 'Oldest First',
  highest_amount: 'Highest Amount',
  lowest_amount: 'Lowest Amount',
  due_date: 'Due Date',
};

export const CorporateApprovals: React.FC = () => {
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow, addToast, getPrimaryCorporateAccount } =
    useBanking();

  const [data, setData] = useState<ApprovalsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [category, setCategory] = useState<ApprovalCategoryTab>('all');
  const [filters, setFilters] = useState<ApprovalDashboardFilters>(DEFAULT_APPROVAL_FILTERS);
  const [sort, setSort] = useState<ApprovalSortOption>('newest');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const accountId = getPrimaryCorporateAccount()?.id ?? 'acc_corp_op_01';
  const hideAmounts = clonePreferences(accountId)?.hideBalance ?? false;

  useEffect(() => {
    setCorporateTab('approvals');
    setBottomNavHidden(false);
    closeDetailFlow();
  }, [setCorporateTab, setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    setBottomNavHidden(showSearch);
  }, [showSearch, setBottomNavHidden]);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const result = await fetchApprovalsDashboard();
      setData(result);
    } catch {
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    const filtered = filterApprovalItems(data.items, category, filters);
    return sortApprovalItems(filtered, sort);
  }, [data, category, filters, sort]);

  const activeFilterCount = countActiveFilters(filters);

  const handleRefresh = () => {
    load(true);
    addToast({
      type: 'success',
      title: 'Approvals updated',
      message: 'Latest approval data refreshed.',
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) pullStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      const dist = Math.max(0, e.touches[0].clientY - pullStartY.current);
      if (dist < 120) setPullDistance(dist);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 72) handleRefresh();
    pullStartY.current = 0;
    setPullDistance(0);
  };

  const handleSelect = (approvalId: string) => {
    navigate(`/corporate/approvals/${approvalId}`);
  };

  const handleReviewNow = () => {
    const first = data?.items.find(
      (i) => i.status === 'pending_yours' && i.type === 'payment'
    );
    if (first) {
      handleSelect(first.approvalId);
      return;
    }
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_APPROVAL_FILTERS);
    setCategory('all');
  };

  if (loading && !data) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ApprovalsHeader onSearch={() => {}} onFilter={() => {}} />
        <ApprovalsSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-28">
        <ApprovalsHeader onSearch={() => {}} onFilter={() => {}} />
        <ApprovalsErrorState onRetry={() => load()} />
      </div>
    );
  }

  const hasPending = data.summary.pendingCount > 0;
  const showNoResults = hasPending && filteredItems.length === 0;
  const showNoPending = !hasPending;

  return (
    <div
      className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-28"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-[12px] gap-2 py-2"
          style={{ height: isRefreshing ? 32 : pullDistance * 0.4 }}
          aria-live="polite"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin motion-reduce:animate-none' : ''}`}
            aria-hidden
          />
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}

      <ApprovalsHeader
        onSearch={() => setShowSearch(true)}
        onFilter={() => setShowFilters(true)}
        filterCount={activeFilterCount}
      />

      <div className="space-y-4 pt-2 max-w-[430px] mx-auto">
        <ApprovalSummary summary={data.summary} hideAmounts={hideAmounts} />
        <ActionRequiredCard
          summary={data.summary}
          hideAmounts={hideAmounts}
          onReviewNow={handleReviewNow}
        />
        <ApprovalCategoryTabs
          active={category}
          counts={data.summary.categoryCounts}
          onChange={setCategory}
        />

        <div ref={listRef}>
          {showNoPending ? (
            <ApprovalsEmptyState variant="no_pending" />
          ) : showNoResults ? (
            <ApprovalsEmptyState variant="no_results" onClearFilters={handleClearFilters} />
          ) : (
            <ApprovalList
              items={filteredItems}
              hideAmounts={hideAmounts}
              onSelect={handleSelect}
              sortLabel={SORT_LABELS[sort]}
              onSort={() => setShowSort(true)}
            />
          )}
        </div>
      </div>

      <ApprovalSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSearch={(q) => searchApprovalItems(data.items, q)}
        onSelect={handleSelect}
        hideAmounts={hideAmounts}
      />

      <ApprovalFilterSheet
        isOpen={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
        onReset={handleClearFilters}
      />

      <ApprovalSortSheet
        isOpen={showSort}
        value={sort}
        onClose={() => setShowSort(false)}
        onSelect={setSort}
      />
    </div>
  );
};
