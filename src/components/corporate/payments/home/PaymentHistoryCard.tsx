import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PayHomeCard } from './PaymentsHomeUI';

interface PaymentHistoryCardProps {
  onViewHistory: () => void;
}

export const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({ onViewHistory }) => (
  <section className="px-4" aria-label="Payment history">
    <PayHomeCard>
      <button
        type="button"
        onClick={onViewHistory}
        className="w-full p-4 text-left min-h-18 active:bg-slate-50 dark:active:bg-slate-800/40 rounded-2xl"
      >
        <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
          Payment History
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
          View completed, pending and failed payments.
        </p>
        <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400">
          View History
          <ChevronRight className="w-4 h-4" aria-hidden />
        </span>
      </button>
    </PayHomeCard>
  </section>
);
