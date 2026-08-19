import React from 'react';
import { Building2 } from 'lucide-react';
import { AccountsCard } from '../shared/CorporateAccountsUI';

export const AccountsEmptyState: React.FC = () => (
  <AccountsCard className="!mx-4 p-8 text-center border-[#E4E7EC]">
    <div className="w-14 h-14 rounded-2xl bg-[#0B5CAB]/10 flex items-center justify-center mx-auto mb-3">
      <Building2 className="w-7 h-7 text-[#0B5CAB]" aria-hidden />
    </div>
    <p className="text-base font-semibold text-[#111827] dark:text-white">No accounts available</p>
    <p className="text-[13px] text-[#667085] mt-1.5 leading-relaxed">
      There are no corporate accounts available for this profile.
    </p>
  </AccountsCard>
);
