import React, { useState } from 'react';
import { CheckCircle2, FileText, Mail, PauseCircle, PlayCircle } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import type { EStatementSubscription } from '../../../data/accountServicesMock';

type Screen = 'list' | 'request' | 'success';

export const EStatementModule: React.FC = () => {
  const {
    accounts,
    eStatementSubscriptions,
    requestEStatement,
    stopEStatement,
    resumeEStatement,
    updateEStatementFrequency,
    personalInfo,
    addToast,
    setRetailTab,
    setBottomNavHidden,
  } = useBanking();

  const [screen, setScreen] = useState<Screen>('list');
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '');
  const [frequency, setFrequency] = useState<EStatementSubscription['frequency']>('monthly');
  const [format, setFormat] = useState<EStatementSubscription['format']>('PDF');
  const [email, setEmail] = useState(personalInfo.email);
  const [authOpen, setAuthOpen] = useState(false);
  const [successRef, setSuccessRef] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(screen !== 'list');
    return () => setBottomNavHidden(false);
  }, [screen, setBottomNavHidden]);

  const eligible = accounts.filter((a) =>
    ['Savings', 'Current', 'NRE Savings', 'Overdraft', 'BDD'].includes(a.accountType)
  );

  const handleRequest = () => {
    const ref = requestEStatement({ accountId, frequency, format, email });
    setSuccessRef(ref);
    setScreen('success');
    setAuthOpen(false);
  };

  if (screen === 'success') {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 -mx-3 min-h-full bg-slate-50 dark:bg-slate-950">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">eStatement Scheduled</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-xs">
          Reference {successRef}. Statements will be emailed to {email} per your selected frequency.
        </p>
        <button
          type="button"
          onClick={() => setScreen('list')}
          className="mt-8 w-full max-w-sm py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
        >
          View Subscriptions
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader
        title="eStatement"
        subtitle="Request, stop & manage frequency"
        onBack={() => (screen === 'list' ? setRetailTab('services') : setScreen('list'))}
      />

      <div className="pt-3 pb-6 space-y-4">
        {screen === 'list' && (
          <>
            <button
              type="button"
              onClick={() => setScreen('request')}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm"
            >
              + Request eStatement
            </button>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase px-1">Active Subscriptions</p>
              {eStatementSubscriptions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-6">No eStatement subscriptions.</p>
              ) : (
                eStatementSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-sm font-bold">{sub.accountLabel}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {sub.email}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          sub.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : sub.status === 'stopped'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      {sub.frequency} • {sub.format} • Next: {sub.nextDelivery}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {sub.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => {
                            stopEStatement(sub.id);
                            addToast({ type: 'info', title: 'Stopped', message: 'eStatement delivery stopped.' });
                          }}
                          className="flex-1 py-2 text-xs font-bold text-rose-600 border border-rose-200 rounded-xl flex items-center justify-center gap-1"
                        >
                          <PauseCircle className="w-3.5 h-3.5" /> Stop
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            resumeEStatement(sub.id);
                            addToast({ type: 'success', title: 'Resumed', message: 'eStatement reactivated.' });
                          }}
                          className="flex-1 py-2 text-xs font-bold text-emerald-600 border border-emerald-200 rounded-xl flex items-center justify-center gap-1"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Resume
                        </button>
                      )}
                      <select
                        value={sub.frequency}
                        onChange={(e) =>
                          updateEStatementFrequency(sub.id, e.target.value as EStatementSubscription['frequency'])
                        }
                        className="flex-1 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 px-2"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {screen === 'request' && (
          <div className="space-y-4 px-1">
            <div>
              <label className="text-xs font-bold text-slate-500">Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
              >
                {eligible.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.accountType} {a.maskedNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as EStatementSubscription['frequency'])}
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as EStatementSubscription['format'])}
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="TEXT">Text</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Submit Request
            </button>
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleRequest}
        title="Confirm eStatement request"
      />
    </div>
  );
};
