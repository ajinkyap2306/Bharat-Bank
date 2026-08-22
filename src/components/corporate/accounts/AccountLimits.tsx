import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import type { AccountLimitsScreenData } from '../../../types/corporateAccountLimits';
import {
  getLimitStatus,
  getUtilizationPercent,
} from '../../../types/corporateAccountLimits';
import { fetchAccountLimits } from '../../../services/corporateAccountLimitsService';
import { AccountLimitsHeader } from './limits/AccountLimitsHeader';
import { LimitsAccountSummary } from './limits/LimitsAccountSummary';
import { DailyLimitCard } from './limits/DailyLimitCard';
import { SingleTransactionLimit } from './limits/SingleTransactionLimit';
import { ApprovalThreshold } from './limits/ApprovalThreshold';
import { PaymentLimits } from './limits/PaymentLimits';
import { BulkPaymentLimit } from './limits/BulkPaymentLimit';
import { PayrollLimit } from './limits/PayrollLimit';
import { BeneficiaryLimit } from './limits/BeneficiaryLimit';
import { LimitUtilization } from './limits/LimitUtilization';
import { LimitReset } from './limits/LimitReset';
import { LimitInfoSheet } from './limits/LimitInfoSheet';
import { LimitChangeRequestCard } from './limits/LimitChangeRequestCard';
import {
  LimitsScreenSkeleton,
  LimitsErrorState,
  NearLimitWarning,
  LimitExceededBanner,
} from './limits/LimitsStates';

interface AccountLimitsProps {
  accountId: string;
}

export const AccountLimits: React.FC<AccountLimitsProps> = ({ accountId }) => {
  const navigate = useNavigate();
  const { setBottomNavHidden, setCorporateTab, addToast, user } = useBanking();

  const [data, setData] = useState<AccountLimitsScreenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setBottomNavHidden(true);
    setCorporateTab('accounts');
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden, setCorporateTab]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAccountLimits(accountId, user.role);
      if (!result) {
        setError('Account limits are not available for this account.');
        setData(null);
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, user.role]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = () => navigate(`/corporate/accounts/${accountId}/preferences`);

  const accountLabel = data
    ? `${data.account.accountType} ${data.account.maskedNumber}`
    : '';

  const showBalances = !data?.hideBalance;
  const currency = data?.account.currency ?? '₹';

  const handleViewTransactions = () => {
    navigate(`/corporate/accounts/${accountId}/transactions`);
  };

  const handleViewBulkRules = () => {
    addToast({
      type: 'info',
      title: 'Bulk Payment Rules',
      message: 'Bulk Payments module will be available in a future update.',
    });
  };

  const handleRequestChange = () => {
    addToast({
      type: 'info',
      title: 'Request Limit Change',
      message:
        'Limit change requests will be submitted via Service Requests (/corporate/service-requests/limit-change).',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950">
        <AccountLimitsHeader accountLabel="" onBack={handleBack} onInfo={() => {}} />
        <LimitsScreenSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950">
        <AccountLimitsHeader accountLabel="" onBack={handleBack} onInfo={() => {}} />
        <LimitsErrorState message={error ?? undefined} onRetry={load} />
      </div>
    );
  }

  const { limits, account } = data;
  const dailyRemaining = Math.max(0, limits.dailyTransferLimit - limits.dailyTransferUsed);
  const dailyStatus = getLimitStatus(
    limits.dailyTransferUsed,
    limits.dailyTransferLimit,
    limits.isRestricted
  );
  const dailyPercent = getUtilizationPercent(
    limits.dailyTransferUsed,
    limits.dailyTransferLimit
  );

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 pb-8">
      <AccountLimitsHeader
        accountLabel={accountLabel}
        onBack={handleBack}
        onInfo={() => setShowInfo(true)}
      />

      <div className="space-y-4 pt-4">
        {dailyStatus === 'exceeded' && <LimitExceededBanner />}

        {dailyStatus === 'near_limit' && dailyPercent >= 80 && (
          <NearLimitWarning
            remaining={dailyRemaining}
            currency={currency}
            showBalances={showBalances}
            onViewTransactions={handleViewTransactions}
          />
        )}

        <LimitsAccountSummary account={account} showBalances={showBalances} />

        <DailyLimitCard
          limit={limits.dailyTransferLimit}
          used={limits.dailyTransferUsed}
          currency={currency}
          showBalances={showBalances}
          restricted={limits.isRestricted}
        />

        <SingleTransactionLimit
          limit={limits.singleTransactionLimit}
          currency={currency}
          showBalances={showBalances}
        />

        <ApprovalThreshold
          threshold={limits.approvalThreshold}
          currency={currency}
          showBalances={showBalances}
        />

        <PaymentLimits
          items={limits.paymentLimits}
          currency={currency}
          showBalances={showBalances}
        />

        <BulkPaymentLimit
          dailyLimit={limits.bulkPaymentDailyLimit}
          maxBatch={limits.bulkPaymentMaxBatch}
          used={limits.bulkPaymentUsed}
          currency={currency}
          showBalances={showBalances}
          onViewRules={handleViewBulkRules}
        />

        <PayrollLimit
          monthlyLimit={limits.payrollMonthlyLimit}
          used={limits.payrollMonthlyUsed}
          currency={currency}
          showBalances={showBalances}
        />

        <BeneficiaryLimit
          dailyLimit={limits.beneficiaryDailyLimit}
          used={limits.beneficiaryDailyUsed}
          currency={currency}
          showBalances={showBalances}
        />

        <LimitUtilization items={limits.utilization} />

        <LimitReset
          dailyReset={limits.resetFrequency.daily}
          monthlyReset={limits.resetFrequency.monthly}
          timezone={limits.resetFrequency.timezone}
        />

        {data.canRequestLimitChange && (
          <LimitChangeRequestCard onRequest={handleRequestChange} />
        )}
      </div>

      <LimitInfoSheet isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};
