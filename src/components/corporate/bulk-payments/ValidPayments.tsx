import React, { useState } from 'react';
import type { BulkPaymentRecord } from '../../../types/corporateBulkPayments';
import { PayCard } from '../payments/shared/CorporatePaymentsUI';
import { BulkPaymentRow } from './BulkPaymentRow';
import { BottomSheet } from '../../common/BottomSheet';

interface ValidPaymentsProps {
  payments: BulkPaymentRecord[];
  totalValid: number;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  canEdit: boolean;
}

export const ValidPayments: React.FC<ValidPaymentsProps> = ({
  payments,
  totalValid,
  onEdit,
  onRemove,
  canEdit,
}) => {
  const [showAll, setShowAll] = useState(false);
  const valid = payments.filter((p) => p.status === 'valid');
  if (valid.length === 0 && totalValid === 0) return null;

  const preview = valid.slice(0, 3);

  return (
    <>
      <PayCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">Valid Payments</h3>
          <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">{totalValid} payments</span>
        </div>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800" aria-label="Valid payments">
          {preview.map((p) => (
            <BulkPaymentRow
              key={p.id}
              payment={p}
              onEdit={canEdit ? () => onEdit(p.id) : undefined}
              onRemove={canEdit ? () => onRemove(p.id) : undefined}
            />
          ))}
        </ul>
        {totalValid > 3 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-3 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-congress-blue-700 dark:text-congress-blue-400 text-[13px] font-semibold min-h-11"
          >
            View All Payments ({totalValid})
          </button>
        )}
      </PayCard>

      <BottomSheet isOpen={showAll} onClose={() => setShowAll(false)} title="All Valid Payments" maxHeight="max-h-[80vh]">
        <ul className="px-4 pb-6 divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800 max-h-[65vh] overflow-y-auto">
          {valid.map((p) => (
            <BulkPaymentRow
              key={p.id}
              payment={p}
              onEdit={canEdit ? () => onEdit(p.id) : undefined}
              onRemove={canEdit ? () => onRemove(p.id) : undefined}
            />
          ))}
        </ul>
      </BottomSheet>
    </>
  );
};
