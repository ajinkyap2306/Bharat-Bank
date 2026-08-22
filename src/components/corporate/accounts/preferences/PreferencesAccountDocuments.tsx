import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { PreferencesCard } from './PreferencesUI';

const DOCUMENTS = [
  { id: 'statement', label: 'Statement' },
  { id: 'certificate', label: 'Account Certificate' },
  { id: 'interest', label: 'Interest Certificate' },
] as const;

interface AccountDocumentsProps {
  onSelect: (documentId: (typeof DOCUMENTS)[number]['id']) => void;
}

export const PreferencesAccountDocuments: React.FC<AccountDocumentsProps> = ({ onSelect }) => (
  <PreferencesCard ariaLabel="Account documents">
    <div className="p-4 pb-2">
      <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">Account Documents</h2>
    </div>
    {DOCUMENTS.map((doc) => (
      <button
        key={doc.id}
        type="button"
        onClick={() => onSelect(doc.id)}
        className="w-full flex items-center gap-3 px-4 py-3.5 border-t border-slate-200 dark:border-slate-800/80 dark:border-slate-800 min-h-14 active:bg-slate-50 dark:active:bg-slate-800/40"
      >
        <div className="w-9 h-9 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
        </div>
        <span className="flex-1 text-left text-[14px] font-medium text-slate-900 dark:text-white">
          {doc.label}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden />
      </button>
    ))}
  </PreferencesCard>
);
