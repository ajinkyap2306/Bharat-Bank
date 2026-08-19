import React from 'react';
import { CORPORATE_PROFILE_DATA } from '../../../../data/corporateProfileMock';
import { ProfileCard, ProfileDetailRow } from '../shared/ProfileUI';

export const CompanyInformationScreen: React.FC = () => {
  const { company } = CORPORATE_PROFILE_DATA;

  return (
    <div className="py-4">
      <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        <ProfileDetailRow label="Legal Name" value={company.legalName} />
        <ProfileDetailRow label="Business Type" value={company.businessType} />
        <ProfileDetailRow label="Registered Address" value={company.registeredAddress} />
        <ProfileDetailRow label="Business Registration" value={company.businessRegistration} mono />
        <ProfileDetailRow label="GSTIN" value={company.gstin} mono />
        <ProfileDetailRow label="PAN / Tax ID" value={company.pan} mono />
        <ProfileDetailRow label="Corporate ID" value={company.corporateId} mono />
        <ProfileDetailRow label="Contact Email" value={company.contactEmail} />
        <ProfileDetailRow label="Contact Phone" value={company.contactPhone} />
        <ProfileDetailRow label="Relationship Manager" value={company.relationshipManager} />
      </ProfileCard>
      <p className="text-[11px] text-[#667085] px-4 mt-3 text-center">
        Company information is managed by your corporate administrator.
      </p>
    </div>
  );
};
