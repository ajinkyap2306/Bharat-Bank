import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Fingerprint,
  Lock,
  AlertTriangle,
  Smartphone,
  Monitor,
  LogOut,
} from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { ProfileScreen } from '../profileTypes';
import {
  ProfileLayout,
  InfoCard,
  MenuGroup,
  MenuItem,
  ToggleRow,
  StickyCTA,
  SuccessState,
  PasswordStrength,
} from '../shared/ProfileUI';
import { SecureAuthModal } from '../../../common/SecureAuthModal';
import { BottomSheet } from '../../../common/BottomSheet';

interface ScreenProps {
  onNavigate: (screen: ProfileScreen, params?: Record<string, string>) => void;
  onBack: () => void;
  params?: Record<string, string>;
}

export const SecurityCenterScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { securitySettings, trustedDevices } = useBanking();

  const checklist = [
    { label: 'Biometric login', value: securitySettings.biometricEnabled ? 'Enabled' : 'Disabled', ok: securitySettings.biometricEnabled },
    { label: 'MPIN', value: securitySettings.mpinActive ? 'Active' : 'Inactive', ok: securitySettings.mpinActive },
    { label: 'TPIN', value: securitySettings.tpinActive ? 'Active' : 'Inactive', ok: securitySettings.tpinActive },
    { label: 'Transaction authentication', value: securitySettings.transactionAuthEnabled ? 'Enabled' : 'Disabled', ok: securitySettings.transactionAuthEnabled },
    { label: 'Trusted devices', value: String(trustedDevices.length), ok: true },
    { label: 'Security alerts', value: securitySettings.securityAlertsEnabled ? 'Enabled' : 'Disabled', ok: securitySettings.securityAlertsEnabled },
  ];

  return (
    <ProfileLayout title="Security Center" onBack={onBack}>
      <InfoCard className="bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900">
        <p className="text-xs text-slate-500 uppercase tracking-wide">Security Status</p>
        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{securitySettings.securityScore}</p>
      </InfoCard>
      <InfoCard>
        {checklist.map((item) => (
          <div key={item.label} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
            <span className={`text-xs font-bold ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{item.value}</span>
          </div>
        ))}
      </InfoCard>
      <MenuGroup title="Security Actions">
        <MenuItem icon={<Lock className="w-4 h-4" />} label="Change Password" onClick={() => onNavigate('change-password')} />
        <MenuItem icon={<KeyRound className="w-4 h-4" />} label="Change MPIN" onClick={() => onNavigate('change-mpin')} />
        <MenuItem icon={<KeyRound className="w-4 h-4" />} label="Change TPIN" onClick={() => onNavigate('change-tpin')} />
        <MenuItem icon={<Shield className="w-4 h-4" />} label="Transaction Limits" onClick={() => onNavigate('transaction-limits')} />
        <MenuItem icon={<Fingerprint className="w-4 h-4" />} label="Biometric Settings" onClick={() => onNavigate('biometric-settings')} />
        <MenuItem icon={<Shield className="w-4 h-4" />} label="Transaction Authentication" onClick={() => onNavigate('transaction-auth')} />
        <MenuItem icon={<Monitor className="w-4 h-4" />} label="Login Activity" onClick={() => onNavigate('login-activity')} />
      </MenuGroup>
    </ProfileLayout>
  );
};

export const ChangePasswordScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SuccessState
        title="Password Changed"
        message="Your login password has been updated successfully."
        actionLabel="Done"
        onAction={() => onNavigate('security-center')}
      />
    );
  }

  const valid = current.length >= 6 && newPass.length >= 8 && newPass === confirm;

  return (
    <>
      <ProfileLayout title="Change Password" onBack={onBack}>
        <InfoCard className="space-y-3">
          {[
            { label: 'Current Password', value: current, set: setCurrent },
            { label: 'New Password', value: newPass, set: setNewPass },
            { label: 'Confirm Password', value: confirm, set: setConfirm },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-semibold text-slate-500">{f.label}</label>
              <div className="relative mt-1">
                <input
                  type={show ? 'text' : 'password'}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm pr-16"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-congress-blue-600">
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          ))}
          <PasswordStrength password={newPass} />
          {confirm && newPass !== confirm && <p className="text-xs text-rose-600 font-semibold">Passwords do not match</p>}
        </InfoCard>
        <StickyCTA label="Update Password" onClick={() => setShowAuth(true)} disabled={!valid} />
      </ProfileLayout>
      <SecureAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); setDone(true); }} title="Authenticate Password Change" />
    </>
  );
};

export const ChangeMpinScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [step, setStep] = useState<'verify' | 'new' | 'confirm'>('verify');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SuccessState title="MPIN Changed" message="Your 6-digit MPIN has been updated." actionLabel="Done" onAction={() => onNavigate('security-center')} />
    );
  }

  return (
    <>
      <ProfileLayout title="Change MPIN" subtitle={step === 'verify' ? 'Verify your identity' : 'Set new MPIN'} onBack={onBack}>
        <InfoCard className="text-center space-y-4">
          <p className="text-sm text-slate-600">Enter your new 6-digit MPIN. It will never be shown in plain text.</p>
          <div className="flex justify-center gap-2">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            ))}
          </div>
        </InfoCard>
        <StickyCTA label={step === 'verify' ? 'Verify Identity' : 'Confirm MPIN'} onClick={() => {
          if (step === 'verify') setShowAuth(true);
          else if (step === 'new') setStep('confirm');
          else setDone(true);
        }} />
      </ProfileLayout>
      <SecureAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); setStep('new'); }} title="Verify Identity" />
    </>
  );
};

export const ChangeTpinScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { updateSecuritySettings, addToast } = useBanking();
  const [step, setStep] = useState<'verify' | 'new' | 'confirm'>('verify');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SuccessState title="TPIN Changed" message="Your 4-digit transaction PIN has been updated." actionLabel="Done" onAction={() => onNavigate('security-center')} />
    );
  }

  return (
    <>
      <ProfileLayout title="Change TPIN" subtitle={step === 'verify' ? 'Verify your identity' : 'Set new TPIN'} onBack={onBack}>
        <InfoCard className="text-center space-y-4">
          <p className="text-sm text-slate-600">TPIN is used to authorize high-value transactions. Enter a new 4-digit TPIN.</p>
          <div className="flex justify-center gap-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            ))}
          </div>
        </InfoCard>
        <StickyCTA label={step === 'verify' ? 'Verify Identity' : step === 'new' ? 'Continue' : 'Confirm TPIN'} onClick={() => {
          if (step === 'verify') setShowAuth(true);
          else if (step === 'new') setStep('confirm');
          else {
            updateSecuritySettings({ tpinActive: true });
            addToast({ type: 'success', title: 'TPIN Updated', message: 'Your transaction PIN has been changed.' });
            setDone(true);
          }
        }} />
      </ProfileLayout>
      <SecureAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); setStep('new'); }} title="Verify Identity" />
    </>
  );
};

export const BiometricSettingsScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { securitySettings, updateSecuritySettings, addToast } = useBanking();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <ProfileLayout title="Biometric Login" onBack={onBack}>
        <InfoCard>
          <p className="text-sm text-slate-600 mb-4">
            Use biometric authentication for faster login and supported confirmations on this device.
          </p>
          <ToggleRow
            label="Biometric Login"
            description="Face ID / Fingerprint"
            checked={securitySettings.biometricEnabled}
            onChange={(v) => {
              if (v) { setShowAuth(true); }
              else {
                updateSecuritySettings({ biometricEnabled: false });
                addToast({ type: 'info', title: 'Biometric Disabled', message: 'Biometric login has been turned off.' });
              }
            }}
          />
        </InfoCard>
      </ProfileLayout>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          updateSecuritySettings({ biometricEnabled: true });
          setShowAuth(false);
          addToast({ type: 'success', title: 'Biometric Enabled', message: 'You can now use biometrics for login.' });
        }}
        title="Enable Biometric Login"
      />
    </>
  );
};

export const TransactionAuthScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { securitySettings, updateSecuritySettings } = useBanking();
  const methods = securitySettings.authMethods;

  return (
    <ProfileLayout title="Transaction Authentication" onBack={onBack}>
      <p className="text-sm text-slate-500 px-1">
        Some transactions may require additional authentication based on security rules.
      </p>
      <InfoCard>
        <ToggleRow label="MPIN" checked={methods.mpin} onChange={(v) => updateSecuritySettings({ authMethods: { ...methods, mpin: v } })} locked />
        <ToggleRow label="OTP" checked={methods.otp} onChange={(v) => updateSecuritySettings({ authMethods: { ...methods, otp: v } })} />
        <ToggleRow label="Biometric" checked={methods.biometric} onChange={(v) => updateSecuritySettings({ authMethods: { ...methods, biometric: v } })} />
      </InfoCard>
    </ProfileLayout>
  );
};

export const LoginActivityScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { loginActivity, addToast } = useBanking();

  return (
    <ProfileLayout title="Login Activity" onBack={onBack}>
      <div className="space-y-2">
        {loginActivity.map((event) => (
          <InfoCard key={event.id}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold">{event.device}</p>
                <p className="text-xs text-slate-500">{event.location}</p>
                <p className="text-xs text-slate-400 mt-1">{event.date} • {event.time}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                event.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {event.status === 'success' ? 'Successful Login' : 'Failed'}
              </span>
            </div>
          </InfoCard>
        ))}
      </div>
      <button
        type="button"
        onClick={() => addToast({ type: 'warning', title: 'Report Submitted', message: 'Our security team will review this activity.' })}
        className="w-full mt-4 py-3 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm flex items-center justify-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" /> Report Suspicious Activity
      </button>
    </ProfileLayout>
  );
};

export const DevicesSessionsScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => (
  <ProfileLayout title="Devices & Sessions" onBack={onBack}>
    <MenuGroup title="Device Management">
      <MenuItem icon={<Smartphone className="w-4 h-4" />} label="Trusted Devices" description="Manage registered devices" onClick={() => onNavigate('trusted-devices')} />
      <MenuItem icon={<Monitor className="w-4 h-4" />} label="Active Sessions" description="View and sign out sessions" onClick={() => onNavigate('active-sessions')} />
    </MenuGroup>
  </ProfileLayout>
);

export const TrustedDevicesScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { trustedDevices, removeTrustedDevice, addToast } = useBanking();
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <ProfileLayout title="Trusted Devices" onBack={onBack}>
        <div className="space-y-3">
          {trustedDevices.map((dev) => (
            <InfoCard key={dev.id}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold">{dev.name}</p>
                  {dev.isCurrent && <span className="text-[10px] font-bold text-congress-blue-600">This Device</span>}
                  <p className="text-xs text-slate-500 mt-1">{dev.os} • {dev.location}</p>
                  <p className="text-xs text-slate-400">Last active: {dev.lastActive}</p>
                </div>
                {!dev.isCurrent && (
                  <button type="button" onClick={() => setRemoveId(dev.id)} className="text-xs font-bold text-rose-600">Remove</button>
                )}
              </div>
            </InfoCard>
          ))}
        </div>
      </ProfileLayout>
      <BottomSheet isOpen={!!removeId} onClose={() => setRemoveId(null)} title="Remove Device?">
        <p className="text-sm text-slate-600 mb-4">This device will be signed out and removed from trusted devices.</p>
        <button type="button" onClick={() => setShowAuth(true)} className="w-full py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm">Remove Device</button>
      </BottomSheet>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          if (removeId) removeTrustedDevice(removeId);
          setShowAuth(false);
          setRemoveId(null);
          addToast({ type: 'success', title: 'Device Removed', message: 'The device has been signed out.' });
        }}
        title="Authenticate Device Removal"
      />
    </>
  );
};

export const ActiveSessionsScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { activeSessions, signOutSession, signOutAllOtherSessions, addToast } = useBanking();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <ProfileLayout title="Active Sessions" onBack={onBack}>
        <div className="space-y-3">
          {activeSessions.map((sess) => (
            <InfoCard key={sess.id}>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-bold">{sess.device}</p>
                  {sess.isCurrent && <span className="text-[10px] font-bold text-emerald-600">Current Session</span>}
                  <p className="text-xs text-slate-500">{sess.location}</p>
                  <p className="text-xs text-slate-400">{sess.lastActivity}</p>
                </div>
                {!sess.isCurrent && (
                  <button type="button" onClick={() => signOutSession(sess.id)} className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                )}
              </div>
            </InfoCard>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="w-full mt-4 py-3 rounded-2xl border border-rose-200 text-rose-600 font-bold text-sm"
        >
          Sign Out All Other Devices
        </button>
      </ProfileLayout>
      <BottomSheet isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Sign out all other devices?">
        <p className="text-sm text-slate-600 mb-4">All sessions except this device will be terminated.</p>
        <button type="button" onClick={() => { setShowConfirm(false); setShowAuth(true); }} className="w-full py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm">Confirm</button>
      </BottomSheet>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          signOutAllOtherSessions();
          setShowAuth(false);
          addToast({ type: 'success', title: 'Signed Out', message: 'All other sessions have been terminated.' });
        }}
        title="Authenticate Sign Out"
      />
    </>
  );
};
