import React from 'react';
import { PaySkeleton } from '../shared/CorporatePaymentsUI';

export const PaymentSkeleton: React.FC = () => (
  <div className="space-y-4 pb-28">
    <PaySkeleton className="h-52 mx-4" />
    <PaySkeleton className="h-36" />
    <PaySkeleton className="h-28" />
    <PaySkeleton className="h-32" />
    <PaySkeleton className="h-32" />
    <PaySkeleton className="h-40" />
    <PaySkeleton className="h-48" />
    <PaySkeleton className="h-36" />
    <PaySkeleton className="h-28" />
  </div>
);
