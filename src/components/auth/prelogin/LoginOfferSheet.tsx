import React, { useEffect, useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { BottomSheet } from '../../common/BottomSheet';
import { LOGIN_OFFER } from '../../../data/preLoginMock';
import { useBanking } from '../../../context/BankingContext';

interface LoginOfferSheetProps {
  onExploreOffers: () => void;
}

export const LoginOfferSheet: React.FC<LoginOfferSheetProps> = ({ onExploreOffers }) => {
  const { loginPromoPending, clearLoginPromoPending } = useBanking();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(LOGIN_OFFER.dismissKey);
    const shouldShow = loginPromoPending || !dismissed;
    if (!shouldShow) return;

    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [loginPromoPending]);

  const dismiss = () => {
    localStorage.setItem(LOGIN_OFFER.dismissKey, '1');
    clearLoginPromoPending();
    setOpen(false);
  };

  const explore = () => {
    dismiss();
    onExploreOffers();
  };

  return (
    <BottomSheet isOpen={open} onClose={dismiss} title={LOGIN_OFFER.title} subtitle={LOGIN_OFFER.subtitle}>
      <div className="space-y-4 pb-2">
        <div className="rounded-2xl overflow-hidden border border-blue-100 dark:border-blue-900/40">
          <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-white">
            <p className="text-xs font-bold uppercase tracking-wide opacity-90">Limited time offer</p>
            <p className="text-lg font-extrabold mt-0.5">7.75% p.a. on 18-month FD</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-slate-900/80">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{LOGIN_OFFER.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Exclusive for mobile banking users
        </div>
        <button
          type="button"
          onClick={explore}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl"
        >
          {LOGIN_OFFER.cta}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="w-full py-3 text-sm font-semibold text-slate-500"
        >
          Maybe later
        </button>
      </div>
    </BottomSheet>
  );
};
