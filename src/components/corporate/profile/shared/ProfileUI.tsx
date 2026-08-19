import React from 'react';
import { ChevronRight } from 'lucide-react';

export const formatProfileCurrency = (n: number): string =>
  `₹${n.toLocaleString('en-IN')}`;

export const ProfileCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const ProfileSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section>
    <h2 className="text-[13px] font-semibold text-[#667085] uppercase tracking-wide px-4 mb-2">
      {title}
    </h2>
    <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800 overflow-hidden">
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
    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left min-h-[3rem] active:bg-[#F7F9FC] dark:active:bg-slate-800/50"
  >
    <span className="text-[14px] font-medium text-[#111827] dark:text-white">{label}</span>
    <div className="flex items-center gap-2 shrink-0">
      {badge && (
        <span className="text-[11px] font-semibold text-[#667085]">{badge}</span>
      )}
      <ChevronRight className="w-4 h-4 text-[#667085]" aria-hidden />
    </div>
  </button>
);

export const ProfileDetailRow: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div className="px-4 py-3 flex items-start justify-between gap-4">
    <span className="text-[13px] text-[#667085] shrink-0">{label}</span>
    <span
      className={`text-[13px] font-medium text-[#111827] dark:text-white text-right ${
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
      active ? 'text-[#16A34A]' : 'text-[#667085]'
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#16A34A]' : 'bg-[#D0D5DD]'}`} />
    {label ?? (active ? 'Active' : 'Inactive')}
  </span>
);
