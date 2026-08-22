import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileText,
  Landmark,
  Layers,
  MoreHorizontal,
  PiggyBank,
  Receipt,
  SendHorizontal,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { SERVICE_ICON_BOX } from './shared/CorporateHomeUI';

export interface CorporateServiceItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

const DEMO_SERVICE_IDS = new Set([
  'payments',
  'transfers',
  'beneficiaries',
  'scheduled',
  'bulk',
  'payroll',
  'cards',
  'approvals',
  'statements',
  'transactions',
  'reports',
  'account-services',
]);

interface ServicesGridProps {
  onServiceClick: (serviceId: string) => void;
  onAllServicesClick?: () => void;
  canCreatePayment?: boolean;
}

const SERVICE_DEFINITIONS: Omit<CorporateServiceItem, 'onClick'>[] = [
  { id: 'payments', label: 'Payments', icon: SendHorizontal },
  { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
  { id: 'beneficiaries', label: 'Beneficiaries', icon: Building2 },
  { id: 'scheduled', label: 'Scheduled', icon: CalendarClock },
  { id: 'bulk', label: 'Bulk Payments', icon: Layers },
  { id: 'payroll', label: 'Payroll', icon: Users },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'approvals', label: 'Approvals', icon: ClipboardList },
  { id: 'statements', label: 'Statements', icon: FileText },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'deposits', label: 'Deposits', icon: PiggyBank },
  { id: 'investments', label: 'Investments', icon: TrendingUp },
  { id: 'loans', label: 'Loans', icon: Landmark },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'tax', label: 'Tax & Statutory', icon: Wallet },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'account-services', label: 'Account Services', icon: Building2 },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  onServiceClick,
  onAllServicesClick,
  canCreatePayment = true,
}) => {
  const visibleServices = SERVICE_DEFINITIONS.filter((service) => {
    if (!DEMO_SERVICE_IDS.has(service.id)) return false;
    if (!canCreatePayment && (service.id === 'transfers' || service.id === 'bulk' || service.id === 'payroll')) {
      return false;
    }
    return true;
  });

  return (
  <section aria-label="Corporate services" className="px-4">
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            Corporate Services
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-congress-blue-50 dark:bg-congress-blue-950/60 text-congress-blue-700 dark:text-congress-blue-400 rounded-full">
            {visibleServices.length} Modules
          </span>
        </div>
        {onAllServicesClick && (
          <button
            type="button"
            onClick={onAllServicesClick}
            className="text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400 hover:underline flex items-center gap-0.5"
          >
            All Services <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center pt-1">
        {visibleServices.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onServiceClick(id)}
            className="flex flex-col items-center group"
          >
            <div className={SERVICE_ICON_BOX}>
              <Icon className="w-5 h-5" aria-hidden />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  </section>
  );
};
