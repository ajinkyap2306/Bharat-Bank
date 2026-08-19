import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { PaymentsHomePaymentItem } from '../../../../types/corporatePaymentsHome';
import { PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';

interface PaymentSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => PaymentsHomePaymentItem[];
  onSelect: (id: string) => void;
  showBalances: boolean;
}

export const PaymentSearch: React.FC<PaymentSearchProps> = ({
  isOpen,
  onClose,
  onSearch,
  onSelect,
  showBalances,
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
          className="fixed inset-0 z-50 bg-[#F7F9FC] dark:bg-slate-950 flex flex-col"
        >
          <div className="px-4 py-3 safe-top border-b border-[#E4E7EC] dark:border-slate-800 flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search payments, beneficiaries, amounts..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-white dark:bg-slate-900 text-[14px] min-h-12"
                autoFocus
                aria-label="Search payments"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-xl border border-[#E4E7EC] flex items-center justify-center"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-[#667085]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {query.trim() && results.length === 0 && (
              <p className="text-[13px] text-[#667085] text-center py-8">No payments found</p>
            )}
            <div className="space-y-2">
              {results.map((item) => (
                <button
                  key={`${item.id}-${item.paymentId}`}
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 text-left min-h-16"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
                        {item.beneficiary}
                      </p>
                      <p className="text-[12px] text-[#667085] mt-0.5">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold tabular-nums">
                        {showBalances
                          ? formatPaymentCurrency(item.amount, item.currency)
                          : '••••••'}
                      </p>
                      <PaymentStatusBadge status={item.status} />
                    </div>
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
