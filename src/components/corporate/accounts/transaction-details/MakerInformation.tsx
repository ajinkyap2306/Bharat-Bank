import React from 'react';
import type { CorporateUserRef } from '../../../../types/corporateTransactionDetails';

interface MakerInformationProps {
  createdBy: CorporateUserRef;
}

export const MakerInformation: React.FC<MakerInformationProps> = ({ createdBy }) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm" aria-label="Created By">
    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">Created By</h2>
    <p className="text-[15px] font-semibold text-slate-900 dark:text-white">{createdBy.name}</p>
    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Role: {createdBy.role}</p>
    {createdBy.date && (
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
        {createdBy.date}
        {createdBy.time ? ` • ${createdBy.time}` : ''}
      </p>
    )}
  </section>
);
