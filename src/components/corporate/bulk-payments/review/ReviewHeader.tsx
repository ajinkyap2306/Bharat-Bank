import React from 'react';
import { ChevronLeft, HelpCircle } from 'lucide-react';

interface ReviewHeaderProps {
  onBack: () => void;
  onHelp: () => void;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({ onBack, onHelp }) => (
  <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 safe-top">
    <div className="flex items-center gap-2 px-4 py-3 min-h-14 max-w-[430px] mx-auto">
      <button
        type="button"
        onClick={onBack}
        disabled={false}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB]"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden />
      </button>
      <div className="flex-1 text-center min-w-0">
        <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white">Review Batch</h1>
        <p className="text-[12px] text-[#667085]">Verify bulk payment details</p>
      </div>
      <button
        type="button"
        onClick={onHelp}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB]"
        aria-label="Help"
      >
        <HelpCircle className="w-5 h-5" aria-hidden />
      </button>
    </div>
  </header>
);
