import React from 'react';
import { CORPORATE_PROFILE_DATA } from '../../../../data/corporateProfileMock';
import { ProfileCard } from '../shared/ProfileUI';

export const ApprovalRulesScreen: React.FC = () => {
  const { approvalRules } = CORPORATE_PROFILE_DATA;

  return (
    <div className="py-4">
      <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        {approvalRules.map((rule) => (
          <div key={rule.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
            <span className="text-[14px] font-medium text-[#111827] dark:text-white">
              {rule.category}
            </span>
            <span className="text-[13px] font-semibold text-[#0B5CAB] text-right shrink-0">
              {rule.rule}
            </span>
          </div>
        ))}
      </ProfileCard>
      <p className="text-[11px] text-[#667085] px-4 mt-3 text-center">
        Approval rules are configured by your bank and corporate administrator. View only.
      </p>
    </div>
  );
};
