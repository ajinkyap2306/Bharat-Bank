import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

const ISSUE_OPTIONS = [
  'Wrong Amount',
  'Unknown Transaction',
  'Duplicate Transaction',
  'Beneficiary Issue',
  'Other',
];

interface ReportIssueSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: string) => void;
}

export const ReportIssueSheet: React.FC<ReportIssueSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Report an Issue">
      <div className="space-y-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {ISSUE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(option)}
              className={`px-3 py-2 rounded-full text-[13px] font-medium min-h-9 ${
                selected === option
                  ? 'bg-[#0B5CAB] text-white'
                  : 'bg-[#F7F9FC] dark:bg-slate-800 text-[#667085] border border-[#E4E7EC] dark:border-slate-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (selected) {
              onSubmit(selected);
              setSelected(null);
              onClose();
            }
          }}
          className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12 disabled:opacity-50"
        >
          Submit Issue
        </button>
      </div>
    </BottomSheet>
  );
};
