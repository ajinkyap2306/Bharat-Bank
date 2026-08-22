import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';

interface SubmitConfirmationSheetProps {
  isOpen: boolean;
  data: BulkBatchReview;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SubmitConfirmationSheet: React.FC<SubmitConfirmationSheetProps> = ({
  isOpen,
  data,
  loading,
  onClose,
  onConfirm,
}) => (
  <BottomSheet
    isOpen={isOpen}
    onClose={loading ? () => {} : onClose}
    title="Submit Bulk Payment?"
    subtitle="Review before confirming"
  >
    <div className="px-4 pb-6 space-y-4">
      <dl className="space-y-2 text-[13px] rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 p-4">
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Payments</dt>
          <dd className="font-bold">{data.validCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
          <dd className="font-bold">{formatPaymentCurrency(data.totalAmount)}</dd>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">Total Debit</dt>
          <dd className="font-bold text-slate-900 dark:text-white">
            {formatPaymentCurrency(data.totalDebit)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500 dark:text-slate-400">Approval</dt>
          <dd className="font-semibold text-congress-blue-700 dark:text-congress-blue-400">{data.approvalLabel}</dd>
        </div>
      </dl>
      <p className="text-[12px] text-slate-500 dark:text-slate-400">
        Once submitted, the batch cannot be edited unless returned for changes.
      </p>
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 font-semibold min-h-12 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold min-h-12 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit for Approval'}
      </button>
    </div>
  </BottomSheet>
);
