import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, RefreshCw } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { CorporateAccountTransaction } from '../../../types/corporateAccounts';
import type { AccountTransactionFilters, AccountTransactionsData } from '../../../types/corporateAccountTransactions';
import { EMPTY_TRANSACTION_FILTERS } from '../../../types/corporateAccountTransactions';
import {
  countActiveFilters,
  fetchAccountTransactionsMeta,
  fetchAccountTransactionsPage,
} from '../../../services/corporateAccountTransactionsService';
import { TransactionsHeader } from './transactions/TransactionsHeader';
import { TransactionBalanceSummary } from './transactions/TransactionBalanceSummary';
import { TransactionSummary } from './transactions/TransactionSummary';
import { TransactionSearchBar } from './transactions/TransactionSearchBar';
import { DateFilterChips } from './transactions/DateFilterChips';
import { TransactionList } from './transactions/TransactionList';
import {
  TransactionEmptyState,
  TransactionErrorState,
} from './transactions/TransactionStates';
import { AccountTransactionFilterSheet } from './transactions/AccountTransactionFilterSheet';
import { TransactionMoreSheet } from './transactions/TransactionMoreSheet';

interface AccountTransactionsProps {
  accountId: string;
}

export const AccountTransactions: React.FC<AccountTransactionsProps> = ({ accountId }) => {
  const navigate = useNavigate();
  const { setBottomNavHidden, setCorporateTab, addToast } = useBanking();

  const [meta, setMeta] = useState<AccountTransactionsData | null>(null);
  const [transactions, setTransactions] = useState<CorporateAccountTransaction[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [metaError, setMetaError] = useState(false);
  const [txnError, setTxnError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [showBalances, setShowBalances] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<AccountTransactionFilters>(EMPTY_TRANSACTION_FILTERS);
  const [draftFilters, setDraftFilters] = useState<AccountTransactionFilters>(EMPTY_TRANSACTION_FILTERS);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const activeFilterCount = countActiveFilters(filters);
  const hasActiveFilters = activeFilterCount > 0 || query.trim().length > 0;

  useEffect(() => {
    setBottomNavHidden(true);
    setCorporateTab('accounts');
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden, setCorporateTab]);

  const loadMeta = useCallback(async () => {
    setMetaError(false);
    try {
      const result = await fetchAccountTransactionsMeta(accountId);
      if (!result) setMetaError(true);
      else setMeta(result);
    } catch {
      setMetaError(true);
    }
  }, [accountId]);

  const loadPage = useCallback(
    async (pageNum: number, append = false) => {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      setTxnError(false);
      try {
        const result = await fetchAccountTransactionsPage(accountId, pageNum, query, filters);
        setTotalFound(result.total);
        setHasMore(result.hasMore);
        setPage(result.page);
        setTransactions((prev) => (append ? [...prev, ...result.items] : result.items));
        setLastUpdated(new Date());
      } catch {
        setTxnError(true);
        if (!append) setTransactions([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [accountId, query, filters]
  );

  const loadAll = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      await loadMeta();
      await loadPage(1, false);
    },
    [loadMeta, loadPage]
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          loadPage(page + 1, true);
        }
      },
      { rootMargin: '120px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, page, loadPage]);

  const handleQuickDate = (date: AccountTransactionFilters['date']) => {
    setFilters((f) => ({ ...f, date }));
  };

  const handleBack = () => navigate(`/corporate/accounts/${accountId}`);

  const handleSelectTxn = (txnId: string) => {
    navigate(`/corporate/accounts/${accountId}/transactions/${txnId}`);
  };

  const clearFilters = () => {
    setQuery('');
    setFilters(EMPTY_TRANSACTION_FILTERS);
    setDraftFilters(EMPTY_TRANSACTION_FILTERS);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) pullStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      setPullDistance(Math.max(0, e.touches[0].clientY - pullStartY.current));
    }
  };
  const handleTouchEnd = () => {
    if (pullDistance > 72) loadAll(true);
    pullStartY.current = 0;
    setPullDistance(0);
  };

  const countLabel = (() => {
    if (hasActiveFilters) return `${totalFound} transactions found`;
    if (filters.date === 'today') return `${meta?.summary.todayCount ?? 0} transactions today`;
    return `${meta?.summary.transactionCount ?? 0} transactions`;
  })();

  if (metaError && !meta) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 ">
        <TransactionsHeader
          accountLabel="Account"
          onBack={handleBack}
          onSearchToggle={() => setShowSearch((v) => !v)}
          onMore={() => setShowMore(true)}
          showSearch={showSearch}
        />
        <TransactionErrorState onRetry={() => loadAll()} />
      </div>
    );
  }

  return (
    <div
      className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-6 "
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div className="flex justify-center py-2 text-congress-blue-700 dark:text-congress-blue-400" aria-live="polite">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      )}

      <TransactionsHeader
        accountLabel={meta?.accountLabel ?? 'Loading...'}
        onBack={handleBack}
        onSearchToggle={() => setShowSearch((v) => !v)}
        onMore={() => setShowMore(true)}
        showSearch={showSearch}
      />

      <div className="space-y-3 pt-2">
        <TransactionBalanceSummary
          availableBalance={meta?.availableBalance ?? 0}
          currentBalance={meta?.currentBalance ?? 0}
          currency={meta?.currency ?? '₹'}
          showBalances={showBalances}
          onToggleVisibility={() => setShowBalances((v) => !v)}
          isLoading={isLoading && !meta}
        />

        {meta && (
          <TransactionSummary
            summary={meta.summary}
            currency={meta.currency}
            showBalances={showBalances}
            isLoading={isLoading && !meta}
          />
        )}

        <TransactionSearchBar
          query={query}
          onChange={setQuery}
          onFilter={() => {
            setDraftFilters(filters);
            setShowFilters(true);
          }}
          activeFilterCount={activeFilterCount}
          visible={showSearch}
        />

        <div className="px-4 flex items-center justify-between gap-2">
          {!showSearch && (
            <button
              type="button"
              onClick={() => {
                setDraftFilters(filters);
                setShowFilters(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[13px] font-semibold text-slate-500 dark:text-slate-400 min-h-9"
            >
              <Filter className="w-4 h-4" />
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          )}
          <p className="text-[12px] text-slate-500 dark:text-slate-400 ml-auto">{countLabel}</p>
        </div>

        <DateFilterChips active={filters.date} onChange={handleQuickDate} />

        {txnError && meta ? (
          <TransactionErrorState onRetry={() => loadPage(1, false)} />
        ) : !isLoading && transactions.length === 0 ? (
          <TransactionEmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        ) : (
          <>
            <TransactionList
              transactions={transactions}
              currency={meta?.currency ?? '₹'}
              showBalances={showBalances}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              onSelect={handleSelectTxn}
            />
            <div ref={loadMoreRef} className="h-1" aria-hidden />
          </>
        )}
      </div>

      <AccountTransactionFilterSheet
        isOpen={showFilters}
        filters={draftFilters}
        onChange={setDraftFilters}
        onClose={() => setShowFilters(false)}
        onApply={() => {
          setFilters(draftFilters);
          setShowFilters(false);
        }}
        onReset={() => {
          setDraftFilters(EMPTY_TRANSACTION_FILTERS);
          setFilters(EMPTY_TRANSACTION_FILTERS);
        }}
      />

      <TransactionMoreSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        onExport={(type) => {
          addToast({
            type: 'info',
            title: 'Export',
            message: `${type === 'csv' ? 'CSV export' : type === 'download' ? 'Download' : 'Share'} will be available in Statements / Reports.`,
          });
        }}
      />
    </div>
  );
};
