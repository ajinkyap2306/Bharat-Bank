import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CORPORATE_ACCOUNT_TRANSACTIONS, getAccountById } from '../../../../data/corporateAccountsMock';
import { useBanking } from '../../../../context/BankingContext';
import { AccountsCard, InfoRow, TxnStatusBadge, formatAccountCurrency } from '../shared/CorporateAccountsUI';

interface TransactionDetailScreenProps {
  txnId: string;
  onBack: () => void;
  onViewApproval: () => void;
}

export const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({
  txnId,
  onBack,
  onViewApproval,
}) => {
  const { addToast } = useBanking();
  const txn = CORPORATE_ACCOUNT_TRANSACTIONS.find((t) => t.id === txnId);
  const account = txn ? getAccountById(txn.accountId) : null;

  if (!txn) {
    return (
      <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full">
        <ScreenHeader title="Transaction Details" onBack={onBack} edgeToEdge={false} />
        <div className="p-6 text-center">
          <p className="text-sm font-bold">Unable to load transaction</p>
          <button type="button" onClick={onBack} className="mt-4 px-5 py-2.5 rounded-xl bg-[#0B5CAB] text-white text-sm font-bold">Retry</button>
        </div>
      </div>
    );
  }

  const isPending = txn.status === 'Pending Approval';
  const isFailed = txn.status === 'Failed';

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Transaction Details" onBack={onBack} edgeToEdge={false} />

      <div className="space-y-4">
        <AccountsCard className="p-4 text-center">
          <p className={`text-2xl font-bold font-mono ${txn.type === 'credit' ? 'text-[#16A34A]' : 'text-[#111827] dark:text-white'}`}>
            {txn.type === 'credit' ? '+' : '-'} {formatAccountCurrency(txn.amount, account?.currency || '₹')}
          </p>
          <div className="mt-2 flex justify-center">
            <TxnStatusBadge status={txn.status} />
          </div>
        </AccountsCard>

        {isPending && (
          <AccountsCard className="p-4 border-amber-200/80 bg-amber-50/50 dark:bg-amber-950/20">
            <p className="text-sm font-bold text-[#111827] dark:text-white">Pending Approval</p>
            <p className="text-xs text-[#667085] mt-1">Initiated by {txn.initiatedBy}</p>
            <p className="text-xs text-[#667085]">Created {txn.date} • {txn.time}</p>
            <button type="button" onClick={onViewApproval} className="mt-3 w-full py-2.5 rounded-xl bg-[#0B5CAB] text-white text-xs font-bold">
              View Approval
            </button>
          </AccountsCard>
        )}

        {isFailed && (
          <AccountsCard className="p-4 border-rose-200/80 bg-rose-50/50 dark:bg-rose-950/20">
            <p className="text-sm font-bold text-[#DC2626]">Transaction Failed</p>
            {txn.failureReason && <p className="text-xs text-[#667085] mt-1">{txn.failureReason}</p>}
            <button type="button" onClick={onBack} className="mt-3 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#667085]">
              View Details
            </button>
          </AccountsCard>
        )}

        <AccountsCard className="p-4">
          <p className="text-[10px] font-bold text-[#667085] uppercase mb-2">Transaction Information</p>
          <InfoRow label="Beneficiary" value={txn.counterpartyName} />
          <InfoRow label="Account" value={account?.maskedNumber || '—'} />
          <InfoRow label="Transaction type" value={txn.txnType} />
          <InfoRow label="Date" value={txn.date} />
          <InfoRow label="Time" value={txn.time} />
          <InfoRow label="Reference number" value={txn.referenceNumber} />
          <InfoRow label="Transaction ID" value={txn.transactionId} />
        </AccountsCard>

        {(txn.initiatedBy || txn.approvedBy) && (
          <AccountsCard className="p-4">
            <p className="text-[10px] font-bold text-[#667085] uppercase mb-2">Corporate Information</p>
            {txn.initiatedBy && <InfoRow label="Initiated by" value={txn.initiatedBy} />}
            {txn.approvedBy && <InfoRow label="Approved by" value={txn.approvedBy} />}
            {txn.approvalDate && <InfoRow label="Approval date" value={txn.approvalDate} />}
            <InfoRow label="Payment type" value={txn.paymentMode} />
            {txn.batchId && <InfoRow label="Batch ID" value={txn.batchId} />}
            {txn.remarks && <InfoRow label="Remarks" value={txn.remarks} />}
            <InfoRow label="Current status" value={txn.status} />
          </AccountsCard>
        )}

        {!isFailed && !isPending && (
          <div className="px-3 flex gap-2">
            <button
              type="button"
              onClick={() => addToast({ type: 'success', title: 'Receipt Downloaded', message: 'Transaction receipt saved.' })}
              className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Receipt
            </button>
            <button
              type="button"
              onClick={() => addToast({ type: 'info', title: 'Share', message: 'Receipt link copied.' })}
              className="flex-1 py-3 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
