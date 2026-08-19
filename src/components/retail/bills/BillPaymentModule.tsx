import React, { useState, useEffect, useCallback } from 'react';
import { useBanking } from '../../../context/BankingContext';
import { BillScreen, BillPayContext } from './billTypes';
import { BillCategory } from '../../../types/bills';
import { BillPaymentHome } from './BillPaymentHome';
import { BillPayFlow } from './BillPayFlow';
import { TaxPaymentScreen } from './TaxPaymentScreen';
import {
  BillSearchScreen,
  BillHistoryScreen,
  BillHistoryDetailScreen,
  BillReceiptScreen,
  SavedBillersScreen,
  AddBillerScreen,
  EditBillerScreen,
  AutoPayScreen,
} from './BillSupportingScreens';

export const BillPaymentModule: React.FC = () => {
  const { setBottomNavHidden, openDetailFlow, closeDetailFlow, billDeepLink, clearBillDeepLink } = useBanking();
  const [screen, setScreen] = useState<BillScreen>('home');
  const [params, setParams] = useState<Record<string, string>>({});
  const [payContext, setPayContext] = useState<BillPayContext>({});

  const navigate = useCallback((next: BillScreen, nextParams?: Record<string, string>) => {
    setScreen(next);
    setParams(nextParams || {});
  }, []);

  const startPay = useCallback((ctx: BillPayContext) => {
    setPayContext(ctx);
    setScreen('pay');
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setParams({});
    setPayContext({});
  }, []);

  useEffect(() => {
    if (billDeepLink) {
      setScreen(billDeepLink as BillScreen);
      clearBillDeepLink();
    }
  }, [billDeepLink, clearBillDeepLink]);

  useEffect(() => {
    const showNav = screen === 'home' || screen === 'history';
    setBottomNavHidden(!showNav);
    if (showNav) {
      closeDetailFlow();
    } else {
      openDetailFlow(`bills-${screen}`);
    }
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [screen, setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  const supportProps = {
    onNavigate: navigate,
    onBack: screen === 'history-detail' || screen === 'receipt' ? () => navigate('history') :
            screen === 'add-biller' || screen === 'edit-biller' || screen === 'autopay' ? () => navigate('saved-billers') :
            goHome,
    onStartPay: startPay,
    params,
  };

  if (screen === 'home') {
    return <BillPaymentHome onNavigate={navigate} onStartPay={startPay} />;
  }

  if (screen === 'pay') {
    return (
      <BillPayFlow
        initialContext={payContext}
        onBack={goHome}
        onDone={goHome}
        onViewReceipt={(id) => navigate('receipt', { paymentId: id })}
      />
    );
  }

  if (screen === 'tax-payment') {
    return <TaxPaymentScreen onBack={goHome} />;
  }

  const screens: Record<string, React.ReactNode> = {
    search: <BillSearchScreen {...supportProps} />,
    history: <BillHistoryScreen {...supportProps} onBack={goHome} />,
    'history-detail': <BillHistoryDetailScreen {...supportProps} />,
    receipt: <BillReceiptScreen {...supportProps} onBack={() => navigate('history-detail', { paymentId: params.paymentId })} />,
    'saved-billers': <SavedBillersScreen {...supportProps} />,
    'add-biller': <AddBillerScreen {...supportProps} />,
    'edit-biller': <EditBillerScreen {...supportProps} />,
    autopay: <AutoPayScreen {...supportProps} />,
  };

  return screens[screen] || <BillPaymentHome onNavigate={navigate} onStartPay={startPay} />;
};
