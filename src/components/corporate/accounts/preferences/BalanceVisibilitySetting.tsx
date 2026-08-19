import React from 'react';
import { PreferencesCard, PreferencesToggle } from './PreferencesUI';

interface BalanceVisibilitySettingProps {
  hideBalance: boolean;
  disabled?: boolean;
  onChange: (hide: boolean) => void;
}

export const BalanceVisibilitySetting: React.FC<BalanceVisibilitySettingProps> = ({
  hideBalance,
  disabled,
  onChange,
}) => (
  <PreferencesCard ariaLabel="Balance visibility">
    <div className="p-4 pb-0">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white px-0">
        Balance Visibility
      </h2>
    </div>
    <PreferencesToggle
      id="hide-balance-default"
      label="Hide balance by default"
      description="Hide balances when viewing this account."
      checked={hideBalance}
      onChange={onChange}
      disabled={disabled}
    />
  </PreferencesCard>
);
