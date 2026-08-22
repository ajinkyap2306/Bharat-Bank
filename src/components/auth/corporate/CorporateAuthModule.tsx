import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, EyeOff, Smartphone, Fingerprint, ShieldCheck, CheckCircle2, Building2,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { CorporateAuthStep, CorporateLoginFieldError, CorporateOtpError } from '../../../types/corporateAuth';
import {
  CORPORATE_DEMO_ID,
  CORPORATE_DEMO_PASSWORD,
  CORPORATE_MASKED_MOBILE,
  CORPORATE_DEMO_ROLE,
  CORPORATE_OTP_RESEND_SECONDS,
  CORPORATE_MAX_OTP_ATTEMPTS,
  validateCorporateCredentials,
  validateCorporateOtp,
} from '../../../data/corporateAuthMock';
import {
  CorpAuthShell,
  CorpAuthTopBar,
  CorpAuthTitle,
  CorpField,
  CorpPrimaryButton,
  CorpSecondaryButton,
  CorpErrorCard,
  CorpSecurityBanner,
  CorpOtpInput,
  CorpBackButton,
} from './shared/CorporateAuthUI';

interface CorporateAuthModuleProps {
  onBack: () => void;
}

export const CorporateAuthModule: React.FC<CorporateAuthModuleProps> = ({ onBack }) => {
  const {
    login,
    addToast,
    isSessionExpired,
    clearSessionExpired,
  } = useBanking();

  const [step, setStep] = useState<CorporateAuthStep>(
    isSessionExpired ? 'session_expired' : 'login'
  );
  const [corporateId, setCorporateId] = useState(CORPORATE_DEMO_ID);
  const [password, setPassword] = useState(CORPORATE_DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<CorporateLoginFieldError>('none');
  const [loginFailed, setLoginFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<CorporateOtpError>('none');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(CORPORATE_OTP_RESEND_SECONDS);
  const [otpGeneration, setOtpGeneration] = useState(1);

  const [forgotId, setForgotId] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  const [forgotOtp, setForgotOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [progressStep, setProgressStep] = useState(0);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  useEffect(() => {
    if (step !== 'otp' && step !== 'forgot_otp') return;
    if (resendSeconds <= 0) return;
    const t = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [step, resendSeconds]);

  useEffect(() => {
    if (step !== 'auth_progress') return;
    const timers = [0, 600, 1200, 1800].map((ms, i) =>
      setTimeout(() => setProgressStep(i + 1), ms)
    );
    const done = setTimeout(() => setStep('login_success'), 2400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [step]);

  useEffect(() => {
    if (step !== 'login_success') return;
    const t = setTimeout(() => {
      clearSessionExpired();
      login('corporate');
    }, 1800);
    return () => clearTimeout(t);
  }, [step, login, clearSessionExpired]);

  const resetOtpState = useCallback(() => {
    setOtp(['', '', '', '', '', '']);
    setOtpError('none');
    setResendSeconds(CORPORATE_OTP_RESEND_SECONDS);
    setOtpGeneration((g) => g + 1);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFailed(false);
    setFieldError('none');

    if (!corporateId.trim()) {
      setFieldError('corporate_id');
      return;
    }
    if (!password) {
      setFieldError('password');
      return;
    }

    setIsSubmitting(true);
    setStep('processing');

    setTimeout(() => {
      setIsSubmitting(false);
      if (!validateCorporateCredentials(corporateId, 'C001', password)) {
        setLoginFailed(true);
        setStep('login');
        return;
      }
      resetOtpState();
      setStep('otp');
    }, 1400);
  };

  const handleVerifyOtp = () => {
    if (otpAttempts >= CORPORATE_MAX_OTP_ATTEMPTS) return;
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('invalid');
      return;
    }
    if (!validateCorporateOtp(code)) {
      const next = otpAttempts + 1;
      setOtpAttempts(next);
      setOtpError(next >= CORPORATE_MAX_OTP_ATTEMPTS ? 'max_attempts' : 'invalid');
      return;
    }
    setOtpError('none');
    setStep('device_verify');
  };

  const handleResendOtp = () => {
    if (resendSeconds > 0) return;
    resetOtpState();
    setOtpAttempts(0);
    addToast({ type: 'info', title: 'OTP Sent', message: 'A new verification code has been sent.' });
  };

  const handleForgotOtpVerify = () => {
    const code = forgotOtp.join('');
    if (code.length === 6) {
      setStep('new_password');
    } else {
      addToast({ type: 'error', title: 'Invalid Code', message: 'Please enter the 6-digit verification code.' });
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6 || newPassword !== confirmPassword) {
      addToast({ type: 'error', title: 'Password Error', message: 'Passwords must match and be at least 6 characters.' });
      return;
    }
    setStep('password_updated');
  };

  const handleBiometric = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      setProgressStep(0);
      setStep('auth_progress');
    }, 1200);
  };

  const goToLogin = () => {
    clearSessionExpired();
    setStep('login');
    setLoginFailed(false);
    setFieldError('none');
  };

  const renderContent = () => {
    switch (step) {
      case 'session_expired':
        return (
          <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center px-3">
            <div className="text-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your session has expired</h2>
              <p className="text-sm text-slate-500 mt-2">For your security, please sign in again.</p>
              <div className="mt-6">
                <CorpPrimaryButton label="Login Again" onClick={goToLogin} />
              </div>
            </div>
          </motion.div>
        );

      case 'login':
        return (
          <motion.div key="login" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
            <CorpBackButton onClick={onBack} label="Change profile" />
            <CorpAuthTitle title="Corporate Banking" subtitle="Secure access to your business banking" />
            {loginFailed && (
              <CorpErrorCard title="Unable to sign in" message="Please check your credentials and try again." />
            )}
            <form onSubmit={handleLogin} className="px-3 space-y-4 flex-1">
              <CorpField
                label="Corporate ID / User ID"
                value={corporateId}
                onChange={(v) => { setCorporateId(v); setFieldError('none'); setLoginFailed(false); }}
                placeholder={CORPORATE_DEMO_ID}
                error={fieldError === 'corporate_id' ? 'Enter your Corporate ID.' : undefined}
              />
              <CorpField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(v) => { setPassword(v); setFieldError('none'); setLoginFailed(false); }}
                placeholder="••••••••"
                error={fieldError === 'password' ? 'Enter your password.' : undefined}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 text-slate-500">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <CorpPrimaryButton type="submit" label="Login" />
              <CorpSecondaryButton label="Forgot Password?" onClick={() => setStep('forgot_id')} />
            </form>
            <CorpSecurityBanner />
          </motion.div>
        );

      case 'processing':
        return (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center px-3">
            <div className="w-14 h-14 rounded-2xl bg-congress-blue-700/10 flex items-center justify-center mb-4">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-6 h-6 border-2 border-congress-blue-700 border-t-transparent rounded-full" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Signing you in...</p>
            <p className="text-xs text-slate-500 mt-1">Verifying your credentials securely</p>
          </motion.div>
        );

      case 'otp':
        return (
          <motion.div key="otp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
            <CorpBackButton onClick={() => setStep('login')} />
            <CorpAuthTitle
              title="Verify Your Identity"
              subtitle={`Enter the verification code sent to your registered mobile number.`}
            />
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white px-3 mb-4">+91 {CORPORATE_MASKED_MOBILE}</p>
            {otpError === 'invalid' && (
              <CorpErrorCard title="Verification failed" message="The verification code is incorrect." />
            )}
            {otpError === 'expired' && (
              <CorpErrorCard title="Code expired" message="This verification code has expired." />
            )}
            {otpError === 'max_attempts' && (
              <CorpErrorCard title="Maximum attempts reached" message="Verification is temporarily restricted. Please try again later." />
            )}
            <CorpOtpInput key={otpGeneration} value={otp} onChange={setOtp} />
            <div className="px-3 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'You can resend now'}
              </span>
              <button
                type="button"
                disabled={resendSeconds > 0 || otpError === 'max_attempts'}
                onClick={handleResendOtp}
                className="font-semibold text-congress-blue-700 disabled:opacity-40"
              >
                Resend OTP
              </button>
            </div>
            {otpError === 'expired' ? (
              <div className="px-3 mt-6">
                <CorpPrimaryButton label="Send New Code" onClick={handleResendOtp} />
              </div>
            ) : (
              <div className="px-3 mt-6">
                <CorpPrimaryButton
                  label="Verify"
                  onClick={handleVerifyOtp}
                  disabled={otpError === 'max_attempts'}
                />
              </div>
            )}
          </motion.div>
        );

      case 'device_verify':
        return (
          <motion.div key="device" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col px-3">
            <CorpAuthTitle title="Verify This Device" subtitle="Review device details before continuing." />
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-congress-blue-700/10 flex items-center justify-center text-congress-blue-700">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Android Device</p>
                <p className="text-xs text-slate-500">This device</p>
                <p className="text-[10px] text-slate-500 mt-1">Last login: Today, 11:15 AM</p>
              </div>
            </div>
            <CorpPrimaryButton label="Trust This Device" onClick={() => setStep('biometric')} />
            <CorpSecondaryButton label="Continue Without Trusting" onClick={() => setStep('biometric')} />
          </motion.div>
        );

      case 'biometric':
        return (
          <motion.div key="bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center px-3 text-center">
            <CorpAuthTitle title="Use Biometric Authentication" subtitle="Sign in securely using your device biometric." />
            <button
              type="button"
              onClick={handleBiometric}
              disabled={isBiometricScanning}
              className="relative w-28 h-28 rounded-full bg-white dark:bg-slate-900 border-2 border-congress-blue-700/30 flex items-center justify-center my-6 active:scale-95 transition-transform"
            >
              {isBiometricScanning && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-congress-blue-700"
                />
              )}
              <Fingerprint className={`w-14 h-14 ${isBiometricScanning ? 'text-emerald-600' : 'text-congress-blue-700'}`} />
            </button>
            <p className="text-xs font-semibold text-slate-500 mb-6">
              {isBiometricScanning ? 'Authenticating...' : 'Tap to use biometric'}
            </p>
            <div className="w-full max-w-sm">
              <CorpPrimaryButton label="Use Biometric" onClick={handleBiometric} loading={isBiometricScanning} />
              <CorpSecondaryButton
                label="Use MPIN / Password"
                onClick={() => { setProgressStep(0); setStep('auth_progress'); }}
              />
            </div>
          </motion.div>
        );

      case 'auth_progress': {
        const steps = [
          'Credentials Verified',
          'OTP Verified',
          'Device Verified',
          'Secure Session Created',
        ];
        return (
          <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center px-6">
            <div className="space-y-4">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    progressStep > i ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-slate-200 text-slate-300'
                  }`}>
                    {progressStep > i ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  <span className={`text-sm font-semibold ${progressStep > i ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      }

      case 'login_success':
        return (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center px-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-1">Corporate Banking</p>
            <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-congress-blue-700/10 text-congress-blue-700 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" /> {CORPORATE_DEMO_ROLE}
            </span>
          </motion.div>
        );

      case 'forgot_id':
        return (
          <motion.div key="fid" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col px-3">
            <CorpBackButton onClick={() => setStep('login')} />
            <CorpAuthTitle title="Forgot Password" subtitle="Enter your Corporate ID to continue." />
            <CorpField label="Corporate ID" value={forgotId} onChange={setForgotId} placeholder={CORPORATE_DEMO_ID} />
            <div className="mt-6">
              <CorpPrimaryButton label="Continue" onClick={() => setStep('forgot_contact')} />
            </div>
          </motion.div>
        );

      case 'forgot_contact':
        return (
          <motion.div key="fcontact" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col px-3">
            <CorpBackButton onClick={() => setStep('forgot_id')} />
            <CorpAuthTitle title="Verify Identity" subtitle="Enter your registered mobile number or email." />
            <CorpField label="Registered Mobile / Email" value={forgotContact} onChange={setForgotContact} placeholder="Mobile or email" />
            <div className="mt-6">
              <CorpPrimaryButton
                label="Send Verification Code"
                onClick={() => {
                  addToast({ type: 'info', title: 'Code Sent', message: 'If your details match our records, you will receive a verification code.' });
                  setForgotOtp(['', '', '', '', '', '']);
                  setStep('forgot_otp');
                }}
              />
            </div>
          </motion.div>
        );

      case 'forgot_otp':
        return (
          <motion.div key="fotp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
            <CorpBackButton onClick={() => setStep('forgot_contact')} />
            <CorpAuthTitle title="OTP Verification" subtitle="Enter the code sent to your registered contact." />
            <CorpOtpInput value={forgotOtp} onChange={setForgotOtp} />
            <div className="px-3 mt-6">
              <CorpPrimaryButton label="Verify" onClick={handleForgotOtpVerify} />
            </div>
          </motion.div>
        );

      case 'new_password':
        return (
          <motion.div key="newpw" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col px-3">
            <CorpAuthTitle title="Create New Password" subtitle="Choose a strong password for your corporate account." />
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <CorpField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={setNewPassword}
                rightElement={
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="p-1 text-slate-500">
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <CorpField label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
              <CorpPrimaryButton type="submit" label="Update Password" />
            </form>
          </motion.div>
        );

      case 'password_updated':
        return (
          <motion.div key="pwok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center px-3 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-4" />
            <h2 className="text-lg font-bold">Password Updated</h2>
            <p className="text-sm text-slate-500 mt-2">Your password has been updated successfully.</p>
            <div className="w-full mt-6">
              <CorpPrimaryButton label="Back to Login" onClick={goToLogin} />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const showTopBar = !['processing', 'auth_progress', 'login_success'].includes(step);

  return (
    <CorpAuthShell>
      {showTopBar && (
        <CorpAuthTopBar
          onHelp={() => addToast({ type: 'info', title: 'Help', message: 'Contact corporate support at 1800-202-APEX.' })}
        />
      )}
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </CorpAuthShell>
  );
};
