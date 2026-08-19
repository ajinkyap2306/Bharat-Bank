import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  User, 
  Building2, 
  RotateCcw, 
  Fingerprint, 
  Moon, 
  Sun, 
  ChevronUp, 
  ChevronDown, 
  Lock,
  Scan,
  ShieldAlert
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CORPORATE_DEMO_ID, CORPORATE_DEMO_PASSWORD } from '../../data/corporateAuthMock';

export const DemoController: React.FC = () => {
  const { 
    bankingType, 
    quickDemoLogin, 
    resetDemoData, 
    isDarkMode, 
    toggleDarkMode, 
    logout, 
    setAuthScreen,
    openScanner,
    addToast,
    triggerSessionTimeout,
  } = useBanking();
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-18 right-4 z-50">
      {/* Expanded Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-2 w-64 bg-slate-900/95 text-white backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-slate-700 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Demo Switcher
              </span>
              <span className="text-[10px] text-slate-400">Unified Architecture</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  quickDemoLogin('retail');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                  bankingType === 'retail' 
                    ? 'bg-blue-600 font-bold text-white' 
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-300" />
                  <div>
                    <p className="font-semibold text-xs leading-none">Retail Banking</p>
                    <p className="text-[10px] text-blue-200 mt-0.5">RB-123456 (Arjun)</p>
                  </div>
                </div>
                {bankingType === 'retail' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
              </button>

              <button
                onClick={() => {
                  quickDemoLogin('corporate');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                  bankingType === 'corporate' 
                    ? 'bg-teal-600 font-bold text-white' 
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-300" />
                  <div>
                    <p className="font-semibold text-xs leading-none">Corporate Banking</p>
                    <p className="text-[10px] text-teal-200 mt-0.5">{CORPORATE_DEMO_ID} / {CORPORATE_DEMO_PASSWORD}</p>
                  </div>
                </div>
                {bankingType === 'corporate' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 text-[11px] text-slate-300"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setAuthScreen('login');
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 text-[11px] text-slate-300"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Auth Flow</span>
              </button>

              <button
                onClick={() => {
                  openScanner();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 text-[11px] text-slate-300"
              >
                <Scan className="w-3.5 h-3.5 text-emerald-400" />
                <span>QR Scanner</span>
              </button>

              <button
                onClick={() => {
                  triggerSessionTimeout();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 text-[11px] text-slate-300"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Session Timeout</span>
              </button>

              <button
                onClick={() => {
                  resetDemoData();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 text-[11px] text-slate-300"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Data</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/90 text-white shadow-xl hover:shadow-2xl border border-slate-700 text-xs font-semibold backdrop-blur-md active:scale-95 transition-all"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-slate-300">
          {bankingType === 'retail' ? 'Retail View' : 'Corporate View'}
        </span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
      </button>
    </div>
  );
};
