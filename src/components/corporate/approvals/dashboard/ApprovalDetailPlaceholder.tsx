import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApprovalDetailPlaceholderProps {
  approvalId: string;
}

export const ApprovalDetailPlaceholder: React.FC<ApprovalDetailPlaceholderProps> = ({
  approvalId,
}) => {
  const navigate = useNavigate();

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
      <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 safe-top">
        <div className="flex items-center gap-2 px-4 py-3 min-h-14 max-w-[430px] mx-auto">
          <button
            type="button"
            onClick={() => navigate('/corporate/approvals')}
            className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 flex items-center justify-center"
            aria-label="Back to approvals"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white">Approval Details</h1>
        </div>
      </header>
      <div className="max-w-[430px] mx-auto px-4 py-12 text-center">
        <p className="text-[14px] text-[#667085]">Approval ID: {approvalId}</p>
        <p className="text-[15px] font-medium text-[#111827] dark:text-white mt-4">
          Approval details will be available in the next step.
        </p>
      </div>
    </div>
  );
};
