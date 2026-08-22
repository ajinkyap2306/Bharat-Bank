import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBanking } from '../../../../../../context/BankingContext';
import { clonePreferences } from '../../../../../../data/corporateAccountPreferencesMock';
import { PAYMENT_TYPE_ACCOUNTS } from '../../../../../../data/corporatePaymentTypeSelectionMock';
import {
  buildDefaultVendorPaymentForm,
  getCompatiblePaymentMethods,
  getRecommendedPaymentMethod,
  getTransactionFee,
  getVendorBeneficiaryById,
  getVendorPaymentAccount,
  getVendorPaymentLimits,
  isVendorPaymentAccountEligible,
} from '../../../../../../data/corporateVendorPaymentDetailsMock';
import type { VendorPaymentForm } from '../../../../../../types/corporateVendorPaymentDetails';
import {
  isFormValid,
  parseAmountInput,
  validatePaymentAmount,
} from '../../../../../../utils/vendorPaymentValidation';
import { PaymentHelpSheet } from '../../PaymentHelpSheet';
import { VendorAccountSelectorSheet } from '../VendorAccountSelectorSheet';
import { PaymentDetailsHeader } from './PaymentDetailsHeader';
import { PaymentProgress } from './PaymentProgress';
import { SelectedBeneficiaryCard } from './SelectedBeneficiaryCard';
import { PaymentAccountSelector } from './PaymentAccountSelector';
import { AmountInput } from './AmountInput';
import { PaymentPurposeSelector, PaymentPurposeSheet } from './PaymentPurposeSelector';
import { InvoiceInput } from './InvoiceInput';
import { PaymentReferenceInput } from './PaymentReferenceInput';
import { PaymentDateSelector } from './PaymentDateSelector';
import { SchedulePaymentToggle } from './SchedulePaymentToggle';
import { PaymentRemarks } from './PaymentRemarks';
import { PaymentChargesSelector } from './PaymentChargesSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { ProcessingEstimate } from './ProcessingEstimate';
import { PaymentFeeSummary } from './PaymentFeeSummary';
import { PaymentSummary } from './PaymentSummary';
import { DiscardPaymentSheet } from './DiscardPaymentSheet';
import { ReviewPaymentButton } from './ReviewPaymentButton';
import { RouteLoadingState } from '../../../../../common/RouteLoadingState';

const VENDOR_BASE_PATH = '/corporate/payments/create/vendor';
const REVIEW_PATH = '/corporate/payments/create/vendor/review';

export const VendorPaymentDetails: React.FC = () => {
  const { beneficiaryId } = useParams<{ beneficiaryId: string }>();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, closeDetailFlow } = useBanking();

  const beneficiary = beneficiaryId ? getVendorBeneficiaryById(beneficiaryId) : undefined;

  const [form, setForm] = useState<VendorPaymentForm>(() => {
    if (beneficiaryId) {
      try {
        const stored = sessionStorage.getItem('vendorPaymentDraft');
        if (stored) {
          const parsed = JSON.parse(stored) as VendorPaymentForm & { fee?: number };
          if (parsed.beneficiaryId === beneficiaryId) return parsed;
        }
      } catch {
        /* use default */
      }
      return buildDefaultVendorPaymentForm(beneficiaryId);
    }
    return buildDefaultVendorPaymentForm('');
  });
  const [amountInput, setAmountInput] = useState(() => {
    if (!beneficiaryId) return '';
    try {
      const stored = sessionStorage.getItem('vendorPaymentDraft');
      if (stored) {
        const parsed = JSON.parse(stored) as VendorPaymentForm;
        if (parsed.beneficiaryId === beneficiaryId && parsed.amount > 0) {
          return parsed.amount.toLocaleString('en-IN');
        }
      }
    } catch {
      /* empty */
    }
    return '';
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardSheet, setShowDiscardSheet] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showPurposeSheet, setShowPurposeSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [methodTouched, setMethodTouched] = useState(false);

  const accounts = PAYMENT_TYPE_ACCOUNTS;
  const selectedAccount = getVendorPaymentAccount(form.accountId) ?? accounts[0];
  const limits = useMemo(
    () => getVendorPaymentLimits(form.accountId),
    [form.accountId]
  );

  const hideBalance = clonePreferences(form.accountId)?.hideBalance ?? false;
  const showBalances = !hideBalance;

  const parsedAmount = parseAmountInput(amountInput);
  const amountValidation = validatePaymentAmount(parsedAmount, limits);
  const recommendedMethod = getRecommendedPaymentMethod(parsedAmount);
  const availableMethods = getCompatiblePaymentMethods(parsedAmount);
  const activeMethod = availableMethods.includes(form.paymentMethod)
    ? form.paymentMethod
    : recommendedMethod;
  const fee = getTransactionFee(activeMethod, parsedAmount);
  const totalDebit = parsedAmount + fee;

  const canContinue = isFormValid(parsedAmount, limits, form.purpose, form.paymentDate);

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    if (!beneficiaryId || !beneficiary) {
      navigate(VENDOR_BASE_PATH, { replace: true });
    }
  }, [beneficiaryId, beneficiary, navigate]);

  useEffect(() => {
    if (!isVendorPaymentAccountEligible(form.accountId)) {
      const eligible = accounts.find((a) => isVendorPaymentAccountEligible(a.id));
      if (eligible) {
        setForm((f) => ({ ...f, accountId: eligible.id }));
      }
    }
  }, [form.accountId, accounts]);

  useEffect(() => {
    if (!methodTouched && parsedAmount > 0) {
      setForm((f) => ({ ...f, paymentMethod: recommendedMethod }));
    }
  }, [parsedAmount, recommendedMethod, methodTouched]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const updateForm = useCallback(
    <K extends keyof VendorPaymentForm>(key: K, value: VendorPaymentForm[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
      markDirty();
    },
    [markDirty]
  );

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^\d.,]/g, '');
    setAmountInput(cleaned);
    updateForm('amount', parseAmountInput(cleaned));
  };

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardSheet(true);
      return;
    }
    navigate(VENDOR_BASE_PATH);
  };

  const handleReview = () => {
    if (!canContinue || !beneficiary) return;

    const payload = {
      ...form,
      amount: parsedAmount,
      paymentMethod: activeMethod,
      fee,
      totalDebit,
    };

    sessionStorage.setItem('vendorPaymentDraft', JSON.stringify(payload));
    navigate(REVIEW_PATH, { state: { form: payload, beneficiaryId } });
  };

  if (!beneficiary || !selectedAccount) {
    return (
      <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-32">
        <PaymentDetailsHeader onBack={handleBack} onHelp={() => setShowHelpSheet(true)} />
        <RouteLoadingState label="Loading payment details…" />
      </div>
    );
  }

  const accountLabel = `${selectedAccount.name} ${selectedAccount.maskedNumber}`;
  const displayDate = form.scheduled ? form.executionDate : form.paymentDate;

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-32">
      <PaymentDetailsHeader onBack={handleBack} onHelp={() => setShowHelpSheet(true)} />

      <div className="space-y-4 pt-4 pb-4 max-w-[430px] mx-auto">
        <PaymentProgress currentStep={2} />

        <SelectedBeneficiaryCard
          beneficiary={beneficiary}
          onChange={() => navigate(VENDOR_BASE_PATH)}
        />

        <PaymentAccountSelector
          account={selectedAccount}
          showBalances={showBalances}
          onOpen={() => setShowAccountSheet(true)}
        />

        <AmountInput
          value={amountInput}
          onChange={handleAmountChange}
          limits={limits}
          validationState={amountValidation}
          showBalances={showBalances}
        />

        <PaymentPurposeSelector
          value={form.purpose}
          onOpen={() => setShowPurposeSheet(true)}
        />

        <InvoiceInput
          value={form.invoiceNumber}
          onChange={(v) => updateForm('invoiceNumber', v)}
        />

        <PaymentReferenceInput
          value={form.reference}
          onChange={(v) => updateForm('reference', v)}
        />

        <PaymentDateSelector
          paymentDate={form.paymentDate}
          onPaymentDateChange={(v) => updateForm('paymentDate', v)}
          scheduled={form.scheduled}
        />

        <SchedulePaymentToggle
          scheduled={form.scheduled}
          executionDate={form.executionDate}
          repeatPayment={form.repeatPayment}
          onScheduledChange={(v) => updateForm('scheduled', v)}
          onExecutionDateChange={(v) => updateForm('executionDate', v)}
          onRepeatChange={(v) => updateForm('repeatPayment', v)}
        />

        {parsedAmount > 0 && (
          <>
            <PaymentMethodSelector
              value={activeMethod}
              recommended={recommendedMethod}
              availableMethods={availableMethods}
              onChange={(m) => {
                setMethodTouched(true);
                updateForm('paymentMethod', m);
              }}
            />

            <ProcessingEstimate method={activeMethod} />

            <PaymentChargesSelector
              value={form.charges}
              onChange={(v) => updateForm('charges', v)}
              visible={activeMethod !== 'IMPS'}
            />
          </>
        )}

        <PaymentRemarks
          value={form.remarks}
          onChange={(v) => updateForm('remarks', v)}
        />

        <PaymentFeeSummary
          amount={parsedAmount}
          fee={fee}
          totalDebit={totalDebit}
          currency={limits.currency}
        />

        <PaymentSummary
          beneficiaryName={beneficiary.name}
          accountLabel={accountLabel}
          amount={parsedAmount}
          fee={fee}
          totalDebit={totalDebit}
          paymentDate={displayDate}
          currency={limits.currency}
        />
      </div>

      <ReviewPaymentButton disabled={!canContinue} onClick={handleReview} />

      <VendorAccountSelectorSheet
        isOpen={showAccountSheet}
        accounts={accounts}
        selectedId={form.accountId}
        showBalances={showBalances}
        isVendorEligible={isVendorPaymentAccountEligible}
        onClose={() => setShowAccountSheet(false)}
        onSelect={(id) => updateForm('accountId', id)}
      />

      <PaymentPurposeSheet
        isOpen={showPurposeSheet}
        value={form.purpose}
        onClose={() => setShowPurposeSheet(false)}
        onSelect={(p) => updateForm('purpose', p)}
      />

      <DiscardPaymentSheet
        isOpen={showDiscardSheet}
        onKeepEditing={() => setShowDiscardSheet(false)}
        onDiscard={() => {
          setShowDiscardSheet(false);
          navigate(VENDOR_BASE_PATH);
        }}
      />

      <PaymentHelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
        onPaymentGuide={() =>
          addToast({
            type: 'info',
            title: 'Payment Guide',
            message: 'The corporate payment guide will be available soon.',
          })
        }
        onContactSupport={() =>
          addToast({
            type: 'info',
            title: 'Contact Support',
            message: 'Support will connect you with your relationship manager.',
          })
        }
      />
    </div>
  );
};
