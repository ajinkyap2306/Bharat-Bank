import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { RouteLoadingState } from '../../common/RouteLoadingState';
import { BulkPaymentsHome } from './BulkPaymentsHome';
import { CreateBulkPayment } from './CreateBulkPayment';
import { BulkPaymentReview } from './review/BulkPaymentReview';
import { BulkPaymentSubmitted } from './submitted/BulkPaymentSubmitted';
import { BulkPaymentResults } from './results/BulkPaymentResults';
import { BulkBatchDetailsScreen } from './details/BulkBatchDetailsScreen';

const BULK_HOME = '/corporate/bulk-payments';

export const CorporateBulkPaymentsModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const isHome = useMemo(() => {
    const path = location.pathname;
    return path === BULK_HOME || path === `${BULK_HOME}/`;
  }, [location.pathname]);

  const isCreate = useMemo(() => {
    const path = location.pathname;
    return path === `${BULK_HOME}/create` || path === `${BULK_HOME}/create/`;
  }, [location.pathname]);

  const isReview = useMemo(() => {
    return /^\/corporate\/bulk-payments\/[^/]+\/review\/?$/.test(location.pathname);
  }, [location.pathname]);

  const isSubmitted = useMemo(() => {
    return /^\/corporate\/bulk-payments\/[^/]+\/submitted\/?$/.test(location.pathname);
  }, [location.pathname]);

  const isResults = useMemo(() => {
    return /^\/corporate\/bulk-payments\/[^/]+\/results\/?$/.test(location.pathname);
  }, [location.pathname]);

  const isDetails = useMemo(() => {
    return /^\/corporate\/bulk-payments\/[^/]+\/details\/?$/.test(location.pathname);
  }, [location.pathname]);

  const isDetailFlow = isCreate || isReview || isSubmitted || isResults || isDetails;
  const isInvalidRoute = !isHome && !isDetailFlow;

  useEffect(() => {
    setCorporateTab('payments');
  }, [setCorporateTab]);

  useEffect(() => {
    if (!location.pathname.startsWith('/corporate/bulk-payments')) return;

    setBottomNavHidden(true);
    openDetailFlow('corporate-bulk-payments');
  }, [location.pathname, setBottomNavHidden, openDetailFlow]);

  useEffect(() => {
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    if (!location.pathname.startsWith('/corporate/bulk-payments')) return;
    if (isInvalidRoute) {
      navigate(BULK_HOME, { replace: true });
    }
  }, [location.pathname, isInvalidRoute, navigate]);

  if (isDetails) {
    return <BulkBatchDetailsScreen />;
  }

  if (isResults) {
    return <BulkPaymentResults />;
  }

  if (isSubmitted) {
    return <BulkPaymentSubmitted />;
  }

  if (isReview) {
    return <BulkPaymentReview />;
  }

  if (isCreate) {
    return <CreateBulkPayment />;
  }

  if (isInvalidRoute) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
        <RouteLoadingState label="Redirecting…" />
      </div>
    );
  }

  return <BulkPaymentsHome />;
};
