import React from 'react';
import { TrendingUp } from 'lucide-react';

interface HighValuePaymentWarningProps {
  visible: boolean;
}

export const HighValuePaymentWarning: React.FC<HighValuePaymentWarningProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <section className="px-4" role="status" aria-labelledby="high-value-warning-title">
      <div className="rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 p-4 flex gap-3">
        <TrendingUp className="w-5 h-5 text-[#F59E0B] shrink-0" aria-hidden />
        <div>
          <h2 id="high-value-warning-title" className="text-[14px] font-semibold text-slate-900 dark:text-white">
            High-value payment
          </h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            Additional approval or verification may be required.
          </p>
        </div>
      </div>
    </section>
  );
};
