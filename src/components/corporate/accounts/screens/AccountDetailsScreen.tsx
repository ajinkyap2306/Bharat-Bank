import React, { useState } from 'react';
import { ChevronRight, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import {
  getAccountById,
  getActivityForAccount,
  CORPORATE_CASH_FLOW_ACCOUNTS,
} from '../../../../data/corporateAccountsMock';
import { useBanking } from '../../../../context/BankingContext';
import {
  AccountsCard,
  AccountStatusBadge,
  InfoRow,
  MenuRow,
  formatAccountCurrency,
  canManageAccountSettings,
} from '../shared/CorporateAccountsUI';
import { CorporateCashFlowPeriod } from '../../../../types/corporateDashboard';

interface AccountDetailsScreenProps {
  accountId: string;
  onBack: () => void;
  onNavigate: (screen: string, params?: Record<string, string>) => void;
}

export const AccountDetailsScreen: React.FC<AccountDetailsScreenProps> = ({
  accountId,
  onBack,
  onNavigate,
}) => {
  const { corporateAccounts, primaryCorporateAccountId, user } = useBanking();
  const base = getAccountById(accountId);
  const ctx = corporateAccounts.find((a) => a.id === accountId);
  const account = base ? { ...base, nickname: ctx?.nickname || base.nickname } : null;
  const activity = getActivityForAccount(accountId);
  const [cashFlowPeriod, setCashFlowPeriod] = useState<CorporateCashFlowPeriod>('7D');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const canManage = canManageAccountSettings(user.role);

  if (!account) {
    return (
      <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full">
        <ScreenHeader title="Account Details" onBack={onBack} edgeToEdge={false} />
        <div className="p-6 text-center">
          <p className="text-sm font-bold">Unable to load account information</p>
          <button type="button" onClick={onBack} className="mt-4 px-5 py-2.5 rounded-xl bg-congress-blue-700 text-white text-sm font-bold">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isPrimary = accountId === primaryCorporateAccountId;
  const cashFlow = CORPORATE_CASH_FLOW_ACCOUNTS[cashFlowPeriod];
  const netIn = cashFlow.reduce((s, p) => s + p.inflow, 0);
  const netOut = cashFlow.reduce((s, p) => s + p.outflow, 0);

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader
        title={account.nickname}
        subtitle={account.maskedNumber}
        onBack={onBack}
        edgeToEdge={false}
        rightAction={
          <button type="button" onClick={() => setLastUpdated(new Date())} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        }
      />
      <p className="px-3 text-[10px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
        <RefreshCw className="w-3 h-3" /> Updated just now
      </p>

      <div className="space-y-4">
        <AccountsCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Account Summary</p>
            <div className="flex items-center gap-1.5">
              {isPrimary && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-congress-blue-50 dark:bg-congress-blue-950/40 text-congress-blue-700 dark:text-congress-blue-400">Primary</span>}
              <AccountStatusBadge status={account.displayStatus} />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {formatAccountCurrency(account.availableBalance, account.currency)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Available Balance</p>
          <p className="text-sm font-mono text-slate-900 dark:text-white mt-2">
            Current: {formatAccountCurrency(account.balance, account.currency)}
          </p>
        </AccountsCard>

        <AccountsCard className="p-4">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Account Information</p>
          <InfoRow label="Account name" value={account.nickname} />
          <InfoRow label="Account type" value={account.accountType} />
          <InfoRow label="Account number" value={account.maskedNumber} />
          <InfoRow label="Currency" value={account.currencyCode} />
          <InfoRow label="Branch" value={account.branch} />
          <InfoRow label="Opening date" value={account.openingDate} />
          <InfoRow label="Company" value={account.companyName} />
          <InfoRow label="Account ID" value={account.accountIdentifier} />
          {account.relationshipManager && (
            <InfoRow label="Relationship manager" value={account.relationshipManager} />
          )}
        </AccountsCard>

        <AccountsCard className="p-4">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Account Activity</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Inflow</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />+ {formatAccountCurrency(activity.todayInflow, account.currency)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Outflow</p>
              <p className="text-sm font-bold text-[#DC2626] flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />- {formatAccountCurrency(activity.todayOutflow, account.currency)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Transactions</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{activity.transactionCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-sm font-bold text-[#F59E0B]">{activity.pendingCount}</p>
            </div>
          </div>
        </AccountsCard>

        <AccountsCard className="p-4">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Cash Flow</p>
          <div className="flex gap-1 mb-3">
            {(['7D', '30D', '90D'] as CorporateCashFlowPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCashFlowPeriod(p)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  cashFlowPeriod === p ? 'bg-congress-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-1 h-20 mb-2">
            {cashFlow.map((point) => {
              const max = Math.max(...cashFlow.flatMap((d) => [d.inflow, d.outflow]));
              return (
                <div key={point.label} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex items-end justify-center gap-0.5 h-16">
                    <div className="w-[40%] rounded-t bg-emerald-600/80" style={{ height: `${(point.inflow / max) * 100}%` }} />
                    <div className="w-[40%] rounded-t bg-[#DC2626]/60" style={{ height: `${(point.outflow / max) * 100}%` }} />
                  </div>
                  <span className="text-[8px] text-slate-500 dark:text-slate-400">{point.label}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div><p className="text-slate-500 dark:text-slate-400">Inflow</p><p className="font-bold text-emerald-600 dark:text-emerald-400">₹{netIn.toFixed(1)}L</p></div>
            <div><p className="text-slate-500 dark:text-slate-400">Outflow</p><p className="font-bold text-[#DC2626]">₹{netOut.toFixed(1)}L</p></div>
            <div><p className="text-slate-500 dark:text-slate-400">Net</p><p className="font-bold">₹{(netIn - netOut).toFixed(1)}L</p></div>
          </div>
        </AccountsCard>

        <AccountsCard>
          <MenuRow label="Transactions" description="View transaction history" onClick={() => onNavigate('transactions', { accountId })} />
          <MenuRow label="Statements" description="Monthly and custom statements" onClick={() => onNavigate('statements', { accountId })} />
          <MenuRow label="Documents" description="Certificates and confirmations" onClick={() => onNavigate('documents', { accountId })} />
          {canManage && (
            <MenuRow label="Account Preferences" description="Primary account, nickname, visibility" onClick={() => onNavigate('preferences', { accountId })} />
          )}
        </AccountsCard>
      </div>
    </div>
  );
};
