import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileStack } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { CORPORATE_PAYMENT_HISTORY } from '../../../../data/corporatePaymentsMock';
import { PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard, PayListDivider } from '../home/PaymentsHomeUI';

const STATUS_MAP: Record<string, 'Completed' | 'Processing' | 'Pending Approval' | 'Failed' | 'Scheduled'> = {
  Completed: 'Completed',
  Processing: 'Processing',
  'Pending Approval': 'Pending Approval',
  Failed: 'Failed',
  Scheduled: 'Scheduled',
};

export const PaymentHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setBottomNavHidden, closeDetailFlow } = useBanking();

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof CORPORATE_PAYMENT_HISTORY> = {};
    CORPORATE_PAYMENT_HISTORY.forEach((p) => {
      const day = p.createdAt.includes('Today')
        ? 'Today'
        : p.createdAt.includes('Yesterday')
          ? 'Yesterday'
          : p.paymentDate;
      if (!groups[day]) groups[day] = [];
      groups[day].push(p);
    });
    return groups;
  }, []);

  return (
    <div className="-mx-3 min-h-full bg-slate-50 dark:bg-slate-950 pb-6">
      <header className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-3 safe-top flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/corporate/payments')}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center"
          aria-label="Back to payments"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Payment History</h1>
      </header>

      <div className="space-y-4 pt-2 px-4">
        {Object.entries(grouped).map(([day, items]) => (
          <section key={day} aria-label={`Payments on ${day}`}>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{day}</p>
            <PayHomeCard>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <PayListDivider />}
                  <button
                    type="button"
                    onClick={() => navigate(`/corporate/payments/${item.paymentId}`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left active:bg-slate-50 dark:active:bg-slate-800/40"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <FileStack className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                          {item.beneficiaryName}
                        </p>
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white tabular-nums shrink-0">
                          − {formatPaymentCurrency(item.amount)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.paymentDate}</p>
                        <PaymentStatusBadge status={STATUS_MAP[item.status] ?? 'Processing'} />
                      </div>
                    </div>
                  </button>
                </React.Fragment>
              ))}
            </PayHomeCard>
          </section>
        ))}
      </div>
    </div>
  );
};
