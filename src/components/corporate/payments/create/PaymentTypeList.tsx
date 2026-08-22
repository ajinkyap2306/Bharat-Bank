import React from 'react';
import { motion } from 'motion/react';
import type { PaymentType } from '../../../../types/corporatePaymentTypeSelection';
import { PaymentTypeCard } from './PaymentTypeCard';

interface PaymentTypeListProps {
  paymentTypes: PaymentType[];
  onSelect: (paymentType: PaymentType) => void;
}

export const PaymentTypeList: React.FC<PaymentTypeListProps> = ({
  paymentTypes,
  onSelect,
}) => (
  <section className="px-4" aria-labelledby="choose-payment-type-heading">
    <h2
      id="choose-payment-type-heading"
      className="text-[17px] font-semibold text-slate-900 dark:text-white mb-3"
    >
      Choose Payment Type
    </h2>
    <div className="space-y-3">
      {paymentTypes.map((type, index) => (
        <motion.div
          key={type.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: index * 0.04,
            ease: 'easeOut',
          }}
          className="motion-reduce:opacity-100 motion-reduce:transform-none"
        >
          <PaymentTypeCard paymentType={type} onSelect={onSelect} index={index} />
        </motion.div>
      ))}
    </div>
  </section>
);
