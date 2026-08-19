import React from 'react';
import { CORPORATE_PROFILE_DATA } from '../../../../data/corporateProfileMock';
import { ProfileCard, StatusBadge } from '../shared/ProfileUI';

export const AuthorizedSignatoriesScreen: React.FC = () => {
  const { signatories } = CORPORATE_PROFILE_DATA;

  return (
    <div className="py-4 space-y-3 px-4">
      {signatories.map((sig) => (
        <ProfileCard key={sig.id} className="mx-0! p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold text-[#111827] dark:text-white">{sig.name}</p>
              <p className="text-[13px] text-[#667085] mt-0.5">{sig.role}</p>
              <p className="text-[12px] text-[#667085] mt-2">{sig.authorizationLevel}</p>
            </div>
            <StatusBadge active={sig.status === 'Active'} />
          </div>
        </ProfileCard>
      ))}
      <p className="text-[11px] text-[#667085] text-center px-2">
        Signatory details are view-only. Changes require administrator approval.
      </p>
    </div>
  );
};
