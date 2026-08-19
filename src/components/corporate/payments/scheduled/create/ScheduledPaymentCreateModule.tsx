import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import { useBanking } from '../../../../../context/BankingContext';
import { useCorporateMakerGate } from '../../../../../hooks/useCorporateMakerGate';
import { BottomSheet } from '../../../../common/BottomSheet';
import type { ScheduledPaymentDraft, ScheduleFrequency } from '../../../../../types/corporateScheduledPayments';
import {
  clearScheduledPaymentDraft,
  createDefaultScheduledDraft,
  draftToDetailPreview,
  estimateOccurrences,
  formatScheduleLabel,
  getScheduledBeneficiaries,
  getScheduledSourceAccounts,
  loadScheduledPaymentDraft,
  saveScheduledPaymentDraft,
  submitScheduledPaymentForApproval,
} from '../../../../../data/corporateScheduledPaymentsMock';
import { formatPaymentCurrency, PayCard, StickyPayCTA } from '../../shared/CorporatePaymentsUI';
import { ScheduledPaymentsHeader } from '../ScheduledPaymentsHeader';

const BASE = '/corporate/payments/scheduled/create';

type CreateStep = 'type' | 'beneficiary' | 'details' | 'schedule' | 'review' | 'submitted';

const STEP_PATH: Record<CreateStep, string> = {
  type: BASE,
  beneficiary: `${BASE}/beneficiary`,
  details: `${BASE}/details`,
  schedule: `${BASE}/schedule`,
  review: `${BASE}/review`,
  submitted: `${BASE}/submitted`,
};

const FREQUENCIES: { id: ScheduleFrequency; label: string }[] = [
  { id: 'one_time', label: 'One Time' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
  step: CreateStep;
}

export const ScheduledPaymentCreateModule: React.FC<Props> = ({ step }) => {
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, openDetailFlow, closeDetailFlow } = useBanking();
  const { blockIfChecker } = useCorporateMakerGate();

  const [draft, setDraft] = useState<ScheduledPaymentDraft>(
    () => loadScheduledPaymentDraft() ?? createDefaultScheduledDraft()
  );
  const [search, setSearch] = useState('');
  const [confirmMpin, setConfirmMpin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMeta, setSubmittedMeta] = useState<{ scheduleId: string; approvalId: string } | null>(null);

  useEffect(() => {
    if (blockIfChecker('schedule payments')) {
      navigate('/corporate/payments/scheduled', { replace: true });
    }
  }, [blockIfChecker, navigate]);

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow('scheduled-payment-create');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  useEffect(() => {
    saveScheduledPaymentDraft(draft);
  }, [draft]);

  const preview = useMemo(() => draftToDetailPreview(draft), [draft]);
  const occurrences = useMemo(() => estimateOccurrences(draft), [draft]);

  const beneficiaries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return getScheduledBeneficiaries().filter(
      (b) => !q || b.name.toLowerCase().includes(q) || b.maskedAccount.includes(q)
    );
  }, [search]);

  const go = (s: CreateStep) => navigate(STEP_PATH[s]);

  const handleBack = () => {
    const order: CreateStep[] = ['type', 'beneficiary', 'details', 'schedule', 'review'];
    const idx = order.indexOf(step);
    if (idx <= 0) navigate('/corporate/payments/scheduled');
    else go(order[idx - 1]);
  };

  const updateDraft = (patch: Partial<ScheduledPaymentDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = submitScheduledPaymentForApproval(draft);
    setSubmittedMeta(result);
    setSubmitting(false);
    go('submitted');
    addToast({
      type: 'success',
      title: 'Submitted for approval',
      message: 'Checker will review this scheduled payment.',
    });
  };

  if (step === 'submitted' && submittedMeta) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto pb-8">
        <main className="px-4 pt-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-2xl text-emerald-600 mb-4">
            ✓
          </div>
          <h1 className="text-xl font-bold">Submitted for Approval</h1>
          <p className="text-2xl font-bold mt-4">{formatPaymentCurrency(draft.amount)}</p>
          <p className="text-sm font-semibold mt-1">{draft.beneficiaryName}</p>
          <p className="text-xs text-[#667085] mt-1">{formatScheduleLabel(draft)}</p>
          <div className="mt-6 rounded-2xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#667085]">Status</span>
              <span className="font-semibold text-amber-600">Pending Approval</span>
            </div>
            <p className="text-xs text-[#667085]">Awaiting Checker approval</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/corporate/payments/scheduled/${submittedMeta.scheduleId}`)}
            className="w-full mt-6 py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11"
          >
            View Status
          </button>
          <button
            type="button"
            onClick={() => {
              clearScheduledPaymentDraft();
              navigate('/corporate/payments/scheduled?tab=pending_approval');
            }}
            className="w-full mt-2 py-3 rounded-2xl border font-semibold text-sm min-h-11"
          >
            Back to Scheduled Payments
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto pb-28">
      <ScheduledPaymentsHeader
        title={
          step === 'type'
            ? 'Create Scheduled Payment'
            : step === 'beneficiary'
              ? 'Select Beneficiary'
              : step === 'details'
                ? 'Payment Details'
                : step === 'schedule'
                  ? 'Schedule Payment'
                  : 'Review Scheduled Payment'
        }
        onBack={handleBack}
      />

      <main className="px-4 pt-4 space-y-4">
        {step === 'type' && (
          <>
            <p className="text-sm font-semibold text-[#111827] dark:text-white">Payment Type</p>
            {[
              {
                id: 'vendor' as const,
                label: 'Vendor Payment',
                desc: 'Pay your suppliers and business beneficiaries',
              },
              {
                id: 'internal_transfer' as const,
                label: 'Internal Transfer',
                desc: 'Transfer between company accounts',
              },
              {
                id: 'bank_transfer' as const,
                label: 'Bank Transfer',
                desc: 'Transfer to another bank',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateDraft({ paymentType: opt.id })}
                className={`w-full text-left p-4 rounded-2xl border-2 flex items-start gap-3 ${
                  draft.paymentType === opt.id ? 'border-[#0B5CAB] bg-blue-50/50' : 'border-[#E4E7EC] dark:border-slate-800'
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${draft.paymentType === opt.id ? 'border-[#0B5CAB]' : ''}`}>
                  {draft.paymentType === opt.id && <span className="w-2.5 h-2.5 rounded-full bg-[#0B5CAB]" />}
                </span>
                <div>
                  <span className="font-semibold text-sm block">{opt.label}</span>
                  <span className="text-xs text-[#667085] mt-0.5 block">{opt.desc}</span>
                </div>
              </button>
            ))}
            <StickyPayCTA label="Continue" onClick={() => go('beneficiary')} />
          </>
        )}

        {step === 'beneficiary' && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-[#667085]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search beneficiary"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
              />
            </div>
            <PayCard className="divide-y divide-[#E4E7EC]/80 dark:divide-slate-800">
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    updateDraft({
                      beneficiaryId: b.id,
                      beneficiaryName: b.name,
                      beneficiaryMaskedAccount: b.maskedAccount,
                      beneficiaryBank: b.bankName,
                    });
                    go('details');
                  }}
                  className="w-full p-4 text-left min-h-[4.5rem] active:bg-slate-50 dark:active:bg-slate-800/40"
                >
                  <p className="font-semibold text-sm">{b.name}</p>
                  <p className="text-xs text-[#667085] mt-0.5">{b.bankName}</p>
                  <p className="text-xs text-[#667085] font-mono">{b.maskedAccount}</p>
                </button>
              ))}
            </PayCard>
            <button type="button" className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#0B5CAB]">
              <UserPlus className="w-4 h-4" /> Add New Beneficiary
            </button>
          </>
        )}

        {step === 'details' && (
          <>
            <PayCard className="p-4 space-y-3">
              <div>
                <p className="text-xs text-[#667085]">Pay From</p>
                <select
                  value={draft.accountId}
                  onChange={(e) => updateDraft({ accountId: e.target.value })}
                  className="w-full mt-1 py-2.5 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold"
                >
                  {getScheduledSourceAccounts().map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} {a.maskedNumber}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#667085] mt-1">
                  Available {formatPaymentCurrency(getScheduledSourceAccounts().find((a) => a.id === draft.accountId)?.availableBalance ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#667085]">Pay To</p>
                <p className="font-semibold text-sm mt-1">{draft.beneficiaryName}</p>
                <p className="text-xs font-mono text-[#667085]">{draft.beneficiaryMaskedAccount}</p>
              </div>
              <div>
                <label className="text-xs font-bold">Amount</label>
                <input
                  type="number"
                  value={draft.amount || ''}
                  onChange={(e) => updateDraft({ amount: Number(e.target.value) })}
                  placeholder="₹ 2,50,000"
                  className="w-full mt-1 py-3 px-4 rounded-xl border text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold">Payment Reference</label>
                <input
                  value={draft.reference}
                  onChange={(e) => updateDraft({ reference: e.target.value })}
                  placeholder="August Vendor Invoice"
                  className="w-full mt-1 py-3 px-4 rounded-xl border text-sm"
                />
              </div>
            </PayCard>
            <StickyPayCTA
              label="Continue"
              onClick={() => {
                if (!draft.amount || !draft.reference.trim()) {
                  addToast({ type: 'error', title: 'Missing details', message: 'Enter amount and reference.' });
                  return;
                }
                go('schedule');
              }}
            />
          </>
        )}

        {step === 'schedule' && (
          <>
            <PayCard className="p-4 space-y-4">
              <p className="text-sm font-semibold">Payment Frequency</p>
              <div className="flex flex-wrap gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateDraft({ frequency: f.id })}
                    className={`px-3 py-2 rounded-full text-xs font-semibold border ${
                      draft.frequency === f.id ? 'bg-[#0B5CAB] text-white border-[#0B5CAB]' : 'border-[#E4E7EC]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {(draft.frequency === 'one_time' || draft.frequency === 'daily') && (
                <div>
                  <label className="text-xs font-bold">Payment Date</label>
                  <input type="date" value={draft.paymentDate} onChange={(e) => updateDraft({ paymentDate: e.target.value, startDate: e.target.value })} className="w-full mt-1 py-3 px-4 rounded-xl border text-sm" />
                </div>
              )}

              {draft.frequency === 'weekly' && (
                <>
                  <div>
                    <label className="text-xs font-bold">Every</label>
                    <select value={draft.weeklyDay} onChange={(e) => updateDraft({ weeklyDay: e.target.value })} className="w-full mt-1 py-3 rounded-xl border text-sm">
                      {WEEKDAYS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold">Start Date</label>
                    <input type="date" value={draft.startDate} onChange={(e) => updateDraft({ startDate: e.target.value })} className="w-full mt-1 py-3 px-4 rounded-xl border text-sm" />
                  </div>
                </>
              )}

              {(draft.frequency === 'monthly' || draft.frequency === 'quarterly') && (
                <>
                  <div>
                    <label className="text-xs font-bold">Day</label>
                    <input type="number" min={1} max={28} value={draft.monthlyDay} onChange={(e) => updateDraft({ monthlyDay: Number(e.target.value) })} className="w-full mt-1 py-3 px-4 rounded-xl border text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold">Start Date</label>
                    <input type="date" value={draft.startDate} onChange={(e) => updateDraft({ startDate: e.target.value, paymentDate: e.target.value })} className="w-full mt-1 py-3 px-4 rounded-xl border text-sm" />
                  </div>
                </>
              )}

              {draft.frequency !== 'one_time' && (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={draft.noEndDate} onChange={(e) => updateDraft({ noEndDate: e.target.checked })} />
                    No End Date
                  </label>
                  {!draft.noEndDate && (
                    <div>
                      <label className="text-xs font-bold">End Date</label>
                      <input type="date" value={draft.endDate} onChange={(e) => updateDraft({ endDate: e.target.value })} className="w-full mt-1 py-3 px-4 rounded-xl border text-sm" />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="text-xs font-bold">Payment Time</label>
                <input type="time" value={draft.executionTime} onChange={(e) => updateDraft({ executionTime: e.target.value })} className="w-full mt-1 py-3 px-4 rounded-xl border text-sm" />
              </div>
            </PayCard>
            <StickyPayCTA label="Continue" onClick={() => go('review')} />
          </>
        )}

        {step === 'review' && (
          <>
            <PayCard className="p-4 space-y-3 text-sm">
              <Row label="Pay From" value={`${preview.sourceAccount?.name} ${preview.sourceAccount?.maskedNumber}`} />
              <Row label="Beneficiary" value={`${draft.beneficiaryName} ${draft.beneficiaryMaskedAccount}`} />
              <Row label="Amount" value={formatPaymentCurrency(draft.amount)} bold />
              <Row label="Payment Type" value={preview.paymentType ?? 'Vendor Payment'} />
              <Row label="Schedule" value={preview.scheduleLabel ?? ''} />
              <Row label="Next Payment" value={preview.scheduledDate ?? ''} />
              <Row label="Time" value={preview.executionTime ?? ''} />
              {!draft.noEndDate && draft.frequency !== 'one_time' && preview.endDate && (
                <Row label="Until" value={preview.endDate} />
              )}
              <Row label="Reference" value={draft.reference} />
            </PayCard>

            {occurrences && (
              <PayCard className="p-4">
                <p className="text-xs font-bold text-[#667085] mb-2">Schedule Summary</p>
                <Row label="Frequency" value={preview.frequency ?? ''} />
                <Row label="Occurrences" value={String(occurrences)} />
                <Row label="Estimated Total" value={formatPaymentCurrency(draft.amount * occurrences)} bold />
              </PayCard>
            )}

            <PayCard className="p-4">
              <p className="text-sm font-semibold text-amber-700">Approval Required</p>
              <p className="text-xs text-[#667085] mt-1">
                This payment will be sent to the Checker for approval.
              </p>
            </PayCard>

            <StickyPayCTA label="Submit for Approval" onClick={() => setConfirmMpin(true)} />
          </>
        )}
      </main>

      <BottomSheet isOpen={confirmMpin} onClose={() => setConfirmMpin(false)} title="Submit Scheduled Payment?">
        <div className="px-4 pb-6 space-y-4">
          <p className="text-sm font-semibold">{draft.beneficiaryName}</p>
          <p className="text-xl font-bold">{formatPaymentCurrency(draft.amount)}</p>
          <p className="text-xs text-[#667085]">{formatScheduleLabel(draft)}</p>
          <p className="text-xs text-[#667085]">Next Payment: {preview.scheduledDate}</p>
          <p className="text-xs text-[#667085]">This schedule will become active after Checker approval.</p>
          <button type="button" onClick={() => setConfirmMpin(false)} className="w-full py-3 rounded-2xl border font-semibold text-sm">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm disabled:opacity-50">
            {submitting ? 'Submitting…' : 'Submit for Approval'}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <div className="flex justify-between gap-3">
    <span className="text-[#667085] shrink-0">{label}</span>
    <span className={`text-right ${bold ? 'font-bold' : 'font-medium'}`}>{value}</span>
  </div>
);

export function getScheduledCreateStep(pathname: string): CreateStep | null {
  if (pathname === BASE || pathname === `${BASE}/`) return 'type';
  if (pathname.startsWith(`${BASE}/beneficiary`)) return 'beneficiary';
  if (pathname.startsWith(`${BASE}/details`)) return 'details';
  if (pathname.startsWith(`${BASE}/schedule`)) return 'schedule';
  if (pathname.startsWith(`${BASE}/review`)) return 'review';
  if (pathname.startsWith(`${BASE}/submitted`)) return 'submitted';
  return null;
}
