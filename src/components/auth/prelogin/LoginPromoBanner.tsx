import React from 'react';
import { ChevronRight, Gift } from 'lucide-react';
import { PROMOTIONAL_OFFERS } from '../../../data/preLoginMock';

interface LoginPromoBannerProps {
  onExplore: () => void;
}

export const LoginPromoBanner: React.FC<LoginPromoBannerProps> = ({ onExplore }) => {
  const offer = PROMOTIONAL_OFFERS[0];

  return (
    <button
      type="button"
      onClick={onExplore}
      className="w-full mt-4 text-left rounded-2xl overflow-hidden border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-900 shadow-sm active:scale-[0.99] transition-transform"
      aria-label={`${offer.title}. ${offer.description}`}
    >
      <div className="flex items-stretch min-h-[72px]">
        <div className="w-14 shrink-0 bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
          <Gift className="w-5 h-5" aria-hidden />
        </div>
        <div className="flex-1 px-3 py-2.5 bg-linear-to-r from-blue-50/90 to-indigo-50/80 dark:from-slate-900 dark:to-slate-900 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {offer.badge && (
                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  {offer.badge}
                </span>
              )}
              <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">
                Valid till {offer.validTill}
              </span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              {offer.title}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2 mt-0.5">
              {offer.description}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden />
        </div>
      </div>
    </button>
  );
};
