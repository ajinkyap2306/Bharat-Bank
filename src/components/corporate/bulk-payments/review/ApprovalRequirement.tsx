import React from 'react';
import { Check } from 'lucide-react';
import { Shield } from 'lucide-react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface ApprovalRequirementProps {
  data: BulkBatchReview;
}

export const ApprovalRequirement: React.FC<ApprovalRequirementProps> = ({ data }) => (
  <PayCard className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
    <div className="flex items-start gap-3">
      <Shield className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400 shrink-0 mt-0.5" aria-hidden />
      <div className="flex-1">
        <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">Approval Required</h3>
        <p className="text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 mt-1">{data.approvalLabel}</p>
        <ol className="mt-4 space-y-3" aria-label="Approval workflow">
          {data.approvalLevels.map((level) => (
            <li key={level.role} className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  level.status === 'completed'
                    ? 'bg-emerald-600 border-[#16A34A] text-white'
                    : level.status === 'pending'
                      ? 'bg-congress-blue-700 border-congress-blue-700 text-white ring-4 ring-congress-blue-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}
                aria-hidden
              >
                {level.status === 'completed' ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : level.status === 'pending' ? (
                  <span className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                )}
              </span>
              <span
                className={`text-[14px] font-medium ${
                  level.status === 'pending' ? 'text-congress-blue-700 dark:text-congress-blue-400 font-semibold' : 'text-slate-900 dark:text-white'
                }`}
              >
                {level.role}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-4">
          This batch will be submitted to the configured corporate approval workflow.
        </p>
      </div>
    </div>
  </PayCard>
);
