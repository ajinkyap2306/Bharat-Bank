import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Fingerprint,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { BottomSheet } from '../../common/BottomSheet';
import type {
  RetailRegistrationDraft,
  RetailRegistrationMethod,
  RetailRegistrationStep,
} from '../../../types/retailRegistration';
import {
  CODE_CARD_HOW_TO_OBTAIN,
  CODE_CARD_WHAT_IS,
  RETAIL_DEMO_AUTO_OTP,
  RETAIL_TERMS_TEXT,
  SECURITY_QUESTIONS,
  formatCardNumberDisplay,
  generateRetailUserId,
  normalizeCardNumber,
  validateDebitCardAuth,
  validatePanCardCode,
} from '../../../data/retailRegistrationMock';
import {
  MpinInput,
  RegCodePairInput,
  RegField,
  RegInfoLink,
  RegPrimaryButton,
  RegRadioOption,
  RegSecondaryButton,
  RegShell,
  RegTitle,
  RegTopBar,
} from './shared/RetailRegistrationUI';

const INITIAL_DRAFT: RetailRegistrationDraft = {
  method: null,
  cardNumber: '',
  atmPin: '',
  pan: '',
  codeA: '',
  codeJ: '',
  codeL: '',
  termsAccepted: false,
  assignedUserId: '',
  profileCode: 'P1',
  mpin: '',
  biometricEnabled: false,
  securityAnswers: [],
  securitySkipCount: 0,
  deviceSeedStored: false,
};

const OTP_RESEND_SECONDS = 45;

export const RetailRegistrationModule: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, completeRetailRegistration, setBankingType, setAuthScreen } = useBanking();

  const [step, setStep] = useState<RetailRegistrationStep>('method');
  const [draft, setDraft] = useState<RetailRegistrationDraft>(INITIAL_DRAFT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Debit OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // Terms scroll
  const termsRef = useRef<HTMLDivElement>(null);
  const [termsScrolled, setTermsScrolled] = useState(false);

  // Device setup animation
  const [deviceSteps, setDeviceSteps] = useState([false, false, false]);

  // MPIN confirm
  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinError, setMpinError] = useState('');

  // Security questions local state
  const [sq1, setSq1] = useState('');
  const [sq2, setSq2] = useState('');
  const [sq3, setSq3] = useState('');
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [ans3, setAns3] = useState('');

  // Code card sheets
  const [showWhatIsCodeCard, setShowWhatIsCodeCard] = useState(false);
  const [showKnowCodeCard, setShowKnowCodeCard] = useState(false);

  useEffect(() => {
    setBankingType('retail');
  }, [setBankingType]);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  useEffect(() => {
    if (step !== 'device') return;
    setDeviceSteps([false, false, false]);
    const t1 = setTimeout(() => setDeviceSteps([true, false, false]), 800);
    const t2 = setTimeout(() => setDeviceSteps([true, true, false]), 1600);
    const t3 = setTimeout(() => {
      setDeviceSteps([true, true, true]);
      setDraft((d) => ({ ...d, deviceSeedStored: true }));
    }, 2400);
    const t4 = setTimeout(() => {
      const userId = generateRetailUserId();
      setDraft((d) => ({ ...d, assignedUserId: userId }));
      setStep('user_id');
    }, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [step]);

  const goBack = useCallback(() => {
    setError('');
    switch (step) {
      case 'method':
        navigate('/');
        break;
      case 'debit_auth':
      case 'pan_auth':
        setStep('method');
        break;
      case 'terms':
        setStep(draft.method === 'debit_card' ? 'debit_auth' : 'pan_auth');
        break;
      case 'user_id':
        setStep('terms');
        break;
      case 'mpin':
        setStep('user_id');
        break;
      case 'biometric':
        setStep('mpin');
        break;
      case 'security':
        setStep('biometric');
        break;
      default:
        navigate('/');
    }
  }, [step, draft.method, navigate]);

  const proceedAfterAuth = () => {
    setError('');
    setTermsScrolled(false);
    setDraft((d) => ({ ...d, termsAccepted: false }));
    setStep('terms');
  };

  const handleMethodContinue = () => {
    if (!draft.method) {
      setError('Select a registration method to continue.');
      return;
    }
    setError('');
    setStep(draft.method === 'debit_card' ? 'debit_auth' : 'pan_auth');
  };

  const handleGetOtp = () => {
    const err = validateDebitCardAuth(draft.cardNumber, draft.atmPin);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setOtpSent(true);
    setOtpTimer(OTP_RESEND_SECONDS);
    setTimeout(() => {
      setOtpValue(RETAIL_DEMO_AUTO_OTP);
      addToast({ type: 'success', title: 'OTP auto-captured', message: 'Verification code received on this device.' });
    }, 900);
  };

  const handleDebitContinue = () => {
    const err = validateDebitCardAuth(draft.cardNumber, draft.atmPin);
    if (err) {
      setError(err);
      return;
    }
    if (!otpSent || otpValue !== RETAIL_DEMO_AUTO_OTP) {
      setError('Request and verify OTP before continuing.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      proceedAfterAuth();
    }, 600);
  };

  const handlePanContinue = () => {
    const result = validatePanCardCode(draft.pan, draft.codeA, draft.codeJ, draft.codeL);
    if (result.cooling) {
      setStep('cooling_period');
      return;
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      proceedAfterAuth();
    }, 600);
  };

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (atBottom) setTermsScrolled(true);
  };

  const handleTermsContinue = () => {
    if (!termsScrolled) {
      setError('Scroll to the bottom of the terms to enable acceptance.');
      return;
    }
    if (!draft.termsAccepted) {
      setError('Please accept the Terms & Conditions.');
      return;
    }
    setError('');
    setStep('device');
  };

  const handleMpinContinue = () => {
    if (draft.mpin.length !== 6) {
      setMpinError('MPIN must be 6 digits.');
      return;
    }
    if (draft.mpin !== confirmMpin) {
      setMpinError('MPIN and confirmation do not match.');
      return;
    }
    setMpinError('');
    setStep('biometric');
  };

  const handleBiometricEnable = () => {
    setDraft((d) => ({ ...d, biometricEnabled: true }));
    addToast({ type: 'success', title: 'Biometric enabled', message: 'Fingerprint login is now available.' });
    setStep('security');
  };

  const handleBiometricSkip = () => {
    setDraft((d) => ({ ...d, biometricEnabled: false }));
    setStep('security');
  };

  const handleSecuritySave = () => {
    if (!sq1 || !sq2 || !sq3 || !ans1.trim() || !ans2.trim() || !ans3.trim()) {
      setError('Select 3 questions and provide answers.');
      return;
    }
    if (new Set([sq1, sq2, sq3]).size < 3) {
      setError('Please choose 3 different security questions.');
      return;
    }
    setError('');
    finishRegistration([
      { questionId: sq1, answer: ans1.trim() },
      { questionId: sq2, answer: ans2.trim() },
      { questionId: sq3, answer: ans3.trim() },
    ]);
  };

  const handleSecuritySkip = () => {
    const nextSkip = draft.securitySkipCount + 1;
    if (nextSkip >= 3) {
      setError('Security questions are now mandatory after 3 skips.');
      return;
    }
    setDraft((d) => ({ ...d, securitySkipCount: nextSkip }));
    addToast({
      type: 'warning',
      title: 'Security questions skipped',
      message: `Reminder ${nextSkip}/3 — set them later from Profile → Security.`,
    });
    finishRegistration([]);
  };

  const finishRegistration = (answers: RetailRegistrationDraft['securityAnswers']) => {
    const result = {
      userId: draft.assignedUserId,
      profileCode: draft.profileCode,
      mpinSet: draft.mpin.length === 6,
      biometricEnabled: draft.biometricEnabled,
      method: draft.method!,
      securityAnswers: answers,
    };
    completeRetailRegistration(result);
    setStep('complete');
  };

  const handleGoToLogin = () => {
    setAuthScreen('login');
    navigate('/', { state: { retailUserId: draft.assignedUserId } });
  };

  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <>
            <RegTitle
              title="Register for Mobile Banking"
              subtitle="Choose how you would like to verify your identity with Bharat Co-operative Bank."
            />
            <div className="px-4 space-y-3">
              <RegRadioOption
                selected={draft.method === 'debit_card'}
                title="Debit Card"
                description="Card Number + ATM PIN + OTP"
                onSelect={() => setDraft((d) => ({ ...d, method: 'debit_card' }))}
              />
              <RegRadioOption
                selected={draft.method === 'pan_card_code'}
                title="PAN + Card Code"
                description="PAN + 3 Card Code values (A, J, L)"
                onSelect={() => setDraft((d) => ({ ...d, method: 'pan_card_code' }))}
              />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <div className="pt-2">
                <RegPrimaryButton label="Continue" onClick={handleMethodContinue} />
              </div>
            </div>
          </>
        );

      case 'debit_auth':
        return (
          <>
            <RegTitle
              title="Debit Card Authentication"
              subtitle="Verify your debit card to register for Mobile Banking."
            />
            <div className="px-4 space-y-4">
              <RegField
                label="Card Number"
                value={formatCardNumberDisplay(draft.cardNumber)}
                onChange={(v) => setDraft((d) => ({ ...d, cardNumber: normalizeCardNumber(v) }))}
                placeholder="4532 1234 5678 9010"
                inputMode="numeric"
                hint="Demo: 4532 1234 5678 9010"
              />
              <RegField
                label="ATM PIN"
                type="password"
                value={draft.atmPin}
                onChange={(v) => setDraft((d) => ({ ...d, atmPin: v.replace(/\D/g, '').slice(0, 4) }))}
                placeholder="••••"
                inputMode="numeric"
                maxLength={4}
                hint="Demo PIN: 1234"
              />
              <RegSecondaryButton
                label={otpSent ? `Resend OTP in 0:${String(otpTimer).padStart(2, '0')}` : 'Get OTP'}
                onClick={handleGetOtp}
                disabled={otpSent && otpTimer > 0}
              />
              <RegField
                label="OTP"
                value={otpValue}
                onChange={() => {}}
                readOnly
                placeholder="Auto Captured"
                hint={otpSent ? 'OTP is auto-captured on this device for demo.' : 'Tap Get OTP to receive code.'}
              />
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Having trouble receiving OTP?{' '}
                <button
                  type="button"
                  className="text-blue-600 font-semibold"
                  onClick={() => {
                    setDraft((d) => ({ ...d, method: 'pan_card_code' }));
                    setStep('pan_auth');
                    setError('');
                  }}
                >
                  Use the PAN &amp; Card Code option to register.
                </button>
              </p>
              <RegPrimaryButton label="Continue" onClick={handleDebitContinue} loading={loading} />
            </div>
          </>
        );

      case 'pan_auth':
        return (
          <>
            <RegTitle
              title="PAN & Card Code"
              subtitle="Enter your PAN and the values printed in boxes A, J, and L on your CODE CARD."
            />
            <div className="px-4 space-y-4">
              <RegField
                label="PAN"
                value={draft.pan}
                onChange={(v) => setDraft((d) => ({ ...d, pan: v.toUpperCase().slice(0, 10) }))}
                placeholder="ABCDE1234F"
                hint="Demo: ABCDE1234F"
              />
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Enter values printed in the boxes A, J, L on the CODE CARD
                </p>
                <div className="flex justify-center gap-6">
                  <RegCodePairInput label="A" value={draft.codeA} onChange={(v) => setDraft((d) => ({ ...d, codeA: v }))} />
                  <RegCodePairInput label="J" value={draft.codeJ} onChange={(v) => setDraft((d) => ({ ...d, codeJ: v }))} />
                  <RegCodePairInput label="L" value={draft.codeL} onChange={(v) => setDraft((d) => ({ ...d, codeL: v }))} />
                </div>
                <p className="text-[11px] text-slate-500 text-center mt-2">Each value is 2 digits. Demo: 12 / 34 / 56</p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <RegInfoLink label="What is CODE CARD?" onClick={() => setShowWhatIsCodeCard(true)} />
                <RegInfoLink label="Know about Card Code" onClick={() => setShowKnowCodeCard(true)} />
              </div>
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Continue" onClick={handlePanContinue} loading={loading} />
            </div>
          </>
        );

      case 'cooling_period':
        return (
          <div className="px-4 py-8 text-center">
            <RegTitle
              title="Registration Cooling Period"
              subtitle="Your branch registration is active but the cooling period has not ended yet."
            />
            <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-5 text-left space-y-2">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Cooling period in effect</p>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Registration details were submitted at your branch. Mobile Banking registration will be available after the
                cooling period ends (demo: 30 minutes). Transaction limit during cooling: ₹50,000.
              </p>
            </div>
            <div className="pt-6 space-y-2">
              <RegPrimaryButton label="Back to Registration" onClick={() => setStep('method')} />
              <RegSecondaryButton label="Return to Login" onClick={() => navigate('/')} />
            </div>
          </div>
        );

      case 'terms':
        return (
          <>
            <RegTitle title="Terms & Conditions" subtitle="Please read and accept to continue registration." />
            <div className="px-4 flex-1 flex flex-col min-h-0">
              <div
                ref={termsRef}
                onScroll={handleTermsScroll}
                className="flex-1 max-h-[45vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap"
              >
                {RETAIL_TERMS_TEXT}
              </div>
              <label
                className={`flex items-start gap-3 mt-4 p-3 rounded-xl border transition-colors ${
                  draft.termsAccepted
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                    : termsScrolled
                      ? 'border-slate-300 dark:border-slate-700'
                      : 'border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={draft.termsAccepted}
                  disabled={!termsScrolled}
                  onChange={(e) => setDraft((d) => ({ ...d, termsAccepted: e.target.checked }))}
                  className="mt-0.5"
                />
                <span className="text-xs font-semibold">I Accept Terms &amp; Conditions</span>
              </label>
              {error && <p className="text-xs text-red-600 font-medium mt-2">{error}</p>}
              {!termsScrolled && (
                <p className="text-[11px] text-slate-500 mt-2">Scroll to the bottom to enable acceptance.</p>
              )}
              <div className="pt-4 pb-6">
                <RegPrimaryButton label="Continue" onClick={handleTermsContinue} disabled={!draft.termsAccepted} />
              </div>
            </div>
          </>
        );

      case 'device':
        return (
          <div className="px-4 py-8 text-center">
            <RegTitle title="Setting up your device..." subtitle="Encrypting device seed for secure identification." />
            <div className="space-y-3 max-w-xs mx-auto text-left">
              {[
                'Registration verified',
                'Device identified',
                'Mobile Banking activated',
              ].map((label, i) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${deviceSteps[i] ? 'text-emerald-500' : 'text-slate-300'}`}
                  />
                  <span className={`text-sm font-semibold ${deviceSteps[i] ? '' : 'text-slate-400'}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'user_id':
        return (
          <div className="px-4 py-6 text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <RegTitle title="Registration Successful" subtitle="Your User ID has been allotted. Profile P1 has been created." />
              <p className="text-xs text-slate-500 mb-1">Your User ID</p>
              <p className="text-3xl font-mono font-extrabold tracking-wider text-blue-600 mb-6">
                {draft.assignedUserId}
              </p>
              <RegPrimaryButton label="Continue" onClick={() => setStep('mpin')} />
            </motion.div>
          </div>
        );

      case 'mpin':
        return (
          <>
            <RegTitle title="Create MPIN" subtitle="Set a 6-digit numeric MPIN for secure login." />
            <div className="px-4 space-y-6">
              <MpinInput
                label="Enter 6-digit MPIN"
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
              subtitle="Use your fingerprint to securely access Mobile Banking on this device."
            />
            <div className="w-full max-w-sm space-y-2 mt-4">
              <RegPrimaryButton label="Enable Biometric" onClick={handleBiometricEnable} />
              <RegSecondaryButton label="Skip for now" onClick={handleBiometricSkip} />
            </div>
          </div>
        );

      case 'security':
        return (
          <>
            <RegTitle
              title="Security Questions"
              subtitle="Choose and answer at least 3 security questions. You may skip for now (reminder after 3 skips)."
            />
            <div className="px-4 space-y-4 pb-8">
              {[
                { q: sq1, setQ: setSq1, a: ans1, setA: setAns1, n: 1 },
                { q: sq2, setQ: setSq2, a: ans2, setA: setAns2, n: 2 },
                { q: sq3, setQ: setSq3, a: ans3, setA: setAns3, n: 3 },
              ].map(({ q, setQ, a, setA, n }) => (
                <div key={n} className="space-y-2">
                  <label className="text-xs font-bold">Question {n}</label>
                  <select
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-3 text-sm min-h-11"
                  >
                    <option value="">Select Question</option>
                    {SECURITY_QUESTIONS.map((sq) => (
                      <option key={sq.id} value={sq.id}>
                        {sq.text}
                      </option>
                    ))}
                  </select>
                  <RegField label="Answer" value={a} onChange={setA} placeholder="Your answer" />
                </div>
              ))}
              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
              <RegPrimaryButton label="Save" onClick={handleSecuritySave} />
              <RegSecondaryButton
                label={draft.securitySkipCount >= 2 ? 'Skip (mandatory next time)' : 'Skip for now'}
                onClick={handleSecuritySkip}
                disabled={draft.securitySkipCount >= 3}
              />
            </div>
          </>
        );

      case 'complete':
        return (
          <div className="px-4 py-10 text-center">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-extrabold">Registration Complete</h1>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                Mobile Banking is ready. Sign in with User ID <strong className="font-mono">{draft.assignedUserId}</strong> and
                your 6-digit MPIN.
              </p>
              <div className="mt-8 space-y-2 max-w-sm mx-auto">
                <RegPrimaryButton label="Go to Login" onClick={handleGoToLogin} />
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  const showBack = !['device', 'complete', 'cooling_period'].includes(step);

  return (
    <RegShell>
      {showBack && <RegTopBar onBack={goBack} />}
      <main className="flex-1 flex flex-col pb-6">{renderStep()}</main>

      <BottomSheet isOpen={showWhatIsCodeCard} onClose={() => setShowWhatIsCodeCard(false)} title="What is CODE CARD?">
        <div className="px-4 pb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{CODE_CARD_WHAT_IS}</p>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showKnowCodeCard} onClose={() => setShowKnowCodeCard(false)} title="Know about Card Code">
        <div className="px-4 pb-6 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{CODE_CARD_HOW_TO_OBTAIN}</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Visit your home branch if you need a replacement Code Card.</span>
          </div>
        </div>
      </BottomSheet>
    </RegShell>
  );
};
