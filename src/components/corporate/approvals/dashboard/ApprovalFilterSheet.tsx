import React, { useEffect, useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import type {
  ApprovalDashboardFilters,
  ApprovalDisplayStatus,
  ApprovalItemType,
  ApprovalPriority,
} from '../../../../types/corporateApprovalsDashboard';

interface ApprovalFilterSheetProps {
  isOpen: boolean;
  filters: ApprovalDashboardFilters;
  onClose: () => void;
  onApply: (filters: ApprovalDashboardFilters) => void;
  onReset: () => void;
}

const TYPE_OPTIONS: { id: ApprovalItemType; label: string }[] = [
  { id: 'payment', label: 'Payments' },
  { id: 'beneficiary', label: 'Beneficiaries' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'bulk_payment', label: 'Bulk Payments' },
  { id: 'user_access', label: 'Users' },
  { id: 'limit_change', label: 'Limit Changes' },
];

const STATUS_OPTIONS: { id: ApprovalDisplayStatus; label: string }[] = [
  { id: 'pending_yours', label: 'Pending Your Approval' },
  { id: 'pending_other', label: 'Pending Others' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'returned', label: 'Returned' },
  { id: 'expired', label: 'Expired' },
  { id: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS: { id: ApprovalPriority; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
  { id: 'urgent', label: 'Urgent' },
];

const DATE_OPTIONS = [
  { id: 'today' as const, label: 'Today' },
  { id: '7days' as const, label: 'Last 7 Days' },
  { id: '30days' as const, label: 'Last 30 Days' },
  { id: 'custom' as const, label: 'Custom' },
];

const AMOUNT_OPTIONS = [
  { id: 'under1' as const, label: 'Under ₹1 Lakh' },
  { id: '1to5' as const, label: '₹1–5 Lakh' },
  { id: '5to10' as const, label: '₹5–10 Lakh' },
  { id: 'above10' as const, label: 'Above ₹10 Lakh' },
];

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-[12px] font-medium min-h-10 border ${
        active
          ? 'bg-congress-blue-700 text-white border-congress-blue-700'
          : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
      }`}
    >
      {label}
    </button>
  );
}

export const ApprovalFilterSheet: React.FC<ApprovalFilterSheetProps> = ({
  isOpen,
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    if (isOpen) setLocal(filters);
  }, [isOpen, filters]);

  const toggleType = (id: ApprovalItemType) => {
    setLocal((p) => ({
      ...p,
      types: p.types.includes(id) ? p.types.filter((x) => x !== id) : [...p.types, id],
    }));
  };

  const toggleStatus = (id: ApprovalDisplayStatus) => {
    setLocal((p) => ({
      ...p,
      statuses: p.statuses.includes(id) ? p.statuses.filter((x) => x !== id) : [...p.statuses, id],
    }));
  };

  const togglePriority = (id: ApprovalPriority) => {
    setLocal((p) => ({
      ...p,
      priorities: p.priorities.includes(id)
        ? p.priorities.filter((x) => x !== id)
        : [...p.priorities, id],
    }));
  };

  const toggleAmount = (id: (typeof AMOUNT_OPTIONS)[number]['id']) => {
    setLocal((p) => ({
      ...p,
      amountRanges: p.amountRanges.includes(id)
        ? p.amountRanges.filter((x) => x !== id)
        : [...p.amountRanges, id],
    }));
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filter Approvals" maxHeight="max-h-[90vh]">
      <div className="px-4 pb-4 space-y-5 overflow-y-auto">
        <section>
          <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Approval Type</p>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((o) => (
              <Chip key={o.id} active={local.types.includes(o.id)} label={o.label} onClick={() => toggleType(o.id)} />
            ))}
          </div>
        </section>
        <section>
          <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((o) => (
              <Chip key={o.id} active={local.statuses.includes(o.id)} label={o.label} onClick={() => toggleStatus(o.id)} />
            ))}
          </div>
        </section>
        <section>
          <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Priority</p>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_OPTIONS.map((o) => (
              <Chip key={o.id} active={local.priorities.includes(o.id)} label={o.label} onClick={() => togglePriority(o.id)} />
            ))}
          </div>
        </section>
        <section>
          <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Date</p>
          <div className="flex flex-wrap gap-2">
            {DATE_OPTIONS.map((o) => (
              <Chip
                key={o.id}
                active={local.dateRange === o.id}
                label={o.label}
                onClick={() => setLocal((p) => ({ ...p, dateRange: p.dateRange === o.id ? '' : o.id }))}
              />
            ))}
          </div>
        </section>
        <section>
          <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Amount</p>
          <div className="flex flex-wrap gap-2">
            {AMOUNT_OPTIONS.map((o) => (
              <Chip key={o.id} active={local.amountRanges.includes(o.id)} label={o.label} onClick={() => toggleAmount(o.id)} />
            ))}
          </div>
        </section>
        <section>
          <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Created By</p>
          <input
            value={local.createdBy}
            onChange={(e) => setLocal((p) => ({ ...p, createdBy: e.target.value }))}
            placeholder="Search by name"
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] min-h-11"
          />
        </section>
      </div>
      <div className="px-4 pb-6 pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
        <button
          type="button"
          onClick={() => {
            onReset();
            onClose();
          }}
          className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[15px] font-semibold min-h-12"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            onApply(local);
            onClose();
          }}
          className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white text-[15px] font-semibold min-h-12"
        >
          Apply Filters
        </button>
      </div>
    </BottomSheet>
  );
};
