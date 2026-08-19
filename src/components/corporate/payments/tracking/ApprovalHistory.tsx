import React from 'react';
import type { PaymentApprovalHistoryEntry } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface ApprovalHistoryProps {
  entries: PaymentApprovalHistoryEntry[];
}

export const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">
        Approval History
      </h3>
      <ul className="space-y-3" aria-label="Approval history">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-start justify-between gap-3 pb-3 border-b border-[#E4E7EC] dark:border-slate-800 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#111827] dark:text-white">{entry.name}</p>
              <p className="text-[12px] text-[#667085]">{entry.role}</p>
            </div>
            <div className="text-right shrink-0">
              <p
                className={`text-[13px] font-semibold ${
                  entry.action === 'Rejected'
                    ? 'text-[#DC2626]'
                    : entry.action === 'Created'
                      ? 'text-[#0B5CAB]'
                      : 'text-[#16A34A]'
                }`}
              >
                {entry.action}
              </p>
              <p className="text-[11px] text-[#667085] mt-0.5">{entry.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </PayCard>
  );
};
