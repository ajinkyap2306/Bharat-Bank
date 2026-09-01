import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown, Layers, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../../../context/BankingContext';
import { Transaction } from '../../../../types/banking';
import { MiniStatementSheet } from '../../../common/MiniStatementSheet';
import { shareAccountDetails } from '../../../../utils/shareAccountDetails';
import { maskRegisteredEmail, sendStatementToRegisteredEmail } from '../../../../utils/statementDelivery';
import {
  AccountsScreenLayout,
  AccountsStickyCTA,
  AccountHeroCard,
  TransactionActivitySection,
} from '../shared/RetailAccountsUI';

export const AccountDetailsScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts, transactions, primaryAccountId, user, addToast } = useBanking();
  const account = accounts.find((a) => a.id === accountId);

  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showMiniStatement, setShowMiniStatement] = useState(false);

  if (!account) {
    return (
      <AccountsScreenLayout
        title="Account Details"
        onBack={() => navigate('/retail/accounts', { replace: true })}
      >
        <p className="text-sm text-slate-500">Account not found.</p>
      </AccountsScreenLayout>
    );
  }

  const accountTransactions = transactions.filter((t) => t.accountId === accountId || !t.accountId);

  const handleCopy = () => {
    navigator.clipboard?.writeText(account.accountNumber);
    setCopied(true);
    addToast({ type: 'info', title: 'Copied', message: 'Account number copied.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const result = await shareAccountDetails(
      {
        accountType: account.accountType,
        accountNumber: account.accountNumber,
        ifsc: account.ifsc,
        branch: account.branch,
        accountHolder: user.name,
      },
      (message) => addToast({ type: 'info', title: 'Share', message })
    );
    if (result === 'shared') {
      addToast({ type: 'success', title: 'Shared', message: 'Account details shared.' });
    }
  };

  const handleExport = (format: string) => {
    addToast({
      type: 'success',
      title: 'Statement Downloaded',
      message: `Statement generated in ${format} format.`,
    });
  };

  const handleSendStatementEmail = async () => {
    try {
      await sendStatementToRegisteredEmail({
        email: user.email,
        accountLabel: account.nickname || account.accountType,
        periodLabel: 'Latest statement',
        format: 'PDF',
      });
      addToast({
        type: 'success',
        title: 'Statement Sent',
        message: `Your e-statement has been sent to ${user.email}.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Unable to Send',
        message: 'No registered email found on your profile.',
      });
    }
  };

  return (
    <AccountsScreenLayout
      title="Account Details"
      onBack={() => navigate('/retail/accounts', { replace: true })}
    >
      <AccountHeroCard
        account={account}
        isPrimary={account.id === primaryAccountId}
        showBalance={showBalance}
        onToggleBalance={() => setShowBalance(!showBalance)}
        onCopyAccount={handleCopy}
        onShare={handleShare}
        copied={copied}
      />

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Download e-Statement</h4>
          <p className="text-[11px] text-slate-400">Official digitally signed statement</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Registered email: {maskRegisteredEmail(user.email)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setShowMiniStatement(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" /> Mini
          </button>
          <button
            type="button"
            onClick={() => handleExport('PDF')}
            className="px-3 py-1.5 rounded-xl bg-congress-blue-50 text-congress-blue-700 text-xs font-bold flex items-center gap-1"
          >
            <FileDown className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            type="button"
            onClick={() => void handleSendStatementEmail()}
            className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
        </div>
      </div>

      <TransactionActivitySection
        transactions={accountTransactions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
        onSelectTxn={setSelectedTxn}
      />

      <AccountsStickyCTA
        label={account.isJointAccount ? 'Joint Account' : 'Manage Account'}
        onClick={() =>
          account.isJointAccount
            ? navigate(`/retail/joint-account/${accountId}`)
            : navigate(`/retail/accounts/${accountId}/manage`)
        }
      />

      <MiniStatementSheet
        isOpen={showMiniStatement}
        onClose={() => setShowMiniStatement(false)}
        account={account}
        transactions={accountTransactions}
      />

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
                <span className="text-xs font-bold text-slate-500 uppercase">Transaction Details</span>
                <button type="button" onClick={() => setSelectedTxn(null)} className="p-1 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center py-4">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  ₹{selectedTxn.amount.toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{selectedTxn.description}</p>
              </div>
              <div className="py-3 space-y-2 text-xs text-slate-600 font-mono bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl">
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-bold">{selectedTxn.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{selectedTxn.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span>{selectedTxn.paymentMode}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="w-full mt-4 py-3 bg-congress-blue-700 text-white font-bold rounded-2xl text-xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AccountsScreenLayout>
  );
};
