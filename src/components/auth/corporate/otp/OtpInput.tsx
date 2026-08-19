import React, { useEffect, useRef } from 'react';

interface OtpInputProps {
  digits: string[];
  activeIndex: number;
  hasError: boolean;
  disabled?: boolean;
  resetKey?: number;
  onDigitsChange: (digits: string[]) => void;
  onActiveIndexChange: (index: number) => void;
  onComplete?: () => void;
}

const toDigits = (value: string): string[] => {
  const chars = value.replace(/\D/g, '').slice(0, 6).split('');
  return Array.from({ length: 6 }, (_, i) => chars[i] ?? '');
};

export const OtpInput: React.FC<OtpInputProps> = ({
  digits,
  hasError,
  disabled,
  resetKey = 0,
  onDigitsChange,
  onActiveIndexChange,
  onComplete,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const value = digits.join('');

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [resetKey, disabled]);

  const applyValue = (raw: string) => {
    const next = toDigits(raw);
    onDigitsChange(next);
    const filled = next.filter(Boolean).length;
    onActiveIndexChange(Math.min(filled, 5));
    if (filled === 6) {
      onComplete?.();
    }
  };

  return (
    <div className="relative" role="group" aria-label="6-digit verification code">
      {/* Single native input — reliable on iOS/Android keyboards & SMS autofill */}
      <input
        ref={inputRef}
        key={resetKey}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        disabled={disabled}
        aria-label="Enter 6-digit verification code"
        onChange={(e) => applyValue(e.target.value)}
        onFocus={() => onActiveIndexChange(Math.min(value.length, 5))}
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-[0.02] text-transparent caret-transparent"
      />

      <div
        className="grid grid-cols-6 gap-2"
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {digits.map((digit, index) => {
          const isActive = !disabled && index === Math.min(value.length, 5);
          return (
            <div
              key={index}
              aria-hidden
              className={`flex h-[50px] items-center justify-center rounded-[13px] border-2 bg-white text-2xl font-bold font-mono text-slate-900 transition-all duration-200 dark:bg-slate-900 dark:text-white select-text ${
                hasError
                  ? 'border-[#DC2626] ring-2 ring-[#DC2626]/10'
                  : isActive
                    ? 'border-[#0B5CAB] ring-2 ring-[#0B5CAB]/15'
                    : digit
                      ? 'border-[#0B5CAB]/40'
                      : 'border-[#E4E7EC] dark:border-slate-800'
              } ${disabled ? 'opacity-50' : ''}`}
            >
              {digit}
            </div>
          );
        })}
      </div>
    </div>
  );
};
