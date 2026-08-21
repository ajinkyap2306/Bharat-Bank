import React, { useEffect, useRef } from 'react';
import { OtpDigit } from './OtpDigit';

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

export const OtpInput: React.FC<OtpInputProps> = ({
  digits,
  activeIndex,
  hasError,
  disabled,
  resetKey = 0,
  onDigitsChange,
  onActiveIndexChange,
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (disabled) return;
    const t = window.setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [resetKey, disabled]);

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    onDigitsChange(next);

    if (char && index < 5) {
      onActiveIndexChange(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    if (char && index === 5 && next.every((d) => d.length === 1)) {
      onComplete?.();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        onDigitsChange(next);
        return;
      }
      if (index > 0) {
        onActiveIndexChange(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      onActiveIndexChange(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      onActiveIndexChange(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '');
    onDigitsChange(next);
    const focusIndex = Math.min(pasted.length, 5);
    onActiveIndexChange(focusIndex);
    inputRefs.current[focusIndex]?.focus();
    if (pasted.length === 6) {
      onComplete?.();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2" role="group" aria-label="6-digit verification code">
      {digits.map((digit, index) => (
        <OtpDigit
          key={`${resetKey}-${index}`}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          index={index}
          isActive={!disabled && index === activeIndex}
          hasError={hasError}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={onActiveIndexChange}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};
