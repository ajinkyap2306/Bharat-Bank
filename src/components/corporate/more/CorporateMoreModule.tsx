import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { CorporateMoreHome } from './CorporateMoreHome';
import { CorporateReports } from '../CorporateReports';
import { CorporateProfileModule } from '../profile/CorporateProfileModule';

const MORE_HOME = '/corporate/more';

export const CorporateMoreModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const isHome = useMemo(() => {
    const path = location.pathname;
    return path === MORE_HOME || path === `${MORE_HOME}/`;
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/corporate/more/profile')) {
      const suffix = location.pathname.slice('/corporate/more/profile'.length);
      navigate(`/corporate/profile${suffix}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  const isProfile = useMemo(() => {
    return (
      location.pathname.startsWith('/corporate/profile') ||
      location.pathname.startsWith('/corporate/more/profile')
    );
  }, [location.pathname]);

  const isReports = useMemo(() => {
    const path = location.pathname;
    return path === '/corporate/more/reports' || path === '/corporate/more/reports/';
  }, [location.pathname]);

  const isSubScreen = isProfile || isReports;

  useEffect(() => {
    setCorporateTab('more');
  }, [setCorporateTab]);

  useEffect(() => {
    if (!location.pathname.startsWith('/corporate/more')) return;

    if (isHome) {
      setBottomNavHidden(false);
      closeDetailFlow();
      return;
    }

    if (isSubScreen) {
      setBottomNavHidden(true);
      openDetailFlow('corporate-more-sub');
    }
  }, [
    location.pathname,
    isHome,
    isSubScreen,
    setBottomNavHidden,
    closeDetailFlow,
    openDetailFlow,
  ]);

  useEffect(() => {
    if (location.pathname === '/corporate/more/') {
      navigate(MORE_HOME, { replace: true });
    }
  }, [location.pathname, navigate]);

  if (isProfile) {
    return <CorporateProfileModule />;
  }

  if (isReports) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <header className="sticky top-0 z-10 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 px-4 py-3 safe-top flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(MORE_HOME)}
            className="text-sm font-semibold text-[#0B5CAB]"
          >
            Back
          </button>
          <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white">Reports</h1>
        </header>
        <CorporateReports />
      </div>
    );
  }

  if (!isHome) {
    navigate(MORE_HOME, { replace: true });
    return null;
  }

  return <CorporateMoreHome />;
};
