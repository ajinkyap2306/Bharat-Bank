import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { AlertTriangle, Download, Share2 } from 'lucide-react';

interface TransactionDetailsMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onReportIssue: () => void;
}

export const TransactionDetailsMoreSheet: React.FC<TransactionDetailsMoreSheetProps> = ({
  isOpen,
  onClose,
  onDownload,
  onShare,
  onReportIssue,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="More Options">
    <div className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
      {[
        { label: 'Download Receipt', icon: Download, action: onDownload },
        { label: 'Share Receipt', icon: Share2, action: onShare },
        { label: 'Report an Issue', icon: AlertTriangle, action: onReportIssue },
      ].map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => {
            onClose();
            item.action();
          }}
          className="w-full flex items-center gap-3 py-4 text-left min-h-13"
        >
          <item.icon className="w-5 h-5 text-[#0B5CAB]" aria-hidden />
          <span className="text-[15px] font-medium text-[#111827] dark:text-white">{item.label}</span>
        </button>
      ))}
    </div>
  </BottomSheet>
);
