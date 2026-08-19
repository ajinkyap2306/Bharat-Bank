import React from 'react';
import { PaySkeleton } from '../shared/CorporatePaymentsUI';

export const ScheduledPaymentsSkeleton: React.FC = () => (
  <div className="space-y-3 px-4">
    <PaySkeleton className="h-10 mx-0" />
    <PaySkeleton className="h-20 mx-0" />
    <PaySkeleton className="h-20 mx-0" />
    <PaySkeleton className="h-20 mx-0" />
  </div>
);
