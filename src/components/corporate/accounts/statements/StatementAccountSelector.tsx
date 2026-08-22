import React from 'react';
import { Check } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { StatementAccountOption } from '../../../../types/corporateAccountStatements';

interface StatementAccountSelectorProps {
  isOpen: boolean;
  accounts: StatementAccountOption[];
  selectedId: string;
  onClose: () => void;
  onSelect: (accountId: string) => void;
}

export const StatementAccountSelector: React.FC<StatementAccountSelectorProps> = ({
  isOpen,
  accounts,
  selectedId,
  onClose,
  onSelect,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Select Account">
    <div className="divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800">
      {accounts.map((account) => (
        <button
          key={account.id}
          type="button"
          onClick={() => {
            onSelect(account.id);
            onClose();
          }}
          className="w-full flex items-center justify-between gap-3 py-4 text-left min-h-13"
        >
          <div>
            <p className="text-[15px] font-medium text-slate-900 dark:text-white">{account.label}</p>
            <p className="text-[13px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{account.maskedNumber}</p>
          </div>
          {selectedId === account.id && (
            <Check className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
          )}
        </button>
      ))}
    </div>
  </BottomSheet>
);
