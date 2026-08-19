import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, SendHorizontal } from 'lucide-react';

interface MakePaymentCTAProps {
  onClick: () => void;
}

export const MakePaymentCTA: React.FC<MakePaymentCTAProps> = ({ onClick }) => (
  <section className="px-4" aria-label="Make payment">
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full rounded-2xl bg-linear-to-tr from-[#0B5CAB] to-indigo-700 text-white p-4 shadow-md shadow-[#0B5CAB]/20 flex items-center gap-3"
    >
      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
        <SendHorizontal className="w-5 h-5" aria-hidden />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-[15px] font-bold">Make Payment</p>
        <p className="text-[12px] text-white/80 mt-0.5 truncate">Vendors, payroll & beneficiaries</p>
      </div>
      <ChevronRight className="w-5 h-5 text-white/80 shrink-0" aria-hidden />
    </motion.button>
  </section>
);
