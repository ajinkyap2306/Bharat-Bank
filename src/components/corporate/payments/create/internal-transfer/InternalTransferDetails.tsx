import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBanking } from '../../../../../context/BankingContext';
import { clonePreferences } from '../../../../../data/corporateAccountPreferencesMock';
import { PAYMENT_TYPE_ACCOUNTS } from '../../../../../data/corporatePaymentTypeSelectionMock';
import {
  buildDefaultInternalTransferDraft,
  loadInternalTransferDraft,
  saveInternalTransferDraft,
} from '../../../../../data/corporateSimplePaymentMock';
import { getVendorPaymentLimits } from '../../../../../data/corporateVendorPaymentDetailsMock';
import type { InternalTransferDraft } from '../../../../../types/corporateSimplePayment';
import {
  parseAmountInput,
  validatePaymentAmount,
} from '../../../../../utils/vendorPaymentValidation';
import { formatAccountCurrency } from '../../../accounts/shared/CorporateAccountsUI';
import { StickyPayCTA } from '../../shared/CorporatePaymentsUI';
import { VendorAccountSelectorSheet } from '../vendor/VendorAccountSelectorSheet';
import { PaymentAccountSelector } from '../vendor/details/PaymentAccountSelector';
import { AmountInput } from '../vendor/details/AmountInput';
import { PaymentHelpSheet } from '../PaymentHelpSheet';
import { CreatePaymentHeader } from '../shared/CreatePaymentHeader';
import { SimplePaymentProgress } from '../shared/SimplePaymentProgress';

const BASE_PATH = '/corporate/payments/create/internal-transfer';
const REVIEW_PATH = '/corporate/payments/create/internal-transfer/review';

export const InternalTransferDetails: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, closeDetailFlow } = useBanking();

  const [draft, setDraft] = useState<InternalTransferDraft>(() => {
    const stored = loadInternalTransferDraft();
    return stored ?? buildDefaultInternalTransferDraft();
  });
  const [amountInput, setAmountInput] = useState(() => {
    const stored = loadInternalTransferDraft();
    return stored && stored.amount > 0 ? stored.amount.toLocaleString('en-IN') : '';
  });
  const [showFromSheet, setShowFromSheet] = useState(false);
  const [showToSheet, setShowToSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const accounts = PAYMENT_TYPE_ACCOUNTS;
  const fromAccount = accounts.find((a) => a.id === draft.fromAccountId) ?? accounts[0];
  const toAccount = accounts.find((a) => a.id === draft.toAccountId) ?? accounts[1];
  const destinationAccounts = accounts.filter((a) => a.id !== draft.fromAccountId);

  const hideBalance = clonePreferences(draft.fromAccountId)?.hideBalance ?? false;
  const showBalances = !hideBalance;
  const limits = useMemo(() => getVendorPaymentLimits(draft.fromAccountId), [draft.fromAccountId]);
  const parsedAmount = parseAmountInput(amountInput);
  const amountValidation = validatePaymentAmount(parsedAmount, limits);
  const canContinue =
    parsedAmount > 0 &&
    amountValidation === 'valid' &&
    draft.fromAccountId !== draft.toAccountId;

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  const handleBack = () => navigate('/corporate/payments/create');

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    const updated: InternalTransferDraft = { ...draft, amount: parsedAmount };
    saveInternalTransferDraft(updated);
    navigate(REVIEW_PATH, { state: { draft: updated } });
  }, [canContinue, draft, parsedAmount, navigate]);

  const handleFromChange = (accountId: string) => {
    setDraft((prev) => {
      const nextTo =
        accountId === prev.toAccountId
          ? destinationAccounts.find((a) => a.id !== accountId)?.id ?? prev.toAccountId
          : prev.toAccountId;
      return { ...prev, fromAccountId: accountId, toAccountId: nextTo };
    });
    setShowFromSheet(false);
  };

  const handleToChange = (accountId: string) => {
    setDraft((prev) => ({ ...prev, toAccountId: accountId }));
    setShowToSheet(false);
  };

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-36">
      <CreatePaymentHeader
        title="Transfer Details"
        subtitle="Internal Transfer"
        onBack={handleBack}
        onHelp={() => setShowHelpSheet(true)}
      />

      <div className="space-y-4 pt-4 max-w-[430px] mx-auto">
        <SimplePaymentProgress currentStep={1} />

        <PaymentAccountSelector
          account={fromAccount}
          showBalances={showBalances}
          onOpen={() => setShowFromSheet(true)}
        />

        <section className="px-4" aria-label="Transfer to account">
          <button
            type="button"
            onClick={() => setShowToSheet(true)}
            className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left shadow-sm min-h-[76px] active:bg-slate-50 dark:active:bg-slate-800/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Transfer To
                </p>
                <p className="text-[15px] font-semibold text-slate-900 dark:text-white mt-1">
                  {toAccount.name}
                </p>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 tabular-nums">{toAccount.maskedNumber}</p>
                <div className="mt-2">
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">Available Balance</p>
                  <p className="text-[16px] font-bold text-slate-900 dark:text-white tabular-nums">
                    {showBalances
                      ? formatAccountCurrency(toAccount.availableBalance, toAccount.currency)
                      : '••••••'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
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

        <section className="px-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <label htmlFor="internal-ref" className="text-[14px] font-semibold text-slate-900 dark:text-white">
              Reference (optional)
            </label>
            <input
              id="internal-ref"
              type="text"
              value={draft.reference}
              onChange={(e) => setDraft((prev) => ({ ...prev, reference: e.target.value }))}
              placeholder="e.g. Payroll funding"
              className="mt-2 w-full text-[15px] text-slate-900 dark:text-white bg-transparent outline-none min-h-11"
            />
          </div>
        </section>

        <section className="px-4">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4">
            <p className="text-[13px] font-semibold text-emerald-800 dark:text-emerald-300">
              No transfer fee
            </p>
            <p className="text-[12px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
              Internal transfers between your company accounts are processed instantly with zero charges.
            </p>
          </div>
        </section>
      </div>

      <StickyPayCTA
        label="Review Transfer"
        onClick={handleContinue}
        disabled={!canContinue}
        secondaryLabel="Cancel"
        onSecondary={handleBack}
      />

      <VendorAccountSelectorSheet
        isOpen={showFromSheet}
        accounts={accounts}
        selectedId={draft.fromAccountId}
        showBalances={showBalances}
        isVendorEligible={() => true}
        onClose={() => setShowFromSheet(false)}
        onSelect={handleFromChange}
      />

      <VendorAccountSelectorSheet
        isOpen={showToSheet}
        accounts={destinationAccounts}
        selectedId={draft.toAccountId}
        showBalances={showBalances}
        isVendorEligible={() => true}
        onClose={() => setShowToSheet(false)}
        onSelect={handleToChange}
      />

      <PaymentHelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
        onPaymentGuide={() =>
          addToast({
            type: 'info',
            title: 'Internal Transfers',
            message: 'Move funds instantly between your corporate accounts.',
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
