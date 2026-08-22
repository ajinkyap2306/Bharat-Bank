import React from 'react';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { PayCard } from '../shared/CorporatePaymentsUI';

interface MakerInformationProps {
  data: CorporatePaymentTrackingData;
}

export const MakerInformation: React.FC<MakerInformationProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Created By</h3>
    <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{data.createdBy}</p>
    <dl className="mt-3 space-y-2">
      <div className="flex justify-between text-[13px]">
        <dt className="text-slate-500 dark:text-slate-400">Role</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{data.createdRole}</dd>
      </div>
      <div className="flex justify-between text-[13px]">
        <dt className="text-slate-500 dark:text-slate-400">Created</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{data.createdAt}</dd>
      </div>
    </dl>
  </PayCard>
);
