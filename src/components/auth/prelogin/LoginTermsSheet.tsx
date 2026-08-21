import React, { useState } from 'react';
import { BottomSheet } from '../../common/BottomSheet';
import {
  RETAIL_MOBILE_BANKING_TERMS,
  RETAIL_PRIVACY_TEXT,
  RETAIL_TERMS_TEXT,
} from '../../../data/retailRegistrationMock';

interface LoginTermsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const LoginTermsSheet: React.FC<LoginTermsSheetProps> = ({ isOpen, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = () => {
    if (!accepted) {
      setError('Please accept the Terms & Conditions to continue.');
      return;
    }
    setError('');
    setAccepted(false);
    onAccept();
  };

  const handleClose = () => {
    setAccepted(false);
    setError('');
    onClose();
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="Terms & Conditions"
        subtitle="Please read and accept to sign in to Mobile Banking"
      >
        <div className="space-y-4 pb-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-3 max-h-[38vh] overflow-y-auto">
            <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
              {RETAIL_TERMS_TEXT}
            </pre>
            <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              {RETAIL_MOBILE_BANKING_TERMS}
            </pre>
          </div>
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400"
          >
            View Privacy Policy
          </button>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setError('');
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              I have read, understood, and agree to the Terms & Conditions and Privacy Policy of Bharat
              Co-operative Bank (Mumbai) Ltd.
            </span>
          </label>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <button
            type="button"
            onClick={handleAccept}
            disabled={!accepted}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl"
          >
            Accept & Sign In
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 text-sm font-semibold text-slate-500"
          >
            Cancel
          </button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed pb-2 max-h-[50vh] overflow-y-auto">
          {RETAIL_PRIVACY_TEXT}
        </pre>
      </BottomSheet>
    </>
  );
};
