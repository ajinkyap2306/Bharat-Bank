import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CardSim, CheckCircle2, Landmark, Phone, WifiOff } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import type { RetailRegistrationDraft, RetailRegistrationStep, SimSlotId } from '../../../types/retailRegistration';
import {
  RETAIL_DEMO_AUTO_OTP,
  RETAIL_DEMO_SIMS,
  RETAIL_HELPLINE,
  RETAIL_LINKED_ACCOUNTS,
  RETAIL_MAX_OTP_ATTEMPTS,
  RETAIL_MOBILE_BANKING_TERMS,
  RETAIL_OTP_RESEND_SECONDS,
  RETAIL_PRIVACY_TEXT,
  RETAIL_REGISTRATION_DEMO_HINTS,
  RETAIL_TERMS_TEXT,
  generateRetailUserId,
  getLinkedAccountById,
  maskCustomerId,
  maskRegisteredMobile,
  maskUserId,
  simulateRegistrationSubmit,
  simulateSimVerification,
  validateMpin,
  validateTpin,
  verifyRegistrationOtp,
} from '../../../data/retailRegistrationMock';
import { playPaymentSuccessSound } from '../../../utils/paymentSuccessFeedback';
import { BharatBankLogo } from '../../common/BharatBankLogo';
import { BottomSheet } from '../../common/BottomSheet';
import { OtpInput } from '../corporate/otp/OtpInput';
import { OtpTimer } from '../corporate/otp/OtpTimer';
import {
  MpinInput,
  RegChecklist,
  RegDemoHint,
  RegErrorIcon,
  RegInfoRow,
  RegLegalLink,
  RegLoadingState,
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
  termsAccepted: false,
  selectedSimId: null,
  registeredMobile: '',
  simVerified: false,
  selectedAccountId: '',
  customerId: '',
  accountNumber: '',
  accountType: '',
  userId: '',
  profileCode: 'P1',
  mpin: '',
  tpin: '',
};

const EMPTY_OTP = ['', '', '', '', '', ''];

export const RetailRegistrationModule: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, completeRetailRegistration, setBankingType, setAuthScreen } = useBanking();

  const [step, setStep] = useState<RetailRegistrationStep>('welcome');
  const [draft, setDraft] = useState<RetailRegistrationDraft>(INITIAL_DRAFT);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);

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
  const [showLegal, setShowLegal] = useState<'terms' | 'privacy' | 'mobile' | null>(null);

  const successSoundPlayed = useRef(false);
  const pendingBack = useRef<(() => void) | null>(null);

  const maskedMobile = draft.registeredMobile
    ? maskRegisteredMobile(draft.registeredMobile)
    : maskRegisteredMobile(RETAIL_DEMO_SIMS[0].mobile);

  useEffect(() => {
    setBankingType('retail');
  }, [setBankingType]);

  useEffect(() => {
    if (step !== 'sim_processing') return;
    let cancelled = false;
    simulateSimVerification(draft.selectedSimId).then(({ success, mobile }) => {
      if (cancelled) return;
      if (success && mobile) {
        setDraft((d) => ({ ...d, simVerified: true, registeredMobile: mobile }));
        setStep('sim_success');
      } else {
        setStep('sim_failed');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [step, draft.selectedSimId]);

  useEffect(() => {
    if (step !== 'processing') return;
    let cancelled = false;
    simulateRegistrationSubmit().then(({ success }) => {
      if (cancelled) return;
      if (success) {
        completeRetailRegistration({
          userId: draft.userId.trim(),
          profileCode: draft.profileCode,
          customerId: draft.customerId,
          accountNumber: draft.accountNumber,
          mpinSet: draft.mpin.length === 6,
          tpinSet: draft.tpin.length === 4,
          method: 'sim_verify',
        });
        setStep('complete');
      } else {
        setNetworkError(true);
        setStep('tpin');
      }
    });
    return () => {
      cancelled = true;
    };
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

  const goToAccountOrOtp = useCallback(() => {
    if (RETAIL_LINKED_ACCOUNTS.length === 1) {
      const account = RETAIL_LINKED_ACCOUNTS[0];
      setDraft((d) => ({
        ...d,
        selectedAccountId: account.id,
        customerId: account.customerId,
        accountNumber: account.accountNumber,
        accountType: account.type,
        userId: d.userId || generateRetailUserId(),
      }));
      setOtpDigits([...EMPTY_OTP]);
      setOtpResendSeconds(RETAIL_OTP_RESEND_SECONDS);
      setOtpError('');
      setOtpAttempts(0);
      setOtpLocked(false);
      setStep('otp');
    } else {
      setStep('select_account');
    }
  }, []);

  const goBack = useCallback(() => {
    setError('');
    switch (step) {
      case 'welcome':
        navigate('/');
        break;
      case 'terms':
        setStep('welcome');
        break;
      case 'sim_select':
        setStep('terms');
        break;
      case 'sim_success':
        setStep('sim_select');
        break;
      case 'sim_failed':
        setStep('sim_select');
        break;
      case 'select_account':
        setStep('sim_success');
        break;
      case 'otp':
        setStep('select_account');
        break;
      case 'mpin':
        setStep('otp');
        break;
      case 'tpin':
        setStep('mpin');
        break;
      default:
        navigate('/');
    }
  }, [step, navigate]);

  const requestBack = useCallback(
    (action: () => void) => {
      if (['welcome', 'sim_processing', 'processing', 'complete'].includes(step)) {
        action();
        return;
      }
      pendingBack.current = action;
      setShowExit(true);
    },
    [step]
  );

  const handleTermsContinue = () => {
    if (!draft.termsAccepted) return;
    setStep('sim_select');
  };

  const handleVerifySim = () => {
    if (!draft.selectedSimId) {
      setError('Please select a SIM to verify.');
      return;
    }
    setError('');
    setStep('sim_processing');
  };

  const handleAccountContinue = () => {
    if (!draft.selectedAccountId) {
      setError('Please select an account to activate.');
      return;
    }
    const account = getLinkedAccountById(draft.selectedAccountId);
    if (!account) {
      setError('Selected account could not be loaded.');
      return;
    }
    setError('');
    setDraft((d) => ({
      ...d,
      customerId: account.customerId,
      accountNumber: account.accountNumber,
      accountType: account.type,
      userId: d.userId || generateRetailUserId(),
    }));
    setOtpDigits([...EMPTY_OTP]);
    setOtpResendSeconds(RETAIL_OTP_RESEND_SECONDS);
    setOtpError('');
    setOtpAttempts(0);
    setOtpLocked(false);
    setStep('otp');
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
    addToast({ type: 'info', title: 'OTP Sent', message: `A new OTP has been sent to ${maskedMobile}.` });
  };

  const handleMpinContinue = () => {
    const err = validateMpin(draft.mpin, confirmMpin);
    if (err) {
      setMpinError(err);
      return;
    }
    setMpinError('');
    setStep('tpin');
  };

  const handleTpinContinue = () => {
    const err = validateTpin(draft.tpin, confirmTpin);
    if (err) {
      setTpinError(err);
      return;
    }
    setTpinError('');
    setNetworkError(false);
    setStep('processing');
  };

  const handleGoToLogin = () => {
    setAuthScreen('login');
    navigate('/', { state: { customerId: draft.userId.trim() } });
  };

  const renderStep = () => {
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
              <RegPrimaryButton label="Register / Activate Mobile Banking" onClick={() => setStep('terms')} />
              <RegSecondaryButton label="Login" onClick={() => navigate('/')} />
            </RegStickyFooter>
          </div>
        );

      case 'terms':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Terms & Conditions" subtitle="Please review and accept to continue registration." />
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
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={handleTermsContinue} disabled={!draft.termsAccepted} />
            </RegStickyFooter>
          </div>
        );

      case 'sim_select':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle
                title="Select SIM to Verify"
                subtitle="Choose the SIM registered with your bank account on this device."
              />
              <div className="px-4 space-y-3">
                {RETAIL_DEMO_SIMS.map((sim) => (
                  <RegSelectCard
                    key={sim.id}
                    selected={draft.selectedSimId === sim.id}
                    icon={<CardSim className="w-5 h-5" strokeWidth={1.75} />}
                    title={`SIM ${sim.id === 'sim1' ? '1' : '2'} — ${sim.carrier}`}
                    description={maskRegisteredMobile(sim.mobile)}
                    badge={sim.isRegistered ? 'Bank registered' : undefined}
                    onSelect={() => {
                      setDraft((d) => ({ ...d, selectedSimId: sim.id as SimSlotId }));
                      setError('');
                    }}
                  />
                ))}
                <RegChecklist
                  items={[
                    'Selected SIM is inserted in this device',
                    'Mobile network is available',
                    'Required SMS permission is enabled',
                  ]}
                />
                <RegDemoHint title={RETAIL_REGISTRATION_DEMO_HINTS.sim.title} lines={RETAIL_REGISTRATION_DEMO_HINTS.sim.lines} />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Verify Selected SIM" onClick={handleVerifySim} disabled={!draft.selectedSimId} />
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
              <RegTitle centered title="SIM Verified" subtitle="Your registered mobile number has been verified successfully." />
              <p className="text-lg font-bold tracking-wide text-[#005DD4] mb-8">{maskedMobile}</p>
            </motion.div>
            <RegPrimaryButton label="Continue" onClick={goToAccountOrOtp} />
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
                subtitle="The selected SIM does not match the mobile number registered with your bank."
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
              <RegPrimaryButton label="Try Again" onClick={() => setStep('sim_select')} />
              <RegTextButton label="Need Help?" onClick={() => setShowHelp(true)} className="w-full text-center py-1" />
            </RegStickyFooter>
          </div>
        );

      case 'select_account':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle
                title="Select Account to Activate"
                subtitle="Multiple accounts are linked to your verified mobile number. Choose one to activate mobile banking."
              />
              <div className="px-4 space-y-3">
                {RETAIL_LINKED_ACCOUNTS.map((account) => (
                  <RegSelectCard
                    key={account.id}
                    selected={draft.selectedAccountId === account.id}
                    icon={<Landmark className="w-5 h-5" />}
                    title={account.type}
                    description={`Account ${account.maskedAccount} · ${maskCustomerId(account.customerId)}`}
                    onSelect={() => {
                      setDraft((d) => ({ ...d, selectedAccountId: account.id }));
                      setError('');
                    }}
                  />
                ))}
                <RegDemoHint
                  title={RETAIL_REGISTRATION_DEMO_HINTS.account.title}
                  lines={RETAIL_REGISTRATION_DEMO_HINTS.account.lines}
                />
                {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Continue" onClick={handleAccountContinue} disabled={!draft.selectedAccountId} />
            </RegStickyFooter>
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
              <RegPrimaryButton label="Back to Account Selection" onClick={() => setStep('select_account')} />
            </div>
          );
        }
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle title="Verify Mobile Number" subtitle={`OTP sent to ${maskedMobile}`} />
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
              <RegTitle title="Set Your MPIN" subtitle="Create a 6-digit MPIN for secure mobile banking login." />
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

      case 'tpin':
        return (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <RegTitle
                title="Set Your TPIN"
                subtitle="Create a 4-digit transaction PIN to authorize payments and transfers."
              />
              <div className="px-4 space-y-6">
                <MpinInput
                  label="TPIN"
                  value={draft.tpin}
                  onChange={(v) => {
                    setDraft((d) => ({ ...d, tpin: v }));
                    setTpinError('');
                  }}
                  length={4}
                />
                <MpinInput
                  label="Confirm TPIN"
                  value={confirmTpin}
                  onChange={(v) => {
                    setConfirmTpin(v);
                    setTpinError('');
                  }}
                  length={4}
                  error={tpinError}
                />
                {networkError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                    <WifiOff className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Connection Error</p>
                      <p className="text-xs text-red-600 mt-0.5">Please try again to complete registration.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <RegStickyFooter>
              <RegPrimaryButton label="Complete Registration" onClick={handleTpinContinue} />
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
                <RegInfoRow
                  label="Account"
                  value={`${draft.accountType}${getLinkedAccountById(draft.selectedAccountId) ? ` · ${getLinkedAccountById(draft.selectedAccountId)!.maskedAccount}` : ''}`}
                />
                <RegInfoRow label="Customer ID" value={maskCustomerId(draft.customerId)} />
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
      {showBack && <RegTopBar onBack={() => requestBack(goBack)} />}
      <main className="flex-1 flex flex-col min-h-0">{renderStep()}</main>

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
        </div>
      </BottomSheet>

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
    </RegShell>
  );
};
