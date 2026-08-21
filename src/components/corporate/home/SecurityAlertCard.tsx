import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { CorporateSecurityAlert } from '../../../types/corporateDashboard';
import { CorpCard } from './shared/CorporateHomeUI';

interface SecurityAlertCardProps {
  alert: CorporateSecurityAlert | null;
  onReview: () => void;
}

export const SecurityAlertCard: React.FC<SecurityAlertCardProps> = ({ alert, onReview }) => {
  if (!alert) return null;

  return (
    <section aria-label="Security alert" className="px-4">
      <CorpCard className="mx-0! p-3.5 border-[#F59E0B]/30 bg-amber-50/50 dark:bg-amber-950/15">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4.5 h-4.5 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111827] dark:text-white">{alert.title}</p>
            <p className="text-[12px] text-[#667085] mt-0.5 leading-relaxed">{alert.message}</p>
            <button
              type="button"
              onClick={onReview}
              className="mt-2 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
            >
              Review Activity
            </button>
          </div>
        </div>
      </CorpCard>
    </section>
  );
};
