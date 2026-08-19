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
      className="w-10 h-10 shrink-0 rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 flex items-center justify-center text-[#0B5CAB] active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] focus-visible:ring-offset-2"
      aria-label={copied ? 'Payment ID copied' : `Copy payment ID ${paymentId}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#16A34A]" aria-hidden />
      ) : (
        <Copy className="w-4 h-4" aria-hidden />
      )}
    </button>
  );
};
