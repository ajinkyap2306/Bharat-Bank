import React from 'react';

export const ApprovalResultSkeleton: React.FC = () => (
  <div className="space-y-4 py-4" aria-busy="true" aria-label="Loading approval result">
    <div className="mx-4 h-32 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    <div className="mx-4 h-40 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    <div className="mx-4 h-36 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
    <div className="mx-4 h-48 rounded-2xl bg-slate-200/60 dark:bg-slate-800 animate-pulse motion-reduce:animate-none" />
  </div>
);
