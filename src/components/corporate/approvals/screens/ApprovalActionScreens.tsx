import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CorporateApprovalRequest } from '../../../../types/corporateApprovals';
import { REJECTION_REASONS } from '../../../../data/corporateApprovalsMock';
import {
  ApprovalCard,
  ReviewRow,
  StickyApprovalCTA,
  formatApprovalCurrency,
} from '../shared/CorporateApprovalsUI';

export const ApproveConfirmScreen: React.FC<{
  request: CorporateApprovalRequest;
  onBack: () => void;
  onConfirm: () => void;
}> = ({ request, onBack, onConfirm }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title="Approve Request" onBack={onBack} edgeToEdge={false} />
    <div className="px-3">
      <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Approve this request?</p>
      <ApprovalCard className="p-4">
        <ReviewRow label="Request ID" value={request.requestId} />
        <ReviewRow label="Subject" value={request.title} />
        {request.amount !== undefined && request.amount > 0 && (
          <ReviewRow label="Amount" value={formatApprovalCurrency(request.amount)} />
        )}
        {request.debitAccount && <ReviewRow label="Account" value={request.debitAccount} />}
        <ReviewRow label="Stage" value={`Level ${request.currentApprovals + 1} of ${request.requiredApprovals}`} />
      </ApprovalCard>
    </div>
    <StickyApprovalCTA label="Approve" onClick={onConfirm} secondaryLabel="Cancel" onSecondary={onBack} />
  </div>
);

export const AuthScreen: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  onConfirm: () => void;
}> = ({ title, subtitle = 'Verify your identity to approve this request.', onBack, onConfirm }) => {
  const [mpin, setMpin] = useState('');
  const [otp, setOtp] = useState('');
  const [method, setMethod] = useState<'mpin' | 'otp' | 'biometric'>('mpin');

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title={title} onBack={onBack} edgeToEdge={false} />
      <ApprovalCard className="p-4 mx-3 space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        <div className="flex gap-2">
          {(['mpin', 'otp', 'biometric'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize min-h-11 ${
                method === m ? 'bg-congress-blue-700 text-white' : 'bg-slate-100 text-slate-500 dark:text-slate-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {method === 'mpin' && (
          <input
            type="password"
            maxLength={6}
            value={mpin}
            onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter MPIN"
            className="w-full p-3 rounded-xl border text-center text-lg tracking-widest font-mono"
          />
        )}
        {method === 'otp' && (
          <input
            type="password"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter OTP"
            className="w-full p-3 rounded-xl border text-center text-lg tracking-widest font-mono"
          />
        )}
        {method === 'biometric' && (
          <button type="button" className="w-full py-4 rounded-xl border border-dashed text-sm font-bold text-congress-blue-700 dark:text-congress-blue-400 min-h-11">
            Use Biometric Authentication
          </button>
        )}
      </ApprovalCard>
      <StickyApprovalCTA
        label="Authorize"
        onClick={onConfirm}
        disabled={method === 'mpin' ? mpin.length < 4 : method === 'otp' ? otp.length < 6 : false}
      />
    </div>
  );
};

export const ApproveSuccessScreen: React.FC<{
  request: CorporateApprovalRequest;
  approvedBy: string;
  onDone: () => void;
}> = ({ request, approvedBy, onDone }) => {
  const needsMore = request.currentApprovals + 1 < request.requiredApprovals;
  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center p-6 text-center pb-24">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Approved</h2>
      <ApprovalCard className="p-4 mt-4 w-full text-left">
        <ReviewRow label="Request ID" value={request.requestId} />
        <ReviewRow label="Type" value={request.requestType} />
        {request.amount !== undefined && request.amount > 0 && (
          <ReviewRow label="Amount" value={formatApprovalCurrency(request.amount)} />
        )}
        <ReviewRow label="Approved By" value={approvedBy} />
        <ReviewRow label="Date" value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
        <ReviewRow label="Status" value={needsMore ? 'Pending Next Approval' : 'Approved'} />
      </ApprovalCard>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-4">
        {needsMore ? 'Next approval required' : 'Authorization Complete'}
      </p>
      <StickyApprovalCTA label="Done" onClick={onDone} />
    </div>
  );
};

export const RejectReasonScreen: React.FC<{
  onBack: () => void;
  onNext: (reason: string) => void;
}> = ({ onBack, onNext }) => {
  const [reason, setReason] = useState('');
  const [custom, setCustom] = useState('');

  const finalReason = reason === 'Other' ? custom : reason;

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Rejection Reason" onBack={onBack} edgeToEdge={false} />
      <div className="px-3 space-y-2">
        {REJECTION_REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className={`w-full p-3 rounded-xl text-left text-sm font-medium min-h-11 ${
              reason === r ? 'bg-congress-blue-50 dark:bg-congress-blue-950/40 border-2 border-congress-blue-700' : 'bg-white border border-slate-200'
            }`}
          >
            {r}
          </button>
        ))}
        {reason === 'Other' && (
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Enter custom reason"
            className="w-full p-3 rounded-xl border text-sm min-h-20"
          />
        )}
      </div>
      <StickyApprovalCTA
        label="Continue"
        onClick={() => onNext(finalReason)}
        disabled={!finalReason.trim()}
        secondaryLabel="Cancel"
        onSecondary={onBack}
      />
    </div>
  );
};

export const RejectConfirmScreen: React.FC<{
  request: CorporateApprovalRequest;
  reason: string;
  onBack: () => void;
  onConfirm: () => void;
}> = ({ request, reason, onBack, onConfirm }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title="Confirm Rejection" onBack={onBack} edgeToEdge={false} />
    <div className="px-3">
      <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">Reject this request?</p>
      <ApprovalCard className="p-4">
        <ReviewRow label="Request ID" value={request.requestId} />
        <ReviewRow label="Type" value={request.requestType} />
        {request.amount !== undefined && request.amount > 0 && (
          <ReviewRow label="Amount" value={formatApprovalCurrency(request.amount)} />
        )}
        <ReviewRow label="Subject" value={request.title} />
        <ReviewRow label="Reason" value={reason} />
      </ApprovalCard>
    </div>
    <StickyApprovalCTA label="Confirm Rejection" onClick={onConfirm} variant="danger" secondaryLabel="Cancel" onSecondary={onBack} />
  </div>
);

export const RejectSuccessScreen: React.FC<{
  request: CorporateApprovalRequest;
  rejectedBy: string;
  reason: string;
  onDone: () => void;
}> = ({ request, rejectedBy, reason, onDone }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center p-6 text-center pb-24">
    <div className="w-16 h-16 rounded-full bg-rose-100 text-[#DC2626] flex items-center justify-center mb-4">
      <XCircle className="w-8 h-8" />
    </div>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Request Rejected</h2>
    <ApprovalCard className="p-4 mt-4 w-full text-left">
      <ReviewRow label="Request ID" value={request.requestId} />
      <ReviewRow label="Rejected By" value={rejectedBy} />
      <ReviewRow label="Date" value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
      <ReviewRow label="Reason" value={reason} />
    </ApprovalCard>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Return to Maker for correction</p>
    <StickyApprovalCTA label="Done" onClick={onDone} />
  </div>
);

export const ChangesRequestScreen: React.FC<{
  onBack: () => void;
  onNext: (comments: string) => void;
}> = ({ onBack, onNext }) => {
  const [comments, setComments] = useState('');
  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Request Changes" onBack={onBack} edgeToEdge={false} />
      <div className="px-3">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Enter comments for the maker</p>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Please correct the invoice reference before resubmission."
          className="w-full p-3 rounded-xl border text-sm min-h-30"
        />
      </div>
      <StickyApprovalCTA
        label="Send Back"
        onClick={() => onNext(comments)}
        disabled={!comments.trim()}
        secondaryLabel="Cancel"
        onSecondary={onBack}
      />
    </div>
  );
};

export const ChangesSuccessScreen: React.FC<{
  request: CorporateApprovalRequest;
  onDone: () => void;
}> = ({ request, onDone }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center p-6 text-center pb-24">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Changes Requested</h2>
    <ApprovalCard className="p-4 mt-4 w-full text-left">
      <ReviewRow label="Request ID" value={request.requestId} />
      <ReviewRow label="Status" value="Changes Requested" />
    </ApprovalCard>
    <StickyApprovalCTA label="Done" onClick={onDone} />
  </div>
);
