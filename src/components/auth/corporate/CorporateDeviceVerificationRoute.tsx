import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { CorporateDeviceVerification } from './device/CorporateDeviceVerification';

export const CorporateDeviceVerificationRoute: React.FC = () => {
  const { corporateOtpVerified } = useBanking();

  if (!corporateOtpVerified) {
    return <Navigate to="/" replace />;
  }

  return <CorporateDeviceVerification />;
};
