import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import { parseRetailAccountsRoute } from '../../../utils/retailAccountsRoutes';
import { AccountsOverviewScreen } from './screens/AccountsOverviewScreen';
import { AccountDetailsScreen } from './screens/AccountDetailsScreen';
import { ManageAccountScreen } from './screens/ManageAccountScreen';
import {
  AccountNicknameScreen,
  AccountHoldersScreen,
  ShareAccountScreen,
  FreezeAccountScreen,
  PositivePayDashboardScreen,
  PositivePayAddScreen,
  PositivePayReviewScreen,
  BeneficiaryManagementScreen,
  BeneficiaryAddScreen,
  BeneficiaryReviewScreen,
  BeneficiaryDetailScreen,
  CloseAccountScreen,
  CloseAccountReasonScreen,
  CloseAccountConfirmScreen,
  CloseAccountAuthScreen,
  CloseAccountSuccessScreen,
} from './screens/ManageAccountFlows';

export const RetailAccountsModule: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRetailTab, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const route = useMemo(() => parseRetailAccountsRoute(location.pathname), [location.pathname]);

  useEffect(() => {
    setRetailTab('accounts');
    setBottomNavHidden(true);

    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setRetailTab, setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    openDetailFlow(`retail-accounts-${route.screen}`);
  }, [route.screen, openDetailFlow]);

  useEffect(() => {
    if (!location.pathname.startsWith('/retail/accounts')) return;
    const valid =
      route.screen === 'overview' ||
      (route.accountId && route.screen !== 'overview');
    if (!valid) {
      navigate('/retail/accounts', { replace: true });
    }
  }, [location.pathname, route, navigate]);

  if (route.screen === 'overview') {
    return <AccountsOverviewScreen />;
  }

  const accountId = route.accountId!;

  switch (route.screen) {
    case 'details':
      return <AccountDetailsScreen accountId={accountId} />;
    case 'manage':
      return <ManageAccountScreen accountId={accountId} />;
    case 'nickname':
      return <AccountNicknameScreen accountId={accountId} />;
    case 'holders':
      return <AccountHoldersScreen accountId={accountId} />;
    case 'share':
      return <ShareAccountScreen accountId={accountId} />;
    case 'freeze':
      return <FreezeAccountScreen accountId={accountId} />;
    case 'positive-pay':
      return <PositivePayDashboardScreen accountId={accountId} />;
    case 'positive-pay-add':
      return <PositivePayAddScreen accountId={accountId} />;
    case 'positive-pay-review':
      return <PositivePayReviewScreen accountId={accountId} />;
    case 'beneficiaries':
      return <BeneficiaryManagementScreen accountId={accountId} />;
    case 'beneficiaries-add':
      return <BeneficiaryAddScreen accountId={accountId} />;
    case 'beneficiaries-review':
      return <BeneficiaryReviewScreen accountId={accountId} />;
    case 'beneficiary-detail':
      return (
        <BeneficiaryDetailScreen accountId={accountId} beneficiaryId={route.beneficiaryId!} />
      );
    case 'close':
      return <CloseAccountScreen accountId={accountId} />;
    case 'close-reason':
      return <CloseAccountReasonScreen accountId={accountId} />;
    case 'close-confirm':
      return <CloseAccountConfirmScreen accountId={accountId} />;
    case 'close-auth':
      return <CloseAccountAuthScreen accountId={accountId} />;
    case 'close-success':
      return <CloseAccountSuccessScreen accountId={accountId} />;
    default:
      return <AccountDetailsScreen accountId={accountId} />;
  }
};
