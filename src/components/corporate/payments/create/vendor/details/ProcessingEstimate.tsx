import React from 'react';
import { Clock } from 'lucide-react';
import type { PaymentRailMethod } from '../../../../../../types/corporateVendorPaymentDetails';
import { getProcessingEstimate } from '../../../../../../data/corporateVendorPaymentDetailsMock';

interface ProcessingEstimateProps {
  method: PaymentRailMethod;
}

export const ProcessingEstimate: React.FC<ProcessingEstimateProps> = ({ method }) => (
  <section className="px-4" aria-label="Estimated processing">
    <div className="rounded-2xl bg-congress-blue-700/5 border border-congress-blue-700/15 p-4 flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
        <Clock className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-slate-900 dark:text-white">
          Estimated Processing
        </p>
        <p className="text-[14px] font-bold text-congress-blue-700 dark:text-congress-blue-400 mt-0.5">{method}</p>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">{getProcessingEstimate(method)}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 italic">Estimate only. Processing times may vary.</p>
      </div>
    </div>
  </section>
);
