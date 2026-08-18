import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';
import { Header } from '../common/Header';
import BeneficiaryList from './beneficiaries/BeneficiaryList';
import AddBeneficiaryFlow from './beneficiaries/AddBeneficiaryFlow';
import BeneficiaryDetailsView from './beneficiaries/BeneficiaryDetailsView';
import { Beneficiary } from '../../types/banking';

const RetailBeneficiaries: React.FC = () => {
  const { setRetailTab, setBottomNavHidden } = useBanking();
  const [view, setView] = useState<'list' | 'add' | 'details'>('list');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string | null>(null);

  useEffect(() => {
    setBottomNavHidden(view !== 'list');
    return () => setBottomNavHidden(false);
  }, [view, setBottomNavHidden]);

  const handleSelect = (ben: Beneficiary) => {
    setSelectedBeneficiaryId(ben.id);
    setView('details');
  };

  const handleAdd = () => {
    setView('add');
  };

  const handleTransfer = (ben: Beneficiary) => {
    // Navigate to transfers and pre-select this beneficiary
    // We'll need to pass this state to the transfers tab
    // For now, let's just go to transfers
    setRetailTab('transfers');
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            <Header 
              title="Beneficiaries" 
              showBack={true} 
              onBack={() => setRetailTab('home')}
            />
            <BeneficiaryList onSelect={handleSelect} onAdd={handleAdd} />
          </motion.div>
        )}

        {view === 'add' && (
          <motion.div
            key="add"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-white dark:bg-slate-950"
          >
            <AddBeneficiaryFlow 
              onBack={() => setView('list')} 
              onSuccess={(ben) => {
                setSelectedBeneficiaryId(ben.id);
                setView('details');
              }}
            />
          </motion.div>
        )}

        {view === 'details' && selectedBeneficiaryId && (
          <motion.div
            key="details"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-white dark:bg-slate-950"
          >
            <BeneficiaryDetailsView 
              beneficiaryId={selectedBeneficiaryId}
              onBack={() => setView('list')}
              onTransfer={handleTransfer}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RetailBeneficiaries;
