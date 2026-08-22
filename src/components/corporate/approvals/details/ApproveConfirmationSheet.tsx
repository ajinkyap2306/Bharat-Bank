import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { CorporateApprovalDetail } from '../../../../types/corporateApprovalDetails';

interface ApproveConfirmationSheetProps {
  isOpen: boolean;
  detail: CorporateApprovalDetail;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApproveConfirmationSheet: React.FC<ApproveConfirmationSheetProps> = ({
  isOpen,
  detail,
  onClose,
  onConfirm,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Approve Payment?">
    <div className="space-y-4">
      <div className="text-center py-2">
        <p className="text-[16px] font-semibold text-slate-900 dark:text-white">
          {detail.beneficiary?.name ?? detail.title}
        </p>
        {detail.amount !== undefined && (
          <p className="text-[22px] font-bold text-slate-900 dark:text-white tabular-nums mt-1">
            {formatPaymentCurrency(detail.amount, detail.currency)}
          </p>
        )}
      </div>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 text-center">
        You are approving this payment according to your corporate authorization.
      </p>
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold min-h-12"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12"
        >
          Approve
        </button>
      </div>
    </div>
  </BottomSheet>
);
