import React from 'react';
import { Download, Share2, FileText } from 'lucide-react';
import { BottomSheet } from '../../../../../common/BottomSheet';

interface ConfirmationActionsProps {
  showMoreSheet: boolean;
  onCloseMore: () => void;
  onDownload: () => void;
  onShare: () => void;
  onViewPaymentDetails: () => void;
  onViewPaymentDetailsSecondary?: () => void;
  onCancelPayment?: () => void;
  showCancel?: boolean;
  showViewTransaction?: boolean;
  onViewTransaction?: () => void;
  onDownloadReceipt?: () => void;
  onCreateNewPayment?: () => void;
  showCreateNew?: boolean;
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}> = ({ icon, label, onClick, destructive }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl min-h-11 text-left active:bg-slate-50 dark:active:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2 ${
      destructive ? 'text-[#DC2626]' : 'text-[#111827] dark:text-white'
    }`}
  >
    <span className="w-9 h-9 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 flex items-center justify-center shrink-0">
      {icon}
    </span>
    <span className="text-[15px] font-medium">{label}</span>
  </button>
);

export const ConfirmationActions: React.FC<ConfirmationActionsProps> = ({
  showMoreSheet,
  onCloseMore,
  onDownload,
  onShare,
  onViewPaymentDetails,
  onViewPaymentDetailsSecondary,
  onCancelPayment,
  showCancel = false,
  showViewTransaction = false,
  onViewTransaction,
  onDownloadReceipt,
  onCreateNewPayment,
  showCreateNew = false,
}) => (
  <>
    <div className="mx-4 space-y-2">
      {showViewTransaction && onViewTransaction && (
        <button
          type="button"
          onClick={onViewTransaction}
          className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-[15px] font-semibold min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
        >
          View Transaction
        </button>
      )}
      {onViewPaymentDetailsSecondary && (
        <button
          type="button"
          onClick={onViewPaymentDetailsSecondary}
          className={`w-full py-3.5 rounded-2xl text-[15px] font-semibold min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2 ${
            showViewTransaction
              ? 'bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-700 text-[#0B5CAB]'
              : 'bg-[#0B5CAB] text-white'
          }`}
        >
          View Payment Details
        </button>
      )}
      {!showViewTransaction && !onViewPaymentDetailsSecondary && (
        <button
          type="button"
          onClick={onViewPaymentDetails}
          className="w-full py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-700 text-[#0B5CAB] text-[15px] font-semibold min-h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
        >
          View Payment Details
        </button>
      )}
      {showCreateNew && onCreateNewPayment && (
        <button
          type="button"
          onClick={onCreateNewPayment}
          className="w-full py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-700 text-[#0B5CAB] text-[15px] font-semibold min-h-12"
        >
          Create New Payment
        </button>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-700 text-[#111827] dark:text-white text-[14px] font-medium min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
        >
          <Download className="w-4 h-4" aria-hidden />
          {showViewTransaction ? 'Download Receipt' : 'Download Confirmation'}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-700 text-[#111827] dark:text-white text-[14px] font-medium min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
        >
          <Share2 className="w-4 h-4" aria-hidden />
          Share
        </button>
      </div>
      {showCancel && onCancelPayment && (
        <button
          type="button"
          onClick={onCancelPayment}
          className="w-full py-3 text-[14px] font-medium text-[#DC2626] min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2"
        >
          Cancel Payment
        </button>
      )}
    </div>

    <BottomSheet isOpen={showMoreSheet} onClose={onCloseMore} title="More options">
      <div className="px-2 pb-6">
        <ActionButton
          icon={<Download className="w-4 h-4 text-[#0B5CAB]" />}
          label={showViewTransaction ? 'Download Receipt' : 'Download Confirmation'}
          onClick={() => {
            onCloseMore();
            if (showViewTransaction && onDownloadReceipt) {
              onDownloadReceipt();
            } else {
              onDownload();
            }
          }}
        />
        <ActionButton
          icon={<Share2 className="w-4 h-4 text-[#0B5CAB]" />}
          label="Share Confirmation"
          onClick={() => {
            onCloseMore();
            onShare();
          }}
        />
        <ActionButton
          icon={<FileText className="w-4 h-4 text-[#0B5CAB]" />}
          label="View Payment Details"
          onClick={() => {
            onCloseMore();
            onViewPaymentDetails();
          }}
        />
        {showCancel && onCancelPayment && (
          <ActionButton
            icon={<FileText className="w-4 h-4 text-[#DC2626]" />}
            label="Cancel Payment"
            onClick={() => {
              onCloseMore();
              onCancelPayment();
            }}
            destructive
          />
        )}
      </div>
    </BottomSheet>
  </>
);
