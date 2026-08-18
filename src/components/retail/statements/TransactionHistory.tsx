import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  SearchX, 
  Calendar,
  Download,
  Share2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { Transaction, BankAccount } from '../../../types/banking';
import { BottomSheet } from '../../common/BottomSheet';

interface TransactionHistoryProps {
  accountId?: string;
  onSelectTransaction: (txn: Transaction) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ accountId, onSelectTransaction }) => {
  const { transactions, accounts } = useBanking();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filters
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedAccount = accountId ? accounts.find(a => a.id === accountId) : accounts[0];

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch = 
        txn.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || txn.type === filterType;
      const matchesCategory = filterCategory === 'all' || txn.category === filterCategory;
      
      // Period filter would go here (requires date parsing)
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchQuery, filterType, filterCategory]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(txn => {
      const date = txn.date.split(',')[0]; // Extract date part "Today", "Yesterday", "15 Aug 2026"
      if (!groups[date]) groups[date] = [];
      groups[date].push(txn);
    });
    return groups;
  }, [filteredTransactions]);

  const spendingSummary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses };
  }, [filteredTransactions]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Search and Filter */}
      <div className="px-4 pt-4 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={`p-2.5 rounded-xl border transition-all ${
              filterType !== 'all' || filterCategory !== 'all'
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary */}
        <div className="flex items-center justify-between mt-4 pb-2 px-1">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Income</p>
            <p className="text-sm font-bold text-emerald-600">+₹{spendingSummary.income.toLocaleString('en-IN')}</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800" />
          <div className="space-y-0.5 text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expenses</p>
            <p className="text-sm font-bold text-red-600">-₹{spendingSummary.expenses.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-24">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([date, items]) => (
            <div key={date} className="mt-4">
              <div className="px-4 py-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {date}
                </h3>
              </div>
              <div className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
                {(items as Transaction[]).map((txn) => (
                  <motion.button
                    key={txn.id}
                    whileTap={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    onClick={() => onSelectTransaction(txn)}
                    className="w-full px-4 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'credit' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      }`}>
                        {txn.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                          {txn.counterpartyName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {txn.date.includes(',') ? txn.date.split(',')[1].trim() : txn.paymentMode}
                          </p>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {txn.category}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </p>
                      <div className="flex items-center justify-end mt-1">
                        {txn.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1" />}
                        {txn.status === 'pending' && <Clock className="w-3 h-3 text-amber-500 mr-1" />}
                        {txn.status === 'failed' && <XCircle className="w-3 h-3 text-red-500 mr-1" />}
                        <span className={`text-[10px] font-bold uppercase ${
                          txn.status === 'completed' ? 'text-emerald-500' : 
                          txn.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No transactions found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterCategory('all');
              }}
              className="mt-6 text-blue-600 font-bold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Sheet */}
      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Transactions"
      >
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Type</h4>
            <div className="flex space-x-2">
              {['all', 'credit', 'debit'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-bold capitalize transition-all ${
                    filterType === type 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-full border text-xs font-bold capitalize transition-all ${
                    filterCategory === cat 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex space-x-4">
            <button
              onClick={() => {
                setFilterType('all');
                setFilterCategory('all');
                setIsFilterOpen(false);
              }}
              className="flex-1 py-4 text-slate-600 dark:text-slate-400 font-bold"
            >
              Reset
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default TransactionHistory;
