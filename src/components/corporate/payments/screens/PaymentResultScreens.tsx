import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Share2, CheckCircle2 } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { useBanking } from '../../../../context/BankingContext';
import { CorporatePaymentRecord } from '../../../../types/corporatePayments';
import { PayCard, PaymentStatusBadge, formatPaymentCurrency } from '../shared/CorporatePaymentsUI';
import { StickyPayCTA } from '../shared/CorporatePaymentsUI';

interface AuthScreenProps {
  title: string;
  onBack: () => void;
  onConfirm: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ title, onBack, onConfirm }) => {
  const [mpin, setMpin] = useState('');
  const [otp, setOtp] = useState('');
  const [method, setMethod] = useState<'mpin' | 'otp' | 'biometric'>('mpin');

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title={title} onBack={onBack} edgeToEdge={false} />
      <PayCard className="p-4 space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Authenticate to authorize this payment.</p>
        <div className="flex gap-2">
          {(['mpin', 'otp', 'biometric'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize ${
                method === m ? 'bg-congress-blue-700 text-white' : 'bg-slate-100 text-slate-500 dark:text-slate-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {method === 'mpin' && (
          <input
            type="password"
            maxLength={6}
            value={mpin}
            onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter MPIN"
            className="w-full p-3 rounded-xl border text-center text-lg tracking-widest font-mono"
          />
        )}
        {method === 'otp' && (
          <input
            type="password"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter OTP"
            className="w-full p-3 rounded-xl border text-center text-lg tracking-widest font-mono"
          />
        )}
        {method === 'biometric' && (
          <button type="button" className="w-full py-4 rounded-xl border border-dashed text-sm font-bold text-congress-blue-700 dark:text-congress-blue-400">
            Use Biometric Authentication
          </button>
        )}
      </PayCard>
      <StickyPayCTA
        label="Authorize"
        onClick={onConfirm}
        disabled={method === 'mpin' ? mpin.length < 4 : method === 'otp' ? otp.length < 6 : false}
      />
    </div>
  );
};

export const ProcessingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const steps = [
    { label: 'Payment Submitted', done: true },
    { label: 'Authorization Verified', done: true },
    { label: 'Bank Processing', done: false, active: true },
    { label: 'Beneficiary Processing', done: false },
    { label: 'Completed', done: false },
  ];

  useEffect(() => {
    const t = setTimeout(onComplete, 2500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center justify-center p-6">
      <div className="space-y-4 w-full max-w-xs">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              s.done ? 'bg-emerald-600 text-white' : s.active ? 'bg-congress-blue-700 text-white animate-pulse' : 'bg-slate-200 text-slate-400'
            }`}>
              {s.done ? '✓' : s.active ? '●' : '○'}
            </div>
            <span className={`text-sm ${s.active ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ResultScreenProps {
  payment: Partial<CorporatePaymentRecord>;
  onDone: () => void;
  onTrack?: () => void;
  onSaveTemplate?: () => void;
}

export const SubmittedScreen: React.FC<ResultScreenProps> = ({ payment, onDone, onTrack }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full flex flex-col items-center p-6 text-center pb-24">
    <div className="w-16 h-16 rounded-full bg-amber-100 text-[#F59E0B] flex items-center justify-center mb-4">
      <CheckCircle2 className="w-8 h-8" />
    </div>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Submitted for Approval</h2>
    <PayCard className="p-4 mt-4 w-full text-left">
      <Info label="Payment ID" value={payment.paymentId || ''} />
      <Info label="Amount" value={formatPaymentCurrency(payment.amount || 0)} />
      <Info label="Beneficiary" value={payment.beneficiaryName || ''} />
      <Info label="Submitted by" value={payment.submittedBy || ''} />
      <Info label="Status" value="Pending Approval" />
    </PayCard>
    <div className="fixed bottom-0 left-0 right-0 p-3 flex gap-2">
      {onTrack && (
        <button type="button" onClick={onTrack} className="flex-1 py-3.5 rounded-2xl border font-bold text-sm min-h-11">Track Payment</button>
      )}
      <button type="button" onClick={onDone} className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm min-h-11">Done</button>
    </div>
  </div>
);

export const SuccessScreen: React.FC<ResultScreenProps> = ({ payment, onDone, onSaveTemplate }) => {
  const { addToast } = useBanking();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full p-6 text-center pb-28">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment Completed Successfully</h2>
      <PayCard className="p-4 mt-4 text-left">
        <Info label="Payment ID" value={payment.paymentId || ''} />
        <Info label="Transaction ID" value={payment.transactionId || ''} />
        <Info label="Beneficiary" value={payment.beneficiaryName || ''} />
        <Info label="Amount" value={formatPaymentCurrency(payment.amount || 0)} />
        <Info label="Debit Account" value={payment.debitAccountLabel || ''} />
        <Info label="Reference" value={payment.reference || ''} />
      </PayCard>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button type="button" onClick={() => addToast({ type: 'success', title: 'Receipt Downloaded', message: 'Payment receipt saved.' })} className="py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1 min-h-11">
          <Download className="w-4 h-4" /> Download
        </button>
        <button type="button" onClick={() => addToast({ type: 'info', title: 'Shared', message: 'Receipt link copied.' })} className="py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1 min-h-11">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
      {onSaveTemplate && (
        <button type="button" onClick={onSaveTemplate} className="mt-3 text-sm font-bold text-congress-blue-700 dark:text-congress-blue-400">Save this payment as a template?</button>
      )}
      <StickyPayCTA label="Done" onClick={onDone} />
    </motion.div>
  );
};

export const PaymentDetailScreen: React.FC<{
  payment: CorporatePaymentRecord;
  onBack: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  canApprove?: boolean;
}> = ({ payment, onBack, onApprove, onReject, canApprove }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title="Payment Details" onBack={onBack} edgeToEdge={false} />
    <PayCard className="p-4 text-center mb-4">
      <p className="text-2xl font-bold font-mono">{formatPaymentCurrency(payment.amount)}</p>
      <div className="mt-2 flex justify-center"><PaymentStatusBadge status={payment.status} /></div>
    </PayCard>
    <PayCard className="p-4">
      <Info label="Payment ID" value={payment.paymentId} />
      <Info label="Beneficiary" value={payment.beneficiaryName} />
      <Info label="Type" value={payment.typeLabel} />
      <Info label="Debit Account" value={payment.debitAccountLabel} />
      <Info label="Purpose" value={payment.purpose} />
      <Info label="Reference" value={payment.reference} />
      <Info label="Submitted by" value={payment.submittedBy} />
      {payment.approvedBy && <Info label="Approved by" value={payment.approvedBy} />}
      {payment.rejectedBy && <Info label="Rejected by" value={payment.rejectedBy} />}
      {payment.rejectionReason && <Info label="Reason" value={payment.rejectionReason} />}
      {payment.failureReason && <Info label="Failure reason" value={payment.failureReason} />}
    </PayCard>
    {payment.approvalLevels && payment.approvalLevels.length > 0 && (
      <PayCard className="p-4 mt-4">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Approval Required — 2 approvals</p>
        {payment.approvalLevels.map((l) => (
          <div key={l.level} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-xs font-bold">Level {l.level}</p>
              <p className="text-sm">{l.name}</p>
            </div>
            <span className={`text-xs font-bold ${l.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#F59E0B]'}`}>
              {l.status === 'approved' ? '✓ Approved' : '● Pending'}
            </span>
          </div>
        ))}
      </PayCard>
    )}
    {canApprove && payment.status === 'Pending Approval' && (
      <div className="fixed bottom-0 left-0 right-0 p-3 flex gap-2 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-t">
        <button type="button" onClick={onReject} className="flex-1 py-3.5 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm min-h-11">Reject</button>
        <button type="button" onClick={onApprove} className="flex-1 py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm min-h-11">Approve</button>
      </div>
    )}
  </div>
);

export const ApproveConfirmScreen: React.FC<{
  payment: CorporatePaymentRecord;
  onBack: () => void;
  onConfirm: () => void;
}> = ({ payment, onBack, onConfirm }) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title="Approve Payment?" onBack={onBack} edgeToEdge={false} />
    <PayCard className="p-4">
      <Info label="Beneficiary" value={payment.beneficiaryName} />
      <Info label="Amount" value={formatPaymentCurrency(payment.amount)} />
      <Info label="Debit Account" value={payment.debitAccountLabel} />
      <Info label="Purpose" value={payment.purpose} />
      <Info label="Payment ID" value={payment.paymentId} />
    </PayCard>
    <StickyPayCTA label="Approve Payment" onClick={onConfirm} />
  </div>
);

export const RejectReasonScreen: React.FC<{
  onBack: () => void;
  onConfirm: (reason: string) => void;
}> = ({ onBack, onConfirm }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Reject Payment" onBack={onBack} edgeToEdge={false} />
      <PayCard className="p-4">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Invoice details require correction."
          rows={4}
          className="w-full mt-1 p-3 rounded-xl border text-sm"
        />
      </PayCard>
      <StickyPayCTA label="Confirm Rejection" onClick={() => onConfirm(reason)} disabled={!reason.trim()} />
    </div>
  );
};

export const SaveTemplateScreen: React.FC<{
  onBack: () => void;
  onSave: (name: string) => void;
}> = ({ onBack, onSave }) => {
  const [name, setName] = useState('Monthly Vendor Payment');
  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Save Template" onBack={onBack} edgeToEdge={false} />
      <PayCard className="p-4">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Template Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-3 rounded-xl border text-sm" />
      </PayCard>
      <StickyPayCTA label="Save Template" onClick={() => onSave(name)} />
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 text-sm">
    <span className="text-slate-500 dark:text-slate-400">{label}</span>
    <span className="font-medium text-slate-900 dark:text-white text-right">{value}</span>
  </div>
);
