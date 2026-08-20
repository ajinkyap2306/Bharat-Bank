import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Fingerprint,
  Loader2,
  Smartphone,
  XCircle,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { RetailRegistrationDraft, RetailRegistrationStep } from '../../../types/retailRegistration';
import {
  RETAIL_DEMO_CUSTOMER_ID,
  RETAIL_DEMO_DOB,
  RETAIL_DEMO_REGISTERED_MOBILE,
  formatDobInput,
  getPasswordRuleStatus,
  maskRegisteredMobile,
  simulateSimVerification,
  validateCustomerVerification,
  validateLoginCredentials,
} from '../../../data/retailRegistrationMock';
import { playPaymentSuccessSound } from '../../../utils/paymentSuccessFeedback';
import {
  MpinInput,
  RegField,
  RegPrimaryButton,
  RegSecondaryButton,
  RegShell,
  RegTitle,
  RegTopBar,
} from './shared/RetailRegistrationUI';

const INITIAL_DRAFT: RetailRegistrationDraft = {
  registeredMobile: RETAIL_DEMO_REGISTERED_MOBILE,
  simVerified: false,
  customerId: '',
  dateOfBirth: '',
  userId: '',
  password: '',
  confirmPassword: '',
  profileCode: 'P1',
  mpin: '',
  biometricEnabled: false,
};

const MASKED_MOBILE = maskRegisteredMobile(RETAIL_DEMO_REGISTERED_MOBILE);

const PasswordRuleItem: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <div className="flex items-center gap-2 text-xs">
    <CheckCircle2 className={`w-4 h-4 shrink-0 ${ok ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
    <span className={ok ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}>{label}</span>
  </div>
);

export const RetailRegistrationModule: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, completeRetailRegistration, setBankingType, setAuthScreen } = useBanking();

  const [step, setStep] = useState<RetailRegistrationStep>('activate');
  const [draft, setDraft] = useState<RetailRegistrationDraft>(INITIAL_DRAFT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoSimMismatch, setDemoSimMismatch] = useState(false);

  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const successSoundPlayed = useRef(false);

  useEffect(() => {
    setBankingType('retail');
  }, [setBankingType]);

  useEffect(() => {
    if (step !== 'sim_processing') return;

    let cancelled = false;
    simulateSimVerification(demoSimMismatch).then(({ success }) => {
      if (cancelled) return;
      if (success) {
        setDraft((d) => ({ ...d, simVerified: true }));
        setStep('sim_success');
        setDemoSimMismatch(false);
      } else {
        setStep('sim_failed');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [step, demoSimMismatch]);

  useEffect(() => {
    if (step !== 'complete' || successSoundPlayed.current) return;
    playPaymentSuccessSound();
    successSoundPlayed.current = true;
  }, [step]);

  const goBack = useCallback(() => {
    setError('');
    switch (step) {
      case 'activate':
        navigate('/');
        break;
      case 'sim_verify':
        setStep('activate');
        break;
      case 'sim_success':
        setStep('sim_verify');
        break;
      case 'sim_failed':
        setStep('sim_verify');
        break;
      case 'customer_verify':
        setStep('sim_success');
        break;
      case 'credentials':
        setStep('customer_verify');
        break;
      case 'mpin':
        setStep('credentials');
        break;
      case 'biometric':
        setStep('mpin');
        break;
      default:
        navigate('/');
    }
  }, [step, navigate]);

  const handleVerifySim = () => {
    setError('');
    setStep('sim_processing');
  };

  const handleCustomerContinue = () => {
    const err = validateCustomerVerification(draft.customerId, draft.dateOfBirth);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep('credentials');
  };

  const handleCredentialsContinue = () => {
    const err = validateLoginCredentials(draft.userId, draft.password, draft.confirmPassword);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep('mpin');
  };

  const handleMpinContinue = () => {
    if (draft.mpin.length !== 6) {
      setMpinError('MPIN must be 6 digits.');
      return;
    }
    if (draft.mpin !== confirmMpin) {
      setMpinError('MPINs do not match.');
      return;
    }
    setMpinError('');
    setStep('biometric');
  };

  const finishRegistration = () => {
    completeRetailRegistration({
      userId: draft.userId.trim(),
      profileCode: draft.profileCode,
      mpinSet: draft.mpin.length === 6,
      biometricEnabled: draft.biometricEnabled,
      method: 'sim_verify',
    });
    setStep('complete');
  };

  const handleBiometricEnable = () => {
    setDraft((d) => ({ ...d, biometricEnabled: true }));
    addToast({ type: 'success', title: 'Biometric enabled', message: 'Fingerprint login is now available.' });
    finishRegistration();
  };

  const handleBiometricSkip = () => {
    setDraft((d) => ({ ...d, biometricEnabled: false }));
    finishRegistration();
  };

  const handleGoToLogin = () => {
    setAuthScreen('login');
    navigate('/', { state: { customerId: draft.userId.trim() } });
  };

  const passwordRules = getPasswordRuleStatus(draft.password);

  const renderStep = () => {
    switch (step) {
      case 'activate':
        return (
          <div className="px-4 flex flex-col flex-1">
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center mb-6">
                <Smartphone className="w-10 h-10 text-blue-600" />
              </div>
              <RegTitle
                title="Register / Activate Mobile Banking"
                subtitle="Secure banking, anytime anywhere."
              />
            </div>
            <div className="space-y-2 pb-4">
              <RegPrimaryButton label="Continue" onClick={() => setStep('sim_verify')} />
              <RegSecondaryButton label="Login" onClick={() => navigate('/')} />
            </div>
          </div>
        );

      case 'sim_verify':
        return (
          <>
            <RegTitle
              title="Verify Your SIM"
              subtitle="We need to verify the mobile number registered with your bank account."
            />
            <div className="px-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Make sure:</p>
                {[
                  'Your registered SIM is inserted',
                  'Mobile network is available',
                  'SMS permission is enabled',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Registered Mobile Number</p>
                <p className="text-lg font-bold tracking-wide">{MASKED_MOBILE}</p>
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <RegPrimaryButton label="Verify SIM" onClick={handleVerifySim} />

              <button
                type="button"
                onClick={() => setDemoSimMismatch(true)}
                className="text-[10px] text-slate-400 hover:text-slate-600 w-full text-center"
              >
                Demo: simulate SIM mismatch
              </button>
            </div>
          </>
        );

      case 'sim_processing':
        return (
          <div className="px-4 py-12 text-center flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
            <RegTitle
              title="Identifying SIM…"
              subtitle="Verifying your registered mobile number securely."
            />
            <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-950 border-t-blue-600 animate-spin mt-4" />
          </div>
        );

      case 'sim_success':
        return (
          <div className="px-4 py-8 text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <RegTitle
                title="SIM Verified"
                subtitle="Your registered mobile number has been verified successfully."
              />
              <p className="text-lg font-bold tracking-wide text-blue-600 mb-6">{MASKED_MOBILE}</p>
              <RegPrimaryButton label="Continue" onClick={() => setStep('customer_verify')} />
            </motion.div>
          </div>
        );

      case 'sim_failed':
        return (
          <div className="px-4 py-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <RegTitle
              title="SIM Verification Failed"
              subtitle="The SIM in this device does not match the mobile number registered with your bank account."
            />
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
              Please insert your registered SIM and try again.
            </p>
            <RegPrimaryButton
              label="Try Again"
              onClick={() => {
                setDemoSimMismatch(false);
                setStep('sim_verify');
              }}
            />
          </div>
        );

      case 'customer_verify':
        return (
          <>
            <RegTitle title="Verify Your Account" subtitle="Enter your details" />
            <div className="px-4 space-y-4">
              <RegField
                label="Customer ID"
                value={draft.customerId}
                onChange={(v) => setDraft((d) => ({ ...d, customerId: v.replace(/\D/g, '').slice(0, 12) }))}
                placeholder="2847193"
                inputMode="numeric"
                hint={`Demo: ${RETAIL_DEMO_CUSTOMER_ID}`}
              />
              <RegField
                label="Date of Birth"
                value={draft.dateOfBirth}
                onChange={(v) => setDraft((d) => ({ ...d, dateOfBirth: formatDobInput(v) }))}
                placeholder="DD / MM / YYYY"
                inputMode="numeric"
                hint={`Demo: ${RETAIL_DEMO_DOB}`}
              />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Continue" onClick={handleCustomerContinue} />
            </div>
          </>
        );

      case 'credentials':
        return (
          <>
            <RegTitle title="Create Login Credentials" subtitle="Set your User ID and password for Mobile Banking." />
            <div className="px-4 space-y-4">
              <RegField
                label="User ID"
                value={draft.userId}
                onChange={(v) => setDraft((d) => ({ ...d, userId: v.slice(0, 20) }))}
                placeholder="dheeraj123"
                hint="4–20 characters · letters, numbers, dots, hyphens"
              />
              <RegField
                label="Password"
                type="password"
                value={draft.password}
                onChange={(v) => setDraft((d) => ({ ...d, password: v.slice(0, 20) }))}
                placeholder="•••••••••"
              />
              <RegField
                label="Confirm Password"
                type="password"
                value={draft.confirmPassword}
                onChange={(v) => setDraft((d) => ({ ...d, confirmPassword: v.slice(0, 20) }))}
                placeholder="•••••••••"
              />
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2">
                <PasswordRuleItem ok={passwordRules.length} label="8–20 characters" />
                <PasswordRuleItem ok={passwordRules.upperLower} label="Uppercase & lowercase" />
                <PasswordRuleItem ok={passwordRules.number} label="Number" />
                <PasswordRuleItem ok={passwordRules.special} label="Special character" />
              </div>
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Continue" onClick={handleCredentialsContinue} />
            </div>
          </>
        );

      case 'mpin':
        return (
          <>
            <RegTitle title="Set MPIN" subtitle="Create your 6-digit MPIN for secure transactions and login." />
            <div className="px-4 space-y-6">
              <MpinInput
                label="Create your 6-digit MPIN"
                value={draft.mpin}
                onChange={(v) => {
                  setDraft((d) => ({ ...d, mpin: v }));
                  setMpinError('');
                }}
              />
              <MpinInput
                label="Confirm MPIN"
                value={confirmMpin}
                onChange={(v) => {
                  setConfirmMpin(v);
                  setMpinError('');
                }}
                error={mpinError}
              />
              <RegPrimaryButton label="Continue" onClick={handleMpinContinue} />
            </div>
          </>
        );

      case 'biometric':
        return (
          <div className="px-4 py-6 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center mb-4">
              <Fingerprint className="w-10 h-10 text-blue-600" />
            </div>
            <RegTitle
              title="Enable Biometric Login"
              subtitle="Use fingerprint or face recognition to securely access your banking app."
            />
            <div className="w-full max-w-sm space-y-2 mt-4">
              <RegPrimaryButton label="Enable Biometric" onClick={handleBiometricEnable} />
              <RegSecondaryButton label="Skip for Now" onClick={handleBiometricSkip} />
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="px-4 py-10 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h1 className="text-2xl font-extrabold">Registration Successful</h1>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Your mobile banking registration is complete. You can now securely access your account.
              </p>
              <div className="mt-8 space-y-2 max-w-sm mx-auto">
                <RegPrimaryButton label="Login Now" onClick={handleGoToLogin} />
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  const showBack = !['sim_processing', 'complete', 'activate'].includes(step);

  return (
    <RegShell>
      {showBack && <RegTopBar onBack={goBack} />}
      <main className="flex-1 flex flex-col pb-6">{renderStep()}</main>
    </RegShell>
  );
};
