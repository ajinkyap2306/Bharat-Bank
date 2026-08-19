import React from 'react';
import type { BulkBatchTrackingData } from '../../../../types/corporateBulkBatchStatus';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';
import { CopyField } from '../../payments/tracking/CopyField';

interface BatchReferenceCardProps {
  data: BulkBatchTrackingData;
  onCopy: (value: string) => void;
}

export const BatchReferenceCard: React.FC<BatchReferenceCardProps> = ({ data, onCopy }) => (
  <PayCard className="p-4">
    <CopyField label="Batch ID" value={data.batchId} onCopy={onCopy} />
    <CopyField label="Batch Reference" value={data.reference} onCopy={onCopy} />
  </PayCard>
);
