import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, LogOut } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const SessionTimeoutSheet: React.FC = () => {
  const { isSessionTimeoutModalOpen, extendSession, logout } = useBanking();

  return (
    <AnimatePresence>
      {isSessionTimeoutModalOpen && (
        <div className="fixed inset-0 z-200 flex items-end justify-center p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10"
          >
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-5" />
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your session is about to expire</h2>
              <p className="text-sm text-slate-500 mt-2">
                For your security, you will be logged out due to inactivity.
              </p>
            </div>
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={extendSession}
                className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
              >
                Continue Session
              </button>
              <button
                type="button"
                onClick={logout}
                className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
