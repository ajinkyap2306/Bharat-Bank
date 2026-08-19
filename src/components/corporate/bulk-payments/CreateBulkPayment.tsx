import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, UserPlus } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { useCorporateMakerGate } from '../../../hooks/useCorporateMakerGate';
import { clonePreferences } from '../../../data/corporateAccountPreferencesMock';
import {
  addManualPayment,
  clearBulkBatchDraft,
  clearValidationErrors,
  createEmptyBatch,
  createValidatedDemoBatch,
  getAccountById,
  getEligibleAccounts,
  loadBulkBatchDraft,
  removePayment,
  removeValidationError,
  resolveDuplicate,
  saveBulkBatchDraft,
  simulateFileValidation,
} from '../../../data/corporateBulkPaymentsMock';
import type { BulkBatch, BulkUploadState } from '../../../types/corporateBulkPayments';
import { BottomSheet } from '../../common/BottomSheet';
import { BulkPaymentsHeader } from './BulkPaymentsHeader';
import { BulkAccountSelector } from './BulkAccountSelector';
import { BatchDetailsForm } from './BatchDetailsForm';
import { BulkFileUpload } from './BulkFileUpload';
import { FileProcessingState } from './FileProcessingState';
import { BatchValidationSummary } from './BatchValidationSummary';
import { ValidationErrors } from './ValidationErrors';
import { DuplicatePayments } from './DuplicatePayments';
import { ValidPayments } from './ValidPayments';
import { BatchSummary } from './BatchSummary';
import { BatchLimitCheck } from './BatchLimitCheck';
import { BatchSizeIndicator } from './BatchSizeIndicator';
import { ApprovalRequirementCard } from './ApprovalRequirementCard';
import { BulkPaymentEmptyState } from './BulkPaymentEmptyState';
import { BulkPaymentErrorState } from './BulkPaymentErrorState';
import { ManualPaymentEntry } from './ManualPaymentEntry';
import { RemovePaymentSheet } from './RemovePaymentSheet';
import { formatPaymentCurrency } from '../payments/shared/CorporatePaymentsUI';
import {
  createSampleBulkPaymentFile,
  downloadBulkPaymentTemplate,
} from '../../../utils/bulkPaymentTemplate';

export const CreateBulkPayment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast, setBottomNavHidden, openDetailFlow, closeDetailFlow } = useBanking();
  const { blockBulkIfChecker } = useCorporateMakerGate();

  useEffect(() => {
    if (blockBulkIfChecker()) {
      navigate('/corporate/bulk-payments', { replace: true });
    }
  }, [blockBulkIfChecker, navigate]);

  const isUploadAction = searchParams.get('action') === 'upload';
  const isValidatedDemo = searchParams.get('demo') === 'validated';

  const [batch, setBatch] = useState<BulkBatch>(() => {
    if (isValidatedDemo) return createValidatedDemoBatch();
    if (isUploadAction) {
      clearBulkBatchDraft();
      return createEmptyBatch();
    }
    return loadBulkBatchDraft() ?? createEmptyBatch();
  });
  const [uploadState, setUploadState] = useState<BulkUploadState>(() =>
    isValidatedDemo ? 'validated' : 'idle'
  );
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [autoUpload, setAutoUpload] = useState(isUploadAction);

  const hideBalance = clonePreferences(batch.accountId)?.hideBalance ?? false;
  const account = getAccountById(batch.accountId)!;
  const eligibleAccounts = getEligibleAccounts();
  const isValidated = uploadState === 'validated' && batch.paymentCount > 0;

  useEffect(() => {
    setBottomNavHidden(true);
    openDetailFlow();
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  useEffect(() => {
    saveBulkBatchDraft(batch);
  }, [batch]);

  const pendingDuplicates = batch.duplicates.filter((d) => d.resolution === 'pending').length;
  const balanceAfter = account.availableBalance - batch.totalDebit;
  const limitRemaining = batch.limits.dailyLimit - batch.limits.usedToday - batch.totalAmount;
  const sizeExceeded = batch.paymentCount > batch.limits.maxBatchSize;

  const blockReason = useMemo(() => {
    if (!batch.name.trim()) return 'Enter a batch name to continue.';
    if (batch.errorCount > 0) return `Resolve ${batch.errorCount} errors before continuing.`;
    if (pendingDuplicates > 0) return 'Review possible duplicate payments before continuing.';
    if (balanceAfter < 0) return 'Insufficient balance for this batch.';
    if (limitRemaining < 0) return 'Bulk payment limit exceeded.';
    if (sizeExceeded) return 'Maximum batch size exceeded.';
    if (!isValidated) return 'Upload or add payments to continue.';
    return null;
  }, [batch, pendingDuplicates, balanceAfter, limitRemaining, sizeExceeded, isValidated]);

  const canReview = !blockReason;

  const updateBatch = useCallback((updater: (b: BulkBatch) => BulkBatch) => {
    setBatch((prev) => updater(prev));
  }, []);

  const handleBack = () => navigate('/corporate/bulk-payments');

  const handleCopyReference = async () => {
    await navigator.clipboard.writeText(batch.reference);
    addToast({ type: 'success', title: 'Batch reference copied', message: '' });
  };

  const handleChooseFile = async (file: File) => {
    if (file.size === 0) {
      setUploadState('upload_failed');
      return;
    }
    setUploadState('uploading');
    await new Promise((r) => setTimeout(r, 1200));
    setUploadState('processing');
    await new Promise((r) => setTimeout(r, 1500));
    setBatch((prev) =>
      simulateFileValidation(
        { ...prev, name: prev.name || 'August Vendor Payments' },
        { withErrors: isValidatedDemo }
      )
    );
    setUploadState('validated');
  };

  const handleDownloadTemplate = async () => {
    await downloadBulkPaymentTemplate();
    addToast({
      type: 'success',
      title: 'Sample file downloaded',
      message: 'Use this CSV format for bulk uploads.',
    });
  };

  useEffect(() => {
    if (autoUpload && uploadState === 'idle') {
      setAutoUpload(false);
      handleChooseFile(createSampleBulkPaymentFile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReview = () => {
    if (!canReview) return;
    saveBulkBatchDraft({ ...batch, status: 'ready_for_review' });
    navigate(`/corporate/bulk-payments/${batch.id}/review`);
  };

  const handleDuplicateReview = (id: string) => {
    const dup = batch.duplicates.find((d) => d.id === id);
    if (dup) {
      navigate(`/corporate/payments/${dup.similarPaymentId}`);
    }
  };

  return (
    <div className="min-h-full bg-[#F7F9FC] dark:bg-slate-950 max-w-[430px] mx-auto">
      <BulkPaymentsHeader title="New Payment Batch" onBack={handleBack} showMore={false} />

      <main className="space-y-4 pt-4 pb-36">
        <BulkAccountSelector
          account={account}
          hideBalance={hideBalance}
          onSelect={() => setShowAccountSheet(true)}
        />

        <BatchDetailsForm
          batch={batch}
          onChange={(field, value) => updateBatch((b) => ({ ...b, [field]: value }))}
          onCopyReference={handleCopyReference}
        />

        {uploadState === 'uploading' && (
          <FileProcessingState message="Uploading payment file..." />
        )}
        {uploadState === 'processing' && (
          <FileProcessingState message="Validating payments..." />
        )}
        {uploadState === 'upload_failed' && (
          <BulkPaymentErrorState
            title="Unable to upload file"
            message="Check the file format and try again."
            onRetry={() => setUploadState('idle')}
          />
        )}
        {uploadState === 'validation_failed' && (
          <BulkPaymentErrorState
            title="Unable to validate batch"
            message="Validation could not be completed."
            onRetry={() => setUploadState('processing')}
            retryLabel="Retry Validation"
          />
        )}

        {!isValidated && uploadState === 'idle' && batch.paymentCount === 0 && (
          <>
            <BulkPaymentEmptyState
              onUpload={() => document.getElementById('bulk-file-input')?.click()}
              onAddManual={() => setShowManual(true)}
              onDownloadSample={handleDownloadTemplate}
            />
            <div className="hidden">
              <BulkFileUpload
                onChooseFile={handleChooseFile}
              onDownloadTemplate={handleDownloadTemplate}
              />
            </div>
            <input
              id="bulk-file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleChooseFile(f);
              }}
            />
          </>
        )}

        {!isValidated && uploadState === 'idle' && batch.paymentCount > 0 && (
          <div className="px-4 flex gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('bulk-file-input-2')?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11"
            >
              <Upload className="w-4 h-4" aria-hidden />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setShowManual(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border font-bold text-sm min-h-11"
            >
              <UserPlus className="w-4 h-4" aria-hidden />
              Add Manually
            </button>
            <input
              id="bulk-file-input-2"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleChooseFile(f);
              }}
            />
          </div>
        )}

        {isValidated && (
          <>
            <BulkFileUpload
              fileName={batch.uploadFileName}
              recordCount={batch.paymentCount}
              status="done"
              onChooseFile={handleChooseFile}
              onDownloadTemplate={handleDownloadTemplate}
            />
            <BatchValidationSummary batch={batch} />
            <ValidationErrors
              errors={batch.errors}
              onRemoveError={(row) => updateBatch((b) => removeValidationError(b, row))}
              onClearAll={() => updateBatch((b) => clearValidationErrors(b))}
            />
            <DuplicatePayments
              duplicates={batch.duplicates}
              onReview={handleDuplicateReview}
              onRemove={(id) => updateBatch((b) => resolveDuplicate(b, id, 'removed'))}
              onKeep={(id) => updateBatch((b) => resolveDuplicate(b, id, 'kept'))}
            />
            <ValidPayments
              payments={batch.payments}
              totalValid={batch.validCount}
              canEdit
              onEdit={() => addToast({ type: 'info', title: 'Edit payment', message: 'Edit form opened.' })}
              onRemove={(id) => setRemoveId(id)}
            />
            <BatchSummary batch={batch} account={account} hideBalance={hideBalance} />
            <BatchLimitCheck batch={batch} />
            <BatchSizeIndicator batch={batch} />
            <ApprovalRequirementCard batch={batch} />
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 pb-safe bg-[#F7F9FC]/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-[#E4E7EC] dark:border-slate-800">
        <div className="max-w-[430px] mx-auto">
          {blockReason && isValidated && (
            <p className="text-[12px] text-[#DC2626] text-center mb-2 font-medium">{blockReason}</p>
          )}
          <button
            type="button"
            onClick={handleReview}
            disabled={!canReview}
            className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm disabled:opacity-50 min-h-11"
          >
            Review Batch
          </button>
        </div>
      </div>

      <BottomSheet isOpen={showAccountSheet} onClose={() => setShowAccountSheet(false)} title="Select Account">
        <div className="px-4 pb-6 space-y-2">
          {eligibleAccounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => {
                updateBatch((b) => ({ ...b, accountId: acc.id }));
                setShowAccountSheet(false);
              }}
              className={`w-full text-left p-4 rounded-xl border min-h-11 ${
                acc.id === batch.accountId
                  ? 'border-[#0B5CAB] bg-blue-50/50'
                  : 'border-[#E4E7EC] dark:border-slate-700'
              }`}
            >
              <p className="font-semibold text-[14px]">{acc.name}</p>
              <p className="text-[12px] text-[#667085] font-mono">{acc.maskedNumber}</p>
              <p className="text-[12px] text-[#667085] mt-1">
                {hideBalance ? '••••••' : formatPaymentCurrency(acc.availableBalance, acc.currency)}
              </p>
            </button>
          ))}
        </div>
      </BottomSheet>

      <ManualPaymentEntry
        isOpen={showManual}
        onClose={() => setShowManual(false)}
        onSave={(payment) => {
          updateBatch((b) =>
            addManualPayment(b, {
              ...payment,
              paymentType: 'Vendor Payment',
              rowNumber: b.payments.length + 1,
            })
          );
          addToast({ type: 'success', title: 'Payment added', message: 'Added to batch.' });
        }}
      />

      <RemovePaymentSheet
        isOpen={Boolean(removeId)}
        beneficiary={batch.payments.find((p) => p.id === removeId)?.beneficiary ?? ''}
        onClose={() => setRemoveId(null)}
        onConfirm={() => {
          if (removeId) {
            updateBatch((b) => removePayment(b, removeId));
            setRemoveId(null);
            addToast({ type: 'info', title: 'Payment removed', message: '' });
          }
        }}
      />
    </div>
  );
};
