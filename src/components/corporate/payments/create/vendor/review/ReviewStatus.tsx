import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const ReviewStatus: React.FC = () => (
  <section className="px-4" aria-label="Review status">
    <div className="rounded-2xl bg-congress-blue-700/5 border border-congress-blue-700/15 p-4 flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-slate-900 dark:text-white">Ready for Review</p>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
          Check the details carefully before submitting.
        </p>
      </div>
    </div>
  </section>
);
