import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { fetchAccountsOverview } from '../../../../services/corporateAccountsOverviewService';
import type { AccountsOverviewData } from '../../../../types/corporateAccountsOverview';
import { AccountsHeader } from '../overview/AccountsHeader';
import { TotalBalanceCard } from '../overview/TotalBalanceCard';
import { AccountsCarousel } from '../overview/AccountsCarousel';
import { AccountsQuickActions } from '../overview/AccountsQuickActions';
import { AccountsEmptyState } from '../overview/AccountsEmptyState';
import { AccountsErrorState } from '../overview/AccountsErrorState';
import { AccountsSkeleton } from '../shared/CorporateAccountsUI';
import { AccountSearchOverlay } from '../components/AccountSearchOverlay';
import { CorpSectionHeader } from '../../home/shared/CorporateHomeUI';

export const AccountsOverviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { primaryCorporateAccountId, isCorporateAccountHidden, setCorporateTab, setBottomNavHidden } =
    useBanking();

  const [data, setData] = useState<AccountsOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(false);
    try {
      const result = await fetchAccountsOverview();
      setData(result);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setCorporateTab('accounts');
  }, [setCorporateTab]);

  useEffect(() => {
    setBottomNavHidden(showSearch);
    return () => setBottomNavHidden(false);
  }, [showSearch, setBottomNavHidden]);

  const visibleAccounts = useMemo(() => {
    if (!data) return [];
    return data.accounts.filter((a) => !isCorporateAccountHidden(a.id));
  }, [data, isCorporateAccountHidden]);

  const handleRefresh = () => load(true);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) pullStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      setPullDistance(Math.max(0, e.touches[0].clientY - pullStartY.current));
    }
  };
  const handleTouchEnd = () => {
    if (pullDistance > 72) handleRefresh();
    pullStartY.current = 0;
    setPullDistance(0);
  };

  const openAccount = (accountId: string) => {
    navigate(`/corporate/accounts/${accountId}`);
  };

  const primaryId = primaryCorporateAccountId ?? visibleAccounts[0]?.id ?? 'acc_corp_op_01';

  const goPayments = () => {
    setCorporateTab('payments');
    navigate('/corporate/payments');
  };

  if (error && !data) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950  pb-4">
        <AccountsHeader onSearch={() => setShowSearch(true)} />
        <AccountsErrorState onRetry={() => load()} />
      </div>
    );
  }

  return (
    <div
      className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-24 "
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div className="flex justify-center py-2 text-congress-blue-700 dark:text-congress-blue-400" aria-live="polite">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      )}

      <AccountsHeader onSearch={() => setShowSearch(true)} />

      <div className="space-y-3 pt-1">
        <TotalBalanceCard
          balance={data?.balance ?? { totalBalance: 0, availableBalance: 0, accountCount: 0 }}
          showBalances={showBalances}
          onToggleVisibility={() => setShowBalances((v) => !v)}
          isLoading={isLoading && !data}
        />

        <AccountsQuickActions
          onSendMoney={() => {
            setCorporateTab('payments');
            navigate('/corporate/payments/create/bank-transfer');
          }}
          onTransfer={() => {
            setCorporateTab('payments');
            navigate('/corporate/payments/create/internal-transfer');
          }}
          onStatement={() => navigate(`/corporate/accounts/${primaryId}/statements`)}
          onTransactions={() => navigate(`/corporate/accounts/${primaryId}/transactions`)}
        />

        <CorpSectionHeader title="Your Accounts" badge={`${visibleAccounts.length}`} />

        {isLoading && !data ? (
          <AccountsSkeleton className="h-28 mx-4 rounded-2xl" />
        ) : visibleAccounts.length === 0 ? (
          <AccountsEmptyState />
        ) : (
          <AccountsCarousel
            accounts={visibleAccounts}
            primaryAccountId={primaryCorporateAccountId}
            showBalances={showBalances}
            onSelect={openAccount}
          />
        )}
      </div>

      <AnimatePresence>
        {showSearch && data && (
          <AccountSearchOverlay
            accounts={visibleAccounts}
            onClose={() => setShowSearch(false)}
            onSelect={(id) => {
              setShowSearch(false);
              openAccount(id);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
