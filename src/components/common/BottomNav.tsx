import React from 'react';
import { 
  Home, 
  SendHorizontal, 
  Scan, 
  Grid, 
  User, 
  FileCheck2, 
  Wallet,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';

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

  // Root screen check: Bottom Navigation is ONLY visible on authenticated top-level root screens
  const isVisible = isAuthenticated && !isScannerOpen && !isBottomNavHidden && !activeDetailFlow;

  if (!isVisible) {
    return null;
  }

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <AnimatePresence>
      <motion.nav 
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 safe-bottom shrink-0 select-none"
      >
        {bankingType === 'retail' ? (
          <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
            {/* Home */}
            <button
              onClick={() => setRetailTab('home')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                retailTab === 'home' 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-1">Home</span>
            </button>

            {/* Payments (Pay & Send) */}
            <button
              onClick={() => setRetailTab('transfers')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                retailTab === 'transfers' || retailTab === 'payments'
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <SendHorizontal className="w-5 h-5" />
              <span className="text-[10px] mt-1">Payments</span>
            </button>

            {/* Center Scan FAB -> Full screen Scanner with hidden bottom nav */}
            <div className="relative -top-4">
              <button
                onClick={openScanner}
                className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.6)] flex flex-col items-center justify-center active:scale-90 transition-all ring-4 ring-white dark:ring-slate-900"
                aria-label="Scan QR"
              >
                <Scan className="w-6 h-6" />
                <span className="text-[8px] font-extrabold uppercase mt-0.5 tracking-wider">Scan</span>
              </button>
            </div>

            {/* Services */}
            <button
              onClick={() => setRetailTab('services')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                retailTab === 'services' || retailTab === 'cards' || retailTab === 'bills' || retailTab === 'deposits' || retailTab === 'loans' || retailTab === 'investments'
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px] mt-1">Services</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setRetailTab('profile')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                retailTab === 'profile' 
                  ? 'text-blue-600 dark:text-blue-400 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-1">Profile</span>
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
