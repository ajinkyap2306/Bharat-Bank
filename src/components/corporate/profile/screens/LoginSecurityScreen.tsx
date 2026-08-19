import React, { useState } from 'react';
import { Fingerprint, KeyRound, MonitorSmartphone, Shield } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { useCorporateProfileView } from '../../../../hooks/useCorporateProfileView';
import { ProfileCard, ProfileDetailRow } from '../shared/ProfileUI';
import { RouteLoadingState } from '../../../common/RouteLoadingState';

export const LoginSecurityScreen: React.FC = () => {
  const { addToast } = useBanking();
  const { view } = useCorporateProfileView();
  const [biometric, setBiometric] = useState(true);
  const [mpin, setMpin] = useState(true);

  if (!view) {
    return <RouteLoadingState label="Loading security settings…" />;
  }

  const toggle = (label: string, value: boolean, setter: (v: boolean) => void) => {
    setter(!value);
    addToast({
      type: 'info',
      title: label,
      message: `${label} ${!value ? 'enabled' : 'disabled'} for this device.`,
    });
  };

  return (
    <div className="py-4 space-y-4">
      <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        <ProfileDetailRow label="Last Login" value={view.security.lastLogin} />
        <ProfileDetailRow label="Last Login Device" value={view.security.lastLoginDevice} />
      </ProfileCard>

      <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        {[
          { id: 'bio', label: 'Biometric Login', icon: Fingerprint, value: biometric, set: setBiometric },
          { id: 'mpin', label: 'MPIN Login', icon: KeyRound, value: mpin, set: setMpin },
        ].map(({ id, label, icon: Icon, value, set }) => (
          <div key={id} className="px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0B5CAB]/8 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
              </div>
              <span className="text-[14px] font-medium text-[#111827] dark:text-white">{label}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={value}
              onClick={() => toggle(label, value, set)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                value ? 'bg-[#0B5CAB]' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  value ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addToast({ type: 'info', title: 'Change MPIN', message: 'MPIN change flow will open in production.' })
          }
          className="w-full px-4 py-3.5 flex items-center gap-3 text-left min-h-12 active:bg-[#F7F9FC]"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0B5CAB]/8 flex items-center justify-center">
            <KeyRound className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
          </div>
          <span className="text-[14px] font-medium text-[#111827] dark:text-white">Change MPIN</span>
        </button>
        <button
          type="button"
          onClick={() =>
            addToast({
              type: 'info',
              title: 'Manage Devices',
              message: 'This device is registered and trusted. 1 active device linked to your profile.',
            })
          }
          className="w-full px-4 py-3.5 flex items-center gap-3 text-left min-h-12 active:bg-[#F7F9FC]"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0B5CAB]/8 flex items-center justify-center">
            <MonitorSmartphone className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
          </div>
          <span className="text-[14px] font-medium text-[#111827] dark:text-white">Manage Devices</span>
        </button>
        <button
          type="button"
          onClick={() =>
            addToast({ type: 'info', title: 'Active Sessions', message: '1 active session on this device.' })
          }
          className="w-full px-4 py-3.5 flex items-center gap-3 text-left min-h-12 active:bg-[#F7F9FC]"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0B5CAB]/8 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
          </div>
          <span className="text-[14px] font-medium text-[#111827] dark:text-white">Active Sessions</span>
        </button>
      </ProfileCard>
    </div>
  );
};
