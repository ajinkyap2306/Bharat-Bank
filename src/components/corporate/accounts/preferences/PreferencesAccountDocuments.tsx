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
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white">Account Documents</h2>
    </div>
    {DOCUMENTS.map((doc) => (
      <button
        key={doc.id}
        type="button"
        onClick={() => onSelect(doc.id)}
        className="w-full flex items-center gap-3 px-4 py-3.5 border-t border-[#E4E7EC]/80 dark:border-slate-800 min-h-14 active:bg-slate-50 dark:active:bg-slate-800/40"
      >
        <div className="w-9 h-9 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
        </div>
        <span className="flex-1 text-left text-[14px] font-medium text-[#111827] dark:text-white">
          {doc.label}
        </span>
        <ChevronRight className="w-4 h-4 text-[#667085]" aria-hidden />
      </button>
    ))}
  </PreferencesCard>
);
