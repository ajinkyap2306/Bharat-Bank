import React from 'react';
import { ChevronRight } from 'lucide-react';

export const formatProfileCurrency = (n: number): string =>
  `₹${n.toLocaleString('en-IN')}`;

export const ProfileCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const ProfileSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section>
    <h2 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 mb-2">
      {title}
    </h2>
    <ProfileCard className="divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800 overflow-hidden">
      {children}
    </ProfileCard>
  </section>
);

export const ProfileMenuRow: React.FC<{
  label: string;
  onClick: () => void;
  badge?: string;
}> = ({ label, onClick, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left min-h-[3rem] active:bg-slate-50 dark:active:bg-slate-800/50 dark:active:bg-slate-800/50"
  >
    <span className="text-[14px] font-medium text-slate-900 dark:text-white">{label}</span>
    <div className="flex items-center gap-2 shrink-0">
      {badge && (
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{badge}</span>
      )}
      <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden />
    </div>
  </button>
);

export const ProfileDetailRow: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div className="px-4 py-3 flex items-start justify-between gap-4">
    <span className="text-[13px] text-slate-500 dark:text-slate-400 shrink-0">{label}</span>
    <span
      className={`text-[13px] font-medium text-slate-900 dark:text-white text-right ${
        mono ? 'font-mono' : ''
      }`}
    >
      {value}
    </span>
  </div>
);

export const StatusBadge: React.FC<{ active: boolean; label?: string }> = ({
  active,
  label,
}) => (
  <span
    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
      active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'}`} />
    {label ?? (active ? 'Active' : 'Inactive')}
  </span>
);
