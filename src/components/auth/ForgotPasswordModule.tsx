import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { NumericPinInput } from '../common/NumericPinInput';
import { CORPORATE_DEMO_OTP } from '../../data/corporateAuthMock';
import { RETAIL_DEMO_AUTO_OTP } from '../../data/retailRegistrationMock';
import { isCorporateCustomerId } from '../../utils/customerId';
import {
  RegField,
  RegPrimaryButton,
  RegShell,
  RegTitle,
  RegTopBar,
} from './retail/shared/RetailRegistrationUI';

type ForgotStep = 'customer_id' | 'otp' | 'reset' | 'done';

export const ForgotPasswordModule: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotStep>('customer_id');
  const [customerId, setCustomerId] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isCorporate = isCorporateCustomerId(customerId);

  const goBack = () => {
    setError('');
    if (step === 'customer_id') {
      navigate('/');
      return;
    }
    if (step === 'otp') setStep('customer_id');
    else if (step === 'reset') setStep('otp');
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
    setTimeout(() => {
      setOtp(isCorporate ? CORPORATE_DEMO_OTP : RETAIL_DEMO_AUTO_OTP);
    }, 800);
  };

  const handleOtpContinue = () => {
    const expected = isCorporate ? CORPORATE_DEMO_OTP : RETAIL_DEMO_AUTO_OTP;
    if (otp.replace(/\s/g, '') !== expected) {
      setError('Invalid OTP. Try again.');
      return;
    }
    setError('');
    setStep('reset');
  };

  const handleResetContinue = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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
              title="Forgot Password"
              subtitle="Enter your Customer ID to reset your password."
            />
            <div className="px-4 space-y-4">
              <RegField
                label="Customer ID"
                value={customerId}
                onChange={setCustomerId}
                placeholder="RB-123456 or C001"
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
              subtitle={`Enter the code sent to your registered contact for ${customerId.trim().toUpperCase()}.`}
            />
            <div className="px-4 space-y-4">
              <NumericPinInput value={otp} onChange={setOtp} length={6} autoFocus ariaLabel="OTP" />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Verify" onClick={handleOtpContinue} />
            </div>
          </>
        );

      case 'reset':
        return (
          <>
            <RegTitle title="Set New Password" subtitle="Choose a new password for your account." />
            <div className="px-4 space-y-4">
              <RegField
                label="New Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Minimum 6 characters"
              />
              <RegField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter password"
              />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Reset Password" onClick={handleResetContinue} />
            </div>
          </>
        );

      case 'done':
        return (
          <div className="px-4 flex flex-col items-center text-center pt-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-4" />
            <h1 className="text-2xl font-extrabold">Password Updated</h1>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              Your password has been reset. Sign in with Customer ID{' '}
              <span className="font-mono font-bold">{customerId.trim().toUpperCase()}</span>.
            </p>
            <div className="w-full mt-8">
              <RegPrimaryButton label="Back to Login" onClick={() => navigate('/')} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <RegShell>
      {step !== 'done' && <RegTopBar onBack={goBack} title="Forgot Password" />}
      {renderStep()}
    </RegShell>
  );
};
