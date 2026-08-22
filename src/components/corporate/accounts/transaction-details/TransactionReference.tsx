import React from 'react';
import { Copy } from 'lucide-react';

interface TransactionReferenceProps {
  transactionId: string;
  reference: string;
  onCopy: (value: string, label: string) => void;
}

export const TransactionReference: React.FC<TransactionReferenceProps> = ({
  transactionId,
  reference,
  onCopy,
}) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm" aria-label="Transaction Reference">
    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
      Transaction Reference
    </h2>
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] text-slate-500 dark:text-slate-400">Transaction ID</p>
          <p className="text-[14px] font-mono font-medium text-slate-900 dark:text-white mt-0.5 break-all">
            {transactionId}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(transactionId, 'Transaction ID')}
          className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
          aria-label="Copy transaction ID"
        >
          <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 dark:border-slate-800">
        <div className="min-w-0">
          <p className="text-[12px] text-slate-500 dark:text-slate-400">Reference</p>
          <p className="text-[14px] font-mono font-medium text-slate-900 dark:text-white mt-0.5">
            {reference}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(reference, 'Reference')}
          className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
          aria-label="Copy reference"
        >
          <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>
      </div>
    </div>
  </section>
);
