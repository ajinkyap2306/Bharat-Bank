import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';
import { Header } from '../common/Header';
import TransactionHistory from './statements/TransactionHistory';
import StatementList from './statements/StatementList';
import TransactionDetailsView from './statements/TransactionDetailsView';
import { Transaction, Statement } from '../../types/banking';
import { ChevronDown, CreditCard, PieChart } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';

const RetailStatements: React.FC = () => {
  const { setRetailTab, accounts, hideBottomNav, showBottomNav } = useBanking();
  const [activeView, setActiveView] = useState<'transactions' | 'statements'>('transactions');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null);
  const [isAccountSelectorOpen, setIsAccountSelectorOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];

  const handleSelectTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    hideBottomNav();
  };

  const handleBackFromTransaction = () => {
    setSelectedTransaction(null);
    showBottomNav();
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Header 
        title="Transactions & Statements" 
        showBack={true} 
        onBack={() => setRetailTab('home')}
      />

      {/* Account Selector Section */}
      <div className="px-4 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setIsAccountSelectorOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Account</p>
              <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                {selectedAccount.nickname || selectedAccount.accountType}
              </h4>
              <p className="text-xs text-slate-500">{selectedAccount.maskedNumber}</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </button>

        {/* View Toggle */}
        <div className="mt-6 flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveView('transactions')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeView === 'transactions' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveView('statements')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeView === 'statements' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Statements
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'transactions' ? (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="h-full"
            >
              <TransactionHistory 
                accountId={selectedAccountId} 
                onSelectTransaction={handleSelectTransaction}
              />
            </motion.div>
          ) : (
            <motion.div
              key="statements"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="h-full"
            >
              <StatementList 
                accountId={selectedAccountId} 
                onPreview={(stmt) => setSelectedStatement(stmt)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction Details View Overlay */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-30 bg-white dark:bg-slate-950"
          >
            <TransactionDetailsView 
              transaction={selectedTransaction} 
              onBack={handleBackFromTransaction} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Selector Sheet */}
      <BottomSheet
        isOpen={isAccountSelectorOpen}
        onClose={() => setIsAccountSelectorOpen(false)}
        title="Select Account"
      >
        <div className="p-4 space-y-3">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => {
                setSelectedAccountId(acc.id);
                setIsAccountSelectorOpen(false);
              }}
              className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                selectedAccountId === acc.id 
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3 text-left">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedAccountId === acc.id ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{acc.nickname || acc.accountType}</h4>
                  <p className="text-xs text-slate-500">{acc.maskedNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ₹{acc.balance.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Available</p>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
};

export default RetailStatements;
