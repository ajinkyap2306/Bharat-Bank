import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CorpListCard } from '../../home/shared/CorporateHomeUI';

interface AccountPreferencesCardProps {
  onClick: () => void;
}

export const AccountPreferencesCard: React.FC<AccountPreferencesCardProps> = ({ onClick }) => (
  <section className="px-4" aria-label="Account Services">
    <button type="button" onClick={onClick} className="w-full text-left">
      <CorpListCard className="p-4 flex items-center justify-between gap-3 active:bg-slate-50 dark:active:bg-slate-800/40">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-slate-900 dark:text-white">Account Services</p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
            Primary account, nickname, alerts &amp; more
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
      </CorpListCard>
    </button>
  </section>
);
