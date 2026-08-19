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
                ? 'bg-[#0B5CAB] text-white ring-4 ring-[#0B5CAB]/20'
                : isPast
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-[#E4E7EC] dark:bg-slate-700 text-[#667085]'
            }`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {index + 1}
          </span>
          <span
            className={`text-[9px] mt-1 font-medium truncate w-full text-center ${
              isCurrent ? 'text-[#0B5CAB]' : 'text-[#667085]'
            }`}
          >
            {step}
          </span>
        </div>
      );
    })}
  </nav>
);
