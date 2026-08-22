import React from 'react';
import type { LimitUtilizationItem } from '../../../../types/corporateAccountLimits';
import { AccessibleProgressBar, LimitsCard } from './LimitsUI';

interface LimitUtilizationProps {
  items: LimitUtilizationItem[];
}

export const LimitUtilization: React.FC<LimitUtilizationProps> = ({ items }) => (
  <LimitsCard ariaLabel="Limit utilization">
    <div className="p-4">
      <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-4">
        Limit Utilization
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <AccessibleProgressBar
            key={item.id}
            label={item.label}
            percent={item.percent}
            statusLabel={`${item.label} limit, ${item.percent} percent used`}
            variant={
              item.percent >= 80 ? 'warning' : item.percent >= 100 ? 'error' : 'primary'
            }
          />
        ))}
      </div>
    </div>
  </LimitsCard>
);
