import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { Download, Share2, FileText } from 'lucide-react';

interface BatchStatusMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onViewDetails: () => void;
}

export const BatchStatusMoreSheet: React.FC<BatchStatusMoreSheetProps> = ({
  isOpen,
  onClose,
  onDownload,
  onShare,
  onViewDetails,
}) => {
  const items = [
    { label: 'Download Confirmation', icon: Download, onClick: onDownload },
    { label: 'Share Confirmation', icon: Share2, onClick: onShare },
    { label: 'View Batch Details', icon: FileText, onClick: onViewDetails },
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
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[14px] font-medium min-h-11"
          >
            <item.icon className="w-5 h-5 text-[#667085]" aria-hidden />
            {item.label}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
