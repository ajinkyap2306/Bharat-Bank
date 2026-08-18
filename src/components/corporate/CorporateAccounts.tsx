import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Wallet, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Calendar, 
  Filter, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Layers,
  Lock,
  X
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankAccount, Transaction } from '../../types/banking';
import { motion, AnimatePresence } from 'motion/react';

export const CorporateAccounts: React.FC = () => {
  const { accounts, transactions, addToast, setBottomNavHidden } = useBanking();
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [statementRange, setStatementRange] = useState('current_month');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showStatementModal, setShowStatementModal] = useState(false);

  // Bottom Navigation visibility: HIDDEN during Account Details / Transaction Details sheet
  useEffect(() => {
    if (selectedTxn || showStatementModal) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [selectedTxn, showStatementModal, setBottomNavHidden]);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast({ type: 'info', title: 'Copied to Clipboard', message: text });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadStatement = (format: 'pdf' | 'csv' | 'mt940') => {
    addToast({
      type: 'success',
      title: `Statement Export (${format.toUpperCase()})`,
      message: `Account statement for ${selectedAccount.nickname} generated successfully.`,
    });
  };

  return (
    <div className="p-4 space-y-5 pb-28 max-w-lg mx-auto">
      {/* Header Summary */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-teal-800/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider">Treasury Architecture</span>
            <h2 className="text-2xl font-black text-white mt-1">₹{(totalBalance / 10000000).toFixed(2)} Cr</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Consolidated balance across {accounts.length} enterprise accounts
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Account Horizontal Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {accounts.map(acc => {
          const isSelected = acc.id === selectedAccountId;
          return (
            <button
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`shrink-0 p-3.5 rounded-2xl border text-left transition-all min-w-[170px] ${
                isSelected
                  ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {acc.accountType}
                </span>
                <span className="text-[9px] font-mono text-teal-600 dark:text-teal-400">
                  {acc.maskedNumber}
                </span>
              </div>
              <p className="text-sm font-mono font-extrabold text-slate-900 dark:text-white mt-1.5">
                ₹{(acc.balance / 100000).toFixed(1)}L
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                {acc.nickname}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Account Deep Details Card */}
      {selectedAccount && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                {selectedAccount.accountType} Account
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                {selectedAccount.nickname}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <span>Acc: {selectedAccount.accountNumber}</span>
                <button
                  onClick={() => handleCopy(selectedAccount.accountNumber, 'acc_num')}
                  className="text-teal-600 hover:text-teal-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Ledger Balance</span>
              <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
                ₹{selectedAccount.balance.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Available for Outflows</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                ₹{selectedAccount.availableBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Hold / Lien Amount</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                ₹{(selectedAccount.holdAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>IFSC Code:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedAccount.ifsc}</span>
            </div>
            <div className="flex justify-between">
              <span>Branch:</span>
              <span className="text-slate-800 dark:text-slate-200">{selectedAccount.branch}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-600 font-bold uppercase">{selectedAccount.status}</span>
            </div>
          </div>

          {/* Statement Export Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Generate Account Statements
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDownloadStatement('pdf')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>PDF Slip</span>
              </button>
              <button
                onClick={() => handleDownloadStatement('csv')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>CSV / Excel</span>
              </button>
              <button
                onClick={() => handleDownloadStatement('mt940')}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>MT940 Swift</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Transactions Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Statement Entries
        </h4>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map(txn => (
            <div key={txn.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  txn.type === 'credit'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {txn.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {txn.counterpartyName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {txn.description} • <span className="font-mono">{txn.paymentMode}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`text-xs font-mono font-bold ${
                  txn.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[9px] text-slate-400">{txn.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
