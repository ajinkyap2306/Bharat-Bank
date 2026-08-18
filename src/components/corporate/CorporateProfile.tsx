import React, { useState } from 'react';
import { 
  Building2, 
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
  Sliders, 
  Download, 
  Briefcase,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { motion } from 'motion/react';

export const CorporateProfile: React.FC = () => {
  const { user, logout, toggleDarkMode, isDarkMode, addToast } = useBanking();
  const [fido2KeyEnabled, setFido2KeyEnabled] = useState(true);
  const [dualApprovalThreshold, setDualApprovalThreshold] = useState(1000000);
  const [showRMModal, setShowRMModal] = useState(false);

  return (
    <div className="p-4 space-y-5 pb-28 max-w-lg mx-auto">
      {/* Entity Master Header Card */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-3 ring-teal-500/30 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Corporate Enterprise
            </span>
            <h2 className="text-base font-bold text-white truncate mt-1">{user.companyName}</h2>
            <p className="text-xs text-teal-300 font-medium truncate">{user.name} • {user.role}</p>
            
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/10 text-slate-200">
                CIN: {user.cin}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Entity Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Enterprise Master Data
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">GSTIN Identification</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user.gstin}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Corporate Customer ID</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user.customerNumber}</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Registered Office</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">Nariman Point, Mumbai - 400021</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Relationship Branch</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">Bharat Co-operative Institutional Branch</span>
          </div>
        </div>
      </div>

      {/* Security & Authorization Governance */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Enterprise Security & Hardware Key
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">FIDO2 Hardware Key 2FA</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">YubiKey / Bio-token for payouts &gt; ₹10L</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFido2KeyEnabled(!fido2KeyEnabled);
                addToast({ type: 'info', title: 'Hardware Token', message: 'FIDO2 security token settings updated.' });
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                fido2KeyEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                fido2KeyEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">Dual Authorization Threshold</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">₹{(dualApprovalThreshold / 100000).toFixed(0)} Lakhs</span>
            </div>
            <input
              type="range"
              min="500000"
              max="5000000"
              step="500000"
              value={dualApprovalThreshold}
              onChange={(e) => setDualApprovalThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <p className="text-[10px] text-slate-500">Transfers exceeding this amount require 2 authorized signatures.</p>
          </div>
        </div>
      </div>

      {/* Preferences & Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Workspace Display & Preferences
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">Application Theme</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Currently in {isDarkMode ? 'Dark' : 'Light'} Mode</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-teal-600 dark:text-teal-400"
            >
              {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>
      </div>

      {/* Relationship Manager Contact */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold">Institutional RM</h4>
            <p className="text-[10px] text-slate-400">Vikramaditya Rao (VP Treasury)</p>
          </div>
        </div>
        <button
          onClick={() => setShowRMModal(true)}
          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
        >
          Contact Desk
        </button>
      </div>

      {/* Sign Out */}
      <button
        onClick={logout}
        className="w-full py-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors shadow-xs"
      >
        <LogOut className="w-4 h-4" />
        <span>End Corporate Session</span>
      </button>

      {/* RM Desk Modal */}
      {showRMModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Corporate Treasury Desk</h3>
              <button onClick={() => setShowRMModal(false)} className="text-slate-400 text-xs font-bold">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-400">Principal Relationship Officer</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">Vikramaditya Rao</p>
                <p className="font-mono text-teal-600">+91 22 6192 9900</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-400">RTGS & Forex Operations Helpline</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">1800-CORP-APEX (Toll Free)</p>
                <p className="text-[10px] text-slate-500">Dedicated 24/7 institutional wire support</p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowRMModal(false);
                addToast({ type: 'success', title: 'Callback Scheduled', message: 'Corporate Treasury desk notified.' });
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
            >
              Request High-Priority Callback
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
