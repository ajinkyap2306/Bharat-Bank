import React from 'react';
import { ChevronLeft, CircleHelp } from 'lucide-react';

interface CreatePaymentHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onHelp?: () => void;
}

export const CreatePaymentHeader: React.FC<CreatePaymentHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onHelp,
}) => (
  <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 safe-top">
    <div className="flex items-center gap-2 px-4 py-3 min-h-14">
      <button
        type="button"
        onClick={onBack}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 flex items-center justify-center text-[#111827] dark:text-white active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white leading-tight">
          {title}
        </h1>
        <p className="text-[13px] text-[#667085] mt-0.5">{subtitle}</p>
      </div>

      {onHelp ? (
        <button
          type="button"
          onClick={onHelp}
          className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 flex items-center justify-center text-[#667085] active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
          aria-label="Payment help"
        >
          <CircleHelp className="w-5 h-5" aria-hidden />
        </button>
      ) : (
        <div className="w-11 shrink-0" aria-hidden />
      )}
    </div>
  </header>
);
