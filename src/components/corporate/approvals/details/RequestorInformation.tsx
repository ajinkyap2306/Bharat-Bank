import React from 'react';
import type { ApprovalRequestor } from '../../../../types/corporateApprovalDetails';

interface RequestorInformationProps {
  requestor: ApprovalRequestor;
}

export const RequestorInformation: React.FC<RequestorInformationProps> = ({ requestor }) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
    <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">Created By</h2>
    <dl className="mt-3 space-y-2 text-[13px]">
      <div className="flex justify-between gap-3">
        <dt className="text-slate-500 dark:text-slate-400">Name</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{requestor.name}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-slate-500 dark:text-slate-400">Role</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{requestor.role}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-slate-500 dark:text-slate-400">Created</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{requestor.createdAt}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-slate-500 dark:text-slate-400">Department</dt>
        <dd className="font-medium text-slate-900 dark:text-white">{requestor.department}</dd>
      </div>
    </dl>
  </section>
);
