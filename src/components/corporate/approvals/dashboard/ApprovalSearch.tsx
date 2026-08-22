import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CorporateApprovalItem } from '../../../../types/corporateApprovalsDashboard';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';

interface ApprovalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => CorporateApprovalItem[];
  onSelect: (approvalId: string) => void;
  hideAmounts?: boolean;
}

export const ApprovalSearch: React.FC<ApprovalSearchProps> = ({
  isOpen,
  onClose,
  onSearch,
  onSelect,
  hideAmounts = false,
}) => {
  const [query, setQuery] = useState('');
  const results = query.trim() ? onSearch(query) : [];

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col"
        >
          <div className="px-4 py-3 safe-top border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 max-w-[430px] mx-auto w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by beneficiary, amount, ID..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] min-h-12"
                autoFocus
                aria-label="Search approvals"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 max-w-[430px] mx-auto w-full">
            {query.trim() && results.length === 0 && (
              <p className="text-[13px] text-slate-500 dark:text-slate-400 text-center py-8">No approvals found</p>
            )}
            <div className="space-y-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.approvalId);
                    onClose();
                  }}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left min-h-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
                >
                  <p className="text-[14px] font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{item.typeLabel}</p>
                  {item.amount !== undefined && (
                    <p className="text-[14px] font-semibold text-slate-900 dark:text-white mt-1 tabular-nums">
                      {hideAmounts ? '₹••••••' : formatPaymentCurrency(item.amount, item.currency)}
                    </p>
                  )}
                  <div className="mt-2">
                    <ApprovalStatusBadge status={item.status} label={item.statusLabel} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
