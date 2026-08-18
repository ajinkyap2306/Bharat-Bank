import React, { useState, useEffect, useCallback } from 'react';
import { useBanking } from '../../../context/BankingContext';
import { ProfileScreen } from './profileTypes';
import { ProfileHome } from './ProfileHome';
import { BottomSheet } from '../../common/BottomSheet';
import {
  PersonalInfoScreen,
  ContactDetailsScreen,
  EditContactScreen,
  OtpVerificationScreen,
  ContactSuccessScreen,
  KycDetailsScreen,
  KycUpdateScreen,
  KycReviewScreen,
  KycSubmittedScreen,
} from './screens/PersonalScreens';
import {
  AccountsPreferencesScreen,
  LinkedAccountsScreen,
  AccountDetailsScreen,
  SetPrimaryAccountScreen,
  DefaultDebitAccountScreen,
  AccountNicknameScreen,
  HideAccountScreen,
  CardsPaymentsScreen,
  DefaultCardScreen,
  PaymentPreferencesScreen,
} from './screens/AccountScreens';
import {
  SecurityCenterScreen,
  ChangePasswordScreen,
  ChangeMpinScreen,
  BiometricSettingsScreen,
  TransactionAuthScreen,
  LoginActivityScreen,
  DevicesSessionsScreen,
  TrustedDevicesScreen,
  ActiveSessionsScreen,
} from './screens/SecurityScreens';
import {
  NotificationsScreen,
  PrivacyScreen,
  AppPreferencesScreen,
  DocumentsScreen,
  HelpSupportScreen,
  ServiceRequestsScreen,
  ServiceRequestNewScreen,
  ServiceRequestDetailsScreen,
  AccountManagementScreen,
  AccountClosureScreen,
} from './screens/SettingsSupportScreens';

export const ProfileModule: React.FC = () => {
  const { setBottomNavHidden, openDetailFlow, closeDetailFlow, logout, profileDeepLink, clearProfileDeepLink } = useBanking();
  const [screen, setScreen] = useState<ProfileScreen>('home');
  const [params, setParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<ProfileScreen[]>([]);
  const [showLogout, setShowLogout] = useState(false);
  const [logoutAll, setLogoutAll] = useState(false);

  const navigate = useCallback((next: ProfileScreen, nextParams?: Record<string, string>) => {
    setHistory((h) => [...h, screen]);
    setScreen(next);
    setParams(nextParams || {});
  }, [screen]);

  const goBack = useCallback(() => {
    if (history.length === 0) {
      setScreen('home');
      setParams({});
      return;
    }
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setScreen(prev);
    setParams({});
  }, [history]);

  const handleLogoutClick = () => setShowLogout(true);

  const confirmLogout = () => {
    setShowLogout(false);
    logout();
  };

  useEffect(() => {
    if (profileDeepLink) {
      setScreen(profileDeepLink as ProfileScreen);
      setHistory([]);
      clearProfileDeepLink();
    }
  }, [profileDeepLink, clearProfileDeepLink]);

  useEffect(() => {
    const isRoot = screen === 'home';
    setBottomNavHidden(!isRoot);
    if (isRoot) {
      closeDetailFlow();
    } else {
      openDetailFlow(`profile-${screen}`);
    }
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [screen, setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  if (screen === 'home') {
    return (
      <>
        <ProfileHome onNavigate={navigate} onLogout={handleLogoutClick} />
        <BottomSheet isOpen={showLogout} onClose={() => setShowLogout(false)} title="Are you sure you want to log out?">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            You will need to sign in again to access your accounts.
          </p>
          <label className="flex items-center gap-2 mb-4 text-sm">
            <input type="checkbox" checked={logoutAll} onChange={(e) => setLogoutAll(e.target.checked)} className="rounded" />
            Logout from all devices
          </label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowLogout(false)} className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-sm">
              Cancel
            </button>
            <button type="button" onClick={confirmLogout} className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm">
              Logout
            </button>
          </div>
        </BottomSheet>
      </>
    );
  }

  const props = { onNavigate: navigate, onBack: goBack, params };

  const screens: Record<string, React.ReactNode> = {
    'personal-info': <PersonalInfoScreen {...props} />,
    'contact-details': <ContactDetailsScreen {...props} />,
    'edit-mobile': <EditContactScreen {...props} field="mobile" />,
    'edit-email': <EditContactScreen {...props} field="email" />,
    'edit-address': <EditContactScreen {...props} field="address" />,
    'otp-verification': <OtpVerificationScreen {...props} />,
    'contact-success': <ContactSuccessScreen {...props} />,
    'kyc-details': <KycDetailsScreen {...props} />,
    'kyc-update': <KycUpdateScreen {...props} />,
    'kyc-review': <KycReviewScreen {...props} />,
    'kyc-submitted': <KycSubmittedScreen {...props} />,
    'accounts-preferences': <AccountsPreferencesScreen {...props} />,
    'linked-accounts': <LinkedAccountsScreen {...props} />,
    'account-details': <AccountDetailsScreen {...props} />,
    'set-primary': <SetPrimaryAccountScreen {...props} />,
    'default-debit': <DefaultDebitAccountScreen {...props} />,
    'account-nickname': <AccountNicknameScreen {...props} />,
    'hide-account': <HideAccountScreen {...props} />,
    'cards-payments': <CardsPaymentsScreen {...props} />,
    'default-card': <DefaultCardScreen {...props} />,
    'payment-preferences': <PaymentPreferencesScreen {...props} />,
    'security-center': <SecurityCenterScreen {...props} />,
    'change-password': <ChangePasswordScreen {...props} />,
    'change-mpin': <ChangeMpinScreen {...props} />,
    'biometric-settings': <BiometricSettingsScreen {...props} />,
    'transaction-auth': <TransactionAuthScreen {...props} />,
    'login-activity': <LoginActivityScreen {...props} />,
    'devices-sessions': <DevicesSessionsScreen {...props} />,
    'trusted-devices': <TrustedDevicesScreen {...props} />,
    'active-sessions': <ActiveSessionsScreen {...props} />,
    'notifications': <NotificationsScreen {...props} />,
    'privacy': <PrivacyScreen {...props} />,
    'app-preferences': <AppPreferencesScreen {...props} />,
    'documents': <DocumentsScreen {...props} />,
    'help-support': <HelpSupportScreen {...props} />,
    'service-requests': <ServiceRequestsScreen {...props} />,
    'service-request-new': <ServiceRequestNewScreen {...props} />,
    'service-request-details': <ServiceRequestDetailsScreen {...props} />,
    'account-management': <AccountManagementScreen {...props} />,
    'account-closure': <AccountClosureScreen {...props} />,
  };

  return screens[screen] || <ProfileHome onNavigate={navigate} onLogout={handleLogoutClick} />;
};
