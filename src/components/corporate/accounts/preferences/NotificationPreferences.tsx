import React from 'react';
import { PreferencesCard, PreferencesToggle } from './PreferencesUI';
import type { AccountPreferencesModel } from '../../../../types/corporateAccountPreferences';

interface NotificationPreferencesProps {
  preferences: Pick<
    AccountPreferencesModel,
    | 'transactionAlerts'
    | 'largeTransactionAlerts'
    | 'balanceAlerts'
    | 'paymentStatusAlerts'
    | 'statementAlerts'
  >;
  disabled?: boolean;
  onChange: (key: keyof NotificationPreferencesProps['preferences'], value: boolean) => void;
}

const ITEMS: {
  key: keyof NotificationPreferencesProps['preferences'];
  label: string;
  description: string;
}[] = [
  {
    key: 'transactionAlerts',
    label: 'Transaction Alerts',
    description: 'Get notified when activity occurs on this account.',
  },
  {
    key: 'largeTransactionAlerts',
    label: 'Large Transaction Alerts',
    description: 'Receive alerts for high-value transactions.',
  },
  {
    key: 'balanceAlerts',
    label: 'Balance Alerts',
    description: 'Stay informed about significant balance changes.',
  },
  {
    key: 'paymentStatusAlerts',
    label: 'Payment Status Alerts',
    description: 'Get updates when payments are processed or fail.',
  },
  {
    key: 'statementAlerts',
    label: 'Statement Ready Alerts',
    description: 'Know when your account statement is available.',
  },
];

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  preferences,
  disabled,
  onChange,
}) => (
  <PreferencesCard ariaLabel="Account notifications">
    <div className="p-4 pb-0">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
        Account Notifications
      </h2>
    </div>
    {ITEMS.map((item) => (
      <PreferencesToggle
        key={item.key}
        id={`notif-${item.key}`}
        label={item.label}
        description={item.description}
        checked={preferences[item.key]}
        onChange={(v) => onChange(item.key, v)}
        disabled={disabled}
      />
    ))}
  </PreferencesCard>
);
