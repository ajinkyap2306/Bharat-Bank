import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { formatPaymentCurrency } from '../../payments/shared/CorporatePaymentsUI';
import type { ApprovalActionResult } from '../../../../types/corporateApprovalDetails';

interface ApprovalSuccessStateProps {
  result: ApprovalActionResult;
  onViewPayment: () => void;
  onDone: () => void;
}

export const ApprovalSuccessState: React.FC<ApprovalSuccessStateProps> = ({
  result,
  onViewPayment,
  onDone,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="max-w-[430px] mx-auto px-4 py-8 text-center">
      <motion.div
        initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CheckCircle className="w-14 h-14 text-[#16A34A] mx-auto" aria-hidden />
        <h2 className="text-[20px] font-semibold text-[#111827] dark:text-white mt-4">
          {result.title}
        </h2>
        {result.amount !== undefined && (
          <p className="text-[24px] font-bold tabular-nums text-[#111827] dark:text-white mt-2">
            {formatPaymentCurrency(result.amount)}
          </p>
        )}
        {result.beneficiary && (
          <p className="text-[14px] text-[#667085] mt-1">{result.beneficiary}</p>
        )}
        <p className="text-[13px] text-[#667085] mt-4">{result.message}</p>
        {result.secondaryMessage && (
          <p className="text-[13px] font-semibold text-[#0B5CAB] mt-2">
            {result.secondaryMessage}
          </p>
        )}
      </motion.div>
      <div className="mt-8 space-y-2">
        {result.paymentId && (
          <button
            type="button"
            onClick={onViewPayment}
            className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-semibold min-h-12"
          >
            View Payment
          </button>
        )}
        <button
          type="button"
          onClick={onDone}
          className="w-full py-3.5 rounded-2xl border border-[#E4E7EC] text-[#0B5CAB] font-semibold min-h-12"
        >
          Back to Approvals
        </button>
      </div>
    </div>
  );
};
