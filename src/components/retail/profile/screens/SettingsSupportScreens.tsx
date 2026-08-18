import React, { useState } from 'react';
import {
  Bell,
  Shield,
  Settings,
  FileText,
  Headphones,
  Phone,
  MessageCircle,
  AlertOctagon,
  Building2,
  HelpCircle,
  Download,
  Share2,
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
  SegmentedControl,
  Timeline,
} from '../shared/ProfileUI';
import { BottomSheet } from '../../../common/BottomSheet';
import { SecureAuthModal } from '../../../common/SecureAuthModal';

interface ScreenProps {
  onNavigate: (screen: ProfileScreen, params?: Record<string, string>) => void;
  onBack: () => void;
  params?: Record<string, string>;
}

export const NotificationsScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { notificationPrefs, updateNotificationPrefs } = useBanking();

  const sections = [
    {
      title: 'Transaction Alerts',
      items: [
        { key: 'moneyReceived' as const, label: 'Money received' },
        { key: 'moneySent' as const, label: 'Money sent' },
        { key: 'paymentCompleted' as const, label: 'Payment completed' },
        { key: 'paymentFailed' as const, label: 'Payment failed' },
      ],
    },
    {
      title: 'Card Alerts',
      items: [
        { key: 'cardTransaction' as const, label: 'Card transaction' },
        { key: 'cardBlocked' as const, label: 'Card blocked' },
        { key: 'cardLimitChanged' as const, label: 'Card limit changed' },
      ],
    },
    {
      title: 'Security Alerts',
      items: [
        { key: 'newLogin' as const, label: 'New login', locked: true },
        { key: 'deviceAdded' as const, label: 'Device added', locked: true },
        { key: 'passwordChanged' as const, label: 'Password changed', locked: true },
        { key: 'mpinChanged' as const, label: 'MPIN changed', locked: true },
      ],
    },
    {
      title: 'Service Alerts',
      items: [
        { key: 'loanUpdates' as const, label: 'Loan updates' },
        { key: 'depositMaturity' as const, label: 'Deposit maturity' },
        { key: 'insuranceRenewal' as const, label: 'Insurance renewal' },
        { key: 'investmentUpdates' as const, label: 'Investment updates' },
      ],
    },
    {
      title: 'Promotional',
      items: [
        { key: 'offers' as const, label: 'Offers' },
        { key: 'rewards' as const, label: 'Rewards' },
        { key: 'productUpdates' as const, label: 'Product updates' },
      ],
    },
  ];

  return (
    <ProfileLayout title="Notifications" onBack={onBack}>
      {sections.map((section) => (
        <InfoCard key={section.title}>
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">{section.title}</p>
          {section.items.map((item) => (
            <ToggleRow
              key={item.key}
              label={item.label}
              checked={notificationPrefs[item.key]}
              locked={'locked' in item && item.locked}
              onChange={(v) => updateNotificationPrefs({ [item.key]: v })}
            />
          ))}
        </InfoCard>
      ))}
    </ProfileLayout>
  );
};

export const PrivacyScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { privacyPrefs, updatePrivacyPrefs, addToast } = useBanking();

  return (
    <ProfileLayout title="Privacy & Consent" onBack={onBack}>
      <InfoCard>
        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Marketing Preferences</p>
        <ToggleRow label="Marketing Emails" checked={privacyPrefs.marketingEmails} onChange={(v) => updatePrivacyPrefs({ marketingEmails: v })} />
        <ToggleRow label="Marketing SMS" checked={privacyPrefs.marketingSms} onChange={(v) => updatePrivacyPrefs({ marketingSms: v })} />
        <ToggleRow label="Push Notifications" checked={privacyPrefs.marketingPush} onChange={(v) => updatePrivacyPrefs({ marketingPush: v })} />
      </InfoCard>
      <InfoCard>
        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Data Preferences</p>
        <ToggleRow label="Analytics & Personalization" checked={privacyPrefs.dataAnalytics} onChange={(v) => updatePrivacyPrefs({ dataAnalytics: v })} />
        <ToggleRow label="Third-party Sharing" checked={privacyPrefs.thirdPartySharing} onChange={(v) => updatePrivacyPrefs({ thirdPartySharing: v })} />
      </InfoCard>
      <MenuGroup title="Legal">
        <MenuItem icon={<FileText className="w-4 h-4" />} label="Privacy Policy" onClick={() => addToast({ type: 'info', title: 'Privacy Policy', message: 'Opening privacy policy document.' })} />
        <MenuItem icon={<Shield className="w-4 h-4" />} label="Terms & Conditions" onClick={() => addToast({ type: 'info', title: 'Terms', message: 'Opening terms and conditions.' })} />
        <MenuItem icon={<Settings className="w-4 h-4" />} label="Consent Management" onClick={() => addToast({ type: 'info', title: 'Consents', message: 'View regulatory consents on file.' })} />
      </MenuGroup>
    </ProfileLayout>
  );
};

export const AppPreferencesScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { appPrefs, updateAppPrefs, toggleDarkMode, isDarkMode } = useBanking();

  return (
    <ProfileLayout title="App Preferences" onBack={onBack}>
      <InfoCard className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Language</p>
          <SegmentedControl
            options={[{ value: 'English', label: 'English' }, { value: 'Hindi', label: 'हिंदी' }]}
            value={appPrefs.language}
            onChange={(v) => updateAppPrefs({ language: v })}
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Theme</p>
          <SegmentedControl
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
            value={appPrefs.theme}
            onChange={(v) => {
              updateAppPrefs({ theme: v as 'light' | 'dark' | 'system' });
              if (v === 'light' && isDarkMode) toggleDarkMode();
              if (v === 'dark' && !isDarkMode) toggleDarkMode();
            }}
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Currency Display</p>
          <p className="text-sm font-bold">{appPrefs.currencyDisplay}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Date Format</p>
          <p className="text-sm font-bold">{appPrefs.dateFormat}</p>
        </div>
      </InfoCard>
    </ProfileLayout>
  );
};

export const DocumentsScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { profileDocuments, addToast } = useBanking();
  const categories = [...new Set(profileDocuments.map((d) => d.category))];

  return (
    <ProfileLayout title="Document Center" onBack={onBack}>
      {categories.map((cat) => (
        <div key={cat} className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase px-1">{cat}</p>
          {profileDocuments.filter((d) => d.category === cat).map((doc) => (
            <InfoCard key={doc.id}>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-sm font-bold">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.date} • {doc.type}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => addToast({ type: 'success', title: 'Downloaded', message: doc.name })} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Download className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => addToast({ type: 'info', title: 'Share', message: 'Sharing document...' })} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </InfoCard>
          ))}
        </div>
      ))}
    </ProfileLayout>
  );
};

export const HelpSupportScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { addToast, setRetailTab } = useBanking();

  return (
    <ProfileLayout title="Help & Support" onBack={onBack}>
      <MenuGroup title="Support">
        <MenuItem icon={<HelpCircle className="w-4 h-4" />} label="FAQs" onClick={() => addToast({ type: 'info', title: 'FAQs', message: 'Opening frequently asked questions.' })} />
        <MenuItem icon={<Phone className="w-4 h-4" />} label="Contact Bank" description="1800-202-APEX" onClick={() => addToast({ type: 'info', title: 'Calling', message: 'Connecting to customer care...' })} />
        <MenuItem icon={<MessageCircle className="w-4 h-4" />} label="Chat Support" onClick={() => addToast({ type: 'info', title: 'Chat', message: 'Starting live chat session.' })} />
        <MenuItem icon={<Headphones className="w-4 h-4" />} label="Service Requests" onClick={() => onNavigate('service-requests')} />
        <MenuItem icon={<FileText className="w-4 h-4" />} label="Complaint / Grievance" onClick={() => addToast({ type: 'info', title: 'Grievance', message: 'Opening complaint form.' })} />
      </MenuGroup>
      <button
        type="button"
        onClick={() => setRetailTab('cards')}
        className="w-full p-4 rounded-2xl bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
      >
        <AlertOctagon className="w-5 h-5" /> Emergency Card Block
      </button>
    </ProfileLayout>
  );
};

export const ServiceRequestsScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { serviceRequests } = useBanking();

  return (
    <ProfileLayout title="Service Requests" onBack={onBack}>
      <div className="space-y-3 pb-24">
        {serviceRequests.map((req) => (
          <button
            key={req.id}
            type="button"
            onClick={() => onNavigate('service-request-details', { requestId: req.id })}
            className="w-full text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
          >
            <div className="flex justify-between">
              <p className="text-sm font-bold">{req.type}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 capitalize">{req.status.replace('_', ' ')}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{req.id} • {req.createdDate}</p>
          </button>
        ))}
      </div>
      <StickyCTA label="Raise Service Request" onClick={() => onNavigate('service-request-new')} />
    </ProfileLayout>
  );
};

const SERVICE_TYPES = ['Address Update', 'Account Issue', 'Card Issue', 'Transaction Dispute', 'Statement Request', 'KYC Issue'];

export const ServiceRequestNewScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const { addServiceRequest, addToast } = useBanking();

  return (
    <ProfileLayout title="New Service Request" onBack={onBack}>
      <InfoCard className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-500">Select Service</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-900"
          >
            <option value="">Choose...</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">Request Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
            placeholder="Describe your request..."
          />
        </div>
      </InfoCard>
      <StickyCTA
        label="Submit Request"
        disabled={!type || !details}
        onClick={() => {
          const id = addServiceRequest(type, details);
          addToast({ type: 'success', title: 'Request Created', message: `Reference: ${id}` });
          onNavigate('service-request-details', { requestId: id });
        }}
      />
    </ProfileLayout>
  );
};

export const ServiceRequestDetailsScreen: React.FC<ScreenProps> = ({ onBack, params }) => {
  const { serviceRequests } = useBanking();
  const req = serviceRequests.find((r) => r.id === params?.requestId);

  if (!req) return <ProfileLayout title="Request" onBack={onBack}><p className="text-sm text-slate-500">Request not found.</p></ProfileLayout>;

  return (
    <ProfileLayout title="Track Request" subtitle={req.id} onBack={onBack}>
      <InfoCard>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-semibold">{req.type}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Created</span><span>{req.createdDate}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-bold capitalize">{req.status.replace('_', ' ')}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Last Updated</span><span>{req.lastUpdated}</span></div>
        </div>
      </InfoCard>
      <InfoCard>
        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Timeline</p>
        <Timeline steps={req.timeline} />
      </InfoCard>
    </ProfileLayout>
  );
};

export const AccountManagementScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => (
  <ProfileLayout title="Account Management" onBack={onBack}>
    <MenuGroup title="Account Services">
      <MenuItem icon={<Shield className="w-4 h-4" />} label="Update KYC" onClick={() => onNavigate('kyc-update')} />
      <MenuItem icon={<Building2 className="w-4 h-4" />} label="Account Upgrade" description="Premium banking tiers" onClick={() => {}} />
      <MenuItem icon={<FileText className="w-4 h-4" />} label="Dormant Account Information" onClick={() => {}} />
      <MenuItem icon={<Phone className="w-4 h-4" />} label="Contact Information" onClick={() => onNavigate('contact-details')} />
      <MenuItem icon={<Settings className="w-4 h-4" />} label="Account Preferences" onClick={() => onNavigate('accounts-preferences')} />
      <MenuItem icon={<AlertOctagon className="w-4 h-4" />} label="Account Closure Request" danger onClick={() => onNavigate('account-closure')} />
    </MenuGroup>
  </ProfileLayout>
);

export const AccountClosureScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { accounts, getDefaultDebitAccount } = useBanking();
  const linked = accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType));
  const [selectedId, setSelectedId] = useState(linked[0]?.id || '');
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SuccessState
        title="Closure Request Submitted"
        message="Your account closure request has been received. Our team will contact you regarding outstanding obligations."
        actionLabel="Done"
        onAction={() => onNavigate('account-management')}
      />
    );
  }

  return (
    <>
      <ProfileLayout title="Close Account" onBack={onBack}>
        <InfoCard className="bg-amber-50 dark:bg-amber-950/30 border-amber-200">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold">Before you proceed</p>
          <ul className="text-xs text-amber-700 dark:text-amber-400 mt-2 space-y-1 list-disc pl-4">
            <li>Clear all outstanding balances and obligations</li>
            <li>Cancel linked cards and standing instructions</li>
            <li>Download statements for your records</li>
          </ul>
        </InfoCard>
        <p className="text-sm text-slate-500 px-1">Select account to close</p>
        <div className="space-y-2">
          {linked.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => setSelectedId(acc.id)}
              className={`w-full p-4 rounded-2xl border text-left ${selectedId === acc.id ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'}`}
            >
              <p className="text-sm font-bold">{acc.accountType} {acc.maskedNumber}</p>
              <p className="text-xs text-slate-500">Balance: ₹{acc.availableBalance.toLocaleString('en-IN')}</p>
            </button>
          ))}
        </div>
        <StickyCTA label="Submit Closure Request" variant="danger" onClick={() => setShowAuth(true)} />
      </ProfileLayout>
      <SecureAuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); setDone(true); }} title="Authenticate Closure Request" />
    </>
  );
};
