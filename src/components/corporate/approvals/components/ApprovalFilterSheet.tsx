import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ApprovalFilters {
  categories: string[];
  statuses: string[];
  amountRanges: string[];
  createdBy: string;
  dateRange: string;
}

interface ApprovalFilterSheetProps {
  open: boolean;
  filters: ApprovalFilters;
  onClose: () => void;
  onApply: (filters: ApprovalFilters) => void;
  onReset: () => void;
}

const CATEGORY_OPTIONS = [
  { id: 'payment', label: 'Payments' },
  { id: 'beneficiary', label: 'Beneficiaries' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'user', label: 'Users' },
  { id: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'delegated', label: 'Delegated' },
];

const AMOUNT_OPTIONS = [
  { id: 'under1', label: 'Under ₹1 Lakh' },
  { id: '1to5', label: '₹1–5 Lakh' },
  { id: '5to10', label: '₹5–10 Lakh' },
  { id: 'above10', label: 'Above ₹10 Lakh' },
];

const DATE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: '7days', label: 'Last 7 Days' },
  { id: '30days', label: 'Last 30 Days' },
  { id: 'custom', label: 'Custom' },
];

export const ApprovalFilterSheet: React.FC<ApprovalFilterSheetProps> = ({
  open,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const [local, setLocal] = React.useState(filters);

  React.useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const toggle = (key: 'categories' | 'statuses' | 'amountRanges', id: string) => {
    setLocal((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-900 px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-bold text-[#111827] dark:text-white">Filter Approvals</h3>
              <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-5">
              <section>
                <p className="text-xs font-bold text-[#667085] uppercase mb-2">Request Type</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggle('categories', o.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold min-h-11 ${
                        local.categories.includes(o.id) ? 'bg-[#0B5CAB] text-white' : 'bg-slate-100 text-[#667085]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <p className="text-xs font-bold text-[#667085] uppercase mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggle('statuses', o.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold min-h-11 ${
                        local.statuses.includes(o.id) ? 'bg-[#0B5CAB] text-white' : 'bg-slate-100 text-[#667085]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <p className="text-xs font-bold text-[#667085] uppercase mb-2">Amount</p>
                <div className="flex flex-wrap gap-2">
                  {AMOUNT_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggle('amountRanges', o.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold min-h-11 ${
                        local.amountRanges.includes(o.id) ? 'bg-[#0B5CAB] text-white' : 'bg-slate-100 text-[#667085]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <p className="text-xs font-bold text-[#667085] uppercase mb-2">Created By</p>
                <input
                  value={local.createdBy}
                  onChange={(e) => setLocal({ ...local, createdBy: e.target.value })}
                  placeholder="Select corporate user"
                  className="w-full p-3 rounded-xl border text-sm"
                />
              </section>
              <section>
                <p className="text-xs font-bold text-[#667085] uppercase mb-2">Date</p>
                <div className="flex flex-wrap gap-2">
                  {DATE_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setLocal({ ...local, dateRange: o.id })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold min-h-11 ${
                        local.dateRange === o.id ? 'bg-[#0B5CAB] text-white' : 'bg-slate-100 text-[#667085]'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
            <div className="sticky bottom-0 p-4 bg-white dark:bg-slate-900 border-t flex gap-2">
              <button type="button" onClick={onReset} className="flex-1 py-3.5 rounded-2xl border font-bold text-sm text-[#667085] min-h-11">
                Reset
              </button>
              <button type="button" onClick={() => onApply(local)} className="flex-1 py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11">
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
