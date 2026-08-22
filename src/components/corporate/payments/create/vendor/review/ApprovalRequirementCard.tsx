import React from 'react';
import { Shield } from 'lucide-react';

interface ApprovalRequirementCardProps {
  approvalLabel: string;
  description: string;
  levels: number;
}

export const ApprovalRequirementCard: React.FC<ApprovalRequirementCardProps> = ({
  approvalLabel,
  description,
  levels,
}) => (
  <section className="px-4" aria-labelledby="approval-required-heading">
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-[#F59E0B]" aria-hidden />
        </div>
        <div>
          <h2 id="approval-required-heading" className="text-[15px] font-semibold text-slate-900 dark:text-white">
            Approval Required
          </h2>
          <p className="text-[14px] font-medium text-congress-blue-700 dark:text-congress-blue-400 mt-1">{approvalLabel}</p>
          {levels > 1 && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
              Payment above ₹5,00,000 requires additional approval.
            </p>
          )}
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </section>
);
