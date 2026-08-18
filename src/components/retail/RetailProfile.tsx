import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Smartphone, 
  Fingerprint, 
  FileText, 
  Headphones, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Download, 
  CreditCard, 
  KeyRound,
  Shield,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { motion } from 'motion/react';

export const RetailProfile: React.FC = () => {
  const { user, logout, toggleDarkMode, isDarkMode, addToast, setBottomNavHidden } = useBanking();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [internationalRoaming, setInternationalRoaming] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(500000);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Bottom Navigation visibility: HIDDEN during Support Modal or Edit Limit Dialog
  useEffect(() => {
    if (showSupportModal || isEditingLimit) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [showSupportModal, isEditingLimit, setBottomNavHidden]);

  const handleToggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
    addToast({
      type: 'info',
      title: 'Biometric Authentication',
      message: `Face ID & Biometric login ${!biometricEnabled ? 'activated' : 'deactivated'}.`
    });
  };

  return (
    <div className="p-4 space-y-5 pb-24 max-w-lg mx-auto">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-3 ring-white/30 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-blue-900 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white truncate">{user.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-blue-100 backdrop-blur-xs">
                Retail
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">Cust ID: <span className="font-mono font-bold text-white">{user.customerNumber}</span></p>
            
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> KYC Verified
              </span>
              <span className="text-[10px] text-blue-200 truncate">
                Tier-1 Preferred
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Contact & Identification
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Mobile Number</span>
            </div>
            <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">{user.phone}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Registered Email</span>
            </div>
            <span className="font-medium text-slate-800 dark:text-slate-200">{user.email}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Home Branch</span>
            </div>
            <span className="font-medium text-slate-800 dark:text-slate-200">BKC Branch, Mumbai</span>
          </div>
        </div>
      </div>

      {/* Security & Access Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Security & Biometrics
        </h3>

        <div className="space-y-3">
          {/* Biometric Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Biometric / Face ID Login</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Quick sign-in using device biometrics</p>
              </div>
            </div>
            <button
              onClick={handleToggleBiometric}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                biometricEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Transfer Limits */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Daily Digital Transfer Limit</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">UPI, IMPS, and NEFT combined limit</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingLimit(!isEditingLimit)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400"
              >
                {isEditingLimit ? 'Done' : 'Change'}
              </button>
            </div>

            {isEditingLimit ? (
              <div className="pt-2">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  <span>₹1,00,000</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">₹{dailyLimit.toLocaleString('en-IN')}</span>
                  <span>₹10,00,000</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1000000"
                  step="50000"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            ) : (
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 pl-11">
                Current Max: ₹{dailyLimit.toLocaleString('en-IN')} / day
              </div>
            )}
          </div>

          {/* Change MPIN */}
          <button 
            onClick={() => addToast({ type: 'info', title: 'Change MPIN', message: 'OTP sent to registered mobile for verification.' })}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Change 6-Digit MPIN</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Used for authorizing fund transfers</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Notifications & Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Preferences & Documents
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">Instant SMS Transaction Alerts</span>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={() => setSmsAlerts(!smsAlerts)}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">Monthly E-Statement on Email</span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-700 dark:text-slate-300">App Theme (Dark Mode)</span>
            <button
              onClick={toggleDarkMode}
              className="text-xs font-bold text-blue-600 dark:text-blue-400"
            >
              {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>

        <div className="pt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => addToast({ type: 'success', title: 'Interest Certificate', message: 'FY 2025-26 Tax Certificate downloaded.' })}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Tax Certificate</span>
          </button>
          <button
            onClick={() => addToast({ type: 'success', title: 'Form 16A Downloaded', message: 'TDS statement saved to your device.' })}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Form 16A TDS</span>
          </button>
        </div>
      </div>

      {/* Customer Support Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold">24/7 Priority Support</h4>
            <p className="text-[10px] text-slate-400">Toll-free: 1800-202-APEX</p>
          </div>
        </div>
        <button
          onClick={() => setShowSupportModal(true)}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
        >
          Contact
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full py-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors shadow-xs"
      >
        <LogOut className="w-4 h-4" />
        <span>Secure Sign Out</span>
      </button>

      <p className="text-center text-[10px] text-slate-400 dark:text-slate-600">
        Bharat Corporate Banking v3.4.1 • Bharat Co-operative Bank (Mumbai) Ltd
      </p>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Help & Support</h3>
              </div>
              <button 
                onClick={() => setShowSupportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-[10px]">Dedicated Relationship Manager</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Rohit Batra</p>
                <p className="text-slate-600 dark:text-slate-400 font-mono">+91 22 6901 8840</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-[10px]">Emergency Fraud Hotline</p>
                <p className="font-bold text-rose-600 dark:text-rose-400">1800-999-FRAUD (Free)</p>
                <p className="text-[10px] text-slate-500">24x7 instant card freeze & fraud block</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSupportModal(false);
                addToast({ type: 'success', title: 'Callback Scheduled', message: 'Your Relationship Manager will call you within 15 mins.' });
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              Request Immediate Callback
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
