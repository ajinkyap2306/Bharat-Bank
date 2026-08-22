import React from 'react';

const STEPS = [
  { id: 1, label: 'Beneficiary' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Approval' },
];

interface PaymentProgressProps {
  currentStep?: number;
}

export const PaymentProgress: React.FC<PaymentProgressProps> = ({ currentStep = 2 }) => (
  <nav className="px-4" aria-label="Payment progress">
    <ol className="flex items-center justify-between gap-1">
      {STEPS.map((step) => {
        const isActive = step.id === currentStep;
        const isComplete = step.id < currentStep;

        return (
          <li key={step.id} className="flex-1 flex flex-col items-center min-w-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                isActive
                  ? 'bg-congress-blue-700 text-white'
                  : isComplete
                    ? 'bg-emerald-600/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {step.id}
            </div>
            <span
              className={`text-[10px] mt-1 truncate w-full text-center ${
                isActive ? 'text-congress-blue-700 dark:text-congress-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
    <div className="mt-2 h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-congress-blue-700 rounded-full transition-all duration-300 motion-reduce:transition-none"
        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        aria-hidden
      />
    </div>
  </nav>
);
