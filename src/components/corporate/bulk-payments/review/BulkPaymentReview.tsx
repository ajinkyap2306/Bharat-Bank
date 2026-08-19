import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { clonePreferences } from '../../../../data/corporateAccountPreferencesMock';
import {
  fetchBatchReview,
  submitBatchForApproval,
} from '../../../../data/corporateBulkPaymentReviewMock';
import type { BulkBatchReview } from '../../../../types/corporateBulkPaymentReview';
import { BulkPaymentSkeleton } from '../BulkPaymentSkeleton';
import { BulkPaymentErrorState } from '../BulkPaymentErrorState';
import { ReviewHeader } from './ReviewHeader';
import { ReviewProgress } from './ReviewProgress';
import { BatchReadyStatus } from './BatchReadyStatus';
import { BatchInformation } from './BatchInformation';
import { DebitAccountSummary } from './DebitAccountSummary';
import { BatchFinancialSummary } from './BatchFinancialSummary';
import { ValidationSummary } from './ValidationSummary';
import { DuplicateCheck } from './DuplicateCheck';
import { BulkLimitCheck } from './BulkLimitCheck';
import { BatchSizeCheck } from './BatchSizeCheck';
import { PaymentDateSummary } from './PaymentDateSummary';
import { PaymentMethodSummary } from './PaymentMethodSummary';
import { PaymentBreakdown } from './PaymentBreakdown';
import { RecipientPreview } from './RecipientPreview';
import { ApprovalRequirement } from './ApprovalRequirement';
import { MakerInformation } from './MakerInformation';
import { BatchConfirmation } from './BatchConfirmation';
import { SubmitConfirmationSheet } from './SubmitConfirmationSheet';
import { SubmitErrorState } from './SubmitErrorState';
import { HighValueBatchWarning } from './HighValueBatchWarning';

export const BulkPaymentReview: React.FC = () => {
  const { batchId = '' } = useParams<{ batchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, openDetailFlow, closeDetailFlow } = useBanking();

  const [data, setData] = useState<BulkBatchReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showSubmitSheet, setShowSubmitSheet] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const variant = searchParams.get('variant');
  const hideBalance = clonePreferences(data?.account.id ?? 'acc_corp_op_01')?.hideBalance ?? false;

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const result = await fetchBatchReview(batchId, variant);
      if (!result) {
        setLoadError(true);
        setData(null);
      } else {
        setData(result);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [batchId, variant]);

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow();
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  useEffect(() => {
    load();
  }, [load]);

  const canSubmit = useMemo(() => {
    if (!data) return false;
    return (
      data.isReady &&
      data.errorCount === 0 &&
      data.duplicateCount === 0 &&
      data.balanceAfter >= 0 &&
      data.dailyRemaining >= 0 &&
      data.paymentCount <= data.maxBatchSize &&
      confirmed &&
      !submitting
    );
  }, [data, confirmed, submitting]);

  const handleBack = () => navigate('/corporate/bulk-payments/create');

  const handleEdit = () => navigate('/corporate/bulk-payments/create');

  const handleViewErrors = () => navigate('/corporate/bulk-payments/create');

  const handleReviewDuplicates = () => navigate('/corporate/bulk-payments/create');

  const handleViewAllPayments = () => {
    addToast({
      type: 'info',
      title: 'All payments',
      message: 'Full payment list will be available in a future update.',
    });
  };

  const handleSubmitClick = () => {
    if (!canSubmit) return;
    setShowSubmitSheet(true);
  };

  const handleConfirmSubmit = async () => {
    if (!data) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      const fail = searchParams.get('submit') === 'fail';
      await submitBatchForApproval(batchId, fail);
      setShowSubmitSheet(false);
      addToast({
        type: 'success',
        title: 'Batch Submitted for Approval',
        message: `${data.validCount} payments submitted for corporate approval.`,
      });
      navigate(`/corporate/bulk-payments/${batchId}/submitted`, { replace: true });
    } catch {
      setSubmitError(true);
      setShowSubmitSheet(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] -mx-3">
        <ReviewHeader onBack={handleBack} onHelp={() => {}} />
        <BulkPaymentSkeleton />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] -mx-3">
        <ReviewHeader onBack={() => navigate('/corporate/bulk-payments')} onHelp={() => {}} />
        <BulkPaymentErrorState
          title="Unable to load batch"
          message="Please try again."
          onRetry={load}
        />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] -mx-3">
      <ReviewHeader
        onBack={submitting ? () => {} : handleBack}
        onHelp={() =>
          addToast({ type: 'info', title: 'Bulk payment help', message: 'Contact treasury support.' })
        }
      />

      <main className="space-y-4 pt-4 pb-36">
        <ReviewProgress />
        <BatchReadyStatus isReady={data.isReady} />
        <BatchInformation data={data} onEdit={submitting ? () => {} : handleEdit} />
        <DebitAccountSummary data={data} hideBalance={hideBalance} />
        <BatchFinancialSummary data={data} />
        <ValidationSummary
          data={data}
          onViewErrors={data.errorCount > 0 ? handleViewErrors : undefined}
        />
        <DuplicateCheck
          data={data}
          onReviewDuplicates={data.duplicateCount > 0 ? handleReviewDuplicates : undefined}
        />
        <BulkLimitCheck data={data} />
        <BatchSizeCheck data={data} />
        <PaymentDateSummary data={data} />
        <PaymentMethodSummary data={data} />
        <PaymentBreakdown data={data} />
        <RecipientPreview data={data} onViewAll={handleViewAllPayments} />
        <ApprovalRequirement data={data} />
        <MakerInformation data={data} />
        <HighValueBatchWarning data={data} />
        <BatchConfirmation
          checked={confirmed}
          onChange={setConfirmed}
          disabled={submitting || !data.isReady}
        />

        {submitError && (
          <SubmitErrorState
            onRetry={() => {
              setSubmitError(false);
              setShowSubmitSheet(true);
            }}
            onReview={() => setSubmitError(false)}
          />
        )}

        <span className="sr-only">
          Bulk payment batch {data.isReady ? 'ready for submission' : 'requires attention'}.{' '}
          {data.validCount} payments. Total amount {data.totalAmount.toLocaleString('en-IN')} rupees.
          Total debit {data.totalDebit.toLocaleString('en-IN')} rupees. {data.approvalLabel}.
        </span>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
        <div className="max-w-[430px] mx-auto">
          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm disabled:opacity-50 min-h-11"
          >
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </div>

      <SubmitConfirmationSheet
        isOpen={showSubmitSheet}
        data={data}
        loading={submitting}
        onClose={() => !submitting && setShowSubmitSheet(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};
