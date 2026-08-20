import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { NumericPinInput } from '../../common/NumericPinInput';
import {
  CORPORATE_REG_DEMO_COMPANY_ID,
  CORPORATE_REG_DEMO_GSTIN,
  CORPORATE_REG_DEMO_OTP,
  generateCorporateUserId,
  validateCorporateCompanyAuth,
} from '../../../data/corporateRegistrationMock';
import {
  RegField,
  RegPrimaryButton,
  RegShell,
  RegTitle,
  RegTopBar,
} from '../retail/shared/RetailRegistrationUI';

type CorpRegStep = 'company' | 'otp' | 'user_id' | 'password' | 'complete';

export const CorporateRegistrationModule: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, setBankingType, setAuthScreen } = useBanking();

  const [step, setStep] = useState<CorpRegStep>('company');
  const [companyId, setCompanyId] = useState('');
  const [gstin, setGstin] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setBankingType('corporate');
  }, [setBankingType]);

  const goBack = () => {
    setError('');
    switch (step) {
      case 'company':
        navigate('/');
        break;
      case 'otp':
        setStep('company');
        break;
      case 'user_id':
        setStep('otp');
        break;
      case 'password':
        setStep('user_id');
        break;
      default:
        navigate('/');
    }
  };

  const handleCompanyContinue = () => {
    const err = validateCorporateCompanyAuth(companyId, gstin);
    if (err) {
      setError(err);
      return;
    }
    if (!adminName.trim()) {
      setError('Enter the administrator name.');
      return;
    }
    if (!adminEmail.trim()) {
      setError('Enter the administrator email.');
      return;
    }
    setError('');
    setOtp('');
    setStep('otp');
    setTimeout(() => {
      setOtp(CORPORATE_REG_DEMO_OTP);
      addToast({
        type: 'success',
        title: 'OTP auto-captured',
        message: 'Verification code received on registered contact.',
      });
    }, 900);
  };

  const handleOtpContinue = () => {
    if (otp.replace(/\s/g, '') !== CORPORATE_REG_DEMO_OTP) {
      setError('Enter the 6-digit OTP sent to your registered contact.');
      return;
    }
    setError('');
    setAssignedUserId(generateCorporateUserId());
    setStep('user_id');
  };

  const handleUserIdContinue = () => {
    setError('');
    setStep('password');
  };

  const handlePasswordContinue = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setStep('complete');
  };

  const handleGoToLogin = () => {
    setAuthScreen('login');
    navigate('/', { state: { customerId: assignedUserId } });
  };

  const renderStep = () => {
    switch (step) {
      case 'company':
        return (
          <>
            <RegTitle
              title="Corporate Registration"
              subtitle="Verify your company details to register for Corporate Internet Banking."
            />
            <div className="px-4 space-y-4">
              <RegField
                label="Corporate ID"
                value={companyId}
                onChange={setCompanyId}
                placeholder={CORPORATE_REG_DEMO_COMPANY_ID}
                hint={`Demo: ${CORPORATE_REG_DEMO_COMPANY_ID}`}
              />
              <RegField
                label="GSTIN"
                value={gstin}
                onChange={setGstin}
                placeholder={CORPORATE_REG_DEMO_GSTIN}
                hint={`Demo: ${CORPORATE_REG_DEMO_GSTIN}`}
              />
              <RegField
                label="Administrator Name"
                value={adminName}
                onChange={setAdminName}
                placeholder="Rahul Sharma"
              />
              <RegField
                label="Administrator Email"
                value={adminEmail}
                onChange={setAdminEmail}
                placeholder="admin@company.in"
              />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Continue" onClick={handleCompanyContinue} />
            </div>
          </>
        );

      case 'otp':
        return (
          <>
            <RegTitle
              title="OTP Verification"
              subtitle="Enter the code sent to your registered mobile or email."
            />
            <div className="px-4 space-y-4">
              <NumericPinInput
                value={otp}
                onChange={setOtp}
                length={6}
                autoFocus
                ariaLabel="6-digit OTP"
              />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Verify OTP" onClick={handleOtpContinue} />
            </div>
          </>
        );

      case 'user_id':
        return (
          <>
            <RegTitle
              title="Your Corporate User ID"
              subtitle="Save this Customer ID — you will use it to sign in to Corporate Banking."
            />
            <div className="px-4 space-y-4">
              <div className="rounded-2xl border-2 border-teal-500 bg-teal-50/80 dark:bg-teal-950/30 p-5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wide text-teal-700 dark:text-teal-400">
                  Assigned Customer ID (C)
                </p>
                <p className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white mt-2">
                  {assignedUserId}
                </p>
              </div>
              <RegPrimaryButton label="Continue" onClick={handleUserIdContinue} />
            </div>
          </>
        );

      case 'password':
        return (
          <>
            <RegTitle title="Set Password" subtitle="Create a secure password for your corporate account." />
            <div className="px-4 space-y-4">
              <RegField
                label="Password"
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
              <RegPrimaryButton label="Complete Registration" onClick={handlePasswordContinue} />
            </div>
          </>
        );

      case 'complete':
        return (
          <div className="px-4 flex flex-col items-center text-center pt-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-4" />
            <h1 className="text-2xl font-extrabold">Registration Complete</h1>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              Your Corporate Banking profile is ready. Sign in with Customer ID{' '}
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{assignedUserId}</span>.
            </p>
            <div className="w-full mt-8">
              <RegPrimaryButton label="Go to Login" onClick={handleGoToLogin} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <RegShell>
      {step !== 'complete' && <RegTopBar onBack={goBack} title="Corporate Registration" />}
      {renderStep()}
    </RegShell>
  );
};
