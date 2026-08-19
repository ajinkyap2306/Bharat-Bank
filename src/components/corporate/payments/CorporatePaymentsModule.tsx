import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { CorporatePaymentsHome } from './CorporatePaymentsHome';
import { PaymentTypeSelection } from './create/PaymentTypeSelection';
import { VendorBeneficiarySelection } from './create/vendor/VendorBeneficiarySelection';
import { VendorPaymentDetails } from './create/vendor/details/VendorPaymentDetails';
import { VendorPaymentReview } from './create/vendor/review/VendorPaymentReview';
import { PaymentSubmitted } from './create/vendor/submitted/PaymentSubmitted';
import { InternalTransferDetails } from './create/internal-transfer/InternalTransferDetails';
import { InternalTransferReview } from './create/internal-transfer/InternalTransferReview';
import { BankTransferDetails } from './create/bank-transfer/BankTransferDetails';
import { BankTransferReview } from './create/bank-transfer/BankTransferReview';
import { CorporatePaymentDetails } from './tracking/CorporatePaymentDetails';
import { ScheduledPaymentsList } from './scheduled/ScheduledPaymentsList';
import { ScheduledPaymentDetails } from './scheduled/ScheduledPaymentDetails';
import {
  getScheduledCreateStep,
  ScheduledPaymentCreateModule,
} from './scheduled/create/ScheduledPaymentCreateModule';
import { ScheduledPaymentEditModule } from './scheduled/edit/ScheduledPaymentEditModule';
import { PaymentHistoryScreen } from './history/PaymentHistoryScreen';
import { PaymentTemplatesScreen } from './templates/PaymentTemplatesScreen';
import { RouteLoadingState } from '../../common/RouteLoadingState';

const VENDOR_BASE_PATH = '/corporate/payments/create/vendor';
const INTERNAL_BASE_PATH = '/corporate/payments/create/internal-transfer';
const INTERNAL_REVIEW_PATH = '/corporate/payments/create/internal-transfer/review';
const BANK_BASE_PATH = '/corporate/payments/create/bank-transfer';
const BANK_REVIEW_PATH = '/corporate/payments/create/bank-transfer/review';
const RESERVED_PAYMENT_SEGMENTS = ['create', 'history', 'scheduled', 'transfer', 'templates'];
const VENDOR_REVIEW_PATH = '/corporate/payments/create/vendor/review';
const VENDOR_SUBMITTED_PATH = '/corporate/payments/create/vendor/submitted';

export const CorporatePaymentsModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow, addToast } = useBanking();

  const isPaymentsHome = useMemo(() => {
    const path = location.pathname;
    return path === '/corporate/payments' || path === '/corporate/payments/';
  }, [location.pathname]);

  const isVendorSubmitted = useMemo(() => {
    const path = location.pathname;
    return path === VENDOR_SUBMITTED_PATH || path === `${VENDOR_SUBMITTED_PATH}/`;
  }, [location.pathname]);

  const isVendorReview = useMemo(() => {
    const path = location.pathname;
    return path === VENDOR_REVIEW_PATH || path === `${VENDOR_REVIEW_PATH}/`;
  }, [location.pathname]);

  const isVendorPaymentDetails = useMemo(() => {
    if (isVendorReview || isVendorSubmitted) return false;
    return /^\/corporate\/payments\/create\/vendor\/[^/]+\/?$/.test(location.pathname);
  }, [location.pathname, isVendorReview, isVendorSubmitted]);

  const isVendorBeneficiaryList = useMemo(() => {
    const path = location.pathname;
    return path === VENDOR_BASE_PATH || path === `${VENDOR_BASE_PATH}/`;
  }, [location.pathname]);

  const isVendorFlow =
    isVendorBeneficiaryList || isVendorPaymentDetails || isVendorReview || isVendorSubmitted;

  const isInternalTransferReview = useMemo(() => {
    const path = location.pathname;
    return path === INTERNAL_REVIEW_PATH || path === `${INTERNAL_REVIEW_PATH}/`;
  }, [location.pathname]);

  const isInternalTransferDetails = useMemo(() => {
    const path = location.pathname;
    return path === INTERNAL_BASE_PATH || path === `${INTERNAL_BASE_PATH}/`;
  }, [location.pathname]);

  const isInternalTransferFlow = isInternalTransferDetails || isInternalTransferReview;

  const isBankTransferReview = useMemo(() => {
    const path = location.pathname;
    return path === BANK_REVIEW_PATH || path === `${BANK_REVIEW_PATH}/`;
  }, [location.pathname]);

  const isBankTransferDetails = useMemo(() => {
    const path = location.pathname;
    return path === BANK_BASE_PATH || path === `${BANK_BASE_PATH}/`;
  }, [location.pathname]);

  const isBankTransferFlow = isBankTransferDetails || isBankTransferReview;

  const isPaymentTypeSelection = useMemo(() => {
    if (isVendorFlow || isInternalTransferFlow || isBankTransferFlow) return false;
    const path = location.pathname;
    return path === '/corporate/payments/create' || path === '/corporate/payments/create/';
  }, [location.pathname, isVendorFlow, isInternalTransferFlow, isBankTransferFlow]);

  const isPaymentCreateFlow =
    isPaymentTypeSelection || isVendorFlow || isInternalTransferFlow || isBankTransferFlow;

  const isPaymentTracking = useMemo(() => {
    const match = location.pathname.match(/^\/corporate\/payments\/([^/]+)\/?$/);
    if (!match) return false;
    return !RESERVED_PAYMENT_SEGMENTS.includes(match[1]);
  }, [location.pathname]);

  const isScheduledList = useMemo(() => {
    const path = location.pathname;
    return path === '/corporate/payments/scheduled' || path === '/corporate/payments/scheduled/';
  }, [location.pathname]);

  const isScheduledCreate = useMemo(() => {
    return getScheduledCreateStep(location.pathname) !== null;
  }, [location.pathname]);

  const isScheduledEdit = useMemo(() => {
    return /^\/corporate\/payments\/scheduled\/[^/]+\/edit\/?$/.test(location.pathname);
  }, [location.pathname]);

  const isScheduledDetail = useMemo(() => {
    if (isScheduledCreate || isScheduledEdit) return false;
    return /^\/corporate\/payments\/scheduled\/[^/]+\/?$/.test(location.pathname);
  }, [location.pathname, isScheduledCreate, isScheduledEdit]);

  const isPaymentHistory = useMemo(() => {
    const path = location.pathname;
    return path === '/corporate/payments/history' || path === '/corporate/payments/history/';
  }, [location.pathname]);

  const isPaymentTemplates = useMemo(() => {
    const path = location.pathname;
    return path === '/corporate/payments/templates' || path === '/corporate/payments/templates/';
  }, [location.pathname]);

  useEffect(() => {
    setCorporateTab('payments');
  }, [setCorporateTab]);

  useEffect(() => {
    if (!location.pathname.startsWith('/corporate/payments')) return;

    if (isPaymentsHome) {
      setBottomNavHidden(false);
      closeDetailFlow();
      return;
    }

    if (isPaymentCreateFlow || isPaymentTracking || isScheduledDetail || isScheduledCreate || isScheduledEdit || isPaymentTemplates) {
      setBottomNavHidden(true);
      return;
    }

    if (isScheduledList || isPaymentHistory) {
      setBottomNavHidden(true);
      closeDetailFlow();
      return;
    }

    addToast({
      type: 'info',
      title: 'Coming soon',
      message: 'This payment screen will be available in a future update.',
    });
    navigate('/corporate/payments', { replace: true });
  }, [
    location.pathname,
    isPaymentsHome,
    isPaymentCreateFlow,
    isPaymentTracking,
    isScheduledList,
    isPaymentHistory,
    isPaymentTemplates,
    isScheduledDetail,
    isScheduledCreate,
    isScheduledEdit,
    setBottomNavHidden,
    closeDetailFlow,
    navigate,
    addToast,
  ]);

  if (isVendorSubmitted) {
    return <PaymentSubmitted />;
  }

  if (isInternalTransferReview) {
    return <InternalTransferReview />;
  }

  if (isInternalTransferDetails) {
    return <InternalTransferDetails />;
  }

  if (isBankTransferReview) {
    return <BankTransferReview />;
  }

  if (isBankTransferDetails) {
    return <BankTransferDetails />;
  }

  if (isVendorReview) {
    return <VendorPaymentReview />;
  }

  if (isVendorPaymentDetails) {
    return <VendorPaymentDetails />;
  }

  if (isVendorBeneficiaryList) {
    return <VendorBeneficiarySelection />;
  }

  if (isPaymentTypeSelection) {
    return <PaymentTypeSelection />;
  }

  if (isPaymentHistory) {
    return <PaymentHistoryScreen />;
  }

  if (isPaymentTemplates) {
    return <PaymentTemplatesScreen />;
  }

  const scheduledCreateStep = getScheduledCreateStep(location.pathname);

  if (scheduledCreateStep) {
    return <ScheduledPaymentCreateModule step={scheduledCreateStep} />;
  }

  if (isScheduledEdit) {
    return <ScheduledPaymentEditModule />;
  }

  if (isScheduledDetail) {
    return <ScheduledPaymentDetails />;
  }

  if (isScheduledList) {
    return <ScheduledPaymentsList />;
  }

  if (isPaymentTracking) {
    return <CorporatePaymentDetails />;
  }

  if (!isPaymentsHome) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
        <RouteLoadingState label="Redirecting…" />
      </div>
    );
  }

  return <CorporatePaymentsHome />;
};
