import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Search } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { Beneficiary } from '../../../../types/banking';
import { BottomSheet } from '../../../common/BottomSheet';
import { SecureAuthModal } from '../../../common/SecureAuthModal';
import { shareAccountDetails } from '../../../../utils/shareAccountDetails';
import { searchIfsc } from '../../../../data/ifscMock';
import {
  AccountsScreenLayout,
  AccountsStickyCTA,
  AccountsInfoCard,
  formatInr,
} from '../shared/RetailAccountsUI';

const NICKNAME_MAX = 30;
const NICKNAME_PATTERN = /^[a-zA-Z0-9\s\-'.]*$/;

export const AccountNicknameScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts, updateAccountNickname } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  const [nickname, setNickname] = useState(account?.nickname || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  if (!account) return null;

  if (saved) {
    return (
      <AccountsScreenLayout
        title="Account Nickname"
        onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
      >
        <div className="flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold">Nickname Updated</h2>
          <p className="text-sm text-slate-500 mt-2">Your account nickname has been updated.</p>
          <button
            type="button"
            onClick={() => navigate(`/retail/accounts/${accountId}/manage`)}
            className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Done
          </button>
        </div>
      </AccountsScreenLayout>
    );
  }

  const save = () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('Please enter a nickname.');
      return;
    }
    if (trimmed.length > NICKNAME_MAX) {
      setError('Maximum 30 characters.');
      return;
    }
    if (!NICKNAME_PATTERN.test(trimmed)) {
      setError('Nickname contains unsupported characters.');
      return;
    }
    updateAccountNickname(account.id, trimmed);
    setSaved(true);
  };

  return (
    <AccountsScreenLayout
      title="Account Nickname"
      onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
      footer={
        <AccountsStickyCTA label="Save Changes" onClick={save} />
      }
    >
      <AccountsInfoCard>
        <p className="text-sm font-bold">{account.accountType}</p>
        <p className="text-xs font-mono text-slate-500">{account.maskedNumber}</p>
      </AccountsInfoCard>
      <AccountsInfoCard>
        <label className="text-xs font-semibold text-slate-500">Nickname</label>
        <input
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError('');
          }}
          placeholder="Add a nickname"
          maxLength={NICKNAME_MAX}
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
        />
        <p className="text-[11px] text-slate-400 mt-2">
          Use a nickname to easily identify this account. Maximum 30 characters.
        </p>
        {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {['Salary Account', 'Emergency Fund', 'Personal Savings'].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setNickname(ex)}
              className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold"
            >
              {ex}
            </button>
          ))}
        </div>
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const AccountHoldersScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts, user } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  if (!account) return null;

  const nominee = account.nominees?.[0];
  const joint = account.jointHolders?.[0];

  return (
    <AccountsScreenLayout
      title="Account Holders"
      onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
    >
      <AccountsInfoCard>
        <p className="text-sm font-bold">{account.accountType}</p>
        <p className="text-xs font-mono text-slate-500">{account.maskedNumber}</p>
      </AccountsInfoCard>

      <AccountsInfoCard>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Primary Holder</p>
        <p className="text-sm font-bold">{user.name}</p>
        <p className="text-xs text-slate-500 mt-1">Status: Primary Holder</p>
      </AccountsInfoCard>

      <AccountsInfoCard>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Nominee</p>
        {nominee ? (
          <>
            <p className="text-sm font-bold">{nominee.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              Relationship: {nominee.relationship} • Share: {nominee.allocation}%
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Status: ✓ Registered</p>
          </>
        ) : (
          <p className="text-sm text-slate-500">Not Registered</p>
        )}
      </AccountsInfoCard>

      <AccountsInfoCard>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Joint Holder</p>
        {joint ? (
          <>
            <p className="text-sm font-bold">{joint.name}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Status: Active</p>
          </>
        ) : (
          <p className="text-sm text-slate-500">None</p>
        )}
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const ShareAccountScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts, user, addToast } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!account) return null;

  const copy = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const share = async () => {
    const result = await shareAccountDetails(
      {
        accountType: account.accountType,
        accountNumber: account.accountNumber,
        ifsc: account.ifsc,
        branch: account.branch,
        accountHolder: user.name,
      },
      (message) => addToast({ type: 'info', title: 'Share', message })
    );
    if (result === 'shared') {
      addToast({ type: 'success', title: 'Shared', message: 'Account details shared.' });
    }
  };

  return (
    <AccountsScreenLayout
      title="Share Account Details"
      onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
      footer={<AccountsStickyCTA label="Share Details" onClick={share} />}
    >
      <AccountsInfoCard className="space-y-4">
        <div>
          <p className="text-[11px] text-slate-500">Account Holder</p>
          <p className="text-sm font-bold">{user.name}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] text-slate-500">Account Number</p>
            <p className="text-sm font-mono font-bold">{account.maskedNumber}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(account.accountNumber, 'acct')}
            className="text-xs font-bold text-congress-blue-700 flex items-center gap-1"
          >
            {copiedField === 'acct' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] text-slate-500">IFSC</p>
            <p className="text-sm font-mono font-bold">{account.ifsc}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(account.ifsc, 'ifsc')}
            className="text-xs font-bold text-congress-blue-700 flex items-center gap-1"
          >
            {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy
          </button>
        </div>
        <div>
          <p className="text-[11px] text-slate-500">Account Type</p>
          <p className="text-sm font-bold">{account.accountType}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500">Branch</p>
          <p className="text-sm font-bold">{account.branch}</p>
        </div>
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const FreezeAccountScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts, freezeAccount } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [frozen, setFrozen] = useState(false);

  if (!account) return null;

  if (frozen) {
    return (
      <AccountsScreenLayout
        title="Freeze Account"
        onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
      >
        <div className="flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold">Account Frozen</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">
            {account.accountType} {account.maskedNumber} — transactions have been restricted.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/retail/accounts/${accountId}`)}
            className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Done
          </button>
        </div>
      </AccountsScreenLayout>
    );
  }

  const handleFreeze = () => {
    freezeAccount(account.id);
    setShowAuth(false);
    setFrozen(true);
  };

  return (
    <>
      <AccountsScreenLayout
        title="Freeze Account"
        onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
        footer={<AccountsStickyCTA label="Continue" onClick={() => setShowConfirm(true)} />}
      >
        <AccountsInfoCard>
          <p className="text-sm font-bold">{account.accountType}</p>
          <p className="text-xs font-mono text-slate-500">{account.maskedNumber}</p>
          <p className="text-xs mt-3">
            Current Status: <span className="text-emerald-600 font-bold">● Active</span>
          </p>
        </AccountsInfoCard>
        <AccountsInfoCard>
          <p className="text-sm font-semibold mb-2">What would you like to freeze?</p>
          <label className="flex items-center gap-2 text-sm py-2">
            <input type="radio" checked readOnly className="accent-congress-blue-700" />
            Entire Account
          </label>
          <p className="text-[11px] text-slate-500">
            Freezing restricts eligible transactions until the account is unfrozen.
          </p>
        </AccountsInfoCard>
      </AccountsScreenLayout>

      <BottomSheet isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Freeze Account?">
        <p className="text-sm text-slate-600 mb-4">
          Freezing this account will restrict eligible transactions until the account is unfrozen.
        </p>
        <p className="text-sm font-bold mb-4">
          Account: {account.accountType} {account.maskedNumber}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="flex-1 py-3 rounded-2xl border font-bold text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setShowConfirm(false);
              setShowAuth(true);
            }}
            className="flex-1 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Freeze Account
          </button>
        </div>
      </BottomSheet>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleFreeze}
        title="Enter MPIN to freeze account"
      />
    </>
  );
};

// Positive Pay flow state stored in sessionStorage for review step
const PP_KEY = 'retail_pp_draft';

export const PositivePayDashboardScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { positivePayRegs } = useBanking();
  const base = `/retail/accounts/${accountId}/manage/positive-pay`;

  const active = positivePayRegs.filter((r) => r.status === 'registered').length;
  const pending = positivePayRegs.filter((r) => r.status === 'registered').length > 0 ? 1 : 0;

  return (
    <AccountsScreenLayout
      title="Positive Pay"
      onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
      footer={
        <AccountsStickyCTA
          label="+ Add Cheque"
          onClick={() => navigate(`${base}/add`)}
        />
      }
    >
      <AccountsInfoCard>
        <p className="text-sm text-slate-600">
          Protect eligible cheque payments by registering cheque details in advance.
        </p>
      </AccountsInfoCard>
      <div className="grid grid-cols-2 gap-3">
        <AccountsInfoCard>
          <p className="text-[11px] text-slate-500">Active Instructions</p>
          <p className="text-2xl font-bold">{active}</p>
        </AccountsInfoCard>
        <AccountsInfoCard>
          <p className="text-[11px] text-slate-500">Pending Verification</p>
          <p className="text-2xl font-bold">{pending}</p>
        </AccountsInfoCard>
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase px-1">Recent Instructions</p>
      <div className="space-y-2">
        {positivePayRegs.slice(0, 3).map((r) => (
          <AccountsInfoCard key={r.id}>
            <p className="text-sm font-bold">Cheque •••• {r.chequeNumber.slice(-4)}</p>
            <p className="text-xs text-slate-500">{formatInr(r.amount)} • {r.issueDate}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">● Confirmed</p>
          </AccountsInfoCard>
        ))}
      </div>
    </AccountsScreenLayout>
  );
};

export const PositivePayAddScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const base = `/retail/accounts/${accountId}/manage/positive-pay`;
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeDate, setChequeDate] = useState('15 Sep 2026');
  const [payee, setPayee] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const continueFlow = () => {
    const errs: Record<string, string> = {};
    if (!chequeNumber || chequeNumber.length < 6) errs.chequeNumber = 'Valid cheque number required';
    if (!payee.trim()) errs.payee = 'Payee name required';
    const amt = Number(amount.replace(/,/g, ''));
    if (!amt || amt <= 0) errs.amount = 'Enter a valid amount';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    sessionStorage.setItem(
      PP_KEY,
      JSON.stringify({ chequeNumber, chequeDate, payee, amount: amt })
    );
    navigate(`${base}/review`);
  };

  return (
    <AccountsScreenLayout
      title="Add Cheque"
      onBack={() => navigate(base)}
      footer={<AccountsStickyCTA label="Continue" onClick={continueFlow} />}
    >
      <AccountsInfoCard className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500">Cheque Number</label>
          <input
            value={chequeNumber}
            onChange={(e) => setChequeNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="mt-1 w-full px-4 py-3 rounded-xl border text-sm"
            placeholder="123456"
          />
          {errors.chequeNumber && <p className="text-xs text-rose-600 mt-1">{errors.chequeNumber}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">Cheque Date</label>
          <input
            value={chequeDate}
            onChange={(e) => setChequeDate(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">Payee Name</label>
          <input
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border text-sm"
          />
          {errors.payee && <p className="text-xs text-rose-600 mt-1">{errors.payee}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
            className="mt-1 w-full px-4 py-3 rounded-xl border text-sm"
            placeholder="250000"
          />
          {errors.amount && <p className="text-xs text-rose-600 mt-1">{errors.amount}</p>}
        </div>
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const PositivePayReviewScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { registerPositivePay } = useBanking();
  const base = `/retail/accounts/${accountId}/manage/positive-pay`;
  const draft = JSON.parse(sessionStorage.getItem(PP_KEY) || '{}') as {
    chequeNumber?: string;
    chequeDate?: string;
    payee?: string;
    amount?: number;
  };
  const [submitted, setSubmitted] = useState(false);
  const [ref, setRef] = useState('');

  if (!draft.chequeNumber) {
    navigate(`${base}/add`, { replace: true });
    return null;
  }

  if (submitted) {
    return (
      <AccountsScreenLayout title="Positive Pay" onBack={() => navigate(base)}>
        <div className="flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold">Positive Pay Instruction Submitted</h2>
          <p className="text-sm text-slate-500 mt-2">
            Cheque •••• {draft.chequeNumber.slice(-4)} • {formatInr(draft.amount || 0)}
          </p>
          <p className="text-xs text-slate-500 mt-2">Status: Pending Verification</p>
          <p className="text-xs font-mono text-slate-400 mt-1">Reference: {ref}</p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(PP_KEY);
              navigate(base);
            }}
            className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Done
          </button>
        </div>
      </AccountsScreenLayout>
    );
  }

  const submit = () => {
    const reference = registerPositivePay({
      chequeNumber: draft.chequeNumber!,
      payeeName: draft.payee!,
      amount: draft.amount!,
      issueDate: draft.chequeDate!,
    });
    setRef(reference);
    setSubmitted(true);
  };

  return (
    <AccountsScreenLayout
      title="Review Cheque Details"
      onBack={() => navigate(`${base}/add`)}
      footer={<AccountsStickyCTA label="Submit" onClick={submit} />}
    >
      <AccountsInfoCard className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Cheque Number</span>
          <span className="font-bold">{draft.chequeNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Cheque Date</span>
          <span className="font-bold">{draft.chequeDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Payee</span>
          <span className="font-bold text-right max-w-[55%]">{draft.payee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Amount</span>
          <span className="font-bold">{formatInr(draft.amount || 0)}</span>
        </div>
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

const BEN_KEY = 'retail_ben_draft';

export const BeneficiaryManagementScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { beneficiaries } = useBanking();
  const base = `/retail/accounts/${accountId}/manage/beneficiaries`;
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'active' | 'pending'>('all');

  const filtered = beneficiaries.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.name.toLowerCase().includes(q) || b.bankName.toLowerCase().includes(q);
    const matchTab =
      tab === 'all' ||
      (tab === 'active' && b.status === 'active') ||
      (tab === 'pending' && b.status === 'pending_approval');
    return matchSearch && matchTab;
  });

  return (
    <AccountsScreenLayout
      title="Beneficiaries"
      onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
      footer={
        <AccountsStickyCTA label="+ Add Beneficiary" onClick={() => navigate(`${base}/add`)} />
      }
    >
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search beneficiary"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm"
        />
      </div>
      <div className="flex gap-1.5 text-xs font-semibold">
        {(['all', 'active', 'pending'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-xl capitalize ${
              tab === t ? 'bg-congress-blue-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t === 'pending' ? 'Pending' : t}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => navigate(`${base}/${b.id}`)}
            className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <p className="text-sm font-bold">{b.name}</p>
            <p className="text-xs text-slate-500">{b.bankName}</p>
            <p className="text-xs font-mono text-slate-500 mt-1">A/C {b.maskedAccount}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 capitalize">● {b.status.replace('_', ' ')}</p>
            <p className="text-[10px] text-congress-blue-600 font-bold mt-2">View Details ›</p>
          </button>
        ))}
      </div>
    </AccountsScreenLayout>
  );
};

export const BeneficiaryAddScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const base = `/retail/accounts/${accountId}/manage/beneficiaries`;
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const continueFlow = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Required';
    if (!accountNumber) errs.accountNumber = 'Required';
    if (accountNumber !== confirmAccount) errs.confirm = 'Account numbers do not match';
    if (!ifsc.trim()) errs.ifsc = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const bank = searchIfsc(ifsc)[0]?.bankName || 'Bank';
    sessionStorage.setItem(
      BEN_KEY,
      JSON.stringify({ name, accountNumber, ifsc, bankName: bank })
    );
    navigate(`${base}/review`);
  };

  return (
    <AccountsScreenLayout
      title="Add Beneficiary"
      onBack={() => navigate(base)}
      footer={<AccountsStickyCTA label="Continue" onClick={continueFlow} />}
    >
      <AccountsInfoCard className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500">Beneficiary Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl border text-sm" />
          {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">Account Number</label>
          <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl border text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">Confirm Account Number</label>
          <input value={confirmAccount} onChange={(e) => setConfirmAccount(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl border text-sm" />
          {errors.confirm && <p className="text-xs text-rose-600">{errors.confirm}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">IFSC</label>
          <input value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} className="mt-1 w-full px-4 py-3 rounded-xl border text-sm font-mono" />
          {errors.ifsc && <p className="text-xs text-rose-600">{errors.ifsc}</p>}
        </div>
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const BeneficiaryReviewScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { addBeneficiary } = useBanking();
  const base = `/retail/accounts/${accountId}/manage/beneficiaries`;
  const draft = JSON.parse(sessionStorage.getItem(BEN_KEY) || '{}') as {
    name?: string;
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
  };
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  if (!draft.name) {
    navigate(`${base}/add`, { replace: true });
    return null;
  }

  const masked = `•••• ${draft.accountNumber?.slice(-4) || ''}`;

  if (done) {
    return (
      <AccountsScreenLayout title="Beneficiary Added" onBack={() => navigate(base)}>
        <div className="flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold">Beneficiary Added</h2>
          <p className="text-sm text-slate-500 mt-2">{draft.name}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">Status: Active</p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(BEN_KEY);
              navigate(base);
            }}
            className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Done
          </button>
        </div>
      </AccountsScreenLayout>
    );
  }

  return (
    <>
      <AccountsScreenLayout
        title="Review Beneficiary"
        onBack={() => navigate(`${base}/add`)}
        footer={<AccountsStickyCTA label="Add Beneficiary" onClick={() => setShowAuth(true)} />}
      >
        <AccountsInfoCard className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Beneficiary</span>
            <span className="font-bold">{draft.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Bank</span>
            <span className="font-bold">{draft.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account</span>
            <span className="font-mono font-bold">{masked}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">IFSC</span>
            <span className="font-mono font-bold">{draft.ifsc}</span>
          </div>
        </AccountsInfoCard>
      </AccountsScreenLayout>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          addBeneficiary({
            name: draft.name!,
            accountNumber: draft.accountNumber!,
            bankName: draft.bankName!,
            ifsc: draft.ifsc!,
            type: 'retail_other',
            transferLimit: 200000,
          });
          setShowAuth(false);
          setDone(true);
        }}
        title="Enter MPIN to add beneficiary"
      />
    </>
  );
};

export const BeneficiaryDetailScreen: React.FC<{ accountId: string; beneficiaryId: string }> = ({
  accountId,
  beneficiaryId,
}) => {
  const navigate = useNavigate();
  const { beneficiaries, updateBeneficiary } = useBanking();
  const ben = beneficiaries.find((b) => b.id === beneficiaryId);
  const base = `/retail/accounts/${accountId}/manage/beneficiaries`;
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [deactivated, setDeactivated] = useState(false);

  if (!ben) {
    return (
      <AccountsScreenLayout title="Beneficiary" onBack={() => navigate(base)}>
        <p className="text-sm text-slate-500">Not found.</p>
      </AccountsScreenLayout>
    );
  }

  if (deactivated) {
    return (
      <AccountsScreenLayout title="Beneficiary" onBack={() => navigate(base)}>
        <div className="flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold">Beneficiary Deactivated</h2>
          <p className="text-sm text-slate-500 mt-2">{ben.name}</p>
          <p className="text-xs text-slate-500 mt-2">Status: Inactive</p>
          <button
            type="button"
            onClick={() => navigate(base)}
            className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Done
          </button>
        </div>
      </AccountsScreenLayout>
    );
  }

  return (
    <>
      <AccountsScreenLayout title={ben.name} onBack={() => navigate(base)}>
        <AccountsInfoCard className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Bank</span>
            <span className="font-bold">{ben.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account</span>
            <span className="font-mono">{ben.maskedAccount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">IFSC</span>
            <span className="font-mono">{ben.ifsc}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span className="font-bold capitalize">{ben.status.replace('_', ' ')}</span>
          </div>
        </AccountsInfoCard>
        {ben.status === 'active' && (
          <button
            type="button"
            onClick={() => setShowDeactivate(true)}
            className="w-full py-3 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm"
          >
            Deactivate Beneficiary
          </button>
        )}
      </AccountsScreenLayout>

      <BottomSheet isOpen={showDeactivate} onClose={() => setShowDeactivate(false)} title="Deactivate Beneficiary?">
        <p className="text-sm text-slate-600 mb-2">{ben.name}</p>
        <p className="text-xs text-slate-500 mb-4">
          You won&apos;t be able to make payments to this beneficiary while it is inactive.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowDeactivate(false)} className="flex-1 py-3 rounded-2xl border font-bold text-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDeactivate(false);
              setShowAuth(true);
            }}
            className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm"
          >
            Deactivate
          </button>
        </div>
      </BottomSheet>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          updateBeneficiary(ben.id, { status: 'blocked' as Beneficiary['status'] });
          setShowAuth(false);
          setDeactivated(true);
        }}
        title="Enter MPIN to deactivate"
      />
    </>
  );
};

export const CloseAccountScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  const base = `/retail/accounts/${accountId}/manage/close`;

  if (!account) return null;

  return (
    <AccountsScreenLayout
      title="Close Account"
      onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
      footer={
        <AccountsStickyCTA label="Continue" onClick={() => navigate(`${base}/reason`)} />
      }
    >
      <AccountsInfoCard>
        <p className="text-sm font-bold">{account.accountType}</p>
        <p className="text-xs font-mono text-slate-500">{account.maskedNumber}</p>
      </AccountsInfoCard>
      <AccountsInfoCard>
        <p className="text-sm font-semibold mb-2">Before closing:</p>
        <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
          <li>Ensure there are no pending transactions</li>
          <li>Move remaining balance</li>
          <li>Cancel active mandates</li>
          <li>Resolve pending payments</li>
        </ul>
        <p className="text-sm font-bold mt-4">
          Current Balance: {formatInr(account.availableBalance)}
        </p>
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const CloseAccountReasonScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const base = `/retail/accounts/${accountId}/manage/close`;
  const [reason, setReason] = useState('no_longer');
  const [otherText, setOtherText] = useState('');

  return (
    <AccountsScreenLayout
      title="Why are you closing?"
      onBack={() => navigate(base)}
      footer={
        <AccountsStickyCTA label="Continue" onClick={() => navigate(`${base}/confirm`)} />
      }
    >
      <AccountsInfoCard className="space-y-3">
        {[
          { id: 'no_longer', label: 'No longer required' },
          { id: 'moving', label: 'Moving to another bank' },
          { id: 'service', label: 'Service preference' },
          { id: 'other', label: 'Other' },
        ].map((r) => (
          <label key={r.id} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={reason === r.id}
              onChange={() => setReason(r.id)}
              className="accent-congress-blue-700"
            />
            {r.label}
          </label>
        ))}
        {reason === 'other' && (
          <input
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Reason"
            className="w-full px-4 py-3 rounded-xl border text-sm mt-2"
          />
        )}
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const CloseAccountConfirmScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  const base = `/retail/accounts/${accountId}/manage/close`;

  if (!account) return null;

  return (
    <AccountsScreenLayout
      title="Confirm Account Closure"
      onBack={() => navigate(`${base}/reason`)}
      footer={
        <div className="fixed bottom-0 left-0 right-0 z-30 px-3 pb-4 pt-2 space-y-2 bg-linear-to-t from-slate-50 to-transparent">
          <button
            type="button"
            onClick={() => navigate(`/retail/accounts/${accountId}/manage`)}
            className="w-full py-3 rounded-2xl border font-bold text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => navigate(`${base}/auth`)}
            className="w-full py-3.5 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Continue
          </button>
        </div>
      }
    >
      <AccountsInfoCard>
        <p className="text-sm font-bold">{account.accountType}</p>
        <p className="text-xs font-mono text-slate-500">{account.maskedNumber}</p>
        <p className="text-sm font-bold mt-3">Current Balance: {formatInr(account.availableBalance)}</p>
        <p className="text-xs text-slate-500 mt-3">
          This action cannot be immediately reversed once the closure process begins.
        </p>
      </AccountsInfoCard>
    </AccountsScreenLayout>
  );
};

export const CloseAccountAuthScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const base = `/retail/accounts/${accountId}/manage/close`;
  const [showAuth, setShowAuth] = useState(true);

  return (
    <>
      <AccountsScreenLayout title="Confirm Closure" onBack={() => navigate(`${base}/confirm`)}>
        <AccountsInfoCard>
          <p className="text-sm text-slate-600">Enter MPIN or use biometric to confirm account closure.</p>
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            className="mt-4 w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
          >
            Confirm Closure
          </button>
        </AccountsInfoCard>
      </AccountsScreenLayout>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => navigate(`${base}/success`)}
        title="Enter MPIN to confirm closure"
      />
    </>
  );
};

export const CloseAccountSuccessScreen: React.FC<{ accountId: string }> = ({ accountId }) => {
  const navigate = useNavigate();
  const { accounts } = useBanking();
  const account = accounts.find((a) => a.id === accountId);
  const ref = `ACR-20260820-${accountId.slice(-4)}`;

  return (
    <AccountsScreenLayout
      title="Closure Request"
      onBack={() => navigate(`/retail/accounts/${accountId}/manage`)}
    >
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-lg font-bold">Closure Request Submitted</h2>
        {account && (
          <p className="text-sm text-slate-500 mt-2">
            {account.accountType} {account.maskedNumber}
          </p>
        )}
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          Your account closure request has been submitted successfully.
        </p>
        <p className="text-xs font-mono text-slate-400 mt-2">Reference: {ref}</p>
        <p className="text-xs text-amber-600 font-semibold mt-2">Status: Pending Closure</p>
        <button
          type="button"
          onClick={() => navigate(`/retail/accounts/${accountId}/manage`)}
          className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
        >
          Done
        </button>
      </div>
    </AccountsScreenLayout>
  );
};
