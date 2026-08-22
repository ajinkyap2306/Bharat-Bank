import React, { useState } from 'react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import {
  CORPORATE_SCHEDULED_PAYMENTS,
  CORPORATE_PAYMENT_TEMPLATES,
  CORPORATE_PAYMENT_DRAFTS,
} from '../../../../data/corporatePaymentsMock';
import { useBanking } from '../../../../context/BankingContext';
import { PayCard, PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { CorporatePaymentForm, DEFAULT_PAYMENT_FORM } from '../../../../types/corporatePayments';

export const ScheduledPaymentsScreen: React.FC<{
  onBack: () => void;
  onCancel: (id: string) => void;
}> = ({ onBack, onCancel }) => {
  const [scheduled] = useState(CORPORATE_SCHEDULED_PAYMENTS);

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Scheduled Payments" onBack={onBack} edgeToEdge={false} />
      {scheduled.length === 0 ? (
        <PayCard className="p-6 text-center mx-3"><p className="text-sm font-bold">No upcoming payments</p></PayCard>
      ) : (
        <div className="space-y-2">
          {scheduled.map((s) => (
            <PayCard key={s.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold">{s.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.beneficiaryName}</p>
                  <p className="text-sm font-mono font-bold mt-1">{formatPaymentCurrency(s.amount)}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Due {s.scheduledDate} • {s.frequency}</p>
                </div>
                <PaymentStatusBadge status={s.status} />
              </div>
              <div className="flex gap-2 mt-3">
                <button type="button" className="flex-1 py-2 rounded-xl border text-xs font-bold min-h-11">View</button>
                {s.status === 'Scheduled' && (
                  <button type="button" onClick={() => onCancel(s.id)} className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold min-h-11">Cancel</button>
                )}
              </div>
            </PayCard>
          ))}
        </div>
      )}
    </div>
  );
};

export const TemplatesScreen: React.FC<{
  onBack: () => void;
  onUseTemplate: (form: Partial<CorporatePaymentForm>) => void;
}> = ({ onBack, onUseTemplate }) => {
  const { addToast } = useBanking();
  const [templates] = useState(CORPORATE_PAYMENT_TEMPLATES);

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Payment Templates" onBack={onBack} edgeToEdge={false} />
      <div className="space-y-2">
        {templates.map((t) => (
          <PayCard key={t.id} className="p-4">
            <p className="text-sm font-bold">{t.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.beneficiaryName}</p>
            <p className="text-sm font-mono font-bold">{formatPaymentCurrency(t.amount)}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.purpose} • {t.reference}</p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() =>
                  onUseTemplate({
                    ...DEFAULT_PAYMENT_FORM,
                    paymentType: t.type,
                    beneficiaryId: t.beneficiaryId || '',
                    amount: String(t.amount),
                    purpose: t.purpose,
                    reference: t.reference,
                    fromAccountId: t.debitAccountId,
                  })
                }
                className="flex-1 py-2 rounded-xl bg-congress-blue-700 text-white text-xs font-bold min-h-11"
              >
                Use Template
              </button>
              <button type="button" onClick={() => addToast({ type: 'info', title: 'Edit', message: 'Template editor opened.' })} className="px-4 py-2 rounded-xl border text-xs font-bold min-h-11">Edit</button>
            </div>
          </PayCard>
        ))}
      </div>
    </div>
  );
};

export const DraftsScreen: React.FC<{
  onBack: () => void;
  onContinue: (form: Partial<CorporatePaymentForm>) => void;
}> = ({ onBack, onContinue }) => {
  const [drafts, setDrafts] = useState(CORPORATE_PAYMENT_DRAFTS);
  const { addToast } = useBanking();

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title="Draft Payments" onBack={onBack} edgeToEdge={false} />
      {drafts.length === 0 ? (
        <PayCard className="p-6 text-center mx-3"><p className="text-sm font-bold">No draft payments</p></PayCard>
      ) : (
        drafts.map((d) => (
          <PayCard key={d.id} className="p-4 mb-2">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-bold">{d.label}</p>
                <p className="text-sm font-mono font-bold">{formatPaymentCurrency(d.amount)}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{d.updatedAt}</p>
              </div>
              <PaymentStatusBadge status="Draft" />
            </div>
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => onContinue(d.form)} className="flex-1 py-2 rounded-xl bg-congress-blue-700 text-white text-xs font-bold min-h-11">Continue</button>
              <button type="button" onClick={() => { setDrafts((prev) => prev.filter((x) => x.id !== d.id)); addToast({ type: 'info', title: 'Deleted', message: 'Draft removed.' }); }} className="px-4 py-2 rounded-xl border text-xs font-bold text-rose-600 min-h-11">Delete</button>
            </div>
          </PayCard>
        ))
      )}
    </div>
  );
};
