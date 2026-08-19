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
    className="text-[13px] font-semibold text-[#0B5CAB] min-h-11 px-2 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] rounded-lg"
  >
    {label === 'Edit' ? 'Edit' : label}
  </button>
);
