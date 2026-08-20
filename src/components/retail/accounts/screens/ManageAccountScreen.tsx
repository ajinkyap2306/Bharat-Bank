import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  BadgeCheck,
  FileCheck,
  Pencil,
  Share2,
  Snowflake,
  Star,
  Users,
  UserPlus,
} from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { BottomSheet } from '../../../common/BottomSheet';
import {
  AccountsScreenLayout,
  AccountsMenuGroup,
  AccountsMenuItem,
  AccountsInfoCard,
  formatInr,
} from '../shared/RetailAccountsUI';

export const ManageAccountScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts, primaryAccountId, setPrimaryAccount } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  const [showPrimarySheet, setShowPrimarySheet] = useState(false);
  const [primarySuccess, setPrimarySuccess] = useState(false);

  if (!account) {
    return (
      <AccountsScreenLayout
        title="Manage Account"
        onBack={() => navigate('/retail/accounts')}
      >
        <p className="text-sm text-slate-500">Account not found.</p>
      </AccountsScreenLayout>
    );
  }

  const isPrimary = account.id === primaryAccountId;
  const currentPrimary = accounts.find((a) => a.id === primaryAccountId);
  const base = `/retail/accounts/${accountId}/manage`;

  const handleSetPrimary = () => {
    setPrimaryAccount(account.id);
    setShowPrimarySheet(false);
    setPrimarySuccess(true);
  };

  if (primarySuccess) {
    return (
      <AccountsScreenLayout
        title="Manage Account"
        onBack={() => navigate(`/retail/accounts/${accountId}`)}
      >
        <div className="flex flex-col items-center text-center py-10 px-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <BadgeCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Primary Account Updated</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">
            {account.accountType} {account.maskedNumber} is now your primary account.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/retail/accounts/${accountId}`)}
            className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Done
          </button>
        </div>
      </AccountsScreenLayout>
    );
  }

  return (
    <>
      <AccountsScreenLayout
        title="Manage Account"
        onBack={() => navigate(`/retail/accounts/${accountId}`)}
      >
        <AccountsInfoCard>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{account.accountType}</p>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{account.maskedNumber}</p>
          <p className="text-xs text-slate-500 mt-2">Balance: {formatInr(account.availableBalance)}</p>
        </AccountsInfoCard>

        <AccountsMenuGroup>
          <AccountsMenuItem
            icon={<Pencil className="w-4 h-4" />}
            title="Account Nickname"
            description="Add / Modify"
            onClick={() => navigate(`${base}/nickname`)}
          />
          <AccountsMenuItem
            icon={<Users className="w-4 h-4" />}
            title="View Nominee / Joint Holder"
            onClick={() => navigate(`${base}/holders`)}
          />
          <AccountsMenuItem
            icon={<Share2 className="w-4 h-4" />}
            title="Share Account Details"
            description="Account Number • IFSC"
            onClick={() => navigate(`${base}/share`)}
          />
          <AccountsMenuItem
            icon={<Snowflake className="w-4 h-4" />}
            title="Freeze Account"
            onClick={() => navigate(`${base}/freeze`)}
          />
          <AccountsMenuItem
            icon={<FileCheck className="w-4 h-4" />}
            title="Positive Pay"
            description="Register cheque instructions"
            onClick={() => navigate(`${base}/positive-pay`)}
          />
          <AccountsMenuItem
            icon={<UserPlus className="w-4 h-4" />}
            title="Beneficiary Management"
            description="Add / Deactivate Beneficiary"
            onClick={() => navigate(`${base}/beneficiaries`)}
          />
          {!isPrimary && (
            <AccountsMenuItem
              icon={<Star className="w-4 h-4" />}
              title="Set as Primary Account"
              onClick={() => setShowPrimarySheet(true)}
            />
          )}
        </AccountsMenuGroup>

        <AccountsMenuGroup>
          <AccountsMenuItem
            icon={<AlertOctagon className="w-4 h-4" />}
            title="Close Account"
            description="Request account closure"
            onClick={() => navigate(`${base}/close`)}
            danger
          />
        </AccountsMenuGroup>
      </AccountsScreenLayout>

      <BottomSheet
        isOpen={showPrimarySheet}
        onClose={() => setShowPrimarySheet(false)}
        title="Set as Primary Account?"
      >
        <div className="space-y-4">
          <AccountsInfoCard>
            <p className="text-sm font-bold">{account.accountType}</p>
            <p className="text-xs font-mono text-slate-500">{account.maskedNumber}</p>
            {currentPrimary && currentPrimary.id !== account.id && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500">Current Primary Account</p>
                <p className="text-sm font-semibold">
                  {currentPrimary.accountType} {currentPrimary.maskedNumber}
                </p>
              </div>
            )}
          </AccountsInfoCard>
          <p className="text-xs text-slate-500">
            This account will become your default account for eligible payments and transactions.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPrimarySheet(false)}
              className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSetPrimary}
              className="flex-1 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
            >
              Set as Primary
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};
