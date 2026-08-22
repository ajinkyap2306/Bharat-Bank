import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { ChevronRight, Download, FileSpreadsheet, Share2 } from 'lucide-react';

interface TransactionMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: 'download' | 'csv' | 'share') => void;
}

export const TransactionMoreSheet: React.FC<TransactionMoreSheetProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const items = [
    { id: 'download' as const, label: 'Download Transactions', icon: Download },
    { id: 'csv' as const, label: 'Export CSV', icon: FileSpreadsheet },
    { id: 'share' as const, label: 'Share', icon: Share2 },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Export">
      <div className="divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onClose();
              onExport(item.id);
            }}
            className="w-full flex items-center gap-3 py-4 text-left min-h-13"
          >
            <item.icon className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
            <span className="flex-1 text-[15px] font-medium text-slate-900 dark:text-white">
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
