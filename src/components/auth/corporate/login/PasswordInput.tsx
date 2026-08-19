import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SecureInput } from './SecureInput';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  error?: string;
  isFocused?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  error,
  isFocused,
  onFocus,
  onBlur,
}) => (
  <div>
    <label className="text-sm font-medium text-[#111827] dark:text-slate-200 block mb-1.5">
      Password
    </label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Enter your password"
        autoComplete="current-password"
        className={`w-full bg-white dark:bg-slate-900 border rounded-2xl py-3.5 pl-4 pr-12 text-[15px] text-[#111827] dark:text-white outline-none transition-all duration-200 min-h-11 shadow-sm ${
          error
            ? 'border-[#DC2626] ring-2 ring-[#DC2626]/10'
            : isFocused
              ? 'border-[#0B5CAB] ring-2 ring-[#0B5CAB]/10'
              : 'border-[#E4E7EC] dark:border-slate-800'
        }`}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-[#667085] hover:text-[#111827] dark:hover:text-white transition-colors"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff className="w-4.5 h-4.5" />
        ) : (
          <Eye className="w-4.5 h-4.5" />
        )}
      </button>
    </div>
    {error && (
      <p className="text-[12px] text-[#DC2626] mt-1.5" role="alert">
        {error}
      </p>
    )}
  </div>
);

// Re-export SecureInput for co-located form fields
export { SecureInput };
