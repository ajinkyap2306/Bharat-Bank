import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import type { VendorBeneficiary } from '../../../../../types/corporateVendorBeneficiarySelection';
import { isVendorBeneficiarySelectable } from '../../../../../types/corporateVendorBeneficiarySelection';
import { getBeneficiaryInitials } from '../../../../../data/corporateVendorBeneficiarySelectionMock';
import { BeneficiaryStatusBadge } from './BeneficiaryStatusBadge';

interface BeneficiaryItemProps {
  beneficiary: VendorBeneficiary;
  variant?: 'list' | 'favorite' | 'recent' | 'search';
  onSelect: (beneficiary: VendorBeneficiary) => void;
  onToggleFavorite?: (beneficiaryId: string) => void;
  onViewStatus?: (beneficiaryId: string) => void;
}

export const BeneficiaryItem: React.FC<BeneficiaryItemProps> = ({
  beneficiary,
  variant = 'list',
  onSelect,
  onToggleFavorite,
  onViewStatus,
}) => {
  const selectable = isVendorBeneficiarySelectable(beneficiary.status);
  const initials = getBeneficiaryInitials(beneficiary.name);

  const srLabel = `${beneficiary.name}, account ending ${beneficiary.maskedAccountNumber.replace(/\D/g, '').slice(-4)}, ${beneficiary.bankName}, ${beneficiary.status === 'verified' ? 'verified beneficiary' : beneficiary.status.replace('-', ' ')}`;

  const handleRowClick = () => {
    if (selectable) onSelect(beneficiary);
  };

  const statusMessage =
    beneficiary.status === 'pending-approval'
      ? 'This beneficiary cannot be used until the required approval is completed.'
      : beneficiary.status === 'blocked'
        ? 'This beneficiary is currently unavailable for payments.'
        : beneficiary.status === 'inactive'
          ? 'This beneficiary is inactive and cannot receive payments.'
          : beneficiary.status === 'pending-verification'
            ? 'Verification is pending for this beneficiary.'
            : null;

  if (variant === 'favorite') {
    return (
      <button
        type="button"
        onClick={handleRowClick}
        disabled={!selectable}
        aria-label={srLabel}
        className="shrink-0 w-[200px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left shadow-sm min-h-[120px] active:bg-slate-50 dark:active:bg-slate-800/40 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-10 h-10 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 text-[13px] font-bold"
            aria-hidden
          >
            {initials}
          </div>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(beneficiary.id);
              }}
              className="p-1 min-w-11 min-h-11 flex items-center justify-center"
              aria-label={beneficiary.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${beneficiary.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                aria-hidden
              />
            </button>
          )}
        </div>
        <p className="text-[14px] font-semibold text-slate-900 dark:text-white mt-3 line-clamp-2">
          {beneficiary.name}
        </p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 tabular-nums mt-1">{beneficiary.maskedAccountNumber}</p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{beneficiary.bankName}</p>
        <div className="mt-2">
          <BeneficiaryStatusBadge status={beneficiary.status} compact />
        </div>
      </button>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden ${
        !selectable ? 'opacity-90' : ''
      }`}
    >
      <button
        type="button"
        onClick={handleRowClick}
        disabled={!selectable}
        aria-label={srLabel}
        className="w-full flex items-center gap-3 p-4 text-left min-h-[76px] active:bg-slate-50 dark:active:bg-slate-800/40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-congress-blue-500"
      >
        <div
          className="w-11 h-11 shrink-0 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center text-congress-blue-700 dark:text-congress-blue-400 text-[13px] font-bold"
          aria-hidden
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-slate-900 dark:text-white truncate">
            {beneficiary.name}
          </p>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
            {beneficiary.maskedAccountNumber}
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <p className="text-[12px] text-slate-500 dark:text-slate-400">{beneficiary.bankName}</p>
            <BeneficiaryStatusBadge status={beneficiary.status} compact />
          </div>
          {variant === 'recent' && beneficiary.lastPaymentDate && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
              Last paid {beneficiary.lastPaymentDate}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onToggleFavorite && selectable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(beneficiary.id);
              }}
              className="p-2 min-w-11 min-h-11 flex items-center justify-center"
              aria-label={beneficiary.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${beneficiary.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                aria-hidden
              />
            </button>
          )}
          {selectable && <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />}
        </div>
      </button>

      {!selectable && statusMessage && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-200 dark:border-slate-800/80 dark:border-slate-800">
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{statusMessage}</p>
          {beneficiary.status === 'pending-approval' && onViewStatus && (
            <button
              type="button"
              onClick={() => onViewStatus(beneficiary.id)}
              className="mt-2 text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
            >
              View Status
            </button>
          )}
        </div>
      )}
    </div>
  );
};
