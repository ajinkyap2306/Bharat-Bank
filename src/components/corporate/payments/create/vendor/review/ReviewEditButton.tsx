import React from 'react';

interface ReviewEditButtonProps {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ReviewEditButton: React.FC<ReviewEditButtonProps> = ({
  label = 'Edit',
  onClick,
  disabled = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-2 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 rounded-lg"
  >
    {label === 'Edit' ? 'Edit' : label}
  </button>
);
