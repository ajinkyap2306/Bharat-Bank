import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeftRight, Building2, FileCheck2, SendHorizontal, type LucideIcon } from 'lucide-react';
import { CORP_QUICK_ACTION_ICON, CORP_ACCENT_BADGE } from './shared/CorporateHomeUI';

interface QuickAction {
  id: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: number;
  onClick: () => void;
}

interface QuickActionsProps {
  approvalCount: number;
  showApprove: boolean;
  showMakePayment?: boolean;
  showTransfer?: boolean;
  onMakePayment: () => void;
  onApprove: () => void;
  onTransfer: () => void;
  onBeneficiaries: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  approvalCount,
  showApprove,
  showMakePayment = true,
  showTransfer = true,
  onMakePayment,
  onApprove,
  onTransfer,
  onBeneficiaries,
}) => {
  const allActions: QuickAction[] = [
    {
      id: 'pay',
      label: 'Make Payment',
      subtitle: 'Vendor / Bank',
      icon: SendHorizontal,
      onClick: onMakePayment,
    },
    {
      id: 'approve',
      label: 'Approve',
      subtitle: 'Maker–Checker',
      icon: FileCheck2,
      badge: approvalCount > 0 ? approvalCount : undefined,
      onClick: onApprove,
    },
    {
      id: 'transfer',
      label: 'Transfer',
      subtitle: 'Between Accounts',
      icon: ArrowLeftRight,
      onClick: onTransfer,
    },
    {
      id: 'beneficiary',
      label: 'Beneficiaries',
      subtitle: 'Manage Payees',
      icon: Building2,
      onClick: onBeneficiaries,
    },
  ];

  const actions = allActions.filter((action) => {
    if (action.id === 'approve' && !showApprove) return false;
    if (action.id === 'pay' && !showMakePayment) return false;
    if (action.id === 'transfer' && !showTransfer) return false;
    return true;
  });

  const gridCols =
    actions.length <= 2 ? 'grid-cols-2' : actions.length === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <section aria-label="Quick Actions">
      <div className="flex items-center gap-2 px-4 mb-3">
        <h3 className="text-sm font-extrabold text-[#111827] dark:text-white tracking-tight">
          Quick Actions
        </h3>
        <span className={CORP_ACCENT_BADGE}>
          Enterprise
        </span>
      </div>

      <div className={`grid ${gridCols} gap-1 sm:gap-2 px-3`}>
        {actions.map(({ id, label, subtitle, icon: Icon, badge, onClick }) => (
          <motion.button
            key={id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={onClick}
            className="relative flex flex-col items-center justify-center p-1.5 sm:p-2 text-center group cursor-pointer"
          >
            {badge !== undefined && (
              <span className="absolute top-0 right-1 sm:right-2 min-w-5 h-5 px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center z-10">
                {badge}
              </span>
            )}
            <div className={CORP_QUICK_ACTION_ICON}>
              <Icon className="w-6 h-6" aria-hidden />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-congress-blue-700 dark:group-hover:text-congress-blue-400 transition-colors whitespace-nowrap">
              {label}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block whitespace-nowrap mt-0.5">
              {subtitle}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
