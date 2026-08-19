import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileStack } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { useCorporateMakerGate } from '../../../../hooks/useCorporateMakerGate';
import { CORPORATE_PAYMENT_TEMPLATES } from '../../../../data/corporatePaymentsMock';
import { formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { PayHomeCard, PayListDivider } from '../home/PaymentsHomeUI';

export const PaymentTemplatesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setBottomNavHidden, closeDetailFlow } = useBanking();
  const { blockIfChecker } = useCorporateMakerGate();

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  const handleUseTemplate = (templateId: string) => {
    if (blockIfChecker('use payment templates')) return;
    navigate('/corporate/payments/create/vendor', { state: { templateId } });
  };

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-6">
      <header className="sticky top-0 z-20 bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-3 safe-top flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/corporate/payments')}
          className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center"
          aria-label="Back to payments"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-[#111827] dark:text-white">Payment Templates</h1>
      </header>

      <div className="space-y-3 pt-2 px-4">
        <p className="text-[12px] text-[#667085]">
          Select a template to start a new vendor payment with pre-filled details.
        </p>

        <PayHomeCard>
          {CORPORATE_PAYMENT_TEMPLATES.map((tpl, index) => (
            <React.Fragment key={tpl.id}>
              {index > 0 && <PayListDivider />}
              <button
                type="button"
                onClick={() => handleUseTemplate(tpl.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50 dark:active:bg-slate-800/40"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
                  <FileStack className="w-5 h-5 text-[#0B5CAB]" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-[#111827] dark:text-white">{tpl.name}</p>
                  <p className="text-[12px] text-[#667085] mt-0.5">{tpl.beneficiaryName}</p>
                  <p className="text-[11px] text-[#667085] capitalize">{tpl.type} payment</p>
                </div>
                <p className="text-[13px] font-bold text-[#111827] dark:text-white tabular-nums shrink-0">
                  {formatPaymentCurrency(tpl.amount)}
                </p>
              </button>
            </React.Fragment>
          ))}
        </PayHomeCard>
      </div>
    </div>
  );
};
