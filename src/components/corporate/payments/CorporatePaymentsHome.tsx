import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { PaymentsHomeData } from '../../../types/corporatePaymentsHome';
import { fetchPaymentsHome } from '../../../services/corporatePaymentsHomeService';
import { searchPaymentsHome } from '../../../data/corporatePaymentsHomeMock';
import { PaymentsHeader } from './home/PaymentsHeader';
import { MakePaymentCTA } from './home/MakePaymentCTA';
import { PaymentQuickActions } from './home/PaymentQuickActions';
import { PendingApprovalCard } from './home/PendingApprovalCard';
import { ScheduledPayments } from './home/ScheduledPayments';
import { PaymentHistoryPreview } from './home/PaymentHistoryPreview';
import { PaymentTemplates } from './home/PaymentTemplates';
import { PaymentSearch } from './home/PaymentSearch';
import { PaymentsSkeleton, PaymentsErrorState } from './home/PaymentsStates';
import { useCorporateMakerGate } from '../../../hooks/useCorporateMakerGate';

export const CorporatePaymentsHome: React.FC = () => {
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow, addToast } = useBanking();
  const { canCreatePayment, blockIfChecker } = useCorporateMakerGate();

  const [data, setData] = useState<PaymentsHomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    setCorporateTab('payments');
    setBottomNavHidden(false);
    closeDetailFlow();
  }, [setCorporateTab, setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    setBottomNavHidden(showSearch);
  }, [showSearch, setBottomNavHidden]);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(false);
    try {
      const result = await fetchPaymentsHome('acc_corp_op_01');
      setData(result);
    } catch {
      setError(true);
      setData(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const goToRoute = (path: string) => {
    if (path.startsWith('/corporate/payments/create') || path.startsWith('/corporate/bulk-payments/create')) {
      if (blockIfChecker('create payments')) return;
      navigate(path);
      return;
    }
    if (path.startsWith('/corporate/bulk-payments') && path !== '/corporate/bulk-payments') {
      if (blockIfChecker('create bulk payments')) return;
      navigate(path);
      return;
    }
    if (path === '/corporate/payments/scheduled' || path.startsWith('/corporate/payments/scheduled/')) {
      navigate(path);
      return;
    }
    if (path === '/corporate/payments/history') {
      navigate(path);
      return;
    }
    if (path === '/corporate/payments/templates') {
      navigate(path);
      return;
    }
    if (path === '/corporate/payments/mobile-pay') {
      navigate(path);
      return;
    }
    if (path === '/corporate/approvals' || path.startsWith('/corporate/approvals')) {
      setCorporateTab('approvals');
      navigate(path);
      return;
    }
    const paymentDetailMatch = path.match(/^\/corporate\/payments\/([^/]+)\/?$/);
    if (paymentDetailMatch) {
      const segment = paymentDetailMatch[1];
      const reserved = ['history', 'scheduled', 'transfer', 'templates', 'create'];
      if (!reserved.includes(segment)) {
        navigate(path);
        return;
      }
    }
    if (path === '/corporate/bulk-payments' || path.startsWith('/corporate/bulk-payments/')) {
      navigate(path);
      return;
    }
    if (path === '/corporate/beneficiaries' || path.startsWith('/corporate/beneficiaries/')) {
      setCorporateTab('more');
      navigate(path);
      return;
    }
    navigate(path);
  };

  const handleRefresh = () => {
    load(true);
    addToast({ type: 'success', title: 'Payments updated', message: 'Latest payment data refreshed.' });
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

  const pendingApprovalItems =
    data?.pendingPayments.filter((p) => p.status === 'Pending Approval') ?? [];
  const pendingCount = pendingApprovalItems.length;
  const pendingAmount = pendingApprovalItems.reduce((sum, p) => sum + p.amount, 0);

  const headerProps = {
    onSearch: () => setShowSearch(true),
    onHistory: () => goToRoute('/corporate/payments/history'),
  };

  if (isLoading && !data) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <PaymentsHeader {...headerProps} />
        <PaymentsSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <PaymentsHeader {...headerProps} />
        <PaymentsErrorState onRetry={() => load()} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <PaymentsHeader {...headerProps} />
        <PaymentsErrorState onRetry={() => load()} />
      </div>
    );
  }

  return (
    <div
      className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div className="flex justify-center py-2 text-[#0B5CAB]" aria-live="polite">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden />
        </div>
      )}

      <PaymentsHeader {...headerProps} />

      <div className="space-y-4 pt-1">
        {canCreatePayment && (
          <MakePaymentCTA onClick={() => goToRoute('/corporate/payments/create')} />
        )}

        <PaymentQuickActions
          canCreatePayment={canCreatePayment}
          onTransfer={() => goToRoute('/corporate/payments/create/internal-transfer')}
          onMobilePay={() => goToRoute('/corporate/payments/mobile-pay')}
          onScheduled={() => goToRoute('/corporate/payments/scheduled')}
          onBulk={() => goToRoute('/corporate/bulk-payments')}
          onPayroll={() => goToRoute('/corporate/payroll')}
          onBeneficiary={() => goToRoute('/corporate/beneficiaries')}
        />

        <PendingApprovalCard
          count={pendingCount}
          amount={pendingAmount}
          title={canCreatePayment ? 'Pending Approval' : 'Review Approvals'}
          onViewPayments={() => goToRoute('/corporate/approvals')}
        />

        <ScheduledPayments
          items={data.scheduledPayments}
          showBalances
          onViewSchedule={() => goToRoute('/corporate/payments/scheduled')}
          onSelect={(id) => goToRoute(`/corporate/payments/scheduled/${id}`)}
        />

        <PaymentHistoryPreview
          items={data.recentPayments}
          showBalances
          onViewAll={() => goToRoute('/corporate/payments/history')}
          onSelect={(id) => goToRoute(`/corporate/payments/${id}`)}
        />

        {canCreatePayment && (
          <PaymentTemplates
            items={data.templates.slice(0, 2)}
            showBalances
            onViewAll={() => goToRoute('/corporate/payments/templates')}
            onSelect={() => goToRoute('/corporate/payments/templates')}
          />
        )}
      </div>

      <PaymentSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSearch={(q) => searchPaymentsHome(data, q)}
        onSelect={(id) => {
          const pool = [...data.recentPayments, ...data.pendingPayments, ...data.scheduledPayments];
          const item = pool.find((p) => p.id === id);
          if (item?.id.startsWith('sch_')) {
            goToRoute(`/corporate/payments/scheduled/${item.id}`);
            return;
          }
          goToRoute(`/corporate/payments/${item?.paymentId ?? id}`);
        }}
        showBalances
      />
    </div>
  );
};
