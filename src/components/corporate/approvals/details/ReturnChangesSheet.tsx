import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';

interface ReturnChangesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  loading?: boolean;
}

export const ReturnChangesSheet: React.FC<ReturnChangesSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [comment, setComment] = useState('');

  const handleClose = () => {
    setComment('');
    onClose();
  };

  const canSubmit = comment.trim().length > 0 && !loading;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Return Payment for Changes"
      subtitle="Tell the maker what needs to be corrected."
    >
      <div className="space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please update the invoice reference."
          rows={4}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[14px] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
          aria-label="Return comment"
          aria-required
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold min-h-12"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(comment.trim())}
            disabled={!canSubmit}
            className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white font-semibold min-h-12 disabled:opacity-50"
          >
            {loading ? 'Returning...' : 'Return for Changes'}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
