import React from 'react';
import type { VendorBeneficiaryStatus } from '../../../../../types/corporateVendorBeneficiarySelection';

interface BeneficiaryStatusBadgeProps {
  status: VendorBeneficiaryStatus;
  compact?: boolean;
}

const STATUS_CONFIG: Record<
  VendorBeneficiaryStatus,
  { label: string; className: string }
> = {
  verified: {
    label: 'Verified',
    className: 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400',
  },
  'pending-verification': {
    label: 'Verification Pending',
    className: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  },
  'pending-approval': {
    label: 'Pending Approval',
    className: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  },
  blocked: {
    label: 'Blocked',
    className: 'bg-[#DC2626]/10 text-[#DC2626]',
  },
  inactive: {
    label: 'Beneficiary Inactive',
    className: 'bg-slate-100 text-slate-500 dark:text-slate-400 dark:bg-slate-800',
  },
};

export const BeneficiaryStatusBadge: React.FC<BeneficiaryStatusBadgeProps> = ({
  status,
  compact = false,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${
        compact ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2 py-0.5'
      } ${config.className}`}
    >
      {status === 'verified' && <span aria-hidden>✓</span>}
      {config.label}
    </span>
  );
};
