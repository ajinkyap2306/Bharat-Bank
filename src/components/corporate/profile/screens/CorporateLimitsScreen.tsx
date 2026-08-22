import React, { useState } from 'react';
import { useBanking } from '../../../../context/BankingContext';
import { useCorporateProfileView } from '../../../../hooks/useCorporateProfileView';
import { ProfileCard, ProfileDetailRow } from '../shared/ProfileUI';
import { RouteLoadingState } from '../../../common/RouteLoadingState';
import { CORPORATE_PROFILE_DATA } from '../../../../data/corporateProfileMock';

export const CorporateLimitsScreen: React.FC = () => {
  const { addToast } = useBanking();
  const { view } = useCorporateProfileView();
  const [limits, setLimits] = useState(CORPORATE_PROFILE_DATA.limits);
  const [editing, setEditing] = useState(false);

  if (!view) {
    return <RouteLoadingState label="Loading limits…" />;
  }

  const isChecker = view.role === 'checker';

  const handleSave = () => {
    setEditing(false);
    addToast({
      type: 'success',
      title: 'Limits updated',
      message: 'Your corporate transaction limits have been saved (demo).',
    });
  };

  return (
    <div className="py-4 space-y-4 px-4">
      <ProfileCard className="divide-y divide-slate-200 dark:divide-slate-800 dark:divide-slate-800">
        {view.limits.items.map((item) => (
          <ProfileDetailRow key={item.label} label={item.label} value={item.value} />
        ))}
      </ProfileCard>

      {!isChecker && (
        <ProfileCard className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Update Limits</p>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Daily payment limit (₹)</label>
                <input
                  type="number"
                  value={limits.dailyPaymentLimit}
                  onChange={(e) => setLimits((prev) => ({ ...prev, dailyPaymentLimit: Number(e.target.value) }))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Single transaction limit (₹)</label>
                <input
                  type="number"
                  value={limits.singleTransactionLimit}
                  onChange={(e) => setLimits((prev) => ({ ...prev, singleTransactionLimit: Number(e.target.value) }))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Bulk payment limit (₹)</label>
                <input
                  type="number"
                  value={limits.bulkPaymentLimit}
                  onChange={(e) => setLimits((prev) => ({ ...prev, bulkPaymentLimit: Number(e.target.value) }))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3 rounded-2xl bg-congress-blue-700 text-white text-sm font-bold"
              >
                Save Limits
              </button>
            </>
          ) : (
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Daily limit</span><span className="font-semibold">₹{limits.dailyPaymentLimit.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Per transaction</span><span className="font-semibold">₹{limits.singleTransactionLimit.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Bulk limit</span><span className="font-semibold">₹{limits.bulkPaymentLimit.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Used today</span><span className="font-semibold">₹{limits.usedToday.toLocaleString('en-IN')}</span></div>
            </div>
          )}
        </ProfileCard>
      )}

      <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1 text-center">
        {isChecker
          ? 'Approval limits are read-only. Contact your relationship manager to request changes.'
          : 'Channel-wise and account-wise limits are applied per your corporate banking agreement.'}
      </p>
    </div>
  );
};
