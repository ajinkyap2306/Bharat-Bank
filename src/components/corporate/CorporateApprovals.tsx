import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  AlertTriangle,
  Building2,
  CheckCheck,
  Download,
  Eye
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { PaymentApproval } from '../../types/banking';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const CorporateApprovals: React.FC = () => {
  const { 
    approvals, 
    approveCorporatePayment, 
    rejectCorporatePayment, 
    addToast,
    setBottomNavHidden 
  } = useBanking();

  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<PaymentApproval | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Bottom Navigation visibility: HIDDEN during Approval Review detail or Reject dialog
  useEffect(() => {
    if (selectedApproval || showRejectModal) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [selectedApproval, showRejectModal, setBottomNavHidden]);

  const filteredApprovals = approvals.filter(item => {
    const matchesFilter = activeFilter === 'all' ? true : item.status === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  const handleApproveSingle = (item: PaymentApproval) => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    approveCorporatePayment(item.id, 'Approved via Maker-Checker workflow');
    setSelectedApproval(null);
  };

  const handleConfirmReject = () => {
    if (!selectedApproval) return;
    if (!rejectReason.trim()) {
      addToast({ type: 'warning', title: 'Rejection Reason', message: 'Please enter a justification.' });
      return;
    }
    rejectCorporatePayment(selectedApproval.id, rejectReason);
    setShowRejectModal(false);
    setSelectedApproval(null);
    setRejectReason('');
  };

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      approveCorporatePayment(id, 'Batch Approved by CFO');
    });
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 }
    });
    addToast({
      type: 'success',
      title: 'Batch Execution Complete',
      message: `${selectedIds.length} payments have been approved and scheduled for RTGS/NEFT settlement.`,
    });
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Governance
              </span>
              <span className="text-xs text-slate-400">Maker-Checker Matrix</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Payment Authorizations</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Dual-signatory verification for enterprise outflows
            </p>
          </div>
          
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('pending')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'pending'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <span>Pending</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('approved')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'approved'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <span>Approved</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('rejected')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'rejected'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <span>Declined</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
            {rejectedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-2 rounded-xl transition-all ${
            activeFilter === 'all'
              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          All
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by vendor, batch or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-teal-600 shadow-xs"
        />
      </div>

      {/* Batch Action Bar if items selected */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-teal-900 text-white shadow-lg flex items-center justify-between"
        >
          <div className="text-xs">
            <span className="font-bold">{selectedIds.length} item(s) selected</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl border border-white/20 text-xs hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleBatchApprove}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Approve All</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Approvals List */}
      <div className="space-y-3">
        {filteredApprovals.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <FileCheck2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Approvals Found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
              There are currently no items matching your filter criteria.
            </p>
          </div>
        ) : (
          filteredApprovals.map((item) => {
            const isPending = item.status === 'pending';
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all shadow-xs ${
                  isSelected 
                    ? 'border-teal-500 ring-2 ring-teal-500/20' 
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {isPending && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="mt-1 w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          {item.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                          item.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : item.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Beneficiary: <strong className="text-slate-700 dark:text-slate-300">{item.beneficiaryName}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-extrabold text-slate-900 dark:text-white">
                      {item.amount > 0 ? `₹${item.amount.toLocaleString('en-IN')}` : 'Beneficiary Setup'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.paymentMode}</p>
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:divide-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Initiated by: {item.initiatedBy}</span>
                  <span>{item.initiatedAt}</span>
                </div>

                {/* Rejection Note if any */}
                {item.rejectionReason && (
                  <div className="mt-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[10px] text-rose-700 dark:text-rose-300">
                    <strong>Decline Reason:</strong> {item.rejectionReason}
                  </div>
                )}

                {/* Action Buttons for Pending */}
                {isPending && (
                  <div className="mt-3 pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleApproveSingle(item)}
                      className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApproval(item);
                        setShowRejectModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedApproval(item)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Review Modal */}
      {selectedApproval && !showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Approval Audit Details</h3>
              <button onClick={() => setSelectedApproval(null)} className="text-slate-400 text-xs font-bold">✕</button>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 text-center space-y-1">
              <p className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400">Total Settlement Value</p>
              <p className="text-2xl font-black text-teal-950 dark:text-teal-100 font-mono">
                ₹{selectedApproval.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Batch ID: {selectedApproval.batchId || 'N/A'}
              </p>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApproval.beneficiaryName}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Bank & IFSC:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedApproval.bankName} • {selectedApproval.ifsc}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Debit Account:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedApproval.debitAccount}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Initiator (Maker):</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedApproval.initiatedBy}</span>
              </div>
              <div className="py-1 flex justify-between">
                <span className="text-slate-500">Signatures:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {selectedApproval.currentApprovals} / {selectedApproval.requiredApprovals}
                </span>
              </div>
              {selectedApproval.notes && (
                <div className="py-1 text-slate-600 dark:text-slate-400 italic">
                  "{selectedApproval.notes}"
                </div>
              )}
            </div>

            {selectedApproval.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleApproveSingle(selectedApproval)}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
                >
                  Authorize Payout
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs"
                >
                  Decline
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-rose-600">State Reason for Declining</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Discrepancy in supplier invoice amount..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Submit Rejection
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs"
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
