import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ScannerModal } from './components/common/ScannerModal';
import { SessionTimeoutSheet } from './components/common/SessionTimeoutSheet';
import { AuthContainer } from './components/auth/AuthContainer';

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

const BankingAppContent: React.FC = () => {
  const { 
    isAuthenticated, 
    bankingType, 
    retailTab, 
    corporateTab, 
    isScannerOpen, 
    closeScanner,
    isBottomNavHidden,
    activeDetailFlow,
  } = useBanking();

  const isRetailHome = bankingType === 'retail' && retailTab === 'home';
  const isCorporateHome = bankingType === 'corporate' && corporateTab === 'home';
  const showGlobalHeader = (isRetailHome || isCorporateHome) && !isScannerOpen;

  const isRetailNativeScreen =
    bankingType === 'retail' && ['loans', 'deposits', 'cards'].includes(retailTab);

  const showBottomNav =
    !isScannerOpen &&
    !isBottomNavHidden &&
    !activeDetailFlow &&
    !isRetailNativeScreen;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col">
        <AuthContainer />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {showGlobalHeader && <Header />}

      <main
        className={`flex-1 w-full overflow-y-auto no-scrollbar px-4 ${
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
          <>
            {corporateTab === 'home' && <CorporateHome />}
            {corporateTab === 'approvals' && <CorporateApprovals />}
            {corporateTab === 'payments' && <CorporatePayments />}
            {corporateTab === 'accounts' && <CorporateAccounts />}
            {corporateTab === 'payroll' && <CorporatePayroll />}
            {corporateTab === 'cards' && <CorporateCards />}
            {corporateTab === 'users' && <CorporateUsers />}
            {corporateTab === 'reports' && <CorporateReports />}
            {corporateTab === 'profile' && <CorporateProfile />}
          </>
        )}
      </main>

      <BottomNav />

      <ScannerModal isOpen={isScannerOpen} onClose={closeScanner} />
      <SessionTimeoutSheet />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <BankingAppContent />
    </BankingProvider>
  );
}
