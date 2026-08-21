import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { JointAccountOverview } from './JointAccountOverview';
import { JointTransferFlow } from './JointTransferFlow';
import { JointApprovalModule } from './JointApprovalModule';

function parseJointAccountId(pathname: string): string | null {
  const match = pathname.match(/\/retail\/joint-(?:account|transfer)\/([^/?]+)/);
  return match?.[1] ?? null;
}

export const RetailJointModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accountId = useMemo(
    () => parseJointAccountId(location.pathname),
    [location.pathname]
  );
  const { setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();
  const path = location.pathname;

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow('retail-joint');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  if (path.startsWith('/retail/joint-approvals')) {
    return <JointApprovalModule />;
  }

  if (path.includes('/joint-transfer/') && accountId) {
    return (
      <JointTransferFlow
        accountId={accountId}
        onClose={() => navigate(`/retail/joint-account/${accountId}`)}
      />
    );
  }

  if (path.includes('/joint-account/') && accountId) {
    return <JointAccountOverview accountId={accountId} />;
  }

  return null;
};
