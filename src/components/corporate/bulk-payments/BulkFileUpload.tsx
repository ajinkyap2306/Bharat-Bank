import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { PayCard } from '../payments/shared/CorporatePaymentsUI';

interface BulkFileUploadProps {
  fileName?: string;
  recordCount?: number;
  status?: 'idle' | 'processing' | 'done';
  onChooseFile: (file: File) => void;
  onDownloadTemplate: () => void;
}

export const BulkFileUpload: React.FC<BulkFileUploadProps> = ({
  fileName,
  recordCount,
  status = 'idle',
  onChooseFile,
  onDownloadTemplate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <PayCard className="p-4">
      <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-1">
        Upload Payment File
      </h3>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4">
        Supported: CSV • Max 500 payment records
      </p>

      {status === 'idle' && !fileName && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="sr-only"
            aria-label="Choose payment file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChooseFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm min-h-11"
          >
            <Upload className="w-4 h-4" aria-hidden />
            Choose File
          </button>
          <button
            type="button"
            onClick={onDownloadTemplate}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 font-semibold text-sm text-congress-blue-700 dark:text-congress-blue-400 min-h-11"
          >
            <Download className="w-4 h-4" aria-hidden />
            Download Sample File
          </button>
        </>
      )}

      {fileName && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-slate-500 dark:text-slate-400">File Name</span>
            <span className="font-medium text-slate-900 dark:text-white text-right break-all max-w-[60%]">
              {fileName}
            </span>
          </div>
          {recordCount !== undefined && (
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500 dark:text-slate-400">Records</span>
              <span className="font-semibold text-slate-900 dark:text-white">{recordCount}</span>
            </div>
          )}
          <div className="flex justify-between text-[13px]">
            <span className="text-slate-500 dark:text-slate-400">Status</span>
            <span className="font-semibold text-congress-blue-700 dark:text-congress-blue-400">
              {status === 'processing' ? 'Processing' : status === 'done' ? 'Validated' : 'Uploaded'}
            </span>
          </div>
        </div>
      )}
    </PayCard>
  );
};
