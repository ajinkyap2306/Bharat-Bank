import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownLeft, FileText, Info, SendHorizontal } from 'lucide-react';
import { CORP_QUICK_ACTION_ICON } from '../../home/shared/CorporateHomeUI';

interface AccountQuickActionsProps {
  onSendMoney: () => void;
  onReceiveMoney: () => void;
  onStatement: () => void;
  onAccountDetails: () => void;
  disabled?: boolean;
}

const ACTIONS = [
  { id: 'send', label: 'Send Money', icon: SendHorizontal, handler: 'onSendMoney' as const },
  { id: 'receive', label: 'Receive Money', icon: ArrowDownLeft, handler: 'onReceiveMoney' as const },
  { id: 'statement', label: 'Statement', icon: FileText, handler: 'onStatement' as const },
  { id: 'details', label: 'Account Details', icon: Info, handler: 'onAccountDetails' as const },
];

export const AccountQuickActions: React.FC<AccountQuickActionsProps> = (props) => (
  <section className="px-3" aria-label="Quick actions">
    <div className="flex items-center gap-2 px-1 mb-3">
      <h3 className="text-sm font-extrabold text-[#111827] dark:text-white tracking-tight">
        Quick Actions
      </h3>
    </div>
    <div className="grid grid-cols-2 gap-3 px-1">
      {ACTIONS.map(({ id, label, icon: Icon, handler }) => (
        <motion.button
          key={id}
          type="button"
          whileTap={{ scale: 0.96 }}
          disabled={props.disabled}
          onClick={props[handler]}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs group disabled:opacity-50 min-h-[88px]"
        >
          <div className={CORP_QUICK_ACTION_ICON}>
            <Icon className="w-5 h-5" aria-hidden />
          </div>
          <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
            {label}
          </span>
        </motion.button>
      ))}
    </div>
  </section>
);
