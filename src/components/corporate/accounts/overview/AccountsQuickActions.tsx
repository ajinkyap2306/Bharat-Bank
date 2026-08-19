import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeftRight, FileText, List, SendHorizontal } from 'lucide-react';

const QUICK_ICON =
  'w-10 h-10 rounded-xl bg-linear-to-tr from-[#0B5CAB] to-indigo-700 text-white flex items-center justify-center shadow-md shadow-[#0B5CAB]/20 mb-1 group-hover:scale-105 transition-transform';

interface AccountsQuickActionsProps {
  onSendMoney: () => void;
  onTransactions: () => void;
  onStatement: () => void;
  onTransfer: () => void;
}

const ACTIONS = [
  { id: 'send', label: 'Send Money', icon: SendHorizontal, handler: 'onSendMoney' as const },
  { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight, handler: 'onTransfer' as const },
  { id: 'statement', label: 'Statement', icon: FileText, handler: 'onStatement' as const },
  { id: 'transactions', label: 'Transactions', icon: List, handler: 'onTransactions' as const },
];

export const AccountsQuickActions: React.FC<AccountsQuickActionsProps> = (props) => (
  <section className="px-3" aria-label="Account quick actions">
    <div className="grid grid-cols-4 gap-0.5">
      {ACTIONS.map(({ id, label, icon: Icon, handler }) => (
        <motion.button
          key={id}
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={props[handler]}
          className="flex flex-col items-center py-1 text-center group"
        >
          <div className={QUICK_ICON}>
            <Icon className="w-4.5 h-4.5" aria-hidden />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight px-0.5">
            {label}
          </span>
        </motion.button>
      ))}
    </div>
  </section>
);
