import React from 'react';
import { 
  Home, 
  SendHorizontal, 
  QrCode, 
  Grid, 
  User, 
  FileCheck2, 
  Wallet,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';

const RETAIL_NAV_ITEM =
  'flex flex-col items-center justify-end flex-1 min-w-0 py-1.5 transition-all active:scale-95';

export const BottomNav: React.FC = () => {
  const { 
    isAuthenticated,
    bankingType, 
    retailTab, 
    setRetailTab, 
    corporateTab, 
    setCorporateTab, 
    openScanner,
    isScannerOpen,
    isBottomNavHidden,
    activeDetailFlow,
    approvals 
  } = useBanking();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  const isRetailNativeScreen =
    bankingType === 'retail' && ['loans', 'deposits', 'cards', 'insurance'].includes(retailTab);

  const isVisible =
    isAuthenticated &&
    !isScannerOpen &&
    !isBottomNavHidden &&
    !activeDetailFlow &&
    !isRetailNativeScreen;

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-40 w-full safe-bottom bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 shrink-0 select-none"
      >
        {bankingType === 'retail' ? (
          <div className="grid grid-cols-5 items-end px-1 pt-2 pb-1.5 max-w-lg mx-auto">
            <button
              onClick={() => setRetailTab('home')}
              className={`${RETAIL_NAV_ITEM} ${
                retailTab === 'home' 
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 leading-none">Home</span>
            </button>

            {/* Payments */}
            <button
              onClick={() => setRetailTab('transfers')}
              className={`${RETAIL_NAV_ITEM} ${
                retailTab === 'transfers' || retailTab === 'payments'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <SendHorizontal className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 leading-none">Payments</span>
            </button>

            {/* QR Scan */}
            <button
              onClick={openScanner}
              className={`${RETAIL_NAV_ITEM} text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200`}
              aria-label="Scan QR code"
            >
              <QrCode className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 leading-none invisible" aria-hidden="true">QR</span>
            </button>

            {/* Services */}
            <button
              onClick={() => setRetailTab('services')}
              className={`${RETAIL_NAV_ITEM} ${
                retailTab === 'services' || retailTab === 'cards' || retailTab === 'bills' || retailTab === 'deposits' || retailTab === 'loans' || retailTab === 'investments' || retailTab === 'insurance'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Grid className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 leading-none">Services</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setRetailTab('profile')}
              className={`${RETAIL_NAV_ITEM} ${
                retailTab === 'profile' 
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 leading-none">Profile</span>
            </button>
          </div>
        ) : (
          /* Corporate Navigation: Home | Payments | Approvals | Accounts | More */
          <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
            {/* Home */}
            <button
              onClick={() => setCorporateTab('home')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                corporateTab === 'home' 
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-1">Home</span>
            </button>

            {/* Payments */}
            <button
              onClick={() => setCorporateTab('payments')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                corporateTab === 'payments' 
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <SendHorizontal className="w-5 h-5" />
              <span className="text-[10px] mt-1">Payments</span>
            </button>

            {/* Approvals with Badge */}
            <button
              onClick={() => setCorporateTab('approvals')}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                corporateTab === 'approvals' 
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <FileCheck2 className="w-5 h-5" />
                {pendingApprovalsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-extrabold shadow-sm animate-pulse">
                    {pendingApprovalsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">Approvals</span>
            </button>

            {/* Accounts */}
            <button
              onClick={() => setCorporateTab('accounts')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                corporateTab === 'accounts' 
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-[10px] mt-1">Accounts</span>
            </button>

            {/* More (Payroll, Collections, Cards, Reports, Users) */}
            <button
              onClick={() => setCorporateTab('payroll')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                corporateTab === 'payroll' || corporateTab === 'collections' || corporateTab === 'cards' || corporateTab === 'reports' || corporateTab === 'users' || corporateTab === 'security' || corporateTab === 'profile'
                  ? 'text-teal-600 dark:text-teal-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-[10px] mt-1">More</span>
            </button>
          </div>
        )}
      </motion.nav>
    </AnimatePresence>
  );
};
