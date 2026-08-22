import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShieldAlert, FileCheck2, ArrowUpRight, Bell } from 'lucide-react';
import { CorporateDashboardNotification } from '../../../types/corporateDashboard';

type NotifTab = 'All' | 'Payments' | 'Approvals' | 'Security';

const tabFilter = (tab: NotifTab, n: CorporateDashboardNotification) => {
  if (tab === 'All') return true;
  if (tab === 'Payments') return n.type === 'payment';
  if (tab === 'Approvals') return n.type === 'approval';
  return n.type === 'security';
};

const NotifIcon: React.FC<{ type: CorporateDashboardNotification['type'] }> = ({ type }) => {
  if (type === 'security') {
    return (
      <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#DC2626] flex items-center justify-center shrink-0">
        <ShieldAlert className="w-4 h-4" />
      </div>
    );
  }
  if (type === 'approval') {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#F59E0B] flex items-center justify-center shrink-0">
        <FileCheck2 className="w-4 h-4" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/60 text-congress-blue-700 dark:text-congress-blue-400 flex items-center justify-center shrink-0">
      <ArrowUpRight className="w-4 h-4" />
    </div>
  );
};

interface CorporateNotificationsScreenProps {
  notifications: CorporateDashboardNotification[];
  onClose: () => void;
}

export const CorporateNotificationsScreen: React.FC<CorporateNotificationsScreenProps> = ({
  notifications,
  onClose,
}) => {
  const [tab, setTab] = useState<NotifTab>('All');
  const [items, setItems] = useState(notifications);

  const filtered = items.filter((n) => tabFilter(tab, n));
  const tabs: NotifTab[] = ['All', 'Payments', 'Approvals', 'Security'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col"
    >
      <div className="px-3 pt-3 pb-2 safe-top border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" />
            <h1 className="text-base font-bold text-slate-900 dark:text-white">Notifications</h1>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                tab === t
                  ? 'bg-congress-blue-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-16">No notifications in this category.</p>
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              className={`w-full text-left rounded-2xl p-3 border transition-colors ${
                n.type === 'security'
                  ? 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              } ${!n.read ? 'ring-1 ring-congress-blue-200 dark:ring-congress-blue-800' : ''}`}
            >
              <div className="flex gap-3">
                <NotifIcon type={n.type} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-congress-blue-700 shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.description}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{n.time}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
};
