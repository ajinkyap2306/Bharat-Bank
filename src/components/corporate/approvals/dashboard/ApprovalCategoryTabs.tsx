import React from 'react';
import type { ApprovalCategoryTab } from '../../../../types/corporateApprovalsDashboard';

interface ApprovalCategoryTabsProps {
  active: ApprovalCategoryTab;
  counts: Record<ApprovalCategoryTab, number>;
  onChange: (tab: ApprovalCategoryTab) => void;
}

const TABS: { id: ApprovalCategoryTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'payments', label: 'Payments' },
  { id: 'beneficiaries', label: 'Beneficiaries' },
  { id: 'payroll', label: 'Payroll' },
  { id: 'bulk_payments', label: 'Bulk' },
  { id: 'users', label: 'Users' },
];

export const ApprovalCategoryTabs: React.FC<ApprovalCategoryTabsProps> = ({
  active,
  counts,
  onChange,
}) => (
  <div className="px-4 overflow-x-auto no-scrollbar" role="tablist" aria-label="Approval categories">
    <div className="flex gap-2 min-w-max pb-0.5">
      {TABS.map((tab) => {
        const count = counts[tab.id];
        if (tab.id !== 'all' && count === 0) return null;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap min-h-9 border transition-colors ${
              isActive
                ? 'bg-[#0B5CAB] text-white border-[#0B5CAB] shadow-sm shadow-[#0B5CAB]/20'
                : 'bg-white dark:bg-slate-900 text-[#667085] border-slate-200/90 dark:border-slate-800'
            }`}
          >
            {tab.label}
            {count > 0 && tab.id !== 'all' && (
              <span
                className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#0B5CAB]/10 text-[#0B5CAB]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);
