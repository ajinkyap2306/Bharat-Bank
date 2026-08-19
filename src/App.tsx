import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ScannerModal } from './components/common/ScannerModal';
import { SessionTimeoutSheet } from './components/common/SessionTimeoutSheet';
import { OfflineBanner } from './components/common/OfflineBanner';
import { PwaLifecycle } from './components/common/PwaLifecycle';
import { AuthContainer } from './components/auth/AuthContainer';
import { CorporateOtpRoute } from './components/auth/corporate/CorporateOtpRoute';
import { CorporateDeviceVerificationRoute } from './components/auth/corporate/CorporateDeviceVerificationRoute';
import { CorporateForgotPasswordPlaceholder } from './components/auth/corporate/CorporateForgotPasswordPlaceholder';
import { RetailRegistrationModule } from './components/auth/retail/RetailRegistrationModule';

// Retail Components
import { RetailHome } from './components/retail/RetailHome';
import { RetailAccounts } from './components/retail/RetailAccounts';
import { RetailTransfer } from './components/retail/RetailTransfer';
import { RetailCards } from './components/retail/RetailCards';
import { RetailBills } from './components/retail/RetailBills';
import { RetailDeposits } from './components/retail/RetailDeposits';
import { RetailLoans } from './components/retail/RetailLoans';
import { RetailInvestments } from './components/retail/RetailInvestments';
import { RetailInsurance } from './components/retail/RetailInsurance';
import RetailBeneficiaries from './components/retail/RetailBeneficiaries';
import RetailStatements from './components/retail/RetailStatements';
import { RetailServices } from './components/retail/RetailServices';
import { RetailProfile } from './components/retail/RetailProfile';

// Corporate Components
import { CorporateHome } from './components/corporate/CorporateHome';
import { CorporateApprovals } from './components/corporate/CorporateApprovals';
import { CorporatePayments } from './components/corporate/CorporatePayments';
import { CorporateAccounts } from './components/corporate/CorporateAccounts';
import { CorporatePayroll } from './components/corporate/CorporatePayroll';
import { CorporateCards } from './components/corporate/CorporateCards';
import { CorporateUsers } from './components/corporate/CorporateUsers';
import { CorporateReports } from './components/corporate/CorporateReports';
import { CorporateProfile } from './components/corporate/CorporateProfile';
import { CorporateBeneficiaries } from './components/corporate/CorporateBeneficiaries';
import { CorporateBulkPaymentsModule } from './components/corporate/bulk-payments/CorporateBulkPaymentsModule';
import { CorporateMoreModule } from './components/corporate/more/CorporateMoreModule';
import { CorporateProfileModule } from './components/corporate/profile/CorporateProfileModule';
import { isCorporateBottomNavRoute } from './utils/corporateBottomNav';

const BankingAppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    bankingType, 
    retailTab, 
    corporateTab, 
    setCorporateTab,
    isScannerOpen, 
    closeScanner,
    isBottomNavHidden,
    activeDetailFlow,
  } = useBanking();

  const isRetailHome = bankingType === 'retail' && retailTab === 'home';
  const showGlobalHeader = isRetailHome && !isScannerOpen;

  const isRetailNativeScreen =
    bankingType === 'retail' && ['loans', 'deposits', 'cards', 'insurance'].includes(retailTab);

  const isCorporateRootTab =
    bankingType === 'corporate' && isCorporateBottomNavRoute(location.pathname);

  const showBottomNav =
    isAuthenticated &&
    !isScannerOpen &&
    !isRetailNativeScreen &&
    (bankingType === 'corporate'
      ? isCorporateRootTab && !isBottomNavHidden
      : !isBottomNavHidden && !activeDetailFlow);

  React.useEffect(() => {
    if (!isAuthenticated || bankingType !== 'corporate') return;

    const path = location.pathname;
    const allowedPrefixes = [
      '/corporate/home',
      '/corporate/accounts',
      '/corporate/payments',
      '/corporate/bulk-payments',
      '/corporate/beneficiaries',
      '/corporate/approvals',
      '/corporate/more',
      '/corporate/profile',
    ];
    const isAllowed = allowedPrefixes.some((p) => path === p || path.startsWith(`${p}/`));

    // After login / demo switch the URL may still be "/" — send to corporate home
    if (!path.startsWith('/corporate/')) {
      navigate('/corporate/home', { replace: true });
      return;
    }

    if (!isAllowed) {
      navigate('/corporate/home', { replace: true });
      return;
    }

    if (path.startsWith('/corporate/accounts') && corporateTab !== 'accounts') {
      setCorporateTab('accounts');
    } else if (path.startsWith('/corporate/payments') && corporateTab !== 'payments') {
      setCorporateTab('payments');
    } else if (path.startsWith('/corporate/bulk-payments') && corporateTab !== 'payments') {
      setCorporateTab('payments');
    } else if (
      (path.startsWith('/corporate/beneficiaries') ||
        path.startsWith('/corporate/more') ||
        path.startsWith('/corporate/profile')) &&
      corporateTab !== 'more'
    ) {
      setCorporateTab('more');
    } else if (path.startsWith('/corporate/approvals') && corporateTab !== 'approvals') {
      setCorporateTab('approvals');
    } else if (
      (path === '/corporate/home' || path.startsWith('/corporate/home/')) &&
      corporateTab !== 'home'
    ) {
      setCorporateTab('home');
    }
  }, [isAuthenticated, bankingType, location.pathname, navigate, corporateTab, setCorporateTab]);

  const renderCorporateScreen = () => {
    const path = location.pathname;

    if (path.startsWith('/corporate/bulk-payments')) {
      return <CorporateBulkPaymentsModule />;
    }
    if (path.startsWith('/corporate/profile')) {
      return <CorporateProfileModule />;
    }
    if (path.startsWith('/corporate/beneficiaries')) {
      return <CorporateBeneficiaries />;
    }
    if (path.startsWith('/corporate/more')) {
      return <CorporateMoreModule />;
    }
    if (path.startsWith('/corporate/approvals')) {
      return <CorporateApprovals />;
    }
    if (path.startsWith('/corporate/accounts')) {
      return <CorporateAccounts />;
    }
    if (path.startsWith('/corporate/payments')) {
      return <CorporatePayments />;
    }
    if (path === '/corporate/home' || path.startsWith('/corporate/home/')) {
      return <CorporateHome />;
    }
    if (corporateTab === 'payroll') {
      return <CorporatePayroll />;
    }
    if (corporateTab === 'profile') {
      return <CorporateProfile />;
    }
    // Fallback when tab is home but URL hasn't synced yet
    return <CorporateHome />;
  };

  if (location.pathname === '/retail/register' || location.pathname.startsWith('/retail/register/')) {
    return (
      <>
        <RetailRegistrationModule />
        <ToastContainer />
      </>
    );
  }

  if (!isAuthenticated) {
    return <UnauthenticatedRoutes />;
  }

  return (
    <div className="h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <OfflineBanner />
      <PwaLifecycle />
      {showGlobalHeader && <Header />}

      <main
        className={`flex-1 w-full overflow-y-auto no-scrollbar px-3 ${
          showGlobalHeader ? 'pt-17' : 'pt-0'
        } ${showBottomNav ? 'pb-24' : 'pb-4'}`}
      >
        {bankingType === 'retail' ? (
          <>
            {retailTab === 'home' && <RetailHome />}
            {retailTab === 'accounts' && <RetailAccounts />}
            {(retailTab === 'transfers' || retailTab === 'payments') && <RetailTransfer />}
            {retailTab === 'cards' && <RetailCards />}
            {retailTab === 'bills' && <RetailBills />}
            {retailTab === 'deposits' && <RetailDeposits />}
            {retailTab === 'loans' && <RetailLoans />}
            {retailTab === 'investments' && <RetailInvestments />}
            {retailTab === 'insurance' && <RetailInsurance />}
            {retailTab === 'beneficiaries' && <RetailBeneficiaries />}
            {retailTab === 'statements' && <RetailStatements />}
            {retailTab === 'services' && <RetailServices />}
            {retailTab === 'profile' && <RetailProfile />}
          </>
        ) : (
          renderCorporateScreen()
        )}
      </main>

      <BottomNav />

      <ScannerModal isOpen={isScannerOpen} onClose={closeScanner} />
      <SessionTimeoutSheet />
      <ToastContainer />
    </div>
  );
};

const UnauthenticatedRoutes: React.FC = () => {
  const location = useLocation();
  const isCorporateAuthRoute = location.pathname.startsWith('/corporate/');

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
      <OfflineBanner />
      <PwaLifecycle />
      <Routes>
        <Route path="/retail/register" element={<RetailRegistrationModule />} />
        <Route path="/corporate/login" element={<Navigate to="/" replace />} />
        <Route path="/corporate/otp" element={<CorporateOtpRoute />} />
        <Route
          path="/corporate/device-verification"
          element={<CorporateDeviceVerificationRoute />}
        />
        <Route
          path="/corporate/forgot-password"
          element={<CorporateForgotPasswordPlaceholder />}
        />
        <Route
          path="*"
          element={
            isCorporateAuthRoute ? (
              <Navigate to="/" replace />
            ) : (
              <AuthContainer />
            )
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <BrowserRouter>
        <BankingAppContent />
      </BrowserRouter>
    </BankingProvider>
  );
}
