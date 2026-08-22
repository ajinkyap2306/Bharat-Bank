import React from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import type { ApprovalDocument } from '../../../../types/corporateApprovalDetails';

interface SupportingDocumentsProps {
  documents: ApprovalDocument[];
  onView: (doc: ApprovalDocument) => void;
  onDownload: (doc: ApprovalDocument) => void;
}

export const SupportingDocuments: React.FC<SupportingDocumentsProps> = ({
  documents,
  onView,
  onDownload,
}) => {
  if (documents.length === 0) return null;

  return (
    <section className="mx-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
      <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white mb-3">
        Supporting Documents
      </h2>
      <ul className="space-y-3">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-congress-blue-700 dark:text-congress-blue-400 shrink-0" aria-hidden />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-900 dark:text-white truncate">
                  {doc.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.sizeLabel}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onView(doc)}
                className="px-3 py-2 rounded-lg text-[12px] font-medium text-congress-blue-700 dark:text-congress-blue-400 min-h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
              >
                <Eye className="w-4 h-4" aria-hidden />
                <span className="sr-only">View {doc.name}</span>
              </button>
              <button
                type="button"
                onClick={() => onDownload(doc)}
                className="px-3 py-2 rounded-lg text-[12px] font-medium text-congress-blue-700 dark:text-congress-blue-400 min-h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-congress-blue-500"
              >
                <Download className="w-4 h-4" aria-hidden />
                <span className="sr-only">Download {doc.name}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
