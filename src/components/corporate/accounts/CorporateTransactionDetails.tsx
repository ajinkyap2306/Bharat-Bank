import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import type { CorporateTransactionDetails } from '../../../types/corporateTransactionDetails';
import { fetchTransactionDetails } from '../../../services/corporateTransactionDetailsService';
import { formatAccountCurrency } from './shared/CorporateAccountsUI';
import {
  TransactionDetailsHeader,
  TransactionDetailsSkeleton,
  TransactionDetailsError,
} from './transaction-details/TransactionDetailsHeader';
import { TransactionStatusHero } from './transaction-details/TransactionStatusHero';
import { TransactionAmountCard } from './transaction-details/TransactionAmountCard';
import { CounterpartyCard } from './transaction-details/CounterpartyCard';
import { SourceAccountCard } from './transaction-details/SourceAccountCard';
import { PaymentInformation } from './transaction-details/PaymentInformation';
import { TransactionReference } from './transaction-details/TransactionReference';
import { MakerInformation } from './transaction-details/MakerInformation';
import { ApprovalInformation } from './transaction-details/ApprovalInformation';
import { TransactionTimeline } from './transaction-details/TransactionTimeline';
import { TransactionReceiptActions } from './transaction-details/TransactionReceiptActions';
import { TransactionDetailsMoreSheet } from './transaction-details/TransactionDetailsMoreSheet';
import { ReportIssueSheet } from './transaction-details/ReportIssueSheet';

interface CorporateTransactionDetailsScreenProps {
  accountId: string;
  transactionId: string;
}

export const CorporateTransactionDetailsScreen: React.FC<
  CorporateTransactionDetailsScreenProps
> = ({ accountId, transactionId }) => {
  const navigate = useNavigate();
  const { setBottomNavHidden, setCorporateTab, addToast } = useBanking();

  const [details, setDetails] = useState<CorporateTransactionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    setBottomNavHidden(true);
    setCorporateTab('accounts');
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden, setCorporateTab]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const result = await fetchTransactionDetails(accountId, transactionId);
      if (!result) setError(true);
      else setDetails(result);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, transactionId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = () => navigate(`/corporate/accounts/${accountId}/transactions`);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      addToast({ type: 'success', title: 'Copied', message: `${label} copied to clipboard` });
    } catch {
      addToast({ type: 'info', title: 'Copied', message: `${label} copied` });
    }
  };

  const handleDownload = () => {
    addToast({ type: 'success', title: 'Receipt Downloaded', message: 'Transaction receipt saved.' });
  };

  const handleShare = () => {
    addToast({ type: 'info', title: 'Share', message: 'Receipt link copied to clipboard.' });
  };

  const handleCreateNewPayment = () => {
    addToast({ type: 'info', title: 'New Payment', message: 'Opening corporate payment flow.' });
    navigate('/corporate/home');
  };

  const handleViewApproval = () => {
    addToast({ type: 'info', title: 'Approvals', message: 'Opening approval details.' });
    navigate('/corporate/home');
  };

  const showReceiptActions =
    details &&
    !['Failed', 'Rejected', 'Pending Approval'].includes(details.status);

  if (error && !details) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 ">
        <TransactionDetailsHeader onBack={handleBack} onMore={() => setShowMore(true)} />
        <TransactionDetailsError onRetry={load} />
      </div>
    );
  }

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-6 ">
      <TransactionDetailsHeader onBack={handleBack} onMore={() => setShowMore(true)} />

      {isLoading && !details ? (
        <TransactionDetailsSkeleton />
      ) : details ? (
        <div className="space-y-4 pt-2">
          <TransactionStatusHero details={details} showBalances={showBalances} />

          <div className="px-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowBalances((v) => !v)}
              className="text-[12px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-2"
            >
              {showBalances ? 'Hide Balance' : 'Show Balance'}
            </button>
          </div>

          <TransactionAmountCard details={details} showBalances={showBalances} />

          <CounterpartyCard direction={details.direction} counterparty={details.counterparty} />

          <SourceAccountCard
            account={details.sourceAccount}
            currency={details.currency}
            showBalances={showBalances}
          />

          <PaymentInformation details={details} />

          <TransactionReference
            transactionId={details.transactionId}
            reference={details.reference}
            onCopy={handleCopy}
          />

          {details.createdBy && <MakerInformation createdBy={details.createdBy} />}

          <ApprovalInformation
            approvedBy={details.approvedBy}
            approvalLevels={details.approvalLevels}
            pendingApproval={details.pendingApproval}
          />

          <TransactionTimeline events={details.timeline} />

          {details.status === 'Failed' && (
            <div className="mx-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 p-4">
              <p className="text-[14px] font-semibold text-[#DC2626]">Payment Failed</p>
              {details.failureReason && (
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5">{details.failureReason}</p>
              )}
              {details.failureDate && (
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                  {details.failureDate}
                  {details.failureTime ? ` • ${details.failureTime}` : ''}
                </p>
              )}
              <button
                type="button"
                onClick={handleCreateNewPayment}
                className="mt-4 w-full py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
              >
                Create New Payment
              </button>
            </div>
          )}

          {details.status === 'Rejected' && (
            <div className="mx-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 p-4">
              <p className="text-[14px] font-semibold text-[#DC2626]">Payment Rejected</p>
              {details.rejectedBy && (
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
                  Rejected by {details.rejectedBy.name}
                </p>
              )}
              {details.rejectionReason && (
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">{details.rejectionReason}</p>
              )}
              <button
                type="button"
                onClick={handleCreateNewPayment}
                className="mt-4 w-full py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
              >
                Create New Payment
              </button>
            </div>
          )}

          {details.status === 'Pending Approval' && (
            <div className="mx-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 p-4">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                Pending Approval
              </p>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5">
                {details.pendingApproval?.message ??
                  'This transaction is waiting for the required corporate approval.'}
              </p>
              <button
                type="button"
                onClick={handleViewApproval}
                className="mt-4 w-full py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
              >
                View Approval
              </button>
            </div>
          )}

          {details.balanceAfter !== undefined && (
            <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
              <p className="text-[13px] text-slate-500 dark:text-slate-400">Balance After Transaction</p>
              <p className="text-[22px] font-semibold text-slate-900 dark:text-white tabular-nums mt-1">
                {showBalances
                  ? formatAccountCurrency(details.balanceAfter, details.currency)
                  : '••••••••'}
              </p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                Available balance after this transaction
              </p>
            </section>
          )}

          {showReceiptActions && (
            <TransactionReceiptActions onDownload={handleDownload} onShare={handleShare} />
          )}
        </div>
      ) : null}

      <TransactionDetailsMoreSheet
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        onDownload={handleDownload}
        onShare={handleShare}
        onReportIssue={() => setShowReport(true)}
      />

      <ReportIssueSheet
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={() => {
          addToast({
            type: 'success',
            title: 'Issue Submitted',
            message: 'Issue submitted successfully.',
          });
        }}
      />
    </div>
  );
};
