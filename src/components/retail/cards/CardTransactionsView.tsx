import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  ShoppingBag, 
  Store, 
  Landmark, 
  RefreshCw, 
  Calendar,
  AlertTriangle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { CreditDebitCard, CardTransaction } from '../../../types/banking';

interface CardTransactionsViewProps {
  card: CreditDebitCard;
  transactions: CardTransaction[];
  onBack: () => void;
  onSelectTransaction: (txn: CardTransaction) => void;
}

export const CardTransactionsView: React.FC<CardTransactionsViewProps> = ({
  card,
  transactions,
  onBack,
  onSelectTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<'all' | 'online' | 'pos' | 'atm'>('all');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');

  const cardTxns = transactions.filter(t => t.cardId === card.id);

  const filtered = cardTxns.filter(t => {
    const matchesSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesChannel = true;
    if (filterChannel === 'online') matchesChannel = t.paymentMethod === 'Online';
    if (filterChannel === 'pos') matchesChannel = t.paymentMethod === 'POS';
    if (filterChannel === 'atm') matchesChannel = t.paymentMethod === 'ATM';

    let matchesType = true;
    if (filterType === 'debit') matchesType = t.type === 'debit';
    if (filterType === 'credit') matchesType = t.type === 'credit';

    return matchesSearch && matchesChannel && matchesType;
  });

  const totalSpent = cardTxns
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = cardTxns
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const getChannelIcon = (method?: string) => {
    switch (method) {
      case 'Online': return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'POS': return <Store className="w-4 h-4 text-emerald-600" />;
      case 'ATM': return <Landmark className="w-4 h-4 text-amber-600" />;
      default: return <CreditCard className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Card</span>
        </button>
        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
          <span>{card.network}</span> • <span>•••• {card.cardNumber.slice(-4)}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Card Transaction Statement</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Detailed activity statement for purchases, subscriptions, ATM withdrawals & reversals.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Spent (30 Days)</p>
          <p className="text-base font-mono font-bold text-slate-900 dark:text-white mt-1">
            ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Refunds & Credits</p>
          <p className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            +₹{totalRefunds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search merchant, category, or Txn ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9.5 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'All Channels' },
            { id: 'online', label: 'Online / E-Com' },
            { id: 'pos', label: 'In-Store POS' },
            { id: 'atm', label: 'ATM Cash' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterChannel(f.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filterChannel === f.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length > 0 ? (
          filtered.map(txn => (
            <div
              key={txn.id}
              onClick={() => onSelectTransaction(txn)}
              className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getChannelIcon(txn.paymentMethod)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{txn.merchant}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{txn.date}</span>
                    <span>•</span>
                    <span className="capitalize">{txn.paymentMethod || 'Card Payment'}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{txn.id}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`text-xs font-mono font-bold ${
                  txn.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <span className="inline-block text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                  {txn.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <CreditCard className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-xs">No transactions match your current search and filter criteria.</p>
          </div>
        )}
      </div>

      {/* Download Statement Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Download e-Statement</p>
            <p className="text-[10px] text-slate-500">Official digitally signed PDF with stamp</p>
          </div>
        </div>
        <button
          onClick={() => alert('e-Statement for the current cycle has been downloaded and sent to your registered email.')}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};
