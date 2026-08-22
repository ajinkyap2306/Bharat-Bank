import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface FileProcessingStateProps {
  message: string;
}

export const FileProcessingState: React.FC<FileProcessingStateProps> = ({ message }) => {
  const reduceMotion = useReducedMotion();
  return (
    <div
      className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="inline-flex"
      >
        <Loader2 className="w-10 h-10 text-congress-blue-700 dark:text-congress-blue-400 motion-reduce:animate-none" aria-hidden />
      </motion.div>
      <p className="text-[15px] font-semibold text-slate-900 dark:text-white mt-4">{message}</p>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Please wait…</p>
    </div>
  );
};
