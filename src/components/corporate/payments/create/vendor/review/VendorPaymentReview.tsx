import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBanking } from '../../../../../../context/BankingContext';
import { clonePreferences } from '../../../../../../data/corporateAccountPreferencesMock';
import { PAYMENT_TYPE_ACCOUNTS } from '../../../../../../data/corporatePaymentTypeSelectionMock';
import {
  buildVendorPaymentReview,
  loadVendorPaymentDraft,
  recalculateReviewFromDraft,
  saveVendorPaymentDraft,
  submitVendorPaymentForApproval,
} from '../../../../../../data/corporateVendorPaymentReviewMock';
import {
  createVendorPaymentSubmission,
  saveVendorPaymentSubmission,
} from '../../../../../../data/corporateVendorPaymentSubmissionMock';
import { isVendorPaymentAccountEligible } from '../../../../../../data/corporateVendorPaymentDetailsMock';
import type { VendorPaymentDraft } from '../../../../../../types/corporateVendorPaymentReview';
import type { SubmissionState } from '../../../../../../types/corporateVendorPaymentReview';
import { PaymentProgress } from '../details/PaymentProgress';
import { VendorAccountSelectorSheet } from '../VendorAccountSelectorSheet';
import { ReviewHeader } from './ReviewHeader';
import { ReviewStatus } from './ReviewStatus';
import { BeneficiaryReviewCard } from './BeneficiaryReviewCard';
import { SourceAccountReviewCard } from './SourceAccountReviewCard';
import { PaymentAmountSummary } from './PaymentAmountSummary';
import { PaymentDetailsSummary } from './PaymentDetailsSummary';
import { BalanceCheckCard } from './BalanceCheckCard';
import { PaymentLimitCheck } from './PaymentLimitCheck';
import { ApprovalRequirementCard } from './ApprovalRequirementCard';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { ConfirmationCheckbox } from './ConfirmationCheckbox';
import { DuplicatePaymentWarning } from './DuplicatePaymentWarning';
import { HighValuePaymentWarning } from './HighValuePaymentWarning';
import { SubmitPaymentButton } from './SubmitPaymentButton';
import { PaymentSubmissionError } from './PaymentSubmissionError';
import { PaymentReviewSkeleton } from './PaymentReviewSkeleton';
import { useCorporateMakerGate } from '../../../../../../hooks/useCorporateMakerGate';

const VENDOR_BASE_PATH = '/corporate/payments/create/vendor';
const SUBMITTED_PATH = '/corporate/payments/create/vendor/submitted';

export const VendorPaymentReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, setBottomNavHidden, closeDetailFlow, canSubmitCorporatePayment } = useBanking();
  const { blockIfChecker } = useCorporateMakerGate();

  const [draft, setDraft] = useState<VendorPaymentDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [duplicateDismissed, setDuplicateDismissed] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');

  const review = useMemo(
    () => (draft ? buildVendorPaymentReview(draft) : null),
    [draft]
  );

  const hideBalance = clonePreferences(draft?.accountId ?? '')?.hideBalance ?? false;
  const showBalances = !hideBalance;
  const accounts = PAYMENT_TYPE_ACCOUNTS;

  const isSubmitting = submissionState === 'submitting';
  const hasSubmissionError = submissionState === 'error';
  const controlsDisabled = isSubmitting;

  const canSubmit =
    Boolean(review) &&
    review.sufficientBalance &&
    review.withinDailyLimit &&
    confirmed &&
    !isSubmitting &&
    !hasSubmissionError &&
    canSubmitCorporatePayment &&
    (duplicateDismissed || !review.duplicateWarning);

  const submitLabel = review?.selfAuthorizeAllowed ? 'Submit Payment' : 'Submit for Approval';

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    const stateDraft = (location.state as { form?: VendorPaymentDraft } | null)?.form;
    const stored = loadVendorPaymentDraft();
    const initial = stateDraft ?? stored;

    if (!initial || !initial.beneficiaryId || initial.amount <= 0) {
      navigate(VENDOR_BASE_PATH, { replace: true });
      return;
    }

    setDraft(initial);
    saveVendorPaymentDraft(initial);
    setLoading(false);
  }, [location.state, navigate]);

  const handleBack = () => {
    if (!draft) return;
    navigate(`${VENDOR_BASE_PATH}/${draft.beneficiaryId}`);
  };

  const handleAccountChange = (accountId: string) => {
    if (!draft) return;
    const updated = recalculateReviewFromDraft(draft, accountId);
    setDraft(updated);
    saveVendorPaymentDraft(updated);
    setShowAccountSheet(false);
    addToast({
      type: 'info',
      title: 'Account updated',
      message: 'Payment amounts have been recalculated.',
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!draft || !canSubmit) return;
    if (blockIfChecker('submit payments')) return;

    setSubmissionState('submitting');
    try {
      await submitVendorPaymentForApproval(draft, false, canSubmitCorporatePayment);
      const submission = createVendorPaymentSubmission(draft, 'submitted', canSubmitCorporatePayment);
      if (!submission) {
        throw new Error('SUBMIT_FAILED');
      }
      saveVendorPaymentSubmission(submission);
      sessionStorage.removeItem('vendorPaymentSubmissionToastShown');
      navigate(SUBMITTED_PATH, { replace: true });
    } catch {
      setSubmissionState('error');
    }
  }, [draft, canSubmit, navigate, addToast, blockIfChecker, canSubmitCorporatePayment]);

  if (loading || !review || !draft) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <ReviewHeader onBack={() => navigate(VENDOR_BASE_PATH)} />
        <PaymentReviewSkeleton />
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
        <PaymentProgress currentStep={3} />
        <ReviewStatus />

        <BeneficiaryReviewCard
          beneficiary={review.beneficiary}
          onEdit={() => navigate(VENDOR_BASE_PATH)}
          disabled={controlsDisabled}
        />

        <SourceAccountReviewCard
          name={review.sourceAccount.name}
          maskedNumber={review.sourceAccount.maskedNumber}
          availableBalance={review.sourceAccount.availableBalance}
          currency={review.sourceAccount.currency}
          showBalances={showBalances}
          onChange={() => setShowAccountSheet(true)}
          disabled={controlsDisabled}
        />

        <PaymentAmountSummary
          amount={review.amount}
          fee={review.fee}
          totalDebit={review.totalDebit}
        />

        <PaymentDetailsSummary
          purposeLabel={review.purposeLabel}
          invoiceNumber={review.invoiceNumber}
          reference={review.reference}
          paymentMethod={review.paymentMethod}
          paymentDate={review.paymentDate}
          scheduled={review.scheduled}
          scheduleLabel={review.scheduleLabel}
          processingEstimate={review.processingEstimate}
          onEdit={handleBack}
          disabled={controlsDisabled}
        />

        <HighValuePaymentWarning visible={review.highValueWarning} />

        {review.duplicateWarning && (
          <DuplicatePaymentWarning
            dismissed={duplicateDismissed}
            onDismissContinue={() => setDuplicateDismissed(true)}
            onReviewPrevious={() =>
              addToast({
                type: 'info',
                title: 'Previous Payment',
                message: 'Previous payment details will open in a future update.',
              })
            }
            onContinue={() => setDuplicateDismissed(true)}
          />
        )}

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
          steps={review.workflowSteps}
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
          disabled={controlsDisabled}
        />
      </motion.div>

      <SubmitPaymentButton
        label={submitLabel}
        disabled={!canSubmit}
        loading={isSubmitting}
        onClick={handleSubmit}
      />

      <VendorAccountSelectorSheet
        isOpen={showAccountSheet}
        accounts={accounts}
        selectedId={draft.accountId}
        showBalances={showBalances}
        isVendorEligible={isVendorPaymentAccountEligible}
        onClose={() => setShowAccountSheet(false)}
        onSelect={handleAccountChange}
      />
    </div>
  );
};
