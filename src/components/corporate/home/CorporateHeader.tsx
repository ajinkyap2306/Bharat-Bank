import React from 'react';
import { Bell, Building2 } from 'lucide-react';

interface CorporateHeaderProps {
  companyName: string;
  userName: string;
  avatarUrl: string;
  unreadCount: number;
  onProfileClick: () => void;
  onCompanyClick: () => void;
  onNotificationsClick: () => void;
  isLoading?: boolean;
}

export const CorporateHeader: React.FC<CorporateHeaderProps> = ({
  companyName,
  userName,
  avatarUrl,
  unreadCount,
  onProfileClick,
  onCompanyClick,
  onNotificationsClick,
  isLoading,
}) => (
  <header className="px-4 pt-3 pb-3 safe-top">
    {isLoading ? (
      <div className="animate-pulse flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onProfileClick}
          className="flex items-center gap-2.5 min-w-0 text-left rounded-xl -ml-1 pl-1 pr-2 py-1 active:bg-white/80 dark:active:bg-slate-900/80 transition-colors"
          aria-label={`Open profile for ${userName}`}
        >
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-congress-blue-200 dark:ring-congress-blue-700/40 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-50 dark:border-slate-950" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                {userName}
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-congress-blue-50 dark:bg-congress-blue-950/60 text-congress-blue-700 dark:text-congress-blue-400 shrink-0">
                Corporate
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{companyName}</p>
          </div>
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onCompanyClick}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 shadow-xs"
            aria-label={`Switch company, current: ${companyName}`}
          >
            <Building2 className="w-4 h-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onNotificationsClick}
            className="relative w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-xs"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-0.5 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-slate-50 dark:ring-slate-950">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    )}
  </header>
);
