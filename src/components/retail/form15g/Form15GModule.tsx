import React, { useState } from 'react';
import { FileInput, CheckCircle2 } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';

export const Form15GModule: React.FC = () => {
  const { form15gSubmissions, submitForm15G, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [formType, setFormType] = useState<'15G' | '15H'>('15G');
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [estimatedIncome, setEstimatedIncome] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  if (done) {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 pb-24 -mx-3 bg-slate-50 dark:bg-slate-950 min-h-full">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Form Submitted</h2>
        <p className="text-xs text-slate-500 mt-2">Reference: <span className="font-mono font-bold">{ref}</span></p>
        <button type="button" onClick={() => setRetailTab('services')} className="mt-8 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">Done</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Form 15G / 15H" subtitle="TDS exemption declaration" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 flex gap-3">
          <FileInput className="w-8 h-8 text-amber-600 shrink-0" />
          <p className="text-xs text-slate-600">Submit Form 15G (below 60) or 15H (senior citizens) to declare nil/low taxable income for TDS exemption.</p>
        </div>

        <div className="flex gap-2">
          {(['15G', '15H'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setFormType(t)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${formType === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
              Form {t}
            </button>
          ))}
        </div>

        <input value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} placeholder="Financial Year" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        <input value={estimatedIncome} onChange={(e) => setEstimatedIncome(e.target.value.replace(/\D/g, ''))} placeholder="Estimated total income (₹)" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />

        <button
          type="button"
          onClick={() => {
            if (!estimatedIncome) {
              addToast({ type: 'error', title: 'Required', message: 'Enter estimated income.' });
              return;
            }
            setShowAuth(true);
          }}
          className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
        >
          Submit Form {formType}
        </button>

        {form15gSubmissions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-1">Past Submissions</p>
            {form15gSubmissions.map((f) => (
              <div key={f.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <p className="text-sm font-bold">Form {f.formType} — FY {f.financialYear}</p>
                  <span className="text-[9px] font-bold capitalize text-emerald-600">{f.status}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{f.reference} • {f.submittedOn}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          const reference = submitForm15G({ formType, financialYear, estimatedIncome: Number(estimatedIncome) });
          setRef(reference);
          setShowAuth(false);
          setDone(true);
        }}
        title="Authenticate form submission"
      />
    </div>
  );
};
