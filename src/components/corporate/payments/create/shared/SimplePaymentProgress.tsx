import React from 'react';

const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Review' },
  { id: 3, label: 'Approval' },
];

interface SimplePaymentProgressProps {
  currentStep?: number;
}

export const SimplePaymentProgress: React.FC<SimplePaymentProgressProps> = ({ currentStep = 1 }) => (
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
                  ? 'bg-[#0B5CAB] text-white'
                  : isComplete
                    ? 'bg-[#16A34A]/15 text-[#16A34A]'
                    : 'bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 text-[#667085]'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {step.id}
            </div>
            <span
              className={`text-[10px] mt-1 truncate w-full text-center ${
                isActive ? 'text-[#0B5CAB] font-semibold' : 'text-[#667085]'
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
    <div className="mt-2 h-1 rounded-full bg-[#E4E7EC] dark:bg-slate-800 overflow-hidden">
      <div
        className="h-full bg-[#0B5CAB] rounded-full transition-all duration-300 motion-reduce:transition-none"
        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        aria-hidden
      />
    </div>
  </nav>
);
