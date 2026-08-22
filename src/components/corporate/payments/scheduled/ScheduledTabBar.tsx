import React from 'react';
import type { ScheduledPaymentTab } from '../../../../types/corporateScheduledPayments';

const TABS: { id: ScheduledPaymentTab; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'pending_approval', label: 'Pending Approval' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

interface ScheduledTabBarProps {
  active: ScheduledPaymentTab;
  onChange: (tab: ScheduledPaymentTab) => void;
  counts?: Partial<Record<ScheduledPaymentTab, number>>;
}

export const ScheduledTabBar: React.FC<ScheduledTabBarProps> = ({ active, onChange, counts }) => (
  <div
    className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none"
    role="tablist"
    aria-label="Scheduled payment filters"
  >
    {TABS.map((tab) => {
      const isActive = active === tab.id;
      const count = counts?.[tab.id];
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 px-3.5 py-2 rounded-full text-[12px] font-semibold min-h-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 ${
            isActive
              ? 'bg-congress-blue-700 text-white'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {tab.label}
          {count !== undefined && count > 0 && (
            <span className="ml-1 text-[10px] opacity-80">({count})</span>
          )}
        </button>
      );
    })}
  </div>
);
