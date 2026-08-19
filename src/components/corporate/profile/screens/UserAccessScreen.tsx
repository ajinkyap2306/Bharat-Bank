import React from 'react';
import { CORPORATE_PROFILE_DATA } from '../../../../data/corporateProfileMock';
import { formatProfileCurrency, ProfileCard, StatusBadge } from '../shared/ProfileUI';

export const UserAccessScreen: React.FC = () => {
  const { accessUsers } = CORPORATE_PROFILE_DATA;

  return (
    <div className="py-4 space-y-3 px-4">
      {accessUsers.map((u) => (
        <ProfileCard key={u.id} className="mx-0! p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[#111827] dark:text-white">{u.name}</p>
              <p className="text-[13px] text-[#667085] mt-0.5">{u.role}</p>
              <p className="text-[12px] text-[#667085] mt-2">Last login: {u.lastLogin}</p>
              {u.approvalAuthority !== undefined && (
                <p className="text-[12px] font-semibold text-[#0B5CAB] mt-1 tabular-nums">
                  Approval authority: {formatProfileCurrency(u.approvalAuthority)}
                </p>
              )}
            </div>
            <StatusBadge active={u.status === 'Active'} />
          </div>
        </ProfileCard>
      ))}
      <p className="text-[11px] text-[#667085] text-center">
        User access is managed by your corporate administrator.
      </p>
    </div>
  );
};
