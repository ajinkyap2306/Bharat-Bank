import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { useCorporateProfileView } from '../../../../hooks/useCorporateProfileView';
import { formatProfileCurrency, ProfileCard } from '../shared/ProfileUI';
import { RouteLoadingState } from '../../../common/RouteLoadingState';

export const LinkedAccountsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setCorporateTab } = useBanking();
  const { view } = useCorporateProfileView();

  if (!view) {
    return <RouteLoadingState label="Loading linked accounts…" />;
  }

  return (
    <div className="py-4">
      <ProfileCard className="divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800">
        {view.linkedAccounts.map((acc) => (
          <div key={acc.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                {acc.isPrimary && <span className="text-[#F59E0B] text-[12px]">★</span>}
                {acc.name}
              </p>
              <p className="font-mono text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{acc.maskedNumber}</p>
            </div>
            {acc.balance != null && (
              <span className="text-[14px] font-semibold text-slate-900 dark:text-white tabular-nums shrink-0">
                {formatProfileCurrency(acc.balance)}
              </span>
            )}
          </div>
        ))}
      </ProfileCard>
      <div className="px-4 mt-4">
        <button
          type="button"
          onClick={() => {
            setCorporateTab('accounts');
            navigate('/corporate/accounts');
          }}
          className="w-full py-3 rounded-xl bg-congress-blue-700 text-white text-sm font-semibold min-h-11"
        >
          View All Accounts
        </button>
      </div>
      {view.role === 'maker' && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 px-4 mt-3 text-center">
          Showing payment-enabled accounts for your role.
        </p>
      )}
    </div>
  );
};
