import React, { useState } from 'react';
import { Fingerprint, Loader2 } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';
import { NumericPinInput } from '../../../common/NumericPinInput';

interface ApprovalAuthenticationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  processing?: boolean;
}

export const ApprovalAuthenticationSheet: React.FC<ApprovalAuthenticationSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  processing = false,
}) => {
  const [method, setMethod] = useState<'biometric' | 'mpin'>('biometric');
  const [mpin, setMpin] = useState('');

  const canConfirm =
    !processing && (method === 'biometric' || mpin.length >= 6);

  const handleClose = () => {
    setMpin('');
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Authentication Required"
      subtitle="Verify your identity to complete this approval."
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['biometric', 'mpin'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold min-h-11 capitalize ${
                method === m
                  ? 'bg-congress-blue-700 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {m === 'biometric' ? 'Biometric' : 'MPIN'}
            </button>
          ))}
        </div>

        {method === 'biometric' ? (
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-congress-blue-700/30 bg-congress-blue-700/5 flex flex-col items-center gap-2 min-h-[100px] disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="w-8 h-8 text-congress-blue-700 dark:text-congress-blue-400 animate-spin motion-reduce:animate-none" />
            ) : (
              <Fingerprint className="w-8 h-8 text-congress-blue-700 dark:text-congress-blue-400" />
            )}
            <span className="text-[14px] font-medium text-congress-blue-700 dark:text-congress-blue-400">
              {processing ? 'Verifying...' : 'Tap to authenticate'}
            </span>
          </button>
        ) : (
          <>
            <NumericPinInput
              value={mpin}
              onChange={setMpin}
              length={6}
              masked
              autoFocus
              autoComplete="off"
              ariaLabel="Corporate MPIN"
            />
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">Demo MPIN: 123456</p>
          </>
        )}

        {method === 'mpin' && (
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
            {processing ? 'Processing...' : 'Verify & Approve'}
          </button>
        )}
      </div>
    </BottomSheet>
  );
};
