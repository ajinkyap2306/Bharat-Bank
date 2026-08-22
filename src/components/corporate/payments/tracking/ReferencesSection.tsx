import React from 'react';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';
import { CopyField } from './CopyField';

interface ReferencesSectionProps {
  data: CorporatePaymentTrackingData;
  onCopy: (value: string) => void;
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({ data, onCopy }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-1">References</h3>
    <CopyField label="Payment ID" value={data.id} onCopy={onCopy} />
    <CopyField label="Invoice" value={data.invoiceNumber} onCopy={onCopy} />
    {data.transactionId && (
      <CopyField label="Transaction ID" value={data.transactionId} onCopy={onCopy} />
    )}
  </PayCard>
);
