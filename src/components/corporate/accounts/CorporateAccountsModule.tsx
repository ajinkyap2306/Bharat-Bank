import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { AccountsOverviewScreen } from './screens/AccountsOverviewScreen';
import { CorporateAccountDetails } from './CorporateAccountDetails';
import { AccountTransactions } from './AccountTransactions';
import { CorporateTransactionDetailsScreen } from './CorporateTransactionDetails';
import { CorporateStatements } from './CorporateStatements';
import { AccountPreferences } from './AccountPreferences';
import { AccountLimits } from './AccountLimits';

export const CorporateAccountsModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCorporateTab, setBottomNavHidden, closeDetailFlow } = useBanking();

  const route = useMemo(() => {
    const path = location.pathname;
    const limits = path.match(/^\/corporate\/accounts\/([^/]+)\/limits\/?$/);
    const preferences = path.match(/^\/corporate\/accounts\/([^/]+)\/preferences\/?$/);
    const statements = path.match(/^\/corporate\/accounts\/([^/]+)\/statements\/?$/);
    const transactions = path.match(/^\/corporate\/accounts\/([^/]+)\/transactions\/?$/);
    const transactionDetail = path.match(
      /^\/corporate\/accounts\/([^/]+)\/transactions\/([^/]+)$/
    );
    const accountDetails = path.match(/^\/corporate\/accounts\/([^/]+)\/?$/);
    return { limits, preferences, statements, transactions, transactionDetail, accountDetails };
  }, [location.pathname]);

  const isOverview =
    location.pathname === '/corporate/accounts' ||
    location.pathname === '/corporate/accounts/';

  useEffect(() => {
    setCorporateTab('accounts');
  }, [setCorporateTab]);

  useEffect(() => {
    setBottomNavHidden(!isOverview);
    if (isOverview) closeDetailFlow();
  }, [isOverview, setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    if (!location.pathname.startsWith('/corporate/accounts')) return;
    const valid =
      isOverview ||
      route.limits ||
      route.preferences ||
      route.statements ||
      route.transactions ||
      route.transactionDetail ||
      route.accountDetails;
    if (!valid) {
      navigate('/corporate/accounts', { replace: true });
    }
  }, [location.pathname, isOverview, route, navigate]);

  if (route.transactionDetail) {
    return (
      <CorporateTransactionDetailsScreen
        accountId={route.transactionDetail[1]}
        transactionId={route.transactionDetail[2]}
      />
    );
  }

  if (route.limits) {
    return <AccountLimits accountId={route.limits[1]} />;
  }

  if (route.preferences) {
    return <AccountPreferences accountId={route.preferences[1]} />;
  }

  if (route.statements) {
    return <CorporateStatements accountId={route.statements[1]} />;
  }

  if (route.transactions) {
    return <AccountTransactions accountId={route.transactions[1]} />;
  }

  if (route.accountDetails) {
    return <CorporateAccountDetails accountId={route.accountDetails[1]} />;
  }

  return <AccountsOverviewScreen />;
};
