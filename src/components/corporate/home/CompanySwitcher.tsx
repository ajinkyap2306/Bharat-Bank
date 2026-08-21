import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import type { CorporateEntity } from '../../../types/corporateDashboard';

interface CompanySwitcherProps {
  isOpen: boolean;
  entities: CorporateEntity[];
  selectedId: string;
  onClose: () => void;
  onSelect: (entityId: string) => void;
}

export const CompanySwitcher: React.FC<CompanySwitcherProps> = ({
  isOpen,
  entities,
  selectedId,
  onClose,
  onSelect,
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl p-5 pb-8 safe-bottom max-w-lg mx-auto"
          role="dialog"
          aria-label="Your Companies"
        >
          <div className="w-12 h-1.5 bg-[#E4E7EC] dark:bg-slate-700 rounded-full mx-auto mb-4" />
          <p className="text-base font-semibold text-[#111827] dark:text-white mb-3">
            Your Companies
          </p>
          <div className="space-y-1">
            {entities.map((entity) => {
              const isSelected = entity.id === selectedId;
              return (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => onSelect(entity.id)}
                  className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl text-left min-h-12 transition-colors ${
                    isSelected
                      ? 'bg-congress-blue-50 dark:bg-congress-blue-950/60 border border-congress-blue-200 dark:border-congress-blue-800'
                      : 'hover:bg-[#F7F9FC] dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] dark:text-white truncate">
                      {entity.name}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400 shrink-0" aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
