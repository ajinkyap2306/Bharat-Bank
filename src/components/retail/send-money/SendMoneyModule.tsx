import React, { useEffect } from 'react';
import { useBanking } from '../../../context/BankingContext';
import { SendMoneyFlow } from './SendMoneyFlow';

interface SendMoneyModuleProps {
  onClose: () => void;
}

export const SendMoneyModule: React.FC<SendMoneyModuleProps> = ({ onClose }) => {
  const { setBottomNavHidden, openDetailFlow, closeDetailFlow } = useBanking();

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow('send-money');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      <SendMoneyFlow onClose={onClose} />
    </div>
  );
};
