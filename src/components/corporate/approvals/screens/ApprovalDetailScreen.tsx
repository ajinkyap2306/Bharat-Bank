import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CorporateApprovalRequest } from '../../../../types/corporateApprovals';
import { APPROVER_LIMIT } from '../../../../data/corporateApprovalsMock';
import {
  ApprovalCard,
  ApprovalStatusBadge,
  ReviewRow,
  StickyApprovalCTA,
  formatApprovalCurrency,
} from '../shared/CorporateApprovalsUI';

interface ApprovalDetailScreenProps {
  request: CorporateApprovalRequest;
  canApprove: boolean;
  isSelfRequest: boolean;
  exceedsLimit: boolean;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges: () => void;
  onAudit: () => void;
}

export const ApprovalDetailScreen: React.FC<ApprovalDetailScreenProps> = ({
  request,
  canApprove,
  isSelfRequest,
  exceedsLimit: overLimit,
  onBack,
  onApprove,
  onReject,
  onRequestChanges,
  onAudit,
}) => {
  const headerTitle = `${request.categoryLabel} Approval`;

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-32">
      <ScreenHeader title={headerTitle} onBack={onBack} edgeToEdge={false} />
      <div className="px-3 space-y-3">
        <div className="flex items-center justify-between">
          <ApprovalStatusBadge status="Pending Approval" />
          {request.priority === 'high' && (
            <span className="text-[10px] font-bold text-[#F59E0B]">High Priority</span>
          )}
          {request.priority === 'urgent' && (
            <span className="text-[10px] font-bold text-[#DC2626]">Urgent</span>
          )}
        </div>

        {request.expiresAt && (
          <ApprovalCard className="p-3 border-amber-200 bg-amber-50/50">
            <p className="text-xs font-bold text-[#F59E0B]">Approval expires soon</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{request.expiresAt}</p>
          </ApprovalCard>
        )}

        <ApprovalCard className="p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Request Summary</p>
          <ReviewRow label="Request ID" value={request.requestId} />
          <ReviewRow label="Request Type" value={request.requestType} />
          <ReviewRow label="Created" value={request.createdAt} />
          <ReviewRow label="Created By" value={request.createdBy} />
          <ReviewRow label="Current Stage" value={`Level ${request.currentApprovals + 1} of ${request.requiredApprovals}`} />
        </ApprovalCard>

        {(request.amount !== undefined || request.beneficiaryName) && (
          <ApprovalCard className="p-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
              {request.category === 'payment' ? 'Payment Details' : 'Request Details'}
            </p>
            {request.beneficiaryName && <ReviewRow label="Beneficiary" value={request.beneficiaryName} />}
            {request.debitAccount && <ReviewRow label="Debit Account" value={request.debitAccount} />}
            {request.amount !== undefined && request.amount > 0 && (
              <ReviewRow label="Amount" value={formatApprovalCurrency(request.amount)} />
            )}
            {request.charges !== undefined && <ReviewRow label="Charges" value={formatApprovalCurrency(request.charges)} />}
            {request.paymentDate && <ReviewRow label="Payment Date" value={request.paymentDate} />}
            {request.purpose && <ReviewRow label="Purpose" value={request.purpose} />}
            {request.reference && <ReviewRow label="Reference" value={request.reference} />}
          </ApprovalCard>
        )}

        <ApprovalCard className="p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Created By</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{request.createdBy}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Role: {request.createdByRole}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{request.createdAt}</p>
        </ApprovalCard>

        {request.amount !== undefined && request.amount > 0 && (
          <ApprovalCard className="p-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Your Approval Limit</p>
            <p className="text-lg font-mono font-bold text-slate-900 dark:text-white">{formatApprovalCurrency(APPROVER_LIMIT)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payment Amount</p>
            <p className="text-sm font-mono font-bold">{formatApprovalCurrency(request.amount)}</p>
            {overLimit ? (
              <p className="text-xs font-bold text-[#DC2626] mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Approval limit exceeded
              </p>
            ) : (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Within your approval limit
              </p>
            )}
          </ApprovalCard>
        )}

        <ApprovalCard className="p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Approval Policy</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{request.currentApprovals} of {request.requiredApprovals} approvals completed</p>
          {request.approvalLevels.map((level) => (
            <div key={level.level} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                level.status === 'approved' ? 'bg-emerald-600 text-white' :
                level.status === 'pending' ? 'bg-congress-blue-700 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {level.status === 'approved' ? '✓' : level.status === 'pending' ? '●' : '○'}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Level {level.level}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{level.role}</p>
                {level.name && <p className="text-[10px] text-slate-500 dark:text-slate-400">{level.name}</p>}
              </div>
              {level.date && <span className="text-[10px] text-slate-500 dark:text-slate-400">{level.date}</span>}
            </div>
          ))}
        </ApprovalCard>

        <ApprovalCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Approval History</p>
            <button type="button" onClick={onAudit} className="text-[10px] font-bold text-congress-blue-700 dark:text-congress-blue-400">View Audit</button>
          </div>
          {request.timeline.map((event) => (
            <div key={event.id} className="flex gap-3 py-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                event.status === 'completed' ? 'bg-emerald-600 text-white' :
                event.status === 'pending' ? 'bg-congress-blue-700 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {event.status === 'completed' ? '✓' : event.status === 'pending' ? '●' : '○'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{event.label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{event.user}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{event.date} • {event.time}</p>
                {event.comments && <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-0.5">{event.comments}</p>}
              </div>
            </div>
          ))}
        </ApprovalCard>

        {request.notes && (
          <ApprovalCard className="p-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Notes</p>
            <p className="text-sm text-slate-900 dark:text-white">{request.notes}</p>
          </ApprovalCard>
        )}

        {isSelfRequest && (
          <ApprovalCard className="p-3 border-amber-200 bg-amber-50/50">
            <p className="text-xs font-bold text-[#F59E0B] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              You created this request and cannot approve it.
            </p>
          </ApprovalCard>
        )}
      </div>

      {request.status === 'pending' && canApprove && !isSelfRequest && (
        <StickyApprovalCTA
          label={overLimit ? 'Limit Exceeded' : 'Approve'}
          onClick={onApprove}
          disabled={overLimit}
          secondaryLabel="Reject"
          onSecondary={onReject}
        />
      )}

      {request.status === 'pending' && canApprove && !isSelfRequest && !overLimit && (
        <div className="fixed bottom-20 left-0 right-0 z-20 px-3">
          <div className="max-w-lg mx-auto">
            <button type="button" onClick={onRequestChanges} className="w-full py-3 rounded-xl border border-congress-blue-700 text-congress-blue-700 dark:text-congress-blue-400 font-bold text-sm bg-white dark:bg-slate-900 min-h-11">
              Request Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AuditTrailScreen: React.FC<{
  request: CorporateApprovalRequest;
  onBack: () => void;
}> = ({ request, onBack }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-8">
    <ScreenHeader title="Approval Audit Trail" onBack={onBack} edgeToEdge={false} />
    <div className="px-3 space-y-2">
      {request.timeline.map((event) => (
        <ApprovalCard key={event.id} className="p-4">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{event.date} • {event.time}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{event.label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{event.user}</p>
          {event.comments && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">{event.comments}</p>}
        </ApprovalCard>
      ))}
    </div>
  </div>
);
