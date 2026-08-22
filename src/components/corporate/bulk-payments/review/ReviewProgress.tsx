import React from 'react';

const STEPS = ['Batch', 'Payments', 'Validate', 'Review', 'Approval'];

export const ReviewProgress: React.FC = () => (
  <nav className="mx-4 flex items-center justify-between gap-1" aria-label="Bulk payment progress">
    {STEPS.map((step, index) => {
      const isCurrent = step === 'Review';
      const isPast = index < 3;
      return (
        <div key={step} className="flex-1 flex flex-col items-center min-w-0">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isCurrent
                ? 'bg-congress-blue-700 text-white ring-4 ring-congress-blue-500/20'
                : isPast
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {index + 1}
          </span>
          <span
            className={`text-[9px] mt-1 font-medium truncate w-full text-center ${
              isCurrent ? 'text-congress-blue-700 dark:text-congress-blue-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {step}
          </span>
        </div>
      );
    })}
  </nav>
);
