import React, { useEffect, useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { BottomSheet } from '../../common/BottomSheet';
import { LOGIN_OFFER } from '../../../data/preLoginMock';

interface LoginOfferSheetProps {
  onExploreOffers: () => void;
}

export const LoginOfferSheet: React.FC<LoginOfferSheetProps> = ({ onExploreOffers }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(LOGIN_OFFER.dismissKey);
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(LOGIN_OFFER.dismissKey, '1');
    setOpen(false);
  };

  const explore = () => {
    dismiss();
    onExploreOffers();
  };

  return (
    <BottomSheet isOpen={open} onClose={dismiss} title={LOGIN_OFFER.title} subtitle={LOGIN_OFFER.subtitle}>
      <div className="space-y-4 pb-2">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg">
            <Gift className="w-8 h-8" />
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed">
          {LOGIN_OFFER.description}
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Popup on login — demo feature
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
