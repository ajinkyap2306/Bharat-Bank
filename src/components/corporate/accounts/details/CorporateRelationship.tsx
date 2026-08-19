import React from 'react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';

interface CorporateRelationshipProps {
  account: CorporateAccount;
  relationship: string;
}

export const CorporateRelationship: React.FC<CorporateRelationshipProps> = ({
  account,
  relationship,
}) => (
  <section className="px-4" aria-label="Corporate Relationship">
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-3">
      Corporate Relationship
    </h2>
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] text-[#667085]">Company</span>
        <span className="text-[13px] font-medium text-[#111827] dark:text-white text-right">
          {account.companyName}
        </span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] text-[#667085]">Relationship</span>
        <span className="text-[13px] font-medium text-[#111827] dark:text-white text-right">
          {relationship}
        </span>
      </div>
      {account.relationshipManager && (
        <div className="flex items-start justify-between gap-3">
          <span className="text-[13px] text-[#667085]">Relationship Manager</span>
          <span className="text-[13px] font-medium text-[#111827] dark:text-white text-right">
            {account.relationshipManager}
          </span>
        </div>
      )}
    </div>
  </section>
);
