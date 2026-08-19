import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  ChevronRight,
  Settings,
  Shield,
  UserCircle,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';

interface MoreMenuItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  route?: string;
}

const PRIMARY_ITEMS: MoreMenuItem[] = [
  {
    id: 'beneficiaries',
    label: 'Beneficiaries',
    description: 'Manage business payees',
    icon: Building2,
    route: '/corporate/beneficiaries',
  },
];

const BUSINESS_ITEMS: MoreMenuItem[] = [
  {
    id: 'reports',
    label: 'Reports',
    description: 'Statements and analytics',
    icon: BarChart3,
    route: '/corporate/more/reports',
  },
  {
    id: 'account-services',
    label: 'Account Services',
    description: 'Limits, preferences and services',
    icon: Building2,
    route: '/corporate/accounts',
  },
];

const ACCOUNT_ITEMS: MoreMenuItem[] = [
  {
    id: 'profile',
    label: 'Company Profile',
    description: 'Entity and user information',
    icon: UserCircle,
    route: '/corporate/profile',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Login, devices and access',
    icon: Shield,
    route: '/corporate/profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'App preferences and controls',
    icon: Settings,
    route: '/corporate/profile',
  },
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide px-4 mb-2">
      {title}
    </h2>
    <div className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 divide-y divide-[#E4E7EC] dark:divide-slate-800 shadow-sm">
      {children}
    </div>
  </section>
);

const MoreRow: React.FC<{ item: MoreMenuItem; onClick: () => void }> = ({ item, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3.5 text-left min-h-[3.75rem] active:bg-[#F7F9FC] dark:active:bg-slate-800/50"
  >
    <div className="w-10 h-10 rounded-xl bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
      <item.icon className="w-5 h-5 text-[#0B5CAB]" aria-hidden />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-semibold text-[#111827] dark:text-white">{item.label}</p>
      <p className="text-[12px] text-[#667085] mt-0.5">{item.description}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-[#667085] shrink-0" aria-hidden />
  </button>
);

export const CorporateMoreHome: React.FC = () => {
  const navigate = useNavigate();
  const { setCorporateTab, user } = useBanking();

  const handleItem = (item: MoreMenuItem) => {
    if (!item.route) return;

    if (item.route === '/corporate/beneficiaries') {
      setCorporateTab('more');
    } else if (item.route === '/corporate/accounts') {
      setCorporateTab('accounts');
    } else {
      setCorporateTab('more');
    }
    navigate(item.route);
  };

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-4 font-['Inter',sans-serif]">
      <header className="px-4 pt-3 pb-4">
        <h1 className="text-[20px] font-semibold text-[#111827] dark:text-white">More</h1>
        <p className="text-[13px] text-[#667085] mt-0.5">{user.companyName}</p>
      </header>

      <div className="space-y-5">
        <Section title="Business Services">
          {PRIMARY_ITEMS.map((item) => (
            <MoreRow key={item.id} item={item} onClick={() => handleItem(item)} />
          ))}
        </Section>

        <Section title="Operations">
          {BUSINESS_ITEMS.map((item) => (
            <MoreRow key={item.id} item={item} onClick={() => handleItem(item)} />
          ))}
        </Section>

        <Section title="Company">
          {ACCOUNT_ITEMS.map((item) => (
            <MoreRow key={item.id} item={item} onClick={() => handleItem(item)} />
          ))}
        </Section>
      </div>
    </div>
  );
};
