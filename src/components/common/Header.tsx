import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  ShieldCheck, 
  User, 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { NotificationsModal } from './NotificationsModal';

export const Header: React.FC = () => {
  const { 
    user, 
    bankingType, 
    quickDemoLogin, 
    isDarkMode, 
    toggleDarkMode, 
    notifications,
    openScanner 
  } = useBanking();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 w-full safe-top bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          {/* User / Profile Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-600/30 dark:ring-blue-500/30 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-1.5 h-1.5 text-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {bankingType === 'retail' ? 'Welcome back' : 'Enterprise Portal'}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {bankingType === 'retail' ? 'Retail' : 'Corporate'}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {bankingType === 'retail' ? user.name : user.companyName}
              </h2>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {bankingType === 'corporate' && (
              <button
                onClick={() => quickDemoLogin('retail')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700/80"
                title="Switch to Retail banking"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">To Retail</span>
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700/80"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700/80"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationsModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
