import React, { useEffect, useState } from 'react';
import { useCorporateProfileView } from '../../../../hooks/useCorporateProfileView';
import type { CorporateNotificationPref } from '../../../../types/corporateProfile';
import { ProfileCard } from '../shared/ProfileUI';
import { RouteLoadingState } from '../../../common/RouteLoadingState';

export const NotificationPreferencesScreen: React.FC = () => {
  const { view } = useCorporateProfileView();
  const [prefs, setPrefs] = useState<CorporateNotificationPref[]>([]);

  useEffect(() => {
    if (view?.notificationPrefs) {
      setPrefs(view.notificationPrefs);
    }
  }, [view]);

  if (!view) {
    return <RouteLoadingState label="Loading notifications…" />;
  }

  const toggle = (id: string) => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <div className="py-4">
      <p className="text-[12px] text-[#667085] px-4 mb-3">
        {view.role === 'checker'
          ? 'Approval and payment notifications for checker role.'
          : 'Request status and payment notifications for maker role.'}
      </p>
      <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        {prefs.map((pref) => (
          <div key={pref.id} className="px-4 py-3.5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-[#111827] dark:text-white">{pref.label}</p>
              <p className="text-[12px] text-[#667085] mt-0.5">{pref.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pref.enabled}
              aria-label={`${pref.label} notifications`}
              onClick={() => toggle(pref.id)}
              className={`shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors ${
                pref.enabled ? 'bg-[#0B5CAB]' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  pref.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </ProfileCard>
    </div>
  );
};
