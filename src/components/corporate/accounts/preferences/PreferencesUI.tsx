import React from 'react';

export const PreferencesCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}> = ({ children, className = '', ariaLabel }) => (
  <section
    className={`mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 shadow-sm ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </section>
);

export const PreferencesSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className = '' }) => (
  <div className={`px-4 ${className}`}>
    <div className="mb-2">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">{title}</h2>
      {description && <p className="text-[13px] text-[#667085] mt-1">{description}</p>}
    </div>
    {children}
  </div>
);

export const PreferencesToggle: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  id: string;
}> = ({ label, description, checked, onChange, disabled, id }) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-[#E4E7EC]/80 dark:border-slate-800 last:border-0 min-h-14">
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="text-[14px] font-medium text-[#111827] dark:text-white block">
        {label}
      </label>
      {description && (
        <p id={`${id}-desc`} className="text-[12px] text-[#667085] mt-0.5">
          {description}
        </p>
      )}
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={description ? `${id}-desc` : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 flex items-center rounded-full p-0.5 transition-colors shrink-0 motion-reduce:transition-none ${
        checked ? 'bg-[#0B5CAB]' : 'bg-[#E4E7EC] dark:bg-slate-700'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <span
        className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform motion-reduce:transition-none ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export const PreferencesSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24' }) => (
  <div
    className={`mx-4 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none ${className}`}
    aria-hidden
  />
);
