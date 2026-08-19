import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import type { CorporateAccountDisplayStatus } from '../../../../types/corporateAccounts';
import { AccountStatusBadge } from '../shared/CorporateAccountsUI';
import { CorpListCard } from '../../home/shared/CorporateHomeUI';

interface AccountStatusSectionProps {
  status: CorporateAccountDisplayStatus;
  isPrimary: boolean;
  canManage: boolean;
  onSetPrimary: () => void;
}

export const AccountStatusSection: React.FC<AccountStatusSectionProps> = ({
  status,
  isPrimary,
  canManage,
  onSetPrimary,
}) => (
  <section className="px-4 space-y-3" aria-label="Account status">
    <CorpListCard className="p-4">
      <p className="text-[14px] font-bold text-[#111827] dark:text-white mb-2">Account Status</p>
      <AccountStatusBadge status={status} />
      {status === 'Restricted' && (
        <p className="text-[13px] text-[#667085] mt-2 leading-relaxed">
          Some transactions may be unavailable. Contact your Relationship Manager.
        </p>
      )}
    </CorpListCard>

    <CorpListCard className="p-4">
      {isPrimary ? (
        <>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden />
            <p className="text-[14px] font-bold text-[#111827] dark:text-white">Primary Account</p>
          </div>
          <p className="text-[13px] text-[#667085] mt-1.5 leading-relaxed">
            Used as the default account for corporate payments.
          </p>
        </>
      ) : canManage ? (
        <button
          type="button"
          onClick={onSetPrimary}
          className="w-full flex items-center justify-between gap-3 text-left min-h-11"
        >
          <div>
            <p className="text-[14px] font-bold text-[#111827] dark:text-white">Set as Primary Account</p>
            <p className="text-[13px] text-[#667085] mt-0.5">
              Use this account for corporate payments
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#667085] shrink-0" />
        </button>
      ) : null}
    </CorpListCard>
  </section>
);
