import React, { useEffect, useRef } from 'react';

export interface NumericPinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  /** Show bullets instead of digits (for MPIN/password) */
  masked?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  ariaLabel?: string;
  className?: string;
  digitClassName?: string;
  gapClassName?: string;
}

const toDigits = (raw: string, length: number): string =>
  raw.replace(/\D/g, '').slice(0, length);

const GRID_COLS: Record<number, string> = {
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

export const NumericPinInput: React.FC<NumericPinInputProps> = ({
  value,
  onChange,
  length = 6,
  masked = false,
  disabled = false,
  hasError = false,
  autoFocus = false,
  autoComplete = 'one-time-code',
  ariaLabel = 'Enter verification code',
  className = '',
  digitClassName = '',
  gapClassName = 'gap-2',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const safeValue = toDigits(value, length);
  const activeIndex = Math.min(safeValue.length, length - 1);

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (raw: string) => {
    onChange(toDigits(raw, length));
  };

  const gridCols = GRID_COLS[length] ?? 'grid-cols-6';

  return (
    <div
      className={`relative ${className}`}
      role="group"
      aria-label={ariaLabel}
      onClick={() => !disabled && inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete={autoComplete}
        maxLength={length}
        value={safeValue}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.stopPropagation();
          }
        }}
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-[0.01] text-base caret-transparent"
        style={{ WebkitUserSelect: 'text', userSelect: 'text' }}
      />

      <div className={`grid ${gridCols} ${gapClassName}`} aria-hidden>
        {Array.from({ length }, (_, index) => {
          const digit = safeValue[index] ?? '';
          const isActive = !disabled && index === activeIndex;

          return (
            <div
              key={index}
              className={`flex h-12 items-center justify-center rounded-xl border-2 bg-white text-xl font-bold font-mono text-slate-900 transition-colors dark:bg-slate-900 dark:text-white ${digitClassName} ${
                hasError
                  ? 'border-red-400 ring-2 ring-red-400/10'
                  : isActive
                    ? 'border-blue-600 ring-2 ring-blue-600/15 dark:border-blue-500'
                    : digit
                      ? 'border-blue-600/40 dark:border-blue-500/40'
                      : 'border-slate-200 dark:border-slate-700'
              } ${disabled ? 'opacity-50' : ''}`}
            >
              {digit ? (masked ? '•' : digit) : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};
