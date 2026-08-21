import React from 'react';

const OFFICIAL_LOGO_SRC = '/bharat-bank-official-logo.png';
const OFFICIAL_LOGO_ALT =
  'Bharat Co-operative Bank (Mumbai) Ltd — Multi-State Scheduled Bank';

interface BharatBankLogoProps {
  className?: string;
  variant?: 'full' | 'badge' | 'header' | 'compact';
  /** Kept for backward compatibility; official artwork includes the tagline. */
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const fullHeights = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-16',
  xl: 'h-20',
} as const;

const compactHeights = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-12',
} as const;

const badgeSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
} as const;

export const BharatBankLogo: React.FC<BharatBankLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  if (variant === 'badge') {
    return (
      <img
        src={OFFICIAL_LOGO_SRC}
        alt={OFFICIAL_LOGO_ALT}
        className={`object-cover object-left shrink-0 ${badgeSizes[size]} ${className}`}
      />
    );
  }

  const heightClass =
    variant === 'compact' || variant === 'header'
      ? compactHeights[size]
      : fullHeights[size];

  return (
    <img
      src={OFFICIAL_LOGO_SRC}
      alt={OFFICIAL_LOGO_ALT}
      className={`w-auto max-w-full object-contain object-left shrink-0 ${heightClass} ${className}`}
    />
  );
};
