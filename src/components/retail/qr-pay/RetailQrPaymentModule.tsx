import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { QrPaymentFlow } from './QrPaymentFlow';

interface RetailQrPaymentModuleProps {
  onClose: () => void;
}

export const RetailQrPaymentModule: React.FC<RetailQrPaymentModuleProps> = ({ onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto"
    >
      <QrPaymentFlow onClose={onClose} />
    </motion.div>
  </AnimatePresence>
);
