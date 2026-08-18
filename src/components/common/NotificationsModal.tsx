import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, ArrowDownRight, ShieldCheck, Tag, CheckCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications } = useBanking();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 z-10"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Alerts & Notifications</h3>
                <p className="text-[11px] text-slate-400">Real-time banking notifications</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto no-scrollbar">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  n.read
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60'
                    : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-800/40'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  {n.type === 'transaction' && <ArrowDownRight className="w-4 h-4 text-emerald-500" />}
                  {n.type === 'approval' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                  {n.type === 'offer' && <Tag className="w-4 h-4 text-amber-500" />}
                  {n.type === 'alert' && <Bell className="w-4 h-4 text-rose-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{n.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> All caught up
            </span>
            <button onClick={onClose} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Dismiss All
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
