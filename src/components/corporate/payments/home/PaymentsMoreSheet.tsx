import React from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import { ChevronRight, FileStack, Gauge, History, Settings } from 'lucide-react';

interface PaymentsMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLimits: () => void;
  onTemplates: () => void;
  onHistory: () => void;
  onSettings: () => void;
}

const ITEMS = [
  { id: 'limits', label: 'Payment Limits', icon: Gauge, action: 'onLimits' as const },
  { id: 'templates', label: 'Payment Templates', icon: FileStack, action: 'onTemplates' as const },
  { id: 'history', label: 'Payment History', icon: History, action: 'onHistory' as const },
  { id: 'settings', label: 'Payment Settings', icon: Settings, action: 'onSettings' as const },
];

export const PaymentsMoreSheet: React.FC<PaymentsMoreSheetProps> = ({
  isOpen,
  onClose,
  onLimits,
  onTemplates,
  onHistory,
  onSettings,
}) => {
  const handlers = { onLimits, onTemplates, onHistory, onSettings };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="More">
      <div className="space-y-1 pb-2">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              handlers[item.action]();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl min-h-14 active:bg-slate-50 dark:active:bg-slate-800/40"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
            </div>
            <span className="flex-1 text-left text-[14px] font-medium text-[#111827] dark:text-white">
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4 text-[#667085]" aria-hidden />
          </button>
        ))}
      </div>
    </BottomSheet>
  );
};
