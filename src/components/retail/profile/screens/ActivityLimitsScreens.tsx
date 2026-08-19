import React from 'react';
import {
  LogIn,
  SendHorizontal,
  User,
  Shield,
  Receipt,
  Landmark,
} from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { ProfileScreen } from '../profileTypes';
import { ProfileLayout, InfoCard } from '../shared/ProfileUI';
import { SecureAuthModal } from '../../../common/SecureAuthModal';
import type { ActivityEvent } from '../../../../data/level4Mock';
import type { RetailTransactionLimits } from '../../../../data/level4Mock';

interface ScreenProps {
  onNavigate: (screen: ProfileScreen) => void;
  onBack: () => void;
}

const CATEGORY_ICON: Record<ActivityEvent['category'], React.ReactNode> = {
  login: <LogIn className="w-4 h-4" />,
  transfer: <SendHorizontal className="w-4 h-4" />,
  profile: <User className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
  payment: <Receipt className="w-4 h-4" />,
  deposit: <Landmark className="w-4 h-4" />,
};

export const MyActivityScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { activityEvents } = useBanking();

  return (
    <ProfileLayout title="My Activity" subtitle="Login, transfers & profile changes" onBack={onBack}>
      <div className="space-y-2">
        {activityEvents.map((event) => (
          <InfoCard key={event.id}>
            <div className="flex gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                event.status === 'warning' ? 'bg-amber-50 text-amber-600' :
                event.status === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {CATEGORY_ICON[event.category]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{event.title}</p>
                <p className="text-xs text-slate-500 truncate">{event.description}</p>
                <p className="text-[10px] text-slate-400 mt-1">{event.timestamp}</p>
              </div>
            </div>
          </InfoCard>
        ))}
      </div>
    </ProfileLayout>
  );
};

const LIMIT_FIELDS: { key: keyof RetailTransactionLimits; label: string; step: number }[] = [
  { key: 'impsDaily', label: 'IMPS Daily Limit (₹)', step: 10000 },
  { key: 'neftDaily', label: 'NEFT Daily Limit (₹)', step: 25000 },
  { key: 'rtgsDaily', label: 'RTGS Daily Limit (₹)', step: 100000 },
  { key: 'upiDaily', label: 'UPI Daily Limit (₹)', step: 5000 },
  { key: 'beneficiaryAddDaily', label: 'Max Beneficiaries / Day', step: 1 },
  { key: 'cardlessDaily', label: 'Cardless Cash Daily (₹)', step: 1000 },
];

export const TransactionLimitsScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { retailTransactionLimits, updateRetailTransactionLimits, addToast } = useBanking();
  const [draft, setDraft] = React.useState(retailTransactionLimits);
  const [showAuth, setShowAuth] = React.useState(false);

  return (
    <>
      <ProfileLayout title="Transaction Limits" subtitle="Channel-wise daily limits" onBack={onBack}>
        <InfoCard className="space-y-4">
          {LIMIT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-500">{f.label}</label>
              <input
                type="number"
                value={draft[f.key]}
                onChange={(e) => setDraft((prev) => ({ ...prev, [f.key]: Number(e.target.value) || 0 }))}
                step={f.step}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>
          ))}
        </InfoCard>
        <button
          type="button"
          onClick={() => setShowAuth(true)}
          className="w-full mt-4 py-3.5 bg-blue-600 text-white font-bold rounded-2xl"
        >
          Update Limits
        </button>
      </ProfileLayout>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          updateRetailTransactionLimits(draft);
          setShowAuth(false);
          addToast({ type: 'success', title: 'Limits Updated', message: 'Your transaction limits have been saved.' });
        }}
        title="Authenticate limit change"
      />
    </>
  );
};
