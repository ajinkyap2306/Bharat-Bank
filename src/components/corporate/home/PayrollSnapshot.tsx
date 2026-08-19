import React from 'react';
import type { CorporatePayrollSnapshot } from '../../../types/corporateDashboard';
import { CorpCard, CorpSectionHeader, CorpSkeleton, CorpTxnStatus, formatCorpCurrency } from './shared/CorporateHomeUI';

interface PayrollSnapshotProps {
  payroll: CorporatePayrollSnapshot | null;
  isLoading?: boolean;
  onViewPayroll: () => void;
}

export const PayrollSnapshot: React.FC<PayrollSnapshotProps> = ({
  payroll,
  isLoading,
  onViewPayroll,
}) => (
  <section aria-label="Payroll">
    <CorpSectionHeader title="Payroll" action="View Payroll" onAction={onViewPayroll} />
    {isLoading ? (
      <CorpSkeleton className="h-28 mx-4" />
    ) : !payroll ? (
      <CorpCard className="mx-4! p-4 text-center">
        <p className="text-sm font-semibold text-[#111827] dark:text-white">No upcoming payroll</p>
      </CorpCard>
    ) : (
      <CorpCard className="mx-4! p-4 border-[#E4E7EC]">
        <p className="text-sm font-semibold text-[#111827] dark:text-white">{payroll.title}</p>
        <p className="text-[12px] text-[#667085] mt-0.5">{payroll.employeeCount} Employees</p>
        <p className="text-[18px] font-semibold text-[#111827] dark:text-white tabular-nums mt-2">
          {formatCorpCurrency(payroll.amount)}
        </p>
        <div className="mt-2">
          <CorpTxnStatus status={payroll.status} />
        </div>
      </CorpCard>
    )}
  </section>
);
