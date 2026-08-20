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
import { RetailRegistrationModule } from './components/auth/retail/RetailRegistrationModule';
import { RegistrationEntry } from './components/auth/RegistrationEntry';
import { CorporateRegistrationModule } from './components/auth/corporate/CorporateRegistrationModule';
import { ForgotPasswordModule } from './components/auth/ForgotPasswordModule';
import { ForgotMpinModule } from './components/auth/ForgotMpinModule';
import { PreLoginModule } from './components/auth/prelogin/PreLoginModule';

// Retail Components
import { RetailHome } from './components/retail/RetailHome';
import { RetailAccountsModule } from './components/retail/accounts/RetailAccountsModule';
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
import { ChequeServicesModule } from './components/retail/cheque/ChequeServicesModule';
import { EPassbookModule } from './components/retail/epassbook/EPassbookModule';
import { EStatementModule } from './components/retail/estatement/EStatementModule';
import { LocatorModule } from './components/retail/locator/LocatorModule';
import { NachMandatesModule } from './components/retail/nach/NachMandatesModule';
import { NomineeModule } from './components/retail/nominee/NomineeModule';
import { ScheduledTransfersModule } from './components/retail/scheduled/ScheduledTransfersModule';
import { RequestMoneyModule } from './components/retail/request-money/RequestMoneyModule';
import { OpenAccountModule } from './components/retail/open-account/OpenAccountModule';
import { CardlessCashModule } from './components/retail/cardless/CardlessCashModule';
import { GovtSavingsModule } from './components/retail/govt-savings/GovtSavingsModule';
import { Form15GModule } from './components/retail/form15g/Form15GModule';
import { RemittanceModule } from './components/retail/remittance/RemittanceModule';
import { ForexCardModule } from './components/retail/forex/ForexCardModule';
import { BranchAppointmentModule } from './components/retail/appointments/BranchAppointmentModule';
import { RewardsModule } from './components/retail/rewards/RewardsModule';
import { LockerModule } from './components/retail/locker/LockerModule';
import { LoanClosureCertModule } from './components/retail/loan-closure/LoanClosureCertModule';
import { BondsModule } from './components/retail/bonds/BondsModule';
import { DematModule } from './components/retail/demat/DematModule';
import { FeedbackModule } from './components/retail/feedback/FeedbackModule';
import { IfscFinderModule } from './components/retail/ifsc/IfscFinderModule';

// Corporate Components
import { CorporateHome } from './components/corporate/CorporateHome';
import { CorporateApprovals } from './components/corporate/CorporateApprovals';
import { CorporatePayments } from './components/corporate/CorporatePayments';
import { CorporateAccounts } from './components/corporate/CorporateAccounts';
import { CorporatePayroll } from './components/corporate/CorporatePayroll';
import { CorporateCards } from './components/corporate/CorporateCards';
import { CorporateUsers } from './components/corporate/CorporateUsers';
import { CorporateSubScreenShell } from './components/corporate/shared/CorporateSubScreenShell';
import { CorporateReports } from './components/corporate/CorporateReports';
import { CorporateBeneficiaries } from './components/corporate/CorporateBeneficiaries';
import { CorporateBulkPaymentsModule } from './components/corporate/bulk-payments/CorporateBulkPaymentsModule';
import { CorporateMoreModule } from './components/corporate/more/CorporateMoreModule';
import { CorporateProfileModule } from './components/corporate/profile/CorporateProfileModule';
import { isCorporateBottomNavRoute } from './utils/corporateBottomNav';
import { getCorporateLandingPath } from './utils/corporateLanding';

const BankingAppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    bankingType, 
    retailTab, 
    corporateTab, 
    setCorporateTab,
    setRetailTab,
    corporateSession,
    isScannerOpen, 
    closeScanner,
    isBottomNavHidden,
    activeDetailFlow,
  } = useBanking();

  const isRetailAccountsRoute =
    bankingType === 'retail' && location.pathname.startsWith('/retail/accounts');
  const isRetailHome =
    bankingType === 'retail' &&
    !isRetailAccountsRoute &&
    retailTab === 'home';
  const showGlobalHeader = isRetailHome && !isScannerOpen;

  const isRetailNativeScreen =
    bankingType === 'retail' && ['loans', 'deposits', 'cards', 'insurance', 'cheque', 'epassbook', 'estatement', 'locator', 'nach', 'nominee', 'scheduled', 'request-money', 'open-account', 'cardless', 'govt-savings', 'form-15g', 'remittance', 'forex-card', 'branch-appointment', 'rewards', 'locker', 'loan-closure-cert', 'bonds', 'demat', 'feedback', 'ifsc-finder'].includes(retailTab);

  const isCorporateRootTab =
    bankingType === 'corporate' && isCorporateBottomNavRoute(location.pathname);

  const hideRetailAccountsBottomNav =
    bankingType === 'retail' && location.pathname.startsWith('/retail/accounts');

  const showBottomNav =
    isAuthenticated &&
    !isScannerOpen &&
    !isRetailNativeScreen &&
    !hideRetailAccountsBottomNav &&
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
      '/corporate/payroll',
      '/corporate/cards',
      '/corporate/users',
    ];
    const isAllowed = allowedPrefixes.some((p) => path === p || path.startsWith(`${p}/`));

    // After login the URL may still be "/" — send to role-appropriate corporate landing
    if (!path.startsWith('/corporate/')) {
      navigate(getCorporateLandingPath(corporateSession?.role), { replace: true });
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
    } else if (path.startsWith('/corporate/payroll')) {
      setCorporateTab('payroll');
    } else if (path.startsWith('/corporate/cards')) {
      setCorporateTab('more');
    } else if (path.startsWith('/corporate/users')) {
      setCorporateTab('more');
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
  }, [isAuthenticated, bankingType, location.pathname, navigate, corporateTab, setCorporateTab, corporateSession?.role]);

  React.useEffect(() => {
    if (!isAuthenticated || bankingType !== 'retail') return;
    if (location.pathname.startsWith('/retail/accounts')) {
      setRetailTab('accounts');
    }
  }, [isAuthenticated, bankingType, location.pathname, setRetailTab]);

  const renderCorporateScreen = () => {
    const path = location.pathname;

    if (path.startsWith('/corporate/bulk-payments')) {
      return <CorporateBulkPaymentsModule />;
    }
    if (path.startsWith('/corporate/payroll')) {
      return (
        <CorporateSubScreenShell title="Salary Payments" subtitle="Payroll disbursement" backTo="/corporate/payments">
          <CorporatePayroll />
        </CorporateSubScreenShell>
      );
    }
    if (path.startsWith('/corporate/cards')) {
      return (
        <CorporateSubScreenShell title="Corporate Cards" subtitle="Expense & commercial cards" backTo="/corporate/more">
          <CorporateCards />
        </CorporateSubScreenShell>
      );
    }
    if (path.startsWith('/corporate/users')) {
      return (
        <CorporateSubScreenShell title="User & Access" subtitle="Corporate signatories & roles" backTo="/corporate/profile">
          <CorporateUsers />
        </CorporateSubScreenShell>
      );
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
    return <CorporateHome />;
  };

  if (
    location.pathname === '/register' ||
    location.pathname === '/retail/register' ||
    location.pathname.startsWith('/retail/register/') ||
    location.pathname === '/corporate/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/forgot-mpin' ||
    location.pathname.startsWith('/prelogin/')
  ) {
    return (
      <>
        {location.pathname === '/register' && <RegistrationEntry />}
        {(location.pathname === '/retail/register' || location.pathname.startsWith('/retail/register/')) && (
          <RetailRegistrationModule />
        )}
        {location.pathname === '/corporate/register' && <CorporateRegistrationModule />}
        {location.pathname === '/forgot-password' && <ForgotPasswordModule />}
        {location.pathname === '/forgot-mpin' && <ForgotMpinModule />}
        {location.pathname.startsWith('/prelogin/') && <PreLoginModule />}
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
            {isRetailHome && <RetailHome />}
            {isRetailAccountsRoute && <RetailAccountsModule />}
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
            {retailTab === 'cheque' && <ChequeServicesModule />}
            {retailTab === 'epassbook' && <EPassbookModule />}
            {retailTab === 'estatement' && <EStatementModule />}
            {retailTab === 'locator' && <LocatorModule />}
            {retailTab === 'nach' && <NachMandatesModule />}
            {retailTab === 'nominee' && <NomineeModule />}
            {retailTab === 'scheduled' && <ScheduledTransfersModule />}
            {retailTab === 'request-money' && <RequestMoneyModule />}
            {retailTab === 'open-account' && <OpenAccountModule />}
            {retailTab === 'cardless' && <CardlessCashModule />}
            {retailTab === 'govt-savings' && <GovtSavingsModule />}
            {retailTab === 'form-15g' && <Form15GModule />}
            {retailTab === 'remittance' && <RemittanceModule />}
            {retailTab === 'forex-card' && <ForexCardModule />}
            {retailTab === 'branch-appointment' && <BranchAppointmentModule />}
            {retailTab === 'rewards' && <RewardsModule />}
            {retailTab === 'locker' && <LockerModule />}
            {retailTab === 'loan-closure-cert' && <LoanClosureCertModule />}
            {retailTab === 'bonds' && <BondsModule />}
            {retailTab === 'demat' && <DematModule />}
            {retailTab === 'feedback' && <FeedbackModule />}
            {retailTab === 'ifsc-finder' && <IfscFinderModule />}
            {retailTab === 'profile' && <RetailProfile />}
          </>
        ) : (
          renderCorporateScreen()
        )}
      </main>

      <BottomNav />

      <ScannerModal />
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
        <Route path="/register" element={<RegistrationEntry />} />
        <Route path="/retail/register" element={<RetailRegistrationModule />} />
        <Route path="/corporate/register" element={<CorporateRegistrationModule />} />
        <Route path="/forgot-password" element={<ForgotPasswordModule />} />
        <Route path="/forgot-mpin" element={<ForgotMpinModule />} />
        <Route path="/prelogin/:screen" element={<PreLoginModule />} />
        <Route path="/corporate/login" element={<Navigate to="/" replace />} />
        <Route path="/corporate/otp" element={<CorporateOtpRoute />} />
        <Route
          path="/corporate/device-verification"
          element={<CorporateDeviceVerificationRoute />}
        />
        <Route path="/corporate/forgot-password" element={<ForgotPasswordModule />} />
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
