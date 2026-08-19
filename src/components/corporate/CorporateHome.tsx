import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CORPORATE_ENTITIES, CORPORATE_DASHBOARD_NOTIFICATIONS } from '../../data/corporateDashboardMock';
import { useCorporateDashboard } from '../../services/corporateDashboardService';
import { CorporateHeader } from './home/CorporateHeader';
import { CompanySwitcher } from './home/CompanySwitcher';
import { AccountCarousel } from './home/AccountCarousel';
import { QuickActions } from './home/QuickActions';
import { ApprovalAlertCard } from './home/ApprovalAlertCard';
import { ServicesGrid } from './home/ServicesGrid';
import { UpcomingPayments } from './home/UpcomingPayments';
import { RecentTransactions } from './home/RecentTransactions';
import { CorporateNotificationsScreen } from './home/CorporateNotificationsScreen';
import { useCorporateMakerGate } from '../../hooks/useCorporateMakerGate';

export const CorporateHome: React.FC = () => {
  const navigate = useNavigate();
  const { user, setCorporateTab, addToast, setBottomNavHidden, canApproveCorporate, canSubmitCorporatePayment } = useBanking();
  const { blockIfChecker, blockBulkIfChecker } = useCorporateMakerGate();

  const openAccounts = () => {
    setCorporateTab('accounts');
    navigate('/corporate/accounts');
  };

  const [selectedEntityId, setSelectedEntityId] = useState(CORPORATE_ENTITIES[0].id);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);

  const { data, isLoading, isRefreshing, error, refresh, retry } =
    useCorporateDashboard(selectedEntityId);

  const selectedEntity =
    CORPORATE_ENTITIES.find((e) => e.id === selectedEntityId) || CORPORATE_ENTITIES[0];
  const unreadNotifs = CORPORATE_DASHBOARD_NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    setBottomNavHidden(showNotifications || showCompanyPicker);
    return () => setBottomNavHidden(false);
  }, [showNotifications, showCompanyPicker, setBottomNavHidden]);

  const handleRefresh = () => {
    refresh();
    addToast({
      type: 'success',
      title: 'Dashboard updated',
      message: 'Balances and approvals refreshed.',
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

  const goToPayments = () => {
    setCorporateTab('payments');
    navigate('/corporate/payments');
  };

  const goToApprovals = () => {
    setCorporateTab('approvals');
    navigate('/corporate/approvals');
  };

  const goToBeneficiaries = () => {
    setCorporateTab('more');
    navigate('/corporate/beneficiaries');
  };

  const handleServiceClick = (serviceId: string) => {
    switch (serviceId) {
      case 'payments':
        goToPayments();
        break;
      case 'transfers':
        if (blockIfChecker('create transfers')) return;
        setCorporateTab('payments');
        navigate('/corporate/payments/create/internal-transfer');
        break;
      case 'beneficiaries':
        goToBeneficiaries();
        break;
      case 'scheduled':
        setCorporateTab('payments');
        navigate('/corporate/payments/scheduled');
        break;
      case 'bulk':
        if (blockBulkIfChecker()) return;
        setCorporateTab('payments');
        navigate('/corporate/bulk-payments');
        break;
      case 'approvals':
        goToApprovals();
        break;
      case 'statements':
      case 'transactions':
        openAccounts();
        break;
      case 'account-services':
        openAccounts();
        break;
      default:
        addToast({
          type: 'info',
          title: 'Coming soon',
          message: 'This service will be available in a future release.',
        });
    }
  };

  if (error && !data) {
    return (
      <div className="-mx-3 min-h-[60vh] flex flex-col items-center justify-center bg-[#F7F9FC] dark:bg-slate-950 px-6 font-['Inter',sans-serif]">
        <p className="text-base font-semibold text-[#111827] dark:text-white">Unable to load dashboard</p>
        <p className="text-sm text-[#667085] mt-2 text-center">Please try again.</p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 px-5 py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-4 font-['Inter',sans-serif]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div className="flex justify-center py-2 text-[#0B5CAB]" aria-live="polite">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      )}

      <CorporateHeader
        companyName={selectedEntity.name}
        userName={user.name}
        avatarUrl={user.avatar}
        unreadCount={unreadNotifs}
        onProfileClick={() => {
          setCorporateTab('more');
          navigate('/corporate/profile');
        }}
        onCompanyClick={() => setShowCompanyPicker(true)}
        onNotificationsClick={() => setShowNotifications(true)}
        isLoading={isLoading && !data}
      />

      <div className="space-y-4 pb-2 pt-1">
        <AccountCarousel
          accounts={data?.accounts ?? []}
          isLoading={isLoading && !data}
          onAccountClick={() => openAccounts()}
          onAllAccountsClick={openAccounts}
        />

        <QuickActions
          approvalCount={data?.approvalAlert.requestCount ?? 0}
          showApprove={canApproveCorporate}
          showMakePayment={canSubmitCorporatePayment}
          showTransfer={canSubmitCorporatePayment}
          onMakePayment={goToPayments}
          onApprove={goToApprovals}
          onTransfer={() => {
            if (blockIfChecker('create transfers')) return;
            setCorporateTab('payments');
            navigate('/corporate/payments/create/internal-transfer');
          }}
          onBeneficiaries={goToBeneficiaries}
        />

        {data && (
          <ApprovalAlertCard
            alert={data.approvalAlert}
            isLoading={isLoading}
            variant={canApproveCorporate ? 'approver' : 'maker'}
            onReviewApprovals={() => {
              if (canApproveCorporate) {
                goToApprovals();
              } else {
                setCorporateTab('payments');
                navigate('/corporate/payments/history');
              }
            }}
          />
        )}

        <ServicesGrid
          onServiceClick={handleServiceClick}
          canCreatePayment={canSubmitCorporatePayment}
          onAllServicesClick={() => {
            setCorporateTab('more');
            navigate('/corporate/more');
          }}
        />

        <UpcomingPayments
          payments={data?.upcomingPayments ?? []}
          isLoading={isLoading && !data}
          onViewAll={() => {
            setCorporateTab('payments');
            navigate('/corporate/payments/scheduled');
          }}
          onPaymentClick={() => {
            setCorporateTab('payments');
            navigate('/corporate/payments/scheduled');
          }}
        />

        <RecentTransactions
          transactions={data?.recentTransactions ?? []}
          isLoading={isLoading && !data}
          onViewAll={openAccounts}
        />
      </div>

      <CompanySwitcher
        isOpen={showCompanyPicker}
        entities={CORPORATE_ENTITIES}
        selectedId={selectedEntityId}
        onClose={() => setShowCompanyPicker(false)}
        onSelect={(id) => {
          setSelectedEntityId(id);
          setShowCompanyPicker(false);
          const entity = CORPORATE_ENTITIES.find((e) => e.id === id);
          if (entity) {
            addToast({ type: 'info', title: 'Company switched', message: `Viewing ${entity.name}` });
          }
        }}
      />

      {showNotifications && (
        <CorporateNotificationsScreen
          notifications={CORPORATE_DASHBOARD_NOTIFICATIONS}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};
