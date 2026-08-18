import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  FileDown, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  ChevronRight, 
  Building2, 
  Copy, 
  Check, 
  Calendar, 
  Layers,
  X,
  Share2,
  Download,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount, Transaction } from '../../types/banking';

export const RetailAccounts: React.FC = () => {
  const { accounts, transactions, addToast, setBottomNavHidden } = useBanking();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount>(accounts[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Bottom Navigation visibility: HIDDEN during Account Details, Transaction Details, or Statement flow
  useEffect(() => {
    if (selectedTxn || showStatementModal || showAccountDetailsModal) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [selectedTxn, showStatementModal, showAccountDetailsModal, setBottomNavHidden]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: `${fieldName} copied successfully.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExportStatement = (format: 'PDF' | 'CSV' | 'Excel') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      addToast({
        type: 'success',
        title: 'Statement Downloaded',
        message: `Account statement for ${selectedAccount.accountType} generated in ${format} format.`,
      });
    }, 1200);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Account Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {accounts.map(acc => {
          const isSelected = acc.id === selectedAccount.id;
          return (
            <button
              key={acc.id}
              onClick={() => setSelectedAccount(acc)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{acc.accountType} ({acc.maskedNumber.slice(-4)})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Account Details Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/80 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              {selectedAccount.nickname || `${selectedAccount.accountType} Account`}
            </span>
            <p className="text-xs text-slate-400 font-mono mt-1">{selectedAccount.maskedNumber}</p>
          </div>
          <button
            onClick={() => handleCopy(selectedAccount.accountNumber, 'Account Number')}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-xl"
          >
            {copiedField === 'Account Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px]">Copy</span>
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-400">Available Balance</p>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-slate-200 p-0.5 transition-colors rounded"
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {showBalance ? `₹${selectedAccount.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '••••••••'}
          </h2>
          {selectedAccount.holdAmount && selectedAccount.holdAmount > 0 && (
            <p className="text-[11px] text-amber-400">
              ₹{selectedAccount.holdAmount.toLocaleString('en-IN')} on temporary hold / lien
            </p>
          )}
        </div>

        {/* Bank Details Grid */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-500 text-[10px]">IFSC Code</span>
            <div className="flex items-center gap-1 font-mono font-bold text-slate-200">
              <span>{selectedAccount.ifsc}</span>
              <button onClick={() => handleCopy(selectedAccount.ifsc, 'IFSC Code')}>
                <Copy className="w-3 h-3 text-slate-400 hover:text-white" />
              </button>
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Interest Rate</span>
            <p className="font-bold text-slate-200">
              {selectedAccount.interestRate ? `${selectedAccount.interestRate}% p.a. (Quarterly payout)` : 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Branch</span>
            <p className="font-semibold text-slate-200 truncate">{selectedAccount.branch}</p>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Nominee Status</span>
            <p className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Registered
            </p>
          </div>
        </div>
      </div>

      {/* Statement Export Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Download e-Statement</h4>
          <p className="text-[11px] text-slate-400">Official digitally signed bank statement</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => handleExportStatement('PDF')}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={() => handleExportStatement('Excel')}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
          >
            <FileDown className="w-3.5 h-3.5" /> Excel
          </button>
        </div>
      </div>

      {/* Transaction History & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Transaction Activity ({filteredTransactions.length})
          </h3>
        </div>

        {/* Search & Filter Chips */}
        <div className="space-y-2.5 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by payee, reference, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('credit')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'credit'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Money In (Credits)
            </button>
            <button
              onClick={() => setFilterType('debit')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'debit'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Money Out (Debits)
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No transactions match your search filter.
            </div>
          ) : (
            filteredTransactions.map((txn) => {
              const isCredit = txn.type === 'credit';
              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCredit 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {txn.description}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {txn.date} • {txn.paymentMode} • Ref: {txn.referenceNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-xs font-extrabold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                    </p>
                    {txn.balanceAfter && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Bal: ₹{txn.balanceAfter.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Transaction Details Sheet Modal (Bottom Nav Hidden) */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Details</span>
                <button 
                  onClick={() => setSelectedTxn(null)} 
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center py-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedTxn.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {selectedTxn.type === 'credit' ? 'Money Credited' : 'Payment Debited'}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  ₹{selectedTxn.amount.toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{selectedTxn.description}</p>
              </div>

              <div className="py-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                <div className="flex justify-between">
                  <span>Reference UTR:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-200">{selectedTxn.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{selectedTxn.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span>{selectedTxn.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Counterparty:</span>
                  <span>{selectedTxn.counterpartyName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-500 font-bold">COMPLETED</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTxn(null)}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-md text-xs transition-all"
              >
                Close Transaction Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
