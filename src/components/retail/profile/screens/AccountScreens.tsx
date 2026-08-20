import React, { useState } from 'react';
import { Wallet, Star, Eye, EyeOff, CreditCard, Snowflake, Share2 } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { BankAccount } from '../../../../types/banking';
import { ProfileScreen } from '../profileTypes';
import { shareAccountDetails } from '../../../../utils/shareAccountDetails';
import {
  ProfileLayout,
  InfoCard,
  MenuGroup,
  MenuItem,
  AccountCard,
  StickyCTA,
  SuccessState,
} from '../shared/ProfileUI';
import { BottomSheet } from '../../../common/BottomSheet';
import { SecureAuthModal } from '../../../common/SecureAuthModal';

interface ScreenProps {
  onNavigate: (screen: ProfileScreen, params?: Record<string, string>) => void;
  onBack: () => void;
  params?: Record<string, string>;
}

const eligibleAccounts = (accounts: BankAccount[]) =>
  accounts.filter((a) =>
    ['Savings', 'Current', 'NRE Savings', 'Overdraft', 'BDD'].includes(a.accountType)
  );

export const AccountsPreferencesScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => (
  <ProfileLayout title="Accounts & Preferences" onBack={onBack}>
    <MenuGroup title="Account Settings">
      <MenuItem icon={<Wallet className="w-4 h-4" />} label="Linked Accounts" description="View and manage all accounts" onClick={() => onNavigate('linked-accounts')} />
      <MenuItem icon={<Star className="w-4 h-4" />} label="Set Primary Account" description="Default for payments & transfers" onClick={() => onNavigate('set-primary')} />
      <MenuItem icon={<CreditCard className="w-4 h-4" />} label="Default Debit Account" description="Fund transfer & bill payments" onClick={() => onNavigate('default-debit')} />
      <MenuItem icon={<EyeOff className="w-4 h-4" />} label="Hide / Show Account" description="Control dashboard visibility" onClick={() => onNavigate('hide-account')} />
      <MenuItem icon={<Snowflake className="w-4 h-4" />} label="Freeze Account" description="Block outgoing debits temporarily" onClick={() => onNavigate('freeze-account')} />
    </MenuGroup>
  </ProfileLayout>
);

export const LinkedAccountsScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { accounts, primaryAccountId, isAccountHidden } = useBanking();
  const linked = eligibleAccounts(accounts);

  return (
    <ProfileLayout title="Linked Accounts" subtitle={`${linked.length} eligible accounts`} onBack={onBack}>
      <div className="space-y-3">
        {linked.map((acc) => (
          <AccountCard
            key={acc.id}
            accountType={acc.accountType}
            maskedNumber={acc.maskedNumber}
            balance={acc.availableBalance}
            nickname={acc.nickname}
            status={acc.status}
            isPrimary={acc.id === primaryAccountId}
            isHidden={isAccountHidden(acc.id)}
            onClick={() => onNavigate('account-details', { accountId: acc.id })}
          />
        ))}
      </div>
    </ProfileLayout>
  );
};

export const AccountDetailsScreen: React.FC<ScreenProps> = ({ onNavigate, onBack, params }) => {
  const { accounts, primaryAccountId, addToast } = useBanking();
  const account = accounts.find((a) => a.id === params?.accountId);

  if (!account) return <ProfileLayout title="Account" onBack={onBack}><p className="text-sm text-slate-500">Account not found.</p></ProfileLayout>;

  const handleShare = async () => {
    const result = await shareAccountDetails(
      {
        accountType: account.accountType,
        accountNumber: account.accountNumber,
        ifsc: account.ifsc,
        branch: account.branch,
        accountHolder: account.nickname,
      },
      (message) => addToast({ type: 'info', title: 'Share', message })
    );
    if (result === 'shared') {
      addToast({ type: 'success', title: 'Shared', message: 'Account details shared successfully.' });
    }
  };

  return (
    <ProfileLayout title={account.nickname || account.accountType} subtitle={account.maskedNumber} onBack={onBack}>
      <InfoCard>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">IFSC</span><span className="font-mono font-semibold">{account.ifsc}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Branch</span><span className="font-semibold text-right max-w-[60%]">{account.branch}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Available</span><span className="font-bold">₹{account.availableBalance.toLocaleString('en-IN')}</span></div>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="mt-3 w-full py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 text-xs font-bold flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Account (IFSC) Details
        </button>
      </InfoCard>
      <MenuGroup title="Actions">
        <MenuItem icon={<Star className="w-4 h-4" />} label="Set as Primary" description={account.id === primaryAccountId ? 'Currently primary' : 'Use for default payments'} onClick={() => onNavigate('set-primary', { accountId: account.id })} />
        <MenuItem icon={<Wallet className="w-4 h-4" />} label="Edit Nickname" description={account.nickname || 'Add a personal name'} onClick={() => onNavigate('account-nickname', { accountId: account.id })} />
        <MenuItem icon={<EyeOff className="w-4 h-4" />} label="Account Preferences" description="Hide from dashboard" onClick={() => onNavigate('hide-account', { accountId: account.id })} />
        <MenuItem icon={<Snowflake className="w-4 h-4" />} label={account.status === 'frozen' ? 'Unfreeze Account' : 'Freeze Account'} description={account.status === 'frozen' ? 'Restore debits' : 'Block outgoing debits'} onClick={() => onNavigate('freeze-account', { accountId: account.id })} />
      </MenuGroup>
    </ProfileLayout>
  );
};

export const SetPrimaryAccountScreen: React.FC<ScreenProps> = ({ onNavigate, onBack, params }) => {
  const { accounts, primaryAccountId, setPrimaryAccount } = useBanking();
  const linked = eligibleAccounts(accounts);
  const [selectedId, setSelectedId] = useState(params?.accountId || primaryAccountId);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SuccessState
        title="Primary Account Updated"
        message="This account will be used as the default for eligible payments and transfers."
        actionLabel="Done"
        onAction={() => onNavigate('linked-accounts')}
      />
    );
  }

  return (
    <>
      <ProfileLayout title="Set Primary Account" onBack={onBack}>
        <p className="text-sm text-slate-500 px-1">
          This account will be used as the default for eligible payments and transfers.
        </p>
        <div className="space-y-2">
          {linked.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => setSelectedId(acc.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-colors ${
                selectedId === acc.id
                  ? 'border-congress-blue-600 bg-congress-blue-50/50 dark:bg-congress-blue-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <p className="text-sm font-bold">{acc.nickname || acc.accountType}</p>
              <p className="text-xs text-slate-500 font-mono">{acc.maskedNumber}</p>
            </button>
          ))}
        </div>
        <StickyCTA label="Set as Primary" onClick={() => setShowConfirm(true)} disabled={selectedId === primaryAccountId} />
      </ProfileLayout>

      <BottomSheet isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Set this as your primary account?">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          This account will be used as the default account for eligible payments and transfers.
        </p>
        <button
          type="button"
          onClick={() => { setShowConfirm(false); setShowAuth(true); }}
          className="w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
        >
          Set as Primary
        </button>
      </BottomSheet>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setPrimaryAccount(selectedId);
          setShowAuth(false);
          setDone(true);
        }}
        title="Authenticate Primary Account Change"
      />
    </>
  );
};

export const DefaultDebitAccountScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { accounts, defaultDebitAccountId, setDefaultDebitAccount, getDefaultDebitAccount } = useBanking();
  const linked = eligibleAccounts(accounts);
  const current = getDefaultDebitAccount();
  const [selectedId, setSelectedId] = useState(defaultDebitAccountId);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <SuccessState
        title="Default Debit Account Updated"
        message="This account will appear as default in fund transfers, bill payments, and other eligible flows."
        actionLabel="Done"
        onAction={() => onNavigate('accounts-preferences')}
      />
    );
  }

  return (
    <ProfileLayout title="Default Debit Account" onBack={onBack}>
      <InfoCard>
        <p className="text-xs text-slate-500">Current</p>
        <p className="text-sm font-bold mt-1">{current.accountType} {current.maskedNumber}</p>
      </InfoCard>
      <p className="text-xs text-slate-500 px-1">Used for fund transfer, bill payments, investments, insurance premiums, and deposits.</p>
      <div className="space-y-2">
        {linked.map((acc) => (
          <button
            key={acc.id}
            type="button"
            onClick={() => setSelectedId(acc.id)}
            className={`w-full p-4 rounded-2xl border text-left ${
              selectedId === acc.id ? 'border-congress-blue-600 bg-congress-blue-50/50' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <p className="text-sm font-bold">{acc.accountType} {acc.maskedNumber}</p>
            <p className="text-xs text-slate-500">₹{acc.availableBalance.toLocaleString('en-IN')} available</p>
          </button>
        ))}
      </div>
      <StickyCTA
        label="Change Account"
        onClick={() => { setDefaultDebitAccount(selectedId); setSaved(true); }}
        disabled={selectedId === defaultDebitAccountId}
      />
    </ProfileLayout>
  );
};

export const AccountNicknameScreen: React.FC<ScreenProps> = ({ onNavigate, onBack, params }) => {
  const { accounts, updateAccountNickname } = useBanking();
  const account = accounts.find((a) => a.id === params?.accountId);
  const [nickname, setNickname] = useState(account?.nickname || '');

  if (!account) return null;

  return (
    <ProfileLayout title="Edit Nickname" subtitle={account.maskedNumber} onBack={onBack}>
      <InfoCard>
        <label className="text-xs font-semibold text-slate-500">Account Nickname</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="e.g. My Personal Savings"
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
        />
      </InfoCard>
      <StickyCTA
        label="Save"
        onClick={() => {
          updateAccountNickname(account.id, nickname);
          onNavigate('account-details', { accountId: account.id });
        }}
      />
    </ProfileLayout>
  );
};

export const HideAccountScreen: React.FC<ScreenProps> = ({ onNavigate, onBack, params }) => {
  const { accounts, isAccountHidden, toggleAccountVisibility, addToast } = useBanking();
  const linked = eligibleAccounts(accounts);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <>
      <ProfileLayout title="Hide / Show Account" subtitle="Hidden accounts won't appear on Home" onBack={onBack}>
        <div className="space-y-2">
          {linked.map((acc) => {
            const hidden = isAccountHidden(acc.id);
            return (
              <div key={acc.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-bold">{acc.nickname || acc.accountType}</p>
                  <p className="text-xs text-slate-500 font-mono">{acc.maskedNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmId(acc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    hidden ? 'bg-congress-blue-100 text-congress-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {hidden ? 'Show' : 'Hide'}
                </button>
              </div>
            );
          })}
        </div>
      </ProfileLayout>

      <BottomSheet
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        title={confirmId && isAccountHidden(confirmId) ? 'Show Account?' : 'Hide Account?'}
      >
        <p className="text-sm text-slate-600 mb-4">
          {confirmId && isAccountHidden(confirmId)
            ? 'This account will appear on your Home dashboard again.'
            : 'This account will be hidden from Home but remains accessible here.'}
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirmId) {
              toggleAccountVisibility(confirmId);
              addToast({
                type: 'success',
                title: isAccountHidden(confirmId) ? 'Account Visible' : 'Account Hidden',
                message: 'Dashboard visibility updated.',
              });
            }
            setConfirmId(null);
          }}
          className="w-full py-3 rounded-2xl bg-congress-blue-700 text-white font-bold text-sm"
        >
          Confirm
        </button>
      </BottomSheet>
    </>
  );
};

export const FreezeAccountScreen: React.FC<ScreenProps> = ({ onBack, params }) => {
  const { accounts, freezeAccount, unfreezeAccount } = useBanking();
  const linked = eligibleAccounts(accounts);
  const [selectedId, setSelectedId] = useState(params?.accountId || linked[0]?.id || '');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  const selected = linked.find((a) => a.id === selectedId);
  const isFrozen = selected?.status === 'frozen';

  if (done) {
    return (
      <SuccessState
        title={isFrozen ? 'Account Frozen' : 'Account Unfrozen'}
        message={
          isFrozen
            ? 'Outgoing debits are blocked. Credits will still be accepted.'
            : 'Your account is fully operational again.'
        }
        actionLabel="Done"
        onAction={onBack}
      />
    );
  }

  return (
    <ProfileLayout
      title={isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
      subtitle="Temporarily block outgoing debits for security"
      onBack={onBack}
    >
      <InfoCard className="space-y-3">
        <p className="text-xs text-slate-500 leading-relaxed">
          Freezing blocks transfers, bill payments, and cheques from this account. You can unfreeze anytime with MPIN authentication.
        </p>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-900"
        >
          {linked.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.accountType} {acc.maskedNumber} {acc.status === 'frozen' ? '(Frozen)' : ''}
            </option>
          ))}
        </select>
      </InfoCard>
      <StickyCTA
        label={isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
        onClick={() => setShowAuth(true)}
      />
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (!selectedId) return;
          if (isFrozen) unfreezeAccount(selectedId);
          else freezeAccount(selectedId);
          setShowAuth(false);
          setDone(true);
        }}
        title="Authenticate account change"
      />
    </ProfileLayout>
  );
};

export const CardsPaymentsScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { cards, defaultCardId, setRetailTab } = useBanking();
  const defaultCard = cards.find((c) => c.id === defaultCardId) || cards[0];

  return (
    <ProfileLayout title="Cards & Payments" onBack={onBack}>
      <MenuGroup title="Cards">
        <MenuItem
          icon={<CreditCard className="w-4 h-4" />}
          label="My Cards"
          description={`${cards.length} active cards`}
          onClick={() => setRetailTab('cards')}
        />
        <MenuItem
          icon={<Star className="w-4 h-4" />}
          label="Default Card"
          description={defaultCard ? defaultCard.maskedNumber : 'Not set'}
          onClick={() => onNavigate('default-card')}
        />
      </MenuGroup>
      <MenuGroup title="Payment Preferences">
        <MenuItem icon={<Wallet className="w-4 h-4" />} label="Default Payment Account" description="Linked to debit account preference" onClick={() => onNavigate('default-debit')} />
        <MenuItem icon={<CreditCard className="w-4 h-4" />} label="Payment Preferences" description="Limits & authorization" onClick={() => onNavigate('payment-preferences')} />
        <MenuItem icon={<Wallet className="w-4 h-4" />} label="Beneficiary Preferences" description="Manage payees" onClick={() => setRetailTab('payments')} />
        <MenuItem icon={<CreditCard className="w-4 h-4" />} label="Saved Billers" description="Quick bill payments" onClick={() => setRetailTab('bills')} />
      </MenuGroup>
    </ProfileLayout>
  );
};

export const DefaultCardScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { cards, defaultCardId, setDefaultCard, addToast } = useBanking();
  const [selected, setSelected] = useState(defaultCardId || cards[0]?.id);

  return (
    <ProfileLayout title="Default Card" onBack={onBack}>
      <p className="text-sm text-slate-500 px-1">Preferred card for supported online and contactless payments.</p>
      <div className="space-y-2">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelected(card.id)}
            className={`w-full p-4 rounded-2xl border text-left ${
              selected === card.id ? 'border-congress-blue-600 bg-congress-blue-50/50' : 'border-slate-200'
            }`}
          >
            <p className="text-sm font-bold capitalize">{card.cardType} {card.maskedNumber}</p>
            <p className="text-xs text-slate-500">{card.network} • Exp {card.expiry}</p>
          </button>
        ))}
      </div>
      <StickyCTA
        label="Save Default Card"
        onClick={() => {
          setDefaultCard(selected);
          addToast({ type: 'success', title: 'Default Card Updated', message: 'Your preferred card has been saved.' });
          onBack();
        }}
      />
    </ProfileLayout>
  );
};

export const PaymentPreferencesScreen: React.FC<ScreenProps> = ({ onBack }) => (
  <ProfileLayout title="Payment Preferences" onBack={onBack}>
    <InfoCard>
      <p className="text-sm text-slate-600">
        Payment limits and authorization preferences are managed in Security Center. Default accounts are set under Accounts & Preferences.
      </p>
    </InfoCard>
  </ProfileLayout>
);
