import React, { useState } from 'react';
import { Fingerprint, Loader2 } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { AuthMethod } from '../../../../types/corporateAccountPreferences';

interface AuthenticationSheetProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  isVerifying?: boolean;
  onClose: () => void;
  onVerify: (method: AuthMethod, code?: string) => void;
}

export const AuthenticationSheet: React.FC<AuthenticationSheetProps> = ({
  isOpen,
  title = 'Authenticate',
  subtitle = 'Verify your identity to confirm this preference change.',
  isVerifying,
  onClose,
  onVerify,
}) => {
  const [method, setMethod] = useState<AuthMethod>('mpin');
  const [mpin, setMpin] = useState('');

  const handleClose = () => {
    setMpin('');
    setMethod('mpin');
    onClose();
  };

  const canSubmit = method === 'biometric' || mpin.length >= 6;

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title={title} subtitle={subtitle}>
      <div className="space-y-4 pb-2">
        <div className="flex gap-2">
          {(['mpin', 'biometric'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize min-h-11 ${
                method === m
                  ? 'bg-congress-blue-700 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {m === 'mpin' ? 'MPIN' : 'Biometric'}
            </button>
          ))}
        </div>

        {method === 'mpin' ? (
          <div>
            <label htmlFor="pref-auth-mpin" className="sr-only">
              Enter MPIN
            </label>
            <input
              id="pref-auth-mpin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={mpin}
              onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit MPIN"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-lg tracking-widest font-mono min-h-12"
              autoComplete="off"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">Demo MPIN: 123456</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onVerify('biometric')}
            disabled={isVerifying}
            className="w-full py-4 rounded-2xl border border-dashed border-congress-blue-700/40 flex flex-col items-center gap-2 min-h-22"
          >
            {isVerifying ? (
              <Loader2 className="w-8 h-8 text-congress-blue-700 dark:text-congress-blue-400 animate-spin" aria-hidden />
            ) : (
              <Fingerprint className="w-8 h-8 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
            )}
            <span className="text-sm font-semibold text-congress-blue-700 dark:text-congress-blue-400">
              {isVerifying ? 'Verifying...' : 'Use Biometric Authentication'}
            </span>
          </button>
        )}

        {method === 'mpin' && (
          <button
            type="button"
            onClick={() => onVerify('mpin', mpin)}
            disabled={!canSubmit || isVerifying}
            className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isVerifying && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            {isVerifying ? 'Verifying...' : 'Authenticate'}
          </button>
        )}
      </div>
    </BottomSheet>
  );
};
