import React, { useState } from 'react';
import { Snowflake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { getAccountById } from '../../../../data/corporateAccountsMock';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { SecureAuthModal } from '../../../common/SecureAuthModal';

interface CorporateFreezeAccountScreenProps {
  accountId: string;
}

export const CorporateFreezeAccountScreen: React.FC<CorporateFreezeAccountScreenProps> = ({
  accountId,
}) => {
  const navigate = useNavigate();
  const {
    corporateAccounts,
    freezeCorporateAccount,
    unfreezeCorporateAccount,
    setBottomNavHidden,
  } = useBanking();
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);
  const [completedAction, setCompletedAction] = useState<'freeze' | 'unfreeze'>('freeze');

  const account = getAccountById(accountId);
  const ctxAccount = corporateAccounts.find((a) => a.id === accountId);
  const isFrozen = ctxAccount?.status === 'frozen' || account?.displayStatus === 'Restricted';

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  if (!account) {
    return (
      <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full p-4">
        <p className="text-sm text-slate-500">Account not found.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full flex flex-col items-center text-center px-4 pt-16">
        <Snowflake className="w-14 h-14 text-blue-600 mb-4" />
        <h2 className="text-xl font-extrabold">
          {completedAction === 'freeze' ? 'Account Frozen' : 'Account Unfrozen'}
        </h2>
        <p className="text-xs text-slate-500 mt-2 max-w-xs">
          {completedAction === 'freeze'
            ? 'Outgoing debits are blocked. Credits will still be accepted.'
            : 'Full account operations have been restored.'}
        </p>
        <button
          type="button"
          onClick={() => navigate(`/corporate/accounts/${accountId}`)}
          className="mt-8 w-full max-w-sm py-3.5 bg-[#0B5CAB] text-white font-bold rounded-2xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="-mx-3 bg-[#F7F9FC] dark:bg-slate-950 min-h-full pb-8">
      <ScreenHeader
        title={isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
        subtitle={account.nickname}
        onBack={() => navigate(`/corporate/accounts/${accountId}/preferences`)}
        edgeToEdge={false}
      />

      <div className="px-4 pt-3 space-y-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 leading-relaxed">
            Freezing blocks vendor payments, transfers, and cheques from this account. You can unfreeze anytime with authentication.
          </p>
          <p className="text-sm font-bold mt-3">{account.accountType}</p>
          <p className="text-xs text-slate-500 font-mono">{account.maskedNumber}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAuth(true)}
          className="w-full py-3.5 bg-[#0B5CAB] text-white font-bold rounded-2xl"
        >
          {isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
        </button>
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (isFrozen) {
            unfreezeCorporateAccount(accountId);
            setCompletedAction('unfreeze');
          } else {
            freezeCorporateAccount(accountId);
            setCompletedAction('freeze');
          }
          setShowAuth(false);
          setDone(true);
        }}
        title="Authenticate account change"
      />
    </div>
  );
};
