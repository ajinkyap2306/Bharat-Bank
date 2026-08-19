import React from 'react';
import type { BulkPaymentRecord } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency } from '../payments/shared/CorporatePaymentsUI';

interface BulkPaymentRowProps {
  payment: BulkPaymentRecord;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const BulkPaymentRow: React.FC<BulkPaymentRowProps> = ({ payment, onEdit, onRemove }) => (
  <li className="py-3 flex items-start justify-between gap-3">
    <div className="min-w-0 flex-1">
      <p className="text-[14px] font-semibold text-[#111827] dark:text-white truncate">
        {payment.beneficiary}
      </p>
      <p className="text-[12px] text-[#667085] font-mono mt-0.5">{payment.maskedAccount}</p>
      <p className="text-[11px] text-[#667085] mt-0.5">{payment.paymentType}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[14px] font-bold text-[#111827] dark:text-white tabular-nums">
        {formatPaymentCurrency(payment.amount)}
      </p>
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A]">
        Valid
      </span>
      {(onEdit || onRemove) && (
        <div className="flex gap-1 mt-2 justify-end">
          {onEdit && (
            <button type="button" onClick={onEdit} className="text-[11px] font-semibold text-[#0B5CAB] px-2 py-1 min-h-8">
              Edit
            </button>
          )}
          {onRemove && (
            <button type="button" onClick={onRemove} className="text-[11px] font-semibold text-[#DC2626] px-2 py-1 min-h-8">
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  </li>
);
