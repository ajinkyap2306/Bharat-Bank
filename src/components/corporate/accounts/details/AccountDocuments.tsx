import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { CORPORATE_ACCOUNT_DOCUMENTS } from '../../../../data/corporateAccountsMock';

interface AccountDocumentsProps {
  onSelect: (documentId: string) => void;
}

export const AccountDocuments: React.FC<AccountDocumentsProps> = ({ onSelect }) => {
  const docs = CORPORATE_ACCOUNT_DOCUMENTS.slice(0, 3);

  return (
    <section className="px-4" aria-label="Documents">
      <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-3">Documents</h2>
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 divide-y divide-[#E4E7EC]/80 dark:divide-slate-800 shadow-sm">
        {docs.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelect(doc.id)}
            className="w-full flex items-center gap-3 p-4 text-left min-h-14 active:bg-slate-50 dark:active:bg-slate-800/40"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0B5CAB]/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#0B5CAB]" aria-hidden />
            </div>
            <span className="flex-1 text-[14px] font-medium text-[#111827] dark:text-white">
              {doc.title}
            </span>
            <ChevronRight className="w-4 h-4 text-[#667085]" />
          </button>
        ))}
      </div>
    </section>
  );
};
