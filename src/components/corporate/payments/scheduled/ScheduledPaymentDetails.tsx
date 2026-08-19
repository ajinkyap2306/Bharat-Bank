import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { clonePreferences } from '../../../../data/corporateAccountPreferencesMock';
import {
  cancelScheduledPayment,
  fetchScheduledPaymentDetail,
} from '../../../../data/corporateScheduledPaymentsMock';
import type { CorporateScheduledPaymentDetail } from '../../../../types/corporateScheduledPayments';
import { ScheduledPaymentsHeader } from './ScheduledPaymentsHeader';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { ScheduledPaymentHero } from './ScheduledPaymentHero';
import { ScheduledPaymentInfo } from './ScheduledPaymentInfo';
import { CancelScheduledSheet } from './CancelScheduledSheet';
import { ScheduledPaymentsSkeleton } from './ScheduledPaymentsSkeleton';
import { PaymentErrorState } from '../tracking/PaymentErrorState';

export const ScheduledPaymentDetails: React.FC = () => {
  const { scheduleId = '' } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden, closeDetailFlow, openDetailFlow } = useBanking();

  const [data, setData] = useState<CorporateScheduledPaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const hideAmounts = clonePreferences('acc_corp_op_01')?.hideBalance ?? false;

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchScheduledPaymentDetail(scheduleId);
      if (!result) {
        setError(true);
        setData(null);
      } else {
        setData(result);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow('scheduled-payment-details');
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, closeDetailFlow, openDetailFlow]);

  useEffect(() => {
    load();
  }, [load]);

  const handleBack = () => navigate('/corporate/payments/scheduled');

  const handleEdit = () => {
    if (!data) return;
    navigate(`/corporate/payments/scheduled/${data.id}/edit`);
  };

  const handleViewApproval = () => {
    if (!data?.approvalId) return;
    navigate(`/corporate/approvals/${data.approvalId}`);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!data) return;
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 600));
    cancelScheduledPayment(data.id);
    setCancelling(false);
    setShowCancel(false);
    addToast({
      type: 'success',
      title: 'Schedule cancelled',
      message: `${data.beneficiary.name} — ${reason}`,
    });
    navigate('/corporate/payments/scheduled?tab=cancelled', { replace: true });
  };

  const showEditCancel = data?.status === 'upcoming' && (data.canEdit || data.canCancel);
  const showApprovalCta = data?.status === 'pending_approval';

  if (loading && !data) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
        <ScheduledPaymentsHeader title="Scheduled Payment" onBack={handleBack} />
        <div className="pt-4">
          <ScheduledPaymentsSkeleton />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
        <ScheduledPaymentsHeader title="Scheduled Payment" onBack={handleBack} />
        <PaymentErrorState onRetry={load} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
      <ScheduledPaymentsHeader title="Scheduled Payment" onBack={handleBack} />

      <main className={`space-y-4 pt-4 ${showEditCancel || showApprovalCta ? 'pb-36' : 'pb-8'}`}>
        <ScheduledPaymentHero data={data} hideAmounts={hideAmounts} />
        <ScheduledPaymentInfo data={data} />
      </main>

      {showApprovalCta && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
          <div className="max-w-[430px] mx-auto">
            <button
              type="button"
              onClick={handleViewApproval}
              disabled={!data.approvalId}
              className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11 disabled:opacity-50"
            >
              View Approval Status
            </button>
          </div>
        </div>
      )}

      {showEditCancel && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
          <div className="max-w-[430px] mx-auto flex gap-2">
            {data.canEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="flex-1 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 font-bold text-sm text-[#111827] dark:text-white min-h-11"
              >
                Edit Schedule
              </button>
            )}
            {data.canCancel && (
              <button
                type="button"
                onClick={() => setShowCancel(true)}
                className="flex-1 py-3.5 rounded-2xl border border-rose-200 dark:border-rose-900 font-bold text-sm text-[#DC2626] min-h-11"
              >
                Cancel Schedule
              </button>
            )}
          </div>
        </div>
      )}

      <CancelScheduledSheet
        isOpen={showCancel}
        title={data.title}
        beneficiaryName={data.beneficiary.name}
        amount={hideAmounts ? '••••••' : formatPaymentCurrency(data.amount, data.currency)}
        nextPayment={`${data.scheduledDate} • ${data.executionTime}`}
        onClose={() => setShowCancel(false)}
        onKeep={() => setShowCancel(false)}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
      />
    </div>
  );
};
