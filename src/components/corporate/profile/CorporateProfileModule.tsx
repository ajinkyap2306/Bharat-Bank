import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import type { CorporateProfileScreen } from '../../../types/corporateProfile';
import { CorporateProfileHome } from './CorporateProfileHome';
import { ProfileScreenHeader } from './ProfileScreenHeader';
import { CompanyInformationScreen } from './screens/CompanyInformationScreen';
import { LinkedAccountsScreen } from './screens/LinkedAccountsScreen';
import { CorporateLimitsScreen } from './screens/CorporateLimitsScreen';
import { LoginSecurityScreen } from './screens/LoginSecurityScreen';
import { NotificationPreferencesScreen } from './screens/NotificationPreferencesScreen';
import { SupportScreen } from './screens/SupportScreen';

const SCREEN_TITLES: Record<Exclude<CorporateProfileScreen, 'home'>, string> = {
  company: 'Company Information',
  signatories: 'Authorized Signatories',
  accounts: 'Linked Accounts',
  limits: 'Corporate Limits',
  users: 'User & Access',
  'approval-rules': 'Approval Rules',
  security: 'Login & Security',
  notifications: 'Notifications',
  support: 'Help & Support',
};

export const CorporateProfileModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setBottomNavHidden, openDetailFlow, closeDetailFlow, setCorporateTab } = useBanking();
  const [screen, setScreen] = useState<CorporateProfileScreen>('home');

  useEffect(() => {
    setCorporateTab('more');
    setBottomNavHidden(true);
    openDetailFlow('corporate-profile');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow, setCorporateTab]);

  const goHome = useCallback(() => {
    setScreen('home');
  }, []);

  const exitProfile = useCallback(() => {
    if (location.pathname.startsWith('/corporate/profile')) {
      navigate('/corporate/more');
      return;
    }
    navigate('/corporate/more');
  }, [location.pathname, navigate]);

  const handleBack = () => {
    if (screen === 'home') {
      exitProfile();
      return;
    }
    goHome();
  };

  const renderScreen = () => {
    switch (screen) {
      case 'company':
        return <CompanyInformationScreen />;
      case 'accounts':
        return <LinkedAccountsScreen />;
      case 'limits':
        return <CorporateLimitsScreen />;
      case 'security':
        return <LoginSecurityScreen />;
      case 'notifications':
        return <NotificationPreferencesScreen />;
      case 'support':
        return <SupportScreen />;
      default:
        return <CorporateProfileHome onNavigate={setScreen} />;
    }
  };

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-8 font-['Inter',sans-serif]">
      <ProfileScreenHeader
        title={screen === 'home' ? 'Profile' : SCREEN_TITLES[screen]}
        onBack={handleBack}
        onMore={screen === 'home' ? undefined : undefined}
      />
      {renderScreen()}
    </div>
  );
};
