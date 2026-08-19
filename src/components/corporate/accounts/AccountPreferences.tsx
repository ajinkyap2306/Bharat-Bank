import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import type {
  AccountPreferencesModel,
  AccountPreferencesScreenData,
  AuthMethod,
  PreferenceUpdateKey,
} from '../../../types/corporateAccountPreferences';
import {
  fetchAccountPreferences,
  removePrimaryStatus,
  setPrimaryAccount,
  updateAccountNickname,
  updateAccountPreference,
  verifyPreferenceAuth,
} from '../../../services/corporateAccountPreferencesService';
import { canManageAccountSettings } from './shared/CorporateAccountsUI';
import { AccountPreferencesHeader } from './preferences/AccountPreferencesHeader';
import { AccountSummary } from './preferences/AccountSummary';
import { PrimaryAccountSetting } from './preferences/PrimaryAccountSetting';
import { PrimaryAccountConfirmation } from './preferences/PrimaryAccountConfirmation';
import { ChangePrimaryAccountSheet } from './preferences/ChangePrimaryAccountSheet';
import { AccountNicknameSetting } from './preferences/AccountNicknameSetting';
import { BalanceVisibilitySetting } from './preferences/BalanceVisibilitySetting';
import { NotificationPreferences } from './preferences/NotificationPreferences';
import { LowBalanceAlert } from './preferences/LowBalanceAlert';
import { PreferencesAccountInformation } from './preferences/PreferencesAccountInformation';
import { AccountLimitsCard } from './preferences/AccountLimitsCard';
import { PreferencesAccountDocuments } from './preferences/PreferencesAccountDocuments';
import { AuthenticationSheet } from './preferences/AuthenticationSheet';
import { DiscardChangesSheet } from './preferences/DiscardChangesSheet';
import { PrimarySuccessSheet } from './preferences/PrimarySuccessSheet';
import { RemovePrimaryConfirmation } from './preferences/RemovePrimaryConfirmation';
import {
  PreferencesScreenSkeleton,
  PreferencesErrorState,
  PreferenceUpdateError,
} from './preferences/PreferenceStates';

interface AccountPreferencesProps {
  accountId: string;
}

type AuthFlow = 'set-primary' | 'remove-primary' | null;

export const AccountPreferences: React.FC<AccountPreferencesProps> = ({ accountId }) => {
  const navigate = useNavigate();
  const {
    setBottomNavHidden,
    setCorporateTab,
    addToast,
    setPrimaryCorporateAccount,
    updateCorporateAccountNickname,
    primaryCorporateAccountId,
    user,
  } = useBanking();

  const [data, setData] = useState<AccountPreferencesScreenData | null>(null);
  const [preferences, setPreferences] = useState<AccountPreferencesModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState(false);
  const [lastFailedAction, setLastFailedAction] = useState<(() => void) | null>(null);

  const [showSetPrimaryConfirm, setShowSetPrimaryConfirm] = useState(false);
  const [showChangePrimary, setShowChangePrimary] = useState(false);
  const [showRemovePrimary, setShowRemovePrimary] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPrimarySuccess, setShowPrimarySuccess] = useState(false);
  const [authFlow, setAuthFlow] = useState<AuthFlow>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [nicknameDirty, setNicknameDirty] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const pendingBackRef = useRef(false);

  const canManage = canManageAccountSettings(user.role);
  const canConfigureLowBalance = canManage;

  useEffect(() => {
    setBottomNavHidden(true);
    setCorporateTab('accounts');
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden, setCorporateTab]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const result = await fetchAccountPreferences(accountId, canConfigureLowBalance);
      if (!result) {
        setLoadError(true);
        setData(null);
        setPreferences(null);
      } else {
        setData(result);
        setPreferences(result.preferences);
      }
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, canConfigureLowBalance]);

  useEffect(() => {
    load();
  }, [load]);

  const accountLabel = data
    ? `${data.account.accountType} ${data.account.maskedNumber}`
    : '';

  const showBalances = !preferences?.hideBalance;

  const handleBack = () => {
    if (nicknameDirty) {
      pendingBackRef.current = true;
      setShowDiscard(true);
      return;
    }
    navigate(`/corporate/accounts/${accountId}`);
  };

  const handleDiscard = () => {
    setShowDiscard(false);
    setNicknameDirty(false);
    if (pendingBackRef.current) {
      pendingBackRef.current = false;
      navigate(`/corporate/accounts/${accountId}`);
    }
  };

  const applyPreferenceUpdate = async <K extends PreferenceUpdateKey>(
    key: K,
    value: AccountPreferencesModel[K],
    toastMessage: string
  ) => {
    if (!preferences) return;
    setUpdatingKey(key);
    setUpdateError(false);
    try {
      const updated = await updateAccountPreference(accountId, key, value);
      setPreferences(updated);
      addToast({
        type: 'success',
        title: 'Preference updated',
        message: toastMessage,
      });
    } catch {
      setUpdateError(true);
      setLastFailedAction(() => () => applyPreferenceUpdate(key, value, toastMessage));
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleSetPrimaryClick = () => {
    if (!data || !preferences) return;
    if (preferences.isPrimary) return;

    const hasOtherPrimary =
      data.currentPrimaryAccountId &&
      data.currentPrimaryAccountId !== accountId;

    if (hasOtherPrimary) {
      setShowChangePrimary(true);
    } else {
      setShowSetPrimaryConfirm(true);
    }
  };

  const proceedToAuth = (flow: AuthFlow) => {
    setShowSetPrimaryConfirm(false);
    setShowChangePrimary(false);
    setShowRemovePrimary(false);
    setAuthFlow(flow);
    setShowAuth(true);
  };

  const handleAuthVerify = async (method: AuthMethod, code?: string) => {
    setIsVerifying(true);
    try {
      const ok = await verifyPreferenceAuth(method, code);
      if (!ok) {
        addToast({
          type: 'error',
          title: 'Authentication failed',
          message: 'Please try again.',
        });
        return;
      }

      setShowAuth(false);

      if (authFlow === 'set-primary') {
        setUpdatingKey('primary');
        try {
          const result = await setPrimaryAccount(accountId);
          setPrimaryCorporateAccount(accountId);
          setPreferences({ ...result.preferences, isPrimary: true });
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  preferences: { ...result.preferences, isPrimary: true },
                  currentPrimaryAccountId: accountId,
                  currentPrimaryAccountLabel: accountLabel,
                }
              : prev
          );
          setShowPrimarySuccess(true);
        } catch {
          setUpdateError(true);
          setLastFailedAction(() => () => proceedToAuth('set-primary'));
        } finally {
          setUpdatingKey(null);
        }
      } else if (authFlow === 'remove-primary') {
        setUpdatingKey('primary');
        try {
          await removePrimaryStatus(accountId);
        } catch (err) {
          addToast({
            type: 'info',
            title: 'Primary account required',
            message:
              err instanceof Error
                ? err.message
                : 'Set another eligible account as primary first.',
          });
        } finally {
          setUpdatingKey(null);
        }
      }
    } finally {
      setIsVerifying(false);
      setAuthFlow(null);
    }
  };

  const handleSaveNickname = async (nickname: string) => {
    setUpdatingKey('nickname');
    setUpdateError(false);
    try {
      const updated = await updateAccountNickname(accountId, nickname);
      setPreferences(updated);
      updateCorporateAccountNickname(accountId, nickname);
      setNicknameDirty(false);
    } catch {
      setUpdateError(true);
      setLastFailedAction(() => () => handleSaveNickname(nickname));
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleDocumentSelect = (docId: 'statement' | 'certificate' | 'interest') => {
    if (docId === 'statement') {
      navigate(`/corporate/accounts/${accountId}/statements`);
      return;
    }
    addToast({
      type: 'info',
      title: docId === 'certificate' ? 'Account Certificate' : 'Interest Certificate',
      message: 'Document download will be available in a future update.',
    });
  };

  const handleViewLimits = () => {
    navigate(`/corporate/accounts/${accountId}/limits`);
  };

  const isPrimary =
    preferences?.isPrimary ?? accountId === primaryCorporateAccountId;

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <AccountPreferencesHeader accountLabel="" onBack={handleBack} />
        <PreferencesScreenSkeleton />
      </div>
    );
  }

  if (loadError || !data || !preferences) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <AccountPreferencesHeader accountLabel="" onBack={() => navigate(-1)} />
        <PreferencesErrorState onRetry={load} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-8">
      <AccountPreferencesHeader accountLabel={accountLabel} onBack={handleBack} />

      {updateError && lastFailedAction && (
        <div className="pt-4">
          <PreferenceUpdateError onRetry={lastFailedAction} />
        </div>
      )}

      <div className="space-y-4 pt-4">
        <AccountSummary
          account={data.account}
          isPrimary={isPrimary}
          showBalances={showBalances}
        />

        {canManage && (
          <PrimaryAccountSetting
            isPrimary={isPrimary}
            accountType={data.account.accountType}
            maskedNumber={data.account.maskedNumber}
            currentPrimaryLabel={
              !isPrimary ? data.currentPrimaryAccountLabel : null
            }
            isUpdating={updatingKey === 'primary'}
            onSetPrimary={handleSetPrimaryClick}
            onRemovePrimary={() => setShowRemovePrimary(true)}
          />
        )}

        <AccountNicknameSetting
          officialName={data.account.accountType}
          nickname={preferences.nickname}
          isSaving={updatingKey === 'nickname'}
          onSave={handleSaveNickname}
          onDirtyChange={setNicknameDirty}
        />

        <BalanceVisibilitySetting
          hideBalance={preferences.hideBalance}
          disabled={!!updatingKey}
          onChange={(hide) =>
            applyPreferenceUpdate(
              'hideBalance',
              hide,
              hide
                ? 'Balances will be hidden for this account.'
                : 'Balances will be shown for this account.'
            )
          }
        />

        <NotificationPreferences
          preferences={preferences}
          disabled={!!updatingKey}
          onChange={(key, value) =>
            applyPreferenceUpdate(key, value, 'Notification preference updated.')
          }
        />

        {canConfigureLowBalance && (
          <LowBalanceAlert
            enabled={preferences.lowBalanceAlertEnabled}
            threshold={preferences.lowBalanceThreshold}
            currency={data.account.currency}
            disabled={!!updatingKey}
            isSaving={updatingKey === 'lowBalanceThreshold'}
            onToggle={(enabled) =>
              applyPreferenceUpdate(
                'lowBalanceAlertEnabled',
                enabled,
                enabled ? 'Low balance alert enabled.' : 'Low balance alert disabled.'
              )
            }
            onSaveThreshold={(threshold) =>
              applyPreferenceUpdate(
                'lowBalanceThreshold',
                threshold,
                'Low balance threshold saved.'
              )
            }
          />
        )}

        <PreferencesAccountInformation account={data.account} />

        {data.limits && (
          <AccountLimitsCard
            limits={data.limits}
            currency={data.account.currency}
            showBalances={showBalances}
            onViewLimits={handleViewLimits}
          />
        )}

        <PreferencesAccountDocuments onSelect={handleDocumentSelect} />
      </div>

      <PrimaryAccountConfirmation
        isOpen={showSetPrimaryConfirm}
        accountType={data.account.accountType}
        maskedNumber={data.account.maskedNumber}
        onCancel={() => setShowSetPrimaryConfirm(false)}
        onConfirm={() => proceedToAuth('set-primary')}
      />

      <ChangePrimaryAccountSheet
        isOpen={showChangePrimary}
        newAccountLabel={accountLabel}
        currentPrimaryLabel={data.currentPrimaryAccountLabel ?? ''}
        onCancel={() => setShowChangePrimary(false)}
        onContinue={() => proceedToAuth('set-primary')}
      />

      <RemovePrimaryConfirmation
        isOpen={showRemovePrimary}
        onCancel={() => setShowRemovePrimary(false)}
        onConfirm={() => proceedToAuth('remove-primary')}
      />

      <AuthenticationSheet
        isOpen={showAuth}
        title={
          authFlow === 'remove-primary'
            ? 'Authenticate to Remove Primary'
            : 'Authenticate Preference Change'
        }
        subtitle="Verify your identity to confirm this account preference change."
        isVerifying={isVerifying}
        onClose={() => {
          setShowAuth(false);
          setAuthFlow(null);
        }}
        onVerify={handleAuthVerify}
      />

      <PrimarySuccessSheet
        isOpen={showPrimarySuccess}
        accountLabel={`${data.account.accountType} ${data.account.maskedNumber}`}
        onClose={() => setShowPrimarySuccess(false)}
      />

      <DiscardChangesSheet
        isOpen={showDiscard}
        onKeepEditing={() => {
          setShowDiscard(false);
          pendingBackRef.current = false;
        }}
        onDiscard={handleDiscard}
      />
    </div>
  );
};
