import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PreferencesCard } from './PreferencesUI';

interface PrimaryAccountSettingProps {
  isPrimary: boolean;
  accountType: string;
  maskedNumber: string;
  currentPrimaryLabel?: string | null;
  isUpdating?: boolean;
  onSetPrimary: () => void;
  onRemovePrimary: () => void;
}

export const PrimaryAccountSetting: React.FC<PrimaryAccountSettingProps> = ({
  isPrimary,
  accountType,
  maskedNumber,
  currentPrimaryLabel,
  isUpdating,
  onSetPrimary,
  onRemovePrimary,
}) => (
  <PreferencesCard ariaLabel="Primary account">
    <div className="p-4">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">Primary Account</h2>
      <p className="text-[13px] text-[#667085] mt-1">
        Use this account as the default account for eligible corporate banking actions.
      </p>

      {isPrimary ? (
        <div className="mt-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/20 p-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" aria-hidden />
            <div>
              <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
                Primary Account
              </p>
              <p className="text-[12px] text-[#667085] mt-0.5">
                This is currently your primary operating account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemovePrimary}
            disabled={isUpdating}
            className="mt-3 text-[13px] font-semibold text-[#DC2626] min-h-11"
          >
            Remove Primary Status
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {currentPrimaryLabel && (
            <div className="mb-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-800/50 border border-[#E4E7EC] dark:border-slate-800 p-3">
              <p className="text-[11px] font-semibold text-[#667085] uppercase tracking-wide">
                Current Primary Account
              </p>
              <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-1">
                {currentPrimaryLabel}
              </p>
            </div>
          )}
          <p className="text-[14px] font-medium text-[#111827] dark:text-white">Set as Primary Account</p>
          <p className="text-[12px] text-[#667085] mt-1 tabular-nums">
            {accountType} {maskedNumber}
          </p>
          <button
            type="button"
            onClick={onSetPrimary}
            disabled={isUpdating}
            className="mt-3 w-full py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Set as Primary'}
          </button>
        </div>
      )}
    </div>
  </PreferencesCard>
);
