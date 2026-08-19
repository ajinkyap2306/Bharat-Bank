import React from 'react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CorporateBeneficiaryRecord } from '../../../../types/corporateBeneficiaries';
import { getBeneficiaryRole } from '../../../../data/corporateBeneficiariesMock';
import { useBanking } from '../../../../context/BankingContext';
import {
  BenCard,
  BenStatusBadge,
  ReviewBenRow,
  StickyBenCTA,
  formatBenCurrency,
} from '../shared/CorporateBeneficiaryUI';

interface DetailProps {
  ben: CorporateBeneficiaryRecord;
  onBack: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReturn: () => void;
  onResubmit: () => void;
}

export const BeneficiaryDetailScreen: React.FC<DetailProps> = ({
  ben,
  onBack,
  onEdit,
  onDeactivate,
  onApprove,
  onReject,
  onReturn,
  onResubmit,
}) => {
  const { user } = useBanking();
  const role = getBeneficiaryRole(user.role);
  const isChecker = role === 'checker' || role === 'admin';
  const isPending = ben.status === 'Pending Approval';
  const isBlocked = ben.status === 'Blocked';
  const isRejected = ben.status === 'Rejected';
  const isActive = ben.status === 'Active' || ben.status === 'Cooling Period';

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-28">
      <ScreenHeader title="Beneficiary Details" onBack={onBack} edgeToEdge={false} />

      <BenCard className="p-4 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#111827] dark:text-white">{ben.name}</h2>
            <p className="text-xs text-[#667085] mt-1">{ben.typeLabel}</p>
          </div>
          <BenStatusBadge status={ben.status} />
        </div>
      </BenCard>

      <BenCard className="p-4">
        <ReviewBenRow label="Beneficiary Type" value={ben.typeLabel} />
        <ReviewBenRow label="Bank" value={ben.bankName} />
        <ReviewBenRow label="Account Number" value={ben.maskedAccount} />
        <ReviewBenRow label="IFSC" value={ben.ifsc} />
        <ReviewBenRow label="Beneficiary ID" value={ben.beneficiaryId} />
        <ReviewBenRow label="Added On" value={ben.createdDate} />
        <ReviewBenRow
          label="Added By"
          value={ben.createdRole ? `${ben.createdBy} · ${ben.createdRole}` : ben.createdBy}
        />
        {ben.approvedBy && <ReviewBenRow label="Approved By" value={ben.approvedBy} />}
        {ben.lastPaymentAmount && (
          <ReviewBenRow label="Last Payment" value={formatBenCurrency(ben.lastPaymentAmount)} />
        )}
        {ben.lastPaymentDate && <ReviewBenRow label="Last Payment Date" value={ben.lastPaymentDate} />}
        {isBlocked && ben.blockedReason && <ReviewBenRow label="Reason" value={ben.blockedReason} />}
        {isBlocked && ben.blockedOn && <ReviewBenRow label="Blocked On" value={ben.blockedOn} />}
      </BenCard>

      {isRejected && (
        <BenCard className="p-4 mt-4 border-rose-200 bg-rose-50/50">
          <p className="text-sm font-bold text-[#DC2626]">Beneficiary Rejected</p>
          <p className="text-xs text-[#667085] mt-1">By {ben.rejectedBy}</p>
          <p className="text-xs mt-1">{ben.rejectionReason}</p>
          <button type="button" onClick={onResubmit} className="mt-3 text-sm font-bold text-[#0B5CAB] min-h-11">
            Edit & Resubmit
          </button>
        </BenCard>
      )}

      {isPending && isChecker && (
        <div className="fixed bottom-0 left-0 right-0 p-3 flex gap-2 bg-[#F7F9FC]/95 backdrop-blur-md border-t">
          <button
            type="button"
            onClick={onReturn}
            className="flex-1 py-3.5 rounded-2xl border font-bold text-sm min-h-11"
          >
            Return
          </button>
          <button
            type="button"
            onClick={onReject}
            className="flex-1 py-3.5 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm min-h-11"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="flex-1 py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11"
          >
            Approve
          </button>
        </div>
      )}

      {isActive && !isChecker && (
        <div className="fixed bottom-0 left-0 right-0 p-3 flex gap-2 bg-[#F7F9FC]/95 backdrop-blur-md border-t">
          <button type="button" onClick={onEdit} className="flex-1 py-3.5 rounded-2xl border font-bold text-sm min-h-11">
            Edit Beneficiary
          </button>
          <button
            type="button"
            onClick={onDeactivate}
            className="flex-1 py-3.5 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm min-h-11"
          >
            Deactivate Beneficiary
          </button>
        </div>
      )}

      {isPending && !isChecker && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#F7F9FC]/95 backdrop-blur-md border-t">
          <p className="text-center text-xs text-amber-600 font-bold mb-2">Pending Checker Approval</p>
          <button type="button" disabled className="w-full py-3.5 rounded-2xl border text-[#667085] font-bold text-sm min-h-11">
            Awaiting Approval
          </button>
        </div>
      )}
    </div>
  );
};

export const ApproveConfirmScreen: React.FC<{ ben: CorporateBeneficiaryRecord; onBack: () => void; onConfirm: () => void }> = ({
  ben,
  onBack,
  onConfirm,
}) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title="Approve Beneficiary?" onBack={onBack} edgeToEdge={false} />
    <BenCard className="p-4">
      <ReviewBenRow label="Beneficiary" value={ben.name} />
      <ReviewBenRow label="Bank" value={ben.bankName} />
      <ReviewBenRow label="Account" value={ben.maskedAccount} />
      <ReviewBenRow label="IFSC" value={ben.ifsc} />
      <ReviewBenRow label="Type" value={ben.typeLabel} />
      <ReviewBenRow label="Beneficiary ID" value={ben.beneficiaryId} />
    </BenCard>
    <StickyBenCTA label="Approve Beneficiary" onClick={onConfirm} />
  </div>
);

export const RejectReasonScreen: React.FC<{ onBack: () => void; onConfirm: (reason: string) => void }> = ({
  onBack,
  onConfirm,
}) => {
  const [reason, setReason] = React.useState('');
  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Reject Beneficiary" onBack={onBack} edgeToEdge={false} />
      <BenCard className="p-4">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Bank details do not match vendor records."
          rows={4}
          className="w-full p-3 rounded-xl border text-sm"
        />
      </BenCard>
      <StickyBenCTA label="Confirm Rejection" onClick={() => onConfirm(reason)} disabled={!reason.trim()} variant="danger" />
    </div>
  );
};

export const ConfirmActionScreen: React.FC<{
  title: string;
  message: string;
  confirmLabel: string;
  onBack: () => void;
  onConfirm: () => void;
  danger?: boolean;
}> = ({ title, message, confirmLabel, onBack, onConfirm, danger }) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title={title} onBack={onBack} edgeToEdge={false} />
    <BenCard className="p-4">
      <p className="text-sm text-[#667085]">{message}</p>
    </BenCard>
    <StickyBenCTA label={confirmLabel} onClick={onConfirm} variant={danger ? 'danger' : 'primary'} />
  </div>
);
