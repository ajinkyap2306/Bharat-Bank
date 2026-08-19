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
    !processing && (method === 'biometric' || mpin.length >= 4);

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
                  ? 'bg-[#0B5CAB] text-white'
                  : 'bg-[#F7F9FC] dark:bg-slate-800 text-[#667085] border border-[#E4E7EC] dark:border-slate-700'
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
            className="w-full py-4 rounded-2xl border-2 border-dashed border-[#0B5CAB]/30 bg-[#0B5CAB]/5 flex flex-col items-center gap-2 min-h-[100px] disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="w-8 h-8 text-[#0B5CAB] animate-spin motion-reduce:animate-none" />
            ) : (
              <Fingerprint className="w-8 h-8 text-[#0B5CAB]" />
            )}
            <span className="text-[14px] font-medium text-[#0B5CAB]">
              {processing ? 'Verifying...' : 'Tap to authenticate'}
            </span>
          </button>
        ) : (
          <>
            <NumericPinInput
              value={mpin}
              onChange={setMpin}
              length={4}
              masked
              autoFocus
              autoComplete="off"
              ariaLabel="Corporate MPIN"
            />
            <p className="text-[11px] text-center text-[#667085]">Demo MPIN: 1234</p>
          </>
        )}

        {method === 'mpin' && (
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-semibold min-h-12 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
            {processing ? 'Processing...' : 'Verify & Approve'}
          </button>
        )}
      </div>
    </BottomSheet>
  );
};
