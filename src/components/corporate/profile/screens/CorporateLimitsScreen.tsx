import React from 'react';
import { useCorporateProfileView } from '../../../../hooks/useCorporateProfileView';
import { ProfileCard, ProfileDetailRow } from '../shared/ProfileUI';
import { RouteLoadingState } from '../../../common/RouteLoadingState';

export const CorporateLimitsScreen: React.FC = () => {
  const { view } = useCorporateProfileView();

  if (!view) {
    return <RouteLoadingState label="Loading limits…" />;
  }

  return (
    <div className="py-4 space-y-4">
      <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        {view.limits.items.map((item) => (
          <ProfileDetailRow key={item.label} label={item.label} value={item.value} />
        ))}
      </ProfileCard>

      <p className="text-[11px] text-[#667085] px-4 text-center">
        {view.role === 'checker'
          ? 'Approval limits are read-only. Contact your relationship manager to request changes.'
          : 'Transaction limits are read-only. Contact your relationship manager to request changes.'}
      </p>
    </div>
  );
};
