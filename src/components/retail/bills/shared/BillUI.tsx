import React from 'react';
import {
  Zap, Wifi, Flame, Smartphone, Tv, Droplet, CreditCard, Car, Shield,
  GraduationCap, Building2, Grid3x3, LucideIcon,
} from 'lucide-react';
import { BillCategory } from '../../../../types/bills';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { motion } from 'motion/react';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Wifi, Flame, Smartphone, Tv, Droplet, CreditCard, Car, Shield,
  GraduationCap, Building2, Grid3x3,
};

export const getBillIcon = (iconName: string, className = 'w-5 h-5') => {
  const Icon = ICON_MAP[iconName] || Zap;
  return <Icon className={className} />;
};

export const getCategoryIcon = (category: BillCategory | 'more', className = 'w-5 h-5') => {
  const map: Record<string, string> = {
    electricity: 'Zap', water: 'Droplet', gas: 'Flame', mobile: 'Smartphone',
    broadband: 'Wifi', dth: 'Tv', fastag: 'Car', insurance: 'Shield',
    credit_card: 'CreditCard', education: 'GraduationCap', municipal: 'Building2', more: 'Grid3x3',
  };
  return getBillIcon(map[category] || 'Zap', className);
};

export const BillLayout: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, onBack, children, rightAction, footer }) => (
  <div className="pb-6">
    <ScreenHeader title={title} subtitle={subtitle} onBack={onBack} rightAction={rightAction} />
    <div className="pt-3">{children}</div>
    {footer}
  </div>
);

export const BillCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children, className = '', onClick,
}) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs ${onClick ? 'active:scale-[0.99] transition-transform text-left w-full' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};

export const StickyBillCTA: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}> = ({ label, onClick, disabled, variant = 'primary' }) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-4 pt-2 bg-linear-to-tr from-slate-50 via-slate-50/95 to-transparent dark:from-slate-950 dark:via-slate-950/95">
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full py-3.5 rounded-2xl font-bold text-sm disabled:opacity-50 ${
        variant === 'danger' ? 'bg-rose-600 text-white' : 'bg-congress-blue-700 text-white'
      }`}
    >
      {label}
    </button>
  </div>
);

export const BillStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    due: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    overdue: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
    paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    completed: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    failed: 'bg-rose-50 text-rose-700',
    no_outstanding: 'bg-slate-100 text-slate-600',
  };
  const labels: Record<string, string> = {
    due: 'Due', overdue: 'Overdue', paid: 'Paid', completed: 'Paid',
    pending: 'Pending', failed: 'Failed', no_outstanding: 'No Outstanding',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${styles[status] || styles.due}`}>
      {labels[status] || status}
    </span>
  );
};

export const ProcessingTimeline: React.FC<{
  steps: { label: string; status: 'done' | 'active' | 'pending' }[];
}> = ({ steps }) => (
  <div className="space-y-0 py-4">
    {steps.map((step, i) => (
      <div key={step.label} className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            step.status === 'done' ? 'bg-emerald-500 text-white' :
            step.status === 'active' ? 'bg-congress-blue-600 text-white animate-pulse' :
            'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            {step.status === 'done' ? '✓' : step.status === 'active' ? '●' : '○'}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-0.5 flex-1 min-h-10 ${step.status === 'done' ? 'bg-emerald-300' : 'bg-slate-200 dark:bg-slate-700'}`} />
          )}
        </div>
        <div className="pb-8">
          <p className={`text-sm font-semibold ${step.status === 'active' ? 'text-congress-blue-700' : 'text-slate-900 dark:text-white'}`}>
            {step.label}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export const FetchingLoader: React.FC<{ stage: number }> = ({ stage }) => {
  const stages = ['Fetching Bill', 'Connecting to Biller', 'Retrieving Bill Details'];
  return (
    <div className="flex flex-col items-center py-16 px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="w-14 h-14 rounded-full border-4 border-congress-blue-200 border-t-congress-blue-700 mb-6"
      />
      <p className="text-base font-bold text-slate-900 dark:text-white">{stages[stage] || stages[0]}</p>
      <div className="flex gap-1.5 mt-4">
        {stages.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i <= stage ? 'w-8 bg-congress-blue-600' : 'w-4 bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );
};

export const AmountInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label?: string;
}> = ({ value, onChange, label = 'Amount to Pay' }) => (
  <BillCard>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
    <div className="flex items-center gap-1 mt-2">
      <span className="text-2xl font-bold text-slate-400">₹</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-3xl font-black bg-transparent outline-none text-slate-900 dark:text-white w-full"
        placeholder="0"
      />
    </div>
  </BillCard>
);
