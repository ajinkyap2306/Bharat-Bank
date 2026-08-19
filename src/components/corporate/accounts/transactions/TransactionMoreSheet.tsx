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
      <div className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
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
            <item.icon className="w-5 h-5 text-[#0B5CAB]" aria-hidden />
            <span className="flex-1 text-[15px] font-medium text-[#111827] dark:text-white">
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4 text-[#667085]" />
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
