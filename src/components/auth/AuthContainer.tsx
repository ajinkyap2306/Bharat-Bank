import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Fingerprint,
  KeyRound,
  Lock,
  Smartphone,
  ChevronLeft,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BharatBankLogo } from '../common/BharatBankLogo';
import { NumericPinInput } from '../common/NumericPinInput';
import { findCorporateDemoUserByCustomerIdOnly } from '../../data/corporateAuthMock';
import { authenticateCorporate } from '../../services/corporateLoginService';
import { isCorporateCustomerId } from '../../utils/customerId';
import { PreLoginQuickLinks } from './prelogin/PreLoginModule';
import { LoginPromoBanner } from './prelogin/LoginPromoBanner';
import { PreLoginTicker } from './prelogin/PreLoginTicker';
import { LoginOfferSheet } from './prelogin/LoginOfferSheet';
import { AuthSplashScreen } from './AuthSplashScreen';
import { LoginDemoPicker, type LoginDemoPersona } from './LoginDemoPicker';
import { getRetailJointUserByCustomerNumber } from '../../data/retailJointTransferMock';

type LoginPersona = LoginDemoPersona;
type LoginMethod = 'password' | 'mpin' | 'fingerprint';

const RETAIL_DEMO_USER_ID = 'RB-123456';
const MAKER_DEMO_USER_ID = 'C001';
const CHECKER_DEMO_USER_ID = 'C002';
const DEMO_MPIN = '123456';

const PERSONA_CUSTOMER_IDS: Record<LoginPersona, string> = {
  retail: RETAIL_DEMO_USER_ID,
  rahul: 'RB-RAHUL01',
  amit: 'RB-AMIT01',
  maker: MAKER_DEMO_USER_ID,
  checker: CHECKER_DEMO_USER_ID,
};

export const AuthContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    authScreen,
    setAuthScreen,
    setBankingType,
    setRetailSessionFromLogin,
    login,
    addToast,
    setPendingCorporateUser,
    setCorporateLoginVerified,
    clearSessionExpired,
  } = useBanking();

  const [loginPersona, setLoginPersona] = useState<LoginPersona>('retail');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [customerId, setCustomerId] = useState(RETAIL_DEMO_USER_ID);
  const [password, setPassword] = useState('demo123');
  const [mpin, setMpin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const state = location.state as { retailUserId?: string; customerId?: string } | null;
    const incomingId = state?.customerId ?? state?.retailUserId;
    if (incomingId) {
      setCustomerId(incomingId);
      setLoginPersona(isCorporateCustomerId(incomingId) ? 'maker' : incomingId.toUpperCase() === 'RB-RAHUL01' ? 'rahul' : incomingId.toUpperCase() === 'RB-AMIT01' ? 'amit' : 'retail');
      setBankingType(isCorporateCustomerId(incomingId) ? 'corporate' : 'retail');
      setAuthScreen('login');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setBankingType, setAuthScreen]);

  const enterCorporateFlow = (id: string) => {
    const user = findCorporateDemoUserByCustomerIdOnly(id);
    if (!user) {
      addToast({
        type: 'error',
        title: 'Unable to sign in',
        message: 'Please check your Customer ID.',
      });
      return false;
    }
    setPendingCorporateUser(user);
    setBankingType('corporate');
    clearSessionExpired();
    setCorporateLoginVerified(true);
    navigate('/corporate/otp');
    return true;
  };

  const completeRetailLogin = (id: string) => {
    setRetailSessionFromLogin(id);
    setBankingType('retail');
    const jointUser = getRetailJointUserByCustomerNumber(id);
    login('retail', jointUser?.name ?? id);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = customerId.trim();
    if (!id) {
      addToast({
        type: 'error',
        title: 'Input Missing',
        message: 'Please enter your Customer ID.',
      });
      return;
    }

    if (loginMethod === 'mpin') {
      if (mpin.length !== 6) {
        addToast({
          type: 'error',
          title: 'Invalid MPIN',
          message: 'Enter your 6-digit MPIN.',
        });
        return;
      }
      if (mpin !== (getRetailJointUserByCustomerNumber(id)?.demoMpin ?? DEMO_MPIN)) {
        addToast({
          type: 'error',
          title: 'Incorrect MPIN',
          message: getRetailJointUserByCustomerNumber(id)
            ? 'Use the demo MPIN shown for this joint holder.'
            : 'Demo MPIN is 123456.',
        });
        return;
      }
      if (isCorporateCustomerId(id)) {
        enterCorporateFlow(id);
        return;
      }
      completeRetailLogin(id);
      return;
    }

    if (loginMethod === 'fingerprint') {
      setIsBiometricScanning(true);
      setTimeout(() => {
        setIsBiometricScanning(false);
        if (isCorporateCustomerId(id)) {
          enterCorporateFlow(id);
        } else {
          completeRetailLogin(id);
        }
      }, 1200);
      return;
    }

    if (!password) {
      addToast({
        type: 'error',
        title: 'Input Missing',
        message: 'Please enter your password.',
      });
      return;
    }

    if (isCorporateCustomerId(id)) {
      setIsLoggingIn(true);
      const authenticated = await authenticateCorporate({
        corporateId: '',
        userId: id,
        password,
      });
      setIsLoggingIn(false);

      if (!authenticated) {
        addToast({
          type: 'error',
          title: 'Unable to sign in',
          message: 'Please check your Customer ID and password.',
        });
        return;
      }

      setPendingCorporateUser(authenticated);
      setBankingType('corporate');
      clearSessionExpired();
      setCorporateLoginVerified(true);
      navigate('/corporate/otp');
      return;
    }

    setBankingType('retail');
    setAuthScreen('otp');
  };

  const handleVerifyOtp = () => {
    setAuthScreen('biometric');
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      completeRetailLogin(customerId.trim());
    }, 1200);
  };

  const fillDemo = (type: LoginPersona) => {
    setLoginPersona(type);
    setCustomerId(PERSONA_CUSTOMER_IDS[type]);
    setPassword('demo123');
    const jointUser = getRetailJointUserByCustomerNumber(PERSONA_CUSTOMER_IDS[type]);
    setMpin(jointUser?.demoMpin ?? DEMO_MPIN);
    setBankingType(type === 'retail' || type === 'rahul' || type === 'amit' ? 'retail' : 'corporate');
    const labels: Record<LoginPersona, string> = {
      retail: 'Retail login',
      rahul: 'Rahul — Initiator',
      amit: 'Amit — Approver',
      maker: 'Finance Maker',
      checker: 'Finance Checker',
    };
    addToast({
      type: 'info',
      title: 'Demo credentials loaded',
      message: labels[type],
    });
  };

  useEffect(() => {
    if (authScreen !== 'login') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [authScreen]);

  const completeSplash = useCallback(() => {
    setAuthScreen('login');
  }, [setAuthScreen]);

  return (
    <div
      className={`bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-white font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200 ${
        authScreen === 'login'
          ? 'h-dvh overflow-hidden p-3 sm:p-4 flex flex-col'
          : 'min-h-screen overflow-y-auto p-4 sm:p-6'
      }`}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/20 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {authScreen === 'splash' && (
          <AuthSplashScreen onComplete={completeSplash} />
        )}

        {authScreen === 'login' && (
          <div className="flex flex-col flex-1 min-h-0">
            <PreLoginTicker fixed />
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col flex-1 min-h-0 max-w-md mx-auto w-full z-10 pt-9 pb-1 safe-bottom overflow-hidden"
            >
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center mb-1.5">
                <BharatBankLogo variant="full" size="sm" />
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sign in to Mobile Banking
              </h2>

              <div className="grid grid-cols-3 gap-1.5 mt-2.5 mb-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {(
                  [
                    { id: 'password' as const, label: 'Password', icon: Lock },
                    { id: 'mpin' as const, label: 'MPIN', icon: KeyRound },
                    { id: 'fingerprint' as const, label: 'Fingerprint', icon: Fingerprint },
                  ] as const
                ).map((method) => {
                  const Icon = method.icon;
                  const active = loginMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setLoginMethod(method.id);
                        setMpin('');
                      }}
                      className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all ${
                        active
                          ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {method.label}
                    </button>
                  );
                })}
              </div>

              <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Customer ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
                      placeholder="RB-123456"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 pr-11 text-sm font-mono font-medium text-slate-900 dark:text-white outline-none shadow-xs"
                      autoComplete="username"
                      required
                    />
                    <span className="absolute right-3.5 top-3.5 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {loginMethod === 'password' ? 'Password' : loginMethod === 'mpin' ? 'MPIN' : 'Biometric'}
                    </label>
                    {loginMethod === 'password' && (
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                    {loginMethod === 'mpin' && (
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-mpin')}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot MPIN?
                      </button>
                    )}
                  </div>

                  {loginMethod === 'password' && (
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="demo123"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-xs"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {loginMethod === 'mpin' && (
                    <div className="px-1">
                      <NumericPinInput
                        value={mpin}
                        onChange={setMpin}
                        length={6}
                        masked
                        autoFocus
                        ariaLabel="6-digit MPIN"
                      />
                      <p className="text-[9px] text-slate-500 text-center mt-1">Demo MPIN: 123456</p>
                    </div>
                  )}

                  {loginMethod === 'fingerprint' && (
                    <div className="flex flex-col items-center py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div
                        className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${
                          isBiometricScanning
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                            : 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30'
                        }`}
                      >
                        <Fingerprint
                          className={`w-7 h-7 ${
                            isBiometricScanning ? 'text-emerald-600' : 'text-blue-600 dark:text-blue-400'
                          }`}
                        />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mt-1.5">
                        {isBiometricScanning ? 'Scanning…' : 'Tap Sign In below to authenticate'}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn || isBiometricScanning}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>
                    {isLoggingIn || isBiometricScanning
                      ? 'Signing in…'
                      : loginMethod === 'fingerprint'
                        ? 'Sign In with Fingerprint'
                        : loginMethod === 'mpin'
                          ? 'Sign In with MPIN'
                          : 'Sign In'}
                  </span>
                  {!isLoggingIn && !isBiometricScanning && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <p className="text-center text-[11px] text-slate-500 mt-1.5">
                New user?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/retail/register')}
                  className="font-bold text-blue-600 dark:text-blue-400"
                >
                  Register for Mobile Banking
                </button>
              </p>

              <LoginPromoBanner onExplore={() => navigate('/prelogin/offers')} />
            </div>

            <div className="shrink-0">
              <PreLoginQuickLinks />
            </div>
          </motion.div>
          </div>
        )}

        {authScreen === 'otp' && !isCorporateCustomerId(customerId) && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-4 z-10"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthScreen('login')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">2-Factor Authentication</h2>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Verify Secure OTP
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6 leading-relaxed">
                A 6-digit one-time code has been sent to registered mobile{' '}
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">+91 98••• •••10</span>
              </p>

              <div className="mb-6 px-1">
                <NumericPinInput
                  value={otp}
                  onChange={setOtp}
                  autoFocus
                  ariaLabel="6-digit one-time password"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <span>Verify & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {authScreen === 'biometric' && !isCorporateCustomerId(customerId) && (
          <motion.div
            key="biometric"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-6 text-center z-10"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Biometric Login</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Authenticate using Face ID or fingerprint to access your accounts.
              </p>
            </div>

            <div className="my-auto py-8">
              <button
                type="button"
                onClick={handleBiometricAuth}
                disabled={isBiometricScanning}
                className="relative w-32 h-32 mx-auto rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500/40 flex items-center justify-center shadow-lg hover:border-blue-500 transition-all group active:scale-95"
              >
                {isBiometricScanning && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-blue-600"
                  />
                )}
                <Fingerprint className={`w-16 h-16 ${isBiometricScanning ? 'text-emerald-600' : 'text-blue-600 dark:text-blue-400'}`} />
              </button>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-4">
                {isBiometricScanning ? 'Scanning…' : 'Tap to Authenticate'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => login('retail', customerId.trim())}
              className="w-full py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl"
            >
              Skip to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {authScreen === 'login' && (
        <>
          <LoginDemoPicker activePersona={loginPersona} onSelect={fillDemo} />
          <LoginOfferSheet onExploreOffers={() => navigate('/prelogin/offers')} />
        </>
      )}
    </div>
  );
};
