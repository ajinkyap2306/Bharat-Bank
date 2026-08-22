import React, { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { PreferencesCard } from './PreferencesUI';

interface AccountNicknameSettingProps {
  officialName: string;
  nickname: string;
  isSaving?: boolean;
  onSave: (nickname: string) => void;
  onDirtyChange?: (dirty: boolean) => void;
}

const MAX_LENGTH = 40;

export const AccountNicknameSetting: React.FC<AccountNicknameSettingProps> = ({
  officialName,
  nickname,
  isSaving,
  onSave,
  onDirtyChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(nickname);

  useEffect(() => {
    setValue(nickname);
  }, [nickname]);

  useEffect(() => {
    onDirtyChange?.(editing && value.trim() !== nickname.trim());
  }, [editing, value, nickname, onDirtyChange]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > MAX_LENGTH) return;
    onSave(trimmed);
    setEditing(false);
  };

  return (
    <PreferencesCard ariaLabel="Account nickname">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">
              Account Nickname
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">Official name: {officialName}</p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-2"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden />
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="mt-3 space-y-3">
            <div>
              <label htmlFor="account-nickname" className="sr-only">
                Account nickname
              </label>
              <input
                id="account-nickname"
                type="text"
                value={value}
                maxLength={MAX_LENGTH}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Account nickname"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] text-slate-900 dark:text-white min-h-12"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 text-right">
                {value.length}/{MAX_LENGTH}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue(nickname);
                  setEditing(false);
                }}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-semibold min-h-12"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !value.trim() || value.trim() === nickname.trim()}
                className="flex-1 py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[15px] font-medium text-slate-900 dark:text-white">{nickname}</p>
        )}
      </div>
    </PreferencesCard>
  );
};
