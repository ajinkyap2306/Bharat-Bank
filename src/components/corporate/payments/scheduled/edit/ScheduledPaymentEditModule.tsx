import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBanking } from '../../../../../context/BankingContext';
import { BottomSheet } from '../../../../common/BottomSheet';
import {
  createDefaultScheduledDraft,
  draftToDetailPreview,
  fetchScheduledPaymentDetail,
  formatScheduleLabel,
  saveScheduledPaymentDraft,
  updateScheduledPaymentDraftEdit,
} from '../../../../../data/corporateScheduledPaymentsMock';
import type { ScheduledPaymentDraft } from '../../../../../types/corporateScheduledPayments';
import { formatPaymentCurrency, PayCard, StickyPayCTA } from '../../shared/CorporatePaymentsUI';
import { ScheduledPaymentsHeader } from '../ScheduledPaymentsHeader';

export const ScheduledPaymentEditModule: React.FC = () => {
  const { scheduleId = '' } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, openDetailFlow, closeDetailFlow } = useBanking();
  const [draft, setDraft] = useState<ScheduledPaymentDraft>(createDefaultScheduledDraft);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow('scheduled-payment-edit');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  useEffect(() => {
    fetchScheduledPaymentDetail(scheduleId).then((detail) => {
      if (!detail) {
        navigate('/corporate/payments/scheduled', { replace: true });
        return;
      }
      setDraft({
        ...createDefaultScheduledDraft(),
        paymentType: 'vendor',
        beneficiaryId: detail.beneficiary.id ?? '',
        beneficiaryName: detail.beneficiary.name,
        beneficiaryMaskedAccount: detail.beneficiary.maskedAccount,
        beneficiaryBank: detail.beneficiary.bankName,
        accountId: detail.sourceAccount.id,
        amount: detail.amount,
        reference: detail.reference,
        remarks: detail.remarks ?? '',
        frequency: detail.frequencyKey,
        paymentDate: '2026-08-25',
        executionTime: '10:00',
        startDate: '2026-08-25',
        endDate: '2026-12-25',
        noEndDate: !detail.endDate,
        monthlyDay: detail.monthlyDay ?? 25,
        weeklyDay: detail.weeklyDay ?? 'Monday',
      });
      setLoading(false);
    });
  }, [scheduleId, navigate]);

  const preview = draftToDetailPreview(draft);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    saveScheduledPaymentDraft(draft);
    updateScheduledPaymentDraftEdit(scheduleId, draft);
    setSubmitting(false);
    setShowReview(false);
    addToast({
      type: 'success',
      title: 'Submitted for approval',
      message: 'Schedule changes sent to Checker for approval.',
    });
    navigate(`/corporate/payments/scheduled/${scheduleId}`, { replace: true });
  };

  if (loading) return null;

  return (
    <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto pb-28">
      <ScheduledPaymentsHeader
        title="Edit Schedule"
        onBack={() => navigate(`/corporate/payments/scheduled/${scheduleId}`)}
      />
      <main className="px-4 pt-4 space-y-4">
        <PayCard className="p-4 space-y-3">
          <div>
            <label className="text-xs font-bold">Amount</label>
            <input
              type="number"
              value={draft.amount}
              onChange={(e) => setDraft((d) => ({ ...d, amount: Number(e.target.value) }))}
              className="w-full mt-1 py-3 px-4 rounded-xl border text-sm font-semibold"
            />
          </div>
          <div>
            <label className="text-xs font-bold">Frequency</label>
            <select
              value={draft.frequency}
              onChange={(e) => setDraft((d) => ({ ...d, frequency: e.target.value as ScheduledPaymentDraft['frequency'] }))}
              className="w-full mt-1 py-3 rounded-xl border text-sm"
            >
              <option value="one_time">One Time</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          {(draft.frequency === 'monthly' || draft.frequency === 'quarterly') && (
            <div>
              <label className="text-xs font-bold">Payment Day</label>
              <input
                type="number"
                min={1}
                max={28}
                value={draft.monthlyDay}
                onChange={(e) => setDraft((d) => ({ ...d, monthlyDay: Number(e.target.value) }))}
                className="w-full mt-1 py-3 px-4 rounded-xl border text-sm"
              />
            </div>
          )}
          {draft.frequency !== 'one_time' && (
            <div>
              <label className="text-xs font-bold">End Date</label>
              <input
                type="date"
                value={draft.endDate}
                onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value, noEndDate: false }))}
                className="w-full mt-1 py-3 px-4 rounded-xl border text-sm"
              />
            </div>
          )}
        </PayCard>
        <p className="text-xs text-[#667085] text-center">
          Changes require Checker approval before taking effect.
        </p>
        <StickyPayCTA label="Review Changes" onClick={() => setShowReview(true)} />
      </main>

      <BottomSheet isOpen={showReview} onClose={() => setShowReview(false)} title="Review Changes">
        <div className="px-4 pb-6 space-y-4 text-sm">
          <div className="rounded-xl border p-3 space-y-2">
            <div className="flex justify-between"><span className="text-[#667085]">Amount</span><span className="font-bold">{formatPaymentCurrency(draft.amount)}</span></div>
            <div className="flex justify-between"><span className="text-[#667085]">Frequency</span><span className="font-medium">{formatScheduleLabel(draft)}</span></div>
            {preview.scheduledDate && <div className="flex justify-between"><span className="text-[#667085]">Next Payment</span><span className="font-medium">{preview.scheduledDate}</span></div>}
            {preview.endDate && <div className="flex justify-between"><span className="text-[#667085]">End Date</span><span className="font-medium">{preview.endDate}</span></div>}
          </div>
          <p className="text-xs text-[#667085]">Submit for Checker approval to update this schedule.</p>
          <button type="button" onClick={() => setShowReview(false)} className="w-full py-3 rounded-2xl border font-semibold text-sm">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={submitting} className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm disabled:opacity-50">
            {submitting ? 'Submitting…' : 'Submit for Approval'}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};
