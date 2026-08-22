import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { ApprovalLevel, CorporateUserRef } from '../../../../types/corporateTransactionDetails';

interface ApprovalInformationProps {
  approvedBy?: CorporateUserRef;
  approvalLevels?: ApprovalLevel[];
  pendingApproval?: { currentLevel: number; requiredLevel: number; message: string };
}

export const ApprovalInformation: React.FC<ApprovalInformationProps> = ({
  approvedBy,
  approvalLevels,
  pendingApproval,
}) => {
  if (!approvedBy && !approvalLevels?.length) return null;

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4" aria-label="Approval Information">
      {approvedBy && !approvalLevels?.length && (
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">Approved By</h2>
          <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{approvedBy.name}</p>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Role: {approvedBy.role}</p>
          {approvedBy.date && (
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
              {approvedBy.date}
              {approvedBy.time ? ` • ${approvedBy.time}` : ''}
            </p>
          )}
        </div>
      )}

      {approvalLevels && approvalLevels.length > 0 && (
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
            Approval Workflow
          </h2>
          <div className="space-y-3">
            {approvalLevels.map((level) => (
              <div
                key={level.level}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50"
              >
                <div className="mt-0.5">
                  {level.status === 'Approved' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  )}
                  {level.status === 'Pending' && (
                    <Clock className="w-4 h-4 text-[#F59E0B]" aria-hidden />
                  )}
                  {level.status === 'Rejected' && (
                    <XCircle className="w-4 h-4 text-[#DC2626]" aria-hidden />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">
                    Approval {level.level}
                  </p>
                  <p className="text-[14px] font-medium text-slate-900 dark:text-white">{level.name}</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">{level.role}</p>
                  <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mt-1">{level.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingApproval && (
        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {pendingApproval.currentLevel} of {pendingApproval.requiredLevel} approvals completed.{' '}
          {pendingApproval.message}
        </p>
      )}
    </section>
  );
};
