import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Building2,
  ArrowRight,
  Fingerprint,
  Smartphone,
  ChevronLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankingType } from '../../types/banking';
import { BharatBankLogo } from '../common/BharatBankLogo';
import { NumericPinInput } from '../common/NumericPinInput';
import {
  CORPORATE_DEMO_ID,
  CORPORATE_DEMO_HINT,
} from '../../data/corporateAuthMock';
import { authenticateCorporate } from '../../services/corporateLoginService';

function isCorporateUserId(userId: string): boolean {
  const uid = userId.trim().toUpperCase();
  return uid.startsWith('MAK-') || uid.startsWith('CHK-') || uid.startsWith('ADM-');
}

export const AuthContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    authScreen,
    setAuthScreen,
    setBankingType,
    login,
    addToast,
    setPendingCorporateUser,
    setCorporateLoginVerified,
    clearSessionExpired,
  } = useBanking();

  const [selectedType, setSelectedType] = useState<BankingType>('retail');
  const [corporateId, setCorporateId] = useState('');
  const [customerId, setCustomerId] = useState('RB-123456');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const state = location.state as { retailUserId?: string } | null;
    if (state?.retailUserId) {
      setCorporateId('');
      setCustomerId(state.retailUserId);
      setSelectedType('retail');
      setBankingType('retail');
      setAuthScreen('login');
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setBankingType, setAuthScreen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim() || !password) {
      addToast({
        type: 'error',
        title: 'Input Missing',
        message: 'Please provide User ID and password.',
      });
      return;
    }

    const isCorporate = corporateId.trim().length > 0 || isCorporateUserId(customerId);

    if (isCorporate) {
      const corpId = corporateId.trim() || CORPORATE_DEMO_ID;
      setIsLoggingIn(true);
      const authenticated = await authenticateCorporate({
        corporateId: corpId,
        userId: customerId,
        password,
      });
      setIsLoggingIn(false);

      if (!authenticated) {
        addToast({
          type: 'error',
          title: 'Unable to sign in',
          message: 'Please check your Corporate ID, User ID and password.',
        });
        return;
      }

      setPendingCorporateUser(authenticated);
      setBankingType('corporate');
      setSelectedType('corporate');
      clearSessionExpired();
      setCorporateLoginVerified(true);
      navigate('/corporate/otp');
      return;
    }

    setBankingType('retail');
    setSelectedType('retail');
    setAuthScreen('otp');
  };

  const handleVerifyOtp = () => {
    setAuthScreen('biometric');
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      login('retail', customerId);
    }, 1200);
  };

  const fillDemo = (type: 'retail' | 'maker' | 'checker') => {
    if (type === 'retail') {
      setCorporateId('');
      setCustomerId('RB-123456');
      setPassword('demo123');
      setSelectedType('retail');
    } else if (type === 'maker') {
      setCorporateId(CORPORATE_DEMO_ID);
      setCustomerId('MAK-1001');
      setPassword('demo123');
      setSelectedType('corporate');
    } else {
      setCorporateId(CORPORATE_DEMO_ID);
      setCustomerId('CHK-1001');
      setPassword('demo123');
      setSelectedType('corporate');
    }
    addToast({
      type: 'info',
      title: 'Demo credentials loaded',
      message: type === 'retail' ? 'Retail login' : type === 'maker' ? 'Finance Maker' : 'Finance Checker',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/20 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {authScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-4 z-10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <BharatBankLogo variant="full" size="md" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sign in to Mobile Banking
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Bharat Co-operative Bank (Mumbai) Ltd • Retail & Corporate Banking
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Corporate ID <span className="font-normal text-slate-400">(for business users)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={corporateId}
                      onChange={(e) => setCorporateId(e.target.value)}
                      placeholder={CORPORATE_DEMO_ID}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-xs"
                    />
                    <span className="absolute right-3.5 top-3.5 text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    User ID / Customer ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      placeholder="RB-123456 or MAK-1001"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-xs"
                      required
                    />
                    <span className="absolute right-3.5 top-3.5 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                    <button type="button" className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="demo123"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-xs"
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
                </div>

                <p className="text-[11px] text-[#0B5CAB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-xl px-3 py-2 leading-relaxed">
                  {CORPORATE_DEMO_HINT}
                </p>

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <span>{isLoggingIn ? 'Signing in…' : 'Sign In'}</span>
                    {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/retail/register')}
                    className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-blue-600 dark:text-blue-400"
                  >
                    Register for Mobile Banking
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-900">
              <p className="text-[11px] text-slate-500 text-center mb-2.5 font-medium">Demo credentials</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('retail')}
                  className="py-2 px-2 rounded-xl text-[10px] font-bold border bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                  Retail
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('maker')}
                  className="py-2 px-2 rounded-xl text-[10px] font-bold border bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300"
                >
                  Maker
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('checker')}
                  className="py-2 px-2 rounded-xl text-[10px] font-bold border bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                >
                  Checker
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {authScreen === 'otp' && selectedType === 'retail' && (
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

        {authScreen === 'biometric' && selectedType === 'retail' && (
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
              onClick={() => login('retail', customerId)}
              className="w-full py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl"
            >
              Skip to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
