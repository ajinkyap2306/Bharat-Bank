import React, { useEffect } from 'react';
import { useBanking } from '../../../context/BankingContext';
import { AddMoneyFlow } from './AddMoneyFlow';

interface AddMoneyModuleProps {
  onClose: () => void;
}

export const AddMoneyModule: React.FC<AddMoneyModuleProps> = ({ onClose }) => {
  const { setBottomNavHidden, openDetailFlow, closeDetailFlow } = useBanking();

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow('add-money');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      <AddMoneyFlow onClose={onClose} />
    </div>
  );
};
