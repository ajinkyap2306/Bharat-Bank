import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

const ISSUE_OPTIONS = [
  'Unknown Transaction',
  'Incorrect Amount',
  'Duplicate Payment',
  'Beneficiary Issue',
  'Payment Not Received',
  'Other',
] as const;

interface ReportIssueSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: string) => void;
}

export const ReportIssueSheet: React.FC<ReportIssueSheetProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit(selected);
    setSelected(null);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Report an Issue" subtitle="Select issue type">
      <div className="px-4 pb-6 space-y-2">
        {ISSUE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border text-[14px] font-medium min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] ${
              selected === option
                ? 'border-[#0B5CAB] bg-blue-50/50 dark:bg-blue-950/30 text-[#0B5CAB]'
                : 'border-[#E4E7EC] dark:border-slate-700 text-[#111827] dark:text-white'
            }`}
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full mt-4 py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm disabled:opacity-50 min-h-11"
        >
          Submit Issue
        </button>
      </div>
    </BottomSheet>
  );
};
