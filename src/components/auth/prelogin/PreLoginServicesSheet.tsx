import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '../../common/BottomSheet';
import { PRE_LOGIN_MENU_ITEMS } from './preLoginMenuConfig';

interface PreLoginServicesSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreLoginServicesSheet: React.FC<PreLoginServicesSheetProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Help & Services" subtitle="Before you sign in">
      <div className="px-4 pb-6 grid grid-cols-4 gap-2">
        {PRE_LOGIN_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onClose();
                navigate(item.path);
              }}
              aria-label={item.label}
              className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:scale-95 transition-transform min-h-[72px]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 text-center leading-tight line-clamp-2">
                {item.gridLabel}
              </span>
              {'subtitle' in item && item.subtitle && (
                <span className="text-[8px] text-slate-400 text-center leading-none line-clamp-1 w-full">
                  {item.subtitle}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-2 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/prelogin/terms');
          }}
          className="text-[11px] font-semibold text-blue-600"
        >
          Terms & Conditions
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/prelogin/privacy');
          }}
          className="text-[11px] font-semibold text-blue-600"
        >
          Privacy Policy
        </button>
      </div>
    </BottomSheet>
  );
};
