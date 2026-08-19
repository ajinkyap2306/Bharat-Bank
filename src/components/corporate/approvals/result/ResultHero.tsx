import React from 'react';
import {
  AlertCircle,
  CheckCircle,
  Info,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { ApprovalResultStatus } from '../../../../types/corporateApprovalResult';

interface ResultHeroProps {
  status: ApprovalResultStatus;
}

const heroConfig: Record<
  ApprovalResultStatus,
  { icon: React.ReactNode; title: string; description: string; tone: string }
> = {
  approved_next: {
    icon: <CheckCircle className="w-12 h-12 text-[#16A34A]" aria-hidden />,
    title: 'Approval Successful',
    description: 'The request has been approved by you.',
    tone: 'text-[#16A34A]',
  },
  approved_final: {
    icon: <CheckCircle className="w-12 h-12 text-[#16A34A]" aria-hidden />,
    title: 'Approval Successful',
    description: 'The request has been approved by you.',
    tone: 'text-[#16A34A]',
  },
  rejected: {
    icon: <XCircle className="w-12 h-12 text-[#DC2626]" aria-hidden />,
    title: 'Payment Rejected',
    description: 'The payment request has been rejected.',
    tone: 'text-[#DC2626]',
  },
  returned: {
    icon: <RotateCcw className="w-12 h-12 text-[#F59E0B]" aria-hidden />,
    title: 'Returned for Changes',
    description: 'The request has been returned to the maker.',
    tone: 'text-[#F59E0B]',
  },
  already_processed: {
    icon: <Info className="w-12 h-12 text-[#0B5CAB]" aria-hidden />,
    title: 'Request Already Processed',
    description: 'This request was already handled by another authorized user.',
    tone: 'text-[#0B5CAB]',
  },
  failed: {
    icon: <AlertCircle className="w-12 h-12 text-[#DC2626]" aria-hidden />,
    title: 'Action Failed',
    description: 'The approval action could not be completed.',
    tone: 'text-[#DC2626]',
  },
};

export const ResultHero: React.FC<ResultHeroProps> = ({ status }) => {
  const reduceMotion = useReducedMotion();
  const hero = heroConfig[status];

  return (
    <section
      className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5 text-center"
      aria-live="polite"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex justify-center mb-3">{hero.icon}</div>
        <h2 className={`text-[18px] font-semibold ${hero.tone}`}>{hero.title}</h2>
        <p className="text-[13px] text-[#667085] mt-2">{hero.description}</p>
      </motion.div>
    </section>
  );
};
