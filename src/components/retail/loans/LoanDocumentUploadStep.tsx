import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Lock,
  X
} from 'lucide-react';
import { LoanApplicationState, UploadedDocument } from './LoanFlowData';

interface LoanDocumentUploadStepProps {
  appState: LoanApplicationState;
  onUpdateDocuments: (docs: UploadedDocument[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const LoanDocumentUploadStep: React.FC<LoanDocumentUploadStepProps> = ({
  appState,
  onUpdateDocuments,
  onContinue,
  onBack
}) => {
  const [docs, setDocs] = useState<UploadedDocument[]>(appState.documents);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

  // Simulated upload action
  const handleUploadSimulate = (docId: string) => {
    // Set to uploading
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'uploading' } : d));

    setTimeout(() => {
      setDocs(prev => prev.map(d => {
        if (d.id === docId) {
          const names: Record<string, string> = {
            doc_income: 'SALARY_SLIPS_MAY_JUN_JUL.pdf',
            doc_stmt: 'APEX_BANK_6M_STATEMENT.pdf',
            doc_emp: 'WORK_ID_CARD_DIGITAL.png'
          };
          return {
            ...d,
            status: 'verified',
            fileName: names[docId] || `${d.name.replace(/\s+/g, '_')}.pdf`,
            fileSize: '1.8 MB',
            uploadedAt: 'Auto-Verified by DigiLocker'
          };
        }
        return d;
      }));
    }, 1200);
  };

  const handleRemoveDoc = (docId: string) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'not_uploaded', fileName: undefined, fileSize: undefined, uploadedAt: undefined } : d));
  };

  const handleProceed = () => {
    onUpdateDocuments(docs);
    onContinue();
  };

  const uploadedCount = docs.filter(d => d.status === 'uploaded' || d.status === 'verified').length;

  return (
    <div className="space-y-5 pb-24">
      {/* Header & Step Indicator */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
            Step 3 of 6: Document Upload
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Secure Digital Documents
          </h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div className="bg-blue-600 h-full w-3/6 rounded-full transition-all duration-300" />
      </div>

      {/* Status banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              DigiLocker & Account Aggregator Enabled
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {uploadedCount} of {docs.length} documents attached & verified
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl shadow-xs">
          {Math.round((uploadedCount / docs.length) * 100)}%
        </span>
      </div>

      {/* Document List Cards */}
      <div className="space-y-3">
        {docs.map((doc) => {
          const isDone = doc.status === 'uploaded' || doc.status === 'verified';
          const isUploading = doc.status === 'uploading';

          return (
            <div
              key={doc.id}
              className={`p-4 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
                  : isUploading
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800'
                  : 'bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : isUploading
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {doc.name}
                      </h4>
                      {isDone && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {doc.requiredFor}
                    </p>

                    {isDone && doc.fileName && (
                      <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500 font-mono">
                        <span className="truncate max-w-[150px]">{doc.fileName}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isDone ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUploadSimulate(doc.id)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        title="Replace Document"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : isUploading ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUploadSimulate(doc.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Autofill Helper CTA */}
      <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Want instant 1-click verification without manual uploads?
        </p>
        <button
          type="button"
          onClick={() => {
            setDocs(prev => prev.map(d => ({
              ...d,
              status: 'verified',
              fileName: `${d.name.replace(/\s+/g, '_')}_DIGILOCKER.pdf`,
              fileSize: '1.4 MB',
              uploadedAt: 'Auto-fetched via DigiLocker OTP'
            })));
          }}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          ⚡ Auto-Verify all via DigiLocker
        </button>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {previewDoc.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">{previewDoc.fileName}</p>
                  <p className="text-[10px] text-slate-400">{previewDoc.fileSize} • 256-bit Digital Encryption Stamp</p>
                </div>
                <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                  ✓ Verified against National Repository
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 max-w-xl mx-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>Review Application</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
