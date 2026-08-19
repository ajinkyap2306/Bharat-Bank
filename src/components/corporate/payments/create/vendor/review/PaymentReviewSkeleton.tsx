import React from 'react';

export const PaymentReviewSkeleton: React.FC = () => (
  <div className="space-y-4 px-4 py-4" aria-busy="true" aria-label="Loading payment review">
    <div className="h-16 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    <div className="h-28 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    <div className="h-36 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    <div className="h-40 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    <div className="h-32 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
  </div>
);
