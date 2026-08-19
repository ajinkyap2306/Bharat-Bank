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
    className: 'bg-[#16A34A]/10 text-[#16A34A]',
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
    className: 'bg-slate-100 text-[#667085] dark:bg-slate-800',
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
