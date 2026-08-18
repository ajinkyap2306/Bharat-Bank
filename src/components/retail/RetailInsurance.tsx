import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';
import { Header } from '../common/Header';
import { InsurancePolicy } from '../../types/banking';
import { InsuranceOverview } from './insurance/InsuranceOverview';
import { BrowseInsurancePlans } from './insurance/BrowseInsurancePlans';
import { InsurancePolicyDetails } from './insurance/InsurancePolicyDetails';
import { InsuranceClaimFlow } from './insurance/InsuranceClaimFlow';

export const RetailInsurance: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'overview' | 'browse' | 'details' | 'claim'>('overview');
  const [selectedPolicy, setSelectedPolicy] = useState<InsurancePolicy | null>(null);

  const handleBrowsePlans = () => {
    setActiveFlow('browse');
  };

  const handleViewPolicy = (policy: InsurancePolicy) => {
    setSelectedPolicy(policy);
    setActiveFlow('details');
  };

  const handleRaiseClaim = (policy: InsurancePolicy) => {
    setSelectedPolicy(policy);
    setActiveFlow('claim');
  };

  const handleCloseFlow = () => {
    setActiveFlow('overview');
    setSelectedPolicy(null);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {activeFlow === 'overview' && <Header title="Insurance" />}
      
      <div className={`flex-1 ${activeFlow === 'overview' ? 'p-6' : ''} overflow-y-auto no-scrollbar`}>
        <AnimatePresence mode="wait">
          {activeFlow === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <InsuranceOverview 
                onBrowsePlans={handleBrowsePlans}
                onViewPolicy={handleViewPolicy}
                onRaiseClaim={handleRaiseClaim}
              />
            </motion.div>
          )}

          {activeFlow === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-50"
            >
              <BrowseInsurancePlans 
                onClose={handleCloseFlow}
              />
            </motion.div>
          )}

          {activeFlow === 'details' && selectedPolicy && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50"
            >
              <InsurancePolicyDetails 
                policy={selectedPolicy}
                onClose={handleCloseFlow}
                onRaiseClaim={() => setActiveFlow('claim')}
              />
            </motion.div>
          )}

          {activeFlow === 'claim' && selectedPolicy && (
            <motion.div
              key="claim"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="fixed inset-0 z-50"
            >
              <InsuranceClaimFlow 
                policy={selectedPolicy}
                onClose={handleCloseFlow}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
