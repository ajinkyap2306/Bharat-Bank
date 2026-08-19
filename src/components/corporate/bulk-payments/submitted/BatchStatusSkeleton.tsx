import React from 'react';
import { PaySkeleton } from '../../payments/shared/CorporatePaymentsUI';

export const BatchStatusSkeleton: React.FC = () => (
  <div className="space-y-4 px-4 pt-4">
    <PaySkeleton className="h-40 mx-0" />
    <PaySkeleton className="h-28 mx-0" />
    <PaySkeleton className="h-36 mx-0" />
    <PaySkeleton className="h-48 mx-0" />
    <PaySkeleton className="h-32 mx-0" />
  </div>
);
