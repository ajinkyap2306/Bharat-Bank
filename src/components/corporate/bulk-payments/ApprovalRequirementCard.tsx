import React from 'react';
import { Shield } from 'lucide-react';
import type { BulkBatch } from '../../../types/corporateBulkPayments';
import { formatPaymentCurrency, PayCard } from '../payments/shared/CorporatePaymentsUI';

interface ApprovalRequirementCardProps {
  batch: BulkBatch;
}

export const ApprovalRequirementCard: React.FC<ApprovalRequirementCardProps> = ({ batch }) => (
  <PayCard className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
    <div className="flex items-start gap-3">
      <Shield className="w-5 h-5 text-[#0B5CAB] shrink-0 mt-0.5" aria-hidden />
      <div>
        <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white">Approval Required</h3>
        <p className="text-[12px] text-[#667085] mt-1">
          This batch requires corporate approval before processing.
        </p>
        <dl className="mt-3 space-y-1.5 text-[13px]">
          <div className="flex justify-between gap-4">
            <dt className="text-[#667085]">Total Amount</dt>
            <dd className="font-bold">{formatPaymentCurrency(batch.totalAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#667085]">Approval</dt>
            <dd className="font-semibold text-[#0B5CAB]">2-level approval</dd>
          </div>
        </dl>
      </div>
    </div>
  </PayCard>
);
