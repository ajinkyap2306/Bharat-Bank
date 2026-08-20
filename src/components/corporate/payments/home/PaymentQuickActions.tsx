import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeftRight, CalendarClock, Layers, Smartphone, UserPlus, Wallet } from 'lucide-react';

const QUICK_ICON =
  'w-11 h-11 rounded-2xl bg-linear-to-tr from-[#0B5CAB] to-indigo-700 text-white flex items-center justify-center shadow-md shadow-[#0B5CAB]/20 mb-1.5 group-hover:scale-105 transition-transform';

interface PaymentQuickActionsProps {
  onTransfer: () => void;
  onScheduled: () => void;
  onBulk: () => void;
  onBeneficiary: () => void;
  onPayroll: () => void;
  onMobilePay: () => void;
  canCreatePayment?: boolean;
}

const ACTIONS = [
  { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight, handler: 'onTransfer' as const, requiresCreate: true },
  { id: 'mobile', label: 'Mobile Pay', icon: Smartphone, handler: 'onMobilePay' as const, requiresCreate: true },
  { id: 'scheduled', label: 'Scheduled', icon: CalendarClock, handler: 'onScheduled' as const, requiresCreate: false },
  { id: 'bulk', label: 'Bulk Pay', icon: Layers, handler: 'onBulk' as const, requiresCreate: true },
  { id: 'payroll', label: 'Payroll', icon: Wallet, handler: 'onPayroll' as const, requiresCreate: true },
  { id: 'beneficiary', label: 'Beneficiary', icon: UserPlus, handler: 'onBeneficiary' as const, requiresCreate: false },
];

export const PaymentQuickActions: React.FC<PaymentQuickActionsProps> = ({
  canCreatePayment = true,
  ...props
}) => {
  const visible = ACTIONS.filter((action) => canCreatePayment || !action.requiresCreate);

  return (
    <section className="px-3" aria-label="Quick payment actions">
      <div className={`grid gap-1 ${visible.length <= 3 ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-6'}`}>
        {visible.map(({ id, label, icon: Icon, handler }) => (
          <motion.button
            key={id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={props[handler]}
            className="flex flex-col items-center p-1.5 text-center group"
          >
            <div className={QUICK_ICON}>
              <Icon className="w-5 h-5" aria-hidden />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};
