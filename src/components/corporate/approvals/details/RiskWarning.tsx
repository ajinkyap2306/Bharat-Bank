import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ApprovalWarning } from '../../../../types/corporateApprovalDetails';

interface RiskWarningProps {
  warnings: ApprovalWarning[];
}

export const RiskWarning: React.FC<RiskWarningProps> = ({ warnings }) => {
  if (warnings.length === 0) return null;

  return (
    <section className="mx-4 space-y-2" aria-label="Risk warnings">
      {warnings.map((warning) => (
        <div
          key={warning.type}
          className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-4 flex gap-3"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
              {warning.title}
            </p>
            <p className="text-[13px] text-[#667085] mt-1">{warning.message}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
