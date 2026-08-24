import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ban,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { requiresJointApproval } from '../../../data/retailJointTransferMock';
import {
  ChequeBook,
  ChequeRecord,
  PositivePayRegistration,
} from '../../../data/chequeServicesMock';

type ChequeScreen =
  | 'home'
  | 'request_book'
  | 'stop_cheque'
  | 'cheque_status'
  | 'issued'
  | 'issued_detail'
  | 'deposited'
  | 'deposited_detail'
  | 'books'
  | 'positive_pay'
  | 'positive_pay_new'
  | 'success';

const STATUS_COLORS: Record<string, string> = {
  cleared: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  stopped: 'bg-rose-100 text-rose-700',
  issued: 'bg-blue-100 text-blue-700',
  deposited: 'bg-indigo-100 text-indigo-700',
};

export const ChequeServicesModule: React.FC = () => {
  const {
    accounts,
    chequeBooks,
    issuedCheques,
    depositedCheques,
    positivePayRegs,
    requestChequeBook,
    stopCheque,
    registerPositivePay,
    addToast,
    setRetailTab,
    setBottomNavHidden,
    submitJointApprovalRequest,
  } = useBanking();

  const [screen, setScreen] = useState<ChequeScreen>('home');
  const [selectedCheque, setSelectedCheque] = useState<ChequeRecord | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState<'request' | 'stop' | 'positive' | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Request book form
  const [reqAccountId, setReqAccountId] = useState(accounts[0]?.id ?? '');
  const [reqLeaves, setReqLeaves] = useState('25');

  // Stop cheque form
  const [stopAccountId, setStopAccountId] = useState(accounts[0]?.id ?? '');
  const [stopChequeNum, setStopChequeNum] = useState('');
  const [stopReason, setStopReason] = useState('Payment cancelled');

  // Status lookup
  const [statusQuery, setStatusQuery] = useState('');
  const [statusResult, setStatusResult] = useState<ChequeRecord | null>(null);

  // Positive pay form
  const [ppCheque, setPpCheque] = useState('');
  const [ppPayee, setPpPayee] = useState('');
  const [ppAmount, setPpAmount] = useState('');
  const [ppDate, setPpDate] = useState(new Date().toISOString().slice(0, 10));
  const [ppAccountId, setPpAccountId] = useState(accounts[0]?.id ?? '');

  const reqAccount = accounts.find((a) => a.id === reqAccountId);
  const stopAccount = accounts.find((a) => a.id === stopAccountId);
  const ppAccount = accounts.find((a) => a.id === ppAccountId);
  const reqNeedsApproval = requiresJointApproval(reqAccount);
  const stopNeedsApproval = requiresJointApproval(stopAccount);
  const ppNeedsApproval = requiresJointApproval(ppAccount);

  useEffect(() => {
    setBottomNavHidden(screen !== 'home');
    return () => setBottomNavHidden(false);
  }, [screen, setBottomNavHidden]);

  const goHome = () => {
    setScreen('home');
    setSelectedCheque(null);
    setStatusResult(null);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (pendingAction === 'request') {
      if (reqNeedsApproval) {
        const req = submitJointApprovalRequest({
          requestType: 'cheque_book',
          fromAccountId: reqAccountId,
          amount: 0,
          beneficiaryName: 'Cheque Book Request',
          beneficiaryBank: 'Cheque Services',
          beneficiaryAccountMasked: `${reqLeaves} leaves`,
          payload: { leaves: Number(reqLeaves) },
        });
        if (req) {
          setSuccessMsg(`Cheque book request sent to ${req.approverName} for approval. Ref: ${req.reference}`);
          setScreen('success');
        }
      } else {
        const ref = requestChequeBook(reqAccountId, Number(reqLeaves));
        setSuccessMsg(`Cheque book requested. Tracking ID: ${ref}`);
        setScreen('success');
      }
    } else if (pendingAction === 'stop') {
      if (stopNeedsApproval) {
        const req = submitJointApprovalRequest({
          requestType: 'stop_cheque',
          fromAccountId: stopAccountId,
          amount: 0,
          beneficiaryName: 'Stop Cheque',
          beneficiaryBank: 'Cheque Services',
          beneficiaryAccountMasked: `Cheque #${stopChequeNum}`,
          payload: { chequeNumber: stopChequeNum, reason: stopReason },
        });
        if (req) {
          setSuccessMsg(`Stop cheque request sent to ${req.approverName} for approval. Ref: ${req.reference}`);
          setScreen('success');
        }
      } else {
        const ref = stopCheque(stopAccountId, stopChequeNum, stopReason);
        setSuccessMsg(`Stop cheque order registered. Reference: ${ref}`);
        setScreen('success');
      }
    } else if (pendingAction === 'positive') {
      const amount = Number(ppAmount);
      if (ppNeedsApproval) {
        const req = submitJointApprovalRequest({
          requestType: 'positive_pay',
          fromAccountId: ppAccountId,
          amount,
          beneficiaryName: ppPayee,
          beneficiaryBank: 'Positive Pay',
          beneficiaryAccountMasked: `Cheque #${ppCheque}`,
          payload: { chequeNumber: ppCheque, payeeName: ppPayee, issueDate: ppDate },
        });
        if (req) {
          setSuccessMsg(`Positive Pay request sent to ${req.approverName} for approval. Ref: ${req.reference}`);
          setScreen('success');
        }
      } else {
        const ref = registerPositivePay({
          chequeNumber: ppCheque,
          payeeName: ppPayee,
          amount,
          issueDate: ppDate,
        });
        setSuccessMsg(`Positive Pay registered. Reference: ${ref}`);
        setScreen('success');
      }
    }
    setPendingAction(null);
  };

  const pendingNeedsApproval =
    (pendingAction === 'request' && reqNeedsApproval) ||
    (pendingAction === 'stop' && stopNeedsApproval) ||
    (pendingAction === 'positive' && ppNeedsApproval);

  const jointNote = (needsApproval: boolean) =>
    needsApproval ? (
      <p className="text-xs text-slate-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 rounded-xl p-3">
        Joint account selected — this request will be sent to the other joint holder for approval.
      </p>
    ) : null;

  const lookupStatus = () => {
    const all = [...issuedCheques, ...depositedCheques];
    const found = all.find((c) => c.chequeNumber === statusQuery.trim());
    setStatusResult(found ?? null);
    if (!found) {
      addToast({ type: 'error', title: 'Not Found', message: 'No cheque found with this number.' });
    }
  };

  const menuItems = [
    { id: 'request_book' as const, label: 'Request Cheque Book', icon: BookOpen, desc: 'New cheque book delivery' },
    { id: 'stop_cheque' as const, label: 'Stop Cheque', icon: Ban, desc: 'Revoke a issued cheque' },
    { id: 'cheque_status' as const, label: 'Cheque Status', icon: Search, desc: 'Track cheque by number' },
    { id: 'issued' as const, label: 'Cheques Issued by Me', icon: FileText, desc: 'Summary & detail' },
    { id: 'deposited' as const, label: 'Cheques Deposited by Me', icon: FileText, desc: 'Summary & detail' },
    { id: 'books' as const, label: 'Existing Cheque Books', icon: BookOpen, desc: 'Leaves & status' },
    { id: 'positive_pay' as const, label: 'Positive Pay', icon: ShieldCheck, desc: 'Register high-value cheques' },
  ];

  const renderList = (items: ChequeRecord[], detailScreen: 'issued_detail' | 'deposited_detail') => (
    <div className="space-y-2 px-1">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">No records found.</p>
      ) : (
        items.map((chq) => (
          <button
            key={chq.id}
            type="button"
            onClick={() => {
              setSelectedCheque(chq);
              setScreen(detailScreen);
            }}
            className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-sm font-bold">Chq #{chq.chequeNumber}</p>
                <p className="text-xs text-slate-500 mt-0.5">{chq.payee}</p>
                <p className="text-[10px] text-slate-400 mt-1">{chq.date} • {chq.accountLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold">₹{chq.amount.toLocaleString('en-IN')}</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize mt-1 inline-block ${STATUS_COLORS[chq.status] ?? 'bg-slate-100'}`}>
                  {chq.status}
                </span>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );

  const renderBooks = (books: ChequeBook[]) => (
    <div className="space-y-2 px-1">
      {books.map((book) => (
        <div key={book.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between">
            <p className="text-sm font-bold">{book.chequeBookNumber}</p>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${book.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {book.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{book.accountLabel}</p>
          <p className="text-xs text-slate-500">Issued: {book.issuedDate}</p>
          <p className="text-xs font-semibold mt-2">
            Leaves used: {book.leavesUsed} / {book.leavesTotal}
          </p>
          <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${(book.leavesUsed / book.leavesTotal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPositivePayList = (regs: PositivePayRegistration[]) => (
    <div className="space-y-2">
      {regs.map((pp) => (
        <div key={pp.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between">
            <p className="text-sm font-bold">Chq #{pp.chequeNumber}</p>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[pp.status] ?? 'bg-slate-100'}`}>
              {pp.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{pp.payeeName}</p>
          <p className="text-sm font-bold mt-1">₹{pp.amount.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-1">{pp.reference}</p>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setScreen('positive_pay_new')}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 font-bold text-sm"
      >
        + Register New Cheque
      </button>
    </div>
  );

  const screenTitle: Record<ChequeScreen, string> = {
    home: 'Cheque Services',
    request_book: 'Request Cheque Book',
    stop_cheque: 'Stop Cheque',
    cheque_status: 'Cheque Status',
    issued: 'Cheques Issued',
    issued_detail: 'Cheque Detail',
    deposited: 'Cheques Deposited',
    deposited_detail: 'Cheque Detail',
    books: 'Cheque Books',
    positive_pay: 'Positive Pay',
    positive_pay_new: 'Register Positive Pay',
    success: 'Success',
  };

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      {screen !== 'success' && (
        <ScreenHeader
          title={screenTitle[screen]}
          onBack={screen === 'home' ? () => setRetailTab('services') : goHome}
        />
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6 pt-3">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScreen(item.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left active:scale-[0.99] transition-transform"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </motion.div>
          )}

          {screen === 'request_book' && (
            <motion.div key="req" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 px-1">
              <div>
                <label className="text-xs font-bold text-slate-500">Account</label>
                <select
                  value={reqAccountId}
                  onChange={(e) => setReqAccountId(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                >
                  {accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType)).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.jointAccountLabel ?? a.accountType} ({a.maskedNumber})
                      {requiresJointApproval(a) ? ' · Joint' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {jointNote(reqNeedsApproval)}
              <div>
                <label className="text-xs font-bold text-slate-500">Number of leaves</label>
                <select
                  value={reqLeaves}
                  onChange={(e) => setReqLeaves(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                >
                  <option value="25">25 leaves</option>
                  <option value="50">50 leaves</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPendingAction('request');
                  setShowAuth(true);
                }}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
              >
                {reqNeedsApproval ? 'Submit for Approval' : 'Submit Request'}
              </button>
            </motion.div>
          )}

          {screen === 'stop_cheque' && (
            <motion.div key="stop" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 px-1">
              <div>
                <label className="text-xs font-bold text-slate-500">Account</label>
                <select
                  value={stopAccountId}
                  onChange={(e) => setStopAccountId(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                >
                  {accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType)).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.jointAccountLabel ?? a.maskedNumber}
                      {requiresJointApproval(a) ? ' · Joint' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {jointNote(stopNeedsApproval)}
              <div>
                <label className="text-xs font-bold text-slate-500">Cheque number</label>
                <input
                  value={stopChequeNum}
                  onChange={(e) => setStopChequeNum(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit cheque number"
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Reason</label>
                <select
                  value={stopReason}
                  onChange={(e) => setStopReason(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                >
                  <option>Payment cancelled</option>
                  <option>Lost cheque</option>
                  <option>Incorrect details</option>
                  <option>Other</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (stopChequeNum.length < 6) {
                    addToast({ type: 'error', title: 'Invalid', message: 'Enter a 6-digit cheque number.' });
                    return;
                  }
                  setPendingAction('stop');
                  setShowAuth(true);
                }}
                className="w-full py-3.5 bg-rose-600 text-white font-bold rounded-2xl"
              >
                {stopNeedsApproval ? 'Submit Stop Request for Approval' : 'Stop Cheque'}
              </button>
            </motion.div>
          )}

          {screen === 'cheque_status' && (
            <motion.div key="status" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 px-1">
              <div className="flex gap-2">
                <input
                  value={statusQuery}
                  onChange={(e) => setStatusQuery(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter cheque number"
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-mono"
                />
                <button type="button" onClick={lookupStatus} className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm">
                  Track
                </button>
              </div>
              {statusResult && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-bold">Chq #{statusResult.chequeNumber}</p>
                  <p className="text-xs text-slate-500 mt-1">{statusResult.payee}</p>
                  <p className="text-lg font-extrabold mt-2">₹{statusResult.amount.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize mt-2 inline-block ${STATUS_COLORS[statusResult.status]}`}>
                    {statusResult.status}
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {screen === 'issued' && renderList(issuedCheques, 'issued_detail')}
          {screen === 'deposited' && renderList(depositedCheques, 'deposited_detail')}

          {(screen === 'issued_detail' || screen === 'deposited_detail') && selectedCheque && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mx-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Cheque Number</p>
              <p className="text-xl font-mono font-bold">{selectedCheque.chequeNumber}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Payee</span><span className="font-semibold">{selectedCheque.payee}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-semibold">₹{selectedCheque.amount.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-semibold">{selectedCheque.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-semibold">{selectedCheque.accountLabel}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-semibold capitalize">{selectedCheque.status}</span></div>
              </div>
            </motion.div>
          )}

          {screen === 'books' && renderBooks(chequeBooks)}
          {screen === 'positive_pay' && <div className="px-1">{renderPositivePayList(positivePayRegs)}</div>}

          {screen === 'positive_pay_new' && (
            <motion.div key="ppnew" className="space-y-4 px-1">
              <div>
                <label className="text-xs font-bold text-slate-500">Account</label>
                <select
                  value={ppAccountId}
                  onChange={(e) => setPpAccountId(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
                >
                  {accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType)).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.jointAccountLabel ?? a.accountType} ({a.maskedNumber})
                      {requiresJointApproval(a) ? ' · Joint' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {jointNote(ppNeedsApproval)}
              <input value={ppCheque} onChange={(e) => setPpCheque(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Cheque number" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
              <input value={ppPayee} onChange={(e) => setPpPayee(e.target.value)} placeholder="Payee name" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
              <input value={ppAmount} onChange={(e) => setPpAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount (₹)" inputMode="numeric" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
              <input type="date" value={ppDate} onChange={(e) => setPpDate(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" />
              <button
                type="button"
                onClick={() => {
                  if (!ppCheque || !ppPayee || !ppAmount) {
                    addToast({ type: 'error', title: 'Incomplete', message: 'Fill all fields.' });
                    return;
                  }
                  setPendingAction('positive');
                  setShowAuth(true);
                }}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
              >
                {ppNeedsApproval ? 'Submit for Approval' : 'Register'}
              </button>
            </motion.div>
          )}

          {screen === 'success' && (
            <motion.div key="ok" className="flex flex-col items-center text-center px-4 pt-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
              <h2 className="text-xl font-extrabold">Request Submitted</h2>
              <p className="text-xs text-slate-500 mt-2 max-w-xs">{successMsg}</p>
              <button type="button" onClick={goHome} className="mt-8 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => {
          setShowAuth(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
        title={pendingNeedsApproval ? 'Enter TPIN' : 'Enter MPIN'}
        pinType={pendingNeedsApproval ? 'tpin' : 'mpin'}
      />
    </div>
  );
};
