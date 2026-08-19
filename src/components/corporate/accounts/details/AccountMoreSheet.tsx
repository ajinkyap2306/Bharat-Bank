import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { ChevronRight } from 'lucide-react';

interface AccountMoreSheetProps {
  isOpen: boolean;
  canManage: boolean;
  isPrimary: boolean;
  onClose: () => void;
  onPreferences: () => void;
  onInformation: () => void;
  onDocuments: () => void;
  onLimits: () => void;
  onSetPrimary: () => void;
}

export const AccountMoreSheet: React.FC<AccountMoreSheetProps> = ({
  isOpen,
  canManage,
  isPrimary,
  onClose,
  onPreferences,
  onInformation,
  onDocuments,
  onLimits,
  onSetPrimary,
}) => {
  const items = [
    { id: 'preferences', label: 'Account Preferences', action: onPreferences },
    { id: 'information', label: 'Account Information', action: onInformation },
    { id: 'documents', label: 'Account Documents', action: onDocuments },
    { id: 'limits', label: 'Account Limits', action: onLimits },
    ...(canManage && !isPrimary
      ? [{ id: 'primary', label: 'Set as Primary', action: onSetPrimary }]
      : []),
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Account Options">
      <div className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onClose();
              item.action();
            }}
            className="w-full flex items-center justify-between gap-3 py-4 text-left min-h-13"
          >
            <span className="text-[15px] font-medium text-[#111827] dark:text-white">
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4 text-[#667085]" />
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
