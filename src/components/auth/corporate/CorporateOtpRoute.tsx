import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { CorporateOtpVerification } from './otp/CorporateOtpVerification';

export const CorporateOtpRoute: React.FC = () => {
  const { corporateLoginVerified, isSessionExpired } = useBanking();

  if (!corporateLoginVerified && !isSessionExpired) {
    return <Navigate to="/" replace />;
  }

  return <CorporateOtpVerification />;
};
