import React from 'react';
import { HelpCircle, ShieldCheck } from 'lucide-react';
import { BharatBankLogo } from '../../../common/BharatBankLogo';

interface CorporateLoginHeaderProps {
  onHelpClick: () => void;
}

export const CorporateLoginHeader: React.FC<CorporateLoginHeaderProps> = ({
  onHelpClick,
}) => (
  <header className="px-4 pt-3 pb-2 safe-top">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <BharatBankLogo variant="compact" size="sm" />
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-slate-900 dark:text-white leading-tight tracking-tight">
            Corporate Banking
          </h1>
          <div className="flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-[#16A34A] shrink-0" aria-hidden />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug truncate">
              Secure business banking access
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onHelpClick}
        className="w-11 h-11 shrink-0 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        aria-label="Help"
      >
        <HelpCircle className="w-4.5 h-4.5 text-slate-500" />
      </button>
    </div>
  </header>
);
