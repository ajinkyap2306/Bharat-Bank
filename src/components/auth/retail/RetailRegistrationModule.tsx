import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CardSim,
  CheckCircle2,
  CreditCard,
  Fingerprint,
  IdCard,
  Phone,
  ScrollText,
  WifiOff,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type {
  RetailRegistrationDraft,
  RetailRegistrationStep,
  VerificationMethod,
} from '../../../types/retailRegistration';
import {
  RETAIL_DEMO_CUSTOMER_ID,
  RETAIL_DEMO_AUTO_OTP,
  RETAIL_DEMO_REGISTERED_MOBILE,
  RETAIL_HELPLINE,
  RETAIL_MAX_OTP_ATTEMPTS,
  RETAIL_MAX_VERIFICATION_ATTEMPTS,
  RETAIL_MOBILE_BANKING_TERMS,
  RETAIL_OTP_RESEND_SECONDS,
  RETAIL_PRIVACY_TEXT,
  RETAIL_REGISTRATION_DEMO_HINTS,
  RETAIL_TERMS_TEXT,
  formatAadhaarInput,
  formatCardNumberDisplay,
  formatDobInput,
  formatExpiryInput,
  generateRetailUserId,
  maskCustomerId,
  maskRegisteredMobile,
  maskUserId,
  recoverCustomerId,
  simulateRegistrationSubmit,
  simulateSimVerification,
  validateAadhaarVerification,
  validateCustomerVerification,
  validateDebitCardVerification,
  validateMpin,
  validatePanVerification,
  verifyRegistrationOtp,
} from '../../../data/retailRegistrationMock';
import { playPaymentSuccessSound } from '../../../utils/paymentSuccessFeedback';
import { BharatBankLogo } from '../../common/BharatBankLogo';
import { BottomSheet } from '../../common/BottomSheet';
import { OtpInput } from '../corporate/otp/OtpInput';
import { OtpTimer } from '../corporate/otp/OtpTimer';
import { SkipBiometricSheet } from '../corporate/device/SkipBiometricSheet';
import {
  MpinInput,
  RegChecklist,
  RegDemoHint,
  RegErrorIcon,
  RegField,
  RegInfoLink,
  RegInfoRow,
  RegLegalLink,
  RegLoadingState,
  RegMaskedValue,
  RegMethodCard,
  RegPrimaryButton,
  RegSecondaryButton,
  RegShell,
  RegStickyFooter,
  RegTextButton,
  RegTitle,
  RegTopBar,
} from './shared/RetailRegistrationUI';

const INITIAL_DRAFT: RetailRegistrationDraft = {
  registeredMobile: RETAIL_DEMO_REGISTERED_MOBILE,
  simVerified: false,
  verificationMethod: null,
  customerId: '',
  dateOfBirth: '',
  accountNumber: '',
  debitCardNumber: '',
  debitCardExpiry: '',
  aadhaarNumber: '',
  pan: '',
  userId: '',
  password: '',
  confirmPassword: '',
  profileCode: 'P1',
  mpin: '',
  biometricEnabled: false,
  termsAccepted: false,
  otpRequired: false,
};

const MASKED_MOBILE = maskRegisteredMobile(RETAIL_DEMO_REGISTERED_MOBILE);
const EMPTY_OTP = ['', '', '', '', '', ''];

export const RetailRegistrationModule: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, completeRetailRegistration, setBankingType, setAuthScreen } = useBanking();

  const [step, setStep] = useState<RetailRegistrationStep>('welcome');
  const [draft, setDraft] = useState<RetailRegistrationDraft>(INITIAL_DRAFT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinError, setMpinError] = useState('');

  const [otpDigits, setOtpDigits] = useState([...EMPTY_OTP]);
  const [otpActiveIndex, setOtpActiveIndex] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpResendSeconds, setOtpResendSeconds] = useState(RETAIL_OTP_RESEND_SECONDS);
  const [otpLocked, setOtpLocked] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showBiometricSkip, setShowBiometricSkip] = useState(false);
  const [showLegal, setShowLegal] = useState<'terms' | 'privacy' | 'mobile' | null>(null);
  const [recoveryAccount, setRecoveryAccount] = useState('');
  const [recoveryDob, setRecoveryDob] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const successSoundPlayed = useRef(false);
  const pendingBack = useRef<(() => void) | null>(null);

  useEffect(() => {
    setBankingType('retail');
  }, [setBankingType]);

  useEffect(() => {
    if (step !== 'sim_processing') return;
    let cancelled = false;
    simulateSimVerification(false).then(({ success }) => {
      if (cancelled) return;
      if (success) {
        setDraft((d) => ({ ...d, simVerified: true }));
        setStep('sim_success');
      } else {
        setStep('sim_failed');
      }
    });
    return () => { cancelled = true; };
  }, [step]);

  useEffect(() => {
    if (step !== 'processing') return;
    let cancelled = false;
    simulateRegistrationSubmit().then(({ success }) => {
      if (cancelled) return;
      if (success) {
        completeRetailRegistration({
          userId: draft.userId.trim(),
          profileCode: draft.profileCode,
          mpinSet: draft.mpin.length === 6,
          biometricEnabled: draft.biometricEnabled,
          method: 'sim_verify',
        });
        setStep('complete');
      } else {
        setNetworkError(true);
        setStep('terms');
      }
    });
    return () => { cancelled = true; };
  }, [step, draft, completeRetailRegistration]);

  useEffect(() => {
    if (step !== 'complete' || successSoundPlayed.current) return;
    playPaymentSuccessSound();
    successSoundPlayed.current = true;
  }, [step]);

  useEffect(() => {
    if (step !== 'otp' || otpResendSeconds <= 0) return;
    const t = window.setInterval(() => {
      setOtpResendSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [step, otpResendSeconds]);

  const verifiedCustomerId = draft.customerId.trim() || RETAIL_DEMO_CUSTOMER_ID;

  const goToCustomerVerified = useCallback(() => {
    setVerificationAttempts(0);
    setError('');
    setDraft((d) => {
      const customerId = d.customerId || RETAIL_DEMO_CUSTOMER_ID;
      return {
        ...d,
        customerId,
        userId: d.userId || generateRetailUserId(),
      };
    });
    setStep('customer_verified');
  }, []);

  const handleVerificationFailure = useCallback((message: string) => {
    const next = verificationAttempts + 1;
    setVerificationAttempts(next);
    if (next >= RETAIL_MAX_VERIFICATION_ATTEMPTS) {
      setIsLocked(true);
      setError('');
    } else {
      setError(message);
    }
  }, [verificationAttempts]);

  const goBack = useCallback(() => {
    setError('');
    switch (step) {
      case 'welcome':
        navigate('/');
        break;
      case 'sim_verify':
        setStep('welcome');
        break;
      case 'sim_success':
        setStep('sim_verify');
        break;
      case 'sim_failed':
        setStep('sim_verify');
        break;
      case 'choose_verification_method':
        setStep('sim_success');
        break;
      case 'verify_customer_id':
      case 'verify_debit_card':
      case 'verify_aadhaar':
      case 'verify_pan':
        setStep('choose_verification_method');
        break;
      case 'customer_verified':
        setStep('choose_verification_method');
        break;
      case 'otp':
        setStep('customer_verified');
        break;
      case 'mpin':
        setStep(draft.otpRequired ? 'otp' : 'customer_verified');
        break;
      case 'biometric':
        setStep('mpin');
        break;
      case 'terms':
        setStep('biometric');
        break;
      default:
        navigate('/');
    }
  }, [step, navigate, draft.otpRequired]);

  const requestBack = useCallback((action: () => void) => {
    if (['welcome', 'sim_processing', 'processing', 'complete'].includes(step)) {
      action();
      return;
    }
    pendingBack.current = action;
    setShowExit(true);
  }, [step]);

  const handleChooseMethod = (method: VerificationMethod) => {
    setDraft((d) => ({ ...d, verificationMethod: method }));
    setError('');
    setIsLocked(false);
    setVerificationAttempts(0);
    switch (method) {
      case 'customer_id':
        setStep('verify_customer_id');
        break;
      case 'debit_card':
        setStep('verify_debit_card');
        break;
      case 'aadhaar':
        setStep('verify_aadhaar');
        break;
      case 'pan':
        setStep('verify_pan');
        break;
    }
  };

  const handleCustomerIdContinue = () => {
    const err = validateCustomerVerification(draft.customerId, draft.dateOfBirth);
    if (err) {
      handleVerificationFailure(err);
      return;
    }
    goToCustomerVerified();
  };

  const handleDebitCardContinue = () => {
    const err = validateDebitCardVerification(draft.debitCardNumber, draft.debitCardExpiry);
    if (err) {
      handleVerificationFailure(err);
      return;
    }
    goToCustomerVerified();
  };

  const handleAadhaarContinue = () => {
    const { error: err, requiresOtp } = validateAadhaarVerification(draft.aadhaarNumber);
    if (err) {
      handleVerificationFailure(err);
      return;
    }
    setDraft((d) => ({ ...d, otpRequired: requiresOtp, customerId: d.customerId || RETAIL_DEMO_CUSTOMER_ID }));
    goToCustomerVerified();
  };

  const handlePanContinue = () => {
    const err = validatePanVerification(draft.pan, draft.dateOfBirth);
    if (err) {
      handleVerificationFailure(err);
      return;
    }
    goToCustomerVerified();
  };

  const handleOtpVerify = () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setOtpError('Enter the 6-digit OTP.');
      return;
    }
    if (!verifyRegistrationOtp(otp)) {
      const next = otpAttempts + 1;
      setOtpAttempts(next);
      if (next >= RETAIL_MAX_OTP_ATTEMPTS) {
        setOtpLocked(true);
        setOtpError('');
      } else {
        setOtpError('Incorrect OTP. Please try again.');
        setOtpDigits([...EMPTY_OTP]);
        setOtpActiveIndex(0);
      }
      return;
    }
    setOtpError('');
    setStep('mpin');
  };

  const handleResendOtp = () => {
    if (otpResendSeconds > 0) return;
    setOtpDigits([...EMPTY_OTP]);
    setOtpActiveIndex(0);
    setOtpError('');
    setOtpResendSeconds(RETAIL_OTP_RESEND_SECONDS);
    addToast({ type: 'info', title: 'OTP Sent', message: `A new OTP has been sent to ${MASKED_MOBILE}.` });
  };

  const handleMpinContinue = () => {
    const err = validateMpin(draft.mpin, confirmMpin);
    if (err) {
      setMpinError(err);
      return;
    }
    setMpinError('');
    setStep('biometric');
  };

  const handleBiometricEnable = () => {
    setDraft((d) => ({ ...d, biometricEnabled: true }));
    addToast({ type: 'success', title: 'Biometric enabled', message: 'Fingerprint login is now available.' });
    setStep('terms');
  };

  const handleBiometricSkip = () => {
    setDraft((d) => ({ ...d, biometricEnabled: false }));
    setShowBiometricSkip(false);
    setStep('terms');
  };

  const handleTermsContinue = () => {
    if (!draft.termsAccepted) return;
    setNetworkError(false);
    setStep('processing');
  };

  const handleGoToLogin = () => {
    setAuthScreen('login');
    navigate('/', { state: { customerId: draft.userId.trim() } });
  };

  const handleRecovery = () => {
    const result = recoverCustomerId(recoveryAccount, recoveryDob);
    if (result.error) {
      setRecoveryError(result.error);
      return;
    }
    setRecoveryError('');
    setRecoverySuccess(true);
  };

  const applyRecoveredCustomerId = () => {
    setDraft((d) => ({ ...d, customerId: RETAIL_DEMO_CUSTOMER_ID }));
    setShowRecovery(false);
    setRecoverySuccess(false);
    setRecoveryAccount('');
    setRecoveryDob('');
  };

  const renderLockedState = () => (
    <div className="px-4 py-8 text-center flex-1 flex flex-col">
      <RegErrorIcon />
      <RegTitle
        centered
        title="Verification Temporarily Locked"
        subtitle="Too many unsuccessful attempts. Please try again later or contact customer care."
      />
      <div className="mt-4 space-y-2">
        <RegPrimaryButton label="Contact Support" onClick={() => setShowHelp(true)} />
        <RegSecondaryButton
          label="Choose Another Method"
          onClick={() => {
            setIsLocked(false);
            setVerificationAttempts(0);
            setError('');
            setStep('choose_verification_method');
          }}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    if (isLocked && ['verify_customer_id', 'verify_debit_card', 'verify_aadhaar', 'verify_pan'].includes(step)) {
      return renderLockedState();
    }

    switch (step) {
      case 'welcome':
        return (
          <div className="flex flex-col flex-1 px-4">
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <BharatBankLogo variant="full" size="lg" className="mb-10" />
              <h1 className="text-2xl font-extrabold text-[#0A2540] dark:text-white tracking-tight">
                Welcome to Mobile Banking
              </h1>
              <p className="text-sm text-slate-500 mt-3 max-w-xs leading-relaxed">
                Secure banking, anytime, anywhere.
              </p>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Register / Activate Mobile Banking" onClick={() => setStep('sim_verify')} />
              <RegSecondaryButton label="Login" onClick={() => navigate('/')} />
            </RegStickyFooter>
          </div>
        );

      case 'sim_verify':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle
                title="Verify Your SIM"
                subtitle="We need to verify the mobile number registered with your bank account."
              />
              <div className="px-4 space-y-4">
                <div className="flex justify-center py-2">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                    <CardSim className="w-8 h-8 text-[#005DD4]" strokeWidth={1.75} />
                  </div>
                </div>
                <RegMaskedValue label="Registered Mobile Number" value={MASKED_MOBILE} />
                <RegChecklist
                  items={[
                    'Registered SIM is inserted',
                    'Mobile network is available',
                    'Required SMS permission is enabled',
                  ]}
                />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Verify SIM" onClick={() => setStep('sim_processing')} />
              <RegTextButton label="Need Help?" onClick={() => setShowHelp(true)} className="w-full text-center py-1" />
            </RegStickyFooter>
          </div>
        );

      case 'sim_processing':
        return (
          <RegLoadingState
            title="Verifying your SIM…"
            subtitle="Checking your registered mobile number securely."
          />
        );

      case 'sim_success':
        return (
          <div className="flex flex-col flex-1 px-4 py-8 text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-5"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <RegTitle
                centered
                title="SIM Verified"
                subtitle="Your registered mobile number has been verified successfully."
              />
              <p className="text-lg font-bold tracking-wide text-[#005DD4] mb-8">{MASKED_MOBILE}</p>
            </motion.div>
            <RegPrimaryButton label="Continue" onClick={() => setStep('choose_verification_method')} />
          </div>
        );

      case 'sim_failed':
        return (
          <div className="flex flex-col flex-1 px-4 py-8">
            <div className="flex-1 text-center">
              <RegErrorIcon />
              <RegTitle
                centered
                title="SIM Verification Failed"
                subtitle="The SIM in this device does not match the mobile number registered with your bank."
              />
              <div className="mt-4 text-left max-w-sm mx-auto space-y-2">
                {['Registered SIM is not inserted', 'Mobile network unavailable', 'SIM verification failed'].map(
                  (reason) => (
                    <p key={reason} className="text-sm text-slate-500 flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      {reason}
                    </p>
                  )
                )}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Try Again" onClick={() => setStep('sim_verify')} />
              <RegTextButton label="Need Help?" onClick={() => setShowHelp(true)} className="w-full text-center py-1" />
            </RegStickyFooter>
          </div>
        );

      case 'choose_verification_method':
        return (
          <div className="flex flex-col flex-1">
            <RegTitle
              title="Verify Your Account"
              subtitle="Choose how you'd like to verify your bank account."
            />
            <div className="px-4 space-y-3 flex-1">
              <RegMethodCard
                icon={<IdCard className="w-5 h-5" />}
                title="Customer ID"
                description="Verify using your Customer ID"
                onSelect={() => handleChooseMethod('customer_id')}
              />
              <RegMethodCard
                icon={<CreditCard className="w-5 h-5" />}
                title="Debit Card"
                description="Verify using your debit card"
                onSelect={() => handleChooseMethod('debit_card')}
              />
              <RegMethodCard
                icon={<IdCard className="w-5 h-5" />}
                title="Aadhaar"
                description="Verify your identity using Aadhaar"
                onSelect={() => handleChooseMethod('aadhaar')}
              />
              <RegMethodCard
                icon={<ScrollText className="w-5 h-5" />}
                title="PAN"
                description="Verify using PAN"
                onSelect={() => handleChooseMethod('pan')}
              />
              <RegDemoHint
                title="Demo — All verification methods"
                lines={[
                  ...RETAIL_REGISTRATION_DEMO_HINTS.customerId.lines,
                  ...RETAIL_REGISTRATION_DEMO_HINTS.customerIdRecovery.lines,
                  ...RETAIL_REGISTRATION_DEMO_HINTS.debitCard.lines,
                  ...RETAIL_REGISTRATION_DEMO_HINTS.aadhaar.lines,
                  ...RETAIL_REGISTRATION_DEMO_HINTS.pan.lines,
                ]}
              />
            </div>
          </div>
        );

      case 'verify_customer_id':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Verify with Customer ID" />
              <div className="px-4 space-y-4">
                <RegField
                  label="Customer ID"
                  value={draft.customerId}
                  onChange={(v) => setDraft((d) => ({ ...d, customerId: v.replace(/\D/g, '').slice(0, 12) }))}
                  placeholder="Enter Customer ID"
                  inputMode="numeric"
                />
                <RegField
                  label="Date of Birth"
                  value={draft.dateOfBirth}
                  onChange={(v) => setDraft((d) => ({ ...d, dateOfBirth: formatDobInput(v) }))}
                  placeholder="DD / MM / YYYY"
                  inputMode="numeric"
                />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint
                  title={RETAIL_REGISTRATION_DEMO_HINTS.customerId.title}
                  lines={RETAIL_REGISTRATION_DEMO_HINTS.customerId.lines}
                />
                <RegInfoLink label="Don't know your Customer ID?" onClick={() => setShowRecovery(true)} />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={handleCustomerIdContinue} />
            </RegStickyFooter>
          </div>
        );

      case 'verify_debit_card':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Verify with Debit Card" />
              <div className="px-4 space-y-4">
                <RegField
                  label="Debit Card Number"
                  value={formatCardNumberDisplay(draft.debitCardNumber)}
                  onChange={(v) => setDraft((d) => ({ ...d, debitCardNumber: v.replace(/\D/g, '').slice(0, 16) }))}
                  placeholder="•••• •••• •••• 4582"
                  inputMode="numeric"
                />
                <RegField
                  label="Expiry Date"
                  value={draft.debitCardExpiry}
                  onChange={(v) => setDraft((d) => ({ ...d, debitCardExpiry: formatExpiryInput(v) }))}
                  placeholder="MM / YY"
                  inputMode="numeric"
                />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint
                  title={RETAIL_REGISTRATION_DEMO_HINTS.debitCard.title}
                  lines={RETAIL_REGISTRATION_DEMO_HINTS.debitCard.lines}
                />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={handleDebitCardContinue} />
              {error && (
                <RegSecondaryButton
                  label="Choose Another Method"
                  onClick={() => setStep('choose_verification_method')}
                />
              )}
            </RegStickyFooter>
          </div>
        );

      case 'verify_aadhaar':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Verify with Aadhaar" />
              <div className="px-4 space-y-4">
                <RegField
                  label="Aadhaar Number"
                  value={formatAadhaarInput(draft.aadhaarNumber)}
                  onChange={(v) => setDraft((d) => ({ ...d, aadhaarNumber: v.replace(/\D/g, '').slice(0, 12) }))}
                  placeholder="XXXX XXXX 1234"
                  inputMode="numeric"
                />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint
                  title={RETAIL_REGISTRATION_DEMO_HINTS.aadhaar.title}
                  lines={RETAIL_REGISTRATION_DEMO_HINTS.aadhaar.lines}
                />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={handleAadhaarContinue} />
              {error && (
                <RegSecondaryButton
                  label="Choose Another Method"
                  onClick={() => setStep('choose_verification_method')}
                />
              )}
            </RegStickyFooter>
          </div>
        );

      case 'verify_pan':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Verify with PAN" />
              <div className="px-4 space-y-4">
                <RegField
                  label="PAN"
                  value={draft.pan}
                  onChange={(v) => setDraft((d) => ({ ...d, pan: v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) }))}
                  placeholder="ABCDE1234F"
                  autoCapitalize="characters"
                />
                <RegField
                  label="Date of Birth"
                  value={draft.dateOfBirth}
                  onChange={(v) => setDraft((d) => ({ ...d, dateOfBirth: formatDobInput(v) }))}
                  placeholder="DD / MM / YYYY"
                  inputMode="numeric"
                />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint
                  title={RETAIL_REGISTRATION_DEMO_HINTS.pan.title}
                  lines={RETAIL_REGISTRATION_DEMO_HINTS.pan.lines}
                />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={handlePanContinue} />
              {error && (
                <RegSecondaryButton
                  label="Choose Another Method"
                  onClick={() => setStep('choose_verification_method')}
                />
              )}
            </RegStickyFooter>
          </div>
        );

      case 'customer_verified':
        return (
          <div className="flex flex-col flex-1 px-4 py-8 text-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <RegTitle
                centered
                title="Customer Verified"
                subtitle="Your banking relationship has been verified successfully."
              />
              <div className="w-full max-w-sm mx-auto mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
                <RegInfoRow label="Customer ID" value={maskCustomerId(verifiedCustomerId)} />
                <RegInfoRow label="Registered Mobile" value={MASKED_MOBILE} />
              </div>
            </motion.div>
            <RegPrimaryButton
              label="Continue"
              onClick={() => {
                if (draft.otpRequired) {
                  setOtpDigits([...EMPTY_OTP]);
                  setOtpResendSeconds(RETAIL_OTP_RESEND_SECONDS);
                  setOtpError('');
                  setOtpAttempts(0);
                  setOtpLocked(false);
                  setStep('otp');
                } else {
                  setStep('mpin');
                }
              }}
            />
          </div>
        );

      case 'otp':
        if (otpLocked) {
          return (
            <div className="px-4 py-8 text-center flex-1 flex flex-col">
              <RegErrorIcon />
              <RegTitle
                centered
                title="Maximum Attempts Reached"
                subtitle="OTP verification is temporarily locked. Please try again later."
              />
              <RegPrimaryButton label="Choose Another Method" onClick={() => setStep('choose_verification_method')} />
            </div>
          );
        }
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Verify Mobile Number" subtitle={`OTP sent to ${MASKED_MOBILE}`} />
              <div className="px-4 space-y-5">
                <OtpInput
                  digits={otpDigits}
                  activeIndex={otpActiveIndex}
                  hasError={Boolean(otpError)}
                  onDigitsChange={setOtpDigits}
                  onActiveIndexChange={setOtpActiveIndex}
                />
                {otpError && <p className="text-xs text-red-600 font-medium text-center">{otpError}</p>}
                <RegDemoHint title="Demo OTP" lines={[`OTP: ${RETAIL_DEMO_AUTO_OTP}`]} />
                <div className="text-center space-y-2">
                  <OtpTimer secondsRemaining={otpResendSeconds} />
                  {otpResendSeconds === 0 && (
                    <RegTextButton label="Resend OTP" onClick={handleResendOtp} className="block mx-auto" />
                  )}
                </div>
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Verify" onClick={handleOtpVerify} />
            </RegStickyFooter>
          </div>
        );

      case 'mpin':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle
                title="Set Your MPIN"
                subtitle="Create a 6-digit MPIN for secure mobile banking access."
              />
              <div className="px-4 space-y-6">
                <MpinInput
                  label="MPIN"
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
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={handleMpinContinue} />
            </RegStickyFooter>
          </div>
        );

      case 'biometric':
        return (
          <div className="flex flex-col flex-1 px-4 py-6 text-center">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-5">
                <Fingerprint className="w-10 h-10 text-[#005DD4]" />
              </div>
              <RegTitle
                centered
                title="Enable Biometric Login"
                subtitle="Use fingerprint or face recognition for faster and secure access."
              />
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Enable Biometric" onClick={handleBiometricEnable} />
              <RegSecondaryButton label="Skip for Now" onClick={() => setShowBiometricSkip(true)} />
            </RegStickyFooter>
          </div>
        );

      case 'terms':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Terms & Conditions" subtitle="Please review and accept to continue." />
              <div className="px-4">
                <RegLegalLink label="Terms & Conditions" onClick={() => setShowLegal('terms')} />
                <RegLegalLink label="Privacy Policy" onClick={() => setShowLegal('privacy')} />
                <RegLegalLink label="Mobile Banking Terms" onClick={() => setShowLegal('mobile')} />
                <label className="flex items-start gap-3 mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.termsAccepted}
                    onChange={(e) => setDraft((d) => ({ ...d, termsAccepted: e.target.checked }))}
                    className="mt-0.5 w-5 h-5 rounded border-slate-300 text-[#005DD4] focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 leading-snug">I agree to the Terms & Conditions</span>
                </label>
                {networkError && (
                  <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                    <WifiOff className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">No Internet Connection</p>
                      <p className="text-xs text-red-600 mt-0.5">Please check your connection and try again.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton
                label="Continue"
                onClick={handleTermsContinue}
                disabled={!draft.termsAccepted}
              />
            </RegStickyFooter>
          </div>
        );

      case 'processing':
        return (
          <RegLoadingState
            title="Setting Up Mobile Banking…"
            subtitle="Creating your secure mobile banking access."
          />
        );

      case 'complete':
        return (
          <div className="flex flex-col flex-1 px-4 py-10 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h1 className="text-2xl font-extrabold text-[#0A2540] dark:text-white">Registration Successful</h1>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Your mobile banking registration has been completed successfully.
              </p>
              <div className="w-full max-w-sm mx-auto mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
                <RegInfoRow label="Customer ID" value={maskCustomerId(verifiedCustomerId)} />
                <RegInfoRow label="User ID" value={maskUserId(draft.userId)} />
              </div>
            </motion.div>
            <RegPrimaryButton label="Login Now" onClick={handleGoToLogin} />
          </div>
        );

      default:
        return null;
    }
  };

  const showBack = !['sim_processing', 'processing', 'complete', 'welcome'].includes(step);

  return (
    <RegShell>
      {showBack && (
        <RegTopBar
          onBack={() => requestBack(goBack)}
        />
      )}
      <main className="flex-1 flex flex-col min-h-0">{renderStep()}</main>

      {/* Help Sheet */}
      <BottomSheet isOpen={showHelp} onClose={() => setShowHelp(false)} title="Need Help?" subtitle="We're here to assist you">
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <Phone className="w-5 h-5 text-[#005DD4]" />
            <div>
              <p className="text-sm font-bold">Customer Care</p>
              <p className="text-sm text-[#005DD4] font-semibold">{RETAIL_HELPLINE}</p>
              <p className="text-xs text-slate-500">24×7 toll-free</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Visit your nearest branch with valid ID proof for in-person assistance with mobile banking registration.
          </p>
        </div>
      </BottomSheet>

      {/* Exit Confirmation */}
      <BottomSheet
        isOpen={showExit}
        onClose={() => setShowExit(false)}
        title="Exit Registration?"
        subtitle="Your registration progress may be lost."
      >
        <div className="space-y-2 pb-2">
          <RegPrimaryButton
            label="Continue Registration"
            onClick={() => {
              setShowExit(false);
              pendingBack.current = null;
            }}
          />
          <RegSecondaryButton
            label="Exit"
            onClick={() => {
              setShowExit(false);
              if (pendingBack.current) pendingBack.current();
              else navigate('/');
            }}
          />
        </div>
      </BottomSheet>

      {/* Customer ID Recovery */}
      <BottomSheet
        isOpen={showRecovery}
        onClose={() => {
          setShowRecovery(false);
          setRecoverySuccess(false);
          setRecoveryError('');
          setRecoveryAccount('');
          setRecoveryDob('');
        }}
        title={recoverySuccess ? 'Customer ID Found' : 'Find Customer ID'}
      >
        {recoverySuccess ? (
          <div className="space-y-4 pb-2 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Customer ID</p>
              <p className="text-lg font-bold text-[#0A2540]">{maskCustomerId(RETAIL_DEMO_CUSTOMER_ID)}</p>
            </div>
            <RegPrimaryButton label="Continue" onClick={applyRecoveredCustomerId} />
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            <RegMaskedValue label="Registered Mobile Number" value={MASKED_MOBILE} />
            <RegField
              label="Account Number"
              value={recoveryAccount}
              onChange={setRecoveryAccount}
              placeholder="Enter Account Number"
              inputMode="numeric"
            />
            <RegField
              label="Date of Birth"
              value={recoveryDob}
              onChange={(v) => setRecoveryDob(formatDobInput(v))}
              placeholder="DD / MM / YYYY"
              inputMode="numeric"
            />
            {recoveryError && <p className="text-xs text-red-600 font-medium">{recoveryError}</p>}
            <RegDemoHint
              title={RETAIL_REGISTRATION_DEMO_HINTS.customerIdRecovery.title}
              lines={RETAIL_REGISTRATION_DEMO_HINTS.customerIdRecovery.lines}
            />
            <RegPrimaryButton label="Find Customer ID" onClick={handleRecovery} />
          </div>
        )}
      </BottomSheet>

      {/* Legal Documents */}
      <BottomSheet
        isOpen={showLegal !== null}
        onClose={() => setShowLegal(null)}
        title={
          showLegal === 'terms'
            ? 'Terms & Conditions'
            : showLegal === 'privacy'
              ? 'Privacy Policy'
              : 'Mobile Banking Terms'
        }
        maxHeight="max-h-[90vh]"
      >
        <pre className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-sans">
          {showLegal === 'terms'
            ? RETAIL_TERMS_TEXT
            : showLegal === 'privacy'
              ? RETAIL_PRIVACY_TEXT
              : RETAIL_MOBILE_BANKING_TERMS}
        </pre>
      </BottomSheet>

      <SkipBiometricSheet
        isOpen={showBiometricSkip}
        onClose={() => setShowBiometricSkip(false)}
        onSkip={handleBiometricSkip}
        onEnable={() => {
          setShowBiometricSkip(false);
          handleBiometricEnable();
        }}
      />
    </RegShell>
  );
};
