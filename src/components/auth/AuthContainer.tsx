import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  ArrowRight, 
  Fingerprint, 
  Smartphone, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  Sparkles,
  ChevronLeft,
  Eye,
  EyeOff,
  QrCode,
  Sun,
  Moon
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { BankingType, AuthScreen } from '../../types/banking';
import { BharatBankLogo } from '../common/BharatBankLogo';

export const AuthContainer: React.FC = () => {
  const { 
    authScreen, 
    setAuthScreen, 
    bankingType, 
    setBankingType, 
    login, 
    quickDemoLogin,
    isDarkMode,
    toggleDarkMode,
    addToast
  } = useBanking();

  const [selectedType, setSelectedType] = useState<BankingType>(bankingType);
  const [customerId, setCustomerId] = useState<string>(bankingType === 'retail' ? 'RB-123456' : 'COP-13456');
  const [password, setPassword] = useState<string>('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['5', '8', '2', '9', '4', '1']);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Set default customerId when type changes
  const handleSelectType = (type: BankingType) => {
    setSelectedType(type);
    setBankingType(type);
    setCustomerId(type === 'retail' ? 'RB-123456' : 'COP-13456');
    setPassword('demo123');
    setAuthScreen('login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !password) {
      addToast({
        type: 'error',
        title: 'Input Missing',
        message: 'Please provide Customer ID and password.'
      });
      return;
    }
    setAuthScreen('otp');
  };

  const handleVerifyOtp = () => {
    setAuthScreen('biometric');
  };

  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      login(selectedType, customerId);
    }, 1200);
  };

  const handleFillDemo = (type: BankingType) => {
    setSelectedType(type);
    setBankingType(type);
    setCustomerId(type === 'retail' ? 'RB-123456' : 'COP-13456');
    setPassword('demo123');
    addToast({
      type: 'info',
      title: 'Demo Filled',
      message: `Loaded ${type === 'retail' ? 'Retail' : 'Corporate'} credentials.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* Background glowing effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/20 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {/* 1. Welcome / Splash Screen */}
        {authScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-8 z-10"
          >
            {/* Top Brand & Theme Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BharatBankLogo variant="full" size="md" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Scheduled Bank
                </span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="my-auto py-8 text-center">
              <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center shadow-xl">
                  <Fingerprint className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                One App. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 dark:from-blue-400 dark:via-teal-300 dark:to-emerald-400">
                  Retail & Corporate Power.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed font-medium">
                Experience seamless personal finances and multi-tier enterprise corporate treasury workflows in a single unified engine.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setAuthScreen('type_select')}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold rounded-2xl shadow-lg shadow-blue-600/25 text-white flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Select Banking Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => quickDemoLogin('retail')}
                  className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Demo Retail</span>
                </button>
                <button
                  onClick={() => quickDemoLogin('corporate')}
                  className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Demo Corporate</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Banking Type Selection */}
        {authScreen === 'type_select' && (
          <motion.div
            key="type_select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-4 z-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setAuthScreen('welcome')}
                className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Choose Banking Experience</h2>
            </div>

            <div className="space-y-4 my-auto">
              {/* Retail Card */}
              <button
                onClick={() => handleSelectType('retail')}
                className="w-full text-left p-5 rounded-3xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-2 border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 transition-all shadow-md group active:scale-98"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
                    Personal Banking
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  Retail Banking
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-3 leading-relaxed">
                  Tailored for individuals and personal wealth management.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Accounts</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Debit & Credit Cards</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">UPI QR</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Deposits & Loans</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">SIPs</span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold">
                  <span>Demo: RB-123456</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Corporate Card */}
              <button
                onClick={() => handleSelectType('corporate')}
                className="w-full text-left p-5 rounded-3xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border-2 border-slate-200/80 dark:border-slate-800 hover:border-teal-500/60 transition-all shadow-md group active:scale-98"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-600/20 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-500/20">
                    Business Banking
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                  Corporate Banking
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-3 leading-relaxed">
                  For businesses, finance teams, makers, checkers & administrators.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Cash Position</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Maker-Checker</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Payroll</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Bulk Payouts</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">Tax & GST</span>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-bold">
                  <span>Demo: COP-13456</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-500">
              Both environments exist seamlessly in this unified binary engine.
            </div>
          </motion.div>
        )}

        {/* 3. Login Screen */}
        {authScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-4 z-10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setAuthScreen('type_select')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs">
                  {selectedType === 'retail' ? (
                    <><User className="w-3.5 h-3.5 text-blue-600" /> Retail Login</>
                  ) : (
                    <><Building2 className="w-3.5 h-3.5 text-teal-600" /> Corporate Portal</>
                  )}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sign in to Bharat Corporate Banking
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                Bharat Co-operative Bank (Mumbai) Ltd • Multi-State Scheduled Bank
              </p>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {selectedType === 'retail' ? 'Customer ID / Username' : 'Corporate User ID'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      placeholder={selectedType === 'retail' ? 'RB-123456' : 'COP-13456'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-xs transition-colors"
                      required
                    />
                    <span className="absolute right-3.5 top-3.5 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password / Security PIN</label>
                    <button type="button" className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">Forgot?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="demo123"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 px-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-xs transition-colors"
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

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <span>Proceed to Verify</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Demo Helpers */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-900">
              <p className="text-[11px] text-slate-500 text-center mb-2.5 font-medium">Instant Autofill Demo Credentials:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('retail')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    selectedType === 'retail'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>RB-123456</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('corporate')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    selectedType === 'corporate'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-500 text-teal-700 dark:text-teal-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>COP-13456</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. OTP Verification Screen */}
        {authScreen === 'otp' && (
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
                  onClick={() => setAuthScreen('login')}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs"
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
                A 6-digit one-time code has been sent to registered mobile <br />
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">+91 98••• •••10</span>
              </p>

              {/* 6 Digit Input boxes */}
              <div className="flex justify-between gap-2 mb-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value.slice(-1);
                      setOtp(newOtp);
                    }}
                    className="w-12 h-14 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-center text-xl font-mono font-bold text-slate-900 dark:text-white outline-none shadow-xs"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-6">
                <span>Resend OTP in <strong className="text-blue-600 dark:text-blue-400">00:45</strong></span>
                <button type="button" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Get OTP via WhatsApp</button>
              </div>

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <span>Verify & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-500">
              Encrypted end-to-end with 256-bit TLS protocol.
            </div>
          </motion.div>
        )}

        {/* 5. Biometric Scan & Device Registration */}
        {authScreen === 'biometric' && (
          <motion.div
            key="biometric"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-6 text-center z-10"
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 mb-4">
                Device Trust Verified
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Biometric Login</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Authenticate using Face ID or Touch Sensor to access your {selectedType === 'retail' ? 'Retail' : 'Corporate'} accounts.
              </p>
            </div>

            {/* Animated Biometric Ring */}
            <div className="my-auto py-8">
              <button
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
                <Fingerprint className={`w-16 h-16 ${isBiometricScanning ? 'text-emerald-600' : 'text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform'}`} />
              </button>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-4">
                {isBiometricScanning ? 'Scanning Face / Fingerprint...' : 'Tap to Authenticate'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => login(selectedType, customerId)}
                className="w-full py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl shadow-xs"
              >
                Skip to Dashboard (Manual Password)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
