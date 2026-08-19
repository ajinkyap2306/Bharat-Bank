import React from 'react';
import type { ApprovalHistoryEntry } from '../../../../types/corporateApprovalDetails';

interface ApprovalHistoryProps {
  entries: ApprovalHistoryEntry[];
}

export const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4">
      <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-3">
        Approval History
      </h2>
      <ul className="space-y-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex justify-between gap-3 py-2 border-b border-[#E4E7EC]/80 dark:border-slate-800 last:border-0"
          >
            <div>
              <p className="text-[13px] font-medium text-[#111827] dark:text-white">{entry.role}</p>
              <p className="text-[12px] text-[#667085]">{entry.userName}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-medium text-[#111827] dark:text-white">{entry.action}</p>
              <p className="text-[12px] text-[#667085]">{entry.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
