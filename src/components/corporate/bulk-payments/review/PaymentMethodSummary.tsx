import React, { useState } from 'react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';
import { BottomSheet } from '../../../common/BottomSheet';

interface PaymentMethodSummaryProps {
  data: BulkBatchReview;
}

export const PaymentMethodSummary: React.FC<PaymentMethodSummaryProps> = ({ data }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const single = data.paymentMethods.length === 1;

  return (
    <>
      <PayCard className="p-4">
        <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Payment Method</h3>
        {single ? (
          <p className="text-[15px] font-semibold text-[#111827] dark:text-white">
            {data.paymentMethods[0].method}
          </p>
        ) : (
          <>
            <p className="text-[15px] font-semibold text-[#111827] dark:text-white">Multiple Payment Methods</p>
            <button
              type="button"
              onClick={() => setShowBreakdown(true)}
              className="mt-3 w-full py-2.5 rounded-xl border border-[#E4E7EC] text-[#0B5CAB] text-[13px] font-semibold min-h-11"
            >
              View Payment Breakdown
            </button>
          </>
        )}
      </PayCard>

      <BottomSheet isOpen={showBreakdown} onClose={() => setShowBreakdown(false)} title="Payment Methods">
        <ul className="px-4 pb-6 space-y-3">
          {data.paymentMethods.map((m) => (
            <li
              key={m.method}
              className="flex justify-between py-3 border-b border-[#E4E7EC] dark:border-slate-800 last:border-0"
            >
              <span className="font-semibold">{m.method}</span>
              <span className="text-[#667085]">{m.count} payments</span>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </>
  );
};
