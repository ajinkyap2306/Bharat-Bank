import React from 'react';

interface BharatBankLogoProps {
  className?: string;
  variant?: 'full' | 'badge' | 'header' | 'compact';
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BharatBankLogo: React.FC<BharatBankLogoProps> = ({
  className = '',
  variant = 'full',
  subtitle = 'MULTI-STATE SCHEDULED BANK',
  size = 'md'
}) => {
  // Dimension calculations
  const badgeSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Dedicated SVG Badge Component representing Bharat Bank circular emblem
  const LogoEmblem = ({ emblemClass }: { emblemClass?: string }) => (
    <svg
      viewBox="0 0 120 120"
      className={emblemClass || badgeSizes[size]}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bharat Bank Emblem"
    >
      {/* Outer Red Ring */}
      <circle cx="60" cy="60" r="56" stroke="#D9252A" strokeWidth="5" fill="#FFFFFF" />
      
      {/* Inner India Map Silhouette in Red */}
      <path
        d="M60 22 C63 22 66 25 65 29 C65 31 68 32 69 35 C71 38 73 37 75 40 C77 43 83 45 84 49 C85 53 82 56 81 59 C80 62 82 65 83 68 C83 71 80 73 81 76 C81 78 77 82 75 85 C73 88 68 91 66 94 C64 97 61 100 59 101 C58 98 56 94 54 90 C52 87 49 84 47 80 C44 75 42 70 41 65 C40 60 41 55 42 50 C43 45 44 41 47 37 C50 33 53 29 55 26 C57 24 59 22 60 22 Z"
        fill="#D9252A"
      />

      {/* Interlocking BCB monogram in white contour */}
      <g transform="translate(42, 45) scale(0.65)" stroke="#FFFFFF" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Left B */}
        <path d="M 6 4 L 18 4 C 23 4 27 7 27 12 C 27 16 24 19 20 20 C 25 21 28 25 28 30 C 28 36 23 40 17 40 L 6 40 Z" />
        {/* Center C / linking ribbon */}
        <path d="M 24 20 L 32 20 C 37 20 41 24 41 29 C 41 34 37 38 32 38 L 22 38" />
        {/* Right B */}
        <path d="M 32 4 L 44 4 C 49 4 53 7 53 12 C 53 16 50 19 46 20 C 51 21 54 25 54 30 C 54 36 49 40 43 40 L 32 40" />
      </g>
    </svg>
  );

  if (variant === 'badge') {
    return <LogoEmblem emblemClass={className || badgeSizes[size]} />;
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="shrink-0 p-0.5 rounded-full bg-white shadow-xs border border-red-100">
          <LogoEmblem emblemClass="w-9 h-9" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-black text-sm text-congress-blue-900 dark:text-congress-blue-400 tracking-tight leading-none uppercase">
              Bharat Corporate
            </h1>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-600 text-white leading-none">
              BANK
            </span>
          </div>
          <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 tracking-wider mt-0.5 uppercase">
            Bharat Co-op Bank Ltd.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="shrink-0 rounded-full bg-white p-0.5 shadow-xs">
          <LogoEmblem emblemClass="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-extrabold text-xs text-congress-blue-900 dark:text-congress-blue-300 leading-tight">
            Bharat Co-operative Bank
          </h2>
          <p className="text-[8px] font-bold text-red-600 tracking-wider uppercase">
            Corporate Banking
          </p>
        </div>
      </div>
    );
  }

  // Full Brand Lockup (Matches the uploaded bank logo exact styling)
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Red Circular Map Badge */}
      <div className="shrink-0 rounded-full bg-white p-1 shadow-sm border border-red-100">
        <LogoEmblem emblemClass={badgeSizes[size]} />
      </div>

      {/* Typography */}
      <div className="min-w-0 flex flex-col justify-center">
        <div className="font-extrabold tracking-tight text-congress-blue-900 dark:text-congress-blue-400 leading-none">
          <div className={`${size === 'lg' || size === 'xl' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'} font-black`}>
            Bharat Co-operative
          </div>
          <div className={`${size === 'lg' || size === 'xl' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'} font-extrabold mt-0.5`}>
            Bank (Mumbai) Ltd
          </div>
        </div>

        {/* Red Accent Divider */}
        <div className="w-full h-0.5 bg-red-600 my-1 rounded-full opacity-90" />

        {/* Subtitle */}
        <div className="text-[8px] sm:text-[9px] font-extrabold text-congress-blue-900 dark:text-congress-blue-300 tracking-[0.18em] uppercase whitespace-nowrap">
          {subtitle}
        </div>
      </div>
    </div>
  );
};
