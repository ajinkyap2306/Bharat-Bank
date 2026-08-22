import React from 'react';
import { Building2 } from 'lucide-react';
import { AccountsCard } from '../shared/CorporateAccountsUI';

export const AccountsEmptyState: React.FC = () => (
  <AccountsCard className="!mx-4 p-8 text-center border-slate-200 dark:border-slate-800">
    <div className="w-14 h-14 rounded-2xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center mx-auto mb-3">
      <Building2 className="w-7 h-7 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
    </div>
    <p className="text-base font-semibold text-slate-900 dark:text-white">No accounts available</p>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
      There are no corporate accounts available for this profile.
    </p>
  </AccountsCard>
);
