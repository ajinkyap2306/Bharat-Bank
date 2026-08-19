import React, { useCallback, useEffect, useRef } from 'react';

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
  /** Bump to clear and refocus (e.g. after OTP resend) */
  resetKey?: number;
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
  resetKey = 0,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const safeValue = toDigits(value, length);
  const activeIndex = Math.min(safeValue.length, length - 1);

  const focusInput = useCallback(() => {
    if (disabled) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const pos = el.value.length;
    el.setSelectionRange(pos, pos);
  }, [disabled]);

  useEffect(() => {
    if (autoFocus && !disabled) {
      const t = window.setTimeout(focusInput, 0);
      return () => window.clearTimeout(t);
    }
  }, [autoFocus, disabled, focusInput, resetKey]);

  const applyValue = useCallback(
    (raw: string) => {
      onChange(toDigits(raw, length));
    },
    [length, onChange]
  );

  const gridCols = GRID_COLS[length] ?? 'grid-cols-6';

  return (
    <div
      className={`relative min-h-[50px] ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {/* Visual digit boxes — no pointer events; input above receives all interaction */}
      <div className={`grid ${gridCols} ${gapClassName} pointer-events-none`} aria-hidden>
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

      {/* Single native input — reliable on desktop web + mobile keyboards */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete={autoComplete}
        enterKeyHint="done"
        maxLength={length}
        value={safeValue}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => applyValue(e.target.value)}
        onInput={(e) => applyValue(e.currentTarget.value)}
        onPaste={(e) => {
          e.preventDefault();
          applyValue(e.clipboardData.getData('text'));
        }}
        onFocus={() => {
          const el = inputRef.current;
          if (!el) return;
          const pos = el.value.length;
          el.setSelectionRange(pos, pos);
        }}
        onClick={() => {
          if (!disabled) focusInput();
        }}
        className="absolute inset-0 z-20 h-full w-full cursor-text border-0 bg-transparent p-0 text-base text-transparent caret-blue-600 outline-none ring-0 shadow-none"
        style={{ WebkitUserSelect: 'text', userSelect: 'text', WebkitTextFillColor: 'transparent' }}
      />
    </div>
  );
};
