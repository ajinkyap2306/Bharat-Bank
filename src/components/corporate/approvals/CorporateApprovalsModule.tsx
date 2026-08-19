import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { CorporateApprovals } from './dashboard/CorporateApprovals';
import { ApprovalDetails } from './details/ApprovalDetails';
import { ApprovalAuditTrailScreen } from './details/ApprovalAuditTrailScreen';
import { ApprovalResult } from './result/ApprovalResult';

const APPROVALS_HOME = '/corporate/approvals';

export const CorporateApprovalsModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const isHome =
    location.pathname === APPROVALS_HOME || location.pathname === `${APPROVALS_HOME}/`;

  const detailMatch = location.pathname.match(/^\/corporate\/approvals\/([^/]+)(?:\/(result|history))?\/?$/);
  const approvalId = detailMatch?.[1];
  const subRoute = detailMatch?.[2];
  const isResultRoute = subRoute === 'result';
  const isHistoryRoute = subRoute === 'history';

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

    if (approvalId || isResultRoute || isHistoryRoute) {
      setBottomNavHidden(true);
      openDetailFlow();
    }
  }, [
    location.pathname,
    isHome,
    approvalId,
    isResultRoute,
    isHistoryRoute,
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

  if (isHistoryRoute && approvalId) {
    return <ApprovalAuditTrailScreen />;
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
