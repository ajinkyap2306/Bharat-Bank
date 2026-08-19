import React, { useState } from 'react';
import { Gift, Tag, Star } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { BANKING_OFFERS, REWARD_CATALOG } from '../../../data/level5Mock';

export const RewardsModule: React.FC = () => {
  const { rewardPoints, redeemReward, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [tab, setTab] = useState<'rewards' | 'offers'>('rewards');
  const [redeemId, setRedeemId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const selectedReward = REWARD_CATALOG.find((r) => r.id === redeemId);

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Rewards & Offers" subtitle="Points, deals & exclusives" onBack={() => setRetailTab('services')} />

      <div className="p-4 mx-0 mt-2 rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 text-white">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Reward Points</span>
        </div>
        <p className="text-3xl font-black mt-1">{rewardPoints.toLocaleString('en-IN')}</p>
        <p className="text-[11px] text-amber-100 mt-0.5">Worth ≈ ₹{Math.floor(rewardPoints / 5).toLocaleString('en-IN')} in vouchers</p>
      </div>

      <div className="flex gap-2 px-1 pt-3">
        {(['rewards', 'offers'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize flex items-center justify-center gap-1 ${tab === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
            {t === 'rewards' ? <Gift className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
            {t}
          </button>
        ))}
      </div>

      <div className="pt-3 pb-6 space-y-2">
        {tab === 'rewards' ? (
          REWARD_CATALOG.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3">
              <div>
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-xs text-amber-600 font-bold">{r.points.toLocaleString('en-IN')} pts</p>
              </div>
              <button
                type="button"
                disabled={rewardPoints < r.points}
                onClick={() => { setRedeemId(r.id); setShowAuth(true); }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold disabled:opacity-40"
              >
                Redeem
              </button>
            </div>
          ))
        ) : (
          BANKING_OFFERS.map((o) => (
            <div key={o.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold uppercase text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">{o.category}</span>
              <p className="text-sm font-bold mt-2">{o.title}</p>
              <p className="text-xs text-slate-500 mt-1">{o.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] text-slate-400">Valid till {o.validTill}</span>
                <button type="button" onClick={() => addToast({ type: 'info', title: o.cta, message: 'Offer applied to your session.' })} className="text-xs font-bold text-blue-600">{o.cta}</button>
              </div>
            </div>
          ))
        )}
      </div>

      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => { setShowAuth(false); setRedeemId(null); }}
        onSuccess={() => {
          if (redeemId && selectedReward) redeemReward(redeemId, selectedReward.points, selectedReward.name);
          setShowAuth(false);
          setRedeemId(null);
        }}
        title="Confirm redemption"
      />
    </div>
  );
};
