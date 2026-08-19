import React from 'react';

export const BeneficiarySkeleton: React.FC = () => (
  <div className="space-y-5 px-4 py-4" aria-busy="true" aria-label="Loading beneficiaries">
    <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-28 animate-pulse motion-reduce:animate-none" />
    <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-12 animate-pulse motion-reduce:animate-none" />
    <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-11 animate-pulse motion-reduce:animate-none" />
    <div className="flex gap-3 overflow-hidden">
      <div className="shrink-0 w-[200px] h-[120px] rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
      <div className="shrink-0 w-[200px] h-[120px] rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    </div>
    <div className="space-y-2">
      <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-20 animate-pulse motion-reduce:animate-none" />
      <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-20 animate-pulse motion-reduce:animate-none" />
    </div>
    <div className="space-y-2">
      <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-[76px] animate-pulse motion-reduce:animate-none" />
      <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-[76px] animate-pulse motion-reduce:animate-none" />
      <div className="rounded-2xl bg-slate-200/60 dark:bg-slate-800 h-[76px] animate-pulse motion-reduce:animate-none" />
    </div>
  </div>
);
