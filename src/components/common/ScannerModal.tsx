import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { RetailQrPaymentModule } from '../retail/qr-pay/RetailQrPaymentModule';
import { CorporateQrScanner } from './CorporateQrScanner';

export const ScannerModal: React.FC = () => {
  const { isScannerOpen, closeScanner, bankingType } = useBanking();

  if (!isScannerOpen) return null;

  if (bankingType === 'retail') {
    return <RetailQrPaymentModule onClose={closeScanner} />;
  }

  return <CorporateQrScanner onClose={closeScanner} />;
};
