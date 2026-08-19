import React from 'react';
import type { CorporateScheduledPaymentDetail } from '../../../../types/corporateScheduledPayments';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface ScheduledPaymentInfoProps {
  data: CorporateScheduledPaymentDetail;
}

const InfoRow: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <div className="py-3 border-b border-[#E4E7EC]/80 dark:border-slate-800 last:border-0">
    <p className="text-[11px] text-[#667085] font-medium">{label}</p>
    <p className="text-[14px] font-semibold text-[#111827] dark:text-white mt-0.5">{value}</p>
    {sub && <p className="text-[12px] text-[#667085] font-mono mt-0.5">{sub}</p>}
  </div>
);

export const ScheduledPaymentInfo: React.FC<ScheduledPaymentInfoProps> = ({ data }) => {
  const isRecurring = data.frequencyKey !== 'one_time';

  return (
    <>
      <PayCard className="p-4">
        <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-1">Payment Information</h3>
        <InfoRow
          label="Pay From"
          value={data.sourceAccount.name}
          sub={data.sourceAccount.maskedNumber}
        />
        <InfoRow
          label="Beneficiary"
          value={data.beneficiary.name}
          sub={data.beneficiary.maskedAccount}
        />
        <InfoRow label="Payment Type" value={data.paymentType} />
        <InfoRow label="Payment Method" value={data.paymentMethod} />
        {data.reference && <InfoRow label="Reference" value={data.reference} />}
      </PayCard>

      <PayCard className="p-4">
        <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-1">Schedule</h3>
        <InfoRow label="Frequency" value={data.frequency} />

        {isRecurring && data.monthlyDay && (
          <InfoRow label="Every" value={`${data.monthlyDay}th`} />
        )}

        {!isRecurring && (
          <>
            <InfoRow label="Payment Date" value={data.scheduledDate} />
            <InfoRow label="Payment Time" value={data.executionTime} />
          </>
        )}

        {isRecurring && (
          <>
            <InfoRow label="Next Payment" value={`${data.scheduledDate} • ${data.executionTime}`} />
            {data.endDate && <InfoRow label="End Date" value={data.endDate} />}
          </>
        )}
      </PayCard>

      {(data.createdBy || data.approvedBy) && (
        <PayCard className="p-4">
          <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-1">Approval</h3>
          {data.createdBy && (
            <InfoRow
              label="Created By"
              value={data.createdBy}
              sub={data.createdRole}
            />
          )}
          {data.approvedBy && (
            <InfoRow
              label="Approved By"
              value={data.approvedBy}
              sub={data.approvedRole}
            />
          )}
          {data.status === 'pending_approval' && (
            <p className="text-xs font-semibold text-amber-600 mt-2">Awaiting Checker approval</p>
          )}
        </PayCard>
      )}
    </>
  );
};
