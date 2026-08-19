import React from 'react';
import { Download, FileText, Flag } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';

interface ApprovalMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onViewHistory: () => void;
  onDownload: () => void;
  onReport: () => void;
}

const ActionRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-2 py-3.5 rounded-xl min-h-11 text-left active:bg-slate-50 dark:active:bg-slate-800"
  >
    <span className="w-9 h-9 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 flex items-center justify-center text-[#0B5CAB]">
      {icon}
    </span>
    <span className="text-[15px] font-medium text-[#111827] dark:text-white">{label}</span>
  </button>
);

export const ApprovalMoreSheet: React.FC<ApprovalMoreSheetProps> = ({
  isOpen,
  onClose,
  onViewHistory,
  onDownload,
  onReport,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="More options">
    <div className="pb-4">
      <ActionRow
        icon={<FileText className="w-4 h-4" />}
        label="View Request History"
        onClick={() => {
          onClose();
          onViewHistory();
        }}
      />
      <ActionRow
        icon={<Download className="w-4 h-4" />}
        label="Download Details"
        onClick={() => {
          onClose();
          onDownload();
        }}
      />
      <ActionRow
        icon={<Flag className="w-4 h-4" />}
        label="Report an Issue"
        onClick={() => {
          onClose();
          onReport();
        }}
      />
    </div>
  </BottomSheet>
);
