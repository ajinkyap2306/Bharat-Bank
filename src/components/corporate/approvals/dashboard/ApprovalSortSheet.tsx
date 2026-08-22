import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { ApprovalSortOption } from '../../../../types/corporateApprovalsDashboard';

interface ApprovalSortSheetProps {
  isOpen: boolean;
  value: ApprovalSortOption;
  onClose: () => void;
  onSelect: (value: ApprovalSortOption) => void;
}

const OPTIONS: { id: ApprovalSortOption; label: string }[] = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'highest_amount', label: 'Highest Amount' },
  { id: 'lowest_amount', label: 'Lowest Amount' },
  { id: 'due_date', label: 'Due Date' },
];

export const ApprovalSortSheet: React.FC<ApprovalSortSheetProps> = ({
  isOpen,
  value,
  onClose,
  onSelect,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Sort Approvals">
    <div className="px-4 pb-6 space-y-1">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => {
            onSelect(o.id);
            onClose();
          }}
          className={`w-full text-left px-4 py-3.5 rounded-xl text-[15px] min-h-11 ${
            value === o.id
              ? 'bg-congress-blue-50 dark:bg-congress-blue-950/40 text-congress-blue-700 dark:text-congress-blue-400 font-semibold'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  </BottomSheet>
);
