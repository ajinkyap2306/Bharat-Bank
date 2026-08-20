import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { BankTransferFlow } from './bank-transfer/BankTransferFlow';

export const RetailTransfer: React.FC = () => {
  const { setRetailTab } = useBanking();

  return <BankTransferFlow onClose={() => setRetailTab('home')} />;
};
