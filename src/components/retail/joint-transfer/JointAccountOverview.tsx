import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, ChevronRight, Users } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import {
  getOperatingInstructionLabel,
  getRetailJointUser,
} from '../../../data/retailJointTransferMock';
import { AddMoneyLayout, StickyAddMoneyCTA } from '../add-money/shared/AddMoneyUI';

interface JointAccountOverviewProps {
  accountId: string;
}

export const JointAccountOverview: React.FC<JointAccountOverviewProps> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts, user } = useBanking();
  const account = accounts.find((a) => a.id === accountId);

  if (!account?.isJointAccount) {
    return (
      <AddMoneyLayout title="Joint Account" onBack={() => navigate('/retail/accounts')}>
        <p className="text-sm text-slate-500">Account not found.</p>
      </AddMoneyLayout>
    );
  }

  const primaryUser = account.primaryHolderUserId
    ? getRetailJointUser(account.primaryHolderUserId)
    : null;
  const jointUser = account.jointHolderUserIds?.[0]
    ? getRetailJointUser(account.jointHolderUserIds[0])
    : null;

  const holderCards = [
    {
      name: primaryUser?.name ?? user.name,
      role: 'Primary Holder',
    },
    {
      name: jointUser?.name ?? account.jointHolders?.[0]?.name ?? 'Joint Holder',
      role: 'Joint Holder',
    },
  ];

  return (
    <AddMoneyLayout title="Joint Account" onBack={() => navigate('/retail/accounts')}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {account.jointAccountLabel ?? 'Joint Savings Account'}
        </p>
        <p className="text-sm font-mono text-slate-500 mt-1">{account.maskedNumber}</p>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-4">
          Available Balance
        </p>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
          ₹{account.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-[#005DD4]" />
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Account Holders
          </p>
        </div>
        <div className="space-y-3">
          {holderCards.map((holder) => (
            <div
              key={holder.role}
              className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{holder.name}</p>
                <p className="text-xs text-slate-500">{holder.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Operating Instruction:{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {getOperatingInstructionLabel(account.operatingInstruction)}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate(`/retail/accounts/${accountId}`)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        >
          <span className="text-sm font-bold text-slate-900 dark:text-white">Account Details</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => navigate(`/retail/joint-transfer/${accountId}`)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#005DD4] text-white"
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-sm font-bold">Fund Transfer</span>
        </button>
      </div>

      <StickyAddMoneyCTA
        label="Fund Transfer"
        onClick={() => navigate(`/retail/joint-transfer/${accountId}`)}
      />
    </AddMoneyLayout>
  );
};
