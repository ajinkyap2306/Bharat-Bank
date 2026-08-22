import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface StatementShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (format: 'pdf' | 'csv') => void;
}

export const StatementShareSheet: React.FC<StatementShareSheetProps> = ({
  isOpen,
  onClose,
  onShare,
}) => {
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Share Statement">
      <div className="space-y-4 pb-2">
        <div className="flex gap-2">
          {[
            { id: 'pdf' as const, label: 'PDF', icon: FileText },
            { id: 'csv' as const, label: 'CSV', icon: FileSpreadsheet },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFormat(opt.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border min-h-20 ${
                format === opt.id
                  ? 'border-congress-blue-700 bg-congress-blue-50 dark:bg-congress-blue-950/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <opt.icon className="w-6 h-6 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
              <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{opt.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            onShare(format);
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white text-sm font-semibold min-h-12"
        >
          Share
        </button>
      </div>
    </BottomSheet>
  );
};
