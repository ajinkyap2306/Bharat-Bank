import React from 'react';
import { BottomSheet } from '../../common/BottomSheet';
import { Download, HelpCircle, History } from 'lucide-react';

interface BulkPaymentsMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
  onViewHistory: () => void;
  onHelp: () => void;
}

export const BulkPaymentsMoreSheet: React.FC<BulkPaymentsMoreSheetProps> = ({
  isOpen,
  onClose,
  onDownloadTemplate,
  onViewHistory,
  onHelp,
}) => {
  const items = [
    { label: 'Download Sample File', icon: Download, onClick: onDownloadTemplate },
    { label: 'View Batch History', icon: History, onClick: onViewHistory },
    { label: 'Help', icon: HelpCircle, onClick: onHelp },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="More Options">
      <div className="px-4 pb-6 space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[14px] font-medium min-h-11"
          >
            <item.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />
            {item.label}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
