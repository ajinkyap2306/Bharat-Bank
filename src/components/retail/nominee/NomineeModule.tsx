import React, { useState } from 'react';
import { CheckCircle2, UserRound, Users } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { NumericPinInput } from '../../common/NumericPinInput';

type Step = 'list' | 'edit' | 'otp' | 'success';

export const NomineeModule: React.FC = () => {
  const {
    accounts,
    updateAccountNominees,
    personalInfo,
    addToast,
    setRetailTab,
    setBottomNavHidden,
  } = useBanking();

  const [step, setStep] = useState<Step>('list');
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [allocation, setAllocation] = useState('100');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  const eligible = accounts.filter((a) =>
    ['Savings', 'Current', 'NRE Savings', 'Fixed Deposit', 'BDD'].includes(a.accountType)
  );
  const account = eligible.find((a) => a.id === accountId) ?? eligible[0];

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const startEdit = (accId: string) => {
    const acc = eligible.find((a) => a.id === accId);
    const nom = acc?.nominees?.[0];
    setAccountId(accId);
    setName(nom?.name ?? '');
    setRelationship(nom?.relationship ?? '');
    setAllocation(String(nom?.allocation ?? 100));
    setDob(nom?.dateOfBirth ?? '');
    setStep('edit');
  };

  const handleOtpContinue = () => {
    if (otp.replace(/\s/g, '').length < 6) {
      addToast({ type: 'error', title: 'Invalid OTP', message: 'Enter the 6-digit OTP.' });
      return;
    }
    setShowAuth(true);
  };

  const submitNominee = () => {
    if (!name.trim() || !relationship.trim()) {
      addToast({ type: 'error', title: 'Incomplete', message: 'Fill nominee name and relationship.' });
      return;
    }
    const alloc = Number(allocation);
    if (alloc < 1 || alloc > 100) {
      addToast({ type: 'error', title: 'Invalid allocation', message: 'Allocation must be 1–100%.' });
      return;
    }
    updateAccountNominees(accountId, [
      { name: name.trim(), relationship: relationship.trim(), allocation: alloc, dateOfBirth: dob || undefined },
    ]);
    setShowAuth(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 -mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Nominee Updated</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-xs">
          Nominee details for {account?.maskedNumber} have been updated. Changes reflect within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setRetailTab('services')}
          className="mt-8 w-full max-w-sm py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader
        title="Nominee & Joint Holders"
        subtitle="View registered nominees and joint account holders"
        onBack={() => (step === 'list' ? setRetailTab('services') : setStep('list'))}
      />

      <div className="pt-3 pb-6 space-y-3">
        {step === 'list' && (
          <>
            {eligible.map((acc) => (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-sm font-bold">{acc.nickname || acc.accountType}</p>
                    <p className="text-xs text-slate-500 font-mono">{acc.maskedNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(acc.id)}
                    className="text-xs font-bold text-blue-600"
                  >
                    {acc.nominees?.length ? 'Amend' : 'Add'}
                  </button>
                </div>
                {acc.nominees?.length ? (
                  acc.nominees.map((n, i) => (
                    <div key={i} className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Nominee</p>
                        <p className="text-sm font-semibold">{n.name}</p>
                        <p className="text-xs text-slate-500">
                          {n.relationship} • {n.allocation}% allocation
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-amber-600 mt-2">No nominee registered</p>
                )}
                {acc.jointHolders?.length ? (
                  acc.jointHolders.map((holder, i) => (
                    <div key={`joint-${i}`} className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <UserRound className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Joint Holder</p>
                        <p className="text-sm font-semibold">{holder.name}</p>
                        <p className="text-xs text-slate-500">
                          {holder.relationship}
                          {holder.panMasked ? ` • PAN ${holder.panMasked}` : ''}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 mt-2">No joint holders on this account</p>
                )}
              </div>
            ))}
          </>
        )}

        {step === 'edit' && (
          <div className="space-y-3 px-1">
            <p className="text-xs text-slate-500">
              Updating nominee for {account?.maskedNumber}. OTP will be sent to {personalInfo.mobile}.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nominee full name"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Relationship"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
            <input
              value={allocation}
              onChange={(e) => setAllocation(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="Allocation %"
              inputMode="numeric"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                setOtp('');
                setStep('otp');
                setTimeout(() => setOtp('482910'), 700);
              }}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
            >
              Continue with OTP
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4 px-1">
            <p className="text-xs text-slate-500 text-center">Enter OTP sent to registered mobile</p>
            <NumericPinInput value={otp} onChange={setOtp} autoFocus ariaLabel="Nominee OTP" />
            <button
              type="button"
              onClick={handleOtpContinue}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
            >
              Verify & Submit
            </button>
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={submitNominee}
        title="Confirm nominee update"
      />
    </div>
  );
};
