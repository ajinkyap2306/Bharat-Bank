import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBanking } from '../../../../../context/BankingContext';
import { clonePreferences } from '../../../../../data/corporateAccountPreferencesMock';
import { PAYMENT_TYPE_ACCOUNTS } from '../../../../../data/corporatePaymentTypeSelectionMock';
import {
  buildBankTransferReview,
  createSimplePaymentSubmission,
  loadBankTransferDraft,
  saveBankTransferDraft,
  saveVendorPaymentSubmission,
  submitSimplePaymentForApproval,
} from '../../../../../data/corporateSimplePaymentMock';
import { getVendorBeneficiaryById } from '../../../../../data/corporateVendorPaymentDetailsMock';
import type { BankTransferDraft } from '../../../../../types/corporateSimplePayment';
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
import { VendorAccountSelectorSheet } from '../vendor/VendorAccountSelectorSheet';
import { isVendorPaymentAccountEligible } from '../../../../../data/corporateVendorPaymentDetailsMock';

const BASE_PATH = '/corporate/payments/create/bank-transfer';
const SUBMITTED_PATH = '/corporate/payments/create/vendor/submitted';

export const BankTransferReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, setBottomNavHidden, closeDetailFlow } = useBanking();

  const [draft, setDraft] = useState<BankTransferDraft | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');

  const review = useMemo(() => (draft ? buildBankTransferReview(draft) : null), [draft]);
  const beneficiary = draft ? getVendorBeneficiaryById(draft.beneficiaryId) : undefined;
  const hideBalance = clonePreferences(draft?.accountId ?? '')?.hideBalance ?? false;
  const showBalances = !hideBalance;
  const accounts = PAYMENT_TYPE_ACCOUNTS;

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
    const stateDraft = (location.state as { draft?: BankTransferDraft } | null)?.draft;
    const stored = loadBankTransferDraft();
    const initial = stateDraft ?? stored;

    if (!initial || initial.amount <= 0 || !initial.beneficiaryId) {
      navigate(BASE_PATH, { replace: true });
      return;
    }

    setDraft(initial);
    saveBankTransferDraft(initial);
  }, [location.state, navigate]);

  const handleBack = () => navigate(BASE_PATH);

  const handleAccountChange = (accountId: string) => {
    if (!draft) return;
    const updated = { ...draft, accountId };
    setDraft(updated);
    saveBankTransferDraft(updated);
    setShowAccountSheet(false);
    addToast({
      type: 'info',
      title: 'Account updated',
      message: 'Transfer amounts have been recalculated.',
    });
  };

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

  if (!review || !draft || !beneficiary) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <ReviewHeader onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-36">
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
          beneficiary={beneficiary}
          onEdit={handleBack}
          disabled={isSubmitting}
        />

        <SourceAccountReviewCard
          name={review.sourceAccount.name}
          maskedNumber={review.sourceAccount.maskedNumber}
          availableBalance={review.sourceAccount.availableBalance}
          currency={review.sourceAccount.currency}
          showBalances={showBalances}
          onChange={() => setShowAccountSheet(true)}
          disabled={isSubmitting}
        />

        <PaymentAmountSummary
          amount={review.amount}
          fee={review.fee}
          totalDebit={review.totalDebit}
        />

        <PayCard className="p-4">
          <ReviewRow label="Transfer Type" value="Bank Transfer" onEdit={handleBack} />
          <ReviewRow label="Payment Method" value={review.paymentMethod} />
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
