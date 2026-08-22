import React, { useCallback, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { CorporateApprovalResultData } from '../../../../types/corporateApprovalResult';

interface RequestSummaryProps {
  data: CorporateApprovalResultData;
  onPaymentIdCopied: () => void;
}

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div className="flex justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800 last:border-0">
    <dt className="text-[13px] text-slate-500 dark:text-slate-400">{label}</dt>
    <dd
      className={`text-[13px] font-medium text-slate-900 dark:text-white text-right ${
        mono ? 'font-mono' : ''
      }`}
    >
      {value}
    </dd>
  </div>
);

export const RequestSummary: React.FC<RequestSummaryProps> = ({
  data,
  onPaymentIdCopied,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!data.paymentId) return;
    try {
      await navigator.clipboard.writeText(data.paymentId);
      setCopied(true);
      onPaymentIdCopied();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onPaymentIdCopied();
    }
  }, [data.paymentId, onPaymentIdCopied]);

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
      <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-2">
        Request Summary
      </h2>
      <dl>
        <Row label="Request Type" value={data.requestType} />
        <Row label="Beneficiary" value={data.beneficiary} />
        {data.amount !== undefined && (
          <Row
            label="Amount"
            value={formatPaymentCurrency(data.amount, data.currency)}
          />
        )}
        {data.paymentId && (
          <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800">
            <dt className="text-[13px] text-slate-500 dark:text-slate-400">Payment ID</dt>
            <dd className="flex items-center gap-2">
              <span className="text-[13px] font-mono font-medium text-slate-900 dark:text-white">
                {data.paymentId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400"
                aria-label="Copy payment ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </dd>
          </div>
        )}
        <Row label="Approval ID" value={data.approvalId} mono />
      </dl>
    </section>
  );
};
