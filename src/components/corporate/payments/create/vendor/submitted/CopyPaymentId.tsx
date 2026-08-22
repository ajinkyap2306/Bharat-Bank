import React, { useCallback, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyPaymentIdProps {
  paymentId: string;
  onCopied?: () => void;
}

export const CopyPaymentId: React.FC<CopyPaymentIdProps> = ({ paymentId, onCopied }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(paymentId);
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onCopied?.();
    }
  }, [paymentId, onCopied]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-10 h-10 shrink-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 focus-visible:ring-offset-2"
      aria-label={copied ? 'Payment ID copied' : `Copy payment ID ${paymentId}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
      ) : (
        <Copy className="w-4 h-4" aria-hidden />
      )}
    </button>
  );
};
