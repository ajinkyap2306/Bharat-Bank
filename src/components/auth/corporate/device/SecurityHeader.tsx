import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface SecurityHeaderProps {
  title: string;
  onBack: () => void;
}

export const SecurityHeader: React.FC<SecurityHeaderProps> = ({ title, onBack }) => (
  <header className="px-4 pt-3 pb-2 safe-top">
    <div className="flex items-center gap-2 min-h-11">
      <button
        type="button"
        onClick={onBack}
        className="w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-[#111827] dark:text-white active:scale-95 transition-transform motion-reduce:transition-none"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h1 className="text-[15px] font-semibold text-[#111827] dark:text-white tracking-tight">
        {title}
      </h1>
    </div>
  </header>
);
