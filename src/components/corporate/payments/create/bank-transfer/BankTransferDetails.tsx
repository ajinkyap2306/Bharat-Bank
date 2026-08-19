import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBanking } from '../../../../../context/BankingContext';
import { clonePreferences } from '../../../../../data/corporateAccountPreferencesMock';
import { PAYMENT_TYPE_ACCOUNTS } from '../../../../../data/corporatePaymentTypeSelectionMock';
import {
  buildDefaultBankTransferDraft,
  loadBankTransferDraft,
  saveBankTransferDraft,
} from '../../../../../data/corporateSimplePaymentMock';
import { VENDOR_PAYMENT_BENEFICIARIES } from '../../../../../data/corporateVendorBeneficiarySelectionMock';
import {
  getCompatiblePaymentMethods,
  getRecommendedPaymentMethod,
  getTransactionFee,
  getVendorPaymentLimits,
} from '../../../../../data/corporateVendorPaymentDetailsMock';
import type { BankTransferDraft } from '../../../../../types/corporateSimplePayment';
import type { PaymentRailMethod } from '../../../../../types/corporateVendorPaymentDetails';
import {
  parseAmountInput,
  validatePaymentAmount,
} from '../../../../../utils/vendorPaymentValidation';
import { formatPaymentCurrency, StickyPayCTA } from '../../shared/CorporatePaymentsUI';
import { VendorAccountSelectorSheet } from '../vendor/VendorAccountSelectorSheet';
import { PaymentAccountSelector } from '../vendor/details/PaymentAccountSelector';
import { AmountInput } from '../vendor/details/AmountInput';
import { PaymentMethodSelector } from '../vendor/details/PaymentMethodSelector';
import { PaymentHelpSheet } from '../PaymentHelpSheet';
import { CreatePaymentHeader } from '../shared/CreatePaymentHeader';
import { SimplePaymentProgress } from '../shared/SimplePaymentProgress';
import { BankBeneficiaryPickerSheet } from './BankBeneficiaryPickerSheet';
import { getBeneficiaryInitials } from '../../../../../data/corporateVendorBeneficiarySelectionMock';
import { BeneficiaryStatusBadge } from '../vendor/BeneficiaryStatusBadge';

const REVIEW_PATH = '/corporate/payments/create/bank-transfer/review';

export const BankTransferDetails: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, closeDetailFlow } = useBanking();

  const [draft, setDraft] = useState<BankTransferDraft>(() => {
    const stored = loadBankTransferDraft();
    return stored ?? buildDefaultBankTransferDraft();
  });
  const [amountInput, setAmountInput] = useState(() => {
    const stored = loadBankTransferDraft();
    return stored && stored.amount > 0 ? stored.amount.toLocaleString('en-IN') : '';
  });
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showBeneficiarySheet, setShowBeneficiarySheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const accounts = PAYMENT_TYPE_ACCOUNTS;
  const selectedAccount = accounts.find((a) => a.id === draft.accountId) ?? accounts[0];
  const beneficiary =
    VENDOR_PAYMENT_BENEFICIARIES.find((b) => b.id === draft.beneficiaryId) ??
    VENDOR_PAYMENT_BENEFICIARIES[0];

  const hideBalance = clonePreferences(draft.accountId)?.hideBalance ?? false;
  const showBalances = !hideBalance;
  const limits = useMemo(() => getVendorPaymentLimits(draft.accountId), [draft.accountId]);
  const parsedAmount = parseAmountInput(amountInput);
  const amountValidation = validatePaymentAmount(parsedAmount, limits);
  const recommendedMethod = getRecommendedPaymentMethod(parsedAmount);
  const availableMethods = getCompatiblePaymentMethods(parsedAmount);
  const activeMethod = availableMethods.includes(draft.paymentMethod)
    ? draft.paymentMethod
    : recommendedMethod;
  const fee = getTransactionFee(activeMethod, parsedAmount);
  const canContinue = parsedAmount > 0 && amountValidation === 'valid';

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  useEffect(() => {
    if (!availableMethods.includes(draft.paymentMethod) && activeMethod !== draft.paymentMethod) {
      setDraft((prev) => ({ ...prev, paymentMethod: activeMethod }));
    }
  }, [activeMethod, availableMethods, draft.paymentMethod]);

  const handleBack = () => navigate('/corporate/payments/create');

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    const updated: BankTransferDraft = {
      ...draft,
      amount: parsedAmount,
      paymentMethod: activeMethod,
    };
    saveBankTransferDraft(updated);
    navigate(REVIEW_PATH, { state: { draft: updated } });
  }, [canContinue, draft, parsedAmount, activeMethod, navigate]);

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-36">
      <CreatePaymentHeader
        title="Transfer Details"
        subtitle="Bank Transfer"
        onBack={handleBack}
        onHelp={() => setShowHelpSheet(true)}
      />

      <div className="space-y-4 pt-4 max-w-[430px] mx-auto">
        <SimplePaymentProgress currentStep={1} />

        <PaymentAccountSelector
          account={selectedAccount}
          showBalances={showBalances}
          onOpen={() => setShowAccountSheet(true)}
        />

        <section className="px-4" aria-label="Transfer to beneficiary">
          <button
            type="button"
            onClick={() => setShowBeneficiarySheet(true)}
            className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 text-left shadow-sm active:bg-slate-50 dark:active:bg-slate-800/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center text-[#0B5CAB] text-[13px] font-bold shrink-0"
                  aria-hidden
                >
                  {getBeneficiaryInitials(beneficiary.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#667085] uppercase tracking-wide">
                    Transfer To
                  </p>
                  <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-1">
                    {beneficiary.name}
                  </p>
                  <p className="text-[13px] text-[#667085] tabular-nums">{beneficiary.maskedAccountNumber}</p>
                  <p className="text-[13px] text-[#667085]">{beneficiary.bankName}</p>
                  <div className="mt-2">
                    <BeneficiaryStatusBadge status={beneficiary.status} compact />
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#667085] shrink-0 mt-1" aria-hidden />
            </div>
          </button>
        </section>

        <AmountInput
          value={amountInput}
          onChange={setAmountInput}
          limits={limits}
          validationState={amountValidation}
          showBalances={showBalances}
        />

        <PaymentMethodSelector
          value={activeMethod}
          recommended={recommendedMethod}
          availableMethods={availableMethods}
          onChange={(method: PaymentRailMethod) =>
            setDraft((prev) => ({ ...prev, paymentMethod: method }))
          }
        />

        <section className="px-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
            <label htmlFor="bank-ref" className="text-[14px] font-semibold text-[#111827] dark:text-white">
              Reference (optional)
            </label>
            <input
              id="bank-ref"
              type="text"
              value={draft.reference}
              onChange={(e) => setDraft((prev) => ({ ...prev, reference: e.target.value }))}
              placeholder="e.g. Invoice settlement"
              className="mt-2 w-full text-[15px] text-[#111827] dark:text-white bg-transparent outline-none min-h-11"
            />
          </div>
        </section>

        {parsedAmount > 0 && (
          <section className="px-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4 shadow-sm">
              <div className="flex justify-between text-[13px] text-[#667085]">
                <span>Transfer fee ({activeMethod})</span>
                <span className="font-medium text-[#111827] dark:text-white tabular-nums">
                  {formatPaymentCurrency(fee)}
                </span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-[#111827] dark:text-white mt-2">
                <span>Total debit</span>
                <span className="tabular-nums">{formatPaymentCurrency(parsedAmount + fee)}</span>
              </div>
            </div>
          </section>
        )}
      </div>

      <StickyPayCTA
        label="Review Transfer"
        onClick={handleContinue}
        disabled={!canContinue}
        secondaryLabel="Cancel"
        onSecondary={handleBack}
      />

      <VendorAccountSelectorSheet
        isOpen={showAccountSheet}
        accounts={accounts}
        selectedId={draft.accountId}
        showBalances={showBalances}
        isVendorEligible={() => true}
        onClose={() => setShowAccountSheet(false)}
        onSelect={(accountId) => {
          setDraft((prev) => ({ ...prev, accountId }));
          setShowAccountSheet(false);
        }}
      />

      <BankBeneficiaryPickerSheet
        isOpen={showBeneficiarySheet}
        beneficiaries={VENDOR_PAYMENT_BENEFICIARIES}
        selectedId={draft.beneficiaryId}
        onClose={() => setShowBeneficiarySheet(false)}
        onSelect={(beneficiaryId) => {
          setDraft((prev) => ({ ...prev, beneficiaryId }));
          setShowBeneficiarySheet(false);
        }}
      />

      <PaymentHelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
        onPaymentGuide={() =>
          addToast({
            type: 'info',
            title: 'Bank Transfers',
            message: 'Send funds to external bank accounts via NEFT, RTGS, or IMPS.',
          })
        }
        onContactSupport={() =>
          addToast({
            type: 'info',
            title: 'Contact Support',
            message: 'Your relationship manager can assist with transfer limits.',
          })
        }
      />
    </div>
  );
};
