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
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">
        Approval History
      </h3>
      <ul className="space-y-3" aria-label="Approval history">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-slate-900 dark:text-white">{entry.name}</p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">{entry.role}</p>
            </div>
            <div className="text-right shrink-0">
              <p
                className={`text-[13px] font-semibold ${
                  entry.action === 'Rejected'
                    ? 'text-[#DC2626]'
                    : entry.action === 'Created'
                      ? 'text-congress-blue-700 dark:text-congress-blue-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {entry.action}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{entry.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </PayCard>
  );
};
