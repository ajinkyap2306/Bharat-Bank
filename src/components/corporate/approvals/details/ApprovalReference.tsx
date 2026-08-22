import React, { useCallback, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyFieldProps {
  label: string;
  value: string;
  onCopied: () => void;
}

const CopyField: React.FC<CopyFieldProps> = ({ label, value, onCopied }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onCopied();
    }
  }, [value, onCopied]);

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-200 dark:border-slate-800/80 dark:border-slate-800 last:border-0">
      <div className="min-w-0">
        <p className="text-[12px] text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-[14px] font-semibold text-slate-900 dark:text-white font-mono break-all">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="w-10 h-10 shrink-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

interface ApprovalReferenceProps {
  approvalId: string;
  paymentId?: string;
  onCopied: () => void;
}

export const ApprovalReference: React.FC<ApprovalReferenceProps> = ({
  approvalId,
  paymentId,
  onCopied,
}) => (
  <section
    className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
    aria-labelledby="approval-reference-heading"
  >
    <h2 id="approval-reference-heading" className="sr-only">
      Reference identifiers
    </h2>
    <CopyField label="Approval ID" value={approvalId} onCopied={onCopied} />
    {paymentId && <CopyField label="Payment ID" value={paymentId} onCopied={onCopied} />}
  </section>
);
