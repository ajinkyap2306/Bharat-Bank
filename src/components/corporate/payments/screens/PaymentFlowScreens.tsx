import React, { useState } from 'react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CORPORATE_ACCOUNTS_LIST } from '../../../../data/corporateAccountsMock';
import {
  PAYMENT_TYPE_OPTIONS,
  CORPORATE_PAYMENT_LIMITS,
  CORPORATE_PAYMENT_CHARGES,
  calcTotalDebit,
  getPaymentRole,
} from '../../../../data/corporatePaymentsMock';
import { useBanking } from '../../../../context/BankingContext';
import {
  CorporatePaymentForm,
  CorporatePaymentType,
} from '../../../../types/corporatePayments';
import {
  PayCard,
  ReviewRow,
  StickyPayCTA,
  formatPaymentCurrency,
} from '../shared/CorporatePaymentsUI';

interface FlowProps {
  form: CorporatePaymentForm;
  setForm: React.Dispatch<React.SetStateAction<CorporatePaymentForm>>;
  onBack: () => void;
  onNext: (screen: string) => void;
}

export const PaymentTypeScreen: React.FC<FlowProps> = ({
  form,
  setForm,
  onBack,
  onNext,
}) => {
  const { user, setCorporateTab } = useBanking();
  const role = getPaymentRole(user.role);

  const options = PAYMENT_TYPE_OPTIONS.filter((o) => o.roles.includes(role === 'admin' ? 'admin' : role));

  const select = (type: CorporatePaymentType) => {
    setForm((f) => ({ ...f, paymentType: type }));
    if (type === 'payroll') {
      setCorporateTab('payroll');
      return;
    }
    if (type === 'internal') onNext('debit-account');
    else if (type === 'scheduled') onNext('schedule');
    else onNext('beneficiary-select');
  };

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Payment Type" onBack={onBack} edgeToEdge={false} />
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => select(opt.id)}
            className="mx-3 w-[calc(100%-1.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left min-h-11"
          >
            <p className="text-sm font-bold text-[#111827] dark:text-white">{opt.label}</p>
            <p className="text-xs text-[#667085] mt-0.5">{opt.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export const DebitAccountScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => {
  const { primaryCorporateAccountId } = useBanking();
  const accounts = CORPORATE_ACCOUNTS_LIST.filter((a) => a.currencyCode === 'INR' && a.displayStatus === 'Active');

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Pay From" onBack={onBack} edgeToEdge={false} />
      <div className="space-y-2">
        {accounts.map((acc) => (
          <button
            key={acc.id}
            type="button"
            onClick={() => setForm((f) => ({ ...f, fromAccountId: acc.id }))}
            className={`mx-3 w-[calc(100%-1.5rem)] p-4 rounded-2xl border text-left ${
              form.fromAccountId === acc.id
                ? 'bg-[#0B5CAB]/5 border-[#0B5CAB]/40 ring-2 ring-[#0B5CAB]/20'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-[#111827] dark:text-white">{acc.nickname}</p>
                <p className="text-xs font-mono text-[#667085]">{acc.maskedNumber}</p>
                <p className="text-sm font-mono font-bold mt-1">{formatPaymentCurrency(acc.availableBalance, acc.currency)}</p>
                <p className="text-[10px] text-[#667085]">Available</p>
              </div>
              {acc.id === primaryCorporateAccountId && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#0B5CAB]/10 text-[#0B5CAB]">Primary</span>
              )}
            </div>
          </button>
        ))}
      </div>
      <StickyPayCTA label="Continue" onClick={() => onNext(form.paymentType === 'internal' ? 'to-account' : 'amount')} />
    </div>
  );
};

export const ToAccountScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => {
  const accounts = CORPORATE_ACCOUNTS_LIST.filter(
    (a) => a.id !== form.fromAccountId && a.currencyCode === 'INR' && a.displayStatus === 'Active'
  );

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Transfer To" onBack={onBack} edgeToEdge={false} />
      <div className="space-y-2">
        {accounts.map((acc) => (
          <button
            key={acc.id}
            type="button"
            onClick={() => setForm((f) => ({ ...f, toAccountId: acc.id }))}
            className={`mx-3 w-[calc(100%-1.5rem)] p-4 rounded-2xl border text-left ${
              form.toAccountId === acc.id
                ? 'bg-[#0B5CAB]/5 border-[#0B5CAB]/40'
                : 'bg-white dark:bg-slate-900 border-slate-200/80'
            }`}
          >
            <p className="text-sm font-bold">{acc.nickname}</p>
            <p className="text-xs font-mono text-[#667085]">{acc.maskedNumber}</p>
          </button>
        ))}
      </div>
      <StickyPayCTA label="Continue" onClick={() => onNext('amount')} disabled={!form.toAccountId} />
    </div>
  );
};

export const AmountScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => {
  const fromAcc = CORPORATE_ACCOUNTS_LIST.find((a) => a.id === form.fromAccountId);
  const numericAmount = Number(form.amount) || 0;
  const remaining = CORPORATE_PAYMENT_LIMITS.dailyLimit - CORPORATE_PAYMENT_LIMITS.usedToday;
  const insufficient = numericAmount > (fromAcc?.availableBalance || 0);
  const exceedsLimit = numericAmount > remaining;

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Payment Amount" onBack={onBack} edgeToEdge={false} />
      <PayCard className="p-4 mx-3">
        <p className="text-[10px] text-[#667085] uppercase font-bold mb-2">Payment Amount</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#667085]">₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="0.00"
            className="text-3xl font-bold font-mono bg-transparent outline-none w-full text-[#111827] dark:text-white"
          />
        </div>
        <p className="text-xs text-[#667085] mt-3">
          Available Balance: {formatPaymentCurrency(fromAcc?.availableBalance || 0)}
        </p>
        {insufficient && <p className="text-xs text-[#DC2626] font-bold mt-2">Insufficient available balance</p>}
        {exceedsLimit && numericAmount > 0 && (
          <p className="text-xs text-[#DC2626] font-bold mt-2">Payment exceeds your permitted limit.</p>
        )}
      </PayCard>
      <StickyPayCTA
        label="Continue"
        onClick={() => onNext(form.paymentType === 'internal' ? 'review' : 'details')}
        disabled={!numericAmount || numericAmount <= 0 || insufficient || exceedsLimit}
      />
    </div>
  );
};

export const DetailsScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Payment Details" onBack={onBack} edgeToEdge={false} />
      <PayCard className="p-4 space-y-3">
        <div>
          <label className="text-xs font-bold text-[#667085]">Payment Purpose</label>
          <input
            value={form.purpose}
            onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
            placeholder="Vendor Invoice"
            className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#667085]">Invoice Number</label>
          <input
            value={form.invoiceNumber}
            onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
            placeholder="INV-2026-4582"
            className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#667085]">Remarks</label>
          <input
            value={form.remarks}
            onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
            placeholder="August office supplies"
            className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
          />
        </div>
        <button type="button" onClick={() => setShowMore(!showMore)} className="text-xs font-bold text-[#0B5CAB]">
          {showMore ? 'Hide' : 'Add More Details'}
        </button>
        {showMore && (
          <div>
            <label className="text-xs font-bold text-[#667085]">Reference</label>
            <input
              value={form.reference}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
        )}
      </PayCard>
      <StickyPayCTA label="Continue" onClick={() => onNext('schedule')} disabled={!form.purpose.trim()} />
    </div>
  );
};

export const ScheduleScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => {
  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Schedule Payment" onBack={onBack} edgeToEdge={false} />
      <PayCard className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {(['now', 'scheduled'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, scheduleType: t }))}
              className={`py-3 rounded-xl text-sm font-bold ${
                form.scheduleType === t ? 'bg-[#0B5CAB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-[#667085]'
              }`}
            >
              {t === 'now' ? 'Pay Now' : 'Schedule Payment'}
            </button>
          ))}
        </div>
        {form.scheduleType === 'scheduled' && (
          <>
            <div>
              <label className="text-xs font-bold text-[#667085]">Payment Date</label>
              <input
                type="date"
                value={form.scheduleDate}
                onChange={(e) => setForm((f) => ({ ...f, scheduleDate: e.target.value }))}
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#667085]">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as CorporatePaymentForm['frequency'] }))}
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </>
        )}
      </PayCard>
      <StickyPayCTA label="Review Payment" onClick={() => onNext('review')} />
    </div>
  );
};

export const ReviewScreen: React.FC<FlowProps & {
  beneficiaryName: string;
  onSubmit: () => void;
  onSaveDraft: () => void;
}> = ({ form, onBack, onNext, beneficiaryName, onSubmit, onSaveDraft }) => {
  const fromAcc = CORPORATE_ACCOUNTS_LIST.find((a) => a.id === form.fromAccountId);
  const toAcc = CORPORATE_ACCOUNTS_LIST.find((a) => a.id === form.toAccountId);
  const amount = Number(form.amount) || 0;
  const charges = form.paymentType === 'internal' ? 0 : CORPORATE_PAYMENT_CHARGES.bankCharges + CORPORATE_PAYMENT_CHARGES.tax;
  const total = amount + charges;
  const typeLabel = PAYMENT_TYPE_OPTIONS.find((o) => o.id === form.paymentType)?.label || 'Payment';

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-28">
      <ScreenHeader title="Review Payment" onBack={onBack} edgeToEdge={false} />
      <PayCard className="p-4">
        <ReviewRow label="Payment Type" value={typeLabel} onEdit={() => onNext('payment-type')} />
        <ReviewRow
          label="Beneficiary"
          value={form.paymentType === 'internal' ? toAcc?.nickname || '' : beneficiaryName}
          onEdit={() => onNext(form.paymentType === 'internal' ? 'to-account' : 'beneficiary-select')}
        />
        <ReviewRow label="Debit Account" value={`${fromAcc?.nickname} ••••${fromAcc?.maskedNumber.slice(-4)}`} onEdit={() => onNext('debit-account')} />
        <ReviewRow label="Amount" value={formatPaymentCurrency(amount)} onEdit={() => onNext('amount')} />
        {charges > 0 && (
          <>
            <ReviewRow label="Bank Charges" value={formatPaymentCurrency(CORPORATE_PAYMENT_CHARGES.bankCharges)} />
            <ReviewRow label="Tax" value={formatPaymentCurrency(CORPORATE_PAYMENT_CHARGES.tax)} />
            <ReviewRow label="Total Debit" value={formatPaymentCurrency(total)} />
          </>
        )}
        <ReviewRow
          label="Payment Date"
          value={form.scheduleType === 'scheduled' ? form.scheduleDate : '18 Aug 2026'}
          onEdit={() => onNext('schedule')}
        />
        {form.purpose && <ReviewRow label="Purpose" value={form.purpose} onEdit={() => onNext('details')} />}
        {form.invoiceNumber && <ReviewRow label="Reference" value={form.invoiceNumber} onEdit={() => onNext('details')} />}
      </PayCard>
      <StickyPayCTA label="Submit Payment" onClick={onSubmit} secondaryLabel="Save Draft" onSecondary={onSaveDraft} />
    </div>
  );
};
