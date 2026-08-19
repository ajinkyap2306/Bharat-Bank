import React, { useState, useEffect } from 'react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { BENEFICIARY_TYPE_OPTIONS, findDuplicate } from '../../../../data/corporateBeneficiariesMock';
import { CorporateBeneficiaryForm } from '../../../../types/corporateBeneficiaries';
import { BenCard, ReviewBenRow, StickyBenCTA } from '../shared/CorporateBeneficiaryUI';

interface FlowProps {
  form: CorporateBeneficiaryForm;
  setForm: React.Dispatch<React.SetStateAction<CorporateBeneficiaryForm>>;
  onBack: () => void;
  onNext: (screen: string) => void;
}

export const AddTypeScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title="Beneficiary Type" subtitle="Add Corporate Beneficiary" onBack={onBack} edgeToEdge={false} />
    <div className="space-y-2">
      {BENEFICIARY_TYPE_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => { setForm((f) => ({ ...f, type: opt.id })); onNext('add-business'); }}
          className={`mx-3 w-[calc(100%-1.5rem)] p-4 rounded-2xl border text-left min-h-11 ${
            form.type === opt.id ? 'border-[#0B5CAB] bg-[#0B5CAB]/5' : 'bg-white dark:bg-slate-900 border-slate-200/80'
          }`}
        >
          <p className="text-sm font-bold text-[#111827] dark:text-white">{opt.label}</p>
          <p className="text-xs text-[#667085] mt-0.5">{opt.description}</p>
        </button>
      ))}
    </div>
    <StickyBenCTA label="Continue" onClick={() => onNext('add-business')} />
  </div>
);

export const AddBusinessScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => {
  const fields: { key: keyof CorporateBeneficiaryForm; label: string; placeholder: string }[] = [
    { key: 'name', label: 'Beneficiary Name', placeholder: 'ABC Suppliers Ltd.' },
    { key: 'companyName', label: 'Company Name', placeholder: 'ABC Suppliers Ltd.' },
    { key: 'contactPerson', label: 'Contact Person', placeholder: 'Rajesh Kumar' },
    { key: 'mobile', label: 'Mobile Number', placeholder: '+91 98200 44102' },
    { key: 'email', label: 'Email', placeholder: 'accounts@vendor.in' },
    { key: 'nickname', label: 'Beneficiary Nickname', placeholder: 'Office Supplies Vendor' },
  ];
  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Business Information" onBack={onBack} edgeToEdge={false} />
      <BenCard className="p-4 space-y-3">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-bold text-[#667085]">{label}</label>
            <input
              value={form[key] as string}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
        ))}
      </BenCard>
      <StickyBenCTA label="Continue" onClick={() => onNext('add-bank')} disabled={!form.name.trim()} />
    </div>
  );
};

export const AddBankScreen: React.FC<FlowProps> = ({ form, setForm, onBack, onNext }) => {
  const mismatch = form.accountNumber && form.confirmAccountNumber && form.accountNumber !== form.confirmAccountNumber;
  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Bank Details" onBack={onBack} edgeToEdge={false} />
      <BenCard className="p-4 space-y-3">
        {[
          { key: 'bankName' as const, label: 'Bank Name', placeholder: 'HDFC Bank' },
          { key: 'accountNumber' as const, label: 'Account Number', placeholder: '50200045829101' },
          { key: 'confirmAccountNumber' as const, label: 'Confirm Account Number', placeholder: '50200045829101' },
          { key: 'ifsc' as const, label: 'IFSC', placeholder: 'HDFC0000060' },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-bold text-[#667085]">{label}</label>
            <input
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-bold text-[#667085]">Account Type</label>
          <select
            value={form.accountType}
            onChange={(e) => setForm((f) => ({ ...f, accountType: e.target.value }))}
            className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm"
          >
            <option>Current</option>
            <option>Savings</option>
          </select>
        </div>
        {mismatch && <p className="text-xs text-[#DC2626] font-bold">Account numbers do not match</p>}
      </BenCard>
      <StickyBenCTA
        label="Verify Bank Details"
        onClick={() => onNext('verify')}
        disabled={!form.bankName || !form.accountNumber || !form.ifsc || !!mismatch}
      />
    </div>
  );
};

export const VerifyScreen: React.FC<FlowProps & { onVerified: () => void }> = ({ form, onBack, onVerified }) => {
  const [state, setState] = useState<'loading' | 'success' | 'failed'>('loading');
  const masked = form.accountNumber.length > 4 ? `••••${form.accountNumber.slice(-4)}` : form.accountNumber;

  useEffect(() => {
    const t = setTimeout(() => setState(form.accountNumber.startsWith('000') ? 'failed' : 'success'), 1800);
    return () => clearTimeout(t);
  }, [form.accountNumber]);

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24 flex flex-col items-center justify-center p-6">
      <ScreenHeader title="Verify Beneficiary" onBack={onBack} edgeToEdge={false} />
      <BenCard className="p-4 w-full mt-4">
        <ReviewBenRow label="Beneficiary name" value={form.name} />
        <ReviewBenRow label="Bank" value={form.bankName} />
        <ReviewBenRow label="Account" value={masked} />
        <ReviewBenRow label="IFSC" value={form.ifsc} />
        <ReviewBenRow label="Account type" value={form.accountType} />
      </BenCard>
      {state === 'loading' && (
        <div className="mt-6 text-center">
          <div className="w-10 h-10 border-2 border-[#0B5CAB] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-[#111827] dark:text-white mt-3">Verifying Bank Details...</p>
        </div>
      )}
      {state === 'success' && (
        <div className="mt-6 text-center w-full">
          <p className="text-base font-bold text-[#16A34A]">Beneficiary Details Verified</p>
          <button type="button" onClick={onVerified} className="mt-4 w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11">Continue</button>
        </div>
      )}
      {state === 'failed' && (
        <div className="mt-6 text-center w-full">
          <p className="text-base font-bold text-[#DC2626]">Unable to verify beneficiary</p>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onBack} className="flex-1 py-3 rounded-2xl border font-bold text-sm min-h-11">Edit Details</button>
            <button type="button" onClick={() => setState('loading')} className="flex-1 py-3 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11">Try Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const DuplicateScreen: React.FC<FlowProps & { onViewExisting: (id: string) => void }> = ({
  form,
  onBack,
  onNext,
  onViewExisting,
}) => {
  const dup = findDuplicate(form.name, form.accountNumber.slice(-4));
  if (!dup) {
    onNext('review');
    return null;
  }
  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Possible Duplicate" onBack={onBack} edgeToEdge={false} />
      <BenCard className="p-4">
        <p className="text-sm font-bold text-[#111827] dark:text-white">Possible Duplicate Beneficiary</p>
        <p className="text-sm text-[#667085] mt-2">{dup.name}</p>
        <p className="text-xs text-[#667085]">Already exists with A/C {dup.maskedAccount}</p>
      </BenCard>
      <StickyBenCTA
        label="Continue Anyway"
        onClick={() => onNext('review')}
        secondaryLabel="View Existing"
        onSecondary={() => onViewExisting(dup.id)}
      />
    </div>
  );
};

export const ReviewScreen: React.FC<FlowProps & { onSubmit: () => void }> = ({ form, onBack, onNext, onSubmit }) => {
  const masked = form.accountNumber.length > 4 ? `••••${form.accountNumber.slice(-4)}` : form.accountNumber;
  const typeLabel = BENEFICIARY_TYPE_OPTIONS.find((o) => o.id === form.type)?.label || form.type;
  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Review Beneficiary" onBack={onBack} edgeToEdge={false} />
      <BenCard className="p-4">
        <p className="text-[10px] font-bold text-[#667085] uppercase mb-2">Business Details</p>
        <ReviewBenRow label="Name" value={form.name} onEdit={() => onNext('add-business')} />
        <ReviewBenRow label="Type" value={typeLabel} />
        <ReviewBenRow label="Company" value={form.companyName} />
        <ReviewBenRow label="Contact" value={`${form.contactPerson} • ${form.mobile}`} />
      </BenCard>
      <BenCard className="p-4 mt-4">
        <p className="text-[10px] font-bold text-[#667085] uppercase mb-2">Bank Details</p>
        <ReviewBenRow label="Bank" value={form.bankName} onEdit={() => onNext('add-bank')} />
        <ReviewBenRow label="Account" value={masked} />
        <ReviewBenRow label="IFSC" value={form.ifsc} />
        <ReviewBenRow label="Account type" value={form.accountType} />
      </BenCard>
      <BenCard className="p-4 mt-4">
        <ReviewBenRow label="Nickname" value={form.nickname} />
        <ReviewBenRow label="Email" value={form.email} />
      </BenCard>
      <StickyBenCTA label="Submit for Approval" onClick={onSubmit} />
    </div>
  );
};

export const AuthScreen: React.FC<{ title: string; onBack: () => void; onConfirm: () => void }> = ({
  title,
  onBack,
  onConfirm,
}) => {
  const [mpin, setMpin] = useState('');
  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title={title} onBack={onBack} edgeToEdge={false} />
      <BenCard className="p-4">
        <p className="text-sm text-[#667085] mb-3">Enter MPIN to confirm this action.</p>
        <input
          type="password"
          maxLength={6}
          value={mpin}
          onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter MPIN"
          className="w-full p-3 rounded-xl border text-center text-lg tracking-widest font-mono"
        />
      </BenCard>
      <StickyBenCTA label="Authenticate" onClick={onConfirm} disabled={mpin.length < 4} />
    </div>
  );
};

export const SubmittedScreen: React.FC<{
  beneficiaryId: string;
  name: string;
  submittedBy: string;
  onDone: () => void;
}> = ({ beneficiaryId, name, submittedBy, onDone }) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full flex flex-col items-center p-6 text-center pb-24">
    <div className="w-16 h-16 rounded-full bg-amber-100 text-[#F59E0B] flex items-center justify-center text-2xl mb-4">✓</div>
    <h2 className="text-lg font-bold">Beneficiary Submitted for Approval</h2>
    <BenCard className="p-4 mt-4 w-full text-left">
      <ReviewBenRow label="Beneficiary ID" value={beneficiaryId} />
      <ReviewBenRow label="Name" value={name} />
      <ReviewBenRow label="Submitted by" value={submittedBy} />
      <ReviewBenRow label="Status" value="Pending Approval" />
    </BenCard>
    <StickyBenCTA label="Done" onClick={onDone} />
  </div>
);

export const ActivatedScreen: React.FC<{ beneficiaryId: string; onMakePayment: () => void; onDone: () => void }> = ({
  beneficiaryId,
  onMakePayment,
  onDone,
}) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full flex flex-col items-center p-6 text-center pb-28">
    <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center text-2xl mb-4">✓</div>
    <h2 className="text-lg font-bold">Beneficiary Activated</h2>
    <BenCard className="p-4 mt-4 w-full text-left">
      <ReviewBenRow label="Beneficiary ID" value={beneficiaryId} />
      <ReviewBenRow label="Activation date" value="18 Aug 2026" />
      <ReviewBenRow label="Status" value="Active" />
    </BenCard>
    <div className="fixed bottom-0 left-0 right-0 p-3 flex gap-2 bg-[#F7F9FC]/95 backdrop-blur-md border-t">
      <button type="button" onClick={onDone} className="flex-1 py-3.5 rounded-2xl border font-bold text-sm min-h-11">Done</button>
      <button type="button" onClick={onMakePayment} className="flex-1 py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11">Make Payment</button>
    </div>
  </div>
);
