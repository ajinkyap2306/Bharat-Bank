import React from 'react';
import {
  ArrowLeftRight,
  Calendar,
  ChevronRight,
  History,
  Layers,
  Store,
} from 'lucide-react';
import { PayHomeCard } from './PaymentsHomeUI';

interface PaymentServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
}

const SERVICES: PaymentServiceItem[] = [
  {
    id: 'vendor',
    title: 'Make Payment',
    description: 'Vendor, tax and statutory payments',
    icon: Store,
    route: '/corporate/payments/create',
  },
  {
    id: 'internal',
    title: 'Transfer',
    description: 'Move funds between company accounts',
    icon: ArrowLeftRight,
    route: '/corporate/payments/create/internal-transfer',
  },
  {
    id: 'scheduled',
    title: 'Scheduled Payments',
    description: 'Upcoming and recurring payments',
    icon: Calendar,
    route: '/corporate/payments/scheduled',
  },
  {
    id: 'bulk',
    title: 'Bulk Payments',
    description: 'Process multiple payments together',
    icon: Layers,
    route: '/corporate/bulk-payments',
  },
  {
    id: 'history',
    title: 'Payment History',
    description: 'View completed and pending payments',
    icon: History,
    route: '/corporate/payments/history',
  },
];

interface PaymentServicesProps {
  onNavigate: (route: string) => void;
}

export const PaymentServices: React.FC<PaymentServicesProps> = ({ onNavigate }) => (
  <section className="px-4" aria-label="Payment services">
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-2">
      Money Movement
    </h2>
    <PayHomeCard className="divide-y divide-[#E4E7EC]/80 dark:divide-slate-800">
      {SERVICES.map((service) => (
        <button
          key={service.id}
          type="button"
          onClick={() => onNavigate(service.route)}
          className="w-full flex items-center gap-3 p-4 text-left min-h-18 active:bg-slate-50 dark:active:bg-slate-800/40"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center shrink-0">
            <service.icon className="w-5 h-5 text-[#0B5CAB]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
              {service.title}
            </p>
            <p className="text-[12px] text-[#667085] mt-0.5">{service.description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#667085] shrink-0" aria-hidden />
        </button>
      ))}
    </PayHomeCard>
  </section>
);
