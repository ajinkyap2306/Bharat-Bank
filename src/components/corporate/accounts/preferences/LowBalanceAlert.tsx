import React, { useEffect, useState } from 'react';
import { PreferencesCard, PreferencesToggle } from './PreferencesUI';
import { formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface LowBalanceAlertProps {
  enabled: boolean;
  threshold: number;
  currency?: string;
  disabled?: boolean;
  isSaving?: boolean;
  onToggle: (enabled: boolean) => void;
  onSaveThreshold: (threshold: number) => void;
}

export const LowBalanceAlert: React.FC<LowBalanceAlertProps> = ({
  enabled,
  threshold,
  currency = '₹',
  disabled,
  isSaving,
  onToggle,
  onSaveThreshold,
}) => {
  const [draft, setDraft] = useState(String(threshold));

  useEffect(() => {
    setDraft(String(threshold));
  }, [threshold]);

  const parsed = Number(draft.replace(/,/g, ''));
  const isValid = !Number.isNaN(parsed) && parsed > 0;

  return (
    <PreferencesCard ariaLabel="Low balance alert">
      <div className="p-4 pb-0">
        <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
          Low Balance Alert
        </h2>
      </div>
      <PreferencesToggle
        id="low-balance-alert"
        label="Low Balance Alert"
        description="Alert me when available balance falls below a threshold."
        checked={enabled}
        onChange={onToggle}
        disabled={disabled}
      />
      {enabled && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-[13px] text-[#667085]">
            Alert me when available balance falls below
          </p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085] text-sm">
              {currency}
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={draft}
              onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ''))}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-white dark:bg-slate-900 text-[14px] font-medium tabular-nums min-h-12"
              aria-label="Low balance threshold amount"
            />
          </div>
          {isValid && (
            <p className="text-[12px] text-[#667085]">
              Threshold: {formatAccountCurrency(parsed, currency)}
            </p>
          )}
          <button
            type="button"
            onClick={() => isValid && onSaveThreshold(parsed)}
            disabled={disabled || isSaving || !isValid || parsed === threshold}
            className="w-full py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Threshold'}
          </button>
        </div>
      )}
    </PreferencesCard>
  );
};
