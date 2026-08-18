import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  Star, 
  SearchX, 
  ArrowRightLeft, 
  User,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { Beneficiary } from '../../../types/banking';

interface BeneficiaryListProps {
  onSelect: (beneficiary: Beneficiary) => void;
  onAdd: () => void;
}

const BeneficiaryList: React.FC<BeneficiaryListProps> = ({ onSelect, onAdd }) => {
  const { beneficiaries, toggleBeneficiaryFavourite } = useBanking();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Recent' | 'Pending' | 'Blocked'>('All');

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(ben => {
      const matchesSearch = 
        ben.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ben.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ben.accountNumber.includes(searchQuery) ||
        (ben.nickname?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTab = 
        activeTab === 'All' ||
        (activeTab === 'Pending' && ben.status === 'pending_approval') ||
        (activeTab === 'Blocked' && ben.status === 'blocked') ||
        (activeTab === 'Recent'); // For now, just show all in recent for demo

      return matchesSearch && matchesTab;
    }).sort((a, b) => {
      if (a.isFavourite && !b.isFavourite) return -1;
      if (!a.isFavourite && b.isFavourite) return 1;
      return 0;
    });
  }, [beneficiaries, searchQuery, activeTab]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, account or bank"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 overflow-x-auto no-scrollbar flex space-x-2">
        {['All', 'Recent', 'Pending', 'Blocked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Beneficiary List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-24">
        <AnimatePresence mode="popLayout">
          {filteredBeneficiaries.length > 0 ? (
            filteredBeneficiaries.map((ben) => (
              <motion.div
                key={ben.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group active:scale-[0.98] transition-transform"
                onClick={() => onSelect(ben)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      ben.status === 'blocked' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {ben.name}
                        </h3>
                        {ben.isFavourite && (
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {ben.bankName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBeneficiaryFavourite(ben.id);
                    }}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <Star className={`w-5 h-5 ${ben.isFavourite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Account Number
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {ben.maskedAccount}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg flex items-center space-x-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to transfers with this ben
                        onSelect(ben);
                      }}
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Transfer</span>
                    </button>
                    <button className="p-1.5 text-slate-400">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="mt-2 flex space-x-2">
                  {ben.status === 'blocked' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-tighter">
                      <AlertCircle className="w-2.5 h-2.5 mr-1" />
                      Blocked
                    </span>
                  )}
                  {ben.status === 'pending_approval' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-tighter">
                      Pending Activation
                    </span>
                  )}
                  {ben.status === 'active' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-tighter">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                      Active
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <SearchX className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No beneficiaries found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 px-10">
                {searchQuery 
                  ? `We couldn't find anything matching "${searchQuery}"`
                  : "You haven't added any beneficiaries to this list yet."}
              </p>
              <button
                onClick={onAdd}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
              >
                Add New Beneficiary
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAdd}
        className="absolute bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-10"
      >
        <Plus className="w-7 h-7" />
      </motion.button>
    </div>
  );
};

export default BeneficiaryList;
