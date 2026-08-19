import React, { useState } from 'react';
import { CalendarCheck, Building2 } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';

const BRANCHES = [
  'Bandra Kurla Complex, Mumbai',
  'Connaught Place, New Delhi',
  'MG Road, Bengaluru',
  'Anna Salai, Chennai',
];

const PURPOSES = ['Account Services', 'Loan Discussion', 'Signature Update', 'Cheque / DD', 'KYC Update', 'General Inquiry'];
const SLOTS = ['10:00 AM — 10:30 AM', '11:00 AM — 11:30 AM', '2:00 PM — 2:30 PM', '4:00 PM — 4:30 PM'];

export const BranchAppointmentModule: React.FC = () => {
  const { branchAppointments, bookBranchAppointment, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [date, setDate] = useState('22 Aug 2026');
  const [timeSlot, setTimeSlot] = useState(SLOTS[1]);
  const [showAuth, setShowAuth] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const upcoming = branchAppointments.filter((a) => a.status === 'confirmed');

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Branch Appointment" subtitle="Schedule a branch visit" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 flex gap-3">
          <Building2 className="w-8 h-8 text-blue-600 shrink-0" />
          <p className="text-xs text-slate-600">Book a slot to skip the queue. Bring valid ID and account details.</p>
        </div>

        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
          {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
          {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Preferred date" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
          {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="button" onClick={() => setShowAuth(true)} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
          <CalendarCheck className="w-4 h-4" /> Book Appointment
        </button>

        {upcoming.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-1">Upcoming</p>
            {upcoming.map((a) => (
              <div key={a.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold">{a.branchName}</p>
                <p className="text-xs text-slate-500">{a.purpose} • {a.date} • {a.timeSlot}</p>
                <p className="text-[10px] font-mono text-blue-600 mt-1">{a.reference}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          bookBranchAppointment({ branchName: branch, purpose, date, timeSlot });
          setShowAuth(false);
        }}
        title="Confirm appointment"
      />
    </div>
  );
};
