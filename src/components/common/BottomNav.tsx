import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  SendHorizontal,
  Grid,
  User,
  FileCheck2,
  Wallet,
  ArrowLeftRight,
  MoreHorizontal,
} from 'lucide-react';
import { parseRetailAccountsRoute } from '../../utils/retailAccountsRoutes';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';
import { getApprovalsBadgeCount } from '../../data/corporateApprovalsDashboardMock';
import { isCorporateBottomNavRoute } from '../../utils/corporateBottomNav';

const RETAIL_NAV_ITEM =
  'flex flex-col items-center justify-end flex-1 min-w-0 py-1.5 transition-all active:scale-95';

const CORP_NAV_ITEM =
  'flex flex-col items-center justify-center flex-1 min-w-0 py-1.5 transition-all active:scale-95 min-h-[3.25rem]';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    bankingType,
    retailTab,
    setRetailTab,
    corporateTab,
    setCorporateTab,
    isScannerOpen,
    isBottomNavHidden,
    activeDetailFlow,
    hasRetailJointApprovalAccess,
    retailActiveUserId,
    getPendingJointApprovalsForUser,
  } = useBanking();

  const pendingApprovalsCount = getApprovalsBadgeCount();
  const pendingRetailJointApprovalsCount = getPendingJointApprovalsForUser(retailActiveUserId).length;

  const isRetailNativeScreen =
    bankingType === 'retail' && ['loans', 'deposits', 'cards', 'insurance', 'cheque', 'epassbook', 'estatement', 'locator', 'nach', 'nominee', 'scheduled', 'request-money', 'open-account', 'cardless', 'govt-savings', 'form-15g', 'remittance', 'forex-card', 'branch-appointment', 'rewards', 'locker', 'loan-closure-cert', 'bonds', 'demat', 'feedback'].includes(retailTab);

  const isVisible = useMemo(() => {
    if (!isAuthenticated || isScannerOpen || isRetailNativeScreen) {
      return false;
    }

    if (
      bankingType === 'retail' &&
      location.pathname.startsWith('/retail/accounts') &&
      parseRetailAccountsRoute(location.pathname).screen !== 'overview'
    ) {
      return false;
    }

    if (bankingType === 'corporate') {
      return isCorporateBottomNavRoute(location.pathname) && !isBottomNavHidden;
    }

    return !isBottomNavHidden && !activeDetailFlow;
  }, [
    isAuthenticated,
    isScannerOpen,
    isRetailNativeScreen,
    bankingType,
    location.pathname,
    isBottomNavHidden,
    activeDetailFlow,
  ]);

  const leaveAccountsRoute = () => {
    if (location.pathname.startsWith('/retail/accounts')) {
      navigate('/');
    }
  };

  const leaveRetailRootRoutes = () => {
    leaveAccountsRoute();
    if (location.pathname.startsWith('/retail/joint-approvals')) {
      navigate('/');
    }
  };

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
        className="fixed bottom-0 left-0 right-0 z-40 w-full safe-bottom bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] shrink-0 select-none"
      >
        {bankingType === 'retail' ? (
          <div className="grid grid-cols-5 items-end px-1 pt-2 pb-1.5 max-w-lg mx-auto">
            <button
              onClick={() => {
                setRetailTab('home');
                navigate('/');
              }}
              className={`${RETAIL_NAV_ITEM} ${
                retailTab === 'home'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 leading-none">Home</span>
            </button>

            <button
              onClick={() => {
                setRetailTab('transfers');
                leaveRetailRootRoutes();
              }}
              className={`${RETAIL_NAV_ITEM} ${
                retailTab === 'transfers' || retailTab === 'payments'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <SendHorizontal className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 leading-none">Payments</span>
            </button>

            {hasRetailJointApprovalAccess ? (
              <button
                type="button"
                onClick={() => {
                  setRetailTab('approvals');
                  navigate('/retail/joint-approvals');
                }}
                className={`${RETAIL_NAV_ITEM} ${
                  retailTab === 'approvals' ||
                  location.pathname.startsWith('/retail/joint-approvals')
                    ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                aria-label={`Approvals${
                  pendingRetailJointApprovalsCount > 0
                    ? `, ${pendingRetailJointApprovalsCount} pending`
                    : ''
                }`}
              >
                <div className="relative">
                  <FileCheck2 className="w-5 h-5 shrink-0" />
                  {pendingRetailJointApprovalsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-[#DC2626] text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                      {pendingRetailJointApprovalsCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 leading-none">Approvals</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setRetailTab('accounts');
                  navigate('/retail/accounts');
                }}
                className={`${RETAIL_NAV_ITEM} ${
                  retailTab === 'accounts' ||
                  (location.pathname.startsWith('/retail/accounts') &&
                    parseRetailAccountsRoute(location.pathname).screen === 'overview')
                    ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Wallet className="w-5 h-5 shrink-0" />
                <span className="text-[10px] mt-1 leading-none">Accounts</span>
              </button>
            )}

            {hasRetailJointApprovalAccess ? (
              <button
                onClick={() => {
                  setRetailTab('accounts');
                  navigate('/retail/accounts');
                }}
                className={`${RETAIL_NAV_ITEM} ${
                  retailTab === 'accounts' ||
                  (location.pathname.startsWith('/retail/accounts') &&
                    parseRetailAccountsRoute(location.pathname).screen === 'overview')
                    ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Wallet className="w-5 h-5 shrink-0" />
                <span className="text-[10px] mt-1 leading-none">Accounts</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setRetailTab('services');
                  leaveRetailRootRoutes();
                }}
                className={`${RETAIL_NAV_ITEM} ${
                  retailTab === 'services' ||
                  retailTab === 'cards' ||
                  retailTab === 'bills' ||
                  retailTab === 'deposits' ||
                  retailTab === 'loans' ||
                  retailTab === 'investments' ||
                  retailTab === 'insurance'
                    ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Grid className="w-5 h-5 shrink-0" />
                <span className="text-[10px] mt-1 leading-none">Services</span>
              </button>
            )}

            <button
              onClick={() => {
                setRetailTab('profile');
                leaveRetailRootRoutes();
              }}
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
          <div
            className="grid grid-cols-5 items-end px-1 pt-2 pb-1.5 max-w-lg mx-auto"
            role="navigation"
            aria-label="Corporate navigation"
          >
            <button
              type="button"
              onClick={() => {
                setCorporateTab('home');
                navigate('/corporate/home');
              }}
              className={`${CORP_NAV_ITEM} ${
                corporateTab === 'home'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-current={corporateTab === 'home' ? 'page' : undefined}
            >
              <Home className="w-5 h-5 shrink-0" aria-hidden />
              <span className="text-[10px] mt-1 leading-none">Home</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCorporateTab('payments');
                navigate('/corporate/payments');
              }}
              className={`${CORP_NAV_ITEM} ${
                corporateTab === 'payments'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-current={corporateTab === 'payments' ? 'page' : undefined}
            >
              <ArrowLeftRight className="w-5 h-5 shrink-0" aria-hidden />
              <span className="text-[10px] mt-1 leading-none">Payments</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCorporateTab('approvals');
                navigate('/corporate/approvals');
              }}
              className={`${CORP_NAV_ITEM} ${
                corporateTab === 'approvals'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-current={corporateTab === 'approvals' ? 'page' : undefined}
              aria-label={`Approvals${pendingApprovalsCount > 0 ? `, ${pendingApprovalsCount} pending` : ''}`}
            >
              <div className="relative">
                <FileCheck2 className="w-5 h-5 shrink-0" aria-hidden />
                {pendingApprovalsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-[#DC2626] text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                    {pendingApprovalsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none">Approvals</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCorporateTab('accounts');
                navigate('/corporate/accounts');
              }}
              className={`${CORP_NAV_ITEM} ${
                corporateTab === 'accounts'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-current={corporateTab === 'accounts' ? 'page' : undefined}
            >
              <Wallet className="w-5 h-5 shrink-0" aria-hidden />
              <span className="text-[10px] mt-1 leading-none">Accounts</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCorporateTab('more');
                navigate('/corporate/more');
              }}
              className={`${CORP_NAV_ITEM} ${
                corporateTab === 'more'
                  ? 'text-congress-blue-700 dark:text-congress-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-current={corporateTab === 'more' ? 'page' : undefined}
            >
              <MoreHorizontal className="w-5 h-5 shrink-0" aria-hidden />
              <span className="text-[10px] mt-1 leading-none">More</span>
            </button>
          </div>
        )}
      </motion.nav>
    </AnimatePresence>
  );
};
