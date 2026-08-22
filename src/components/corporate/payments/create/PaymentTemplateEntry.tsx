import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import type { PaymentTemplatePreview } from '../../../../types/corporatePaymentTypeSelection';

interface PaymentTemplateEntryProps {
  templates: PaymentTemplatePreview[];
  onViewTemplates: () => void;
}

export const PaymentTemplateEntry: React.FC<PaymentTemplateEntryProps> = ({
  templates,
  onViewTemplates,
}) => {
  if (templates.length === 0) return null;

  return (
    <section className="px-4" aria-labelledby="payment-templates-heading">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2
            id="payment-templates-heading"
            className="text-[15px] font-semibold text-slate-900 dark:text-white"
          >
            Use a Payment Template
          </h2>
          <button
            type="button"
            onClick={onViewTemplates}
            className="text-[13px] font-semibold text-congress-blue-700 dark:text-congress-blue-400 min-h-11 px-2 flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 rounded-lg"
          >
            View Templates
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
        </div>

        <ul className="space-y-2" aria-label="Saved payment templates">
          {templates.map((template) => (
            <li
              key={template.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 min-h-11"
            >
              <div
                className="w-9 h-9 rounded-lg bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center shrink-0"
                aria-hidden
              >
                <FileText className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400" />
              </div>
              <p className="text-[14px] font-medium text-slate-900 dark:text-white">
                {template.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
