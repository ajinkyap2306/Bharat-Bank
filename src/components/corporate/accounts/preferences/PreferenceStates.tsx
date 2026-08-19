import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PreferencesSkeleton } from './PreferencesUI';

export const PreferencesScreenSkeleton: React.FC = () => (
  <div className="space-y-4 py-4" aria-busy="true" aria-label="Loading account preferences">
    <PreferencesSkeleton className="h-32" />
    <PreferencesSkeleton className="h-40" />
    <PreferencesSkeleton className="h-28" />
    <PreferencesSkeleton className="h-36" />
    <PreferencesSkeleton className="h-48" />
  </div>
);

interface PreferencesErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const PreferencesErrorState: React.FC<PreferencesErrorStateProps> = ({
  message = 'Unable to load account preferences.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-[#DC2626]/10 flex items-center justify-center mb-4">
      <AlertCircle className="w-7 h-7 text-[#DC2626]" aria-hidden />
    </div>
    <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">
      Unable to load preferences
    </h2>
    <p className="text-[13px] text-[#667085] mt-2">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
    >
      <RefreshCw className="w-4 h-4" aria-hidden />
      Try Again
    </button>
  </div>
);

interface PreferenceUpdateErrorProps {
  onRetry: () => void;
}

export const PreferenceUpdateError: React.FC<PreferenceUpdateErrorProps> = ({ onRetry }) => (
  <div
    className="mx-4 mb-4 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20 p-4"
    role="alert"
  >
    <p className="text-[14px] font-semibold text-[#DC2626]">Unable to update preference</p>
    <p className="text-[12px] text-[#667085] mt-1">Your previous setting is still active.</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-3 text-[13px] font-semibold text-[#0B5CAB] min-h-11"
    >
      Try Again
    </button>
  </div>
);
