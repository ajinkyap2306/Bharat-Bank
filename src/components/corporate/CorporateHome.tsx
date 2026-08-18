import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  SendHorizontal, 
  FileCheck2, 
  Users, 
  Layers, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Plus, 
  Upload, 
  FileText, 
  Globe2, 
  Landmark, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  CreditCard,
  Briefcase,
  Zap,
  Sparkles,
  PieChart
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const CorporateHome: React.FC = () => {
  const { 
    user, 
    accounts, 
    transactions, 
    approvals, 
    setCorporateTab, 
    approveCorporatePayment, 
    rejectCorporatePayment, 
    addToast,
    setBottomNavHidden 
  } = useBanking();

  const [showBalances, setShowBalances] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Bottom Navigation visibility: HIDDEN during Approval details or Reject dialog
  useEffect(() => {
    if (selectedApproval || showRejectModal) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [selectedApproval, showRejectModal, setBottomNavHidden]);

  // Total Corporate Liquidity
  const totalLiquidity = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const pendingTotal = pendingApprovals.reduce((sum, a) => sum + a.amount, 0);

  const handleQuickApprove = (id: string, title: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    approveCorporatePayment(id, 'Quick approved from Corporate Dashboard');
    setSelectedApproval(null);
  };

  const handleReject = () => {
    if (!selectedApproval) return;
    if (!rejectReason.trim()) {
      addToast({ type: 'warning', title: 'Reason Required', message: 'Please specify the rejection reason.' });
      return;
    }
    rejectCorporatePayment(selectedApproval.id, rejectReason);
    setShowRejectModal(false);
    setSelectedApproval(null);
    setRejectReason('');
  };

  return (
    <div className="p-4 space-y-5 pb-24 max-w-lg mx-auto">
      {/* Corporate Master Liquidity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-5 shadow-2xl border border-teal-800/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-teal-200 tracking-wide uppercase">{user.companyName}</h3>
                <p className="text-[10px] text-slate-400 font-mono">CIN: {user.cin}</p>
              </div>
            </div>

            <button
              onClick={() => setShowBalances(!showBalances)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 transition-colors"
              aria-label="Toggle Balance Visibility"
            >
              {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Balance Figure */}
          <div>
            <span className="text-[11px] text-teal-300/80 font-medium">Total Enterprise Liquidity</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5 text-white flex items-baseline gap-1">
              <span>₹</span>
              <span>{showBalances ? (totalLiquidity / 10000000).toFixed(2) + ' Cr' : '••••••••'}</span>
              <span className="text-xs font-normal text-teal-400 ml-1.5">
                ({accounts.length} Active Accounts)
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% Net Inward Collections vs last week
            </p>
          </div>

          {/* Account Pills Carousel */}
          <div className="pt-1 flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {accounts.map(acc => (
              <div
                key={acc.id}
                onClick={() => setCorporateTab('accounts')}
                className="shrink-0 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-2.5 min-w-[130px] cursor-pointer transition-all backdrop-blur-xs"
              >
                <p className="text-[10px] text-slate-300 truncate font-semibold">{acc.accountType}</p>
                <p className="font-mono font-bold text-white text-xs mt-0.5">
                  {showBalances ? `₹${(acc.balance / 100000).toFixed(1)}L` : '••••'}
                </p>
                <p className="text-[9px] text-teal-300 font-mono mt-0.5">{acc.maskedNumber}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maker-Checker Pending Approvals Alert Banner */}
      {pendingApprovals.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-amber-950/20 border border-amber-500/30 dark:border-amber-700/50 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Maker-Checker Action Required
                  </h4>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white animate-pulse">
                    {pendingApprovals.length} PENDING
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Total ₹{(pendingTotal / 100000).toFixed(2)} Lakhs awaiting second authorization
                </p>
              </div>
            </div>
            <button
              onClick={() => setCorporateTab('approvals')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Top Pending Item Quick Review */}
          <div className="bg-white dark:bg-slate-900/90 rounded-xl p-3 border border-amber-200/80 dark:border-amber-900/50 shadow-xs space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {pendingApprovals[0].title}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Initiated by {pendingApprovals[0].initiatedBy} • {pendingApprovals[0].paymentMode}
                </p>
              </div>
              <span className="font-mono font-bold text-xs text-slate-900 dark:text-white shrink-0">
                ₹{pendingApprovals[0].amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setSelectedApproval(pendingApprovals[0])}
                className="flex-1 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors"
              >
                Review & Authorize
              </button>
              <button
                onClick={() => {
                  setSelectedApproval(pendingApprovals[0]);
                  setShowRejectModal(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold text-[11px] hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Corporate Action Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Enterprise Operations
        </h3>

        <div className="grid grid-cols-4 gap-2.5">
          {/* Vendor Payout */}
          <button
            onClick={() => setCorporateTab('payments')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <SendHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2 text-center leading-tight">
              Single Payout
            </span>
          </button>

          {/* Bulk Payroll */}
          <button
            onClick={() => setCorporateTab('payroll')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2 text-center leading-tight">
              Bulk Payroll
            </span>
          </button>

          {/* Tax / GST Payment */}
          <button
            onClick={() => {
              setCorporateTab('payments');
              addToast({ type: 'info', title: 'Statutory Taxes', message: 'GST & Corporate Advance Tax payment tab opened.' });
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2 text-center leading-tight">
              Tax & GST
            </span>
          </button>

          {/* Forex Remittance */}
          <button
            onClick={() => {
              setCorporateTab('payments');
              addToast({ type: 'info', title: 'EEFC Forex', message: 'Cross-border outward remittance mode selected.' });
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-2 text-center leading-tight">
              Forex Wire
            </span>
          </button>
        </div>
      </div>

      {/* Corporate Commercial Cards Snapshot */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Commercial Cards Active</h4>
          </div>
          <button
            onClick={() => setCorporateTab('cards')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Manage Cards
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Executive Prime Visa (•• 7712)</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Limit: ₹25.0 Lakh • Avail: ₹21.8 Lakh</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Active
          </span>
        </div>
      </div>

      {/* Live Transaction Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Live Corporate Ledger</h4>
          <button
            onClick={() => setCorporateTab('accounts')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Full Statement
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.slice(0, 5).map(txn => (
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
                <p className="text-[9px] text-slate-400 dark:text-slate-500">{txn.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal for Approval */}
      {selectedApproval && !showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authorize Payout</h3>
              </div>
              <button 
                onClick={() => setSelectedApproval(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 space-y-1">
              <p className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold uppercase">Payment Amount</p>
              <p className="text-xl font-extrabold text-teal-950 dark:text-teal-200 font-mono">
                ₹{selectedApproval.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Mode: {selectedApproval.paymentMode} • Debit: {selectedApproval.debitAccount}
              </p>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApproval.beneficiaryName}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Bank & IFSC:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedApproval.bankName} ({selectedApproval.ifsc})</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Maker:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedApproval.initiatedBy}</span>
              </div>
              {selectedApproval.notes && (
                <div className="py-1">
                  <span className="text-slate-500 block mb-0.5">Maker Remarks:</span>
                  <span className="text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg block">
                    "{selectedApproval.notes}"
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleQuickApprove(selectedApproval.id, selectedApproval.title)}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Sign & Execute Payout
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-50"
              >
                Reject
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">Decline Payout</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 text-xs font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Please enter the audit reason for rejecting payment to <strong>{selectedApproval?.beneficiaryName}</strong>:
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Inconsistent invoice number with purchase order PO-4910..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-teal-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleReject}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirm Decline
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 dark:text-slate-400 text-xs"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
