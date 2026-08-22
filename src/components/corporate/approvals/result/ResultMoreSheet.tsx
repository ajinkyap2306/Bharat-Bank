import React from 'react';
import { FileText, Download, Share2 } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';

interface ResultMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRequest: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export const ResultMoreSheet: React.FC<ResultMoreSheetProps> = ({
  isOpen,
  onClose,
  onViewRequest,
  onDownload,
  onShare,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="More options">
    <div className="pb-4 space-y-1">
      {[
        { icon: <FileText className="w-4 h-4" />, label: 'View Request', action: onViewRequest },
        { icon: <Download className="w-4 h-4" />, label: 'Download Confirmation', action: onDownload },
        { icon: <Share2 className="w-4 h-4" />, label: 'Share Confirmation', action: onShare },
      ].map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            onClose();
            item.action();
          }}
          className="w-full flex items-center gap-3 px-2 py-3.5 rounded-xl min-h-11 text-left"
        >
          <span className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400">
            {item.icon}
          </span>
          <span className="text-[15px] font-medium text-slate-900 dark:text-white">{item.label}</span>
        </button>
      ))}
    </div>
  </BottomSheet>
);
