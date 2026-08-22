import React from 'react';
import {
  ArrowLeftRight,
  Building2,
  Users,
  Files,
  UserPlus,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import type { ApprovalItemType } from '../../../../types/corporateApprovalsDashboard';

interface ApprovalTypeIconProps {
  type: ApprovalItemType;
  className?: string;
}

const iconMap: Record<ApprovalItemType, React.ReactNode> = {
  payment: <ArrowLeftRight className="w-4 h-4" aria-hidden />,
  beneficiary: <Building2 className="w-4 h-4" aria-hidden />,
  payroll: <Users className="w-4 h-4" aria-hidden />,
  bulk_payment: <Files className="w-4 h-4" aria-hidden />,
  user_access: <UserPlus className="w-4 h-4" aria-hidden />,
  limit_change: <ShieldCheck className="w-4 h-4" aria-hidden />,
  service_request: <FileText className="w-4 h-4" aria-hidden />,
};

export const ApprovalTypeIcon: React.FC<ApprovalTypeIconProps> = ({
  type,
  className = '',
}) => (
  <span
    className={`w-10 h-10 rounded-2xl bg-linear-to-tr from-congress-blue-800 to-indigo-700 text-white flex items-center justify-center shadow-sm shadow-congress-blue-700/20 shrink-0 ${className}`}
    aria-hidden
  >
    {iconMap[type]}
  </span>
);
