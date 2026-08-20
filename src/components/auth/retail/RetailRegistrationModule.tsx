import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CardSim, CheckCircle2, CreditCard, Fingerprint, IdCard, ScrollText } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type {
  RetailRegistrationDraft,
  RetailRegistrationStep,
  SimSlotId,
} from '../../../types/retailRegistration';
import {
  RETAIL_DEMO_CUSTOMER_ID,
  RETAIL_DEMO_SIMS,
  RETAIL_HELPLINE,
  RETAIL_LINKED_ACCOUNTS,
  RETAIL_MAX_OTP_ATTEMPTS,
  RETAIL_MAX_VERIFICATION_ATTEMPTS,
  RETAIL_OTP_RESEND_SECONDS,
  RETAIL_REGISTRATION_DEMO_HINTS,
  formatAadhaarInput,
  formatCardNumberDisplay,
  formatDobInput,
  formatExpiryInput,
  generateRetailUserId,
  maskCustomerId,
  maskRegisteredMobile,
  maskUserId,
  simulateSimVerification,
  validateAadhaarVerification,
  validateCustomerVerification,
  validateDebitCardVerification,
  validateMpin,
  validatePanVerification,
  validateTpin,
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
  RegAccountRow,
  RegChecklist,
  RegDemoHint,
  RegErrorIcon,
  RegField,
  RegInfoRow,
  RegLoadingState,
  RegMethodCard,
  RegPrimaryButton,
  RegSecondaryButton,
  RegSelectCard,
  RegShell,
  RegStickyFooter,
  RegTextButton,
  RegTitle,
  RegTopBar,
} from './shared/RetailRegistrationUI';


const INITIAL_DRAFT: RetailRegistrationDraft = {
  selectedSimId: null,
  registeredMobile: '',
  verificationMethod: null,
  customerId: '',
  dateOfBirth: '',
  debitCardNumber: '',
  debitCardExpiry: '',
  aadhaarNumber: '',
  pan: '',
  linkedAccountId: null,
  userId: '',
  profileCode: 'P1',
  mpin: '',
  tpin: '',
  biometricEnabled: false,
};

const EMPTY_OTP = ['', '', '', '', '', ''];

export const RetailRegistrationModule: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, completeRetailRegistration, setBankingType, setAuthScreen } = useBanking();

  const [step, setStep] = useState<RetailRegistrationStep>('welcome');
  const [draft, setDraft] = useState<RetailRegistrationDraft>(INITIAL_DRAFT);
  const [error, setError] = useState('');
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [confirmTpin, setConfirmTpin] = useState('');
  const [tpinError, setTpinError] = useState('');

  const [otpDigits, setOtpDigits] = useState([...EMPTY_OTP]);
  const [otpActiveIndex, setOtpActiveIndex] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpResendSeconds, setOtpResendSeconds] = useState(RETAIL_OTP_RESEND_SECONDS);
  const [otpLocked, setOtpLocked] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [showBiometricSkip, setShowBiometricSkip] = useState(false);

  const successSoundPlayed = useRef(false);
  const pendingBack = useRef<(() => void) | null>(null);

  const maskedMobile = draft.registeredMobile
    ? maskRegisteredMobile(draft.registeredMobile)
    : maskRegisteredMobile(RETAIL_DEMO_SIMS[0].mobile);

  const resetOtpState = useCallback(() => {
    setOtpDigits([...EMPTY_OTP]);
    setOtpActiveIndex(0);
    setOtpResendSeconds(RETAIL_OTP_RESEND_SECONDS);
    setOtpError('');
    setOtpAttempts(0);
    setOtpLocked(false);
  }, []);

  useEffect(() => {
    setBankingType('retail');
  }, [setBankingType]);

  useEffect(() => {
    if (step !== 'sim_processing') return;
    let cancelled = false;
    simulateSimVerification(draft.selectedSimId).then(({ success, mobile }) => {
      if (cancelled) return;
      if (success && mobile) {
        setDraft((d) => ({ ...d, registeredMobile: mobile }));
        resetOtpState();
        setStep('otp');
      } else {
        setStep('sim_failed');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [step, draft.selectedSimId, resetOtpState]);

  useEffect(() => {
    if (step !== 'complete' || successSoundPlayed.current) return;
    playPaymentSuccessSound();
    successSoundPlayed.current = true;
  }, [step]);

  useEffect(() => {
    if (step !== 'otp' || otpResendSeconds <= 0) return;
    const t = window.setInterval(() => setOtpResendSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [step, otpResendSeconds]);

  const finishRegistration = useCallback(
    (biometricEnabled: boolean) => {
      completeRetailRegistration({
        userId: draft.userId.trim(),
        profileCode: draft.profileCode,
        customerId: draft.customerId || RETAIL_DEMO_CUSTOMER_ID,
        mpinSet: draft.mpin.length === 6,
        tpinSet: draft.tpin.length === 4,
        biometricEnabled,
        method: 'sim_verify',
      });
      setStep('complete');
    },
    [completeRetailRegistration, draft]
  );

  const goToPostCustomerVerification = useCallback(() => {
    setDraft((d) => ({
      ...d,
      customerId: d.customerId || RETAIL_DEMO_CUSTOMER_ID,
      userId: d.userId || generateRetailUserId(),
      linkedAccountId:
        RETAIL_LINKED_ACCOUNTS.length === 1 ? RETAIL_LINKED_ACCOUNTS[0].id : null,
    }));
    if (RETAIL_LINKED_ACCOUNTS.length > 1) {
      setStep('accounts_found');
    } else {
      setStep('mpin');
    }
  }, []);

  const handleVerificationFailure = useCallback(
    (message: string) => {
      const next = verificationAttempts + 1;
      setVerificationAttempts(next);
      if (next >= RETAIL_MAX_VERIFICATION_ATTEMPTS) {
        setIsLocked(true);
        setError('');
      } else {
        setError(message);
      }
    },
    [verificationAttempts]
  );

  const goBack = useCallback(() => {
    setError('');
    switch (step) {
      case 'welcome':
        navigate('/');
        break;
      case 'sim_verify':
      case 'sim_failed':
        setStep('welcome');
        break;
      case 'otp':
        setStep('sim_verify');
        break;
      case 'choose_verification_method':
        setStep('otp');
        break;
      case 'verify_customer_id':
      case 'verify_debit_card':
      case 'verify_aadhaar':
      case 'verify_pan':
        setStep('choose_verification_method');
        break;
      case 'accounts_found':
        setStep(`verify_${draft.verificationMethod}` as RetailRegistrationStep);
        break;
      case 'mpin':
        setStep(RETAIL_LINKED_ACCOUNTS.length > 1 ? 'accounts_found' : `verify_${draft.verificationMethod}` as RetailRegistrationStep);
        break;
      case 'tpin':
        setStep('mpin');
        break;
      case 'biometric':
        setStep('tpin');
        break;
      default:
        navigate('/');
    }
  }, [step, navigate, draft.verificationMethod]);

  const requestBack = useCallback(
    (action: () => void) => {
      if (['welcome', 'sim_processing', 'complete'].includes(step)) {
        action();
        return;
      }
      pendingBack.current = action;
      setShowExit(true);
    },
    [step]
  );

  const selectAccount = (accountId: string) => {
    setDraft((d) => ({ ...d, linkedAccountId: accountId }));
  };

  const renderLockedState = () => (
    <div className="px-4 py-8 text-center flex-1 flex flex-col">
      <RegErrorIcon />
      <RegTitle centered title="Verification Temporarily Locked" subtitle="Too many unsuccessful attempts. Please try again later." />
      <RegPrimaryButton
        label="Choose Another Method"
        onClick={() => {
          setIsLocked(false);
          setVerificationAttempts(0);
          setStep('choose_verification_method');
        }}
      />
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
              <RegTitle title="SIM Verification" subtitle="Select the SIM registered with your bank account." />
              <div className="px-4 space-y-3">
                {RETAIL_DEMO_SIMS.map((sim) => (
                  <RegSelectCard
                    key={sim.id}
                    selected={draft.selectedSimId === sim.id}
                    icon={<CardSim className="w-5 h-5" strokeWidth={1.75} />}
                    title={`SIM ${sim.id === 'sim1' ? '1' : '2'} — ${sim.carrier}`}
                    description={maskRegisteredMobile(sim.mobile)}
                    onSelect={() => {
                      setDraft((d) => ({ ...d, selectedSimId: sim.id as SimSlotId }));
                      setError('');
                    }}
                  />
                ))}
                <RegChecklist
                  items={[
                    'Registered SIM is inserted',
                    'Mobile network is available',
                    'OTP will be sent to your registered mobile number',
                  ]}
                />
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.sim.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.sim.lines} />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton
                label="Verify SIM"
                disabled={!draft.selectedSimId}
                onClick={() => {
                  if (!draft.selectedSimId) {
                    setError('Please select a SIM.');
                    return;
                  }
                  setError('');
                  setStep('sim_processing');
                }}
              />
              <RegTextButton label="Need Help?" onClick={() => setShowHelp(true)} className="w-full text-center py-1" />
            </RegStickyFooter>
          </div>
        );

      case 'sim_processing':
        return <RegLoadingState title="Verifying SIM…" subtitle="Please wait." />;

      case 'sim_failed':
        return (
          <div className="flex flex-col flex-1 px-4 py-8">
            <div className="flex-1 text-center">
              <RegErrorIcon />
              <RegTitle centered title="SIM Verification Failed" subtitle="The selected SIM could not be verified." />
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Try Again" onClick={() => setStep('sim_verify')} />
            </RegStickyFooter>
          </div>
        );

      case 'otp':
        if (otpLocked) {
          return (
            <div className="px-4 py-8 text-center flex-1 flex flex-col">
              <RegErrorIcon />
              <RegTitle centered title="Maximum Attempts Reached" subtitle="Please try again later." />
              <RegPrimaryButton label="Back" onClick={() => setStep('sim_verify')} />
            </div>
          );
        }
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="OTP Verification" subtitle={`Enter the OTP sent to ${maskedMobile}`} />
              <div className="px-4 space-y-5">
                <OtpInput
                  digits={otpDigits}
                  activeIndex={otpActiveIndex}
                  hasError={Boolean(otpError)}
                  onDigitsChange={setOtpDigits}
                  onActiveIndexChange={setOtpActiveIndex}
                />
                {otpError && <p className="text-xs text-red-600 font-medium text-center">{otpError}</p>}
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.otp.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.otp.lines} />
                <div className="text-center space-y-2">
                  <OtpTimer secondsRemaining={otpResendSeconds} />
                  {otpResendSeconds === 0 && (
                    <RegTextButton
                      label="Resend OTP"
                      onClick={() => {
                        resetOtpState();
                        addToast({ type: 'info', title: 'OTP Sent', message: `OTP sent to ${maskedMobile}.` });
                      }}
                      className="block mx-auto"
                    />
                  )}
                </div>
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton
                label="Verify"
                onClick={() => {
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
                  setStep('choose_verification_method');
                }}
              />
            </RegStickyFooter>
          </div>
        );

      case 'choose_verification_method':
        return (
          <div className="flex flex-col flex-1">
            <RegTitle title="Select Verification Method" subtitle="Choose how you'd like to verify your bank account." />
            <div className="px-4 space-y-3 flex-1">
              <RegMethodCard icon={<IdCard className="w-5 h-5" />} title="Customer ID" description="Verify using your Customer ID" onSelect={() => { setDraft((d) => ({ ...d, verificationMethod: 'customer_id' })); setStep('verify_customer_id'); setError(''); setIsLocked(false); setVerificationAttempts(0); }} />
              <RegMethodCard icon={<CreditCard className="w-5 h-5" />} title="Debit Card" description="Verify using your debit card" onSelect={() => { setDraft((d) => ({ ...d, verificationMethod: 'debit_card' })); setStep('verify_debit_card'); setError(''); setIsLocked(false); setVerificationAttempts(0); }} />
              <RegMethodCard icon={<IdCard className="w-5 h-5" />} title="Aadhaar" description="Verify using Aadhaar" onSelect={() => { setDraft((d) => ({ ...d, verificationMethod: 'aadhaar' })); setStep('verify_aadhaar'); setError(''); setIsLocked(false); setVerificationAttempts(0); }} />
              <RegMethodCard icon={<ScrollText className="w-5 h-5" />} title="PAN" description="Verify using PAN" onSelect={() => { setDraft((d) => ({ ...d, verificationMethod: 'pan' })); setStep('verify_pan'); setError(''); setIsLocked(false); setVerificationAttempts(0); }} />
            </div>
          </div>
        );

      case 'verify_customer_id':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Customer Verification" subtitle="Verify with Customer ID" />
              <div className="px-4 space-y-4">
                <RegField label="Customer ID" value={draft.customerId} onChange={(v) => setDraft((d) => ({ ...d, customerId: v.replace(/\D/g, '').slice(0, 12) }))} placeholder="Enter Customer ID" inputMode="numeric" />
                <RegField label="Date of Birth" value={draft.dateOfBirth} onChange={(v) => setDraft((d) => ({ ...d, dateOfBirth: formatDobInput(v) }))} placeholder="DD / MM / YYYY" inputMode="numeric" />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.customerId.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.customerId.lines} />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={() => { const err = validateCustomerVerification(draft.customerId, draft.dateOfBirth); if (err) handleVerificationFailure(err); else goToPostCustomerVerification(); }} />
            </RegStickyFooter>
          </div>
        );

      case 'verify_debit_card':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Customer Verification" subtitle="Verify with Debit Card" />
              <div className="px-4 space-y-4">
                <RegField label="Debit Card Number" value={formatCardNumberDisplay(draft.debitCardNumber)} onChange={(v) => setDraft((d) => ({ ...d, debitCardNumber: v.replace(/\D/g, '').slice(0, 16) }))} placeholder="•••• •••• •••• 4582" inputMode="numeric" />
                <RegField label="Expiry Date" value={draft.debitCardExpiry} onChange={(v) => setDraft((d) => ({ ...d, debitCardExpiry: formatExpiryInput(v) }))} placeholder="MM / YY" inputMode="numeric" />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.debitCard.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.debitCard.lines} />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={() => { const err = validateDebitCardVerification(draft.debitCardNumber, draft.debitCardExpiry); if (err) handleVerificationFailure(err); else goToPostCustomerVerification(); }} />
              {error && <RegSecondaryButton label="Choose Another Method" onClick={() => setStep('choose_verification_method')} />}
            </RegStickyFooter>
          </div>
        );

      case 'verify_aadhaar':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Customer Verification" subtitle="Verify with Aadhaar" />
              <div className="px-4 space-y-4">
                <RegField label="Aadhaar Number" value={formatAadhaarInput(draft.aadhaarNumber)} onChange={(v) => setDraft((d) => ({ ...d, aadhaarNumber: v.replace(/\D/g, '').slice(0, 12) }))} placeholder="XXXX XXXX 1234" inputMode="numeric" />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.aadhaar.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.aadhaar.lines} />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={() => { const { error: err } = validateAadhaarVerification(draft.aadhaarNumber); if (err) handleVerificationFailure(err); else goToPostCustomerVerification(); }} />
              {error && <RegSecondaryButton label="Choose Another Method" onClick={() => setStep('choose_verification_method')} />}
            </RegStickyFooter>
          </div>
        );

      case 'verify_pan':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Customer Verification" subtitle="Verify with PAN" />
              <div className="px-4 space-y-4">
                <RegField label="PAN" value={draft.pan} onChange={(v) => setDraft((d) => ({ ...d, pan: v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10) }))} placeholder="ABCDE1234F" autoCapitalize="characters" />
                <RegField label="Date of Birth" value={draft.dateOfBirth} onChange={(v) => setDraft((d) => ({ ...d, dateOfBirth: formatDobInput(v) }))} placeholder="DD / MM / YYYY" inputMode="numeric" />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.pan.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.pan.lines} />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={() => { const err = validatePanVerification(draft.pan, draft.dateOfBirth); if (err) handleVerificationFailure(err); else goToPostCustomerVerification(); }} />
              {error && <RegSecondaryButton label="Choose Another Method" onClick={() => setStep('choose_verification_method')} />}
            </RegStickyFooter>
          </div>
        );

      case 'accounts_found':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Accounts Found" subtitle="We found your linked accounts." />
              <div className="px-4 space-y-3">
                {RETAIL_LINKED_ACCOUNTS.map((account) => (
                  <RegAccountRow
                    key={account.id}
                    selected={draft.linkedAccountId === account.id}
                    title={account.type}
                    maskedAccount={account.maskedAccount}
                    onSelect={() => selectAccount(account.id)}
                  />
                ))}
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.accounts.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.accounts.lines} />
                {!draft.linkedAccountId && (
                  <p className="text-xs text-red-600 font-medium">Select an account to continue.</p>
                )}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton
                label="Continue"
                disabled={!draft.linkedAccountId}
                onClick={() => setStep('mpin')}
              />
            </RegStickyFooter>
          </div>
        );

      case 'mpin':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Set Your MPIN" subtitle="Create a 6-digit MPIN for secure mobile banking access." />
              <div className="px-4 space-y-6">
                <MpinInput label="MPIN" value={draft.mpin} onChange={(v) => { setDraft((d) => ({ ...d, mpin: v })); setMpinError(''); }} />
                <MpinInput label="Confirm MPIN" value={confirmMpin} onChange={(v) => { setConfirmMpin(v); setMpinError(''); }} error={mpinError} />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton
                label="Continue"
                onClick={() => {
                  const err = validateMpin(draft.mpin, confirmMpin);
                  if (err) setMpinError(err);
                  else {
                    setMpinError('');
                    setStep('tpin');
                  }
                }}
              />
            </RegStickyFooter>
          </div>
        );

      case 'tpin':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle
                title="Set Your TPIN"
                subtitle="Create a 4-digit TPIN to authorize transactions securely."
              />
              <div className="px-4 space-y-6">
                <MpinInput
                  label="TPIN"
                  length={4}
                  value={draft.tpin}
                  onChange={(v) => {
                    setDraft((d) => ({ ...d, tpin: v }));
                    setTpinError('');
                  }}
                />
                <MpinInput
                  label="Confirm TPIN"
                  length={4}
                  value={confirmTpin}
                  onChange={(v) => {
                    setConfirmTpin(v);
                    setTpinError('');
                  }}
                  error={tpinError}
                />
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton
                label="Continue"
                onClick={() => {
                  const err = validateTpin(draft.tpin, confirmTpin);
                  if (err) setTpinError(err);
                  else {
                    setTpinError('');
                    setStep('biometric');
                  }
                }}
              />
            </RegStickyFooter>
          </div>
        );

      case 'biometric':
        return (
          <div className="flex flex-col flex-1 px-4 py-6 text-center">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                <Fingerprint className="w-10 h-10 text-[#005DD4]" />
              </div>
              <RegTitle centered title="Enable Biometric Login" subtitle="Use fingerprint for faster and secure access. Optional." />
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Enable Biometric" onClick={() => finishRegistration(true)} />
              <RegSecondaryButton label="Skip for Now" onClick={() => setShowBiometricSkip(true)} />
            </RegStickyFooter>
          </div>
        );

      case 'complete':
        return (
          <div className="flex flex-col flex-1 px-4 py-10 text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#0A2540] dark:text-white">Registration Successful</h1>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Your mobile banking registration is complete.</p>
              <div className="w-full max-w-sm mx-auto mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left">
                <RegInfoRow label="Customer ID" value={maskCustomerId(draft.customerId)} />
                <RegInfoRow label="User ID" value={maskUserId(draft.userId)} />
                <RegInfoRow
                  label="Account Linked"
                  value={
                    RETAIL_LINKED_ACCOUNTS.find((a) => a.id === draft.linkedAccountId)?.maskedAccount ??
                    '•••• •••• ••••'
                  }
                />
              </div>
            </motion.div>
            <RegPrimaryButton
              label="Back to Login"
              onClick={() => {
                setBankingType('retail');
                setAuthScreen('login');
                navigate('/', { replace: true, state: { customerId: draft.userId.trim() } });
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const showBack = !['sim_processing', 'complete', 'welcome'].includes(step);

  return (
    <RegShell>
      {showBack && <RegTopBar onBack={() => requestBack(goBack)} />}
      <main className="flex-1 flex flex-col min-h-0">{renderStep()}</main>

      <BottomSheet isOpen={showHelp} onClose={() => setShowHelp(false)} title="Need Help?">
        <div className="pb-2">
          <p className="text-sm font-semibold text-[#005DD4]">{RETAIL_HELPLINE}</p>
          <p className="text-xs text-slate-500 mt-1">24×7 Customer Care</p>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showExit} onClose={() => setShowExit(false)} title="Exit Registration?" subtitle="Your progress may be lost.">
        <div className="space-y-2 pb-2">
          <RegPrimaryButton label="Continue Registration" onClick={() => { setShowExit(false); pendingBack.current = null; }} />
          <RegSecondaryButton label="Exit" onClick={() => { setShowExit(false); if (pendingBack.current) pendingBack.current(); else navigate('/'); }} />
        </div>
      </BottomSheet>

      <SkipBiometricSheet
        isOpen={showBiometricSkip}
        onClose={() => setShowBiometricSkip(false)}
        onSkip={() => { setShowBiometricSkip(false); finishRegistration(false); }}
        onEnable={() => { setShowBiometricSkip(false); finishRegistration(true); }}
      />
    </RegShell>
  );
};
