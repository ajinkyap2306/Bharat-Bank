import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import type { CorporateAccount, CorporateAccountCategory } from '../../../../types/corporateAccounts';
import { formatCorpCurrency } from '../../home/shared/CorporateHomeUI';

interface AccountCardProps {
  account: CorporateAccount;
  isPrimary: boolean;
  showBalances: boolean;
  onClick: () => void;
  compact?: boolean;
}

const GRADIENT: Record<CorporateAccountCategory | 'default', string> = {
  operating: 'bg-linear-to-br from-congress-blue-800 to-indigo-700',
  payroll: 'bg-linear-to-br from-emerald-600 to-teal-700',
  collections: 'bg-linear-to-br from-violet-600 to-purple-700',
  savings: 'bg-linear-to-br from-amber-500 to-orange-600',
  loan: 'bg-linear-to-br from-slate-600 to-slate-800',
  all: 'bg-linear-to-br from-congress-blue-800 to-indigo-700',
  default: 'bg-linear-to-br from-congress-blue-800 to-indigo-700',
};

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isPrimary,
  showBalances,
  onClick,
  compact = false,
}) => {
  const balanceText = showBalances
    ? formatCorpCurrency(account.availableBalance)
    : '₹••••••';

  const gradient = GRADIENT[account.category] ?? GRADIENT.default;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`text-left rounded-2xl text-white shadow-md shrink-0 snap-center ${gradient} ${
        compact
          ? 'min-w-[calc(100vw-3rem)] max-w-[19rem] p-3.5'
          : 'w-full mx-4 p-3.5'
      }`}
      aria-label={`${account.accountType}, ${account.maskedNumber}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0 flex items-center gap-1.5">
          <p className="text-[13px] font-bold truncate">{account.accountType}</p>
          {isPrimary && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/25 shrink-0">
              ★ Primary
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 shrink-0">
          <CheckCircle2 className="w-2.5 h-2.5" aria-hidden />
          {account.displayStatus}
        </span>
      </div>

      <p className="text-xl font-extrabold tabular-nums tracking-tight leading-none">{balanceText}</p>
      <p className="text-[10px] text-white/80 mt-0.5">Available</p>

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20 text-[11px] text-white/85">
        <span className="font-mono truncate">{account.maskedNumber}</span>
        {account.companyName && !compact && (
          <span className="truncate ml-2 max-w-[45%] text-right text-[10px]">{account.companyName}</span>
        )}
      </div>
    </motion.button>
  );
};
