import React from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';

export const ProfileScreenHeader: React.FC<{
  title: string;
  onBack: () => void;
  onMore?: () => void;
}> = ({ title, onBack, onMore }) => (
  <header className="sticky top-0 z-10 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 px-4 py-3 safe-top flex items-center gap-3">
    <button
      type="button"
      onClick={onBack}
      className="w-11 h-11 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0"
      aria-label="Back"
    >
      <ArrowLeft className="w-5 h-5 text-[#111827] dark:text-white" />
    </button>
    <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white flex-1 truncate">
      {title}
    </h1>
    {onMore && (
      <button
        type="button"
        onClick={onMore}
        className="w-11 h-11 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0"
        aria-label="More options"
      >
        <MoreHorizontal className="w-5 h-5 text-[#667085]" />
      </button>
    )}
  </header>
);
