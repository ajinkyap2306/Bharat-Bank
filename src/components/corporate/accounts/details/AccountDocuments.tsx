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
      <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-3">Documents</h2>
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800/80 dark:divide-slate-800 shadow-sm">
        {docs.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => onSelect(doc.id)}
            className="w-full flex items-center gap-3 p-4 text-left min-h-14 active:bg-slate-50 dark:active:bg-slate-800/40"
          >
            <div className="w-9 h-9 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-congress-blue-700 dark:text-congress-blue-400" aria-hidden />
            </div>
            <span className="flex-1 text-[14px] font-medium text-slate-900 dark:text-white">
              {doc.title}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        ))}
      </div>
    </section>
  );
};
