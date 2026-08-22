import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { ScreenHeader } from '../../common/ScreenHeader';

export const ProfileScreenHeader: React.FC<{
  title: string;
  onBack: () => void;
  onMore?: () => void;
}> = ({ title, onBack, onMore }) => (
  <ScreenHeader
    title={title}
    onBack={onBack}
    rightAction={
      onMore
        ? (
          <button
            type="button"
            onClick={onMore}
            className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
            aria-label="More options"
          >
            <MoreHorizontal className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        )
        : undefined
    }
  />
);
