import React, { useState } from 'react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { getAccountById } from '../../../../data/corporateAccountsMock';
import { useBanking } from '../../../../context/BankingContext';
import { AccountsCard, MenuRow } from '../shared/CorporateAccountsUI';
import { CorporateAccountNotificationPrefs } from '../../../../types/corporateAccounts';

interface AccountPreferencesScreenProps {
  accountId: string;
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export const AccountPreferencesScreen: React.FC<AccountPreferencesScreenProps> = ({
  accountId,
  onBack,
  onNavigate,
}) => {
  const account = getAccountById(accountId);
  const { primaryCorporateAccountId, corporateDefaultPaymentAccountId } = useBanking();
  const isPrimary = accountId === primaryCorporateAccountId;
  const isDefaultPayment = accountId === corporateDefaultPaymentAccountId;

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Account Preferences" subtitle={account?.nickname} onBack={onBack} edgeToEdge={false} />
      <AccountsCard>
        <MenuRow
          label="Set Primary Operating Account"
          description={isPrimary ? 'Currently primary' : 'Use as default operating account'}
          onClick={() => onNavigate('set-primary')}
        />
        <MenuRow
          label="Default Payment Account"
          description={isDefaultPayment ? 'Currently default' : 'Default for payment flows'}
          onClick={() => onNavigate('set-primary')}
        />
        <MenuRow label="Account Nickname" description="Personalize account name" onClick={() => onNavigate('nickname')} />
        <MenuRow label="Hide Account" description="Hide from overview" onClick={() => onNavigate('hide-account')} />
        <MenuRow label="Notification Preferences" description="Alerts and notifications" onClick={() => onNavigate('notifications')} />
      </AccountsCard>
    </div>
  );
};

interface SetPrimaryScreenProps {
  accountId: string;
  onBack: () => void;
  onConfirm: () => void;
}

export const SetPrimaryScreen: React.FC<SetPrimaryScreenProps> = ({ accountId, onBack, onConfirm }) => {
  const account = getAccountById(accountId);
  const { primaryCorporateAccountId } = useBanking();
  const isPrimary = accountId === primaryCorporateAccountId;

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Primary Operating Account" onBack={onBack} edgeToEdge={false} />
      <AccountsCard className="p-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Set <strong>{account?.nickname}</strong> as your primary operating account? This will be the default debit account in eligible payment flows.
        </p>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPrimary}
          className="mt-4 w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm disabled:opacity-50"
        >
          {isPrimary ? 'Already Primary' : 'Continue'}
        </button>
      </AccountsCard>
    </div>
  );
};

interface NicknameScreenProps {
  accountId: string;
  onBack: () => void;
  onSave: (nickname: string) => void;
}

export const NicknameScreen: React.FC<NicknameScreenProps> = ({ accountId, onBack, onSave }) => {
  const { corporateAccounts } = useBanking();
  const base = getAccountById(accountId);
  const ctx = corporateAccounts.find((a) => a.id === accountId);
  const [nickname, setNickname] = useState(ctx?.nickname || base?.nickname || '');

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Account Nickname" onBack={onBack} edgeToEdge={false} />
      <AccountsCard className="p-4 space-y-3">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter nickname"
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
        <button type="button" onClick={() => onSave(nickname)} className="w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm">
          Save
        </button>
      </AccountsCard>
    </div>
  );
};

interface HideAccountScreenProps {
  accountId: string;
  onBack: () => void;
  onConfirm: () => void;
}

export const HideAccountScreen: React.FC<HideAccountScreenProps> = ({ accountId, onBack, onConfirm }) => {
  const account = getAccountById(accountId);
  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Hide Account" onBack={onBack} edgeToEdge={false} />
      <AccountsCard className="p-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Hide <strong>{account?.nickname}</strong> from the accounts overview? The account will remain accessible through account management.
        </p>
        <button type="button" onClick={onConfirm} className="mt-4 w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm">
          Continue
        </button>
      </AccountsCard>
    </div>
  );
};

interface NotificationsPrefsScreenProps {
  onBack: () => void;
}

export const NotificationsPrefsScreen: React.FC<NotificationsPrefsScreenProps> = ({ onBack }) => {
  const [prefs, setPrefs] = useState<CorporateAccountNotificationPrefs>({
    balanceAlerts: true,
    largeTransactionAlerts: true,
    paymentAlerts: true,
    collectionAlerts: true,
    securityAlerts: true,
    statementAlerts: true,
    lowBalanceAlerts: false,
  });

  const toggle = (key: keyof CorporateAccountNotificationPrefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items: { key: keyof CorporateAccountNotificationPrefs; label: string; locked?: boolean }[] = [
    { key: 'balanceAlerts', label: 'Balance alerts' },
    { key: 'largeTransactionAlerts', label: 'Large transaction alerts' },
    { key: 'paymentAlerts', label: 'Payment alerts' },
    { key: 'collectionAlerts', label: 'Collection alerts' },
    { key: 'securityAlerts', label: 'Security alerts', locked: true },
    { key: 'statementAlerts', label: 'Statement availability' },
    { key: 'lowBalanceAlerts', label: 'Low balance alerts' },
  ];

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Notification Preferences" onBack={onBack} edgeToEdge={false} />
      <AccountsCard className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map(({ key, label, locked }) => (
          <label key={key} className="flex items-center justify-between p-3">
            <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
            <input type="checkbox" checked={prefs[key]} disabled={locked} onChange={() => !locked && toggle(key)} className="rounded" />
          </label>
        ))}
      </AccountsCard>
    </div>
  );
};

interface AuthConfirmScreenProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onConfirm: () => void;
}

export const AuthConfirmScreen: React.FC<AuthConfirmScreenProps> = ({
  title,
  subtitle,
  onBack,
  onConfirm,
}) => {
  const [mpin, setMpin] = useState('');

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title={title} onBack={onBack} edgeToEdge={false} />
      <AccountsCard className="p-4 space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        <input
          type="password"
          maxLength={6}
          value={mpin}
          onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter MPIN"
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-lg tracking-widest font-mono"
        />
        <button
          type="button"
          onClick={onConfirm}
          disabled={mpin.length < 4}
          className="w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm disabled:opacity-50"
        >
          Authenticate
        </button>
      </AccountsCard>
    </div>
  );
};

interface SuccessScreenProps {
  title: string;
  message: string;
  onDone: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ title, message, onDone }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center justify-center p-6 text-center">
    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4">✓</div>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{message}</p>
    <button type="button" onClick={onDone} className="mt-6 px-8 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm">
      Done
    </button>
  </div>
);
