import React from 'react';
import { BookOpen, Headphones, X } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';

interface PaymentHelpSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentGuide: () => void;
  onContactSupport: () => void;
}

export const PaymentHelpSheet: React.FC<PaymentHelpSheetProps> = ({
  isOpen,
  onClose,
  onPaymentGuide,
  onContactSupport,
}) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Payment Help">
    <div className="space-y-2 pb-2">
      <button
        type="button"
        onClick={() => {
          onPaymentGuide();
          onClose();
        }}
        className="w-full flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-14 text-left active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
      >
        <div className="w-10 h-10 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
        </div>
        <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
          Payment Guide
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          onContactSupport();
          onClose();
        }}
        className="w-full flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-14 text-left active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
      >
        <div className="w-10 h-10 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
        </div>
        <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
          Contact Support
        </span>
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-14 text-[15px] font-semibold text-slate-500 dark:text-slate-400 active:bg-slate-50 dark:active:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500 mt-2"
      >
        <X className="w-4 h-4" aria-hidden />
        Close
      </button>
    </div>
  </BottomSheet>
);
