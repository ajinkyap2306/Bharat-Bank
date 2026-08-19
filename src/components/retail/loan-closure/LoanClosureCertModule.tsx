import React, { useState } from 'react';
import { Award, CheckCircle2, Download } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';

export const LoanClosureCertModule: React.FC = () => {
  const { loans, loanClosureRequests, requestLoanClosureCert, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const closedLoans = loans.filter((l) => l.status === 'closed');

  if (done) {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 pb-24 -mx-3 bg-slate-50 dark:bg-slate-950 min-h-full">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Request Submitted</h2>
        <p className="text-xs text-slate-500 mt-2">Reference: <span className="font-mono font-bold">{ref}</span></p>
        <p className="text-xs text-slate-500 mt-1">Certificate will be ready in 2–3 working days.</p>
        <button type="button" onClick={() => setRetailTab('services')} className="mt-8 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">Done</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Loan Closure Certificate" subtitle="For fully closed loans" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 flex gap-3">
          <Award className="w-8 h-8 text-blue-600 shrink-0" />
          <p className="text-xs text-slate-600">Request a closure certificate for loans that have been fully repaid. Download when status is Ready.</p>
        </div>

        {closedLoans.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No closed loans found on your profile.</p>
        ) : (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs font-bold text-slate-500">Select Closed Loan</p>
            <select
              value={selectedLoanId}
              onChange={(e) => setSelectedLoanId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm"
            >
              <option value="">Choose loan...</option>
              {closedLoans.map((l) => (
                <option key={l.id} value={l.id}>{l.type} — {l.loanNumber}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (!selectedLoanId) {
                  addToast({ type: 'error', title: 'Select loan', message: 'Choose a closed loan to continue.' });
                  return;
                }
                const already = loanClosureRequests.find((r) => r.loanId === selectedLoanId && r.status === 'processing');
                if (already) {
                  addToast({ type: 'info', title: 'Already requested', message: `Reference ${already.reference} is in progress.` });
                  return;
                }
                setShowAuth(true);
              }}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl"
            >
              Request Certificate
            </button>
          </div>
        )}

        {loanClosureRequests.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-1">Your Requests</p>
            {loanClosureRequests.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold">{r.loanType}</p>
                    <p className="text-[11px] text-slate-500">{r.loanNumber} • {r.requestedOn}</p>
                  </div>
                  <span className={`text-[9px] font-bold capitalize px-2 py-0.5 rounded-full h-fit ${r.status === 'ready' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{r.reference}</p>
                {r.status === 'ready' && (
                  <button
                    type="button"
                    onClick={() => addToast({ type: 'success', title: 'Download started', message: `Closure certificate for ${r.loanNumber} (demo PDF).` })}
                    className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-600"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Certificate
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          const reference = requestLoanClosureCert(selectedLoanId);
          setRef(reference);
          setShowAuth(false);
          setDone(true);
        }}
        title="Authenticate request"
      />
    </div>
  );
};
