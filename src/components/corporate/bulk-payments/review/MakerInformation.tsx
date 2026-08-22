import React from 'react';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { PayCard } from '../../payments/shared/CorporatePaymentsUI';

interface MakerInformationProps {
  data: BulkBatchReview;
}

export const MakerInformation: React.FC<MakerInformationProps> = ({ data }) => (
  <PayCard className="p-4">
    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-3">Submitted By</h3>
    <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{data.createdBy}</p>
    <dl className="mt-3 space-y-2 text-[13px]">
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Role</dt>
        <dd className="font-medium">{data.createdRole}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-500 dark:text-slate-400">Department</dt>
        <dd className="font-medium">{data.department}</dd>
      </div>
    </dl>
  </PayCard>
);
