import React from 'react';
import { Headphones, BookOpen, ShieldCheck, X } from 'lucide-react';
import { BottomSheet } from '../../../common/BottomSheet';

interface HelpBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContactSupport: () => void;
  onLoginHelp: () => void;
  onSecurityInfo: () => void;
}

const helpOptions = [
  {
    id: 'contact',
    label: 'Contact Support',
    description: 'Speak with corporate banking support',
    icon: Headphones,
    action: 'onContactSupport' as const,
  },
  {
    id: 'login',
    label: 'Login Help',
    description: 'Troubleshoot sign-in issues',
    icon: BookOpen,
    action: 'onLoginHelp' as const,
  },
  {
    id: 'security',
    label: 'Security Information',
    description: 'Learn how we protect your access',
    icon: ShieldCheck,
    action: 'onSecurityInfo' as const,
  },
];

export const HelpBottomSheet: React.FC<HelpBottomSheetProps> = ({
  isOpen,
  onClose,
  onContactSupport,
  onLoginHelp,
  onSecurityInfo,
}) => {
  const handlers = {
    onContactSupport,
    onLoginHelp,
    onSecurityInfo,
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Corporate Banking Support"
    >
      <div className="space-y-2 pb-2">
        {helpOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                handlers[option.action]();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F9FC] dark:bg-slate-800/60 border border-[#E4E7EC] dark:border-slate-700 text-left active:scale-[0.99] transition-transform min-h-11"
            >
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-700 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-[#0B5CAB]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827] dark:text-white">
                  {option.label}
                </p>
                <p className="text-[12px] text-[#667085] dark:text-slate-400 mt-0.5">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-3.5 rounded-2xl border border-[#E4E7EC] dark:border-slate-700 text-sm font-semibold text-[#667085] dark:text-slate-300 flex items-center justify-center gap-2 min-h-11 active:scale-[0.99] transition-transform"
        >
          <X className="w-4 h-4" />
          Close
        </button>
      </div>
    </BottomSheet>
  );
};
