import React from 'react';
import { Download, Share2, AlertTriangle } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';

interface PaymentMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  receiptAvailable: boolean;
  onDownloadReceipt: () => void;
  onShare: () => void;
  onReportIssue: () => void;
}

export const PaymentMoreSheet: React.FC<PaymentMoreSheetProps> = ({
  isOpen,
  onClose,
  receiptAvailable,
  onDownloadReceipt,
  onShare,
  onReportIssue,
}) => {
  const items = [
    ...(receiptAvailable
      ? [
          {
            label: 'Download Receipt',
            icon: Download,
            onClick: () => {
              onDownloadReceipt();
              onClose();
            },
          },
        ]
      : []),
    {
      label: 'Share',
      icon: Share2,
      onClick: () => {
        onShare();
        onClose();
      },
    },
    {
      label: 'Report an Issue',
      icon: AlertTriangle,
      onClick: () => {
        onReportIssue();
        onClose();
      },
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="More Options">
      <div className="px-4 pb-6 space-y-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[14px] font-medium text-[#111827] dark:text-white min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB]"
          >
            <item.icon className="w-5 h-5 text-[#667085]" aria-hidden />
            {item.label}
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
