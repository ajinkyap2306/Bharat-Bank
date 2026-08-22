import React from 'react';

interface MakerCommentProps {
  comment: string;
}

export const MakerComment: React.FC<MakerCommentProps> = ({ comment }) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
    <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">Maker Comment</h2>
    <p className="text-[13px] text-slate-900 dark:text-white mt-2 leading-relaxed">
      &ldquo;{comment}&rdquo;
    </p>
  </section>
);
