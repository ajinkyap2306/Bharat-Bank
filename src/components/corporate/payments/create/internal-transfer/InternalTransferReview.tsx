import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBanking } from '../../../../../context/BankingContext';
import { clonePreferences } from '../../../../../data/corporateAccountPreferencesMock';
import {
  buildInternalTransferReview,
  createSimplePaymentSubmission,
  loadInternalTransferDraft,
  saveInternalTransferDraft,
  saveVendorPaymentSubmission,
  submitSimplePaymentForApproval,
} from '../../../../../data/corporateSimplePaymentMock';
import type { InternalTransferDraft } from '../../../../../types/corporateSimplePayment';
import type { SubmissionState } from '../../../../../types/corporateVendorPaymentReview';
import { ReviewHeader } from '../vendor/review/ReviewHeader';
import { ReviewStatus } from '../vendor/review/ReviewStatus';
import { BeneficiaryReviewCard } from '../vendor/review/BeneficiaryReviewCard';
import { SourceAccountReviewCard } from '../vendor/review/SourceAccountReviewCard';
import { PaymentAmountSummary } from '../vendor/review/PaymentAmountSummary';
import { BalanceCheckCard } from '../vendor/review/BalanceCheckCard';
import { PaymentLimitCheck } from '../vendor/review/PaymentLimitCheck';
import { ApprovalRequirementCard } from '../vendor/review/ApprovalRequirementCard';
import { ApprovalWorkflow } from '../vendor/review/ApprovalWorkflow';
import { ConfirmationCheckbox } from '../vendor/review/ConfirmationCheckbox';
import { SubmitPaymentButton } from '../vendor/review/SubmitPaymentButton';
import { PaymentSubmissionError } from '../vendor/review/PaymentSubmissionError';
import { SimplePaymentProgress } from '../shared/SimplePaymentProgress';
import { PayCard, ReviewRow } from '../../shared/CorporatePaymentsUI';

const BASE_PATH = '/corporate/payments/create/internal-transfer';
const SUBMITTED_PATH = '/corporate/payments/create/vendor/submitted';

export const InternalTransferReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setBottomNavHidden, closeDetailFlow } = useBanking();

  const [draft, setDraft] = useState<InternalTransferDraft | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');

  const review = useMemo(() => (draft ? buildInternalTransferReview(draft) : null), [draft]);
  const hideBalance = clonePreferences(draft?.fromAccountId ?? '')?.hideBalance ?? false;
  const showBalances = !hideBalance;

  const isSubmitting = submissionState === 'submitting';
  const hasSubmissionError = submissionState === 'error';
  const canSubmit =
    Boolean(review) &&
    review.sufficientBalance &&
    review.withinDailyLimit &&
    confirmed &&
    !isSubmitting &&
    !hasSubmissionError;

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    const stateDraft = (location.state as { draft?: InternalTransferDraft } | null)?.draft;
    const stored = loadInternalTransferDraft();
    const initial = stateDraft ?? stored;

    if (!initial || initial.amount <= 0 || initial.fromAccountId === initial.toAccountId) {
      navigate(BASE_PATH, { replace: true });
      return;
    }

    setDraft(initial);
    saveInternalTransferDraft(initial);
  }, [location.state, navigate]);

  const handleBack = () => navigate(BASE_PATH);

  const handleSubmit = useCallback(async () => {
    if (!draft || !canSubmit) return;
    setSubmissionState('submitting');
    try {
      await submitSimplePaymentForApproval();
      const submission = createSimplePaymentSubmission(draft);
      if (!submission) throw new Error('SUBMIT_FAILED');
      saveVendorPaymentSubmission(submission);
      sessionStorage.removeItem('vendorPaymentSubmissionToastShown');
      navigate(SUBMITTED_PATH, { replace: true });
    } catch {
      setSubmissionState('error');
    }
  }, [draft, canSubmit, navigate]);

  if (!review || !draft) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ReviewHeader onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-36">
      <ReviewHeader onBack={handleBack} />

      <motion.div
        className="space-y-4 pt-4 max-w-[430px] mx-auto"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <SimplePaymentProgress currentStep={2} />
        <ReviewStatus />

        <BeneficiaryReviewCard
          beneficiary={{
            id: review.destination.id,
            beneficiaryId: review.destination.id,
            name: review.destination.name,
            nickname: review.destination.name,
            accountNumber: '',
            maskedAccountNumber: review.destination.maskedAccount,
            bankName: review.destination.bankName,
            bankCode: 'BRB',
            type: 'vendor',
            typeLabel: 'Internal',
            status: 'verified',
            isFavorite: false,
          }}
          onEdit={handleBack}
          disabled={isSubmitting}
        />

        <SourceAccountReviewCard
          name={review.sourceAccount.name}
          maskedNumber={review.sourceAccount.maskedNumber}
          availableBalance={review.sourceAccount.availableBalance}
          currency={review.sourceAccount.currency}
          showBalances={showBalances}
          onChange={handleBack}
          disabled={isSubmitting}
        />

        <PaymentAmountSummary
          amount={review.amount}
          fee={review.fee}
          totalDebit={review.totalDebit}
        />

        <PayCard className="p-4">
          <ReviewRow label="Transfer Type" value="Internal Transfer" onEdit={handleBack} />
          <ReviewRow label="Reference" value={review.reference} />
          <ReviewRow label="Processing" value={review.processingEstimate} />
        </PayCard>

        <BalanceCheckCard
          balanceBefore={review.balanceBefore}
          totalDebit={review.totalDebit}
          balanceAfter={review.balanceAfter}
          sufficient={review.sufficientBalance}
          showBalances={showBalances}
        />

        <PaymentLimitCheck
          dailyLimit={review.dailyLimit}
          usedBefore={review.dailyUsedBefore}
          thisPayment={review.amount}
          usedAfter={review.dailyUsedAfter}
          remaining={review.dailyRemaining}
          withinLimit={review.withinDailyLimit}
        />

        <ApprovalRequirementCard
          approvalLabel={review.approvalLabel}
          description={review.approvalDescription}
          levels={review.approvalLevels}
        />

        <ApprovalWorkflow
          createdBy={review.createdBy}
          currentRole={review.currentRole}
          nextStep={review.nextStep}
          steps={[
            { id: 'maker', label: 'Payment Created', state: 'completed' },
            { id: 'checker', label: 'Finance Checker', state: 'current' },
          ]}
        />

        {hasSubmissionError && (
          <PaymentSubmissionError
            onRetry={() => {
              setSubmissionState('idle');
              handleSubmit();
            }}
            onReview={() => setSubmissionState('idle')}
          />
        )}

        <ConfirmationCheckbox
          checked={confirmed}
          onChange={setConfirmed}
          disabled={isSubmitting}
        />
      </motion.div>

      <SubmitPaymentButton
        label="Submit for Approval"
        disabled={!canSubmit}
        loading={isSubmitting}
        onClick={handleSubmit}
      />
    </div>
  );
};
