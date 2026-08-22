import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { useCorporateMakerGate } from '../../../../hooks/useCorporateMakerGate';
import { clonePreferences } from '../../../../data/corporateAccountPreferencesMock';
import {
  fetchScheduledPaymentsHomeSummary,
  fetchScheduledPaymentsList,
  getScheduledPaymentsList,
} from '../../../../data/corporateScheduledPaymentsMock';
import type {
  ScheduledPaymentListItem,
  ScheduledPaymentTab,
  ScheduledPaymentsHomeSummary,
} from '../../../../types/corporateScheduledPayments';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard } from '../home/PaymentsHomeUI';
import { ScheduledTabBar } from './ScheduledTabBar';
import { ScheduledPaymentItem } from './ScheduledPaymentItem';
import { ScheduledPaymentsSkeleton } from './ScheduledPaymentsSkeleton';
import { ScheduledPaymentsHeader } from './ScheduledPaymentsHeader';

const VALID_TABS: ScheduledPaymentTab[] = ['upcoming', 'pending_approval', 'completed', 'cancelled'];

export const ScheduledPaymentsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();
  const { canCreatePayment, blockIfChecker } = useCorporateMakerGate();

  const tabParam = searchParams.get('tab') as ScheduledPaymentTab | null;
  const activeTab: ScheduledPaymentTab = VALID_TABS.includes(tabParam as ScheduledPaymentTab)
    ? (tabParam as ScheduledPaymentTab)
    : 'upcoming';

  const [items, setItems] = useState<ScheduledPaymentListItem[]>([]);
  const [summary, setSummary] = useState<ScheduledPaymentsHomeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef(0);

  const hideAmounts = clonePreferences('acc_corp_op_01')?.hideBalance ?? false;

  const tabCounts = useMemo(
    () => ({
      upcoming: getScheduledPaymentsList('upcoming').length,
      pending_approval: getScheduledPaymentsList('pending_approval').length,
      completed: getScheduledPaymentsList('completed').length,
      cancelled: getScheduledPaymentsList('cancelled').length,
    }),
    [items]
  );

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow('scheduled-payments');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, closeDetailFlow, openDetailFlow]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, sum] = await Promise.all([
        fetchScheduledPaymentsList(activeTab),
        fetchScheduledPaymentsHomeSummary(),
      ]);
      setItems(list);
      setSummary(sum);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleTabChange = (tab: ScheduledPaymentTab) => {
    setSearchParams(tab === 'upcoming' ? {} : { tab });
  };

  const handleBack = () => navigate('/corporate/payments');

  const handleCreate = () => {
    if (blockIfChecker('schedule payments')) return;
    navigate('/corporate/payments/scheduled/create');
  };

  const handleSelect = (id: string) => navigate(`/corporate/payments/scheduled/${id}`);

  const handleRefresh = () => load();

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

  return (
    <div
      className="min-h-full bg-slate-50 dark:bg-slate-950 max-w-[430px] mx-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div className="flex justify-center py-2 text-slate-500 dark:text-slate-400 text-xs" style={{ height: pullDistance }}>
          {pullDistance > 72 ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}

      <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 safe-top">
        <ScheduledPaymentsHeader onBack={handleBack} onCreate={canCreatePayment ? handleCreate : undefined} />
        {summary && (
          <div className="px-4 pb-3 grid grid-cols-2 gap-2">
            <PayHomeCard className="p-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Upcoming</p>
              <p className="text-[16px] font-bold mt-0.5">
                {hideAmounts ? '••••••' : formatPaymentCurrency(summary.upcomingTotal, summary.currency)}
              </p>
            </PayHomeCard>
            <PayHomeCard className="p-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pending Approval</p>
              <p className="text-[16px] font-bold mt-0.5">{summary.pendingApprovalCount}</p>
            </PayHomeCard>
          </div>
        )}
        <ScheduledTabBar active={activeTab} onChange={handleTabChange} counts={tabCounts} />
      </header>

      <main className="pb-8">
        {loading ? (
          <ScheduledPaymentsSkeleton />
        ) : items.length === 0 ? (
          <div className="mx-4 mt-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center">
            <CalendarClock className="w-10 h-10 text-slate-500 dark:text-slate-400 mx-auto mb-3" aria-hidden />
            <p className="text-[15px] font-semibold text-slate-900 dark:text-white">
              No {activeTab.replace('_', ' ')} payments
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
              {activeTab === 'upcoming'
                ? 'Scheduled payments will appear here after Checker approval.'
                : `No ${activeTab.replace('_', ' ')} scheduled payments found.`}
            </p>
            {canCreatePayment && activeTab === 'upcoming' && (
              <button
                type="button"
                onClick={handleCreate}
                className="mt-4 text-sm font-semibold text-congress-blue-700 dark:text-congress-blue-400"
              >
                Create Scheduled Payment
              </button>
            )}
          </div>
        ) : (
          <PayHomeCard className="divide-y divide-slate-200 dark:divide-slate-800/80 dark:divide-slate-800" ariaLabel={`${activeTab} scheduled payments`}>
            {items.map((item) => (
              <ScheduledPaymentItem
                key={item.id}
                item={item}
                showBalances={!hideAmounts}
                onSelect={handleSelect}
              />
            ))}
          </PayHomeCard>
        )}
      </main>
    </div>
  );
};
