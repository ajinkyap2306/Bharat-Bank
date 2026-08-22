import React, { useId } from 'react';

interface SecureInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  isFocused?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  rightElement?: React.ReactNode;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  isFocused,
  onFocus,
  onBlur,
  autoComplete,
  inputMode,
  rightElement,
}) => {
  const inputId = useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-slate-900 dark:text-slate-200 block mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`w-full bg-white dark:bg-slate-900 border rounded-2xl py-3.5 px-4 text-[15px] text-slate-900 dark:text-white outline-none transition-all duration-200 min-h-11 shadow-sm ${
            rightElement ? 'pr-12' : ''
          } ${
            error
              ? 'border-[#DC2626] ring-2 ring-[#DC2626]/10'
              : isFocused
                ? 'border-congress-blue-700 ring-2 ring-congress-blue-700/10'
                : 'border-[#E4E7EC] dark:border-slate-800'
          }`}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="text-[12px] text-[#DC2626] mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
