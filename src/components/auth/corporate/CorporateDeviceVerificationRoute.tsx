import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { getCorporateLandingPath } from '../../../utils/corporateLanding';

/** Legacy route — device verification step removed. */
export const CorporateDeviceVerificationRoute: React.FC = () => {
  const { isAuthenticated, corporateSession } = useBanking();

  if (isAuthenticated) {
    return <Navigate to={getCorporateLandingPath(corporateSession?.role)} replace />;
  }

  return <Navigate to="/" replace />;
};
