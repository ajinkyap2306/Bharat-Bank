import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BharatBankLogo } from '../common/BharatBankLogo';

const SPLASH_DURATION_MS = 2500;

interface AuthSplashScreenProps {
  onComplete: () => void;
}

export const AuthSplashScreen: React.FC<AuthSplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, SPLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#005DD4] text-white safe-top safe-bottom"
      role="img"
      aria-label="Bharat Co-operative Bank loading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-indigo-900/30 blur-3xl" />
      </div>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="relative z-10 flex flex-col items-center px-8 text-center"
      >
        <div className="rounded-3xl bg-white px-5 py-4 shadow-2xl shadow-blue-900/30 mb-8">
          <BharatBankLogo variant="full" size="lg" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Mobile Banking</h1>
        <p className="text-sm text-blue-100 mt-2 max-w-xs leading-relaxed">
          Secure retail &amp; corporate banking, anytime, anywhere.
        </p>
        <motion.div
          className="mt-10 flex gap-1.5"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.2, repeatType: 'reverse' }}
        >
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="w-2 h-2 rounded-full bg-white/80" />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
