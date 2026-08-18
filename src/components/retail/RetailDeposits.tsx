import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';
import { ScreenHeader } from '../common/ScreenHeader';
import { FixedDeposit, RecurringDeposit } from '../../types/banking';
import { DepositsOverview } from './deposits/DepositsOverview';
import { OpenDepositFlow } from './deposits/OpenDepositFlow';
import { DepositDetailsView } from './deposits/DepositDetailsView';

export const RetailDeposits: React.FC = () => {
  const { setBottomNavHidden, setRetailTab } = useBanking();
  const [activeFlow, setActiveFlow] = useState<'overview' | 'open_fd' | 'open_rd' | 'details'>('overview');
  const [selectedDeposit, setSelectedDeposit] = useState<{data: FixedDeposit | RecurringDeposit, type: 'FD' | 'RD'} | null>(null);

  useEffect(() => {
    setBottomNavHidden(activeFlow !== 'overview');
    return () => setBottomNavHidden(false);
  }, [activeFlow, setBottomNavHidden]);

  const handleOpenDeposit = (type: 'FD' | 'RD') => {
    setActiveFlow(type === 'FD' ? 'open_fd' : 'open_rd');
  };

  const handleViewDetails = (deposit: any, type: 'FD' | 'RD') => {
    setSelectedDeposit({ data: deposit, type });
    setActiveFlow('details');
  };

  const handleCloseFlow = () => {
    setActiveFlow('overview');
    setSelectedDeposit(null);
  };

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-white dark:bg-slate-950 min-h-full">
      {activeFlow === 'overview' && (
        <ScreenHeader
          title="Fixed Deposits"
          subtitle="FD & RD accounts"
          onBack={() => setRetailTab('home')}
        />
      )}
      
      <div className={`flex-1 ${activeFlow === 'overview' ? 'px-0 pt-3 pb-6' : ''} overflow-y-auto no-scrollbar`}>
        <AnimatePresence mode="wait">
          {activeFlow === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DepositsOverview 
                onOpenDeposit={handleOpenDeposit}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          )}

          {(activeFlow === 'open_fd' || activeFlow === 'open_rd') && (
            <motion.div
              key="open_flow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-50"
            >
              <OpenDepositFlow 
                type={activeFlow === 'open_fd' ? 'FD' : 'RD'}
                onClose={handleCloseFlow}
              />
            </motion.div>
          )}

          {activeFlow === 'details' && selectedDeposit && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50"
            >
              <DepositDetailsView 
                deposit={selectedDeposit.data}
                type={selectedDeposit.type}
                onClose={handleCloseFlow}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
