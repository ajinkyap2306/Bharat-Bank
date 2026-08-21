import React, { useState } from 'react';
import {
  RETAIL_MOBILE_BANKING_TERMS,
  RETAIL_PRIVACY_TEXT,
  RETAIL_TERMS_TEXT,
} from '../../../data/retailRegistrationMock';
import { BottomSheet } from '../../common/BottomSheet';
import { RegPrimaryButton, RegStickyFooter, RegTextButton, RegTitle } from './shared/RetailRegistrationUI';

interface RegistrationTermsStepProps {
  onContinue: () => void;
}

export const RegistrationTermsStep: React.FC<RegistrationTermsStepProps> = ({ onContinue }) => {
  const [accepted, setAccepted] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!accepted) {
      setError('Please accept the Terms & Conditions to continue registration.');
      return;
    }
    setError('');
    onContinue();
  };

  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto">
          <RegTitle
            title="Terms & Conditions"
            subtitle="Please read and accept to register for Mobile Banking."
          />
          <div className="px-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-3 max-h-[42vh] overflow-y-auto">
              <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">
                {RETAIL_TERMS_TEXT}
              </pre>
              <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                {RETAIL_MOBILE_BANKING_TERMS}
              </pre>
            </div>
            <RegTextButton
              label="View Privacy Policy"
              onClick={() => setShowPrivacy(true)}
              className="text-left"
            />
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
                I have read, understood, and agree to the Terms & Conditions and Privacy Policy of
                Bharat Co-operative Bank (Mumbai) Ltd.
              </span>
            </label>
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          </div>
        </div>
        <RegStickyFooter>
          <RegPrimaryButton label="Accept & Continue" disabled={!accepted} onClick={handleContinue} />
        </RegStickyFooter>
      </div>

      <BottomSheet isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <pre className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans leading-relaxed pb-2 max-h-[50vh] overflow-y-auto">
          {RETAIL_PRIVACY_TEXT}
        </pre>
      </BottomSheet>
    </>
  );
};
