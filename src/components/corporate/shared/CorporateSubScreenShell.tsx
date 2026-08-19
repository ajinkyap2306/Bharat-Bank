import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface CorporateSubScreenShellProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  children: React.ReactNode;
}

export const CorporateSubScreenShell: React.FC<CorporateSubScreenShellProps> = ({
  title,
  subtitle,
  backTo = '/corporate/more',
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 font-['Inter',sans-serif]">
      <header className="sticky top-0 z-10 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-[#E4E7EC] dark:border-slate-800 px-4 py-3 safe-top flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="flex items-center gap-1 text-sm font-semibold text-[#0B5CAB] min-h-11"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-[#111827] dark:text-white truncate">{title}</h1>
          {subtitle && <p className="text-[12px] text-[#667085] truncate">{subtitle}</p>}
        </div>
      </header>
      {children}
    </div>
  );
};
