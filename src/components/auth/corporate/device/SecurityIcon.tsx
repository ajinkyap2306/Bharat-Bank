import React from 'react';
import { motion } from 'motion/react';
import { Fingerprint, ShieldCheck } from 'lucide-react';

interface SecurityIconProps {
  variant?: 'shield' | 'fingerprint';
  isAnimating?: boolean;
  size?: 'md' | 'lg';
}

export const SecurityIcon: React.FC<SecurityIconProps> = ({
  variant = 'shield',
  isAnimating = false,
  size = 'md',
}) => {
  const Icon = variant === 'fingerprint' ? Fingerprint : ShieldCheck;
  const boxSize = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14';
  const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <div
      className={`${boxSize} rounded-2xl bg-congress-blue-700/10 flex items-center justify-center relative`}
      aria-hidden
    >
      {isAnimating && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="absolute inset-1 rounded-2xl border-2 border-transparent border-t-congress-blue-700/60 motion-reduce:animate-none"
        />
      )}
      <Icon
        className={`${iconSize} ${
          isAnimating ? 'text-congress-blue-700' : 'text-congress-blue-700'
        }`}
      />
    </div>
  );
};
