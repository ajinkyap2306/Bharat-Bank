import React, { forwardRef } from 'react';

interface OtpDigitProps {
  value: string;
  index: number;
  isActive: boolean;
  hasError: boolean;
  disabled?: boolean;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: (index: number) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

export const OtpDigit = forwardRef<HTMLInputElement, OtpDigitProps>(
  (
    {
      value,
      index,
      isActive,
      hasError,
      disabled,
      onChange,
      onKeyDown,
      onFocus,
      onPaste,
    },
    ref
  ) => (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete={index === 0 ? 'one-time-code' : 'off'}
      maxLength={1}
      value={value}
      disabled={disabled}
      aria-label={`Verification digit ${index + 1} of 6`}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onFocus={() => onFocus(index)}
      onPaste={onPaste}
      className={`w-full h-[50px] bg-white dark:bg-slate-900 border-2 rounded-[13px] text-center text-xl font-semibold text-[#111827] dark:text-white outline-none transition-all duration-200 motion-reduce:transition-none ${
        hasError
          ? 'border-[#DC2626] ring-2 ring-[#DC2626]/10'
          : isActive
            ? 'border-[#0B5CAB] ring-2 ring-[#0B5CAB]/15 scale-[1.02]'
            : value
              ? 'border-[#0B5CAB]/40'
              : 'border-[#E4E7EC] dark:border-slate-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
  )
);

OtpDigit.displayName = 'OtpDigit';
