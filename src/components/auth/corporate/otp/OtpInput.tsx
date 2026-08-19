import React from 'react';
import { NumericPinInput } from '../../../common/NumericPinInput';

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

const toDigitArray = (value: string): string[] =>
  Array.from({ length: 6 }, (_, i) => value[i] ?? '');

export const OtpInput: React.FC<OtpInputProps> = ({
  digits,
  hasError,
  disabled,
  resetKey = 0,
  onDigitsChange,
  onActiveIndexChange,
  onComplete,
}) => {
  const value = digits.join('');

  const handleChange = (next: string) => {
    const nextDigits = toDigitArray(next);
    onDigitsChange(nextDigits);
    onActiveIndexChange(Math.min(next.length, 5));
    if (next.length === 6) {
      onComplete?.();
    }
  };

  return (
    <NumericPinInput
      key={resetKey}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      hasError={hasError}
      autoFocus
      ariaLabel="6-digit verification code"
      digitClassName="h-[50px] rounded-[13px] text-2xl"
    />
  );
};
