import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type {
  AccountStatementData,
  StatementAccountOption,
  StatementDateRange,
  StatementFilters,
  StatementPeriodPreset,
} from '../../../types/corporateAccountStatements';
import { DEFAULT_STATEMENT_FILTERS } from '../../../types/corporateAccountStatements';
import type { CorporateAccountTransaction } from '../../../types/corporateAccounts';
import {
  fetchAccountStatement,
  fetchStatementAccounts,
  getPeriodRange,
} from '../../../services/corporateAccountStatementsService';
import { StatementHeader } from './statements/StatementHeader';
import { StatementAccountSelector } from './statements/StatementAccountSelector';
import { StatementPeriodSelector } from './statements/StatementPeriodSelector';
import { DateRangePicker } from './statements/DateRangePicker';
import { StatementSummary } from './statements/StatementSummary';
import { StatementInsights } from './statements/StatementInsights';
import { StatementSearch } from './statements/StatementSearch';
import { StatementTransactionPreview } from './statements/StatementTransactionPreview';
import { StatementStatusBadge } from './statements/StatementStatusBadge';
import { StatementDownloadActions } from './statements/StatementDownloadActions';
import { StatementShareSheet } from './statements/StatementShareSheet';
import { StatementFilterSheet } from './statements/StatementFilterSheet';
import { StatementPreview } from './statements/StatementPreview';
import {
  StatementSkeleton,
  StatementEmptyState,
  StatementErrorState,
} from './statements/StatementStates';

interface CorporateStatementsProps {
  accountId: string;
}

function filterTransactions(
  txns: CorporateAccountTransaction[],
  query: string,
  filters: StatementFilters
): CorporateAccountTransaction[] {
  let list = txns;
  const q = query.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (t) =>
        t.counterpartyName.toLowerCase().includes(q) ||
        t.referenceNumber.toLowerCase().includes(q) ||
        t.transactionId.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.txnType.toLowerCase().includes(q) ||
        String(t.amount).includes(q)
    );
  }
  if (filters.type !== 'all') {
    list = list.filter((t) => t.type === filters.type);
  }
  if (filters.category !== 'all') {
    list = list.filter((t) => t.txnType.toLowerCase().includes(filters.category.toLowerCase()));
  }
  if (filters.status !== 'all') {
    list = list.filter((t) => t.status.toLowerCase().includes(filters.status.toLowerCase()));
  }
  return list;
}

export const CorporateStatements: React.FC<CorporateStatementsProps> = ({ accountId }) => {
  const navigate = useNavigate();
  const { setBottomNavHidden, setCorporateTab, addToast } = useBanking();

  const [accounts, setAccounts] = useState<StatementAccountOption[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState(accountId);
  const [statement, setStatement] = useState<AccountStatementData | null>(null);
  const [period, setPeriod] = useState<StatementPeriodPreset>('this_month');
  const [customRange, setCustomRange] = useState<StatementDateRange | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [showBalances, setShowBalances] = useState(true);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<StatementFilters>(DEFAULT_STATEMENT_FILTERS);
  const [draftFilters, setDraftFilters] = useState<StatementFilters>(DEFAULT_STATEMENT_FILTERS);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    setBottomNavHidden(true);
    setCorporateTab('accounts');
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden, setCorporateTab]);

  useEffect(() => {
    fetchStatementAccounts().then(setAccounts);
  }, []);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(false);
      try {
        const result = await fetchAccountStatement(
          selectedAccountId,
          period,
          period === 'custom' ? customRange ?? undefined : undefined
        );
        if (!result) setError(true);
        else {
          setStatement(result);
          setLastUpdated(new Date());
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedAccountId, period, customRange]
  );

  useEffect(() => {
    load();
  }, [load]);

  const filteredTransactions = useMemo(() => {
    if (!statement) return [];
    return filterTransactions(statement.transactions, query, filters);
  }, [statement, query, filters]);

  const accountLabel = statement
    ? `${statement.accountName} ${statement.accountNumber}`
    : accounts.find((a) => a.id === selectedAccountId)
      ? `${accounts.find((a) => a.id === selectedAccountId)!.label} ${accounts.find((a) => a.id === selectedAccountId)!.maskedNumber}`
      : 'Loading...';

  const periodLabel = statement
    ? `${statement.fromDate} – ${statement.toDate}`
    : customRange
      ? `${customRange.fromDate} – ${customRange.toDate}`
      : getPeriodRange(period).fromDate + ' – ' + getPeriodRange(period).toDate;

  const handleBack = () => navigate(`/corporate/accounts/${selectedAccountId}`);

  const handleAccountSelect = (id: string) => {
    setSelectedAccountId(id);
    if (id !== accountId) {
      navigate(`/corporate/accounts/${id}/statements`, { replace: true });
    }
  };

  const handlePeriodChange = (p: StatementPeriodPreset) => {
    setPeriod(p);
    setCustomRange(null);
  };

  const handleCustomRange = (range: StatementDateRange) => {
    setCustomRange(range);
    setPeriod('custom');
  };

  const handleDownload = (format: 'PDF' | 'CSV') => {
    addToast({
      type: 'success',
      title: 'Statement Downloaded',
      message: `Statement downloaded successfully as ${format}.`,
    });
  };

  const handleShare = async (format: 'pdf' | 'csv') => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Account Statement',
          text: `Statement for ${accountLabel} (${periodLabel})`,
        });
      } catch {
        addToast({ type: 'info', title: 'Share', message: `Statement ${format.toUpperCase()} link copied.` });
      }
    } else {
      addToast({ type: 'info', title: 'Share', message: 'Sharing is not available on this device.' });
    }
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
    if (pullDistance > 72) load(true);
    pullStartY.current = 0;
    setPullDistance(0);
  };

  const isReady = statement?.status === 'ready';
  const isEmpty = statement?.status === 'ready' && statement.transactionCount === 0;

  if (error && !statement) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 font-['Inter',sans-serif]">
        <StatementHeader
          accountLabel={accountLabel}
          onBack={handleBack}
          onAccountSelect={() => setShowAccountPicker(true)}
        />
        <StatementErrorState onRetry={() => load()} />
      </div>
    );
  }

  return (
    <div
      className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-36 font-['Inter',sans-serif]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div className="flex justify-center py-2 text-[#0B5CAB]" aria-live="polite">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      )}

      <StatementHeader
        accountLabel={accountLabel}
        lastUpdated={lastUpdated ? 'Updated just now' : undefined}
        onBack={handleBack}
        onAccountSelect={() => setShowAccountPicker(true)}
      />

      {isLoading && !statement ? (
        <StatementSkeleton />
      ) : statement ? (
        <div className="space-y-4 pt-2">
          <div className="px-4">
            <button
              type="button"
              onClick={() => setShowAccountPicker(true)}
              className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 shadow-sm min-h-14 text-left"
            >
              <div>
                <p className="text-[12px] text-[#667085]">Account</p>
                <p className="text-[15px] font-semibold text-[#111827] dark:text-white">{statement.accountName}</p>
                <p className="text-[13px] font-mono text-[#667085]">{statement.accountNumber}</p>
              </div>
              <span className="text-[13px] font-semibold text-[#0B5CAB]">Change</span>
            </button>
          </div>

          <StatementPeriodSelector
            selected={period}
            onChange={handlePeriodChange}
            onCustom={() => setShowDatePicker(true)}
            customLabel={
              period === 'custom' && customRange
                ? `${customRange.fromDate} – ${customRange.toDate}`
                : undefined
            }
          />

          {statement.status === 'preparing' ? (
            <div className="mx-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] text-center">
              <RefreshCw className="w-8 h-8 text-[#0B5CAB] animate-spin mx-auto motion-reduce:animate-none" />
              <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-3">
                Preparing your statement...
              </p>
            </div>
          ) : isEmpty ? (
            <StatementEmptyState
              onChangePeriod={() => setShowDatePicker(true)}
              onBack={handleBack}
            />
          ) : (
            <>
              <div className="px-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowBalances((v) => !v)}
                  className="text-[12px] font-semibold text-[#0B5CAB] min-h-11 px-2"
                >
                  {showBalances ? 'Hide Balance' : 'Show Balance'}
                </button>
              </div>

              <StatementSummary statement={statement} showBalances={showBalances} />

              <StatementInsights statement={statement} showBalances={showBalances} />

              <StatementSearch
                query={query}
                onChange={setQuery}
                onFilter={() => {
                  setDraftFilters(filters);
                  setShowFilter(true);
                }}
              />

              <StatementTransactionPreview
                transactions={filteredTransactions}
                currency={statement.currency}
                showBalances={showBalances}
                onViewFull={() => setShowPreview(true)}
              />

              <StatementStatusBadge
                status={statement.status}
                generatedAt={statement.generatedAt}
                periodLabel={periodLabel}
              />

              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="mx-4 w-[calc(100%-2rem)] py-3 rounded-2xl border border-[#0B5CAB]/30 text-[#0B5CAB] text-[14px] font-semibold min-h-12"
              >
                Preview Statement
              </button>
            </>
          )}
        </div>
      ) : null}

      {isReady && !isEmpty && (
        <StatementDownloadActions
          onDownloadPdf={() => handleDownload('PDF')}
          onDownloadCsv={() => handleDownload('CSV')}
          onShare={() => setShowShare(true)}
        />
      )}

      <StatementAccountSelector
        isOpen={showAccountPicker}
        accounts={accounts}
        selectedId={selectedAccountId}
        onClose={() => setShowAccountPicker(false)}
        onSelect={handleAccountSelect}
      />

      <DateRangePicker
        isOpen={showDatePicker}
        initialFrom={customRange?.fromISO ?? getPeriodRange('this_month').fromISO}
        initialTo={customRange?.toISO ?? getPeriodRange('this_month').toISO}
        onClose={() => setShowDatePicker(false)}
        onApply={handleCustomRange}
      />

      <StatementFilterSheet
        isOpen={showFilter}
        filters={draftFilters}
        onChange={setDraftFilters}
        onClose={() => setShowFilter(false)}
        onApply={() => {
          setFilters(draftFilters);
          setShowFilter(false);
        }}
        onReset={() => {
          setDraftFilters(DEFAULT_STATEMENT_FILTERS);
          setFilters(DEFAULT_STATEMENT_FILTERS);
          setShowFilter(false);
        }}
      />

      <StatementShareSheet
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        onShare={handleShare}
      />

      {statement && (
        <StatementPreview
          isOpen={showPreview}
          statement={statement}
          transactions={filteredTransactions}
          showBalances={showBalances}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};
