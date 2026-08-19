import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { CorporateApprovals } from './dashboard/CorporateApprovals';
import { ApprovalDetails } from './details/ApprovalDetails';
import { ApprovalResult } from './result/ApprovalResult';

const APPROVALS_HOME = '/corporate/approvals';

export const CorporateApprovalsModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const isHome =
    location.pathname === APPROVALS_HOME || location.pathname === `${APPROVALS_HOME}/`;

  const detailMatch = location.pathname.match(/^\/corporate\/approvals\/([^/]+)(?:\/result)?\/?$/);
  const approvalId = detailMatch?.[1];
  const isResultRoute = /\/result\/?$/.test(location.pathname);

  useEffect(() => {
    setCorporateTab('approvals');
  }, [setCorporateTab]);

  useEffect(() => {
    if (!location.pathname.startsWith('/corporate/approvals')) return;

    if (isHome) {
      setBottomNavHidden(false);
      closeDetailFlow();
      return;
    }

    if (approvalId || isResultRoute) {
      setBottomNavHidden(true);
      openDetailFlow();
    }
  }, [
    location.pathname,
    isHome,
    approvalId,
    isResultRoute,
    setBottomNavHidden,
    closeDetailFlow,
    openDetailFlow,
  ]);

  useEffect(() => {
    if (location.pathname === '/corporate/approvals/') {
      navigate(APPROVALS_HOME, { replace: true });
    }
  }, [location.pathname, navigate]);

  if (isHome) {
    return <CorporateApprovals />;
  }

  if (isResultRoute && approvalId) {
    return <ApprovalResult />;
  }

  if (approvalId) {
    return <ApprovalDetails />;
  }

  navigate(APPROVALS_HOME, { replace: true });
  return null;
};
