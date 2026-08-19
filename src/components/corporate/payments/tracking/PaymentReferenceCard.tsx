import React from 'react';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';
import { CopyField } from './CopyField';

interface PaymentReferenceCardProps {
  data: CorporatePaymentTrackingData;
  onCopy: (value: string) => void;
}

export const PaymentReferenceCard: React.FC<PaymentReferenceCardProps> = ({ data, onCopy }) => (
  <PayCard className="p-4">
    <CopyField label="Payment ID" value={data.id} onCopy={onCopy} />
    <CopyField label="Approval ID" value={data.approvalId} onCopy={onCopy} />
    {data.transactionId && (
      <CopyField label="Transaction ID" value={data.transactionId} onCopy={onCopy} />
    )}
  </PayCard>
);
