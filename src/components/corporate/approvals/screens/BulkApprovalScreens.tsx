import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CorporateApprovalRequest } from '../../../../types/corporateApprovals';
import { ApprovalCard, ReviewRow, StickyApprovalCTA, formatApprovalCurrency } from '../shared/CorporateApprovalsUI';

export const BulkReviewScreen: React.FC<{
  requests: CorporateApprovalRequest[];
  onBack: () => void;
  onApprove: () => void;
}> = ({ requests, onBack, onApprove }) => {
  const total = requests.reduce((s, r) => s + (r.amount || 0), 0);
  const categories = [...new Set(requests.map((r) => r.categoryLabel))];

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Review Selected Requests" onBack={onBack} edgeToEdge={false} />
      <div className="px-3 space-y-3">
        <ApprovalCard className="p-4">
          <p className="text-xs font-bold text-[#667085] uppercase">Summary</p>
          <p className="text-sm font-bold text-[#111827] dark:text-white mt-2">{requests.length} Requests</p>
          <p className="text-xs text-[#667085]">{categories.join(', ')}</p>
          {total > 0 && (
            <>
              <p className="text-xs text-[#667085] mt-3">Total</p>
              <p className="text-lg font-mono font-bold text-[#111827] dark:text-white">{formatApprovalCurrency(total)}</p>
            </>
          )}
        </ApprovalCard>
        {requests.map((r) => (
          <ApprovalCard key={r.id} className="p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-[#0B5CAB]">{r.categoryLabel}</p>
                <p className="text-sm font-bold text-[#111827] dark:text-white">{r.title}</p>
              </div>
              {r.amount !== undefined && r.amount > 0 && (
                <p className="text-sm font-mono font-bold">{formatApprovalCurrency(r.amount)}</p>
              )}
            </div>
          </ApprovalCard>
        ))}
      </div>
      <StickyApprovalCTA label="Approve Selected" onClick={onApprove} secondaryLabel="Cancel" onSecondary={onBack} />
    </div>
  );
};

export interface BulkResultItem {
  id: string;
  title: string;
  status: 'approved' | 'failed';
  reason?: string;
}

export const BulkResultScreen: React.FC<{
  results: BulkResultItem[];
  onDone: () => void;
}> = ({ results, onDone }) => {
  const approved = results.filter((r) => r.status === 'approved').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full flex flex-col items-center p-6 pb-24">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="text-lg font-bold text-[#111827] dark:text-white">Approval Completed</h2>
      <ApprovalCard className="p-4 mt-4 w-full">
        <ReviewRow label="Selected" value={`${results.length} Requests`} />
        <ReviewRow label="Approved" value={String(approved)} />
        <ReviewRow label="Failed" value={String(failed)} />
      </ApprovalCard>
      <div className="w-full mt-4 space-y-2">
        {results.map((r) => (
          <ApprovalCard key={r.id} className="p-3">
            <div className="flex justify-between">
              <p className="text-sm font-bold text-[#111827] dark:text-white">{r.title}</p>
              <span className={`text-xs font-bold ${r.status === 'approved' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                {r.status === 'approved' ? 'Approved' : 'Failed'}
              </span>
            </div>
            {r.reason && <p className="text-[10px] text-[#667085] mt-1">{r.reason}</p>}
          </ApprovalCard>
        ))}
      </div>
      <StickyApprovalCTA label="View Results" onClick={onDone} />
    </div>
  );
};
