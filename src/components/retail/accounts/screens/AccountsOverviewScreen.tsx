import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { BankAccount } from '../../../../types/banking';
import {
  AccountsScreenLayout,
  AccountCarouselCard,
  TransactionActivitySection,
} from '../shared/RetailAccountsUI';

const CAROUSEL_TYPES: BankAccount['accountType'][] = ['Savings', 'Current', 'Fixed Deposit'];

export const AccountsOverviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, transactions, primaryAccountId, setRetailTab } = useBanking();
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');

  const carouselAccounts = useMemo(() => {
    const picked = CAROUSEL_TYPES.map((type) => accounts.find((a) => a.accountType === type)).filter(
      Boolean
    ) as BankAccount[];
    return picked.length > 0 ? picked : accounts.slice(0, 3);
  }, [accounts]);

  const displayAccount =
    accounts.find((a) => a.id === primaryAccountId) ?? carouselAccounts[0];

  const accountTransactions = transactions.filter(
    (t) => t.accountId === displayAccount?.id || !t.accountId
  );

  const goHome = () => {
    navigate('/', { replace: true });
    setRetailTab('home');
  };

  const openDetails = (accountId: string) => {
    navigate(`/retail/accounts/${accountId}`);
  };

  return (
    <AccountsScreenLayout title="Accounts" onBack={goHome}>
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-1 px-1 pb-1">
        {carouselAccounts.map((acc) => (
          <AccountCarouselCard
            key={acc.id}
            account={acc}
            isPrimary={acc.id === primaryAccountId}
            showBalance={showBalance}
            onClick={() => openDetails(acc.id)}
            compact
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowBalance(!showBalance)}
          className="text-[11px] font-semibold text-congress-blue-700 dark:text-congress-blue-400"
        >
          {showBalance ? 'Hide balances' : 'Show balances'}
        </button>
      </div>

      <TransactionActivitySection
        transactions={accountTransactions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
      />
    </AccountsScreenLayout>
  );
};
