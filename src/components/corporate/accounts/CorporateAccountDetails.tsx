import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { CorporateAccountDetailsData } from '../../../types/corporateAccountDetails';
import type { CorporateAccountTransaction } from '../../../types/corporateAccounts';
import {
  fetchAccountDetails,
  fetchAccountTransactions,
} from '../../../services/corporateAccountDetailsService';
import { AccountDetailsHeader } from './details/AccountDetailsHeader';
import { AccountBalanceCard } from './details/AccountBalanceCard';
import { AccountQuickActions } from './details/AccountQuickActions';
import { RecentTransactions } from './details/RecentTransactions';
import { AccountStatusSection } from './details/AccountStatusSection';
import { AccountInformation } from './details/AccountInformation';
import { AccountPreferencesCard } from './details/AccountPreferencesCard';
import { AccountMoreSheet } from './details/AccountMoreSheet';
import { AccountDetailsError, AccountDetailsSkeleton } from './details/AccountDetailsStates';
import { canManageAccountSettings } from './shared/CorporateAccountsUI';
import { shareAccountDetails } from '../../../utils/shareAccountDetails';

interface CorporateAccountDetailsProps {
  accountId: string;
}

export const CorporateAccountDetails: React.FC<CorporateAccountDetailsProps> = ({ accountId }) => {
  const navigate = useNavigate();
  const {
    primaryCorporateAccountId,
    setBottomNavHidden,
    setCorporateTab,
    addToast,
    user,
  } = useBanking();

  const [data, setData] = useState<CorporateAccountDetailsData | null>(null);
  const [transactions, setTransactions] = useState<CorporateAccountTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [txnLoading, setTxnLoading] = useState(true);
  const [error, setError] = useState(false);
  const [txnError, setTxnError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [expandInfoTrigger, setExpandInfoTrigger] = useState(0);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const infoSectionRef = useRef<HTMLDivElement>(null);

  const canManage = canManageAccountSettings(user.role);
  const isPrimary = accountId === primaryCorporateAccountId || data?.account.isPrimary;

  useEffect(() => {
    setBottomNavHidden(true);
    setCorporateTab('accounts');
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden, setCorporateTab]);

  const loadTransactions = useCallback(async () => {
    setTxnLoading(true);
    setTxnError(false);
    try {
      const txns = await fetchAccountTransactions(accountId);
      setTransactions(txns);
    } catch {
      setTxnError(true);
    } finally {
      setTxnLoading(false);
    }
  }, [accountId]);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(false);
      try {
        const result = await fetchAccountDetails(accountId);
        if (!result) {
          setError(true);
          setData(null);
        } else {
          setData(result);
        }
        await loadTransactions();
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [accountId, loadTransactions]
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = () => navigate('/corporate/accounts');

  const goToPreferences = () => {
    navigate(`/corporate/accounts/${accountId}/preferences`);
  };

  const goToTransactions = () => {
    navigate(`/corporate/accounts/${accountId}/transactions`);
  };

  const goToStatements = () => {
    navigate(`/corporate/accounts/${accountId}/statements`);
  };

  const goToSendMoney = () => {
    setCorporateTab('payments');
    navigate('/corporate/payments/create/bank-transfer');
  };

  const goToReceiveMoney = async () => {
    if (!data?.account) return;
    const result = await shareAccountDetails(
      {
        accountHolder: data.account.nickname,
        accountType: data.account.accountType,
        accountNumber: data.account.accountNumber,
        ifsc: data.account.ifsc,
        branch: data.account.branch,
        bankName: 'Bharat Co-operative Bank',
      },
      (message) => addToast({ type: 'info', title: 'Share', message })
    );
    if (result === 'shared') {
      addToast({ type: 'success', title: 'Shared', message: 'Account details shared successfully.' });
    }
  };

  const goToFreezeAccount = () => {
    navigate(`/corporate/accounts/${accountId}/freeze`);
  };

  const handleTransactionSelect = (transactionId: string) => {
    navigate(`/corporate/accounts/${accountId}/transactions/${transactionId}`);
  };

  const handleDocumentSelect = () => {
    navigate(`/corporate/accounts/${accountId}/statements`);
  };

  const scrollToInformation = () => {
    setExpandInfoTrigger((n) => n + 1);
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const isRestricted = data?.account.displayStatus === 'Restricted';

  if (error && !data) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 ">
        <AccountDetailsHeader
          title="Account Details"
          onBack={handleBack}
          onMore={() => setShowMore(true)}
        />
        <AccountDetailsError onRetry={() => load()} />
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

      <AccountDetailsHeader
        title={data?.account.accountType ?? 'Account Details'}
        subtitle={data?.account.maskedNumber}
        onBack={handleBack}
        onMore={() => setShowMore(true)}
      />

      {isLoading && !data ? (
        <AccountDetailsSkeleton />
      ) : data ? (
        <div className="space-y-4 pt-2 pb-6">
          <AccountBalanceCard
            account={data.account}
            isPrimary={!!isPrimary}
            showBalances={showBalances}
            onToggleVisibility={() => setShowBalances((v) => !v)}
          />

          <AccountQuickActions
            onSendMoney={goToSendMoney}
            onReceiveMoney={goToReceiveMoney}
            onStatement={goToStatements}
            onAccountDetails={scrollToInformation}
            disabled={isRestricted}
          />

          <RecentTransactions
            transactions={transactions}
            currency={data.account.currency}
            showBalances={showBalances}
            isLoading={txnLoading}
            hasError={txnError}
            onRetry={loadTransactions}
            onViewAll={goToTransactions}
            onSelect={handleTransactionSelect}
          />

          <AccountStatusSection
            status={data.account.displayStatus}
            isPrimary={!!isPrimary}
            canManage={canManage}
            onSetPrimary={goToPreferences}
          />

          <div ref={infoSectionRef}>
            <AccountInformation
              account={data.account}
              expandKey={expandInfoTrigger}
            />
          </div>

          <AccountPreferencesCard onClick={goToPreferences} />
        </div>
      ) : null}

      <AccountMoreSheet
        isOpen={showMore}
        canManage={canManage}
        isPrimary={!!isPrimary}
        onClose={() => setShowMore(false)}
        onPreferences={goToPreferences}
        onInformation={scrollToInformation}
        onDocuments={handleDocumentSelect}
        onLimits={() =>
          addToast({ type: 'info', title: 'Limits', message: 'Detailed limits view coming soon.' })
        }
        onSetPrimary={goToPreferences}
        onShare={goToReceiveMoney}
        onFreeze={canManage ? goToFreezeAccount : undefined}
      />
    </div>
  );
};
