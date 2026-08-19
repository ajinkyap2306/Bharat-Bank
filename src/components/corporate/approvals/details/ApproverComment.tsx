import React from 'react';

interface ApproverCommentProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 500;

export const ApproverComment: React.FC<ApproverCommentProps> = ({
  value,
  onChange,
  disabled = false,
}) => (
  <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-4">
    <label htmlFor="approver-comment" className="text-[14px] font-semibold text-[#111827] dark:text-white">
      Add Comment
    </label>
    <textarea
      id="approver-comment"
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
      disabled={disabled}
      placeholder="Add a comment for this approval"
      rows={3}
      className="mt-2 w-full p-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-800 text-[14px] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5CAB] disabled:opacity-50"
      aria-describedby="approver-comment-count"
    />
    <p id="approver-comment-count" className="text-[11px] text-[#667085] mt-1 text-right">
      {value.length}/{MAX_LENGTH}
    </p>
  </section>
);
