import React, { useState } from 'react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { ApprovalDelegation } from '../../../../types/corporateApprovals';
import { ApprovalCard, ReviewRow, StickyApprovalCTA } from '../shared/CorporateApprovalsUI';

const DELEGATE_USERS = [
  { id: 'u1', name: 'Rahul Sharma', role: 'Finance Executive' },
  { id: 'u2', name: 'Amit Verma', role: 'Finance Manager' },
  { id: 'u3', name: 'Priya Nair', role: 'HR & Payroll' },
];

const DELEGATE_CATEGORIES = ['Payments', 'Beneficiaries', 'Payroll', 'Users', 'Other'];

export const DelegationListScreen: React.FC<{
  delegations: ApprovalDelegation[];
  onBack: () => void;
  onCreate: () => void;
  onOpen: (id: string) => void;
}> = ({ delegations, onBack, onCreate, onOpen }) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-8">
    <ScreenHeader title="My Delegations" onBack={onBack} edgeToEdge={false} />
    <div className="px-3">
      <button type="button" onClick={onCreate} className="w-full py-3 rounded-xl bg-[#0B5CAB] text-white font-bold text-sm mb-3 min-h-11">
        Delegate Approval
      </button>
      {delegations.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-bold text-[#111827] dark:text-white">No active delegations</p>
        </div>
      ) : (
        delegations.map((d) => (
          <button key={d.id} type="button" onClick={() => onOpen(d.id)} className="w-full text-left mb-2">
            <ApprovalCard className="p-4">
              <p className="text-sm font-bold text-[#111827] dark:text-white">Delegated to: {d.delegateTo}</p>
              <p className="text-xs text-[#667085]">{d.startDate} – {d.endDate}</p>
              <p className="text-xs text-[#667085] mt-1">{d.categories.join(' + ')}</p>
              <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                d.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
              </span>
            </ApprovalCard>
          </button>
        ))
      )}
    </div>
  </div>
);

export const CreateDelegationScreen: React.FC<{
  onBack: () => void;
  onComplete: () => void;
}> = ({ onBack, onComplete }) => {
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('18 Aug');
  const [endDate, setEndDate] = useState('25 Aug');
  const [categories, setCategories] = useState<string[]>([]);

  const toggleCat = (c: string) => {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
      <ScreenHeader title="Delegate Approval" onBack={onBack} edgeToEdge={false} />
      <div className="px-3 space-y-4">
        <section>
          <p className="text-xs font-bold text-[#667085] uppercase mb-2">Select User</p>
          {DELEGATE_USERS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setUserId(u.id)}
              className={`w-full p-3 rounded-xl text-left mb-2 min-h-11 ${
                userId === u.id ? 'bg-[#0B5CAB]/10 border-2 border-[#0B5CAB]' : 'bg-white border border-slate-200'
              }`}
            >
              <p className="text-sm font-bold">{u.name}</p>
              <p className="text-xs text-[#667085]">{u.role}</p>
            </button>
          ))}
        </section>
        <section>
          <p className="text-xs font-bold text-[#667085] uppercase mb-2">Date Range</p>
          <div className="flex gap-2">
            <input value={startDate} onChange={(e) => setStartDate(e.target.value)} className="flex-1 p-3 rounded-xl border text-sm" placeholder="Start" />
            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} className="flex-1 p-3 rounded-xl border text-sm" placeholder="End" />
          </div>
        </section>
        <section>
          <p className="text-xs font-bold text-[#667085] uppercase mb-2">Approval Types</p>
          <div className="flex flex-wrap gap-2">
            {DELEGATE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCat(c)}
                className={`px-3 py-2 rounded-xl text-xs font-bold min-h-11 ${
                  categories.includes(c) ? 'bg-[#0B5CAB] text-white' : 'bg-slate-100 text-[#667085]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>
      </div>
      <StickyApprovalCTA
        label="Review Delegation"
        onClick={onComplete}
        disabled={!userId || categories.length === 0}
        secondaryLabel="Cancel"
        onSecondary={onBack}
      />
    </div>
  );
};

export const DelegationDetailScreen: React.FC<{
  delegation: ApprovalDelegation;
  onBack: () => void;
  onRevoke: () => void;
}> = ({ delegation, onBack, onRevoke }) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-24">
    <ScreenHeader title="Delegation Details" onBack={onBack} edgeToEdge={false} />
    <ApprovalCard className="p-4 mx-3">
      <ReviewRow label="Delegate To" value={delegation.delegateTo} />
      <ReviewRow label="Role" value={delegation.delegateToRole} />
      <ReviewRow label="Start" value={delegation.startDate} />
      <ReviewRow label="End" value={delegation.endDate} />
      <ReviewRow label="Categories" value={delegation.categories.join(', ')} />
      <ReviewRow label="Status" value={delegation.status} />
    </ApprovalCard>
    {delegation.status === 'active' && (
      <StickyApprovalCTA label="Revoke Delegation" onClick={onRevoke} variant="danger" secondaryLabel="Back" onSecondary={onBack} />
    )}
  </div>
);

export const RevokeSuccessScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => (
  <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full flex flex-col items-center justify-center p-6 pb-24">
    <h2 className="text-lg font-bold text-[#111827] dark:text-white">Delegation Revoked</h2>
    <StickyApprovalCTA label="Done" onClick={onDone} />
  </div>
);
