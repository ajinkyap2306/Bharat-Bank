import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { clonePreferences } from '../../../../data/corporateAccountPreferencesMock';
import {
  buildPaymentTypeSelectionData,
  getEligibleAccountsForType,
  isAccountEligibleForType,
} from '../../../../data/corporatePaymentTypeSelectionMock';
import { PAYMENT_SOURCE_ACCOUNT_KEY } from '../../../../data/corporateSimplePaymentMock';
import type {
  PaymentType,
  PaymentTypeErrorKind,
  PaymentTypeId,
} from '../../../../types/corporatePaymentTypeSelection';
import { PaymentHeader } from './PaymentHeader';
import { PaymentSourceAccount } from './PaymentSourceAccount';
import { AccountSelectorSheet } from './AccountSelectorSheet';
import { PaymentTypeList } from './PaymentTypeList';
import { RecentPaymentTypes } from './RecentPaymentTypes';
import { PaymentTemplateEntry } from './PaymentTemplateEntry';
import { PaymentHelpSheet } from './PaymentHelpSheet';
import { PaymentTypeErrorState } from './PaymentTypeErrorState';
import { useCorporateMakerGate } from '../../../../hooks/useCorporateMakerGate';
import { RouteLoadingState } from '../../../common/RouteLoadingState';

const CREATE_BASE_PATH = '/corporate/payments/create';

export const PaymentTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, getPrimaryCorporateAccount, setBottomNavHidden, closeDetailFlow } =
    useBanking();
  const { blockIfChecker } = useCorporateMakerGate();

  useEffect(() => {
    if (blockIfChecker('create payments')) {
      navigate('/corporate/payments', { replace: true });
    }
  }, [blockIfChecker, navigate]);

  const initialAccountId = getPrimaryCorporateAccount()?.id || 'acc_corp_op_01';
  const data = useMemo(() => buildPaymentTypeSelectionData(initialAccountId), [initialAccountId]);

  const [selectedAccountId, setSelectedAccountId] = useState(data.selectedAccountId);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [errorState, setErrorState] = useState<PaymentTypeErrorKind | null>(null);
  const [pendingTypeId, setPendingTypeId] = useState<PaymentTypeId | null>(null);

  const selectedAccount =
    data.accounts.find((a) => a.id === selectedAccountId) ?? data.accounts[0];

  const hideBalance = clonePreferences(selectedAccountId)?.hideBalance ?? false;
  const showBalances = !hideBalance;

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  const handleBack = () => {
    navigate('/corporate/payments');
  };

  const proceedToPaymentType = useCallback(
    (paymentType: PaymentType) => {
      setErrorState(null);
      setPendingTypeId(null);
      sessionStorage.setItem(PAYMENT_SOURCE_ACCOUNT_KEY, selectedAccountId);
      navigate(paymentType.route);
    },
    [navigate, selectedAccountId]
  );

  const handleSelectPaymentType = useCallback(
    (paymentType: PaymentType) => {
      if (!paymentType.available) return;

      const eligibleAccounts = getEligibleAccountsForType(data.accounts, paymentType.id);

      if (eligibleAccounts.length === 0) {
        setPendingTypeId(paymentType.id);
        setErrorState('no-eligible-account');
        return;
      }

      if (!isAccountEligibleForType(selectedAccount, paymentType.id)) {
        setPendingTypeId(paymentType.id);
        setErrorState('account-unavailable');
        return;
      }

      proceedToPaymentType(paymentType);
    },
    [data.accounts, selectedAccount, proceedToPaymentType]
  );

  const handleErrorPrimary = () => {
    if (errorState === 'account-unavailable') {
      setShowAccountSheet(true);
      return;
    }
    setErrorState(null);
    setPendingTypeId(null);
    navigate(CREATE_BASE_PATH);
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);

    if (pendingTypeId && errorState === 'account-unavailable') {
      const paymentType = data.paymentTypes.find((t) => t.id === pendingTypeId);
      const account = data.accounts.find((a) => a.id === accountId);
      if (paymentType && account && isAccountEligibleForType(account, pendingTypeId)) {
        proceedToPaymentType(paymentType);
      }
    }
  };

  const handleViewTemplates = () => {
    navigate('/corporate/payments/templates');
  };

  const accountSheetAccounts = useMemo(() => {
    if (pendingTypeId && errorState === 'account-unavailable') {
      return getEligibleAccountsForType(data.accounts, pendingTypeId);
    }
    return data.accounts;
  }, [data.accounts, pendingTypeId, errorState]);

  if (!selectedAccount) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-safe">
        <PaymentHeader onBack={handleBack} onHelp={() => setShowHelpSheet(true)} />
        <RouteLoadingState label="Loading payment options…" />
      </div>
    );
  }

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-safe">
      <PaymentHeader onBack={handleBack} onHelp={() => setShowHelpSheet(true)} />

      <div className="space-y-5 pt-4 pb-8 max-w-[430px] mx-auto">
        <PaymentSourceAccount
          account={selectedAccount}
          showBalances={showBalances}
          onOpen={() => setShowAccountSheet(true)}
        />

        {errorState ? (
          <PaymentTypeErrorState
            kind={errorState}
            onPrimaryAction={handleErrorPrimary}
            onSecondaryAction={
              errorState === 'account-unavailable'
                ? () => {
                    setErrorState(null);
                    setPendingTypeId(null);
                  }
                : undefined
            }
          />
        ) : (
          <>
            <PaymentTypeList
              paymentTypes={data.paymentTypes}
              onSelect={handleSelectPaymentType}
            />

            <RecentPaymentTypes
              recentTypeIds={data.recentPaymentTypeIds}
              paymentTypes={data.paymentTypes}
              onSelect={handleSelectPaymentType}
            />
          </>
        )}

        {!errorState && (
          <PaymentTemplateEntry
            templates={data.templates}
            onViewTemplates={handleViewTemplates}
          />
        )}
      </div>

      <AccountSelectorSheet
        isOpen={showAccountSheet}
        accounts={accountSheetAccounts}
        selectedId={selectedAccountId}
        showBalances={showBalances}
        paymentTypeId={
          pendingTypeId && errorState === 'account-unavailable' ? pendingTypeId : undefined
        }
        onClose={() => setShowAccountSheet(false)}
        onSelect={handleAccountSelect}
      />

      <PaymentHelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
        onPaymentGuide={() =>
          addToast({
            type: 'info',
            title: 'Payment Guide',
            message: 'The corporate payment guide will be available soon.',
          })
        }
        onContactSupport={() =>
          addToast({
            type: 'info',
            title: 'Contact Support',
            message: 'Support will connect you with your relationship manager.',
          })
        }
      />
    </div>
  );
};
