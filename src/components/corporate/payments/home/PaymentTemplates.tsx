import React from 'react';
import { FileStack } from 'lucide-react';
import type { PaymentTemplateItem } from '../../../../types/corporatePaymentsHome';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard, PayListDivider, PaySectionHeader } from './PaymentsHomeUI';
import { PaymentsEmptyState } from './PaymentsStates';

interface PaymentTemplatesProps {
  items: PaymentTemplateItem[];
  showBalances: boolean;
  onViewAll: () => void;
  onSelect: (templateId: string) => void;
}

export const PaymentTemplates: React.FC<PaymentTemplatesProps> = ({
  items,
  showBalances,
  onViewAll,
  onSelect,
}) => {
  if (items.length === 0) return null;

  return (
    <section className="px-4" aria-label="Payment templates">
      <PaySectionHeader title="Templates" action="View All" onAction={onViewAll} />
      <PayHomeCard>
        {items.map((tpl, index) => (
          <React.Fragment key={tpl.id}>
            {index > 0 && <PayListDivider />}
            <button
              type="button"
              onClick={() => onSelect(tpl.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left active:bg-slate-50 dark:active:bg-slate-800/40"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
                <FileStack className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-[#111827] dark:text-white">{tpl.name}</p>
                <p className="text-[11px] text-[#667085] truncate">{tpl.beneficiary}</p>
              </div>
              <p className="text-[12px] font-bold text-[#111827] dark:text-white tabular-nums shrink-0">
                {tpl.defaultAmount != null && showBalances
                  ? formatPaymentCurrency(tpl.defaultAmount, tpl.currency)
                  : 'Variable'}
              </p>
            </button>
          </React.Fragment>
        ))}
      </PayHomeCard>
    </section>
  );
};
