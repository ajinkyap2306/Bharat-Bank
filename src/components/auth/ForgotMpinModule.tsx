import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { NumericPinInput } from '../common/NumericPinInput';
import { RETAIL_DEMO_AUTO_OTP } from '../../data/retailRegistrationMock';
import {
  RegField,
  RegPrimaryButton,
  RegShell,
  RegTitle,
  RegTopBar,
} from './retail/shared/RetailRegistrationUI';

type ForgotMpinStep = 'customer_id' | 'otp' | 'set_mpin' | 'done';

export const ForgotMpinModule: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotMpinStep>('customer_id');
  const [customerId, setCustomerId] = useState('');
  const [otp, setOtp] = useState('');
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [error, setError] = useState('');

  const goBack = () => {
    setError('');
    if (step === 'customer_id') {
      navigate('/');
      return;
    }
    if (step === 'otp') setStep('customer_id');
    else if (step === 'set_mpin') setStep('otp');
    else navigate('/');
  };

  const handleCustomerIdContinue = () => {
    if (!customerId.trim()) {
      setError('Enter your Customer ID.');
      return;
    }
    setError('');
    setOtp('');
    setStep('otp');
    setTimeout(() => setOtp(RETAIL_DEMO_AUTO_OTP), 800);
  };

  const handleOtpContinue = () => {
    if (otp.replace(/\s/g, '') !== RETAIL_DEMO_AUTO_OTP) {
      setError('Invalid OTP. Try again.');
      return;
    }
    setError('');
    setMpin('');
    setConfirmMpin('');
    setStep('set_mpin');
  };

  const handleMpinContinue = () => {
    if (mpin.length !== 6) {
      setError('MPIN must be 6 digits.');
      return;
    }
    if (mpin !== confirmMpin) {
      setError('MPIN and confirmation do not match.');
      return;
    }
    setError('');
    setStep('done');
  };

  const renderStep = () => {
    switch (step) {
      case 'customer_id':
        return (
          <>
            <RegTitle
              title="Forgot MPIN"
              subtitle="Verify your identity to reset your 6-digit Mobile Banking MPIN."
            />
            <div className="px-4 space-y-4">
              <RegField
                label="Customer ID"
                value={customerId}
                onChange={setCustomerId}
                placeholder="RB-123456"
                hint="Demo: RB-123456"
              />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Continue" onClick={handleCustomerIdContinue} />
            </div>
          </>
        );

      case 'otp':
        return (
          <>
            <RegTitle
              title="Verify OTP"
              subtitle="A 6-digit OTP has been sent to your registered mobile number."
            />
            <div className="px-4 space-y-4">
              <NumericPinInput value={otp} onChange={setOtp} autoFocus ariaLabel="OTP" />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Verify OTP" onClick={handleOtpContinue} />
            </div>
          </>
        );

      case 'set_mpin':
        return (
          <>
            <RegTitle title="Set New MPIN" subtitle="Choose a new 6-digit MPIN for login and transactions." />
            <div className="px-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">New MPIN</p>
                <NumericPinInput value={mpin} onChange={setMpin} length={6} ariaLabel="New MPIN" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm MPIN</p>
                <NumericPinInput value={confirmMpin} onChange={setConfirmMpin} length={6} ariaLabel="Confirm MPIN" />
              </div>
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <p className="text-[11px] text-amber-700 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-2">
                Demo: A 30-minute cooling period applies on transfers above ₹50,000 after MPIN reset.
              </p>
              <RegPrimaryButton label="Reset MPIN" onClick={handleMpinContinue} />
            </div>
          </>
        );

      case 'done':
        return (
          <div className="px-4 flex flex-col items-center text-center pt-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-xl font-extrabold">MPIN Reset Successful</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              Your new MPIN is active. Sign in with your Customer ID and password, then use the new MPIN when prompted.
            </p>
            <div className="w-full mt-8">
              <RegPrimaryButton label="Back to Login" onClick={() => navigate('/')} />
            </div>
          </div>
        );
    }
  };

  return (
    <RegShell>
      {step !== 'done' && <RegTopBar onBack={goBack} title="Forgot MPIN" />}
      <div className="flex-1 py-2">{renderStep()}</div>
    </RegShell>
  );
};
