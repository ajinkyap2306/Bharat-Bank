import React from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { ScannerModal } from './components/common/ScannerModal';
import { DemoController } from './components/common/DemoController';
import { AuthContainer } from './components/auth/AuthContainer';
import { MobileStatusBar } from './components/common/MobileStatusBar';

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
    closeScanner 
  } = useBanking();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center sm:p-4">
        <div className="w-full sm:max-w-md min-h-screen sm:min-h-[850px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between sm:rounded-[42px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] sm:border sm:border-slate-200 dark:sm:border-slate-800 sm:ring-8 sm:ring-slate-900/5 dark:sm:ring-white/5 overflow-hidden transition-all relative">
          <MobileStatusBar />
          <AuthContainer />
          {/* iOS Bottom Home Bar Indicator */}
          <div className="w-full py-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
        <DemoController />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center sm:p-4 transition-colors duration-200">
      {/* Mobile Device Frame for Desktop & Fluid on Mobile */}
      <div className="w-full sm:max-w-md min-h-screen sm:min-h-[850px] sm:max-h-[92vh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col sm:rounded-[42px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] sm:border sm:border-slate-200 dark:sm:border-slate-800 sm:ring-8 sm:ring-slate-900/5 dark:sm:ring-white/5 overflow-hidden relative">
        
        {/* Top Native Status Bar (Signal, 5G, Wifi, Time, Battery) */}
        <MobileStatusBar />

        {/* Top Header */}
        <Header />

        {/* Main Body Viewport with Native Scroll Behavior */}
        <main className="flex-1 w-full overflow-y-auto no-scrollbar px-4 pt-3 pb-4">
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

        {/* Bottom Sticky Navigation */}
        <BottomNav />

        {/* iOS Native Home Indicator Bar */}
        <div className="w-full py-1.5 bg-white/95 dark:bg-slate-900/95 flex items-center justify-center border-t border-slate-100 dark:border-slate-850">
          <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
      </div>

      {/* Global Modals & Controls */}
      <ScannerModal isOpen={isScannerOpen} onClose={closeScanner} />
      <DemoController />
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

